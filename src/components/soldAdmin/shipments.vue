<template>
  <div class="shipments-container">
    <!-- 商品发货 -->
    <div v-if="orderList.length == 0" class="no-data">
      {{ orderMsg }}
    </div>
    <div v-else class="shipments-list">
      <div v-for="(item, index) in orderList" :key="index" class="list-every">
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
                商品总价：
              </div>
              <div class="one-right">
                {{ "HKD " + formatNumberRgx(item.productAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                实际付款：
              </div>
              <div class="one-right">
                {{ "CNY " + formatNumberRgx(item.orderAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                收 货 人：
              </div>
              <div class="one-right">
                {{ item.logMsg.consigneeName }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                收货地址：
              </div>
              <div class="one-right">
                {{ item.logMsg.consigneeAddress }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                联系电话：
              </div>
              <div class="one-right">
                {{ item.logMsg.consigneePhone }}
              </div>
            </div>
          </div>
          <div>
            <el-button
              type="default"
              size="mini"
              @click="shipmentsClick(item)"
              class="handle-button"
              >发货</el-button
            >
          </div>
        </div>
        <table border="0" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <th>商品展示图</th>
            <th>商品信息</th>
            <th>商品价格</th>
            <th>商品状态</th>
          </tr>
          <tr v-for="(items, indexs) in item.detailList" :key="indexs">
            <td>
              <img :src="items.pic" style="width: 100px; height: 100px" />
            </td>
            <td>
              {{ items.productName }}
            </td>
            <td>
              {{ "HKD " + formatNumberRgx(items.productPrice) }}
            </td>
            <td>{{ items.status === null ? "待发货" : "已申请退款" }}</td>
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
        title="商品发货"
        :visible.sync="dialogShipmentsVisible"
        width="500px"
      >
        <el-form label-width="80px">
          <el-form-item label="快递公司" required>
            <el-select
              v-model="shipper"
              placeholder="请选择快递公司"
              style="width: 100%"
            >
              <el-option
                v-for="item in shipperList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号" required>
            <el-input
              v-model="courierNum"
              placeholder="请输入快递单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="运费">
            <el-input
              v-model="logisticsFee"
              placeholder="请输入运费"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button
            @click="dialogShipmentsVisible = false"
            style="width:100px;color:#9695f3;margin-right:10px;"
            >取 消</el-button
          >
          <el-button
            style="width:100px;background:#9695f3;color:#fff;"
            @click="shipmentsSure"
            >确 定
          </el-button>
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
      orderMsg: "数据加载中...",
      orderData: {},
      orderList: [],
      dialogShipmentsVisible: false,
      shipperList: [],
      shipper: "",
      courierNum: "",
      logisticsFee: ""
    };
  },
  created() {
    this.getOrderList();
    this.getShipperCompanyList();
  },
  methods: {
    // 发货
    shipmentsClick(item) {
      this.orderData = item;
      this.shipper = "";
      this.courierNum = "";
      this.dialogShipmentsVisible = true;
    },
    // 确定发货
    shipmentsSure() {
      if (this.shipper == "" || this.courierNum == "") {
        this.$message.error({
          message: "数据不能为空，请检查数据填写",
          showClose: true,
          duration: 2000
        });
      } else {
        this.$axios
          .post(this.$store.state.baseWechatUrl + "/deliverGoods", {
            orderId: this.orderData.id,
            deliveryCost: 5,
            logOrderNo: this.courierNum,
            logisticsCompanyId: this.shipper,
            logisticsFee: this.logisticsFee
          })
          .then(res => {
            console.log("发货");
            console.log(res);
            this.$message.success({
              message: "发货信息录入成功",
              showClose: true,
              duration: 2000
            });
            this.dialogShipmentsVisible = false;
            this.getOrderList();
          })
          .catch(err => {
            console.log(err);
            this.$message.error({
              message: err.data.message,
              showClose: true,
              duration: 2000
            });
          });
      }
    },
    // 获取订单列表
    getOrderList() {
      this.orderMsg = "数据加载中...";

      this.$axios
        .get(
          this.$store.state.baseWechatUrl +
            "/unSendOrderList?page=" +
            this.page +
            "&pageNum=10"
        )
        .then(res => {
          console.log("订单列表");
          console.log(res);
          this.orderList = res.data.list;
          this.total = res.data.total;
          if (this.orderList.length == 0) {
            this.orderMsg = "没有数据要展示哦~";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取快递公司列表
    getShipperCompanyList() {
      this.$axios
        .get(this.$store.state.baseWechatUrl + "/shipperCompanyList")
        .then(res => {
          console.log("快递公司");
          console.log(res);
          this.shipperList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      console.log(this.page);
      this.getOrderList();

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
.shipments-container {
  margin-top: 40px;

  .no-data {
    text-align: center;
  }

  .shipments-list {
    .list-every {
      width: 100%;
      padding-bottom: 2px;
      margin-bottom: 40px;
      background-color: #fff;
      border: 1px solid #9695f3;
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
          background-color: #9695f3;
          color: #fff;
          font-size: 14px;
        }
      }

      table {
        tr th {
          background-color: #9695f3;
          color: #fff;
        }

        th,
        td {
          width: 24%;
          text-align: center;
        }
      }
    }
  }
}
</style>
