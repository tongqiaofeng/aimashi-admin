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
              style="width: 150px;"
              v-model="companyAddData.headCompanyName"
              placeholder="請輸入公司名稱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="currencyId">
            <el-select
              style="width: 150px;"
              v-model="companyAddData.currencyId"
              placeholder="請選擇幣種"
            >
              <el-option
                v-for="item in currencyIds"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
          border
          ref="companyListTable"
          :data="companyList"
          style="width: 100%"
          highlight-current-row
          @current-change="selCompanyChange"
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
              <el-form-item prop="currencyId" label="幣種：">
                <el-select
                  v-model="updateCompanyMsg.currencyId"
                  placeholder="請選擇"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in currencyIds"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer">
            <el-button
              v-preventClick
              @click="dialogUpdateCompanyVisible = false"
              >取 消</el-button
            >
            <el-button v-preventClick type="primary" @click="updateCompanySure"
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
            <el-button v-preventClick @click="dialogDelCompanyVisible = false"
              >取 消</el-button
            >
            <el-button v-preventClick type="primary" @click="delCompanySure"
              >確 定</el-button
            >
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="container-middle">
      <div class="title">
        公司列表
      </div>
      <div style="padding: 0 10px;text-align: right;">
        <el-form
          :model="branchCompanyAddData"
          inline
          style="text-align: right;"
        >
          <el-form-item prop="branchName">
            <el-input
              style="width: 150px;"
              v-model="branchCompanyAddData.branchName"
              placeholder="請輸入分公司名稱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="currencyId">
            <el-select
              style="width: 150px;"
              v-model="branchCompanyAddData.currencyId"
              placeholder="請選擇幣種"
            >
              <el-option
                v-for="item in currencyIds"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-preventClick @click="addBranchCompany"
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div style="padding: 20px 10px;">
        <el-table
          border
          ref="branchCompanyListTable"
          :data="branchCompanyList"
          style="width: 100%"
          highlight-current-row
          @current-change="selBranchCompany"
        >
          <el-table-column prop="branchName" label="名稱" align="center">
            <template slot-scope="scope">
              <div>
                <span
                  :style="{
                    'font-weight':
                      scope.row.id == selCompanyMsg.id ? 'bold' : 'normal'
                  }"
                >
                  {{ scope.row.branchName }}</span
                >
                <span>{{
                  scope.row.id == selCompanyMsg.id ? "(總公司)" : "(分公司)"
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div v-show="scope.row.id != selCompanyMsg.id">
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
              <el-form-item prop="currencyId" label="幣種：">
                <el-select
                  v-model="updateBranchCompanyMsg.currencyId"
                  placeholder="請選擇"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in currencyIds"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer">
            <el-button
              v-preventClick
              @click="dialogUpdateBranchCompanyVisible = false"
              >取 消</el-button
            >
            <el-button
              v-preventClick
              type="primary"
              @click="updateBranchCompanySure"
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
              >取 消</el-button
            >
            <el-button
              v-preventClick
              type="primary"
              @click="delBranchCompanySure"
              >確 定</el-button
            >
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="container-right">
      <el-collapse
        v-model="activePatchName"
        accordion
        @change="patchCollapseChange"
      >
        <el-collapse-item title="倉庫" name="1">
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
              border
              ref="filialeWarehouseTable"
              :data="filialeWarehouseList"
              style="width: 100%"
              highlight-current-row
            >
              <el-table-column prop="warehouseName" label="名稱" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center" :key="1">
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
        </el-collapse-item>
        <el-collapse-item title="公司管理員" name="2">
          <div style="text-align: right;">
            <el-form :model="companyAdministratorAddData" inline>
              <el-form-item prop="username">
                <el-input
                  style="width: 150px;"
                  v-model="companyAdministratorAddData.username"
                  placeholder="請輸入賬號名稱"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  style="width: 150px;"
                  v-model="companyAdministratorAddData.password"
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
              border
              ref="companyAdministratorTable"
              :data="companyAdminList"
              style="width: 100%"
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
        <el-collapse-item
          v-show="companyId == selCompanyMsg.id"
          title="普通管理賬號"
          name="3"
        >
          <div style="text-align: right;">
            <el-form :model="normalAdminListAddData" inline>
              <el-form-item prop="username">
                <el-input
                  style="width: 150px;"
                  v-model="normalAdminListAddData.username"
                  placeholder="請輸入賬號名稱"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  style="width: 150px;"
                  v-model="normalAdminListAddData.password"
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
              border
              ref="normalAdminTable"
              :data="normalAdminList"
              style="width: 100%"
            >
              <el-table-column prop="username" label="賬號名稱" align="center">
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
        </el-collapse-item>
      </el-collapse>
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
          >取 消</el-button
        >
        <el-button
          v-preventClick
          type="primary"
          @click="updateCompanyWarehouseSure"
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
          >取 消</el-button
        >
        <el-button
          v-preventClick
          type="primary"
          @click="delCompanyWarehouseSure"
          >確 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="修改賬號信息"
      :visible.sync="dialogUpdateAccountNumberVisible"
      width="500px"
    >
      <div>
        <el-form label-width="90px">
          <el-form-item prop="username" label="賬號名稱：">
            <el-input
              v-model="updateAccountNumberMsg.username"
              placeholder="請輸入賬號名稱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="賬號密碼：">
            <el-input
              v-model="updateAccountNumberMsg.password"
              placeholder="請輸入賬號密碼"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          v-preventClick
          @click="dialogUpdateAccountNumberVisible = false"
          >取 消</el-button
        >
        <el-button v-preventClick type="primary" @click="updateAccountNumber"
          >確 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="刪除賬號信息"
      :visible.sync="dialogDelAccountNumberVisible"
      width="500px"
    >
      <div style="text-align: center;font-size: 16px;">
        確定刪除該賬號信息？刪除後不能恢復
      </div>
      <div slot="footer">
        <el-button v-preventClick @click="dialogDelAccountNumberVisible = false"
          >取 消</el-button
        >
        <el-button v-preventClick type="primary" @click="delAccountNumberSure"
          >確 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="绑定仓库"
      :visible.sync="dialogNormalWarehouseAdminVisible"
      width="500px"
    >
      <div>
        <el-form label-width="85px">
          <el-form-item label="倉庫選擇：">
            <el-select
              multiple
              v-model="normalWarehouseList"
              placeholder="可多選"
              style="width: 100%;"
            >
              <el-option
                v-for="item in allWarehouseList"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          v-preventClick
          @click="dialogNormalWarehouseAdminVisible = false"
          >取 消</el-button
        >
        <el-button v-preventClick type="primary" @click="warehouseBindingSure"
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
        headCompanyName: "",
        currencyId: null
      },
      selCompanyMsg: {},
      dialogUpdateCompanyVisible: false,
      updateCompanyMsg: {},
      dialogDelCompanyVisible: false,
      delCompanyId: null,

      branchCompanyList: [], // 分公司列表
      branchCompanyAddData: {
        branchName: "",
        currencyId: null
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
        password: ""
      },
      dialogUpdateAccountNumberVisible: false,
      updateAccountNumberMsg: {},
      dialogDelAccountNumberVisible: false,
      delAccountNumberId: null,
      isNormalAdmin: false,

      companyId: null,
      filialeWarehouseList: [],
      filialeWarehouseAddData: {
        name: ""
      },
      normalAdminList: [],
      normalAdminListAddData: {
        username: "",
        password: ""
      },
      normalAdminId: null,
      dialogNormalWarehouseAdminVisible: false,
      allWarehouseList: [],
      normalWarehouseList: [],

      activePatchName: "1",
      activePatchNameSel: "1",
      currencyIds: [
        {
          value: 1,
          label: "CNY人民币"
        },
        {
          value: 2,
          label: "HKD港币"
        },
        {
          value: 3,
          label: "USD美元"
        },
        {
          value: 4,
          label: "EUR欧元"
        },
        {
          value: 5,
          label: "GBP英镑"
        },
        {
          value: 6,
          label: "AUD澳元"
        }
      ],

      middleSel: {},
      middleSureSel: {}
    };
  },
  async mounted() {
    await this.getAllData();
    this.tableSelSureValue(0);
  },
  methods: {
    // 添加總公司信息
    addCompany() {
      if (
        this.companyAddData.headCompanyName == "" ||
        this.companyAddData.currencyId == "" ||
        this.companyAddData.currencyId == null
      ) {
        this.$message.error({
          message: "請輸入公司名稱/選擇幣種"
        });
      } else {
        this.$axios
          .post(this.$store.state.baseCompanyUrl + "/company/companySave", {
            companyName: this.companyAddData.headCompanyName,
            currencyId: this.companyAddData.currencyId
          })
          .then(async res => {
            console.log("添加總公司");
            console.log(res);
            this.$message.success({
              message: "添加成功",
              showClose: true,
              duration: 2000
            });
            this.companyAddData.headCompanyName = "";
            this.companyAddData.currencyId = null;
            await this.getAllData();
            this.tableSelSureValue(0);
          })
          .catch(err => {
            console.log(err);
            this.$message.error({
              message: err.data.status,
              showClose: true,
              duration: 2000
            });
          });
      }
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
          companyName: this.updateCompanyMsg.headCompanyName,
          currencyId: this.updateCompanyMsg.currencyId
        })
        .then(res => {
          console.log("修改總公司");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000
          });
          this.tableSelValue();
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
        .then(async res => {
          console.log("刪除總公司");
          console.log(res);
          this.$message.success({
            message: "刪除成功",
            showClose: true,
            duration: 2000
          });
          await this.getAllData();
          this.tableSelSureValue(0);
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
    selCompanyChange(row) {
      console.log("總公司");
      console.log(row);

      if (row != null) {
        this.selCompanyMsg = row;
        this.branchCompanyList = [
          {
            id: this.selCompanyMsg.id,
            branchName: this.selCompanyMsg.headCompanyName,
            warehouseList: this.selCompanyMsg.warehouseList,
            companyAdminList: this.selCompanyMsg.companyAdminList
          }
        ];

        this.branchCompanyList = this.branchCompanyList.concat(
          row.branchCompanyList
        );
        this.$refs.branchCompanyListTable.setCurrentRow(
          this.branchCompanyList[0]
        );
        if (this.branchCompanyList.length > 0) {
          this.filialeWarehouseList = this.branchCompanyList[0].warehouseList;
        } else {
          this.filialeWarehouseList = [];
        }
        this.normalAdminList = this.selCompanyMsg.normalAdminList;
        this.allWarehouseList = this.selCompanyMsg.allWarehouseList;
      }
    },

    // 添加分公司信息
    addBranchCompany() {
      if (
        this.branchCompanyAddData.branchName == "" ||
        this.branchCompanyAddData.currencyId == "" ||
        this.branchCompanyAddData.currencyId == null
      ) {
        this.$message.error({
          message: "請輸入公司名稱/選擇幣種"
        });
      } else {
        this.$axios
          .post(this.$store.state.baseCompanyUrl + "/company/companySave", {
            parentId: this.selCompanyMsg.id,
            companyName: this.branchCompanyAddData.branchName,
            currencyId: this.branchCompanyAddData.currencyId
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
            this.branchCompanyAddData.currencyId = null;
            this.tableSelValue();
          })
          .catch(err => {
            console.log(err);
            this.$message.error({
              message: err.data.status,
              showClose: true,
              duration: 2000
            });
          });
      }
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
          parentId: this.selCompanyMsg.id,
          currencyId: this.updateBranchCompanyMsg.currencyId
        })
        .then(res => {
          console.log("修改分公司");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000
          });
          this.tableSelValue();
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
          this.tableSelValue();
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
    selBranchCompany(row, old) {
      console.log("分公司改變");
      console.log(row);
      console.log(old);
      this.middleSel = row;
      console.log(this.middleSel.id, this.middleSureSel.id);

      if (this.middleSel.id != this.middleSureSel.id) {
        this.activePatchName = "1";
      } else {
        this.activePatchName = this.activePatchNameSel;
      }

      if (row != null) {
        this.companyId = row.id;
        this.filialeWarehouseList = row.warehouseList;
        this.companyAdminList = row.companyAdminList;
      }
    },

    // 添加倉庫信息
    addWarehouse(id, name) {
      console.log(name);
      if (!name) {
        this.$message.error({
          message: "請輸入倉庫名稱"
        });
      } else {
        this.$axios
          .post(
            this.$store.state.baseCompanyUrl +
              "/warehouse/companyWarehouseSave",
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
            this.middleSureSel = this.middleSel;
            this.tableSelValue();
          })
          .catch(err => {
            console.log(err);
            this.$message.error({
              message: err.data.status,
              showClose: true,
              duration: 2000
            });
          });
      }
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
          this.dialogUpdateCompanyWarehouseVisible = false;
          this.middleSureSel = this.middleSel;
          this.tableSelValue();
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
          this.dialogDelCompanyWarehouseVisible = false;
          this.middleSureSel = this.middleSel;
          this.tableSelValue();
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

    // 確定修改
    updateCompanyWarehouseSure() {
      this.updateWarehouse(
        this.updateWarehouseMsg.id,
        this.companyId,
        this.updateWarehouseMsg.warehouseName
      );
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

    // 添加管理員賬號
    addAdmin(companyId, password, role, username) {
      if (username == "" || password == "") {
        this.$message.error({
          message: "用戶名/密碼不能為空"
        });
      } else {
        this.$axios
          .post(this.$store.state.baseCompanyUrl + "/company/adminMsgSave", {
            companyId: companyId,
            password: password,
            role: role,
            username: username
          })
          .then(res => {
            console.log("添加管理賬號");
            console.log(res);
            this.$message.success({
              message: "添加成功",
              showClose: true,
              duration: 2000
            });
            this.companyAdministratorAddData.username = "";
            this.companyAdministratorAddData.password = "";
            this.normalAdminListAddData.username = "";
            this.normalAdminListAddData.password = "";
            this.middleSureSel = this.middleSel;
            this.tableSelValue();
          })
          .catch(err => {
            console.log(err);
            this.$message.error({
              message: err.data.status,
              showClose: true,
              duration: 2000
            });
          });
      }
    },
    // 修改管理員賬號
    updateAccountNumber() {
      if (this.isNormalAdmin == false) {
        this.updateAccountNumberSure(
          this.updateAccountNumberMsg.id,
          this.companyId,
          this.updateAccountNumberMsg.password,
          "admin",
          this.updateAccountNumberMsg.username
        );
      } else {
        this.updateAccountNumberSure(
          this.updateAccountNumberMsg.id,
          this.selCompanyMsg.id,
          this.updateAccountNumberMsg.password,
          "normal_admin",
          this.updateAccountNumberMsg.username
        );
      }
    },
    // 確定修改
    updateAccountNumberSure(id, companyId, password, role, username) {
      this.$axios
        .post(this.$store.state.baseCompanyUrl + "/company/adminMsgSave", {
          id: id,
          companyId: companyId,
          password: password,
          role: role,
          username: username
        })
        .then(res => {
          console.log("修改管理賬號");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000
          });
          this.dialogUpdateAccountNumberVisible = false;
          this.middleSureSel = this.middleSel;
          this.middleSureSel = this.middleSel;
          this.tableSelValue();
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
    // 刪除管理員賬號
    delAccountNumberSure() {
      this.$axios
        .delete(
          this.$store.state.baseCompanyUrl +
            "/company/adminDel?id=" +
            this.delAccountNumberId
        )
        .then(res => {
          console.log("刪除賬號");
          console.log(res);
          this.$message.success({
            message: "刪除成功",
            showClose: true,
            duration: 2000
          });
          this.dialogDelAccountNumberVisible = false;
          this.middleSureSel = this.middleSel;
          this.tableSelValue();
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
    // 添加公司管理員賬號
    addCompanyAdministrator() {
      this.addAdmin(
        this.companyId,
        this.companyAdministratorAddData.password,
        "admin",
        this.companyAdministratorAddData.username
      );
    },
    // 修改公司管理員賬號信息
    updateCompanyAdministrator(row) {
      console.log(row);
      this.updateAccountNumberMsg = JSON.parse(JSON.stringify(row));
      this.isNormalAdmin = false;
      this.dialogUpdateAccountNumberVisible = true;
    },
    // 刪除公司管理員賬號
    delCompanyAdministrator(row) {
      console.log(row);
      this.delAccountNumberId = row.id;
      this.dialogDelAccountNumberVisible = true;
    },

    // 添加總分公司下倉庫信息
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
    addNormalAdmin() {
      this.addAdmin(
        this.selCompanyMsg.id,
        this.normalAdminListAddData.password,
        "normal_admin",
        this.normalAdminListAddData.username
      );
    },
    // 修改普通管理員賬號信息
    updateNormalAdmin(row) {
      console.log(row);
      this.updateAccountNumberMsg = JSON.parse(JSON.stringify(row));
      this.isNormalAdmin = true;
      this.dialogUpdateAccountNumberVisible = true;
    },
    // 刪除普通管理員賬號
    delNormalAdmin(row) {
      console.log(row);
      this.delAccountNumberId = row.id;
      this.dialogDelAccountNumberVisible = true;
    },
    // 普通賬號其下管理仓库
    warehouseBinding(row) {
      console.log(row);
      this.normalAdminId = row.id;
      this.normalWarehouseList = row.warehouseList.map(item => item.id);
      console.log("普通管理倉庫");
      console.log(this.normalWarehouseList);
      this.dialogNormalWarehouseAdminVisible = true;
    },
    // 綁定倉庫的管理
    warehouseBindingSure() {
      console.log(this.normalWarehouseList);
      this.$axios
        .post(
          this.$store.state.baseCompanyUrl + "/warehouse/normalWarehouseSave",
          {
            id: this.normalAdminId,
            warehouseIdList: this.normalWarehouseList
          }
        )
        .then(res => {
          console.log("修改普通賬戶管理倉庫");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000
          });
          this.dialogNormalWarehouseAdminVisible = false;
          this.tableSelValue();
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

    // 折疊面板切換
    patchCollapseChange(val) {
      console.log("-------", val);
      this.activePatchNameSel = val;
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
    async tableSelValue() {
      await this.getAllData();
      console.log("右邊", this.activePatchNameSel);
      this.activePatchName = this.activePatchNameSel;

      if (this.companyList.length > 0) {
        for (const index in this.companyList) {
          if (this.companyList[index].id == this.selCompanyMsg.id) {
            this.tableSelSureValue(index);
          }
        }
      }
    },
    tableSelSureValue(index) {
      console.log(index);
      if (this.companyList.length > 0) {
        this.$refs.companyListTable.setCurrentRow(this.companyList[index]);

        this.branchCompanyList = [
          {
            id: this.companyList[index].id,
            branchName: this.companyList[index].headCompanyName,
            warehouseList: this.companyList[index].warehouseList,
            companyAdminList: this.companyList[index].companyAdminList
          }
        ];

        this.branchCompanyList = this.branchCompanyList.concat(
          this.companyList[index].branchCompanyList
        );

        this.$refs.branchCompanyListTable.setCurrentRow(
          this.branchCompanyList[0]
        );

        if (this.branchCompanyList.length > 0) {
          this.filialeWarehouseList = this.branchCompanyList[0].warehouseList;
          for (const i in this.branchCompanyList) {
            if (this.branchCompanyList[i].id == this.middleSureSel.id) {
              console.log("yyyyyyyyyyyyyyyy");
              this.$refs.branchCompanyListTable.setCurrentRow(
                this.branchCompanyList[i]
              );
              this.filialeWarehouseList = this.branchCompanyList[
                i
              ].warehouseList;
            }
          }
        } else {
          this.filialeWarehouseList = [];
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.system-admin-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
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
      padding: 0 20px 20px;
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
