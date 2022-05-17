<template>
  <div style="margin-top: -20px;overflow: hidden;" id="billReportContainer">
    <div class="bill-report-container">
      <!-- 账单报表 -->
      <div v-if="pageSel == 0">
        <div>
          <el-form inline label-width="55px">
            <el-form-item label="日期：">
              <el-date-picker
                v-model="time"
                type="daterange"
                range-separator="至"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="賬戶">
              <el-select
                style="width:100%;"
                v-model="personId"
                placeholder="請選擇"
              >
                <el-option
                  v-for="(item, index) in userList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input
                style="width: 360px;"
                v-model="keyword"
                placeholder="可輸入產品貨號、產品描述和賬單備註進行查詢"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="personChange">查詢</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="exportData">導出數據</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="isCompany == 0">
          <el-tabs v-model="activeName">
            <el-tab-pane label="統計列表" name="first">
              <el-table
                :data="accountList"
                style="width: 800px"
                border
                @row-dblclick="checkThisList"
              >
                <el-table-column align="center" width="80px">
                  <template slot-scope="scope">
                    <div>
                      {{ ++scope.$index }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="信息">
                  <template slot-scope="scope">
                    <div
                      style="display: flex;align-items: center;justify-content:center;"
                    >
                      <div
                        v-if="scope.row.type == 2"
                        style="display: flex;align-items: center;"
                      >
                        <span>{{ scope.row.name }}</span>
                        <span style="font-size: 14px;">欠公司</span>
                      </div>
                      <div v-else style="display: flex;align-items: center;">
                        <span style="font-size: 14px;">公司欠</span>
                        <span>{{ scope.row.name }}</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="欠款總數">
                  <template slot-scope="scope">
                    <div>
                      <span
                        :style="{
                          color: scope.row.totalPrice < 0 ? 'red' : '#606266'
                        }"
                        >{{ formatNumberRgx(scope.row.totalPrice)
                        }}<span style="margin-left: 5px;font-size: 12px;">{{
                          scope.row.currency
                        }}</span></span
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="記錄列表" name="second">
              <el-table
                border
                :data="billList"
                style="width: 100%"
                @row-click="delBill"
                @row-dblclick="updateBill"
                v-loading="loading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
              >
                <el-table-column align="center" prop="time" label="日期">
                  <template slot-scope="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                            ? 'red'
                            : '#606266'
                      }"
                    >
                      {{ scope.row.time }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="tradeType"
                  label="買入/賣出"
                >
                  <template slot-scope="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                            ? 'red'
                            : '#606266'
                      }"
                    >
                      {{
                        isOther == true &&
                        (tradeTypeRgx(scope.row.tradeType) == "買入" ||
                          tradeTypeRgx(scope.row.tradeType) == "賣出")
                          ? "TopTime " + tradeTypeRgx(scope.row.tradeType)
                          : tradeTypeRgx(scope.row.tradeType)
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="stockList" label="貨號">
                  <template slot-scope="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                            ? 'red'
                            : '#606266'
                      }"
                      v-html="productCodeGet(scope.row.stockList)"
                    ></div>
                  </template>
                </el-table-column>
                <el-table-column
                  width="250px"
                  align="center"
                  prop="productDes"
                  label="產品描述"
                >
                  <template slot-scope="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                            ? 'red'
                            : '#606266'
                      }"
                    >
                      <el-tooltip effect="light" place="top-start">
                        <div
                          v-html="
                            scope.row.productDes.replace(/[\r\n]/g, '<br />')
                          "
                          slot="content"
                        ></div>
                        <div
                          class="font-warp"
                          v-html="
                            scope.row.productDes.replace(/[\r\n]/g, '<br />')
                          "
                        ></div>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="money" label="外幣金額">
                  <template slot-scope="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                            ? 'red'
                            : '#606266'
                      }"
                    >
                      {{
                        isFanMoney(
                          scope.row.flag,
                          scope.row.totalHkPrice,
                          scope.row.money,
                          scope.row.currency
                        )
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
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                            ? 'red'
                            : '#606266'
                      }"
                    >
                      {{
                        scope.row.totalToHkRate == ""
                          ? "/"
                          : scope.row.totalToHkRate
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
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                            ? 'red'
                            : '#606266'
                      }"
                    >
                      {{ isFanHkPrice(scope.row.flag, scope.row.totalHkPrice) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="receiveType"
                  label="交易方式"
                >
                  <template slot-scope="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                            ? 'red'
                            : '#606266'
                      }"
                    >
                      {{ scope.row.receiveType }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  width="250px"
                  align="center"
                  prop="remark"
                  label="Remarks"
                >
                  <template slot-scope="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                            ? 'red'
                            : '#606266'
                      }"
                    >
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.remark"
                        placement="top-start"
                      >
                        <div class="font-warp">{{ scope.row.remark }}</div>
                      </el-tooltip>
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
              <div style="margin-top:15px;text-align: right">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="page"
                  layout="total, prev, pager, next, jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-show="isCompany == 1">
          <div
            class="right-title"
            v-if="personAllMoney !== 0 && isOther == false"
          >
            公司欠
            {{ personName + "總數： " }}
            <span
              :style="{
                color: personAllMoney < 0 ? 'red' : '#000'
              }"
              >{{ formatNumberRgx(personAllMoney)
              }}<span style="margin-left: 5px;font-size: 12px;">{{
                personAllCurrency
              }}</span></span
            >
          </div>
          <div
            class="right-title"
            v-if="personAllMoney !== 0 && isOther == true"
          >
            {{ personName }}
            <span>欠公司總數： </span>
            <span
              :style="{
                color: personAllMoney < 0 ? 'red' : '#000'
              }"
              >{{ formatNumberRgx(personAllMoney)
              }}<span style="margin-left: 5px;font-size: 12px;">{{
                personAllCurrency
              }}</span></span
            >
          </div>
          <el-table
            border
            :data="billList"
            style="width: 100%"
            @row-click="delBill"
            @row-dblclick="updateBill"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column align="center" prop="time" label="日期">
              <template slot-scope="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                        ? 'red'
                        : '#606266'
                  }"
                >
                  {{ scope.row.time }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="tradeType" label="買入/賣出">
              <template slot-scope="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                        ? 'red'
                        : '#606266'
                  }"
                >
                  {{
                    isOther == true &&
                    (tradeTypeRgx(scope.row.tradeType) == "買入" ||
                      tradeTypeRgx(scope.row.tradeType) == "賣出")
                      ? "TopTime " + tradeTypeRgx(scope.row.tradeType)
                      : tradeTypeRgx(scope.row.tradeType)
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="stockList" label="貨號">
              <template slot-scope="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                        ? 'red'
                        : '#606266'
                  }"
                  v-html="productCodeGet(scope.row.stockList)"
                ></div>
              </template>
            </el-table-column>
            <el-table-column
              width="250px"
              align="center"
              prop="productDes"
              label="產品描述"
            >
              <template slot-scope="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                        ? 'red'
                        : '#606266'
                  }"
                >
                  <el-tooltip effect="light" place="top-start">
                    <div
                      v-html="scope.row.productDes.replace(/[\r\n]/g, '<br />')"
                      slot="content"
                    ></div>
                    <div
                      class="font-warp"
                      v-html="scope.row.productDes.replace(/[\r\n]/g, '<br />')"
                    ></div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="money" label="外幣金額">
              <template slot-scope="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                        ? 'red'
                        : '#606266'
                  }"
                >
                  {{
                    isFanMoney(
                      scope.row.flag,
                      scope.row.totalHkPrice,
                      scope.row.money,
                      scope.row.currency
                    )
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="totalToHkRate" label="匯率">
              <template slot-scope="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                        ? 'red'
                        : '#606266'
                  }"
                >
                  {{
                    scope.row.totalToHkRate == ""
                      ? "/"
                      : scope.row.totalToHkRate
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
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                        ? 'red'
                        : '#606266'
                  }"
                >
                  {{ isFanHkPrice(scope.row.flag, scope.row.totalHkPrice) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="receiveType" label="交易方式">
              <template slot-scope="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                        ? 'red'
                        : '#606266'
                  }"
                >
                  {{ scope.row.receiveType }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="250px"
              align="center"
              prop="remark"
              label="Remarks"
            >
              <template slot-scope="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.totalHkPrice) == 1
                        ? 'red'
                        : '#606266'
                  }"
                >
                  <el-tooltip
                    class="item"
                    effect="light"
                    :content="scope.row.remark"
                    placement="top-start"
                  >
                    <div class="font-warp">{{ scope.row.remark }}</div>
                  </el-tooltip>
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
          <div style="margin-top:15px;text-align: right">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
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
      <div v-else style="width: 60%;">
        <div
          style="width: 60px;margin: 0 0 20px 30px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="goback"
        >
          <img src="../../assets/imgs/goback.png" style="height: 21px;" />
          <p style="margin: 0;">返回</p>
        </div>
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
          <el-form-item :label="personShow(billData.tradeType)" prop="personId">
            <el-select
              style="width:100%;"
              v-model="billData.personId"
              placeholder="請選擇"
              clearable
              @change="personIdIsSam"
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
              @change="payeeIdIsSam"
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
        <div style="display: flex;justify-content: flex-end;text-align: right;">
          <el-button
            style="width: 120px;"
            type="primary"
            @click="updateBillSure"
          >
            修改
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      pageSel: 0,
      time: "",
      keyword: "",
      personId: "",
      userList: [],

      page: 1,
      total: 0,
      personAllMoney: 0,
      personAllCurrency: "",
      billList: [],
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
      productCode: "",
      dialogCodeVisible: false,
      isClick: false,

      stockId: null,

      billData: {},
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

      dialogDelVisible: false,
      delId: null,
      productCodeIsKong: false,
      personName: "",

      productCodeIsNull: true,
      isCompany: 1,
      accountList: [],
      saleHkMoneyTotal: 0,
      isOther: false,

      loading: false,

      personType: null,
      payeeType: null,
      personCurrency: null,
      payeeCurrency: null,

      activeName: "first",
      companyCurrency: "",
      accountNumberType: null,
      currencyGlobal: ""
    };
  },
  created() {
    this.currencyGlobal = sessionStorage.getItem("currencyGlobal");
    this.getBillUserList();
    this.getMeansList();
    this.accountNumberType = sessionStorage.getItem("type");
  },
  methods: {
    // 賬戶類型為其他和員工
    personIdIsSam() {
      let companyCurrencyId;
      for (const item of this.userList) {
        if (item.id == this.billData.personId) {
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
    payeeIdIsSam() {
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
    // 公司下查看选中账户账单
    checkThisList(row) {
      this.personId = row.personId;
      this.personName = row.name;
      this.isCompany = 1;
      this.page = 1;
      if (row.type == 2) {
        this.isOther = true;
      } else {
        this.isOther = false;
      }

      this.getBillList();
    },
    // 是否为红色
    isRed(flag, hkPrice) {
      if (flag == 1) {
        if (this.isCompany == 0) {
          return -1;
        } else {
          let price = hkPrice > 0 ? "-" + hkPrice : Math.abs(hkPrice);

          if (this.isOther == true) {
            let price2 = price > 0 ? "-" + price : Math.abs(price);
            if (Number(price2) < 0) {
              return 1;
            } else {
              return -1;
            }
          } else {
            if (Number(price) < 0) {
              return 1;
            } else {
              return -1;
            }
          }
        }
      } else {
        if (this.isCompany == 0) {
          return 1;
        } else {
          if (this.isOther == true) {
            let price2 = hkPrice > 0 ? "-" + hkPrice : Math.abs(hkPrice);
            if (Number(price2) < 0) {
              return 1;
            } else {
              return -1;
            }
          } else {
            if (Number(hkPrice) < 0) {
              return 1;
            } else {
              return -1;
            }
          }
        }
      }
    },
    // 外币金额是否取反
    isFanMoney(flag, hkPrice, money, currency) {
      if (money == "" || money == null || money == 0) {
        return "/";
      } else {
        if (flag == 1) {
          if (this.isCompany == 0) {
            let price = hkPrice < 0 ? Math.abs(money) : money;
            let num = this.formatNumberRgx(price) + " " + currency;
            return num;
          } else {
            let price = hkPrice > 0 ? "-" + money : Math.abs(money);

            if (this.isOther == true) {
              let price2 = price > 0 ? "-" + price : Math.abs(price);
              let num2 = this.formatNumberRgx(price2) + " " + currency;
              return num2;
            } else {
              let num = this.formatNumberRgx(price) + " " + currency;
              return num;
            }
          }
        } else {
          if (this.isCompany == 0) {
            let price = hkPrice > 0 ? "-" + money : money;
            let num = this.formatNumberRgx(price) + " " + currency;
            return num;
          } else {
            if (this.isOther == true) {
              let price2 = hkPrice > 0 ? "-" + money : Math.abs(money);
              let num2 = this.formatNumberRgx(price2) + " " + currency;
              return num2;
            } else {
              let num = this.formatNumberRgx(money) + " " + currency;
              return num;
            }
          }
        }
      }
    },
    // 收入  港币金额取反，判断正负，支出  直接看港币金额的正负
    // 港币金额是否取反
    isFanHkPrice(flag, hkPrice) {
      if (hkPrice == "" || hkPrice == null || hkPrice == 0) {
        return "/";
      } else {
        if (flag == 1) {
          if (this.isCompany == 0) {
            let price = hkPrice < 0 ? Math.abs(hkPrice) : hkPrice;
            let num = this.formatNumberRgx(price) + " " + this.currencyGlobal;
            return num;
          } else {
            let price = hkPrice > 0 ? "-" + hkPrice : Math.abs(hkPrice);

            if (this.isOther == true) {
              let price2 = price > 0 ? "-" + price : Math.abs(price);
              let num2 =
                this.formatNumberRgx(price2) + " " + this.currencyGlobal;
              return num2;
            } else {
              let num = this.formatNumberRgx(price) + " " + this.currencyGlobal;
              return num;
            }
          }
        } else {
          if (this.isCompany == 0) {
            let price = hkPrice > 0 ? "-" + hkPrice : hkPrice;
            let num = this.formatNumberRgx(price) + " " + this.currencyGlobal;
            return num;
          } else {
            if (this.isOther == true) {
              let price2 = hkPrice > 0 ? "-" + hkPrice : Math.abs(hkPrice);
              let num2 =
                this.formatNumberRgx(price2) + " " + this.currencyGlobal;
              return num2;
            } else {
              let num =
                this.formatNumberRgx(hkPrice) + " " + this.currencyGlobal;
              return num;
            }
          }
        }
      }
    },
    // 支出賬戶/收款賬戶
    personShow(value) {
      if (value == 1 || value == 3 || value == 5) {
        return "收款賬戶";
      } else if (value == 0 || value == 2 || value == 4 || value == 6) {
        return "支出賬戶";
      }
    },
    // 修改賬單
    updateBill(row) {
      this.isClick = false;
      this.billData = JSON.parse(JSON.stringify(row));
      if (this.companyCurrency == "") {
        let companyCurrencyId;
        for (const item of this.userList) {
          if (item.id == this.billData.personId) {
            companyCurrencyId = item.companyCurrencyId;

            console.log(companyCurrencyId);
            for (const ite of this.currencyIds) {
              if (ite.value === companyCurrencyId) {
                let reg = /[\u4e00-\u9fa5]/g;
                this.companyCurrency = ite.label.match(reg).join("");
              }
            }
          }
        }
      }

      if (this.billData.stockList.length == 0) {
        this.billData.stockList = [
          {
            stockId: null,
            productCode: "",
            money: "",
            totalHkPrice: "",
            saleTotalHkMoney: 0,
            treasuryPrices: 0,
            saleTotalHkPrice: 0
          }
        ];
        this.productCodeIsNull = true;
      } else {
        this.productCodeIsNull = false;
      }

      this.pageSel = 1;

      document
        .getElementById("billReportContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    // 確定修改
    updateBillSure() {
      this.$refs["billForm"].validate(valid => {
        if (valid) {
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
            if (this.productCodeIsKong == false) {
              console.log("通過");
              this.updateData();
            } else {
              console.log("不通過");
              if (this.billData.stockList.length == 0) {
                this.billData.stockList = [
                  {
                    stockId: null,
                    productCode: "",
                    money: this.billData.money,
                    totalHkPrice: this.billData.totalHkPrice,
                    saleTotalHkMoney: 0,
                    treasuryPrices: 0,
                    saleTotalHkPrice: 0
                  }
                ];
              }
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateData() {
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

            this.pageSel = 0;
            this.page = 1;
            this.getBillList();

            document
              .getElementById("billReportContainer")
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
                saleTotalHkMoney: 0,
                treasuryPrices: 0,
                saleTotalHkPrice: 0
              }
            ];
          }
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 3000
          });
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

            this.page = 1;
            this.getBillList();

            document
              .getElementById("billReportContainer")
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
    // 導出數據
    exportData() {
      const loading = this.$loading({
        lock: true,
        text: "导出中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });

      let time1 = this.time != "" && this.time != null ? this.time[0] : "";
      let time2 = this.time != "" && this.time != null ? this.time[1] : "";
      this.$axios
        .get(
          this.baseUrl +
            "/billExport?id=" +
            this.personId +
            "&startTime=" +
            time1 +
            "&endTime=" +
            time2,
          {
            responseType: "blob"
          }
        )
        .then(res => {
          console.log("導出報表");
          console.log(res);
          loading.close();

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
          link.setAttribute("download", "Hermès Bill summary_" + num + ".xlsx");
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
    // 驗證數據
    isKong() {
      this.productCodeIsKong = false;
      if (this.billData.stockList[0].productCode == "") {
        this.billData.stockList = [];
        this.productCodeIsNull = true;
      } else {
        this.productCodeIsNull = false;

        for (const item of this.billData.stockList) {
          if (this.billRules.money[0].required == true) {
            if (item.money == "" || item.money == 0) {
              this.$message.error({
                message: "產品貨號列表外幣金額不能為空，請輸入",
                showClose: true,
                duration: 2000
              });
              this.productCodeIsKong = true;
              return;
            }
          } else {
            this.productCodeIsKong = false;
          }

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
              return;
            }
          } else {
            this.productCodeIsKong = false;
          }

          if (this.billData.tradeType == 0) {
            if (
              item.treasuryPrices &&
              item.totalHkPrice &&
              item.treasuryPrices != item.totalHkPrice
            ) {
              this.productCodeIsKong = true;
              let msg =
                "貨號" +
                item.productCode +
                "入庫金額為：" +
                item.treasuryPrices +
                this.currencyGlobal +
                " ，您錄入的買入金額為：" +
                item.totalHkPrice +
                this.currencyGlobal +
                " ，兩者不相等，是否確定繼續提交？";
              this.$confirm(msg, "提示", {
                confirmButtonText: "確定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.productCodeIsKong = false;

                  this.updateData();
                })
                .catch(() => {
                  console.log("取消提交");
                });
              return;
            } else {
              this.productCodeIsKong = false;
            }
          } else if (this.billData.tradeType == 1) {
            if (
              item.saleTotalHkPrice &&
              item.totalHkPrice &&
              item.saleTotalHkPrice != item.totalHkPrice
            ) {
              this.productCodeIsKong = true;
              let msg =
                "貨號" +
                item.productCode +
                "出售金額為：" +
                item.saleTotalHkPrice +
                this.currencyGlobal +
                " ，您錄入的賣出金額為：" +
                item.totalHkPrice +
                this.currencyGlobal +
                " ，兩者不相等，是否確定繼續提交？";
              this.$confirm(msg, "提示", {
                confirmButtonText: "確定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.productCodeIsKong = false;

                  this.updateData();
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

        if (this.billData.tradeType == 2) {
          this.saleHkMoneyTotal = 0;

          this.saleHkMoneyTotal = this.billData.stockList.reduce(
            (c, item) => c + item.saleTotalHkMoney * 1,
            0
          );

          if (
            this.billData.totalHkPrice &&
            this.saleHkMoneyTotal &&
            this.billData.totalHkPrice != this.saleHkMoneyTotal
          ) {
            this.productCodeIsKong = true;
            let msg =
              "產品列表出售總金額為：" +
              this.saleHkMoneyTotal +
              this.currencyGlobal +
              " ,您的轉賬金額為：" +
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
                this.updateData();
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
              this.stockId = item.stockId;
              this.billData.productDes += item.productDes + "\n";
              this.isClick = false;

              this.billData.stockList[index].stockId = this.stockId;
              this.billData.stockList[index].saleTotalHkMoney =
                item.saleTotalHkMoney;
              this.billData.stockList[index].treasuryPrices = item.totalHkPrice;
              this.billData.stockList[index].saleTotalHkPrice =
                item.saleTotalHkPrice;
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
        saleTotalHkMoney: 0,
        treasuryPrices: 0,
        saleTotalHkPrice: 0
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
    goback() {
      this.pageSel = 0;
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
    // 賬戶改變
    personChange() {
      this.page = 1;
      for (const item of this.userList) {
        if (item.id == this.personId) {
          console.log(item);
          this.personName = item.name;
          if (item.type == 0) {
            this.isCompany = 0;
            this.activeName = "first";
          } else {
            this.isCompany = 1;
            if (item.type == 2) {
              this.isOther = true;
            } else {
              this.isOther = false;
            }
          }
        }
      }
      console.log(this.personId);

      this.getBillList();
    },
    // 獲取賬單列表
    getBillList() {
      this.loading = true;
      console.log(this.time);
      this.$axios
        .post(this.baseUrl + "/billSearch?page=" + this.page + "&pageNum=10", {
          personId: this.personId,
          startTime: this.time !== "" && this.time !== null ? this.time[0] : "",
          endTime: this.time !== "" && this.time !== null ? this.time[1] : "",
          keyword: this.keyword,
          flag: 2
        })
        .then(res => {
          console.log("賬單列表");
          console.log(res);
          this.loading = false;
          if (this.isCompany == 0) {
            this.accountList = res.data.censusData;
            this.billList = res.data.allRecord.list;
            this.total = res.data.allRecord.total;
          } else {
            this.billList = res.data.list;
            this.total = res.data.total;
            this.personAllMoney = res.data.personAllMoney;
            this.personAllCurrency = res.data.currency;
          }
        })
        .catch(err => {
          this.loading = false;
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

          this.personId = this.userList[0].id;
          if (this.userList[0].type == 0) {
            this.isCompany = 0;
          } else {
            this.isCompany = 1;
          }
          this.getBillList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 分頁
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      console.log(this.page);
      this.getBillList();

      document
        .getElementById("billReportContainer")
        .scrollIntoView({ behavior: "smooth" });
    }
  }
};
</script>

<style lang="scss" scoped>
.bill-report-container {
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 6px;

  .user-every {
    margin-bottom: 10px;
  }

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
  .right-title {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
  }
}
</style>
