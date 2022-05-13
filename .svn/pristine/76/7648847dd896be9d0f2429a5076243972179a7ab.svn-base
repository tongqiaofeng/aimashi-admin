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
                订单编号：
              </div>
              <div class="one-right">
                {{ item.outTradeNo }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                商品价格：
              </div>
              <div class="one-right">
                {{ "HKD " + formatNumberRgx(item.productAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                付款金额：
              </div>
              <div class="one-right">
                {{ "CNY " + formatNumberRgx(item.payAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                付款时间：
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
        <table border="0" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <th>退款申请时间</th>
            <th>图片</th>
            <th>商品信息</th>
            <th>联系电话</th>
            <th>收货状态</th>
            <th>申请类型</th>
            <th>申请退款金额</th>
            <th>退货/退款原因</th>
            <th>详细说明</th>
            <th>审核状态</th>
          </tr>
          <tr v-for="(items, indexs) in item.detailList" :key="indexs">
            <td>{{ items.returnMsg.createTime }}</td>
            <td>
              <img :src="items.pic" style="width: 100px; height: 100px" />
            </td>
            <td>
              {{ items.name }}
            </td>
            <td>{{ items.returnMsg.phone }}</td>
            <td>
              {{
                items.returnMsg.productStatus == 0
                  ? "卖家已收到货"
                  : "买家未收到货"
              }}
            </td>
            <td>{{ items.returnMsg.type == 0 ? "仅退款" : "退货退款" }}</td>
            <td>{{ "CNY " + formatNumberRgx(items.returnMsg.refund) }}</td>
            <td>{{ items.returnMsg.reason }}</td>
            <td>{{ items.returnMsg.note }}</td>
            <td>{{ editState(items.returnMsg.status) }}</td>
          </tr>
        </table>
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
        title="退款审核"
        :visible.sync="dialogRefundVisible"
        width="500px"
      >
        <el-form label-width="45px">
          <el-form-item label="">
            <el-checkbox v-model="status">是否同意退款</el-checkbox>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="auditReason"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogRefundVisible = false">取 消</el-button>
          <el-button type="primary" @click="returnMoneySure">确 定 </el-button>
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
      returnMsg: "数据加载中...",
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
        .post(this.$store.state.baseWechatUrl + "/auditReturn", {
          id: this.id,
          auditReason: this.auditReason,
          status: this.status == true ? 1 : -1
        })
        .then(res => {
          console.log("审核退款");
          console.log(res);
          this.dialogRefundVisible = false;
          this.$message.success({
            message: "审核成功",
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
      this.returnMsg = "数据加载中...";
      this.$axios
        .get(
          this.$store.state.baseWechatUrl +
            "/unAuditReturnList?page=" +
            this.page
        )
        .then(res => {
          console.log("退款申请");
          console.log(res);
          this.unAuditReturnList = res.data.list;
          this.total = res.data.total;
          if (this.unAuditReturnList.length == 0) {
            this.returnMsg = "没有数据要展示哦~";
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
          return "取消申请";
          break;
        case -1:
          return "拒绝申请";
          break;
        case 0:
          return "待审核";
          break;
        case 1:
          return "审核通过";
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
