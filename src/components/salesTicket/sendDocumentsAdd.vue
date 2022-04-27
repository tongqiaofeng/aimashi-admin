<template>
  <div
    style="margin-top: -20px;overflow: hidden;"
    id="sendDocumentAddContainer"
  >
    <div class="new-consignment-container">
      <!-- 新增寄賣 -->
      <div v-if="pageSel == 0" class="sales-ticket-main">
        <div class="sales-ticket-left">
          <el-form
            ref="addSalesTicketForm"
            :model="addDataConsign"
            :rules="addDataRules"
            label-width="98px"
          >
            <el-form-item label="庫存狀態" required>
              <el-form-item prop="sold">
                <el-select
                  style="width: 300px;"
                  v-model="addDataConsign.sold"
                  placeholder="請選擇"
                >
                  <el-option
                    v-for="item in stateList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item prop="bill" label="賬單號">
              <el-input
                style="width: 300px;"
                v-model="addDataConsign.bill"
                placeholder="請輸入賬單號"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否收款完成" prop="isReceiveCheck">
              <el-switch v-model="addDataConsign.isReceiveCheck"></el-switch>
            </el-form-item>
            <el-form-item prop="companyId" label="接收公司">
              <el-select
                style="width: 300px;"
                v-model="addDataConsign.companyId"
                placeholder="請選擇"
                @change="companyChange"
                clearable
              >
                <el-option
                  v-show="item.warehouseList.length > 0"
                  v-for="item in companyAndWarehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="receiveWarehouseId" label="接收倉庫">
              <el-select
                style="width: 300px;"
                v-model="addDataConsign.receiveWarehouseId"
                placeholder="請選擇"
                clearable
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="soldTime" label="寄賣日期">
              <el-date-picker
                style="width: 300px;"
                v-model="addDataConsign.soldTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="請選擇"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="外幣金額幣種" prop="sellCurrencyId">
              <el-select
                style="width: 300px;"
                v-model="addDataConsign.sellCurrencyId"
                placeholder="請選擇"
                clearable
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
          <div>
            <el-table border :data="sellStockList">
              <el-table-column
                width="80px"
                align="center"
                prop="productCode"
                label="貨號"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="priceTran"
                label="
                  寄賣外幣金額
                "
              >
                <template slot-scope="scope">
                  <div>
                    <el-input
                      type="text"
                      placeholder="请输入"
                      v-model="scope.row.priceTran"
                      clearable
                      @change="isSellHKD(scope.row)"
                      ><i
                        slot="suffix"
                        style="color: #000;font-style:normal;line-height: 40px;"
                        >{{ currencyRgx(addDataConsign.sellCurrencyId) }}</i
                      ></el-input
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="saleLogHkPrice"
                 :label="'物流費/手續費('+currencyGlobal+')'"
              >
                <template slot-scope="scope">
                  <div>
                    <el-input
                      type="text"
                      placeholder="请输入"
                      v-model="scope.row.saleLogHkPrice"
                      clearable
                    ></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="saleTotalHkPrice">
                <!-- eslint-disable-next-line -->
                <template slot="header" slot-scope="scope">
                  <div>
                    <span>
                      寄賣{{currencyFontRgx(currencyGlobal)}}金額
                    </span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div>
                    <el-input
                      type="text"
                      placeholder="请输入"
                      v-model="scope.row.saleTotalHkPrice"
                      clearable
                      @input="getSubPrice"
                    ></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                width="250px"
                align="center"
                prop="note"
                label="備註"
              >
                <template slot-scope="scope">
                  <div>
                    <el-input
                      type="textarea"
                      placeholder="请输入"
                      v-model="scope.row.note"
                      clearable
                    ></el-input>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div>
              <p style="text-align: right;">
                總金額：{{ formatNumberRgx(subTotal) }}
              </p>
            </div>
          </div>
          <div style="margin: 20px 40px 20px 0;text-align: right;">
            <el-button
              type="primary"
              style="width: 100px;"
              v-preventClick
              @click="submitSales('addSalesTicketForm')"
              >提 交</el-button
            >
          </div>
        </div>
        <div class="sales-ticket-right">
          <el-form inline>
            <el-form-item label="庫存地：">
              <el-select
                v-model="stockLoc2"
                placeholder="請選擇"
                @change="radioChange"
                style="margin-bottom: 10px;margin-right: 10px;"
              >
                <el-option
                  v-for="item in stockLocList"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                  v-show="item.companyId == companyIdZong || !item.companyId"
                >
                  <span style="float: left">{{ item.warehouseName }}</span>
                  <span
                    style="margin-left: 30px;float: right; color: #8492a6; font-size: 13px"
                    >{{ item.warehouseId == -1 ? "" : item.companyName }}</span
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="關鍵字：">
              <el-input
                style="width: 400px;"
                v-model="searchKey"
                placeholder="可輸入商品款式、尺寸、材質、色號、色系、貨號等搜索"
                @focus="radioChange"
              ></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getNotSoldList">查詢</el-button>
            </el-form-item>
          </el-form>
          <el-table
            style="width: 100%;"
            ref="multipleTable"
            :data="notSoldBagList"
            :row-key="getRowKeys"
            tooltip-effect="dark"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              width="55"
              align="center"
            >
            </el-table-column>
            <el-table-column align="center" prop="productCode" label="貨號">
            </el-table-column>
            <el-table-column align="center" prop="pic" label="圖片">
              <template slot-scope="scope">
                <div>
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.pic.trim()"
                    :preview-src-list="bigImg(scope.row.pics)"
                    :z-index="5000"
                  >
                  </el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="250px"
              align="center"
              prop="name"
              label="商品信息"
            >
              <template slot-scope="scope">
                <div>
                  <el-tooltip
                    class="item"
                    effect="light"
                    :content="scope.row.name"
                    placement="bottom"
                  >
                    <div class="font-warp">{{ scope.row.name }}</div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" @click="editProduct(scope.row)"
                    >修改查看</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:15px;text-align: right;">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div v-else>
        <details-vue
          :updatesId="updateId"
          @goback="gobackAdd"
          @updateSuccess="updateSuccess"
        ></details-vue>
      </div>
    </div>
  </div>
</template>

<script>
import detailsVue from "../common/details.vue";
export default {
  components: { detailsVue },
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      role: null,
      page: 1,
      total: 0,
      stockLoc2: "",
      stockLocList: [],
      searchKey: "",
      updateId: null,

      pageSel: 0,
      companyAndWarehouseList: [],
      warehouseList: [],
      addDataConsign: {
        sold: "8",
        bill: "",
        isReceiveCheck: false,
        companyId: null,
        receiveWarehouseId: null,
        soldTime: "",
        sellCurrencyId: ""
      },
      addDataRules: {
        sold: [
          {
            required: true,
            message: "請選擇庫存狀態",
            trigger: "change"
          }
        ],
        bill: [
          {
            required: true,
            message: "請輸入賬單號",
            trigger: "blur"
          }
        ],
        companyId: [
          {
            required: true,
            message: "請選擇接收公司",
            trigger: "change"
          }
        ],
        receiveWarehouseId: [
          {
            required: true,
            message: "請選擇接收倉庫",
            trigger: "change"
          }
        ],
        soldTime: [
          {
            required: true,
            message: "請選擇日期",
            trigger: "change"
          }
        ]
      },
      currencyIds: [
        {
          value: "1",
          label: "CNY人民币"
        },
        {
          value: "2",
          label: "HKD港币"
        },
        {
          value: "3",
          label: "USD美元"
        },
        {
          value: "4",
          label: "EUR欧元"
        },
        {
          value: "5",
          label: "GBP英镑"
        },
        {
          value: "6",
          label: "AUD澳元"
        }
      ],
      stateList: [
        {
          label: "已寄卖",
          value: "8"
        }
      ],

      notSoldBagList: [],
      sellStockList: [],
      subTotal: 0,
      companyIdZong: null,
      currencyGlobal: ""
    };
  },
  created() {
    this.currencyGlobal = sessionStorage.getItem("currencyGlobal");
    this.role = sessionStorage.getItem("role");
    this.companyIdZong = sessionStorage.getItem("companyId");
    this.getStockLocList();
    this.getNotSoldList();
  },
  mounted() {
    this.getCompanyAndWarehouseList();
  },
  methods: {
    // 計算總金額
    getSubPrice() {
      this.subTotal = 0;
      for (const item of this.sellStockList) {
        this.subTotal += Number(item.saleTotalHkPrice);
      }
    },
    // 选择出售包包
    handleSelectionChange(val) {
      console.log("選中商品");
      console.log(val);
      this.sellStockList = val;
      console.log(this.sellStockList);

      let list = this.sellStockList.map(item => {
        return {
          stockId: item.id,
          productCode: item.productCode,
          pic: item.pic,
          pics: item.pics,
          name: item.name,
          priceTran: "",
          saleLogHkPrice: "",
          saleTotalHkPrice: "",
          note: item.note
        };
      });
      this.sellStockList = list;
      console.log(this.sellStockList);
    },
    // 提交銷售單信息
    submitSales(formName) {
      if (this.sellStockList.length == 0) {
        this.$message.error({
          message: "請選擇銷售商品",
          showClose: true,
          duration: 2000
        });
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.sellStockList.forEach(item => {
              this.$set(
                item,
                "sellCurrencyId",
                this.addDataConsign.sellCurrencyId
              );
            });
            this.submitRequest();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    // 添加銷售單請求
    submitRequest() {
      console.log("添加銷售單");
      this.$axios
        .post(this.$store.state.baseCompanyUrl + "/sell/sellOrderSave", {
          sold: this.addDataConsign.sold,
          bill: this.addDataConsign.bill,
          soldTime: this.addDataConsign.soldTime,
          isReceiveCheck: this.addDataConsign.isReceiveCheck == false ? 0 : 1,
          receiveWarehouseId: this.addDataConsign.receiveWarehouseId,
          sellCurrencyId: this.addDataConsign.sellCurrencyId,
          sellStockList: this.sellStockList
        })
        .then(res => {
          console.log("添加銷售單");
          console.log(res);
          if (res.status == 200) {
            this.$message.success({
              message: "添加成功",
              showClose: true,
              duration: 2000
            });

            this.page = 1;
            this.sellStockList = [];
            this.$refs.addSalesTicketForm.resetFields();
            this.$refs.multipleTable.clearSelection();
            this.stockLoc2 = this.stockLocList[0].warehouseId;

            this.searchKey = "";
            this.subTotal = 0;
            this.getNotSoldList();
          }
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
    // 接收公司改變
    companyChange() {
      console.log("公司變化");
      for (const item of this.companyAndWarehouseList) {
        if (item.id == this.addDataConsign.companyId) {
          this.warehouseList = item.warehouseList;
        }
      }
      this.addDataConsign.receiveWarehouseId = null;
    },
    getRowKeys(row) {
      return row.id;
    },
    // 大图
    bigImg(pics) {
      if (pics) {
        let list = pics.split("|").filter(function(s) {
          return s && s.trim();
        });

        return list;
      }
    },
    // 寄賣/銷售为港币
    isSellHKD(item) {
      if (this.addDataConsign.sellCurrencyId == 2) {
        item.saleTotalHkPrice = item.priceTran;
        this.getSubPrice();
      } else {
        item.saleTotalHkPrice = "";
      }
    },

    // 编辑商品信息
    editProduct(item) {
      this.updateId = item.id;
      this.pageSel = 1;

      document
        .getElementById("sendDocumentAddContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    // 编辑成功
    updateSuccess() {
      this.pageSel = 0;
      this.page = 1;
      this.getNotSoldList();
    },

    // 獲取接收公司及倉庫列表
    getCompanyAndWarehouseList() {
      this.$axios
        .get(this.$store.state.baseCompanyUrl + "/sell/receiveCompanyMsgGet")
        .then(res => {
          console.log("接收公司及倉庫");
          console.log(res);
          this.companyAndWarehouseList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      console.log(this.page);
      this.getNotSoldList();
    },
    radioChange() {
      this.page = 1;
    },
    gobackAdd() {
      this.pageSel = 0;
    },
    // 获取库存点
    getStockLocList() {
      this.$axios
        .get(this.baseUrl + "/stockLocList")
        .then(res => {
          console.log("库存列表");
          console.log(res);
          this.stockLocList = res.data;
          this.stockLoc2 = this.stockLocList[0].warehouseId;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 獲取所有未售包包列表
    getNotSoldList() {
      this.$axios
        .post(this.$store.state.baseCompanyUrl + "/sell/unSellStockInList", {
          page: this.page,
          pageNum: 10,
          keyword: this.searchKey,
          stockLocId: this.stockLoc2
        })
        .then(res => {
          console.log("未售包包列表");
          console.log(res);
          this.notSoldBagList = res.data.data;
          this.total = res.data.total;

          document
            .getElementById("sendDocumentAddContainer")
            .scrollIntoView({ behavior: "smooth" });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.new-consignment-container {
  margin-top: 20px;
  border-radius: 6px;

  .sales-ticket-main {
    display: flex;
    justify-content: space-between;

    .sales-ticket-left {
      width: 53%;
      padding: 20px;
      margin-right: 15px;
      background-color: #fff;
      border-radius: 6px;
    }

    .sales-ticket-right {
      width: 45%;
      padding: 20px;
      background-color: #fff;
      border-radius: 6px;
    }
  }
}
</style>
