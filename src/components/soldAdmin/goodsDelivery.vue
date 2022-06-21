<template>
  <div class="shipments-container">
    <!-- 商品發貨 -->
    <div v-if="orderList.length == 0" class="no-data">
      {{ orderMsg }}
    </div>
    <div v-else class="shipments-list">
      <div v-for="(item, index) in orderList" :key="index" class="list-every">
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
                商品總價：
              </div>
              <div class="one-right">
                {{ "CNY " + formatNumberRgx(item.productAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                實際付款：
              </div>
              <div class="one-right">
                {{ "CNY " + formatNumberRgx(item.orderAmountTotal) }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                收 貨 人：
              </div>
              <div class="one-right">
                {{ item.logMsg.consigneeName }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                收貨地址：
              </div>
              <div class="one-right">
                {{ item.logMsg.consigneeAddress }}
              </div>
            </div>
            <div class="div-one">
              <div class="one-left">
                聯繫電話：
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
              >發貨</el-button
            >
          </div>
        </div>
        <el-table border stripe :data="item.detailList" style="width: 100%">
          <el-table-column align="center" prop="pic" label="圖片">
            <template slot-scope="scope">
              <div>
                <img :src="scope.row.pic" style="width: 100px; height: 100px" />
                <!-- 
                 <view class="msg-img" v-if="item.productCategory == 1">
                 	<image v-if="item.pic" :src="item.pic" mode="aspectFill"></image>
                 	<image v-else src="../static/imgs/common/nopic.jpg" mode="aspectFill"></image>
                 </view>
                 <view class="msg-img" v-if="item.productCategory == 2">
                 	<image v-if="item.pic" :src="imgUrl + '/file/small/' + item.pic.trim()" mode="aspectFill">
                 	</image>
                 	<image v-else src="../static/imgs/common/nopic.jpg" mode="aspectFill"></image>
                 </view>
                 <view class="msg-img" v-if="item.productCategory == 3">
                 	<image v-if="item.pic" :src="watchUrl + item.pic.trim()" mode="aspectFill">
                 	</image>
                 	<image v-else src="../static/imgs/common/nopic.jpg" mode="aspectFill"></image>
                 </view>
                 -->
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="productName" label="商品信息">
          </el-table-column>
          <el-table-column align="center" prop="productPrice" label="商品價格">
            <template slot-scope="scope">
              <div>
                {{ "CNY " + formatNumberRgx(scope.row.productAmount) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="商品狀態">
            <template slot-scope="scope">
              <div>
                {{ scope.row.status === null ? "待發貨" : "已申請退款" }}
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
        title="商品發貨"
        :visible.sync="dialogShipmentsVisible"
        width="500px"
      >
        <el-form label-width="80px">
          <el-form-item label="快遞公司" required>
            <el-select
              v-model="shipper"
              placeholder="請選擇快遞公司"
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
          <el-form-item label="快遞單號" required>
            <el-input
              v-model="courierNum"
              placeholder="請輸入快遞單號"
            ></el-input>
          </el-form-item>
          <el-form-item label="運費">
            <el-input
              v-model="logisticsFee"
              placeholder="請輸入運費"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogShipmentsVisible = false">取 消</el-button>
          <el-button type="primary" @click="shipmentsSure">確 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: this.$store.state.baseCompanyUrl + "/jewellery/api",
      watchUrl: this.$store.state.baseCompanyUrl + "/watch/api",
      page: 1,
      total: 0,
      orderMsg: "數據加載中...",
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
          message: "數據不能為空，請檢查數據填寫",
          showClose: true,
          duration: 2000
        });
      } else {
        this.$axios
          .post(
            this.$store.state.baseCompanyUrl + "/afterService/api/deliverGoods",
            {
              orderId: this.orderData.id,
              deliveryCost: 5,
              logOrderNo: this.courierNum,
              logisticsCompanyId: this.shipper,
              logisticsFee: this.logisticsFee
            }
          )
          .then(res => {
            console.log("發貨");
            console.log(res);
            this.$message.success({
              message: "發貨信息錄入成功",
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
      this.orderMsg = "數據加載中...";

      this.$axios
        .get(
          this.$store.state.baseCompanyUrl +
            "/order/api/unSendOrderList?page=" +
            this.page +
            "&pageNum=10"
        )
        .then(res => {
          console.log("订单列表");
          console.log(res);
          this.orderList = res.data.data;
          this.total = res.data.total;
          if (this.orderList.length == 0) {
            this.orderMsg = "暫無數據~";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取快递公司列表
    getShipperCompanyList() {
      this.$axios
        .get(
          this.$store.state.baseCompanyUrl +
            "/afterService/api/shipperCompanyList"
        )
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
          width: 24%;
          text-align: center;
        }
      }
    }
  }
}
</style>
