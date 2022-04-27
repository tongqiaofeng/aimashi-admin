<template>
  <div style="margin-top: -20px;overflow: hidden;" id="billEntryContainer">
    <div class="bill-entry-container">
      <!-- <div>账单录入</div> -->
      <div class="container-left">
        <el-form
          ref="billForm"
          :model="billData"
          :rules="billRules"
          label-width="110px"
        >
          <el-form-item label="賬單日期" prop="time">
            <el-date-picker
              type="date"
              placeholder="請選擇賬單日期"
              v-model="billData.time"
              style="width:100%;"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交易類型" prop="tradeType">
            <el-select
              style="width:100%;"
              v-model="billData.tradeType"
              placeholder="請選擇"
              @change="tradeTypeChange"
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="personShow()" prop="personId">
            <el-select
              style="width:100%;"
              v-model="billData.personId"
              placeholder="請選擇"
              clearable
              @change="personChange"
            >
              <el-option
                v-for="(item, index) in userList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="收款賬戶"
            v-show="billData.tradeType == 2"
            prop="payeeId"
          >
            <el-select
              style="width:100%;"
              v-model="billData.payeeId"
              placeholder="請選擇"
              @change="isSam"
            >
              <el-option
                v-for="(item, index) in userList"
                :key="index"
                :label="item.name"
                :value="item.id"
                v-show="item.id != billData.personId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交易方式" prop="receiveType">
            <el-autocomplete
              style="width: 100%;"
              class="inline-input"
              v-model="billData.receiveType"
              :fetch-suggestions="querySearch"
              placeholder="請選擇/輸入內容"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item
            label="產品貨號"
            prop="productCode"
            v-show="accountNumberType == 1"
          >
            <div class="code-table">
              <div class="every1">
                <span style="color: red;">*</span>
                貨號
              </div>
              <div class="every2">
                外幣金額
              </div>
              <div class="every3">外幣轉{{ companyCurrency }}匯率</div>
              <div class="every4">
                <span
                  style="color: red;"
                  v-show="
                    billData.tradeType != 2 &&
                      billData.tradeType != 5 &&
                      billData.tradeType != 6
                  "
                  >*</span
                >{{ companyCurrency }}金額
              </div>
              <div class="every5">
                操作
              </div>
            </div>
            <div
              class="code-table"
              style="margin-top: 5px;"
              v-for="(items, index) in billData.stockList"
              :key="index"
            >
              <div class="every1">
                <el-input
                  v-model="items.productCode"
                  placeholder="請輸入"
                  @change="searchCode(items.productCode, index)"
                ></el-input>
              </div>
              <div class="every2">
                <el-input
                  v-model="items.money"
                  placeholder="請輸入"
                  @change="tablePriceChange(items)"
                ></el-input>
                <el-select
                  v-model="billData.currencyId"
                  placeholder="請選擇幣種"
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
              <div class="every3">
                <el-input
                  v-model="billData.totalToHkRate"
                  placeholder="請輸入"
                  @input="hkRateTableNum"
                ></el-input>
              </div>
              <div class="every4">
                <el-input
                  v-model="items.totalHkPrice"
                  placeholder="請輸入"
                  @change="tablePriceChange(items)"
                ></el-input>
              </div>
              <div class="every5">
                <img
                  src="../../assets/imgs/add.png"
                  style="width: 30px;height: 30px;cursor: pointer;"
                  @click="addCode"
                  v-if="index == 0"
                />
                <el-button type="text" @click="delCode(index)" v-else
                  >刪除</el-button
                >
              </div>
            </div>
            <el-dialog
              title="提示"
              :visible.sync="dialogCodeVisible"
              width="520px"
            >
              <div style="text-align: center;font-size: 16px;">
                未查找到{{ productCode }}，請檢查貨號輸入是否正確
              </div>
              <div slot="footer">
                <el-button
                  type="primary"
                  @click="dialogCodeVisible = false"
                  class="sure-button"
                  >確 定</el-button
                >
              </div>
            </el-dialog>
          </el-form-item>
          <el-form-item
            label="產品描述"
            prop="productDes"
            v-show="accountNumberType == 1"
          >
            <el-input
              style="width:100%;"
              type="textarea"
              v-model="billData.productDes"
              placeholder="產品描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="外幣金額" prop="money">
            <div style="display: flex;">
              <el-input
                v-model="billData.money"
                placeholder="請輸入外幣金額"
                @change="hkMoneyNum"
              ></el-input>
              <el-select
                v-model="billData.currencyId"
                placeholder="請選擇金額幣種"
                :disabled="
                  accountNumberType == 1
                    ? billData.tradeType == 0 ||
                      billData.tradeType == 1 ||
                      billData.tradeType == 3 ||
                      billData.tradeType == 4
                      ? true
                      : false
                    : false
                "
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
          <el-form-item
            :label="'外幣轉' + companyCurrency + '匯率'"
            prop="totalToHkRate"
            v-if="
              billData.stockList.length > 0
                ? billData.stockList[0].productCode == ''
                : productCodeIsNull
            "
          >
            <el-input
              v-model="billData.totalToHkRate"
              placeholder="請輸入"
              @input="hkMoneyNum"
            ></el-input>
          </el-form-item>
          <el-form-item :label="companyCurrency + '金額'" prop="totalHkPrice">
            <el-input
              style="width:100%;"
              v-model="billData.totalHkPrice"
              placeholder="請輸入金額"
              @change="hkNum"
            ></el-input>
          </el-form-item>
          <el-form-item label="備註" prop="remark">
            <el-input
              style="width:100%;"
              type="textarea"
              v-model="billData.remark"
              placeholder="請輸入備註信息"
            ></el-input>
          </el-form-item>
        </el-form>
        <div
          style="display: flex;justify-content: flex-end;padding-bottom: 30px;text-align: right;"
        >
          <el-button type="primary" @click="clearForm">
            重置
          </el-button>
          <el-button v-if="billData.id" type="primary" @click="updateBillSure"
            >修改</el-button
          >
          <el-button v-else type="primary" @click="submitData">提交</el-button>
        </div>
      </div>
      <div class="container-right">
        <el-table
          :data="billList"
          style="width: 100%"
          tooltip-effect="dark"
          border
          highlight-current-row
          @row-click="delBill"
          @row-dblclick="updateBill"
        >
          <el-table-column align="center" prop="time" label="賬單日期">
          </el-table-column>
          <el-table-column align="center" prop="tradeType" label="交易類型">
            <template slot-scope="scope">
              <div>
                {{ tradeTypeRgx(scope.row.tradeType) }}
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
            prop="totalHkPrice"
            :label="companyCurrency + '金額'"
          >
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.totalHkPrice == "" || scope.row.totalHkPrice == 0
                    ? "/"
                    : formatNumberRgx(scope.row.totalHkPrice) +
                      " " +
                      currencyGlobal
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template>
              <div>
                <span style="color:#409EFF;cursor: pointer;">刪除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="刪除該賬單"
          :visible.sync="dialogDelVisible"
          width="500px"
        >
          <div style="text-align: center;font-size: 16px;">
            確定刪除該賬單？刪除後不能恢復
          </div>
          <div slot="footer">
            <el-button @click="dialogDelVisible = false">取 消</el-button>
            <el-button type="primary" @click="delBillSure">確 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      productCode: "",
      dialogCodeVisible: false,
      isClick: false,

      billData: {
        personId: "",
        time: new Date(),
        tradeType: "",
        payeeId: "",
        productDes: "",
        money: "",
        currencyId: "",
        totalToHkRate: "",
        totalHkPrice: "",
        receiveType: "",
        remark: "",
        stockList: [
          {
            stockId: null,
            productCode: "",
            money: "",
            totalHkPrice: "",
            saleTotalHkMoney: 0
          }
        ]
      },
      billRules: {
        personId: [
          {
            required: true,
            message: "請選擇賬戶",
            trigger: "change"
          }
        ],
        time: [
          {
            required: true,
            message: "請選擇賬單日期",
            trigger: "change"
          }
        ],
        tradeType: [
          {
            required: true,
            message: "請選擇交易類型",
            trigger: "change"
          }
        ],
        payeeId: [
          {
            required: false,
            message: "請選擇收款賬戶",
            trigger: "change"
          }
        ],
        money: [
          {
            required: false,
            message: "請輸入外幣金額",
            trigger: "blur"
          }
        ],
        totalHkPrice: [
          {
            required: true,
            message: "請輸入金額",
            trigger: "blur"
          }
        ]
      },
      userList: [],
      typeList: [
        {
          label: "買入",
          value: 0
        },
        {
          label: "賣出",
          value: 1
        },
        {
          label: "轉賬",
          value: 2
        },
        {
          label: "買入退款",
          value: 3
        },
        {
          label: "賣出退款",
          value: 4
        },
        {
          label: "其他收入",
          value: 5
        },
        {
          label: "其他支出",
          value: 6
        }
      ],
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
      meansList: [],
      billList: [],

      dialogDelVisible: false,
      delId: null,

      productCodeIsKong: false,
      productCodeIsNull: true,
      saleHkMoneyTotal: 0,

      personType: null,
      payeeType: null,
      personCurrency: null,
      payeeCurrency: null,
      companyCurrency: "",

      accountNumberType: null,
      currencyGlobal: ""
    };
  },
  created() {
    this.currencyGlobal = sessionStorage.getItem("currencyGlobal");
    this.$nextTick(() => {
      document
        .getElementById("billEntryContainer")
        .scrollIntoView({ behavior: "smooth" });
    });

    this.getBillUserList();
    this.getMeansList();

    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d = date.getDate();
    d = d < 10 ? "0" + d : d;
    const time = y + "-" + m + "-" + d;
    this.billData.time = time;
    this.accountNumberType = sessionStorage.getItem("type");
  },
  methods: {
    // 支出賬戶/收款賬戶
    personShow() {
      if (
        this.billData.tradeType == 1 ||
        this.billData.tradeType == 3 ||
        this.billData.tradeType == 5
      ) {
        return "收款賬戶";
      } else if (
        this.billData.tradeType == 0 ||
        this.billData.tradeType == 2 ||
        this.billData.tradeType == 4 ||
        this.billData.tradeType == 6
      ) {
        return "支出賬戶";
      }
    },
    // 修改賬單
    updateBill(row, column) {
      this.isClick = false;

      this.billData = JSON.parse(JSON.stringify(row));
      if (this.billData.stockList.length == 0) {
        this.billData.stockList = [
          {
            stockId: null,
            productCode: "",
            money: "",
            totalHkPrice: "",
            saleTotalHkMoney: 0
          }
        ];
        this.productCodeIsNull = true;
      } else {
        this.productCodeIsNull = false;
      }
    },
    // 確定修改
    updateBillSure() {
      if (
        this.isClick == true &&
        this.billData.stockList[0].productCode != ""
      ) {
        this.$message.error({
          message: "有貨號查詢產品描述失敗，請檢查貨號是否正確",
          showClose: true,
          duration: 5000
        });
      } else {
        this.isKong();
        if (!this.productCodeIsKong) {
          console.log("通過");
          this.updateData();
        } else {
          console.log("不通過");
          this.billData.stockList = [
            {
              stockId: null,
              productCode: "",
              money: "",
              totalHkPrice: "",
              saleTotalHkMoney: 0
            }
          ];
        }
      }
    },
    // 确定修改数据
    updateData() {
      this.$refs["billForm"].validate(valid => {
        if (valid) {
          this.$axios
            .post(this.baseUrl + "/billSave", this.billData)
            .then(res => {
              console.log("修改賬單信息");
              console.log(res);
              if (res.status === 200) {
                this.$message.success({
                  message: "賬單信息修改成功",
                  showClose: true,
                  duration: 2000
                });
                let name = this.billData.personId;

                this.$refs.billForm.resetFields();
                this.billData.id = null;
                this.billData.currencyId = "";
                this.billData.totalToHkRate = "";
                this.billData.stockList = [
                  {
                    stockId: null,
                    productCode: "",
                    money: "",
                    totalHkPrice: "",
                    saleTotalHkMoney: 0
                  }
                ];

                this.billData.personId = name;

                this.getBillList();

                document
                  .getElementById("billEntryContainer")
                  .scrollIntoView({ behavior: "smooth" });
              }
            })
            .catch(err => {
              console.log(err);
              this.billData.stockList = [
                {
                  stockId: null,
                  productCode: "",
                  money: "",
                  totalHkPrice: "",
                  saleTotalHkMoney: 0
                }
              ];
              this.$message.error({
                message: err.data.status,
                showClose: true,
                duration: 3000
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除账单
    delBill(row, column) {
      this.isClick = false;
      if (column.label == "操作") {
        this.delId = row.id;
        this.dialogDelVisible = true;
      }
    },
    // 確定刪除
    delBillSure() {
      this.$axios
        .get(this.baseUrl + "/billDelete?id=" + this.delId)
        .then(res => {
          console.log("刪除賬單信息");
          console.log(res);
          if (res.status === 200) {
            this.$message.success({
              message: "賬單刪除成功",
              showClose: true,
              duration: 2000
            });
            this.dialogDelVisible = false;

            this.getBillList();

            document
              .getElementById("billEntryContainer")
              .scrollIntoView({ behavior: "smooth" });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 3000
          });
        });
    },
    // 重置表單
    clearForm() {
      let name = this.billData.personId;

      this.$refs.billForm.resetFields();
      this.billData.id = null;
      this.billData.currencyId = "";
      this.billData.totalToHkRate = "";
      this.billData.stockList = [
        {
          stockId: null,
          productCode: "",
          money: "",
          totalHkPrice: "",
          saleTotalHkMoney: 0
        }
      ];

      this.billData.personId = name;
      console.log(this.billData);
    },
    // 提交數據
    submitData() {
      if (
        this.isClick == true &&
        this.billData.stockList[0].productCode != ""
      ) {
        this.$message.error({
          message: "有貨號查詢產品描述失敗，請檢查貨號是否正確",
          showClose: true,
          duration: 5000
        });
      } else {
        this.billData.id = null;
        this.isKong();
        if (this.productCodeIsKong == false) {
          console.log("通過");
          this.submitFormData();
        } else {
          console.log("不通過");
          if (this.billData.stockList.length == 0) {
            this.billData.stockList = [
              {
                stockId: null,
                productCode: "",
                money: this.billData.money,
                totalHkPrice: this.billData.totalHkPrice,
                saleTotalHkMoney: 0
              }
            ];
          }
        }
      }
    },
    // 确定提交数据
    submitFormData() {
      this.$refs["billForm"].validate(valid => {
        if (valid) {
          this.$axios
            .post(this.baseUrl + "/billSave", this.billData)
            .then(res => {
              console.log("提交賬單信息");
              console.log(res);
              if (res.status === 200) {
                this.$message.success({
                  message: "賬單錄入成功",
                  showClose: true,
                  duration: 2000
                });

                let name = this.billData.personId;

                this.$refs.billForm.resetFields();
                this.billData.currencyId = "";
                this.billData.totalToHkRate = "";
                this.billData.stockList = [
                  {
                    stockId: null,
                    productCode: "",
                    money: "",
                    totalHkPrice: "",
                    saleTotalHkMoney: 0
                  }
                ];

                this.billData.personId = name;

                this.getBillList();

                document
                  .getElementById("billEntryContainer")
                  .scrollIntoView({ behavior: "smooth" });
              }
            })
            .catch(err => {
              console.log(err);
              if (this.billData.stockList.length == 0) {
                this.billData.stockList = [
                  {
                    stockId: null,
                    productCode: "",
                    money: this.billData.money,
                    totalHkPrice: this.billData.totalHkPrice,
                    saleTotalHkMoney: 0
                  }
                ];
              }
              this.$message.error({
                message: err.data.status,
                showClose: true,
                duration: 3000
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 驗證數據
    isKong() {
      this.productCodeIsKong = false;

      if (this.billData.stockList[0].productCode == "") {
        this.billData.stockList = [];
        this.productCodeIsNull = true;
      } else {
        this.productCodeIsNull = false;

        for (const item of this.billData.stockList) {
          // 賬號為Sam
          if (this.billRules.money[0].required == true) {
            if (item.money == "" || item.money == 0) {
              this.$message.error({
                message: "產品貨號列表外幣金額不能為空，請輸入",
                showClose: true,
                duration: 2000
              });
              this.productCodeIsKong = true;
            }
          } else {
            this.productCodeIsKong = false;
          }

          // 交易類型為  買入/賣出相關
          if (
            this.billData.tradeType != 2 &&
            this.billData.tradeType != 5 &&
            this.billData.tradeType != 6
          ) {
            if (item.totalHkPrice == "") {
              this.$message.error({
                message:
                  "產品貨號列表" +
                  this.companyCurrency +
                  "金額不能為空，請輸入",
                showClose: true,
                duration: 2000
              });
              this.productCodeIsKong = true;
            }
          } else {
            this.productCodeIsKong = false;
          }
        }

        if (this.billData.tradeType == 2) {
          this.saleHkMoneyTotal = 0;

          // reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
          // 參數一：必需。用于执行每个数组元素的函数。 c: 必需,初始值/计算结束后的返回值。item	必需,当前元素
          // 參數二：可选。传递给函数的初始值
          this.saleHkMoneyTotal = this.billData.stockList.reduce(
            (c, item) => c + item.saleTotalHkMoney * 1,
            0
          );

          if (this.billData.totalHkPrice != this.saleHkMoneyTotal) {
            this.productCodeIsKong = true;
            let msg =
              "產品列表出售總金額為：" +
              this.saleHkMoneyTotal +
              this.currencyGlobal +
              " ，您的轉賬金額為：" +
              this.billData.totalHkPrice +
              this.currencyGlobal +
              " ，兩者不相等，是否確定繼續提交？";
            this.$confirm(msg, "提示", {
              confirmButtonText: "確定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.productCodeIsKong = false;
                if (this.billData.id) {
                  this.updateData();
                } else {
                  this.submitFormData();
                }
              })
              .catch(() => {
                console.log("取消提交");
              });
            return;
          } else {
            this.productCodeIsKong = false;
          }
        }
      }
    },

    // 交易方式輸入/匹配
    querySearch(queryString, cb) {
      console.log(typeof queryString);
      let restaurants = this.meansList;

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
      this.billData.receiveType = item.value;
    },
    // 賬戶類型為其他和員工
    personChange() {
      this.getBillList();
      let companyCurrencyId;
      for (const item of this.userList) {
        if (item.id == this.billData.personId) {
          console.log(item);
          this.personType = item.type;
          this.personCurrency = item.currencyId;
          companyCurrencyId = item.companyCurrencyId;

          console.log(companyCurrencyId);
          for (const ite of this.currencyIds) {
            if (ite.value === companyCurrencyId) {
              let reg = /[\u4e00-\u9fa5]/g;
              this.companyCurrency = ite.label.match(reg).join("");
            }
          }

          if (
            this.billData.tradeType == 2 &&
            this.billData.payeeId != "" &&
            this.billData.payeeId != null
          ) {
            if (this.personCurrency == 2) {
              this.billData.currencyId = this.payeeCurrency;
            } else if (this.payeeCurrency == 2) {
              this.billData.currencyId = this.personCurrency;
            } else {
              if (this.personCurrency != this.payeeCurrency) {
                this.$message.error({
                  message: "支出賬戶與收款賬戶結算幣種不同，不能轉賬"
                });
              } else {
                this.billData.currencyId = Number(item.currencyId);
              }
            }
          } else {
            this.billData.currencyId = Number(item.currencyId);
          }

          if (item.type == 2 || this.payeeType == 2) {
            this.billRules.money[0].required = true;
          } else {
            this.billRules.money[0].required = false;
          }

          if (this.billData.currencyId == 2) {
            this.billData.currencyId = "";
          }
          return;
        }
      }
    },
    // 收款賬戶類型為其他和員工
    isSam() {
      if (this.billData.tradeType == 2) {
        for (const item of this.userList) {
          if (item.id == this.billData.payeeId) {
            this.payeeType = item.type;
            this.payeeCurrency = item.currencyId;
            if (item.type == 2 || this.personType == 2) {
              this.billRules.money[0].required = true;
            } else {
              this.billRules.money[0].required = false;
            }

            if (
              this.billData.personId != "" &&
              this.billData.personId != null &&
              this.personType != 0
            ) {
              if (this.personCurrency == 2) {
                this.billData.currencyId = this.payeeCurrency;
              } else if (this.payeeCurrency == 2) {
                this.billData.currencyId = this.personCurrency;
              } else {
                if (this.personCurrency != this.payeeCurrency) {
                  this.$message.error({
                    message: "支出賬戶與收款賬戶結算幣種不同，不能轉賬"
                  });
                } else {
                  this.billData.currencyId = Number(item.currencyId);
                }
              }
            } else {
              this.billData.currencyId = Number(item.currencyId);
            }

            if (this.billData.currencyId == 2) {
              this.billData.currencyId = "";
            }

            return;
          }
        }
      }
    },
    // 獲取賬單列表
    getBillList() {
      console.log(this.billData.personId);
      this.$axios
        .post(this.baseUrl + "/billSearch?page=1&pageNum=10", {
          personId: this.billData.personId,
          flag: 1
        })
        .then(res => {
          console.log("賬單列表");
          console.log(res);
          this.billList = res.data.list;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 獲取用戶列表
    getBillUserList() {
      this.$axios
        .get(this.baseUrl + "/billUserList")
        .then(res => {
          console.log("用戶列表");
          console.log(res);
          this.userList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 根據貨號查找產品描述
    searchCode(productCode, index) {
      if (productCode != "") {
        this.$axios
          .get(this.baseUrl + "/productCodeSearch?productCode=" + productCode)
          .then(res => {
            console.log("產品描述列表");
            console.log(res);
            let item = res.data;
            if (item.stockId) {
              this.billData.productDes += item.productDes + "\n";
              this.isClick = false;

              this.billData.stockList[index].stockId = item.stockId;
              this.billData.stockList[index].saleTotalHkMoney =
                item.saleTotalHkMoney;
            } else {
              this.productCode = productCode;
              this.dialogCodeVisible = true;
              this.isClick = true;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 刪除該條貨號記錄
    delCode(index) {
      this.billData.stockList.splice(index, 1);

      let list = this.billData.productDes.split("\n");
      list.splice(index, 1);
      this.billData.productDes = list.join("\n");

      this.tableHKPriceChange();
    },
    // 添加貨號
    addCode() {
      this.billData.stockList.push({
        stockId: null,
        productCode: "",
        money: "",
        totalHkPrice: "",
        saleTotalHkMoney: 0
      });
    },
    // 表格內外幣金額與港幣金額變化
    tablePriceChange(item) {
      item.money = this.getPriceNum(item.money);
      item.totalHkPrice = this.getIntegerNum(item.totalHkPrice);

      if (
        item.money != 0 &&
        item.money != "" &&
        this.billData.totalToHkRate != ""
      ) {
        if (this.billData.currencyId == 1 && this.billData.totalToHkRate < 1) {
          item.totalHkPrice = (
            item.money / this.billData.totalToHkRate
          ).toFixed(0);
        } else {
          item.totalHkPrice = (
            item.money * this.billData.totalToHkRate
          ).toFixed(0);
        }
      }

      this.tableHKPriceChange();
    },
    // 匯率變化
    hkRateTableNum() {
      for (const item of this.billData.stockList) {
        if (this.billData.currencyId == 1 && this.billData.totalToHkRate < 1) {
          item.totalHkPrice = (
            item.money / this.billData.totalToHkRate
          ).toFixed(0);
        } else {
          item.totalHkPrice = (
            item.money * this.billData.totalToHkRate
          ).toFixed(0);
        }
      }

      this.hkMoneyNum();
    },
    // 根據table計算總金額
    tableHKPriceChange() {
      this.billData.money = 0;
      this.billData.totalHkPrice = 0;
      for (const item of this.billData.stockList) {
        this.billData.money += Number(item.money);
        this.billData.totalHkPrice += Number(item.totalHkPrice);
      }
    },
    // 根據總金額計算總港幣金額
    hkMoneyNum() {
      this.billData.money = this.getPriceNum(this.billData.money);
      console.log(this.billData.money);
      if (this.billData.currencyId == 2) {
        this.billData.totalHkPrice = Number(this.billData.money).toFixed(0);
      } else {
        if (
          this.billData.money != "" &&
          this.billData.money != 0 &&
          this.billData.totalToHkRate != ""
        ) {
          if (
            this.billData.currencyId == 1 &&
            this.billData.totalToHkRate < 1
          ) {
            this.billData.totalHkPrice = (
              this.billData.money / this.billData.totalToHkRate
            ).toFixed(0);
          } else {
            this.billData.totalHkPrice = (
              this.billData.money * this.billData.totalToHkRate
            ).toFixed(0);
          }
        }
      }
    },
    // 港幣數字的獲取
    hkNum() {
      this.billData.totalHkPrice = this.getIntegerNum(
        this.billData.totalHkPrice
      );
    },
    // 交易類型變化
    tradeTypeChange() {
      console.log(this.billData.tradeType);
      if (this.billData.tradeType == 2) {
        this.billRules.payeeId[0].required = true;
      } else {
        this.billRules.payeeId[0].required = false;
      }
    },
    // 獲取交易方式列表
    getMeansList() {
      this.$axios
        .get(this.baseUrl + "/receiveTypeList")
        .then(res => {
          console.log("交易方式列表");
          console.log(res);
          this.meansList = [];
          if (res.data.length > 0) {
            for (const item of res.data) {
              if (item != "" && item != null) {
                this.meansList.push({
                  name: item
                });
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 千分钱数
    formatNumberRgx(num) {
      if (num == "" || num == null || num == 0) {
        return 0;
      } else {
        let parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
      }
    },
    // 账单类型匹配
    tradeTypeRgx(item) {
      for (let i = 0; i < this.typeList.length; ++i) {
        if (item == this.typeList[i].value) return this.typeList[i].label;
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
.bill-entry-container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  .container-left {
    padding: 20px;
    margin-right: 20px;
    background-color: #fff;
    border-radius: 6px;
    .code-table {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .add-button {
        width: 200px;
        height: 40px;
        margin: 0 auto;
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #c3c3c3;
        border-radius: 10px;
        cursor: pointer;

        img {
          width: 32px;
          height: 32px;
          margin-right: 10px;
        }
      }

      .every1,
      .every2,
      .every3,
      .every4,
      .every5 {
        display: flex;
        justify-content: center;
        text-align: center;
        align-items: center;
      }

      .every1 {
        width: 15%;
      }

      .every2 {
        width: 40%;
      }

      .every3 {
        width: 17%;
      }
      .every4 {
        width: 13%;
      }

      .every5 {
        width: 10%;
      }
    }
  }

  .container-left {
    width: 59%;
  }
  .container-right {
    width: 39%;
  }

  .container-right {
    padding: 20px;
    margin-right: 20px;
    background-color: #fff;
    border-radius: 6px;
    .right-title {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
    }
  }
}
</style>
