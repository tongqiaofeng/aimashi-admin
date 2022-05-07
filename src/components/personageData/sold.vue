<template>
  <div style="margin-top: -20px;overflow: hidden;" id="soldContainer">
    <div class="sold-container">
      <div v-if="pageSel == 0">
        <div>
          <el-form inline>
            <el-form-item label="库存地：">
              <el-cascader
                v-model="stockLocId"
                :options="stockLocList"
                :props="{
                  value: 'id',
                  label: 'name',
                  children: 'warehouseList',
                  checkStrictly: true
                }"
                @change="radioChange"
                clearable
                popper-class="disableFirstLevel"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="库存状态：">
              <el-select v-model="soldSel" @change="radioChange">
                <el-option
                  v-for="item in soldList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input
                style="width: 600px;"
                placeholder="输入款式，尺寸，材质，色号，色系，客户，货号可搜索，如：H000001、000001、1"
                v-model="searchKey"
                @focus="radioChange"
              ></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="searchProducts">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="onSaleProducts" style="width: 100%" border>
          <el-table-column align="center" prop="productCode" label="货号">
          </el-table-column>
          <el-table-column align="center" prop="pic" label="图片">
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
            width="300px"
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
          <el-table-column align="center" prop="stockLocId" label="库存点">
            <template slot-scope="scope">
              <div>
                {{ stockReg(scope.row.stockLocId) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="bill" label="账单号">
          </el-table-column>
          <el-table-column align="center" prop="customer" label="客户名称">
            <template slot-scope="scope">
              <div>
                {{ scope.row.customer ? scope.row.customer : "-" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sold" label="库存状态">
            <template slot-scope="scope">
              <div>
                <div style="cursor: pointer;" @click="stateupdate(scope.row)">
                  <span class="handle-button">{{
                    scope.row.sold == 3 ? "未出库" : "已出库"
                  }}</span>
                  <img
                    src="../../assets/imgs/update.png"
                    style="width: 15px;height: 18px;"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="editProduct(scope.row.id)"
                  >编辑</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          title="库存数据"
          v-if="dialogStateVisible"
          :visible.sync="dialogStateVisible"
          width="800px"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          :modal-append-to-body="false"
          :append-to-body="false"
        >
          <div>
            <el-form label-width="121px">
              <el-form-item label="库存状态" required>
                <el-select
                  v-model="sold"
                  placeholder="请选择"
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in soldList2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="账单号" :required="sold == 3 ? false : true">
                <el-input v-model="bill"></el-input>
              </el-form-item>
              <el-form-item
                label="出售时间"
                :required="sold == 3 ? false : true"
              >
                <el-date-picker
                  v-model="soldTime"
                  type="date"
                  placeholder="请选择日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  style="width:100%;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="出售外币金额">
                <div style="width:100%;display: flex;">
                  <el-input
                    type="text"
                    style="flex: 1;"
                    placeholder="请输入出售外币金额"
                    v-model="priceTran"
                    clearable
                    @change="isSellHKD"
                  ></el-input>
                  <el-select
                    v-model="sellCurrencyId"
                    placeholder="请选择"
                    clearable
                    @change="isSellHKD"
                  >
                    <el-option
                      v-for="item in currencyIds"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="是否收款完成">
                <el-switch v-model="isReceiveCheck"></el-switch>
              </el-form-item>
              <!-- 物流费/银行手续费送货(HKD) -->
              <el-form-item label="物流费/手续费">
                <div style="display: flex;">
                  <el-input
                    style="flex: 1;"
                    v-model="saleLogHkPrice"
                    placeholder="请输入物流费/银行手续费送货"
                  ></el-input>
                  <span>{{ currencyGlobal }}</span>
                </div>
              </el-form-item>
              <el-form-item
                :label="'出售' + currencyFontRgx(currencyGlobal) + '金额'"
                :required="isHeadConsigns != 1 && sold == 4 ? true : false"
              >
                <div style="display: flex;">
                  <el-input
                    style="flex: 1;"
                    v-model="saleTotalHkPrice"
                    :placeholder="
                      '请输入出售' + currencyFontRgx(currencyGlobal) + '金额'
                    "
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item
                :label="'出售' + currencyFontRgx(headCurrency) + '金额'"
                :required="sold == 3 ? false : true"
                v-if="isHeadConsigns == 1"
              >
                <div style="display: flex;">
                  <el-input
                    style="flex: 1;"
                    v-model="headSellMoney"
                    :placeholder="
                      '请输入出售' +
                        currencyFontRgx(headCurrency) +
                        '金额，用于与总公司结算'
                    "
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="
                销售人员
              "
                :required="sold == 3 ? false : true"
              >
                <el-select
                  style="width: 100%;"
                  v-model="sellerId"
                  placeholder="请选择销售人员"
                >
                  <el-option
                    v-for="item in sellerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="客户姓名"
                :required="sold == 3 ? false : true"
              >
                <el-autocomplete
                  style="width: 100%;"
                  v-model="customer"
                  :fetch-suggestions="querySearch"
                  placeholder="请选择/输入客户姓名"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item
                label="
                客户类型
              "
                :required="sold == 3 ? false : true"
              >
                <el-autocomplete
                  style="width: 100%;"
                  v-model="customerType"
                  :fetch-suggestions="queryCustomerTypeSearch"
                  placeholder="请选择/输入客户类型"
                  @select="handleCustomerTypeSelect"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="出库时间" required v-if="sold == 4">
                <el-date-picker
                  v-model="stockOutTime"
                  type="date"
                  style="width:100%;"
                  placeholder="请选择日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  style="width:100%;"
                  v-model="note"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="出售记录"
                v-show="sellPaymentList.length > 0"
              >
                <el-table :data="sellPaymentList" style="width: 100%;">
                  <el-table-column
                    align="center"
                    prop="time"
                    label="日期"
                    width="200px"
                  >
                    <template slot-scope="scope">
                      <div>
                        <div>
                          {{ scope.row.time }}
                        </div>
                        <div>
                          {{ "【" + scope.row.personName + "】" }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="200px"
                    align="center"
                    prop="productDes"
                    label="產品描述"
                  >
                    <template slot-scope="scope">
                      <div>
                        <el-tooltip
                          class="item"
                          effect="light"
                          :content="scope.row.productDes"
                          placement="top-end"
                        >
                          <div class="font-warp">
                            {{ scope.row.productDes }}
                          </div>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="money" label="外幣金額">
                    <template slot-scope="scope">
                      <div>
                        {{
                          scope.row.money == "" || scope.row.money == 0
                            ? "/"
                            : formatNumberRgx(scope.row.money) +
                              " " +
                              scope.row.currency
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="totalToHkRate"
                    label="匯率"
                  >
                    <template slot-scope="scope">
                      <div>
                        {{
                          scope.row.totalToHkRate == "" ||
                          scope.row.totalToHkRate == 0
                            ? "/"
                            : scope.row.totalToHkRate
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="totalHkPrice"
                    :label="currencyFontRgx(currencyGlobal) + '金額'"
                  >
                    <template slot-scope="scope">
                      <div>
                        {{
                          scope.row.totalHkPrice == "" ||
                          scope.row.totalHkPrice == 0
                            ? "/"
                            : formatNumberRgx(scope.row.totalHkPrice) +
                              " " +
                              currencyGlobal
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="receiveType"
                    label="交易方式"
                  >
                  </el-table-column>
                  <el-table-column
                    width="200px"
                    align="center"
                    prop="remark"
                    label="Remarks"
                  >
                    <template slot-scope="scope">
                      <div>
                        <el-tooltip
                          class="item"
                          effect="light"
                          :content="scope.row.remark"
                          placement="top-end"
                        >
                          <div class="font-warp">{{ scope.row.remark }}</div>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer">
            <el-button @click="dialogStateVisible = false">取 消</el-button>
            <el-button type="primary" @click="stateupdateSure"
              >确 定
            </el-button>
          </div>
        </el-dialog>
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
      <div v-else>
        <details-vue
          :updatesId="updateId"
          @goback="goback"
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
      page: 1,
      pagesize: 10,
      total: 0,
      searchKey: "",
      onSaleProducts: [],
      myList: [],

      stockLocId: [],
      stockLocList: [],
      soldSel: "",
      sold: "",
      soldList: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "未出库",
          value: "3"
        },
        {
          label: "已出库",
          value: "4"
        }
      ],
      soldList2: [
        {
          label: "未出库",
          value: "3"
        },
        {
          label: "已出库",
          value: "4"
        }
      ],
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
      dialogStateVisible: false,
      updateStateId: null,
      sellCurrencyId: "",
      priceTran: "",
      customer: "",
      soldTime: null,
      stockOutTime: null,
      note: "",
      createTime: "",
      bill: "",

      saleLogHkPrice: "",
      saleTotalHkPrice: "",
      headSellMoney: "",
      isHeadConsigns: 0,
      headCurrency: "",
      isReceiveCheck: false,
      sellPaymentList: [],

      isUpdateOrDel: null,
      updateId: null,
      pageSel: 0,
      currencyGlobal: "",

      sellerId: "",
      sellerList: [],
      customerTypeList: [],
      customerType: ""
    };
  },
  created() {
    this.currencyGlobal = sessionStorage.getItem("currencyGlobal");
    this.getStockLocList();
    this.getCustomerList();
    this.getSellerAndCustomerType();
  },
  methods: {
    // 编辑
    editProduct(id) {
      this.updateId = id;
      this.pageSel = 1;

      document
        .getElementById("soldContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    // 编辑成功
    updateSuccess(val) {
      console.log(val);
      this.pageSel = 0;
      this.searchProducts();
    },
    goback() {
      this.pageSel = 0;
    },
    // 获取客户列表
    getCustomerList() {
      this.$axios
        .get(this.baseUrl + "/consumerListGet")
        .then(res => {
          console.log("客户列表");
          console.log(res);
          this.customerList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 客户姓名輸入/匹配
    querySearch(queryString, cb) {
      console.log(typeof queryString);
      let restaurants = this.customerList;

      for (let items of restaurants) {
        items.value = items.name;
      }

      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
      this.customer = item.value;
    },

    // 获取销售人员及客户类型
    getSellerAndCustomerType() {
      this.$axios
        .get(this.baseUrl + "/sellerCustomerTypeList")
        .then(res => {
          console.log("销售人员及客户类型列表");
          console.log(res);
          this.sellerList = res.data.sellerList;
          this.customerTypeList = res.data.customerTypeList;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 客户类型輸入/匹配
    queryCustomerTypeSearch(queryString, cb) {
      console.log(typeof queryString);
      let restaurants = this.customerTypeList;

      for (let items of restaurants) {
        items.value = items.name;
      }

      let results = queryString
        ? restaurants.filter(this.createCustomerTypeFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createCustomerTypeFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleCustomerTypeSelect(item) {
      console.log(item);
      this.customerType = item.value;
    },

    // 出售为港币
    isSellHKD() {
      if (this.sellCurrencyId == 2) {
        this.saleTotalHkPrice = this.priceTran;
      } else {
        this.saleTotalHkPrice = undefined;
      }
    },
    // 币种显示
    currencyShow(item) {
      for (let i = 0; i < this.currencyIds.length; ++i) {
        if (item == this.currencyIds[i].value) return this.currencyIds[i].label;
      }
      return "";
    },
    radioChange() {
      this.page = 1;
    },
    // 库存状态修改
    stateupdate(item) {
      console.log("数据");
      console.log(item);
      let companys = sessionStorage.getItem("companyId");
      if (item.companyId != companys) {
        this.$message.error({
          message: "该商品不在您所管理的仓库中，不可进行修改",
          showClose: true,
          duration: 2000
        });
      } else {
        this.updateStateId = item.id;
        this.sold = item.sold;
        this.bill = item.bill;
        this.createTime = item.createTime;
        this.priceTran = item.priceTran;
        this.customer = item.customer;
        this.soldTime = item.soldTime;
        this.sellCurrencyId = item.sellCurrencyId;

        this.stockOutTime = item.stockOutTime;
        this.note = item.note;
        this.saleLogHkPrice = item.saleLogHkPrice;
        this.saleTotalHkPrice = item.saleTotalHkPrice;
        this.headSellMoney = item.headSellMoney == 0 ? "" : item.headSellMoney;
        this.isHeadConsigns = item.isHeadConsigns;
        this.headCurrency = item.headCurrency;

        this.sellPaymentList = item.sellPaymentList;
        this.isUpdateOrDel = item.isUpdateOrDel;

        this.isReceiveCheck =
          item.isReceiveCheck == 0 || item.isReceiveCheck == null
            ? false
            : true;
        this.sellerId = item.sellerId;
        this.customerType = item.customerType;

        this.dialogStateVisible = true;
      }
    },
    dataCheck() {
      if (this.sold == null) {
        this.$message.error({
          message: "请选择库存状态",
          showClose: true,
          duration: 2000
        });
        return 1;
      } else {
        if (this.sold == 4) {
          if (
            this.soldTime == "" ||
            this.soldTime == null ||
            this.customer == "" ||
            this.customer == null ||
            this.stockOutTime == "" ||
            this.stockOutTime == null ||
            this.bill == "" ||
            this.bill == null ||
            ((this.saleTotalHkPrice == "" ||
              this.saleTotalHkPrice == undefined ||
              this.saleTotalHkPrice == null) &&
              this.isHeadConsigns != 1) ||
            ((this.headSellMoney == "" ||
              this.headSellMoney == undefined ||
              this.headSellMoney == null) &&
              this.isHeadConsigns == 1) ||
            this.sellerId == "" ||
            this.sellerId == null ||
            this.customerType == "" ||
            this.customerType == null
          ) {
            this.$message.error({
              message: "数据不能为空，请检查数据填写",
              showClose: true,
              duration: 2000
            });
            return 1;
          }
        }
      }
    },
    // 不足六位数补0
    PrefixInteger(num) {
      return (Array(6).join("0") + num).slice(-6);
    },
    // 确定修改
    stateupdateSure() {
      if (this.isUpdateOrDel === -1) {
        this.$message.error({
          message: "该商品不在您所管理的仓库中，不可进行修改",
          showClose: true,
          duration: 2000
        });
        this.dialogStateVisible = false;
      } else {
        if (this.dataCheck() !== 1) {
          this.$axios
            .put(this.baseUrl + "/stateSave", {
              id: this.updateStateId,
              sold: this.sold,
              bill: this.bill,
              createTime: this.createTime,
              priceTran: this.priceTran,
              customer: this.customer,
              soldTime: this.soldTime,
              sellCurrencyId: this.sellCurrencyId,
              stockOutTime: this.sold == 8 ? this.soldTime : this.stockOutTime,
              note: this.note,
              saleLogHkPrice: this.saleLogHkPrice,
              saleTotalHkPrice: this.saleTotalHkPrice,
              headSellMoney: this.headSellMoney,
              isReceiveCheck: this.isReceiveCheck == false ? 0 : 1,
              sellerId: this.sellerId,
              customerType: this.customerType
            })
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                this.$message.success({
                  message: "修改成功",
                  showClose: true,
                  duration: 2000
                });
                this.dialogStateVisible = false;
                this.searchProducts();
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
        }
      }
    },
    // 大图
    bigImg(pics) {
      // console.log(pics);
      let list = pics.split("|").filter(function(s) {
        return s && s.trim();
      });

      return list;
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      console.log(this.page);
      this.searchProducts();

      document
        .getElementById("soldContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    // 利润计算
    money(x, y) {
      let money = y - x;
      return this.formatNumberRgx(money);
    },
    // 模糊查询
    searchProducts() {
      console.log("111");
      this.$axios
        .post(this.baseUrl + "/sellSearch", {
          keyword: this.searchKey,
          page: this.page,
          pageNum: 10,
          stockLocId: this.stockLocId
            ? this.stockLocId.length == 2
              ? this.stockLocId[1]
              : null
            : null,
          companyId: this.stockLocId
            ? this.stockLocId.length == 1 && this.stockLocId[0] != -1
              ? this.stockLocId[0]
              : null
            : null,
          sold: this.soldSel
        })
        .then(res => {
          console.log("已出售商品");
          console.log(res);
          this.onSaleProducts = res.data.list;
          this.total = res.data.total;
          console.log(this.onSaleProducts);
        });
    },
    // 获取库存点
    getStockLocList() {
      this.$axios
        .get(this.baseUrl + "/stockSearchLocList")
        .then(res => {
          console.log("库存列表");
          console.log(res);
          this.stockLocList = res.data;
          this.stockLocId = [];

          if (this.stockLocList.length > 0) {
            this.stockLocList[0].warehouseList = undefined;

            let companyId = Number(sessionStorage.getItem("companyId"));

            this.stockLocId.push(companyId);
          }

          this.searchProducts();
          this.getStockLocSelfList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取所有公司库存点
    getStockLocSelfList() {
      this.$axios
        .get(this.baseUrl + "/stockLocList")
        .then(res => {
          console.log("自己公司库存地列表");
          console.log(res);
          this.stockLocs = res.data;
          if (this.stockLocs.length > 0) {
            this.stockLocs.splice(0, 1);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 库存地名称匹配
    stockReg(item) {
      for (let i = 0; i < this.stockLocs.length; ++i) {
        if (item == this.stockLocs[i].warehouseId)
          return this.stockLocs[i].warehouseName;
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
.sold-container {
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 6px;
}

.th-style {
  width: 100px;
  margin-right: 100px;
  font-size: 18px;
}
</style>
<style lang="scss">
.el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 110px;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  margin: auto 0;
}

.el-form-item .el-form-item {
  margin-bottom: 10px;
}

.el-dialog--center .el-dialog__body {
  text-align: initial;
  padding: 28px 25px 40px;
}

.el-pager li.active {
  color: #409eff;
  cursor: pointer;
}
</style>
