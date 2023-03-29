<template>
  <div class="update-container">
    <!-- 分公司可以查看總公司商品，但是庫存地沒法顯示，因為分公司只能顯示自己所管理的倉庫 -->
    <div style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
      @click="goback">
      <img src="../assets/imgs/goback.png" style="height: 21px;" />
      <p style="margin: 0;">返回</p>
    </div>
    <el-form ref="globalForm" label-width="121px">
      <el-form-item label="货号" required>
        <el-form-item>
          <el-input style="width:50%;" type="text" placeholder="请输入货号" v-model="productCode" clearable></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="库存地" required>
        <el-select v-if="sold == 8" v-model="stockLocId" placeholder="请选择" clearable style="width:50%;"
          value-key="warehouseId">
          <el-option v-for="item in stockLocs" :key="item.warehouseId" :label="item.warehouseName" :value="item">
            <span style="float: left">{{ item.warehouseName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.companyName
            }}</span>
          </el-option>
        </el-select>
        <el-select v-else v-model="stockLocId" placeholder="请选择" clearable style="width:50%;" value-key="warehouseId">
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
        <el-select style="width: 50%;" v-model="sold" placeholder="请选择" @change="stateChange">
          <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否为客人寄卖" required>
        <el-switch v-model="isCustomerConsigns" active-color="#13ce66" inactive-color="#ff4949" active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="预计到达时间" v-if="sold == 0">
        <el-date-picker type="date" placeholder="请选择日期时间" v-model="estimateTime" style="width:50%;"
          value-format="yyyy-MM-dd" format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="入库时间" required v-if="sold == 1 || sold == 2 || sold == 3 || sold == 8 || sold == 9">
        <el-date-picker style="width:50%;" v-model="createTime" type="date" placeholder="请选择日期时间"
          value-format="yyyy-MM-dd" format="yyyy-MM-dd"
          :disabled="sold == 3 || sold == 8 ? true : false"></el-date-picker>
      </el-form-item>
      <el-form-item label="取回时间" required v-if="sold == 5">
        <el-date-picker v-model="stockOutTime" type="date" style="width:50%;" placeholder="请选择日期"
          value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="退货时间" required v-if="sold == 6">
        <el-date-picker v-model="stockOutTime" type="date" style="width:50%;" placeholder="请选择日期"
          value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="时间" required v-if="sold == 7">
        <el-date-picker v-model="stockOutTime" type="date" style="width:50%;" placeholder="请选择日期"
          value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName">
      <el-tab-pane label="图片及参数" name="first">
        <div>
          <upload :isAdd="false" :imgNum="9" :imgs="imgSrc" @uploadImgsRes="eightImgs"></upload>
        </div>
        <div>
          <upload :isAdd="false" :imgNum="30" :imgs="imgSrc2" @uploadImgsRes="thirtyImgs"></upload>
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
            <el-cascader v-model="leather" :options="leathers" @change="handleChange" style="width:50%;"
              v-if="isInput == 0">
            </el-cascader>
            <el-input v-if="isInput == 1" v-model="leather" style="width: 50%;" placeholder="请输入"></el-input>
            <el-button style="border: 0;" type="text" @click="isInputSel">{{
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
            <el-button style="border: 0;" type="text" @click="isColorSel">{{
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
              <el-checkbox v-for="stock in stockStats" :label="stock" :key="stock">{{ stock }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="采购及价格" name="second">
        <el-form label-width="110px">
          <el-form-item label="买手">
            <el-input style="width:50%;" placeholder="请输入买手" v-model="source" clearable></el-input>
          </el-form-item>
          <el-form-item label="采购金额">
            <div style="width: 50%;display: flex;">
              <el-input style="flex: 1;" type="text" placeholder="请输入采购金额" v-model="buyAllPrice" clearable
                :controls="false" @input="isPurchaseHKD"></el-input>
              <el-select v-model="currencyId" placeholder="请选择采购价币种" clearable @change="isPurchaseHKD">
                <el-option v-for="item in currencyIds" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="'外币转' + currencyFontRgx(currencyGlobal) + '汇率'">
            <el-input type="text" style="width:50%;" placeholder="请输入汇率" v-model="foreignToSettleRate"
              @input="isPurchaseHKD" clearable></el-input>
          </el-form-item>
          <el-form-item label="是否付款完成">
            <el-switch v-model="isPayCheck"></el-switch>
          </el-form-item>
          <el-form-item :label="'入库价(' + currencyGlobal + ')'">
            <el-input style="width:50%;" type="text" placeholder="请输入入库价" v-model="totalHkPrice" clearable
              :controls="false" @input="costCalculate"></el-input>
          </el-form-item>
          <el-form-item :label="'其他费用(' + currencyGlobal + ')'">
            <el-input style="width:50%;" type="text" placeholder="请输入物流金额" v-model="logHkPrice" clearable
              :controls="false" @input="costCalculate"></el-input>
          </el-form-item>
          <el-form-item :label="'总成本(' + currencyGlobal + ')'">
            <el-input style="width:50%;" type="text" placeholder="请输入总成本" v-model="cost" clearable :controls="false"
              @change="numCheckout"></el-input>
          </el-form-item>
          <el-form-item label="同行价">
            <div style="width: 50%;display: flex;">
              <el-input :controls="false" style="flex: 1;" placeholder="请输入同行价" v-model="pricePeer" clearable
                @change="numCheckout"></el-input>
              <el-select v-model="peerCurrencyId" placeholder="请选择币种" clearable>
                <el-option v-for="item in currencyIds" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="散客价">
            <div style="width: 50%;display: flex;">
              <el-input :controls="false" style="flex: 1;" placeholder="请输入散客价" v-model="priceIndi" clearable
                @change="numCheckout"></el-input>

              <el-select v-model="peerCurrencyId" placeholder="请选择币种" clearable>
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
      <el-tab-pane :label="sold == 8 ? '寄卖信息' : '销售信息'" name="third" v-if="sold == 2 || sold == 3 || sold == 8">
        <el-form ref="saleForm" label-width="121px">
          <el-form-item label="账单号" :required="isStock == 1 || sold == 8 ? true : false" v-if="sold == 3 || sold == 8">
            <el-input v-model="bill" style="width: 50%;"></el-input>
          </el-form-item>
          <el-form-item :label="sold == 8 ? '寄卖时间' : '出售时间'" :required="isStock == 1 || sold == 8 ? true : false"
            v-if="sold == 3 || sold == 8">
            <el-date-picker v-model="soldTime" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd"
              format="yyyy-MM-dd" style="width:50%;"></el-date-picker>
          </el-form-item>
          <el-form-item :label="sold == 8 ? '寄卖外币金额' : '出售外币金额'">
            <div style="width: 50%;display: flex;">
              <el-input type="text" style="flex: 1;" :placeholder="
                sold == 8 ? '请输入寄卖外币金额' : '请输入出售外币金额'
              " v-model="priceTran" clearable @change="isSellHKD"></el-input>
              <el-select v-model="sellCurrencyId" placeholder="请选择" clearable @change="isSellHKD">
                <el-option v-for="item in currencyIds" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="是否收款完成" v-if="sold == 3 || sold == 8">
            <el-switch v-model="isReceiveCheck"></el-switch>
          </el-form-item>
          <!-- 物流费/银行手续费送货(HKD) -->
          <el-form-item label="物流费/手续费" v-if="sold == 3 || sold == 8">
            <div style="width: 50%;display: flex;">
              <el-input style="flex: 1;" v-model="saleLogHkPrice" placeholder="请输入物流费/银行手续费送货"></el-input>
              <span>{{ currencyGlobal }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="
            sold == 8
              ? '寄卖' + currencyFontRgx(currencyGlobal) + '金额'
              : '出售' + currencyFontRgx(currencyGlobal) + '金额'
          " :required="
  (isStock == 1 && isHeadConsigns != 1) || sold == 8 ? true : false
" v-if="sold == 3 || sold == 8">
            <div style="width: 50%;display: flex;">
              <el-input style="flex: 1;" v-model="saleTotalHkPrice" :placeholder="
                sold == 8
                  ? '请输入寄卖' + currencyFontRgx(currencyGlobal) + '金额'
                  : '请输入出售' + currencyFontRgx(currencyGlobal) + '金额'
              "></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="'出售' + currencyFontRgx(headCurrency) + '金额'" :required="isStock == 1 ? true : false"
            v-if="sold == 3 && isHeadConsigns == 1">
            <div style="width: 50%;display: flex;">
              <el-input style="flex: 1;" v-model="headSellMoney" :placeholder="
                '请输入出售' +
                currencyFontRgx(headCurrency) +
                '金额，用于与总公司结算'
              "></el-input>
            </div>
          </el-form-item>
          <el-form-item label="销售人员" :required="isStock == 1 || sold == 8 ? true : false" v-if="sold == 3 || sold == 8">
            <el-select style="width: 50%;" v-model="sellerId" placeholder="请选择销售人员">
              <el-option v-for="item in sellerList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户姓名" :required="isStock == 1 || sold == 2 ? true : false" v-show="sold != 8">
            <el-autocomplete style="width: 50%;" v-model="customer" :fetch-suggestions="querySearch"
              placeholder="请选择/输入客户姓名" @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label="客户类型" :required="isStock == 1 || sold == 8 ? true : false" v-if="sold == 3 || sold == 8">
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

          <el-form-item label="是否同时出库" label-width="110px" v-if="sold == 3">
            <el-radio-group v-model="isStock">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出库时间" required v-if="sold == 3 && isStock == 1">
            <el-date-picker v-model="stockOutTime" type="date" style="width:50%;" placeholder="请选择日期"
              value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="出售记录" v-show="sellPaymentList.length > 0">
            <el-table :data="sellPaymentList" style="width: 100%;">
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
                  scope.row.totalToHkRate == "" || scope.row.totalToHkRate == 0
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
            <el-input type="textarea" placeholder="请输入备注信息" style="width:50%;" v-model="note"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div style="position: fixed;right: 40px;bottom: 60px;">
      <el-button type="primary" style="width: 160px;" v-preventClick @click="basicInfoUpdateSure">提 交</el-button>
    </div>
  </div>
</template>

<script>
import upload from '@/components/upload.vue';
export default {
  components: { upload },
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      modelSize: [],
      updateId: this.updatesId,

      imgSrc: [],
      imgSrc2: [],

      isCustomerConsigns: '0',
      productCode: "", // 货号
      estimateTime: "", // 预计到达时间
      createTime: "", //入库时间
      createAccount: "",
      sellCurrencyId: "", // 出售外币金额币种

      isPayCheck: false,
      isReceiveCheck: false,

      currencyId: "", //价格币种
      cost: "", //成本价
      pricePeer: "", //同行价
      peerCurrencyId: '',
      priceIndi: '', //散客价
      source: "", //买手
      stockLocId: "", //库存地
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
      priceTran: "", //成交价
      customer: "", //客户名称
      bill: "", //账单号
      soldTime: new Date(), //售出时间
      isStock: 0, // 是否同时出库
      stockOutTime: "", // 出库时间
      imgsUpload: "", //上传图片
      dialogImageUrl: "",
      receiveWarehouseId: null,
      companyAndWarehouseList: [],

      sold: 0,
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
      imgs: "",
      delList: [],
      delList2: [],
      showImg: false,

      stockOutTime: null,
      stockLocList: [],

      isInput: 1,
      isSelect: 1,
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
          label: "已寄卖",
          value: "8"
        },
        {
          label: "遗失",
          value: "7"
        },
        {
          label: "客人取回",
          value: "5"
        },
      ],
      dialogStateVisible: false,
      updateStateId: null,
      userId: null,
      userList: [],

      bill: "",
      isRequire: 0,
      dialogWarehouseLocUpdateVisible: false,
      locUpdateId: null,

      activeName: "first",
      saleLogHkPrice: "",
      saleTotalHkPrice: "",
      headSellMoney: "",
      isHeadConsigns: 0,
      headCurrency: "",

      buyAllPrice: undefined,
      foreignToSettleRate: '',
      totalHkPrice: undefined,
      logHkPrice: undefined,

      customerList: [],
      buyPaymentList: [],
      sellPaymentList: [],
      allPaymentList: [],

      isUpdateOrDel: null,
      companyId: null,
      currencyGlobal: "",

      sellerId: "",
      sellerList: [],
      customerTypeList: [],
      customerType: "",
      numIsEquality: false,
    };
  },
  props: ["updatesId"],
  created() {
    this.currencyGlobal = sessionStorage.getItem("currencyGlobal");
    this.getData();
    this.getCustomerList();
    this.getDataStock();
    this.getCompanyAndWarehouseList();
    this.getSellerAndCustomerType();
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
      console.log("匹配", results);

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
      console.log("选中结果", item);
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
    // 获取产品信息
    getDetails() {
      this.showImg = false;
      this.isInput = 1;
      this.isSelect = 1;
      this.$axios
        .get(this.baseUrl + "/detail?id=" + this.updateId)
        .then(res => {
          console.log("产品详情");
          console.log(res);
          let data = res.data;

          this.imgSrc = data.pics.split("|").filter(item => {
            return item && item.trim()
          });
          this.imgSrc2 = data.privateImg.split("|").filter(item => {
            return item && item.trim()
          });

          this.productCode = data.productCode;
          this.createAccount = data.createAccount;
          this.currencyId = data.currencyId;
          this.cost = data.cost == 0 ? "" : data.cost;
          this.pricePeer = data.pricePeer == 0 ? "" : data.pricePeer;
          this.peerCurrencyId = data.peerCurrencyId + '';
          this.priceIndi = data.priceIndi == 0 ? "" : data.priceIndi;
          this.isCustomerConsigns = data.isCustomerConsigns + '';

          this.source = data.source;
          for (const item of this.stockLocs) {
            if (
              item.warehouseId == data.stockLocId &&
              item.companyId == data.companyId
            ) {
              this.stockLocId = {
                warehouseId: Number(data.stockLocId),
                warehouseName: item.warehouseName,
                companyId: Number(data.companyId)
              };
            }
          }

          this.companyId = data.companyId;

          if (data.modelId > 100) {
            this.isRequire = 1;
          } else {
            this.isRequire = 0;
          }

          this.model = data.model;

          this.size = data.size;
          this.sizeList = [];
          let list = [];
          for (let i = 0; i < this.modelSize.length; i++) {
            if (this.model == this.modelSize[i].name) {
              list = this.modelSize[i].size;
              break;
            }
          }
          if (list.length > 0) {
            this.isRequire = 0;
            for (const index in list) {
              this.sizeList.push({
                name: list[index]
              });
            }
          } else {
            this.isRequire = 1;
          }
          this.leather = data.leather;
          this.metal = data.metal;
          this.colorId = data.colorId;
          this.color = data.color;
          this.colorSeries = data.colorSeries;
          this.letter = data.letter;
          this.stockStat = data.stockStat;
          this.stock = data.stockStat.split("|").filter(el => {
            return el != "";
          });
          this.note = data.note;
          this.logHkPrice = data.logHkPrice;

          this.buyAllPrice = data.buyAllPrice;
          this.foreignToSettleRate = data.foreignToSettleRate;
          this.totalHkPrice = data.totalHkPrice;

          this.buyPaymentList = data.buyPaymentList;
          this.sellPaymentList = data.sellPaymentList;
          this.allPaymentList = data.allPaymentList;

          this.isPayCheck =
            data.isPayCheck == 0 || data.isPayCheck == null ? false : true;
          this.isReceiveCheck =
            data.isReceiveCheck == 0 || data.isReceiveCheck == null
              ? false
              : true;

          if (data.sold == 4) {
            this.sold = "3";
          } else {
            this.sold = data.sold;
          }
          this.createTime = data.createTime;
          this.bill = data.bill;
          this.estimateTime = data.estimateTime;

          this.priceTran = data.priceTran;
          this.customer = data.customer;
          this.soldTime = data.soldTime;
          this.sellCurrencyId = data.sellCurrencyId;

          this.stockOutTime = data.stockOutTime;
          this.saleLogHkPrice = data.saleLogHkPrice;
          this.saleTotalHkPrice = data.saleTotalHkPrice;
          this.headSellMoney =
            data.headSellMoney == 0 ? "" : data.headSellMoney;
          this.isHeadConsigns = data.isHeadConsigns;
          this.headCurrency = data.headCurrency;

          this.isUpdateOrDel = data.companyId;

          if (data.sold == 3) {
            this.isStock = 0;
          } else if (data.sold == 4) {
            this.isStock = 1;
          }
          if (data.sold == 8) {
            this.receiveWarehouseId = [
              data.receiveCompanyId,
              data.receiveWarehouseId
            ];
          } else {
            this.receiveWarehouseId = null;
          }
          this.sellerId = data.sellerId;
          this.customerType = data.customerType;

          this.activeName = "first";

          (function smoothscroll() {
            var currentScroll =
              document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
              window.requestAnimationFrame(smoothscroll);
              window.scrollTo(0, currentScroll - currentScroll / 5);
            }
          })();
        });
    },
    dataCheck() {
      if (this.sold == 3 && this.isStock == 1) {
        console.log("同時出庫了");
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
      // console.log(this.sold);
      if (this.sold == 1 || this.sold == 2 || this.sold == 3 || this.sold == 9) {
        if (this.createTime == "" || this.createTime == null) {
          this.$message.error({
            message: "请选择入库时间",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      }
      if (this.sold == 2) {
        if (this.customer == "" || this.customer == null) {
          console.log("-");
          this.$message.error({
            message: "请填写客户姓名",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      }
      if (this.sold == 5) {
        if (this.stockOutTime == "" || this.stockOutTime == null) {
          this.$message.error({
            message: "请选择取回时间",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      }
      if (this.sold == 6) {
        if (this.stockOutTime == "" || this.stockOutTime == null) {
          this.$message.error({
            message: "请选择退货时间",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      }
      if (this.sold == 7) {
        if (this.stockOutTime == "" || this.stockOutTime == null) {
          this.$message.error({
            message: "请选择时间",
            showClose: true,
            duration: 2000
          });
          return 1;
        }
      }
      if (this.sold == 8) {
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

      // 有 購入記錄
      if (this.buyPaymentList.length > 0) {
        let totalMoney = 0;

        totalMoney = this.buyPaymentList.reduce(
          (c, item) => c + item.totalHkPrice * 1,
          0
        );

        if (this.totalHkPrice && this.totalHkPrice != totalMoney) {
          this.numIsEquality = true;
          let msg =
            "產品購入記錄總金額為：" +
            totalMoney +
            this.currencyGlobal +
            " ,您錄入的入庫價為：" +
            this.totalHkPrice +
            this.currencyGlobal +
            " ，兩者不相等，是否確定繼續提交？";
          this.$confirm(msg, "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.numIsEquality = false;
              this.updateData();
            })
            .catch(() => {
              console.log("取消提交");
            });
          return;
        } else {
          this.numIsEquality = false;
        }
      } else {
        this.numIsEquality = false;
      }

      // 有出售記錄
      if (
        this.sellPaymentList.length > 0 &&
        (this.sold == 3 || this.sold == 4 || this.sold == 8)
      ) {
        let totalSaleMoney = 0;

        totalSaleMoney = this.sellPaymentList.reduce(
          (c, item) => c + item.totalHkPrice * 1,
          0
        );

        if (this.saleTotalHkPrice && this.saleTotalHkPrice != totalSaleMoney) {
          this.numIsEquality = true;
          let msg =
            "產品出售記錄總金額為：" +
            totalSaleMoney +
            this.currencyGlobal +
            " ,您錄入的出售金額為：" +
            this.saleTotalHkPrice +
            this.currencyGlobal +
            " ，兩者不相等，是否確定繼續提交？";
          this.$confirm(msg, "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.numIsEquality = false;
              this.updateData();
            })
            .catch(() => {
              console.log("取消提交");
            });
          return;
        } else {
          this.numIsEquality = false;
        }
      } else {
        this.numIsEquality = false;
      }
    },
    data1() {
      this.stockStat = "";
      console.log(this.stock);
      for (let item of this.stock) {
        if (item !== "") {
          this.stockStat += item + "|";
        }
      }

      if (
        this.imgSrc.length == 0 ||
        this.productCode == "" ||
        this.stockLocId == "" ||
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
          this.stockStat == ""
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
    // 确认编辑
    basicInfoUpdateSure() {
      let companys = sessionStorage.getItem("companyId");
      if (this.isUpdateOrDel != companys) {
        this.$message.error({
          message: "该商品不在您所管理的仓库中，不可进行修改",
          showClose: true,
          duration: 2000
        });
      } else {
        if (
          this.data1() != 1 &&
          this.dataCheck() != 1 &&
          this.numIsEquality == false
        ) {
          console.log("銷售人員", this.sellerId, this.customerType);
          console.log(this.cost);
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
      }
    },
    updateData() {
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

      this.$axios
        .put(this.baseUrl + "/update", {
          id: this.updateId,
          pics: this.imgSrc.join('|'),
          privateImg: this.imgSrc2.join('|'),
          productCode: this.productCode,
          createAccount: this.createAccount,
          currencyId: this.currencyId,
          cost: this.cost,
          pricePeer: this.pricePeer,
          peerCurrencyId: this.peerCurrencyId,
          priceIndi: this.priceIndi,
          indiCurrencyId: this.peerCurrencyId,
          isCustomerConsigns: this.isCustomerConsigns,
          source: this.source,
          stockLocId: this.stockLocId.warehouseId,
          companyId: this.stockLocId.companyId,
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
          foreignToSettleRate: this.foreignToSettleRate,
          totalHkPrice: this.totalHkPrice,
          logHkPrice: this.logHkPrice,
          sold: this.sold,
          bill: this.bill,
          createTime: this.createTime,
          estimateTime: this.estimateTime,
          priceTran: this.priceTran,
          customer: this.customer,
          soldTime: this.soldTime,
          sellCurrencyId: this.sellCurrencyId,
          isStock: this.isStock,
          stockOutTime: this.stockOutTime,
          saleLogHkPrice: this.saleLogHkPrice,
          saleTotalHkPrice: this.saleTotalHkPrice,
          headSellMoney: this.headSellMoney,
          isPayCheck: this.isPayCheck == false ? 0 : 1,
          isReceiveCheck: this.isReceiveCheck == false ? 0 : 1,
          receiveWarehouseId:
            this.sold == 8 ? this.receiveWarehouseId[1] : null,
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

            this.$emit("updateSuccess", 0);
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
    goback() {
      this.$emit("goback", 0);
    },
    stateChange() {
      this.activeName = "first";
      if (this.sold == 8) {
        this.customerType = "公司";
      } else {
        this.customerType = "";
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

    isInputSel() {
      if (this.isInput == 0) {
        this.isInput = 1;
      } else if (this.isInput == 1) {
        this.isInput = 0;
      }
    },
    isSelectSel() {
      if (this.isSelect == 0) {
        this.isSelect = 1;
      } else if (this.isSelect == 1) {
        this.isSelect = 0;
      }
    },
    // 是否显示内部图片
    showImgSel() {
      if (this.showImg) {
        this.showImg = false;
      } else {
        this.showImg = true;
      }
    },
    // 款式与大小的关联
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
    // 采购为港币
    isPurchaseHKD() {
      this.buyAllPrice = this.getIntegerNum(this.buyAllPrice);
      if (this.currencyId == 2) {
        this.totalHkPrice = this.buyAllPrice;
      } else {
        if (this.foreignToSettleRate && this.buyAllPrice) {
          if (this.currencyId == 1) {
            if (this.foreignToSettleRate >= 1) {
              this.totalHkPrice = (this.buyAllPrice * this.foreignToSettleRate).toFixed(0);
            } else {
              this.totalHkPrice = (this.buyAllPrice / this.foreignToSettleRate).toFixed(0);
            }
          } else {
            this.totalHkPrice = (this.buyAllPrice * this.foreignToSettleRate).toFixed(0);
          }
        } else {
          this.totalHkPrice = undefined;
        }
      }

      this.cost = 0;
      this.cost = Number(this.totalHkPrice ? this.totalHkPrice : 0) + Number(this.logHkPrice ? this.logHkPrice : 0);
    },
    // 出售为港币
    isSellHKD() {
      if (this.sellCurrencyId == 2) {
        this.saleTotalHkPrice = this.priceTran;
      } else {
        this.saleTotalHkPrice = undefined;
      }
    },
    // 计算总成本  变量直接赋值时@input事件会触发，@change事件不会
    costCalculate() {
      this.totalHkPrice = this.getIntegerNum(this.totalHkPrice);
      this.logHkPrice = this.getIntegerNum(this.logHkPrice);
      this.cost = 0;
      this.cost = Number(this.totalHkPrice ? this.totalHkPrice : 0) + Number(this.logHkPrice ? this.logHkPrice : 0);
    },
    // 數字格式
    numCheckout() {
      this.cost = this.getIntegerNum(this.cost);
      this.pricePeer = this.getIntegerNum(this.pricePeer);
      this.priceIndi = this.getIntegerNum(this.priceIndi);
    },
    // 色号
    handleChange(value) {
      console.log("ssss");
      console.log(value);
      this.leather = value[1];
      console.log(this.leather);
    },
    // 颜色色系的判断
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
        this.getDetails();
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

    // 图片
    eightImgs(val) {
      console.log(val);
      this.imgSrc = val
    },
    thirtyImgs(val) {
      console.log(val);
      this.imgSrc2 = val
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
.update-container {
  background-color: #fff;
  border-radius: 6px;

  .upload-imgs {
    width: 100%;
    margin-bottom: 10px;
    position: relative;
    display: flex;
    flex-wrap: wrap;

    .add {
      // width: 100px;
      // height: 100px;
      position: relative;
      display: flex;

      .addIcon {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 44.5%;
        left: 44%;
        z-index: 1;
      }

      .inputUpload {
        width: 100px;
        height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        opacity: 0;
        cursor: pointer;
        z-index: 999;
      }
    }
  }

  #previewImg {
    width: 100px;
    height: 100px;
    position: relative;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .previewImg,
  .previewImg2 {
    display: flex;
  }

  .previewImg2 {
    z-index: 9999;
  }

  .spanStyle {
    width: 15px;
    height: 15px;
    position: absolute;
    top: 1px;
    right: 1px;
    text-align: center;
    line-height: 0.7;
    background-color: rgb(221, 221, 221);
    color: rgb(255, 255, 255);
    border: 1px solid rgb(221, 221, 221);
    border-radius: 50%;
    z-index: 999;
    cursor: pointer;
  }

  .imgStyle {
    width: 100px;
    height: 100px;
    margin-left: 10px;
    object-fit: cover;
    border-radius: 5px;
    z-index: 1;
  }

  .update-sure-button {
    width: 160px;
    height: 48px;
    margin-top: 30px;
    margin-left: 43%;
  }
}
</style>
