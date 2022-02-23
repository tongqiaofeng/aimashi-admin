<template>
  <div class="system-admin-container">
    <!-- <h3>系统管理员公司管理</h3> -->
    <div class="container-left">
      <div class="title">
        公司
      </div>
      <div style="padding: 0 10px;text-align: right;">
        <el-form :model="companyAddData" inline>
          <el-form-item prop="headCompanyName">
            <el-input
              v-model="companyAddData.headCompanyName"
              placeholder="請輸入公司名稱"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-preventClick @click="addCompany"
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div style="padding: 20px 10px;">
        <el-table
          ref="companyListTable"
          :data="companyList"
          style="width: 100%"
          highlight-current-row
          @current-change="selCompany"
        >
          <el-table-column prop="headCompanyName" label="名稱" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button
                  type="text"
                  v-preventClick
                  @click="updateCompany(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="text"
                  v-preventClick
                  @click="delCompany(scope.row)"
                  >刪除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="修改公司信息"
          :visible.sync="dialogUpdateCompanyVisible"
          width="500px"
        >
          <div>
            <el-form label-width="90px">
              <el-form-item prop="headCompanyName" label="公司名稱：">
                <el-input
                  v-model="updateCompanyMsg.headCompanyName"
                  placeholder="請輸入公司名稱"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer">
            <el-button
              v-preventClick
              @click="dialogUpdateCompanyVisible = false"
              style="width:100px;color:#9695f3;margin-right:10px;"
              >取 消</el-button
            >
            <el-button
              v-preventClick
              type="primary"
              @click="updateCompanySure"
              class="sure-button"
              style="background:#9695f3;color:#fff;"
              >確 定</el-button
            >
          </div>
        </el-dialog>
        <el-dialog
          title="刪除公司信息"
          :visible.sync="dialogDelCompanyVisible"
          width="500px"
        >
          <div style="text-align: center;font-size: 16px;">
            確定刪除該公司信息？刪除後不能恢復
          </div>
          <div slot="footer">
            <el-button
              v-preventClick
              @click="dialogDelCompanyVisible = false"
              style="width:100px;color:#9695f3;margin-right:10px;"
              >取 消</el-button
            >
            <el-button
              v-preventClick
              type="primary"
              @click="delCompanySure"
              class="sure-button"
              style="background:#9695f3;color:#fff;"
              >確 定</el-button
            >
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="container-middle">
      <el-collapse v-model="activeName" accordion @change="collapseChange">
        <el-collapse-item title="分公司" name="1">
          <div>
            <el-form
              :model="branchCompanyAddData"
              inline
              style="text-align: right;"
            >
              <el-form-item prop="branchName">
                <el-input
                  v-model="branchCompanyAddData.branchName"
                  placeholder="請輸入分公司名稱"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  v-preventClick
                  @click="addBranchCompany"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
            <el-table
              ref="branchCompanyListTable"
              :data="branchCompanyList"
              style="width: 100%"
              highlight-current-row
              @current-change="selBranchCompany"
            >
              <el-table-column prop="branchName" label="名稱" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-preventClick
                      type="text"
                      @click="updateBranchCompany(scope.row)"
                      >修改</el-button
                    >
                    <el-button
                      type="text"
                      v-preventClick
                      @click="delBranchCompany(scope.row)"
                      >刪除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog
              title="修改分公司信息"
              :visible.sync="dialogUpdateBranchCompanyVisible"
              width="500px"
            >
              <div>
                <el-form label-width="90px">
                  <el-form-item prop="branchName" label="公司名稱：">
                    <el-input
                      v-model="updateBranchCompanyMsg.branchName"
                      placeholder="請輸入公司名稱"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div slot="footer">
                <el-button
                  v-preventClick
                  @click="dialogUpdateBranchCompanyVisible = false"
                  style="width:100px;color:#9695f3;margin-right:10px;"
                  >取 消</el-button
                >
                <el-button
                  v-preventClick
                  type="primary"
                  @click="updateBranchCompanySure"
                  class="sure-button"
                  style="background:#9695f3;color:#fff;"
                  >確 定</el-button
                >
              </div>
            </el-dialog>
            <el-dialog
              title="刪除分公司信息"
              :visible.sync="dialogDelBranchCompanyVisible"
              width="500px"
            >
              <div style="text-align: center;font-size: 16px;">
                確定刪除該公司信息？刪除後不能恢復
              </div>
              <div slot="footer">
                <el-button
                  v-preventClick
                  @click="dialogDelBranchCompanyVisible = false"
                  style="width:100px;color:#9695f3;margin-right:10px;"
                  >取 消</el-button
                >
                <el-button
                  v-preventClick
                  type="primary"
                  @click="delBranchCompanySure"
                  class="sure-button"
                  style="background:#9695f3;color:#fff;"
                  >確 定</el-button
                >
              </div>
            </el-dialog>
          </div>
        </el-collapse-item>
        <el-collapse-item title="倉庫" name="2">
          <div>
            <el-form
              :model="companyWarehouseAddData"
              inline
              style="text-align: right;"
            >
              <el-form-item prop="warehouseName">
                <el-input
                  v-model="companyWarehouseAddData.warehouseName"
                  placeholder="請輸入倉庫名稱"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  v-preventClick
                  @click="addCompanyWarehouse"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
            <el-table
              ref="companyWarehouseTable"
              :data="companyWarehouseList"
              style="width: 100%"
              highlight-current-row
            >
              <el-table-column prop="warehouseName" label="名稱" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-preventClick
                      type="text"
                      @click="updateCompanyWarehouse(scope.row)"
                      >修改</el-button
                    >
                    <el-button
                      v-preventClick
                      type="text"
                      @click="delCompanyWarehouse(scope.row)"
                      >刪除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="管理員賬號" name="3">
          <div>
            <el-form :model="companyAdministratorAddData" inline>
              <el-form-item prop="username">
                <el-input
                  v-model="companyAdministratorAddData.username"
                  placeholder="請輸入賬號名稱"
                ></el-input>
              </el-form-item>
              <el-form-item prop="psw">
                <el-input
                  v-model="companyAdministratorAddData.psw"
                  placeholder="請輸入賬號密碼"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  v-preventClick
                  @click="addCompanyAdministrator"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
            <el-table
              ref="companyAdministratorTable"
              :data="companyAdminList"
              style="width: 100%"
              highlight-current-row
              @current-change="selCompanyAdministrator"
            >
              <el-table-column prop="username" label="賬號名稱" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-preventClick
                      type="text"
                      @click="updateCompanyAdministrator(scope.row)"
                      >修改</el-button
                    >
                    <el-button
                      v-preventClick
                      type="text"
                      @click="delCompanyAdministrator(scope.row)"
                      >刪除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="container-right">
      <div v-if="activeName == 1">
        <div class="title">
          倉庫
        </div>
        <div>
          <el-form
            :model="filialeWarehouseAddData"
            inline
            style="text-align: right;"
          >
            <el-form-item prop="warehouseName">
              <el-input
                v-model="filialeWarehouseAddData.warehouseName"
                placeholder="請輸入倉庫名稱"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                v-preventClick
                @click="addfilialeWarehouse"
                >添加</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            ref="filialeWarehouseTable"
            :data="filialeWarehouseList"
            style="width: 100%"
            highlight-current-row
          >
            <el-table-column prop="warehouseName" label="名稱" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button
                    v-preventClick
                    type="text"
                    @click="updateFilialeWarehouse(scope.row)"
                    >修改</el-button
                  >
                  <el-button
                    type="text"
                    v-preventClick
                    @click="delFilialeWarehouse(scope.row)"
                    >刪除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="activeName == 3">
        <div class="title">
          普通管理賬號
        </div>
        <div>
          <el-form :model="normalAdminListAddData" inline>
            <el-form-item prop="name">
              <el-input
                v-model="normalAdminListAddData.name"
                placeholder="請輸入賬號名稱"
              ></el-input>
            </el-form-item>
            <el-form-item prop="psw">
              <el-input
                v-model="normalAdminListAddData.psw"
                placeholder="請輸入賬號密碼"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-preventClick @click="addNormalAdmin"
                >添加</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            ref="normalAdminTable"
            :data="normalAdminList"
            style="width: 100%"
          >
            <el-table-column prop="name" label="名稱" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="text"
                    v-preventClick
                    @click="updateNormalAdmin(scope.row)"
                    >修改</el-button
                  >
                  <el-button
                    type="text"
                    v-preventClick
                    @click="delNormalAdmin(scope.row)"
                    >刪除</el-button
                  >
                  <el-button
                    type="text"
                    v-preventClick
                    @click="warehouseBinding(scope.row)"
                    >倉庫綁定</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      title="修改倉庫信息"
      :visible.sync="dialogUpdateCompanyWarehouseVisible"
      width="500px"
    >
      <div>
        <el-form label-width="90px">
          <el-form-item prop="warehouseName" label="公司名稱：">
            <el-input
              v-model="updateWarehouseMsg.warehouseName"
              placeholder="請輸入公司名稱"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          v-preventClick
          @click="dialogUpdateCompanyWarehouseVisible = false"
          style="width:100px;color:#9695f3;margin-right:10px;"
          >取 消</el-button
        >
        <el-button
          v-preventClick
          type="primary"
          @click="updateCompanyWarehouseSure"
          class="sure-button"
          style="background:#9695f3;color:#fff;"
          >確 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="刪除倉庫信息"
      :visible.sync="dialogDelCompanyWarehouseVisible"
      width="500px"
    >
      <div style="text-align: center;font-size: 16px;">
        確定刪除該倉庫信息？刪除後不能恢復
      </div>
      <div slot="footer">
        <el-button
          v-preventClick
          @click="dialogDelCompanyWarehouseVisible = false"
          style="width:100px;color:#9695f3;margin-right:10px;"
          >取 消</el-button
        >
        <el-button
          v-preventClick
          type="primary"
          @click="delCompanyWarehouseSure"
          class="sure-button"
          style="background:#9695f3;color:#fff;"
          >確 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      companyList: [],
      companyAddData: {
        headCompanyName: ""
      },
      selCompanyMsg: {},
      dialogUpdateCompanyVisible: false,
      updateCompanyMsg: {},
      dialogDelCompanyVisible: false,
      delCompanyId: null,

      activeName: "1",
      branchCompanyList: [], // 分公司列表
      branchCompanyAddData: {
        branchName: ""
      },
      selBranchCompanyMsg: {},
      dialogUpdateBranchCompanyVisible: false,
      updateBranchCompanyMsg: {},
      dialogDelBranchCompanyVisible: false,
      delBranchCompanyId: null,

      companyWarehouseList: [],
      companyWarehouseAddData: {
        warehouseName: ""
      },
      dialogUpdateCompanyWarehouseVisible: false,
      updateWarehouseMsg: {},
      dialogDelCompanyWarehouseVisible: false,
      delCompanyWarehouseId: null,

      companyAdminList: [],
      companyAdministratorAddData: {
        username: "",
        psw: ""
      },
      companyId: null,
      filialeWarehouseList: [],
      filialeWarehouseAddData: {
        name: ""
      },
      normalAdminList: [],
      normalAdminListAddData: {
        username: "",
        psw: ""
      }
    };
  },
  mounted() {
    this.tableSelValue(0);
  },
  methods: {
    // 添加總公司信息
    addCompany() {
      this.$axios
        .post(this.$store.state.baseCompanyUrl + "/company/companySave", {
          companyName: this.companyAddData.headCompanyName
        })
        .then(res => {
          console.log("添加總公司");
          console.log(res);
          this.$message.success({
            message: "添加成功",
            showClose: true,
            duration: 2000
          });
          this.companyAddData.headCompanyName = "";
          this.tableSelValue(0);
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 修改總公司信息
    updateCompany(row) {
      console.log(row);
      this.updateCompanyMsg = JSON.parse(JSON.stringify(row));
      this.dialogUpdateCompanyVisible = true;
    },
    // 確定修改
    updateCompanySure() {
      this.$axios
        .post(this.$store.state.baseCompanyUrl + "/company/companySave", {
          id: this.updateCompanyMsg.id,
          companyName: this.updateCompanyMsg.headCompanyName
        })
        .then(res => {
          console.log("修改總公司");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000
          });
          this.tableSelValue(0);
          this.dialogUpdateCompanyVisible = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 刪除總公司
    delCompany(row) {
      console.log(row);
      this.delCompanyId = row.id;
      this.dialogDelCompanyVisible = true;
    },
    // 確定刪除
    delCompanySure() {
      this.$axios
        .delete(
          this.$store.state.baseCompanyUrl +
            "/company/companyDel?id=" +
            this.delCompanyId
        )
        .then(res => {
          console.log("刪除總公司");
          console.log(res);
          this.$message.success({
            message: "刪除成功",
            showClose: true,
            duration: 2000
          });
          this.tableSelValue(0);
          this.dialogDelCompanyVisible = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 選中某個總公司,查看其下管理倉庫、分公司、管理賬號等
    selCompany(row) {
      console.log(row);
      this.activeName = "1";
      if (row != null) {
        this.selCompanyMsg = row;
        this.branchCompanyList = row.branchCompanyList;
        this.$refs.branchCompanyListTable.setCurrentRow(
          this.branchCompanyList[0]
        );
        if (this.branchCompanyList.length > 0) {
          this.filialeWarehouseList = this.branchCompanyList[0].warehouseList;
        }

        this.companyWarehouseList = row.warehouseList;
        this.companyAdminList = row.companyAdminList;
      }
    },

    // 添加分公司信息
    addBranchCompany() {
      this.$axios
        .post(this.$store.state.baseCompanyUrl + "/company/companySave", {
          parentId: this.selCompanyMsg.id,
          companyName: this.branchCompanyAddData.branchName
        })
        .then(res => {
          console.log("添加分公司");
          console.log(res);
          this.$message.success({
            message: "添加成功",
            showClose: true,
            duration: 2000
          });
          this.branchCompanyAddData.branchName = "";
          this.tableSelValue(0);
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 修改分公司信息
    updateBranchCompany(row) {
      console.log(row);
      this.updateBranchCompanyMsg = JSON.parse(JSON.stringify(row));
      this.dialogUpdateBranchCompanyVisible = true;
    },
    // 確定修改
    updateBranchCompanySure() {
      this.$axios
        .post(this.$store.state.baseCompanyUrl + "/company/companySave", {
          id: this.updateBranchCompanyMsg.id,
          companyName: this.updateBranchCompanyMsg.branchName,
          parentId: this.selCompanyMsg.id
        })
        .then(res => {
          console.log("修改分公司");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000
          });
          this.tableSelValue(0);
          this.dialogUpdateBranchCompanyVisible = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 刪除分公司
    delBranchCompany(row) {
      console.log(row);
      this.delBranchCompanyId = row.id;
      this.dialogDelBranchCompanyVisible = true;
    },
    // 確定刪除
    delBranchCompanySure() {
      this.$axios
        .delete(
          this.$store.state.baseCompanyUrl +
            "/company/companyDel?id=" +
            this.delBranchCompanyId
        )
        .then(res => {
          console.log("刪除分公司");
          console.log(res);
          this.$message.success({
            message: "刪除成功",
            showClose: true,
            duration: 2000
          });
          this.tableSelValue(0);
          this.dialogDelBranchCompanyVisible = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 選中某個分公司,查看其下管理倉庫
    selBranchCompany(row) {
      console.log(row);
      if (row != null) {
        this.companyId = row.id;
        this.filialeWarehouseList = row.warehouseList;
      }
    },

    // 添加倉庫信息
    addWarehouse(id, name) {
      this.$axios
        .post(
          this.$store.state.baseCompanyUrl + "/warehouse/companyWarehouseSave",
          {
            companyId: id,
            warehouseName: name
          }
        )
        .then(res => {
          console.log("添加總公司倉庫");
          console.log(res);
          this.$message.success({
            message: "添加成功",
            showClose: true,
            duration: 2000
          });
          this.companyWarehouseAddData.warehouseName = "";
          this.filialeWarehouseAddData.warehouseName = "";
          this.tableSelValue(0);
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 修改倉庫信息
    updateWarehouse(id, companyId, name) {
      this.$axios
        .post(
          this.$store.state.baseCompanyUrl + "/warehouse/companyWarehouseSave",
          {
            id: id,
            companyId: companyId,
            warehouseName: name
          }
        )
        .then(res => {
          console.log("修改總公司倉庫");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000
          });
          this.tableSelValue(0);
          this.dialogUpdateCompanyWarehouseVisible = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 刪除倉庫
    delWarehouse(id) {
      this.$axios
        .delete(
          this.$store.state.baseCompanyUrl + "/warehouse/warehouseDel?id=" + id
        )
        .then(res => {
          console.log("刪除倉庫");
          console.log(res);
          this.$message.success({
            message: "刪除成功",
            showClose: true,
            duration: 2000
          });
          this.tableSelValue(0);
          this.dialogDelCompanyWarehouseVisible = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },

    // 添加總公司下倉庫信息
    addCompanyWarehouse() {
      this.addWarehouse(
        this.selCompanyMsg.id,
        this.companyWarehouseAddData.warehouseName
      );
    },
    // 修改總公司下倉庫信息
    updateCompanyWarehouse(row) {
      console.log(row);
      this.updateWarehouseMsg = JSON.parse(JSON.stringify(row));
      this.dialogUpdateCompanyWarehouseVisible = true;
    },
    // 確定修改
    updateCompanyWarehouseSure() {
      if (this.activeName == "1") {
        this.updateWarehouse(
          this.updateWarehouseMsg.id,
          this.selCompanyMsg.id,
          this.updateWarehouseMsg.warehouseName
        );
      } else if (this.activeName == "2") {
        this.updateWarehouse(
          this.updateWarehouseMsg.id,
          this.companyId,
          this.updateWarehouseMsg.warehouseName
        );
      }
    },
    // 刪除總公司下倉庫
    delCompanyWarehouse(row) {
      console.log(row);
      this.delCompanyWarehouseId = row.id;
      this.dialogDelCompanyWarehouseVisible = true;
    },
    // 確定刪除
    delCompanyWarehouseSure() {
      this.delWarehouse(this.delCompanyWarehouseId);
    },

    // 添加公司管理員賬號
    addCompanyAdministrator() {},
    // 修改公司管理員賬號信息
    updateCompanyAdministrator(row) {
      console.log(row);
    },
    // 刪除公司管理員賬號
    delCompanyAdministrator(row) {
      console.log(row);
    },
    // 選中某個公司賬號,查看其下普通管理賬號等
    selCompanyAdministrator(row) {
      console.log(row);
    },

    // 添加分公司下倉庫信息
    addfilialeWarehouse() {
      this.addWarehouse(
        this.companyId,
        this.filialeWarehouseAddData.warehouseName
      );
    },
    // 修改分公司下倉庫信息
    updateFilialeWarehouse(row) {
      console.log(row);
      this.updateWarehouseMsg = JSON.parse(JSON.stringify(row));
      this.dialogUpdateCompanyWarehouseVisible = true;
    },
    // 刪除分公司下倉庫
    delFilialeWarehouse(row) {
      console.log(row);
      this.delCompanyWarehouseId = row.id;
      this.dialogDelCompanyWarehouseVisible = true;
    },

    // 添加普通管理員賬號
    addNormalAdmin() {},
    // 修改普通管理員賬號信息
    updateNormalAdmin(row) {
      console.log(row);
    },
    // 刪除普通管理員賬號
    delNormalAdmin(row) {
      console.log(row);
    },
    // 普通賬號其下管理仓库
    warehouseBinding(row) {
      console.log(row);
    },

    // 折疊面板切換
    collapseChange(val) {
      console.log(val);
      if (val == 1) {
        this.$refs.branchCompanyListTable.setCurrentRow(
          this.branchCompanyList[0]
        );
        this.filialeWarehouseList = this.branchCompanyList[0].warehouseList;
      } else if (val == 3) {
        this.$refs.companyAdministratorTable.setCurrentRow(
          this.companyAdminList[0]
        );
        this.normalAdminList = this.companyList[0].normalAdminList;
      }
    },
    // 獲取所有數據
    async getAllData() {
      await this.$axios
        .get(this.$store.state.baseCompanyUrl + "/company/companyMsgGet")
        .then(res => {
          console.log("公司管理數據");
          console.log(res);
          this.companyList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // table選中
    async tableSelValue(index) {
      await this.getAllData();
      console.log(index);
      if (this.companyList.length > 0) {
        this.$refs.companyListTable.setCurrentRow(this.companyList[index]);
        this.branchCompanyList = this.companyList[index].branchCompanyList;
        this.$refs.branchCompanyListTable.setCurrentRow(
          this.branchCompanyList[index]
        );
        this.filialeWarehouseList = this.branchCompanyList[index].warehouseList;
        this.companyWarehouseList = this.companyList[index].warehouseList;
        this.companyAdminList = this.companyList[index].companyAdminList;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.system-admin-container {
  margin: 40px 10px 0;
  display: flex;
  justify-content: space-between;

  .container-left,
  .container-middle,
  .container-right {
    width: 32%;
    min-height: 80vh;
    background-color: #fff;
    border-radius: 5px;

    .title {
      padding: 20px;
      font-size: 20px;
      font-weight: bold;
    }
  }

  .container-middle {
    padding-top: 10px;
  }
}
</style>
<style lang="scss">
.el-collapse-item__header.is-active {
  font-size: 20px;
  font-weight: bold;
}

.el-collapse {
  border-top: 0 solid #ebeef5;
  border-bottom: 0 solid #ebeef5;
}
</style>
