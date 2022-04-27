<template>
  <div class="user-admin-container">
    <!-- 人員管理 -->
    <el-button type="primary" @click="addUser">添加人員</el-button>
    <el-dialog
      title="添加人員信息"
      :visible.sync="dialogAddUserVisible"
      v-if="dialogAddUserVisible"
      width="700px"
    >
      <div>
        <el-form
          ref="addUserForm"
          :model="addUserData"
          :rules="addUserRules"
          label-width="130px"
        >
          <el-form-item prop="name" label="人員名稱：">
            <el-input
              v-model="addUserData.name"
              placeholder="請輸入人員名稱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="type" label="是否為公司人員：">
            <el-switch
              v-model="addUserData.type"
              @change="switchChange"
            ></el-switch>
          </el-form-item>
          <el-form-item
            prop="deptList"
            label="所屬部門職位："
            v-show="addUserRules.deptList[0].required == true"
          >
            <el-cascader
              v-model="addUserData.deptList"
              :options="deptList"
              :props="{
                multiple: true
              }"
              style="width: 100%;"
              popper-class="disableFirstLevel"
            ></el-cascader>
          </el-form-item>
          <el-form-item prop="currencyId" label="幣種：">
            <el-select
              v-model="addUserData.currencyId"
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
        <el-button v-preventClick @click="dialogAddUserVisible = false"
          >取 消</el-button
        >
        <el-button
          v-preventClick
          type="primary"
          @click="addUserSure('addUserForm')"
          >確 定</el-button
        >
      </div>
    </el-dialog>
    <div>
      <el-table
        border
        :data="userDataList"
        style="width: 1000px;margin-top: 10px;"
      >
        <el-table-column prop="personnelName" label="人員名稱" align="center">
        </el-table-column>
        <el-table-column prop="companyName" label="所屬公司" align="center">
        </el-table-column>
        <el-table-column prop="type" label="是否為公司人員" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.type == 1 ? "是" : "否" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="幣種" align="center">
          <template slot-scope="scope">
            <div>
              {{ currencyRgx(scope.row.currencyId) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="updateUser(scope.row)"
                >修改</el-button
              >
              <el-button type="text" @click="delUser(scope.row.personnelId)"
                >刪除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="修改人員信息"
      :visible.sync="dialogUpdateUserVisible"
      v-if="dialogUpdateUserVisible"
      width="700px"
    >
      <div>
        <el-form
          ref="updateUserForm"
          :model="updateUserMsg"
          :rules="addUserRules"
          label-width="130px"
        >
          <el-form-item prop="personnelName" label="人員名稱：">
            <el-input
              v-model="updateUserMsg.personnelName"
              placeholder="請輸入人員名稱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="type" label="是否為公司人員：">
            <el-switch
              v-model="updateUserMsg.type"
              @change="switchChange"
            ></el-switch>
          </el-form-item>
          <el-form-item
            prop="deptList"
            label="所屬部門職位："
            v-show="addUserRules.deptList[0].required == true"
          >
            <el-cascader
              v-model="updateUserMsg.deptList"
              :options="deptList"
              :props="{
                multiple: true
              }"
              style="width: 100%;"
              popper-class="disableFirstLevel"
            ></el-cascader>
          </el-form-item>
          <el-form-item prop="currencyId" label="幣種：">
            <el-select
              v-model="updateUserMsg.currencyId"
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
        <el-button v-preventClick @click="dialogUpdateUserVisible = false"
          >取 消</el-button
        >
        <el-button
          v-preventClick
          type="primary"
          @click="updateUserSure('updateUserForm')"
          >確 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="刪除人員信息"
      :visible.sync="dialogDelUserVisible"
      width="500px"
    >
      <div style="text-align: center;font-size: 16px;">
        確定刪除該人員信息？刪除後不能恢復
      </div>
      <div slot="footer">
        <el-button v-preventClick @click="dialogDelUserVisible = false"
          >取 消</el-button
        >
        <el-button v-preventClick type="primary" @click="delUserSure"
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
      userDataList: [],
      dialogAddUserVisible: false,
      addUserData: {
        name: "",
        type: false,
        deptList: [],
        currencyId: ""
      },
      addUserRules: {
        name: [{ required: true, message: "請輸入人員名稱", trigger: "blur" }],
        deptList: [
          { required: false, message: "請選擇所屬部門職位", trigger: "change" }
        ],
        currencyId: [
          { required: true, message: "請選擇幣種", trigger: "change" }
        ]
      },
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
      deptList: [],
      updateUserMsg: {},
      dialogUpdateUserVisible: false,
      dialogDelUserVisible: false,
      delUserId: null
    };
  },
  created() {
    this.getUserData();
    this.getDeptList();
  },
  methods: {
    switchChange() {
      console.log(this.addUserData.type);
      if (this.dialogAddUserVisible == true) {
        if (this.addUserData.type == true) {
          this.addUserRules.deptList[0].required = true;
        } else {
          this.addUserRules.deptList[0].required = false;
        }
      } else {
        if (this.updateUserMsg.type == true) {
          this.addUserRules.deptList[0].required = true;
        } else {
          this.addUserRules.deptList[0].required = false;
        }
      }
    },
    // 級聯選擇器-選擇部門
    handleChange() {
      let currencyGlobal = sessionStorage.getItem("currencyGlobal");
      for (let i = 0; i < this.currencyIds.length; ++i) {
        if (
          currencyGlobal ==
          this.currencyIds[i].label
            .split("")
            .slice(0, 3)
            .join("")
        )
          this.addUserData.currencyId = Number(this.currencyIds[i].value);
      }
    },
    // 添加人員
    addUser() {
      this.addUserData.name = "";
      this.addUserData.type = true;
      this.addUserData.deptList = [];
      this.addUserRules.deptList[0].required = false;
      this.handleChange();
      this.dialogAddUserVisible = true;
      this.switchChange();
    },
    // 確定添加
    addUserSure(formName) {
      console.log(this.addUserData.type);
      console.log(this.addUserData.deptList);
      let deptEndList = [];
      if (this.addUserData.type == true) {
        deptEndList = this.addUserData.deptList.map(item => {
          return {
            deptId: item[0],
            titleId: item[1]
          };
        });
      }
      console.log(deptEndList);

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              this.$store.state.baseCompanyUrl + "/personnel/personnelMsgSave",
              {
                currencyId: this.addUserData.currencyId,
                deptList: deptEndList,
                companyId: sessionStorage.getItem("companyId"),
                name: this.addUserData.name,
                type: this.addUserData.type == true ? 1 : 2
              }
            )
            .then(res => {
              console.log("添加人員");
              console.log(res);
              this.$message.success({
                message: "添加成功",
                showClose: true,
                duration: 2000
              });
              this.dialogAddUserVisible = false;
              this.getUserData();
            })
            .catch(err => {
              console.log(err);
              this.$message.error({
                message: err.data.status,
                showClose: true,
                duration: 2000
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改人員信息
    updateUser(row) {
      console.log(row);
      this.updateUserMsg = JSON.parse(JSON.stringify(row));

      this.updateUserMsg.type == 1
        ? (this.updateUserMsg.type = true)
        : (this.updateUserMsg.type = false);
      this.updateUserMsg.companyId = this.updateUserMsg.companyId + "";

      if (this.updateUserMsg.type == 1) {
        this.addUserRules.deptList[0].required = true;
        this.updateUserMsg.deptList = this.updateUserMsg.deptList.map(item => {
          return [item.deptId + "", item.titleId + ""];
        });

        console.log(this.updateUserMsg.deptList);
      } else {
        this.addUserRules.deptList[0].required = false;
      }

      this.dialogUpdateUserVisible = true;
    },
    // 確定修改
    updateUserSure(formName) {
      console.log(this.updateUserMsg.type);
      let deptEndList = [];
      if (this.updateUserMsg.type == true) {
        deptEndList = this.updateUserMsg.deptList.map(item => {
          return {
            deptId: item[0],
            titleId: item[1]
          };
        });
      }
      console.log(deptEndList);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              this.$store.state.baseCompanyUrl + "/personnel/personnelMsgSave",
              {
                id: this.updateUserMsg.personnelId,
                currencyId: this.updateUserMsg.currencyId,
                deptList: deptEndList,
                companyId: sessionStorage.getItem("companyId"),
                name: this.updateUserMsg.personnelName,
                type: this.updateUserMsg.type == true ? 1 : 2
              }
            )
            .then(res => {
              console.log("修改人員");
              console.log(res);
              this.$message.success({
                message: "修改成功",
                showClose: true,
                duration: 2000
              });
              this.dialogUpdateUserVisible = false;
              this.getUserData();
            })
            .catch(err => {
              console.log(err);
              this.$message.error({
                message: err.data.status,
                showClose: true,
                duration: 2000
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 刪除人員信息
    delUser(id) {
      console.log(id);
      this.delUserId = id;
      this.dialogDelUserVisible = true;
    },
    // 確定刪除
    delUserSure() {
      this.$axios
        .delete(
          this.$store.state.baseCompanyUrl +
            "/personnel/personnelDel?id=" +
            this.delUserId
        )
        .then(async res => {
          console.log("刪除人員");
          console.log(res);
          this.$message.success({
            message: "刪除成功",
            showClose: true,
            duration: 2000
          });

          this.dialogDelUserVisible = false;
          this.getUserData();
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
    // 獲取人員列表
    getUserData() {
      this.$axios
        .get(
          this.$store.state.baseCompanyUrl + "/personnel/companyPersonnelMsgGet"
        )
        .then(res => {
          console.log("人員列表");
          console.log(res);
          this.userDataList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 獲取部門列表
    getDeptList() {
      this.$axios
        .get(this.$store.state.baseCompanyUrl + "/personnel/companyDeptMsgGet")
        .then(res => {
          console.log("部門列表");
          console.log(res);
          this.deptList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 幣種匹配
    currencyRgx(item) {
      console.log(item);
      for (const items of this.currencyIds) {
        if (item == items.value) return items.label;
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
.user-admin-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
}
</style>

<style lang="scss">
.disableFirstLevel {
  .el-cascader-panel {
    .el-scrollbar {
      .el-checkbox {
        display: none;
      }
    }

    .el-scrollbar:nth-child(2) {
      .el-checkbox {
        display: inline-block;
      }
    }
  }
}
</style>
