<template>
  <div class="onsale-container">
    <!-- 未出库 -->
    <div v-show="pageSel == 0">
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
          v-model="stockLoc2"
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
            v-for="item in stateList2"
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
          <th class="th-style">总成本</th>
          <th class="th-style">同行价</th>
          <th class="th-style">散客价</th>
          <th class="th-style">出售港币金额</th>
          <th class="th-style">商品信息</th>
          <th class="th-style">库存点</th>
          <th class="th-style" style="width: 136px;">库存状态</th>
          <th class="th-style" style="width: 180px;">时间</th>
          <th class="th-style">在库时长</th>
          <th class="th-style">操作</th>
        </tr>
        <tr v-show="onSaleProducts.length == 0" align="center">
          <td colspan="13" style="font-size:20px;color:#ddd;">
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
          <td>
            {{ "HKD " + formatNumberRgx(item.cost) }}
          </td>
          <td>
            {{ "HKD " + formatNumberRgx(item.pricePeer) }}
          </td>
          <td>
            {{ "HKD " + formatNumberRgx(item.priceIndi) }}
          </td>
          <td>
            {{
              (item.sold == 3 || item.sold == 4) && item.saleTotalHkPrice != 0
                ? "HKD " + formatNumberRgx(item.saleTotalHkPrice)
                : "-"
            }}
          </td>
          <td>{{ item.name }}</td>
          <td style="cursor: pointer;" @click="warehouseLocUpdate(item)">
            <span class="handle-button">{{ item.stockLoc }}</span>
            <img
              src="../../assets/imgs/update.png"
              style="width: 15px;height: 18px;"
            />
          </td>
          <td style="cursor: pointer;" @click="stateupdate(item)">
            <span class="handle-button">{{
              item.sold == 0
                ? "采购中"
                : item.sold == 1
                ? "存货"
                : item.sold == 2
                ? "客人预留"
                : item.sold == 5
                ? "客人取回"
                : item.sold == 6
                ? "购入退货"
                : item.sold == 7
                ? "遗失"
                : "已出售"
            }}</span>
            <img
              src="../../assets/imgs/update.png"
              style="width: 15px;height: 18px;"
            />
          </td>
          <td>
            <p
              v-if="
                item.estimateTime &&
                  (item.sold == 0 || item.sold == 2 || item.sold == 3)
              "
            >
              预计到达：{{ item.estimateTime }}
            </p>
            <p
              v-if="
                item.createTime &&
                  (item.sold == 1 ||
                    item.sold == 2 ||
                    item.sold == 3 ||
                    item.sold == 5 ||
                    item.sold == 6 ||
                    item.sold == 7)
              "
            >
              入库时间：{{ item.createTime }}
            </p>
            <p v-if="item.soldTime">出售时间：{{ item.soldTime }}</p>
            <p v-if="item.stockOutTime && item.sold == 5">
              取回时间：{{ item.stockOutTime }}
            </p>
            <p v-if="item.stockOutTime && item.sold == 6">
              退货时间：{{ item.stockOutTime }}
            </p>
            <p v-if="item.stockOutTime && item.sold == 7">
              时间：{{ item.stockOutTime }}
            </p>
          </td>
          <td>{{ timeLong(item.createTime) }}</td>
          <td>
            <div style="width:130px;display:flex;justify-content: center;">
              <div style="margin-right:10px;">
                <el-button type="text" @click="del(item)" class="handle-button"
                  >删除</el-button
                >
              </div>
              <div style="margin-right:10px;">
                <el-button
                  type="text"
                  @click="editProduct(item)"
                  class="handle-button"
                  >编辑</el-button
                >
              </div>
              <div>
                <el-button
                  type="text"
                  @click="noteCheck(item)"
                  class="handle-button"
                  >备注</el-button
                >
              </div>
            </div>
          </td>
        </tr>
      </table>

      <el-dialog title="提示" :visible.sync="centerDialogVisible" width="500px">
        <div style="text-align:center;font-size: 16px;">
          <span>确定删除该商品？删除后不能恢复</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="centerDialogVisible = false"
            style="width:100px;color:#9695f3;margin-right:10px;"
            >取 消</el-button
          >
          <el-button
            @click="deleteSure"
            class="sure-button"
            style="background:#9695f3;color:#fff;"
            >确 定
          </el-button>
        </span>
      </el-dialog>
      <el-dialog title="备注" :visible.sync="noteDialogVisible" width="500px">
        <div style="text-align:center;">
          <p style="font-size: 16px;" v-if="note">{{ note }}</p>
          <p style="font-size: 16px;" v-else>暂无备注信息~</p>
        </div>
      </el-dialog>
      <el-dialog
        title="库存地"
        :visible.sync="dialogWarehouseLocUpdateVisible"
        width="500px"
      >
        <div>
          <el-form label-width="80px">
            <el-form-item label="库存地" required>
              <el-select
                v-model="stockLoc"
                filterable
                allow-create
                default-first-option
                placeholder="请选择"
                clearable
                style="width:100%;"
              >
                <el-option
                  v-for="item in stockLocs"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入库时间" required v-if="isWarehouse != 0">
              <el-date-picker
                v-model="createTime"
                type="date"
                placeholder="请选择日期时间"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                style="width:100%;"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button
            @click="dialogWarehouseLocUpdateVisible = false"
            style="width:100px;color:#9695f3;margin-right:10px;"
            >取 消</el-button
          >
          <el-button
            class="sure-button"
            style="background:#9695f3;color:#fff;"
            @click="warehouseLocUpdateSure"
            >确 定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="库存数据"
        v-if="dialogStateVisible"
        :visible.sync="dialogStateVisible"
        width="800px"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :modal-append-to-body="true"
        :append-to-body="true"
      >
        <div>
          <el-form label-width="110px">
            <el-form-item label="库存状态" required>
              <el-select
                v-model="sold"
                placeholder="请选择"
                style="width:100%;"
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
            <el-form-item label="预计到达时间" v-if="sold == 0">
              <el-date-picker
                type="date"
                placeholder="请选择日期时间"
                v-model="estimateTime"
                style="width:100%;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="入库时间" required v-if="sold == 1">
              <el-form-item>
                <el-date-picker
                  type="date"
                  placeholder="请选择日期时间"
                  v-model="createTime"
                  style="width:100%;"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="取回时间" required v-if="sold == 5">
              <el-date-picker
                v-model="stockOutTime"
                type="date"
                style="width:100%;"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="退货时间" required v-if="sold == 6">
              <el-date-picker
                v-model="stockOutTime"
                type="date"
                style="width:100%;"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="时间" required v-if="sold == 7">
              <el-date-picker
                v-model="stockOutTime"
                type="date"
                style="width:100%;"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="账单号"
              :required="isStock == 0 ? false : true"
              v-if="sold == 3"
            >
              <el-input v-model="bill"></el-input>
            </el-form-item>
            <el-form-item
              label="出售时间"
              :required="isStock == 0 ? false : true"
              v-if="sold == 3"
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
            <el-form-item label="出售外币金额" v-if="sold == 2 || sold == 3">
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
            <el-form-item label="是否收款完成" v-if="sold == 3">
              <el-switch v-model="isReceiveCheck"></el-switch>
            </el-form-item>
            <!-- 物流费/银行手续费送货(HKD) -->
            <el-form-item label="物流费/手续费" v-if="sold == 3">
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
              :required="isStock == 0 ? false : true"
              v-if="sold == 3"
            >
              <div style="display: flex;">
                <el-input
                  style="flex: 1;"
                  v-model="saleTotalHkPrice"
                  placeholder="请输入出售港币金额"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item
              label="客户姓名"
              :required="isStock == 1 || sold == 2 ? true : false"
              v-if="sold == 2 || sold == 3"
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
              label="是否同时出库"
              label-width="110px"
              v-if="sold == 3"
            >
              <el-radio-group v-model="isStock">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="出库时间"
              required
              v-if="sold == 3 && isStock == 1"
            >
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
              v-show="salePaymentList.length > 0 && sold == 3"
            >
              <el-table :data="salePaymentList" style="width: 100%;">
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
            class="sure-button"
            style="background:#9695f3;color:#fff;"
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
    <div v-if="pageSel == 1">
      <details-vue
        :updatesId="updateId"
        @goback="goback"
        @updateSuccess="updateSuccess"
      ></details-vue>
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
      pageSel: 0,
      page: 1, //初始页
      pagesize: 10, //    每页的数据
      total: 0,
      searchKey: "",

      delId: 0,
      updateId: 0,
      onSaleProducts: [],
      centerDialogVisible: false,

      stockLoc2: "",
      estimateTime: "", // 预计到达时间
      createTime: "", //入库时间
      sellCurrencyId: "", // 出售外币金额币种
      isPayCheck: false,
      isReceiveCheck: false,
      currencyId: "", //价格币种
      stockLoc: "", //库存地
      note: "", // 备注
      priceTran: "", //成交价
      customer: "", //客户名称
      bill: "", //账单号
      soldTime: new Date(), //售出时间
      isStock: 0, // 是否同时出库
      stockOutTime: "", // 出库时间

      sold: 0,
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
      stockLocs: [],
      stockLocList: [],

      stateList: [
        {
          label: "采购中",
          value: "0"
        },
        {
          label: "存货",
          value: "1"
        },
        {
          label: "客人预留",
          value: "2"
        },
        {
          label: "已出售",
          value: "3"
        },
        {
          label: "购入退货",
          value: "6"
        },
        {
          label: "遗失",
          value: "7"
        },
        {
          label: "客人取回",
          value: "5"
        }
      ],
      dialogStateVisible: false,
      updateStateId: null,
      userId: null,
      userList: [],
      stateList2: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "采购中",
          value: "0"
        },
        {
          label: "存货",
          value: "1"
        },
        {
          label: "客人预留",
          value: "2"
        },
        {
          label: "已出售",
          value: "3"
        },
        {
          label: "购入退货",
          value: "6"
        },
        {
          label: "遗失",
          value: "7"
        },
        {
          label: "客人取回",
          value: "5"
        }
      ],
      soldSel: "1",
      noteDialogVisible: false,
      bill: "",

      isRequire: 0,
      dialogWarehouseLocUpdateVisible: false,
      locUpdateId: null,
      saleLogHkPrice: "",
      saleTotalHkPrice: "",
      buyAllPrice: undefined,
      totalHkPrice: undefined,
      logHkPrice: undefined,

      isWarehouse: null,
      customerList: [],
      salePaymentList: []
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

    noteCheck(item) {
      this.note = item.note;
      this.noteDialogVisible = true;
    },
    // 库存地修改
    warehouseLocUpdate(item) {
      console.log(item);
      this.locUpdateId = item.id;
      this.stockLoc = item.stockLoc;
      this.createTime = item.createTime;
      this.isWarehouse = item.sold;
      this.dialogWarehouseLocUpdateVisible = true;
    },
    // 确定修改
    warehouseLocUpdateSure() {
      if (
        this.stockLoc == "" ||
        this.createTime == "" ||
        this.createTime == null
      ) {
        this.$message.error({
          message: "数据不能为空",
          showClose: true,
          duration: 2000
        });
      } else {
        this.$axios
          .put(this.baseUrl + "/stockLocSave", {
            id: this.locUpdateId,
            stockLoc: this.stockLoc,
            createTime: this.createTime
          })
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              this.$message.success({
                message: "修改成功",
                showClose: true,
                duration: 2000
              });
              this.dialogWarehouseLocUpdateVisible = false;
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
    // 库存状态修改
    stateupdate(item) {
      console.log("数据");
      console.log(item);
      this.updateStateId = item.id;
      if (item.sold == 4) {
        this.sold = "3";
      } else {
        this.sold = item.sold;
      }

      this.bill = item.bill;
      this.estimateTime = item.estimateTime;
      this.createTime = item.createTime;
      this.priceTran = item.priceTran;
      this.customer = item.customer;
      this.soldTime = item.soldTime;
      this.sellCurrencyId = item.sellCurrencyId;

      this.stockOutTime = item.stockOutTime;
      this.note = item.note;
      this.sellPayList = item.sellPaymentList;
      this.saleLogHkPrice = item.saleLogHkPrice;
      this.saleTotalHkPrice = item.saleTotalHkPrice;

      this.salePaymentList = item.salePaymentList;

      this.isReceiveCheck =
        item.isReceiveCheck == 0 || item.isReceiveCheck == null ? false : true;

      if (item.sold == 3) {
        this.isStock = 0;
      } else if (item.sold == 4) {
        this.isStock = 1;
      }

      this.dialogStateVisible = true;
    },
    // stateChange() {
    //   this.estimateTime = "";
    //   this.createTime = "";
    //   this.stockOutTime = "";
    //   this.bill = "";
    //   this.isPayCheck = false;
    //   this.isReceiveCheck = false;
    //   if (this.sold != 2 && this.sold != 3) {
    //     this.priceTran = "";
    //     this.customer = "";
    //     this.soldTime = "";
    //     this.sellCurrencyId = "";
    //     this.sellPayList = [];
    //     this.saleLogHkPrice = "";
    //     this.saleTotalHkPrice = "";
    //   } else {
    //     this.soldTime = "";
    //     this.isStock = 0;
    //   }
    // },
    dataCheck() {
      // console.log(this.sold);
      if (this.sold == 1) {
        if (this.createTime == "" || this.createTime == null) {
          this.$message.error({
            message: "请选择入库时间",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      } else if (this.sold == 2) {
        if (this.customer == "" || this.customer == null) {
          this.$message.error({
            message: "请填写客户姓名",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      } else if (this.sold == 3 && this.isStock == 1) {
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
      } else if (this.sold == 5) {
        if (this.stockOutTime == "" || this.stockOutTime == null) {
          this.$message.error({
            message: "请选择取回时间",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      } else if (this.sold == 6) {
        if (this.stockOutTime == "" || this.stockOutTime == null) {
          this.$message.error({
            message: "请选择退货时间",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      } else if (this.sold == 7) {
        if (this.stockOutTime == "" || this.stockOutTime == null) {
          this.$message.error({
            message: "请选择时间",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      }
    },
    // 确定修改
    stateupdateSure() {
      if (this.dataCheck() !== 1) {
        this.$axios
          .put(this.baseUrl + "/stateSave", {
            id: this.updateStateId,
            sold: this.sold,
            bill: this.bill,
            createTime: this.sold == 1 ? this.createTime : "",
            estimateTime: this.estimateTime,
            priceTran: this.priceTran,
            customer: this.customer,
            soldTime: this.soldTime,
            sellCurrencyId: this.sellCurrencyId,
            isStock: this.isStock,
            stockOutTime: this.stockOutTime,
            note: this.note,
            sellPaymentList: this.sellPayList,
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
    // 删除
    del(item) {
      if (item.sold == 3) {
        this.$message.error({
          message: "该商品已出售，不可操作",
          showClose: true,
          duration: 2000
        });
      } else {
        this.centerDialogVisible = true;
        console.log(item);
        this.delId = item.id;
      }
    },
    // 删除指定商品
    deleteSure() {
      console.log("111" + this.delId);
      this.$axios
        .delete(this.baseUrl + "/delete?id=" + this.delId)
        .then(res => {
          console.log(res);
          this.centerDialogVisible = false;

          this.$message.success({
            message: "删除成功",
            showClose: true,
            duration: 1500
          });
          this.handleCurrentChange(1);
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
    // 编辑
    editProduct(item) {
      this.updateId = item.id;
      console.log(this.updateId);
      this.pageSel = 1;
    },
    // 编辑成功
    updateSuccess(val) {
      this.pageSel = val;
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
    },
    goback(val) {
      this.pageSel = val;
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
    radioChange() {
      this.page = 1;
    },
    // 计算时长
    timeLong(time) {
      if (time !== null && time !== "") {
        let startTime = new Date(time); // 开始时间
        let endTime = new Date(); // 结束时间
        // console.log(endTime - startTime); // 毫秒数
        // console.log(Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24)); // 天数
        let times =
          Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24) + " 天";
        return times;
      } else {
        return "-";
      }
    },
    // 模糊查询
    searchProducts() {
      console.log("111");
      this.$axios
        .post(this.baseUrl + "/stockSearch", {
          keyword: this.searchKey,
          page: this.page,
          pageNum: 10,
          stockLoc: this.stockLoc2,
          userId: this.userId,
          sold: this.soldSel
        })
        .then(res => {
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
          this.stockLoc2 = this.stockLocList[0];

          let a = this.stockLocList.concat();
          a.splice(0, 1);
          this.stockLocs = a;

          console.log(this.stockLocs);
          this.getUserList();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.onsale-container {
  font-family: "微软雅黑";

  .font-warp {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.onsale-top {
  margin-top: 38px;
  margin-left: 40px;

  .onsale-top-radio {
    margin-right: 20px;
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

thead,
th,
td {
  font-weight: normal;
  padding: 5px 0;
}

tr {
  margin-top: 30px;
}

td {
  width: 100px;
  font-size: 16px;
}

.th-style {
  width: 100px;
  margin-right: 100px;
  font-size: 18px;
}

.handle-button {
  color: #9695f3;
  font-size: 16px;
}

.el-upload--picture-card {
  width: 100px !important;
  height: 100px !important;
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

.sell-sure-button {
  width: 100px;
}
</style>
<style lang="scss">
$color: #9695f3;

.el-dialog {
  border-radius: 20px;

  .el-dialog__header {
    padding: 30px 20px 10px;
  }

  .el-dialog__title,
  .el-dialog__body {
    color: #000;
    font-size: 18px;
  }

  .el-dialog__body {
    // margin-bottom: 25px;
    padding: 30px 40px;
  }

  .el-button {
    height: 50px;
    border: 1px solid $color;
    border-radius: 7px;
    background: none;
    font-size: 15px;
  }
}

.el-radio__input.is-checked + .el-radio__label {
  color: $color;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: $color;
  background: $color;
}

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: $color;
  border-color: $color;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: $color;
}

.el-pager li.active {
  color: $color;
  cursor: default;
}

.el-pager li:hover {
  color: $color;
}
</style>
