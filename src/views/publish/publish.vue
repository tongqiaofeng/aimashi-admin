<template>
  <div style="margin-top: -20px;overflow: hidden;" id="publishContainer">
    <div class="publish-container">
      <el-form ref="globalForm" label-width="110px">
        <el-form-item label="货号" required>
          <el-form-item>
            <el-input style="width:50%;" type="text" placeholder="请输入货号" v-model="productCode" @change="productCodeChange"
              clearable></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="库存地" required>
          <el-select v-model="stockLoc" placeholder="请选择" clearable style="width:50%;" value-key="warehouseId">
            <el-option v-for="item in stockLocs" :key="item.warehouseId" :label="item.warehouseName" :value="item"
              v-show="item.companyId == companyId">
              <span style="float: left">{{ item.warehouseName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.companyName
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存状态" required>
          <el-form-item>
            <el-select style="width: 50%;" v-model="sold" placeholder="请选择" @change="stateChange">
              <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="预计到达时间" v-if="sold == 0">
          <el-date-picker type="date" placeholder="请选择日期时间" v-model="estimateTime" style="width:50%;"
            value-format="yyyy-MM-dd" format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库时间" required
          v-if="sold == 1 || sold == 2 || sold == 3 || sold == 4 || sold == 8 || sold == 9">
          <el-date-picker style="width:50%;" v-model="createTime" type="date" placeholder="请选择日期时间"
            value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName">
        <el-tab-pane label="图片及参数" name="first">
          <div>
            <upload :isAdd="true" :imgNum="9" :imgs="imgUrl" @uploadImgsRes="eightImgs"></upload>
          </div>
          <div>
            <upload :isAdd="true" :imgNum="30" :imgs="imgUrl2" @uploadImgsRes="thirtyImgs"></upload>
          </div>
          <el-form ref="form" label-width="80px">
            <el-form-item label="款式" required>
              <el-autocomplete style="width: 50%;" v-model="model" :fetch-suggestions="queryModelSearch"
                placeholder="请选择/输入款式" @select="handleModelSelect"></el-autocomplete>
            </el-form-item>
            <el-form-item label="大小" :required="isRequire == 0 ? true : false">
              <el-autocomplete style="width: 50%;" v-model="size" :fetch-suggestions="querySizeSearch"
                placeholder="请选择/输入大小" @select="handleSizeSelect"></el-autocomplete>
            </el-form-item>
            <el-form-item label="材质" :required="isRequire == 0 ? true : false">
              <el-cascader v-model="leather" :options="leathers" @change="handleChange" style="width: 50%;"
                v-if="isInput == 0">
              </el-cascader>
              <el-input v-if="isInput == 1" v-model="leather" style="width: 50%;" placeholder="请输入"></el-input>
              <el-button type="text" @click="isInputSel">{{
                isInput == 0 ? "输入" : "选择"
              }}</el-button>
            </el-form-item>
            <el-form-item label="金属质感" :required="isRequire == 0 ? true : false">
              <el-select v-model="metal" placeholder="请选择" style="width: 50%;" clearable v-if="isSelect == 0">
                <el-option v-for="item in metals" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-input v-if="isSelect == 1" v-model="metal" style="width: 50%;" placeholder="请输入"></el-input>
              <el-button type="text" @click="isSelectSel">{{
                isSelect == 0 ? "输入" : "选择"
              }}</el-button>
            </el-form-item>
            <el-form-item label="色号">
              <el-input style="width:50%;" placeholder="请输入色号" v-model="colorId" @input="colorIdBlur" clearable>
              </el-input>
              <el-button type="text" @click="isColorSel">{{
                isColor == 0 ? "无色号" : "有色号"
              }}</el-button>
            </el-form-item>
            <el-form-item label="颜色" :required="isRequire == 0 ? true : false">
              <el-input style="width:50%;" v-model="color" clearable :disabled="isColor == 0 ? true : false"></el-input>
            </el-form-item>
            <el-form-item label="色系">
              <el-input style="width:50%;" v-model="colorSeries" clearable
                :disabled="isColor == 0 ? true : false"></el-input>
            </el-form-item>
            <el-form-item label="刻度">
              <el-input style="width:50%;" placeholder="请输入刻度" v-model="letter" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态" :required="isRequire == 0 ? true : false">
              <el-checkbox-group v-model="stock" style="width:50%;">
                <el-checkbox v-for="stocks in stockStats" :label="stocks" :key="stocks">{{ stocks }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="采购及价格" name="second">
          <el-form ref="purchaseForm" label-width="110px">
            <el-form-item label="买手">
              <el-input style="width:50%;" placeholder="请输入买手" v-model="source" clearable></el-input>
            </el-form-item>
            <el-form-item label="采购外币金额">
              <div style="width: 50%;display: flex;">
                <el-input style="flex: 1;" type="text" placeholder="请输入采购外币金额" v-model="buyAllPrice" clearable
                  :controls="false" @change="isPurchaseHKD"></el-input>
                <el-select v-model="currencyId" placeholder="请选择采购价币种" clearable @change="isPurchaseHKD">
                  <el-option v-for="item in currencyIds" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="是否付款完成">
              <el-switch v-model="isPayCheck"></el-switch>
            </el-form-item>
            <el-form-item :label="'入库价(' + currencyGlobal + ')'">
              <el-input style="width:50%;" type="text" placeholder="请输入入库价" v-model="totalHkPrice" clearable
                :controls="false" @change="costCalculate"></el-input>
            </el-form-item>
            <el-form-item :label="'其他费用(' + currencyGlobal + ')'">
              <el-input style="width:50%;" type="text" placeholder="请输入物流金额" v-model="logHkPrice" clearable
                :controls="false" @change="costCalculate"></el-input>
            </el-form-item>
            <el-form-item :label="'总成本(' + currencyGlobal + ')'">
              <el-input style="width:50%;" placeholder="请输入总成本" v-model="cost" clearable :controls="false"
                @change="numCheckout"></el-input>
            </el-form-item>
            <el-form-item label="同行价">
              <div style="width: 50%;display: flex;">
                <el-input :controls="false" style="flex: 1;" placeholder="请输入同行价" v-model="pricePeer" clearable
                  @change="numCheckout"></el-input>
                <el-select v-model="peerCurrencyId" placeholder="请选择同行价币种" clearable>
                  <el-option v-for="item in currencyIds" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="散客价">
              <div style="width: 50%;display: flex;">
                <el-input :controls="false" style="flex: 1;" placeholder="请输入散客价" v-model="priceIndi" clearable
                  @change="numCheckout"></el-input>
                <el-select v-model="indiCurrencyId" placeholder="请选择散客价币种" clearable>
                  <el-option v-for="item in currencyIds" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="购入记录" v-show="buyPaymentList.length > 0">
              <el-table :data="buyPaymentList" style="width: 100%;">
                <el-table-column align="center" prop="time" label="日期">
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

                <el-table-column width="250px" align="center" prop="productDes" label="產品描述">
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip class="item" effect="light" :content="scope.row.productDes" placement="top-end">
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
                <el-table-column align="center" prop="totalHkPrice" :label="currencyFontRgx(currencyGlobal) + '金額'">
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
                <el-table-column align="center" prop="receiveType" label="交易方式">
                </el-table-column>
                <el-table-column width="250px" align="center" prop="remark" label="Remarks">
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top-end">
                        <div class="font-warp">{{ scope.row.remark }}</div>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane v-if="sold == 2 || sold == 3 || sold == 4 || sold == 8" :label="sold == 8 ? '寄卖信息' : '销售信息'"
          name="third">
          <el-form ref="saleForm" label-width="110px">
            <el-form-item label="账单号" :required="sold == 4 || sold == 8 ? true : false"
              v-if="sold == 3 || sold == 4 || sold == 8">
              <el-input v-model="bill" style="width:50%;" placeholder="请输入账单号"></el-input>
            </el-form-item>
            <el-form-item :label="sold == 8 ? '寄卖时间' : '出售时间'" :required="sold == 4 || sold == 8 ? true : false"
              v-if="sold == 3 || sold == 4 || sold == 8">
              <el-date-picker v-model="soldTime" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd"
                format="yyyy-MM-dd" style="width:50%;"></el-date-picker>
            </el-form-item>
            <el-form-item :label="sold == 8 ? '寄卖外币金额' : '出售外币金额'">
              <div style="width:50%;display: flex;">
                <el-input type="text" :placeholder="
                  sold == 8 ? '请输入寄卖外币金额' : '请输入出售外币金额'
                " v-model="priceTran" clearable @input="isSellHKD"></el-input>
                <el-select v-model="sellCurrencyId" placeholder="请选择币种" clearable @change="isSellHKD">
                  <el-option v-for="item in currencyIds" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="是否收款完成" v-if="sold == 3 || sold == 4 || sold == 8">
              <el-switch v-model="isReceiveCheck"></el-switch>
            </el-form-item>
            <!-- 物流费/银行手续费送货(HKD) -->
            <el-form-item label="物流费/手续费" v-if="sold == 3 || sold == 4 || sold == 8">
              <el-input v-model="saleLogHkPrice" style="width:50%;" placeholder="请输入物流费/银行手续费送货"><i slot="suffix"
                  style="color: #000;margin-right:5%;font-style:normal;">{{ currencyGlobal }}</i></el-input>
            </el-form-item>
            <el-form-item :label="
              sold == 8
                ? '寄卖' + currencyFontRgx(currencyGlobal) + '金额'
                : '出售' + currencyFontRgx(currencyGlobal) + '金额'
            " :required="sold == 4 || sold == 8 ? true : false" v-if="sold == 3 || sold == 4 || sold == 8">
              <div style="display: flex;">
                <el-input v-model="saleTotalHkPrice" style="width:50%;" :placeholder="
                  sold == 8
                    ? '请输入寄卖' + currencyFontRgx(currencyGlobal) + '金额'
                    : '请输入出售' + currencyFontRgx(currencyGlobal) + '金额'
                "></el-input>
              </div>
            </el-form-item>
            <el-form-item label="销售人员" :required="sold == 4 || sold == 8 ? true : false"
              v-if="sold == 3 || sold == 4 || sold == 8">
              <el-select style="width: 50%;" v-model="sellerId" placeholder="请选择销售人员">
                <el-option v-for="item in sellerList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户姓名" v-show="sold != 8" :required="sold == 2 || sold == 4 ? true : false">
              <el-autocomplete style="width: 50%;" v-model="customer" :fetch-suggestions="querySearch"
                placeholder="请选择/输入客户姓名" @select="handleSelect"></el-autocomplete>
            </el-form-item>
            <el-form-item label="客户类型" :required="sold == 4 || sold == 8 ? true : false"
              v-if="sold == 3 || sold == 4 || sold == 8">
              <el-autocomplete style="width: 50%;" v-model="customerType" :fetch-suggestions="queryCustomerTypeSearch"
                placeholder="请选择/输入客户类型" @select="handleCustomerTypeSelect"></el-autocomplete>
            </el-form-item>
            <el-form-item label="接收仓库" v-show="sold == 8" required>
              <el-cascader style="width: 50%;" v-model="receiveWarehouseId" :options="companyAndWarehouseList" :props="{
                value: 'id',
                label: 'name',
                children: 'warehouseList'
              }"></el-cascader>
            </el-form-item>

            <el-form-item label="出库时间" required v-if="sold == 4">
              <el-date-picker v-model="stockOutTime" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd"
                format="yyyy-MM-dd" style="width:50%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="出售记录" v-show="salePaymentList.length > 0">
              <el-table :data="salePaymentList" style="width: 100%;">
                <el-table-column align="center" prop="time" label="日期">
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
                <el-table-column width="250px" align="center" prop="productDes" label="產品描述">
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip class="item" effect="light" :content="scope.row.productDes" placement="top-end">
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
                <el-table-column align="center" prop="totalHkPrice" :label="currencyFontRgx(currencyGlobal) + '金額'">
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
                <el-table-column align="center" prop="receiveType" label="交易方式">
                </el-table-column>
                <el-table-column width="250px" align="center" prop="remark" label="Remarks">
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top-end">
                        <div class="font-warp">{{ scope.row.remark }}</div>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="资金流" name="fifth" v-if="allPaymentList.length > 0">
          <el-table :data="allPaymentList" style="width: 100%;margin-bottom: 22px;">
            <el-table-column align="center" prop="time" label="日期">
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
            <el-table-column align="center" prop="tradeType" label="買入/賣出">
              <template slot-scope="scope">
                <div>
                  {{ tradeTypeRgx(scope.row.tradeType) }}
                </div>
              </template>
            </el-table-column>

            <el-table-column width="250px" align="center" prop="productDes" label="產品描述">
              <template slot-scope="scope">
                <div>
                  <el-tooltip class="item" effect="light" :content="scope.row.productDes" placement="top-end">
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
            <el-table-column align="center" prop="totalHkPrice" :label="currencyFontRgx(currencyGlobal) + '金額'">
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
            <el-table-column align="center" prop="receiveType" label="交易方式">
            </el-table-column>
            <el-table-column width="250px" align="center" prop="remark" label="Remarks">
              <template slot-scope="scope">
                <div>
                  <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top-end">
                    <div class="font-warp">{{ scope.row.remark }}</div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="备注信息" name="fourth">
          <el-form ref="noteForm">
            <el-form-item label="备注">
              <el-input type="textarea" style="width:50%;" placeholder="请输入备注信息" v-model="note"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div style="position: fixed;right: 40px;bottom: 60px;">
        <el-button style="width: 160px;" type="primary" v-preventClick @click="submitForm">立即创建</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import upload from '@/components/upload.vue';
export default {
  components: { upload },
  data() {
    return {
      num: "",
      baseUrl: this.$store.state.baseUrl,
      modelSize: [],
      form: "",
      pics: "",
      sold: null, // 库存状态
      bill: "", // 账单号
      sellCurrencyId: null, // 出售外币金额币种
      priceTran: "", // 出售外币金额
      customer: "", //客户姓名
      soldTime: "", //出售时间
      stockOutTime: "", // 出库时间
      productCode: "", // 货号
      estimateTime: "", // 预计到达时间
      createTime: "", //入库时间

      isPayCheck: false,
      isReceiveCheck: false,
      currencyId: "", //价格币种
      cost: undefined, //成本价
      pricePeer: undefined, //同行价
      peerCurrencyId: '',
      priceIndi: undefined, //散客价
      indiCurrencyId: '',
      source: "", //买手
      stockLoc: "", //库存地
      model: "", //款式
      size: "", //大小
      leather: "", //材质
      metal: "", //金属质感
      colorId: "", //色号
      color: "", //颜色
      colorSeries: "", //色系
      letter: "", //刻度
      stockStat: "", //状态
      note: "", // 备注
      stock: [],
      imgsUpload: "", //上传图片
      dialogImageUrl: "",
      dialogVisible: false,

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

      stockLocs: [],
      sizeList: [],
      leathers: [],
      clrs: [],
      metals: [],

      stockStats: [],
      colorList: [],

      isInput: 0,
      isSelect: 0,
      isColor: 0,
      loading: null,
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
          label: "客人寄卖",
          value: "9"
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
          label: "已寄卖",
          value: "8"
        },
        {
          label: "已出库",
          value: "4"
        }
      ],
      showImg: true,
      isRequire: 0,

      saleLogHkPrice: "",
      saleTotalHkPrice: "",

      buyAllPrice: undefined,
      totalHkPrice: undefined,
      logHkPrice: undefined,

      receiveTypeList: [
        {
          label: "现金",
          value: "现金"
        },
        {
          label: "记账",
          value: "记账"
        },
        {
          label: "渣打",
          value: "渣打"
        },
        {
          label: "工行",
          value: "工行"
        },
        {
          label: "港币转账",
          value: "港币转账"
        },
        {
          label: "港币现金",
          value: "港币现金"
        },
        {
          label: "美金现金",
          value: "美金现金"
        },
        {
          label: "OK钱包",
          value: "OK钱包"
        },
        {
          label: "汇旺收款",
          value: "汇旺收款"
        },
        {
          label: "人民币转账",
          value: "人民币转账"
        }
      ],

      activeName: "first",
      customerList: [],

      buyPaymentList: [],
      salePaymentList: [],
      allPaymentList: [],
      companyAndWarehouseList: [],
      receiveWarehouseId: null,
      companyId: null,
      currencyGlobal: "",

      sellerId: "",
      sellerList: [],
      customerTypeList: [],
      customerType: "",

      imgUrl: [],
      imgUrl2: []
    };
  },
  created() {
    this.currencyGlobal = sessionStorage.getItem("currencyGlobal");
    this.getData();
    this.getDataStock();
    this.getCustomerList();
    this.getCompanyAndWarehouseList();
    this.getSellerAndCustomerType();
  },
  mounted() {
    this.companyId = sessionStorage.getItem("companyId");
    document.getElementById("publishContainer").scrollIntoView({
      behavior: "smooth"
    });
  },
  methods: {
    // 款式輸入/匹配
    queryModelSearch(queryString, cb) {
      this.isRequire = 1;
      console.log(typeof queryString);
      let restaurants = this.modelSize;

      for (let items of restaurants) {
        items.value = items.name;
      }

      let results = queryString
        ? restaurants.filter(this.createModelFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createModelFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleModelSelect(item) {
      this.isRequire = 0;
      console.log(item);
      this.model = item.name;
      this.sizeSel(item);
    },
    // 大小輸入/選擇
    querySizeSearch(queryString, cb) {
      console.log(typeof queryString);
      let restaurants = this.sizeList;

      for (let items of restaurants) {
        items.value = items.name;
      }

      let results = queryString
        ? restaurants.filter(this.createSizeFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createSizeFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSizeSelect(item) {
      console.log(item);
      this.size = item.name;
    },
    // 根据货号获取购入记录
    productCodeChange() {
      if (this.productCode != "") {
        this.$axios
          .get(this.baseUrl + "/paymentListGet?productCode=" + this.productCode)
          .then(res => {
            console.log("通过货号获取购入/销售记录");
            console.log(res);
            let list = res.data;
            this.buyPaymentList = list.buyPaymentList;
            this.salePaymentList = list.salePaymentList;
            this.allPaymentList = list.allPaymentList;
          })
          .catch(err => {
            console.log(err);
          });
      }
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

    // 采购为港币
    isPurchaseHKD() {
      this.buyAllPrice = this.getIntegerNum(this.buyAllPrice);
      if (this.currencyId == 2) {
        this.totalHkPrice = this.buyAllPrice;
      } else {
        this.totalHkPrice = undefined;
      }
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
    // 提交
    data1() {
      if (this.sold == null) {
        this.$message.error({
          message: "请选择库存状态",
          showClose: true,
          duration: 2000
        });
        return 1;
      } else {
        if (this.sold == 2) {
          if (this.customer == "") {
            console.log("-");
            this.$message.error({
              message: "请填写客户姓名",
              showClose: true,
              duration: 2000
            });
            return 1;
          }
        } else if (this.sold == 4) {
          if (
            this.soldTime == "" ||
            this.soldTime == null ||
            this.customer == "" ||
            this.stockOutTime == "" ||
            this.stockOutTime == null ||
            this.bill == "" ||
            this.saleTotalHkPrice == "" ||
            this.saleTotalHkPrice == undefined ||
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
        } else if (this.sold == 8) {
          if (
            this.soldTime == "" ||
            this.soldTime == null ||
            this.receiveWarehouseId == null ||
            this.receiveWarehouseId == "" ||
            this.bill == "" ||
            this.saleTotalHkPrice == "" ||
            this.saleTotalHkPrice == undefined ||
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

        if (
          this.sold == 1 ||
          this.sold == 2 ||
          this.sold == 3 ||
          this.sold == 4 ||
          this.sold == 8 || this.sold == 9
        ) {
          if (this.createTime == "" || this.createTime == null) {
            this.$message.error({
              message: "请选择入库时间",
              showClose: true,
              duration: 2000
            });
            return 1;
          }
        }
      }

      if (
        this.imgUrl.length === 0 ||
        this.productCode == "" ||
        this.stockLoc == "" ||
        this.model == ""
      ) {
        console.log("------");
        this.$message.error({
          message: "数据不能为空，请检查数据填写",
          showClose: true,
          duration: 2000
        });
        return 1;
      }

      if (this.isRequire == 0) {
        if (
          this.size == "" ||
          this.leather == "" ||
          this.metal == "" ||
          this.stock.length == 0
        ) {
          console.log("------");
          this.$message.error({
            message: "数据不能为空，请检查数据填写",
            showClose: true,
            duration: 2000
          });
          return 1;
        }

        if (this.colorId == "") {
          if (this.color == "") {
            this.$message.error({
              message: "请输入颜色",
              showClose: true,
              duration: 2000
            });
            return 1;
          }
        }

        if (this.color == "") {
          this.$message.error({
            message: "颜色色号输入错误，请重新填写",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      }
    },
    submitForm() {
      if (this.data1() !== 1) {
        if (
          (this.logHkPrice || this.totalHkPrice) &&
          this.cost &&
          this.cost != Number(this.totalHkPrice) + Number(this.logHkPrice)
        ) {
          this.$message.error({
            message: "總成本不等於入庫價與物流費之和，不可提交"
          });
        } else {
          this.updateData();
        }
      }
    },
    // 图片
    eightImgs(val) {
      console.log(val);
      this.imgUrl = val
    },
    thirtyImgs(val) {
      console.log(val);
      this.imgUrl2 = val
    },
    updateData() {
      this.stockStat = "";
      for (let item of this.stock) {
        if (item !== "") {
          this.stockStat += item + "|";
        }
      }

      let name = "";
      if (this.metal == "") {
        if (this.isRequire == 1) {
          if (this.color == "" && this.leather != "") {
            if (this.isColor == 0) {
              name = this.size + " " + this.leather;
            } else {
              name = this.size + " " + this.colorId + " " + this.leather;
            }
          } else if (this.color != "" && this.leather == "") {
            if (this.isColor == 0) {
              name = this.size + " " + this.color;
            } else {
              name = this.size + " " + this.colorId + " " + this.color;
            }
          } else if (this.color == "" && this.leather == "") {
            if (this.isColor == 0) {
              name = this.size;
            } else {
              name = this.size + " " + this.colorId;
            }
          } else {
            if (this.isColor == 0) {
              name = this.size + " " + this.color + " " + this.leather;
            } else {
              name =
                this.size +
                " " +
                this.colorId +
                " " +
                this.color +
                " " +
                this.leather;
            }
          }

          name = this.model + " " + name;
        } else {
          if (this.isColor == 0) {
            name = this.size + " " + this.color + " " + this.leather;
          } else {
            name =
              this.size +
              " " +
              this.colorId +
              " " +
              this.color +
              " " +
              this.leather;
          }
        }
      } else {
        if (this.isRequire == 1) {
          if (this.color == "" && this.leather != "") {
            if (this.isColor == 0) {
              name = this.size + " " + this.leather + " " + this.metal + "扣";
            } else {
              name =
                this.size +
                " " +
                this.colorId +
                " " +
                this.leather +
                " " +
                this.metal +
                "扣";
            }
          } else if (this.color != "" && this.leather == "") {
            if (this.isColor == 0) {
              name = this.size + " " + this.color + " " + this.metal + "扣";
            } else {
              name =
                this.size +
                " " +
                this.colorId +
                " " +
                this.color +
                " " +
                this.metal +
                "扣";
            }
          } else if (this.color == "" && this.leather == "") {
            if (this.isColor == 0) {
              name = this.size + " " + this.metal + "扣";
            } else {
              name = this.size + " " + this.colorId + " " + this.metal + "扣";
            }
          } else {
            if (this.isColor == 0) {
              name =
                this.size +
                " " +
                this.color +
                " " +
                this.leather +
                " " +
                this.metal +
                "扣";
            } else {
              name =
                this.size +
                " " +
                this.colorId +
                " " +
                this.color +
                " " +
                this.leather +
                " " +
                this.metal +
                "扣";
            }
          }

          name = this.model + " " + name;
        } else {
          if (this.isColor == 0) {
            name =
              this.size +
              " " +
              this.color +
              " " +
              this.leather +
              " " +
              this.metal +
              "扣";
          } else {
            name =
              this.size +
              " " +
              this.colorId +
              " " +
              this.color +
              " " +
              this.leather +
              " " +
              this.metal +
              "扣";
          }
        }
      }
      console.log(name);

      let params = {
        pics: this.imgUrl.join('|'),
        privateImg: this.imgUrl2.join('|'),
        productCode: this.productCode,
        sold: this.sold,
        bill: this.bill,
        sellCurrencyId: this.sellCurrencyId,
        priceTran: this.priceTran,
        customer: this.customer,
        receiveWarehouseId: this.sold == 8 ? this.receiveWarehouseId[1] : null,
        soldTime: this.soldTime,
        stockOutTime: this.stockOutTime,
        createTime: this.createTime,
        estimateTime: this.estimateTime,
        currencyId: this.currencyId,
        cost: this.cost,
        pricePeer: this.pricePeer,
        peerCurrencyId: this.peerCurrencyId,
        priceIndi: this.priceIndi,
        indiCurrencyId: this.indiCurrencyId,
        source: this.source,
        stockLocId: this.stockLoc.warehouseId,
        companyId: this.stockLoc.companyId,
        model: this.model,
        size: this.size,
        leather: this.leather,
        metal: this.metal,
        colorId: this.colorId,
        color: this.color,
        letter: this.letter,
        stockStat: this.stockStat,
        name: name,
        colorSeries: this.colorSeries,
        note: this.note,
        saleStat: "出售中",
        buyAllPrice: this.buyAllPrice,
        totalHkPrice: this.totalHkPrice,
        logHkPrice: this.logHkPrice,
        saleLogHkPrice: this.saleLogHkPrice,
        saleTotalHkPrice: this.saleTotalHkPrice,
        isPayCheck: this.isPayCheck == false ? 0 : 1,
        isReceiveCheck: this.isReceiveCheck == false ? 0 : 1,
        sellerId: this.sellerId,
        customerType: this.customerType
      };

      this.cost = undefined;
      console.log("总成本", this.cost);

      this.$axios
        .post(this.baseUrl + "/insert", params)
        .then(res => {
          console.log("1111tong");
          console.log(res);
          if (res.status == 200) {
            this.$message.success({
              message: "商品发布成功",
              showClose: true,
              duration: 2000
            });

            this.imgUrl = [];
            this.imgUrl2 = [];

            this.productCode = "";
            this.sold = null;
            this.bill = "";
            this.sellCurrencyId = "";
            this.priceTran = "";
            this.customer = "";
            this.receiveWarehouseId = null;
            this.soldTime = "";
            this.stockOutTime = "";
            this.createTime = "";
            this.currencyId = "";
            this.$nextTick(() => {
              this.cost = undefined;
              console.log("总成本", this.cost);
              this.pricePeer = undefined;
              this.priceIndi = undefined;
              this.buyAllPrice = undefined;
              this.totalHkPrice = undefined;
              this.logHkPrice = undefined;
            });
            this.peerCurrencyId = '';
            this.indiCurrencyId = '';

            this.source = "";
            this.stockLoc = "";
            this.model = "";
            this.size = "";
            this.leather = "";
            this.isInput = 0;
            this.isSelect = 0;
            this.metal = "";
            this.colorId = "";
            this.color = "";
            this.letter = "";
            this.stock = [];
            this.stockStat = "";
            this.colorSeries = "";
            this.note = "";
            this.estimateTime = "";
            this.saleLogHkPrice = "";
            this.saleTotalHkPrice = "";
            this.isPayCheck = false;
            this.isReceiveCheck = false;
            this.sellerId = "";
            this.customerType = "";

            this.activeName = "first";
          }

          document
            .getElementById("publishContainer")
            .scrollIntoView({ behavior: "smooth" });
        })
        .catch(err => {
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 6000
          });
        });
    },
    // 计算总成本
    costCalculate() {
      this.totalHkPrice = this.getIntegerNum(this.totalHkPrice);
      this.logHkPrice = this.getIntegerNum(this.logHkPrice);
      this.cost = Number(this.totalHkPrice) + Number(this.logHkPrice);
    },
    // 數字格式
    numCheckout() {
      this.cost = this.getIntegerNum(this.cost);
      this.pricePeer = this.getIntegerNum(this.pricePeer);
      this.priceIndi = this.getIntegerNum(this.priceIndi);
    },

    // 是否显示内部图片
    showImgSel() {
      console.log(this.showImg);
      if (this.showImg) {
        this.showImg = false;
      } else {
        this.showImg = true;
      }
    },
    stateChange() {
      this.activeName = "first";
      this.estimateTime = "";
      this.createTime = "";
      this.isPayCheck = false;
      this.isReceiveCheck = false;
      if (this.sold != 2 && this.sold != 3 && this.sold != 4) {
        this.priceTran = "";
        this.customer = "";
        this.sellCurrencyId = "";
      } else if (this.sold != 3 && this.sold != 4) {
        this.bill = "";
        this.soldTime = "";
      } else {
        this.stockOutTime = "";
      }

      if (this.sold == 8) {
        this.customerType = "公司";
      } else {
        this.customerType = "";
      }
    },
    sizeSel(e) {
      if (e.id > 100) {
        this.isRequire = 1;
      } else {
        this.isRequire = 0;
      }
      console.log(this.model);
      this.size = "";
      this.sizeList = [];
      let list = [];
      for (let i = 0; i < this.modelSize.length; i++) {
        if (this.model == this.modelSize[i].name) {
          list = this.modelSize[i].size;
          break;
        }
      }
      if (list.length > 0) {
        for (const index in list) {
          this.sizeList.push({
            name: list[index]
          });
        }
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleChange(value) {
      console.log(value);
      this.leather = value[1];
      console.log(this.leather);
    },
    isInputSel() {
      this.leather = "";
      if (this.isInput == 0) {
        this.isInput = 1;
      } else if (this.isInput == 1) {
        this.isInput = 0;
      }
    },
    isSelectSel() {
      this.metal = "";
      if (this.isSelect == 0) {
        this.isSelect = 1;
      } else if (this.isSelect == 1) {
        this.isSelect = 0;
      }
    },
    // 颜色色系
    colorIdBlur() {
      this.color = "";
      this.colorSeries = "";
      if (this.colorId.match(/[a-zA-Z]/g) !== null) {
        this.colorId = this.colorId.toUpperCase();
      }
      this.colorList = this.colorId.split("/");
      for (let k = 0; k < this.colorList.length; k++) {
        for (let i in this.clrs) {
          for (let j in this.clrs[i].yanse) {
            if (this.colorList[k] === this.clrs[i].yanse[j].sehao) {
              if (this.color === '') {
                this.color += this.clrs[i].yanse[j].name;
                this.colorSeries += this.clrs[i].sexi
              } else {
                this.color += '拼' + this.clrs[i].yanse[j].name;
                this.colorSeries += '/' + this.clrs[i].sexi
              }
            }
          }
        }
      }
    },
    // 是否有色号
    isColorSel() {
      this.colorId = "";
      if (this.isColor == 0) {
        this.isColor = 1;
      } else if (this.isColor == 1) {
        this.isColor = 0;
      }
    },
    // 时间转换
    transitionTime(time) {
      if (time) {
        let date = new Date(time);
        console.log("MMM" + date);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var m1 = date.getMinutes();
        var s = date.getSeconds();
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        h = h < 10 ? "0" + h : h;
        m1 = m1 < 10 ? "0" + m1 : m1;
        s = s < 10 ? "0" + s : s;
        console.log(
          "qqq" + y + "-" + m + "-" + d + " " + h + ":" + m1 + ":" + s
        );
        return y + "-" + m + "-" + d + " " + h + ":" + m1 + ":" + s;
      }
    },

    // 获取选项数据
    getData() {
      this.$axios.get(this.baseUrl + "/modelSizeLeathers").then(res => {
        console.log("选项数据");
        console.log(res);
        this.modelSize = res.data.modelSize;
        this.leathers = res.data.leathers;
        this.metals = res.data.metals;
        this.stockStats = res.data.stockStats;
        this.clrs = res.data.clrs;
      });
    },
    getDataStock() {
      this.$axios.get(this.baseUrl + "/stockLocList").then(res => {
        console.log("库存地");
        console.log(res);
        this.stockLocs = res.data;
        if (this.stockLocs.length > 0) {
          this.stockLocs.splice(0, 1);
        }
      });
    },
    // 獲取接收公司及倉庫列表
    getCompanyAndWarehouseList() {
      this.$axios
        .get(this.$store.state.baseCompanyUrl + "/sell/receiveCompanyMsgGet")
        .then(res => {
          console.log("接收公司及倉庫");
          console.log(res);
          this.companyAndWarehouseList = res.data;

          let list = [];
          for (const item of this.companyAndWarehouseList) {
            if (item.warehouseList.length > 0) {
              list.push(item);
            }
          }

          this.companyAndWarehouseList = list;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.publish-container {
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 6px;
}

.font-warp {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style lang="scss">
.el-upload--picture-card {
  width: 100px !important;
  height: 100px !important;
  line-height: 110px;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  margin: auto 0;
}
</style>
