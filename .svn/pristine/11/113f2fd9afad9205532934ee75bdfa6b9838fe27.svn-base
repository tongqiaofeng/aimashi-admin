<template>
  <div class="export-container">
    <el-form label-width="145px">
      <el-form-item label="時間：">
        <div class="create">
          <el-date-picker
            v-model="time1"
            type="date"
            placeholder="開始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            class="create-time-input-style1"
          >
          </el-date-picker>
          <span class="create-time-span-style">至</span>
          <el-date-picker
            v-model="time2"
            type="date"
            placeholder="結束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            class="create-time-input-style2"
          >
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="賬單賬戶/銷售人員：">
        <el-select v-model="personId" placeholder="請選擇" clearable>
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="export-button">
      <el-button
        style="width: 160px;"
        type="primary"
        @click="inventoryExport('/stockExport')"
        >庫存導出</el-button
      >
      <el-button
        style="width: 160px;"
        type="primary"
        @click="inventoryExport('/billExport')"
        >賬單導出</el-button
      >
      <el-button
        style="width: 160px;"
        type="primary"
        @click="inventoryExport('/salesExport')"
        >銷售單導出</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time1: "",
      time2: "",
      userList: [],
      personId: null
    };
  },
  created() {
    this.getBillUserList();
  },
  methods: {
    // 庫存導出
    inventoryExport(url) {
      let reqUrl = "";
      if (url == "/stockExport") {
        reqUrl =
          this.$store.state.baseUrl +
          url +
          "?startTime=" +
          this.time1 +
          "&endTime=" +
          this.time2;
      } else if (url == "/billExport") {
        if (this.personId == "" || this.personId == null) {
          this.$message.error({
            message: "請選擇導出賬單賬戶"
          });
          return;
        }
        reqUrl =
          this.$store.state.baseUrl +
          url +
          "?startTime=" +
          this.time1 +
          "&endTime=" +
          this.time2 +
          "&id=" +
          this.personId;
      } else {
        if (this.personId == "" || this.personId == null) {
          this.$message.error({
            message: "請選擇導出賬戶"
          });
          return;
        }
        reqUrl =
          this.$store.state.baseUrl +
          url +
          "?startTime=" +
          this.time1 +
          "&endTime=" +
          this.time2 +
          "&seller=" +
          this.personId;
      }
      const loading = this.$loading({
        lock: true,
        text: "數據導出中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      this.$axios
        .get(reqUrl, {
          responseType: "blob"
        })
        .then(res => {
          loading.close();
          console.log("導出數據");
          console.log(res);

          const link = document.createElement("a");
          let blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);

          let num = "";
          for (let i = 0; i < 10; i++) {
            num += Math.ceil(Math.random() * 10);
          }

          if (url == "/stockExport") {
            link.setAttribute(
              "download",
              "Hermès 基金库存 ( Updated on 3 May 2022)" + ".xlsx"
            );
          } else if (url == "/billExport") {
            link.setAttribute(
              "download",
              "Hermès Bill summary_" + num + ".xlsx"
            );
          } else {
            link.setAttribute(
              "download",
              "Hermès Invoice summary_" + num + ".xlsx"
            );
          }

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          console.log(err);
          loading.close();
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 獲取用戶列表
    getBillUserList() {
      this.$axios
        .get(this.$store.state.baseUrl + "/billUserList")
        .then(res => {
          console.log("用戶列表");
          console.log(res);
          this.userList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.export-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;

  .create {
    height: 48px;
    line-height: 48px;

    .create-time-input-style1 {
      height: 48px;
    }

    .create-time-span-style {
      margin-left: 20px;
      margin-right: 20px;
    }

    .create-time-input-style2 {
      width: 210px;
    }
  }

  .export-button {
    width: 635px;
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;
  }
}

input::-webkit-input-placeholder {
  color: #c8c8c8;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #c8c8c8;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #c8c8c8;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #c8c8c8;
}
</style>
