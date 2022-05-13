<template>
  <div class="system-admin-container">
    <!-- <h3>公司管理员公司管理</h3> -->
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
              v-model="branchCompanyAddData.branchName"
              placeholder="請輸入分公司名稱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="currencyId">
            <el-select
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
        <el-collapse-item title="部門" name="2">
          <div>
            <el-form
              :model="companyDepartmentAddData"
              inline
              style="text-align: right;"
            >
              <el-form-item prop="deptName">
                <el-input
                  v-model="companyDepartmentAddData.deptName"
                  placeholder="請輸入部門名稱"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  v-preventClick
                  @click="addCompanyDepartment"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
            <el-table
              border
              ref="departmentListTable"
              :data="departmentList"
              style="width: 100%"
            >
              <el-table-column prop="deptName" label="名稱" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-preventClick
                      type="text"
                      @click="updateCompanyDepartment(scope.row)"
                      >修改</el-button
                    >
                    <el-button
                      type="text"
                      v-preventClick
                      @click="delCompanyDepartment(scope.row)"
                      >刪除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="職位" name="5">
          <div>
            <el-form
              :model="companyPostAddData"
              inline
              style="text-align: right;"
            >
              <el-form-item prop="title">
                <el-input
                  v-model="companyPostAddData.title"
                  placeholder="請輸入職位名稱"
                ></el-input>
              </el-form-item>
              <el-form-item prop="deptId">
                <el-select
                  v-model="companyPostAddData.deptId"
                  placeholder="請選擇所屬部門"
                >
                  <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.deptName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-preventClick @click="addCompanyPost"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
            <el-table
              border
              ref="titleListTable"
              :data="titleList"
              style="width: 100%"
            >
              <el-table-column prop="title" label="職位名稱" align="center">
              </el-table-column>
              <el-table-column prop="deptName" label="所屬部門" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-preventClick
                      type="text"
                      @click="updateCompanyPost(scope.row)"
                      >修改</el-button
                    >
                    <el-button
                      type="text"
                      v-preventClick
                      @click="delCompanyPost(scope.row)"
                      >刪除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="公司管理員" name="4">
          <div style="text-align: right;">
            <el-form :model="companyAdministratorAddData" inline>
              <el-form-item prop="username">
                <el-input
                  v-model="companyAdministratorAddData.username"
                  placeholder="請輸入賬號名稱"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
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
                  v-model="normalAdminListAddData.username"
                  placeholder="請輸入賬號名稱"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
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
      title="修改部門信息"
      :visible.sync="dialogUpdateCompanyDepartmentVisible"
      width="500px"
    >
      <div>
        <el-form label-width="90px">
          <el-form-item prop="deptName" label="部門名稱：">
            <el-input
              v-model="updateCompanyDepartmentMsg.deptName"
              placeholder="請輸入部門名稱"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          v-preventClick
          @click="dialogUpdateCompanyDepartmentVisible = false"
          >取 消</el-button
        >
        <el-button
          v-preventClick
          type="primary"
          @click="updateCompanyDepartmentSure"
          >確 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="刪除部門信息"
      :visible.sync="dialogDelCompanyDepartmentVisible"
      width="500px"
    >
      <div style="text-align: center;font-size: 16px;">
        確定刪除該部門信息？刪除後不能恢復
      </div>
      <div slot="footer">
        <el-button
          v-preventClick
          @click="dialogDelCompanyDepartmentVisible = false"
          >取 消</el-button
        >
        <el-button
          v-preventClick
          type="primary"
          @click="delCompanyDepartmentSure"
          >確 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="修改職位信息"
      :visible.sync="dialogUpdateCompanyPostVisible"
      width="500px"
    >
      <div>
        <el-form label-width="90px">
          <el-form-item prop="title" label="職位名稱：">
            <el-input
              v-model="updateCompanyPostMsg.title"
              placeholder="請輸入職位名稱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="deptId" label="所屬部門：">
            <el-select
              style="width: 100%;"
              v-model="updateCompanyPostMsg.deptId"
              placeholder="請選擇所屬部門"
            >
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.deptName"
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
          @click="dialogUpdateCompanyPostVisible = false"
          >取 消</el-button
        >
        <el-button v-preventClick type="primary" @click="updateCompanyPostSure"
          >確 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="刪除職位信息"
      :visible.sync="dialogDelCompanyPostVisible"
      width="500px"
    >
      <div style="text-align: center;font-size: 16px;">
        確定刪除該職位信息？刪除後不能恢復
      </div>
      <div slot="footer">
        <el-button v-preventClick @click="dialogDelCompanyPostVisible = false"
          >取 消</el-button
        >
        <el-button v-preventClick type="primary" @click="delCompanyPostSure"
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
      selCompanyMsg: {},

      branchCompanyList: [], // 分公司列表
      branchCompanyAddData: {
        branchName: ""
      },
      dialogUpdateBranchCompanyVisible: false,
      updateBranchCompanyMsg: {},
      dialogDelBranchCompanyVisible: false,
      delBranchCompanyId: null,

      departmentList: [],
      companyDepartmentAddData: {
        deptName: ""
      },
      dialogUpdateCompanyDepartmentVisible: false,
      updateCompanyDepartmentMsg: {},
      dialogDelCompanyDepartmentVisible: false,
      delCompanyDepartmentId: null,

      titleList: [],
      companyPostAddData: {
        title: "",
        deptId: null
      },
      dialogUpdateCompanyPostVisible: false,
      updateCompanyPostMsg: {},
      dialogDelCompanyPostVisible: false,
      delCompanyPostId: null,

      dialogUpdateCompanyWarehouseVisible: false,
      updateWarehouseMsg: {},
      dialogDelCompanyWarehouseVisible: false,
      delCompanyWarehouseId: null,

      dialogUpdateAccountNumberVisible: false,
      updateAccountNumberMsg: {},
      dialogDelAccountNumberVisible: false,
      delAccountNumberId: null,
      isNormalAdmin: false,

      companyAdminList: [],
      companyAdministratorAddData: {
        username: "",
        password: ""
      },

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
      ]
    };
  },
  async mounted() {
    await this.getAllData();
    this.normalAdminList = this.selCompanyMsg.normalAdminList;
    this.allWarehouseList = this.selCompanyMsg.allWarehouseList;

    this.branchCompanyList = [
      {
        id: this.selCompanyMsg.id,
        branchName: this.selCompanyMsg.headCompanyName,
        deptList: this.selCompanyMsg.deptList,
        warehouseList: this.selCompanyMsg.warehouseList,
        titleList: this.selCompanyMsg.titleList,
        companyAdminList: this.selCompanyMsg.companyAdminList
      }
    ];
    this.branchCompanyList = this.branchCompanyList.concat(
      this.selCompanyMsg.branchCompanyList
    );

    if (this.branchCompanyList.length > 0) {
      this.$refs.branchCompanyListTable.setCurrentRow(
        this.branchCompanyList[0]
      );
      this.filialeWarehouseList = this.branchCompanyList[0].warehouseList;
    } else {
      this.filialeWarehouseList = [];
    }
  },
  methods: {
    // 確定添加部門
    addDepartment(companyId) {
      if (this.companyDepartmentAddData.deptName == "") {
        this.$message.error({
          message: "請輸入部門名稱"
        });
      } else {
        this.$axios
          .post(
            this.$store.state.baseCompanyUrl + "/personnel/companyDeptSave",
            {
              companyId: companyId,
              deptName: this.companyDepartmentAddData.deptName
            }
          )
          .then(res => {
            console.log("添加部门");
            console.log(res);
            this.$message.success({
              message: "添加成功",
              showClose: true,
              duration: 2000
            });
            this.companyDepartmentAddData.deptName = "";
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
    // 確定修改部門
    updateDepartment(companyId) {
      this.$axios
        .post(this.$store.state.baseCompanyUrl + "/personnel/companyDeptSave", {
          id: this.updateCompanyDepartmentMsg.id,
          companyId: companyId,
          deptName: this.updateCompanyDepartmentMsg.deptName
        })
        .then(res => {
          console.log("修改部门");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000
          });
          this.dialogUpdateCompanyDepartmentVisible = false;
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
    // 確定刪除部門
    delCompanyDepartmentSure() {
      this.$axios
        .delete(
          this.$store.state.baseCompanyUrl +
            "/personnel/companyDeptDel?id=" +
            this.delCompanyDepartmentId
        )
        .then(res => {
          console.log("刪除部門");
          console.log(res);
          this.$message.success({
            message: "刪除成功",
            showClose: true,
            duration: 2000
          });
          this.tableSelValue();
          this.dialogDelCompanyDepartmentVisible = false;
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

    // 添加公司部門
    addCompanyDepartment() {
      this.addDepartment(this.companyId);
    },
    // 修改
    updateCompanyDepartment(row) {
      this.updateCompanyDepartmentMsg = JSON.parse(JSON.stringify(row));
      this.dialogUpdateCompanyDepartmentVisible = true;
    },
    // 確定修改
    updateCompanyDepartmentSure() {
      this.updateDepartment(this.companyId);
    },
    // 刪除
    delCompanyDepartment(row) {
      this.delCompanyDepartmentId = row.id;
      this.dialogDelCompanyDepartmentVisible = true;
    },

    // 添加公司職位
    addCompanyPost() {
      if (
        this.companyPostAddData.title == "" ||
        this.companyPostAddData.deptId == null
      ) {
        this.$message.error({
          message: "請輸入職位名稱/選擇所屬部門"
        });
      } else {
        this.$axios
          .post(
            this.$store.state.baseCompanyUrl +
              "/personnel/companyDeptTitleSave",
            {
              title: this.companyPostAddData.title,
              deptId: this.companyPostAddData.deptId
            }
          )
          .then(res => {
            console.log("添加職位");
            console.log(res);
            this.$message.success({
              message: "添加成功",
              showClose: true,
              duration: 2000
            });
            this.companyPostAddData.title = "";
            this.companyPostAddData.deptId = null;
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
    // 修改職位
    updateCompanyPost(row) {
      console.log(row);
      this.updateCompanyPostMsg = JSON.parse(JSON.stringify(row));

      this.dialogUpdateCompanyPostVisible = true;
    },
    // 確定修改
    updateCompanyPostSure() {
      console.log(this.updateCompanyPostMsg.deptId);
      this.$axios
        .post(
          this.$store.state.baseCompanyUrl + "/personnel/companyDeptTitleSave",
          {
            id: this.updateCompanyPostMsg.id,
            title: this.updateCompanyPostMsg.title,
            deptId: this.updateCompanyPostMsg.deptId
          }
        )
        .then(res => {
          console.log("修改職位");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000
          });

          this.tableSelValue();
          this.dialogUpdateCompanyPostVisible = false;
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
    // 刪除職位
    delCompanyPost(row) {
      this.delCompanyPostId = row.id;
      this.dialogDelCompanyPostVisible = true;
    },
    // 確定刪除
    delCompanyPostSure() {
      this.$axios
        .delete(
          this.$store.state.baseCompanyUrl +
            "/personnel/companyDeptTitleDel?id=" +
            this.delCompanyPostId
        )
        .then(res => {
          console.log("刪除職位");
          console.log(res);
          this.$message.success({
            message: "刪除成功",
            showClose: true,
            duration: 2000
          });
          this.tableSelValue();
          this.dialogDelCompanyPostVisible = false;
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
          this.companyId = this.selCompanyMsg.id;
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
      console.log("分公司", row);
      if (row != null && old != null) {
        if (row.id !== old.id) {
          this.activePatchName = "1";
        } else {
          this.activePatchName = this.activePatchNameSel;
        }
      }

      if (row != null) {
        this.companyId = row.id;
        this.filialeWarehouseList = row.warehouseList;
        this.titleList = row.titleList;
        this.departmentList = row.deptList;
        this.companyAdminList = row.companyAdminList;
      }
    },

    // 添加倉庫信息
    addWarehouse(id, name) {
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
            this.filialeWarehouseAddData.warehouseName = "";
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
          this.tableSelValue();
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
          this.tableSelValue();
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

    // 確定修改
    updateCompanyWarehouseSure() {
      this.updateWarehouse(
        this.updateWarehouseMsg.id,
        this.selCompanyMsg.id,
        this.updateWarehouseMsg.warehouseName
      );
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
            this.normalAdminListAddData.username = "";
            this.normalAdminListAddData.password = "";
            this.companyAdministratorAddData.username = "";
            this.companyAdministratorAddData.password = "";
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
      console.log(id, companyId, password, role, username);
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
          this.tableSelValue();
          this.dialogDelAccountNumberVisible = false;
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
      console.log(this.updateAccountNumberMsg);
      this.isNormalAdmin = false;
      this.dialogUpdateAccountNumberVisible = true;
    },
    // 刪除公司管理員賬號
    delCompanyAdministrator(row) {
      console.log(row);
      this.delAccountNumberId = row.id;
      this.dialogDelAccountNumberVisible = true;
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
          this.selCompanyMsg = res.data;
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

      this.normalAdminList = this.selCompanyMsg.normalAdminList;
      this.allWarehouseList = this.selCompanyMsg.allWarehouseList;

      this.branchCompanyList = [
        {
          id: this.selCompanyMsg.id,
          branchName: this.selCompanyMsg.headCompanyName,
          deptList: this.selCompanyMsg.deptList,
          warehouseList: this.selCompanyMsg.warehouseList,
          titleList: this.selCompanyMsg.titleList,
          companyAdminList: this.selCompanyMsg.companyAdminList
        }
      ];
      this.branchCompanyList = this.branchCompanyList.concat(
        this.selCompanyMsg.branchCompanyList
      );

      if (this.branchCompanyList.length > 0) {
        for (const index in this.branchCompanyList) {
          if (this.branchCompanyList[index].id == this.companyId) {
            this.$refs.branchCompanyListTable.setCurrentRow(
              this.branchCompanyList[index]
            );
            this.filialeWarehouseList = this.branchCompanyList[
              index
            ].warehouseList;
            return;
          }
        }
      } else {
        this.filialeWarehouseList = [];
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
  .container-middle,
  .container-right {
    width: 48%;
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
