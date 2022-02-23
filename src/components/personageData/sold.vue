<template>
  <div>
    <div class="onsale-top" style="padding-left: 10px;">
      <span>用户：</span>
      <el-select v-model="userId" @change="radioChange">
        <el-option
          v-for="item in userList"
          :key="item.id"
          :label="item.username"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span>库存地：</span>
      <el-select
        v-model="stockLoc"
        placeholder="请选择"
        @change="radioChange"
        style="margin-bottom: 10px;margin-right: 10px;"
      >
        <el-option
          v-for="(item, index) in stockLocList"
          :key="index"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <span>库存状态：</span>
      <el-select v-model="soldSel" @change="radioChange">
        <el-option
          v-for="item in soldList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <input
        placeholder="输入款式，尺寸，材质，色号，色系，客户，货号可搜索，如：H000001、000001、1"
        class="el-input__inner"
        v-model="searchKey"
        @focus="radioChange"
      />
      <el-button
        type="primary"
        style="background-color: #9695f3;border: 1px solid #9695f3;"
        @click="searchProducts"
        >查询</el-button
      >
    </div>
    <table border="0" cellspacing="0" cellpadding="0" width="100%">
      <tr align="center">
        <th class="th-style">货号</th>
        <th class="th-style">商品展示图</th>
        <th class="th-style">内部图</th>
        <th class="th-style">账单号</th>
        <th class="th-style">商品信息</th>
        <th class="th-style">库存点</th>
        <th class="th-style" style="width: 136px;">库存状态</th>
        <th class="th-style" style="width: 200px;">时间</th>
        <th class="th-style" style="width: 136px;">港币销售价</th>
        <th class="th-style">总成本</th>
        <th class="th-style">利润</th>
        <th class="th-style">在库时长</th>
      </tr>
      <tr v-show="onSaleProducts.length == 0" align="center">
        <td colspan="12" style="font-size:20px;color:#ddd;">
          没有数据要展示哦~
        </td>
      </tr>
      <tr v-for="(item, index) in onSaleProducts" :key="index" align="center">
        <td>{{ item.productCode }}</td>
        <td>
          <div>
            <el-image
              style="width: 100px; height: 100px"
              :src="item.pic.trim()"
              :preview-src-list="bigImg(item.pics)"
              :z-index="5000"
            >
            </el-image>
          </div>
        </td>
        <td>
          <div v-if="item.privateImg !== '' && item.privateImg !== null">
            <el-image
              style="width: 100px; height: 100px"
              :src="item.privatePic.trim()"
              :preview-src-list="bigImg(item.privateImg)"
              :z-index="5000"
            >
            </el-image>
          </div>
        </td>
        <td>{{ item.bill }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.stockLoc }}</td>
        <td style="cursor: pointer;" @click="stateupdate(item)">
          <span class="handle-button">{{
            item.sold == 3 ? "未出库" : "已出库"
          }}</span>
          <img
            src="../../assets/imgs/update.png"
            style="width: 15px;height: 18px;"
          />
        </td>
        <td>
          <p v-if="item.createTime">入库时间：{{ item.createTime }}</p>
          <p v-if="item.soldTime">出售时间：{{ item.soldTime }}</p>
          <p v-if="item.stockOutTime">出库时间：{{ item.stockOutTime }}</p>
        </td>
        <td>
          {{ "HKD " + formatNumberRgx(item.saleTotalHkPrice) }}
          <p v-if="item.customer">客户名称：{{ item.customer }}</p>
        </td>
        <td>
          {{ "HKD " + formatNumberRgx(item.cost) }}
        </td>
        <td>
          {{ "HKD " + money(item.cost, item.saleTotalHkPrice) }}
        </td>
        <td>{{ timeLong(item.createTime) }}</td>
      </tr>
    </table>

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
        <el-form label-width="110px">
          <el-form-item label="库存状态" required>
            <el-select v-model="sold" placeholder="请选择" style="width:100%;">
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
          <el-form-item label="出售时间" :required="sold == 3 ? false : true">
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
              <span>HKD</span>
            </div>
          </el-form-item>
          <el-form-item
            label="出售港币金额"
            :required="sold == 3 ? false : true"
          >
            <div style="display: flex;">
              <el-input
                style="flex: 1;"
                v-model="saleTotalHkPrice"
                placeholder="请输入出售港币金额"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item label="客户姓名" :required="sold == 3 ? false : true">
            <el-autocomplete
              style="width: 100%;"
              v-model="customer"
              :fetch-suggestions="querySearch"
              placeholder="请选择/输入客户姓名"
              @select="handleSelect"
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
          <el-form-item label="出售记录" v-show="sellPaymentList.length > 0">
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
                      <div class="font-warp">{{ scope.row.productDes }}</div>
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
              <el-table-column align="center" prop="totalToHkRate" label="匯率">
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
                label="港幣金額"
              >
                <template slot-scope="scope">
                  <div>
                    {{
                      scope.row.totalHkPrice == "" ||
                      scope.row.totalHkPrice == 0
                        ? "/"
                        : formatNumberRgx(scope.row.totalHkPrice) + " HKD"
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
        <el-button
          @click="dialogStateVisible = false"
          style="width:100px;color:#9695f3;margin-right:10px;"
          >取 消</el-button
        >
        <el-button
          style="width:100px;background:#9695f3;color:#fff;"
          @click="stateupdateSure"
          >确 定
        </el-button>
      </div>
    </el-dialog>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      page: 1,
      pagesize: 10,
      total: 0,
      searchKey: "",
      onSaleProducts: [],
      myList: [],

      userId: null,
      userList: [],
      stockLoc: "",
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
          label: "HKD港元"
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
      isReceiveCheck: false,
      sellPaymentList: []
    };
  },
  created() {
    this.getStockLocList();
    this.getCustomerList();
  },
  methods: {
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

      this.sellPaymentList = item.sellPaymentList;
      this.isReceiveCheck =
        item.isReceiveCheck == 0 || item.isReceiveCheck == null ? false : true;

      this.dialogStateVisible = true;
    },
    dataCheck() {
      // console.log(this.sold);
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
            this.saleTotalHkPrice == "" ||
            this.saleTotalHkPrice == undefined ||
            this.saleTotalHkPrice == null
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
            stockOutTime: this.stockOutTime,
            note: this.note,
            saleLogHkPrice: this.saleLogHkPrice,
            saleTotalHkPrice: this.saleTotalHkPrice,
            isReceiveCheck: this.isReceiveCheck == false ? 0 : 1
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

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
    // 计算时长
    timeLong(time) {
      if (time !== null && time !== "") {
        let startTime = new Date(time); // 开始时间
        let endTime = new Date(); // 结束时间
        let times =
          Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24) + " 天";
        return times;
      } else {
        return "-";
      }
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
          stockLoc: this.stockLoc2,
          userId: this.userId,
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
        .get(this.baseUrl + "/stockLocList")
        .then(res => {
          console.log("库存列表");
          console.log(res);
          this.stockLocList = res.data;
          this.stockLoc = this.stockLocList[0];

          this.getUserList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取用户列表
    getUserList() {
      this.$axios
        .get(this.baseUrl + "/userList")
        .then(res => {
          console.log("用户列表");
          console.log(res);
          this.userList = res.data;
          this.userId = sessionStorage.getItem("userId");
          this.searchProducts();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.handle-button {
  color: #9695f3;
  font-size: 16px;
}

thead,
th,
td {
  font-weight: normal;
  padding: 5px 10px;
  margin-right: 100px;
}

tr {
  margin-top: 30px;
}

td {
  width: 100px;
  font-size: 16px;
}

.onsale-top {
  margin-top: 38px;
  margin-left: 40px;

  .onsale-top-radio {
    margin-right: 80px;
    font-size: 16px;
    color: #000;
  }

  .el-input__inner {
    width: 670px;
    height: 40px;
    -webkit-appearance: none;
    background-color: #fff;
    background-image: url("../../assets/imgs/search2.png");
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: 15px center;
    border-radius: 30px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    line-height: 40px;
    outline: 0;
    padding: 0 0 0 45px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    font-size: 15px;
  }
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
  color: #9695f3;
  cursor: pointer;
}
</style>
