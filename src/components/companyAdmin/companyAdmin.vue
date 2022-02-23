<template>
  <div class="system-admin-container">
    <!-- <h3>公司管理员公司管理</h3> -->
    <div class="container-middle">
      <el-collapse v-model="activeName" accordion @change="collapseChange">
        <el-collapse-item title="分公司" name="1">
          <div>
            <el-form :model="filialeAddData" inline style="text-align: right;">
              <el-form-item prop="name">
                <el-input
                  v-model="filialeAddData.name"
                  placeholder="請輸入分公司名稱"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addFiliale">添加</el-button>
              </el-form-item>
            </el-form>
            <el-table
              ref="filialeListTable"
              :data="filialeList"
              style="width: 100%"
              highlight-current-row
              @current-change="selFiliale"
            >
              <el-table-column prop="name" label="名稱" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="updateFiliale(scope.row)"
                      >修改</el-button
                    >
                    <el-button type="text" @click="delFiliale(scope.row)"
                      >刪除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="倉庫" name="2">
          <div>
            <el-form
              :model="companyWarehouseAddData"
              inline
              style="text-align: right;"
            >
              <el-form-item prop="name">
                <el-input
                  v-model="companyWarehouseAddData.name"
                  placeholder="請輸入倉庫名稱"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addCompanyWarehouse"
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
              <el-table-column prop="name" label="名稱" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      type="text"
                      @click="updateCompanyWarehouse(scope.row)"
                      >修改</el-button
                    >
                    <el-button
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
        <el-collapse-item title="普通管理賬號" name="3">
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
                <el-button type="primary" @click="addNormalAdmin"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
            <el-table
              ref="normalAdminTable"
              :data="normalAdminList"
              style="width: 100%"
              highlight-current-row
              @current-change="selNormalAdmin"
            >
              <el-table-column prop="name" label="名稱" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="updateNormalAdmin(scope.row)"
                      >修改</el-button
                    >
                    <el-button type="text" @click="delNormalAdmin(scope.row)"
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
      <div v-if="activeName == 1 || activeName == 3">
        <div class="title">
          倉庫
        </div>
        <div>
          <el-form
            :model="filialeWarehouseAddData"
            inline
            style="text-align: right;"
          >
            <el-form-item prop="name">
              <el-input
                v-model="filialeWarehouseAddData.name"
                placeholder="請輸入倉庫名稱"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addfilialeWarehouse"
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
            <el-table-column prop="name" label="名稱" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="text"
                    @click="updateFilialeWarehouse(scope.row)"
                    >修改</el-button
                  >
                  <el-button type="text" @click="delFilialeWarehouse(scope.row)"
                    >刪除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "1",
      filialeList: [], // 分公司列表
      filialeAddData: {
        name: ""
      },
      companyWarehouseList: [],
      companyWarehouseAddData: {
        name: ""
      },
      filialeWarehouseList: [],
      filialeWarehouseAddData: {
        name: ""
      },
      normalAdminList: [],
      normalAdminListAddData: {
        name: "",
        psw: ""
      }
    };
  },
  mounted() {
    this.getAllData();
  },
  methods: {
    // 添加分公司信息
    addFiliale() {},
    // 修改分公司信息
    updateFiliale(row) {
      console.log(row);
    },
    // 刪除分公司
    delFiliale(row) {
      console.log(row);
    },
    // 選中某個分公司,查看其下管理倉庫
    selFiliale(row) {
      console.log(row);
    },

    // 添加總公司下倉庫信息
    addCompanyWarehouse() {},
    // 修改總公司下倉庫信息
    updateCompanyWarehouse(row) {
      console.log(row);
    },
    // 刪除總公司下倉庫
    delCompanyWarehouse(row) {
      console.log(row);
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
    addfilialeWarehouse() {},
    // 修改分公司下倉庫信息
    updateFilialeWarehouse(row) {
      console.log(row);
    },
    // 刪除分公司下倉庫
    delFilialeWarehouse(row) {
      console.log(row);
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
    // 選中某個普通賬號,查看其下管理仓库
    selNormalAdmin(row) {
      console.log(row);
    },

    // 折疊面板切換
    collapseChange(val) {
      console.log(val);
      if (val == 1) {
        this.$refs.filialeListTable.setCurrentRow(this.filialeList[0]);
        this.filialeWarehouseList = this.filialeList[0].filialeWarehouseList;
      } else if (val == 3) {
        this.normalAdminList = this.companyList[0].normalAdminList;
        this.$refs.normalAdminTable.setCurrentRow(this.normalAdminList[0]);
        this.filialeWarehouseList = this.normalAdminList[0].filialeWarehouseList;
      }
    },
    // 獲取所有數據
    getAllData() {
      this.$axios
        .get(this.$store.state.baseCompanyUrl + "/company/companyMsgGet")
        .then(res => {
          console.log("公司管理數據");
          console.log(res);
          this.filialeList = res.data.branchCompanyList;
          this.$refs.filialeListTable.setCurrentRow(this.filialeList[0]);
          this.filialeWarehouseList = this.filialeList[0].filialeWarehouseList;
          this.companyWarehouseList = this.companyList[0].companyWarehouseList;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.system-admin-container {
  margin: 40px 10px 0;
  display: flex;
  justify-content: space-between;

  .container-middle,
  .container-right {
    width: 47%;
    min-height: 80vh;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;

    .title {
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
