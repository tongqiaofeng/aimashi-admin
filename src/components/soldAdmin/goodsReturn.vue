<template>
  <div class="refund-container">
    <!-- 退货确认 -->
    <div v-if="unAuditReturnList.length == 0" class="no-data">
      {{ returnMsg }}
    </div>
    <div v-else class="refund-list">
      <div
        v-for="(item, index) in unAuditReturnList"
        :key="index"
        class="list-every"
      >
        <div class="every-top">
          <div class="top-left">
            <div class="div-one">
              <div class="one-left">
                訂單編號：
              </div>
              <div class="one-right">
                {{ item.outTradeNo }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                商品價格：
              </div>
              <div class="one-right">
                {{ "CNY " + formatNumberRgx(item.productAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                付款金額：
              </div>
              <div class="one-right">
                {{ "CNY " + formatNumberRgx(item.payAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                付款時間：
              </div>
              <div class="one-right">
                {{ item.payTime }}
              </div>
            </div>
          </div>
          <div>
            <el-button
              type="default"
              size="mini"
              class="handle-button"
              @click="returnMoney(item)"
              >退款</el-button
            >
          </div>
        </div>
        <el-table border stripe :data="item.detailList" style="width: 100%">
          <el-table-column
            align="center"
            prop="returnMsg.createTime"
            label="退款申請時間"
          >
          </el-table-column>
          <el-table-column align="center" prop="pic" label="圖片">
            <template slot-scope="scope">
              <div>
                <img :src="scope.row.pic" style="width: 100px; height: 100px" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="商品信息">
          </el-table-column>
          <el-table-column
            align="center"
            prop="returnMsg.phone"
            label="聯繫電話"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="returnMsg.productStatus"
            label="收貨狀態"
          >
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.returnMsg.productStatus == 0
                    ? "買家已收到貨"
                    : "買家未收到貨"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="returnMsg.productStatus"
            label="申請類型"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.returnMsg.type == 0 ? "僅退款" : "退貨退款" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="returnMsg.refund"
            label="申請退款金額"
          >
            <template slot-scope="scope">
              <div>
                {{ "CNY " + formatNumberRgx(scope.row.returnMsg.refund) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="returnMsg.reason"
            label="退貨退款原因"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="returnMsg.note"
            label="詳細說明"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="returnMsg.status"
            label="審核狀態"
          >
            <template slot-scope="scope">
              <div>
                {{ editState(scope.row.returnMsg.status) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        style="margin:15px 0;padding-bottom: 30px;position:absolute;right:10%;"
      >
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <el-dialog
        title="退款審核"
        :visible.sync="dialogRefundVisible"
        width="500px"
      >
        <el-form label-width="45px">
          <el-form-item label="">
            <el-checkbox v-model="status">是否同意退款</el-checkbox>
          </el-form-item>
          <el-form-item label="備註">
            <el-input
              type="textarea"
              v-model="auditReason"
              placeholder="請輸入備註"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogRefundVisible = false">取 消</el-button>
          <el-button type="primary" @click="returnMoneySure">確 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      total: 0,
      returnMsg: "數據加載中...",
      unAuditReturnList: [],

      id: null,
      auditReason: "",
      status: true,
      dialogRefundVisible: false
    };
  },
  created() {
    this.getUnAuditReturnList();
  },
  methods: {
    // 退款
    returnMoney(item) {
      this.id = item.detailList[0].returnMsg.id;
      this.auditReason = "";
      this.status = true;
      this.dialogRefundVisible = true;
    },
    // 确定退款
    returnMoneySure() {
      this.$axios
        .post(
          this.$store.state.baseCompanyUrl + "/afterService/api/auditReturn",
          {
            id: this.id,
            auditReason: this.auditReason,
            status: this.status == true ? 1 : -1
          }
        )
        .then(res => {
          console.log("审核退款");
          console.log(res);
          this.dialogRefundVisible = false;
          this.$message.success({
            message: "審核成功",
            showClose: true,
            duration: 2000
          });
          this.getUnAuditReturnList();
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.message,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 获取退款申请列表
    getUnAuditReturnList() {
      this.returnMsg = "數據加載中...";
      this.$axios
        .get(
          this.$store.state.baseCompanyUrl +
            "/afterService/api/unAuditReturnList?page=" +
            this.page
        )
        .then(res => {
          console.log("退款申请");
          console.log(res);
          this.unAuditReturnList = res.data.list;
          this.total = res.data.total;
          if (this.unAuditReturnList.length == 0) {
            this.returnMsg = "暫無數據~";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 审核状态
    editState(status) {
      switch (status) {
        case -2:
          return "取消申請";
          break;
        case -1:
          return "拒絕申請";
          break;
        case 0:
          return "待審核";
          break;
        case 1:
          return "審核通過";
          break;
        case 2:
          return "已退款";
          break;
      }
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      console.log(this.page);
      this.getUnAuditReturnList();

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    }
  }
};
</script>

<style lang="scss" scoped>
.refund-container {
  margin-top: 40px;

  .no-data {
    text-align: center;
  }

  .refund-list {
    .list-every {
      width: 100%;
      padding-bottom: 2px;
      margin-bottom: 40px;
      background-color: #fff;
      border: 1px solid #409eff;
      border-radius: 5px;

      .every-top {
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-content: center;

        .div-one {
          height: 34px;
          margin-left: 10px;
          margin-bottom: 5px;
          display: flex;
          line-height: 34px;

          .one-left {
            width: 85px;
            text-align: center;
            font-size: 16px;
          }

          .one-right {
            font-size: 14px;
          }
        }

        .handle-button {
          background-color: #409eff;
          color: #fff;
          font-size: 14px;
        }
      }

      table {
        tr th {
          background-color: #409eff;
          color: #fff;
        }

        th,
        td {
          // width: 24%;
          text-align: center;
        }
      }
    }
  }
}
</style>
