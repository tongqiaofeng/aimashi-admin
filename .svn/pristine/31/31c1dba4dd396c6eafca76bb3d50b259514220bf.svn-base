<template>
  <div class="normal-admin-container">
    <div style="padding-bottom: 20px;font-size: 20px;font-weight: bold;">
      管理倉庫列表
    </div>
    <el-table border :data="warehouseList" style="width: 500px">
      <el-table-column prop="warehouseName" label="倉庫名稱" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <div slot-scope="scoped">
          <el-button type="text" @click="updateWarehouse(scoped.row)"
            >修改信息</el-button
          >
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
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      warehouseList: [],
      dialogUpdateCompanyWarehouseVisible: false,
      updateWarehouseMsg: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 修改倉庫信息
    updateWarehouse(row) {
      console.log(row);
      this.updateWarehouseMsg = JSON.parse(JSON.stringify(row));
      this.dialogUpdateCompanyWarehouseVisible = true;
    },
    // 確定修改
    updateCompanyWarehouseSure() {
      this.$axios
        .post(
          this.$store.state.baseCompanyUrl + "/warehouse/companyWarehouseSave",
          {
            id: this.updateWarehouseMsg.id,
            companyId: this.updateWarehouseMsg.companyId,
            warehouseName: this.updateWarehouseMsg.warehouseName
          }
        )
        .then(res => {
          console.log("修改倉庫");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000
          });
          this.getData();
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
    // 獲取綁定倉庫列表
    getData() {
      this.$axios
        .get(this.$store.state.baseCompanyUrl + "/company/companyMsgGet")
        .then(res => {
          console.log("公司管理數據");
          console.log(res);
          this.warehouseList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.normal-admin-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
}
</style>
