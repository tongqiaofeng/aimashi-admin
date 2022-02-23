<template>
  <div class="update-container">
    <div
      style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
      @click="goback"
    >
      <img src="../../assets/imgs/goback.png" style="height: 21px;" />
      <p style="margin: 0;">返回</p>
    </div>
    <el-form ref="globalForm" label-width="110px">
      <el-form-item label="货号" required>
        <el-form-item>
          <el-input
            style="width:50%;"
            type="text"
            placeholder="请输入货号"
            v-model="productCode"
            clearable
          ></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="库存地" required>
        <el-select
          v-model="stockLoc"
          filterable
          allow-create
          default-first-option
          placeholder="请选择"
          style="width: 50%;"
          clearable
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
      <el-form-item label="库存状态" required>
        <el-form-item>
          <el-select
            style="width: 50%;"
            v-model="sold"
            placeholder="请选择"
            @change="stateChange"
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
      <el-form-item label="预计到达时间" v-if="sold == 0">
        <el-date-picker
          type="date"
          placeholder="请选择日期时间"
          v-model="estimateTime"
          style="width:50%;"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="入库时间"
        required
        v-if="sold == 1 || sold == 2 || sold == 3"
      >
        <el-date-picker
          style="width:50%;"
          v-model="createTime"
          type="date"
          placeholder="请选择日期时间"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="取回时间" required v-if="sold == 5">
        <el-date-picker
          v-model="stockOutTime"
          type="date"
          style="width:50%;"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="退货时间" required v-if="sold == 6">
        <el-date-picker
          v-model="stockOutTime"
          type="date"
          style="width:50%;"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="时间" required v-if="sold == 7">
        <el-date-picker
          v-model="stockOutTime"
          type="date"
          style="width:50%;"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName">
      <el-tab-pane label="图片及参数" name="first">
        <div style="text-align:left;margin-bottom:10px;">
          <div style="margin-bottom:15px;">
            <span style="color: #f56c6c;">*</span
            ><span style="font-size:15px;">商品展示图：(最多上传9张图片)</span>
          </div>
          <div style="display:flex;">
            <div class="upload-imgs">
              <div class="add">
                <div id="previewImg">
                  <form
                    enctype="multipart/form-data"
                    style="width:100px;height:100px;"
                  >
                    <input
                      @change="inputChange1($event)"
                      type="file"
                      name="upload-images"
                      accept="image/*"
                      class="inputUpload"
                      multiple
                    />
                    <i class="el-icon-plus addIcon"></i>
                  </form>
                </div>
              </div>
              <div
                style="display:flex;flex-wrap:wrap;position:relative;"
                id="delImg"
              >
                <div
                  v-for="(item, index) of imgSrc"
                  :key="index"
                  style="margin-left:10px;position:relative;"
                >
                  <span class="spanStyle" @click="delImage(item, index)"
                    >x</span
                  >
                  <img
                    :src="item"
                    width="100px"
                    height="100px"
                    style="border-radius:5px;object-fit:cover;"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="text-align:left;margin-bottom:10px;">
          <div style="margin-bottom:15px;">
            <span style="font-size:15px;">内部图：(最多上传30张图片)</span>
            <span
              style="cursor: pointer;color: #9695f3;font-size:15px;"
              @click="showImgSel"
              >查看图片</span
            >
          </div>
          <div style="display:flex;" v-if="showImg">
            <div class="upload-imgs">
              <div class="add">
                <div id="previewImg">
                  <form
                    enctype="multipart/form-data"
                    style="width:100px;height:100px;"
                  >
                    <input
                      @change="inputChange2($event)"
                      type="file"
                      name="upload-images"
                      accept="image/*"
                      class="inputUpload"
                      multiple
                    />
                    <i class="el-icon-plus addIcon"></i>
                  </form>
                </div>
              </div>
              <div
                style="display:flex;flex-wrap: wrap;position:relative;"
                id="delImg2"
              >
                <div
                  v-for="(item, index) of imgSrc2"
                  :key="index"
                  style="margin-left:10px;position:relative;"
                >
                  <span class="spanStyle" @click="delImage2(item, index)"
                    >x</span
                  >
                  <img
                    :src="item"
                    width="100px"
                    height="100px"
                    style="border-radius:5px;object-fit:cover;"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-form ref="form" label-width="80px">
          <el-form-item label="款式" required>
            <el-select
              v-model="model"
              placeholder="请选择"
              value-key="name"
              style="width: 50%;"
              clearable
              @change="sizeSel"
            >
              <el-option
                v-for="item in modelSize"
                :key="item.id"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="大小" :required="isRequire == 0 ? true : false">
            <el-select
              v-model="size"
              filterable
              allow-create
              default-first-option
              placeholder="请选择"
              clearable
              style="width:50%;"
            >
              <el-option
                v-for="items in sizes"
                :key="items"
                :label="items"
                :value="items"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="材质" :required="isRequire == 0 ? true : false">
            <el-cascader
              v-model="leather"
              :options="leathers"
              @change="handleChange"
              style="width:50%;"
              v-if="isInput == 0"
            >
            </el-cascader>
            <el-input
              v-if="isInput == 1"
              v-model="leather"
              style="width: 50%;"
              placeholder="请输入"
            ></el-input>
            <el-button style="border: 0;" type="text" @click="isInputSel">{{
              isInput == 0 ? "输入" : "选择"
            }}</el-button>
          </el-form-item>
          <el-form-item
            label="金属质感"
            :required="isRequire == 0 ? true : false"
          >
            <el-select
              v-model="metal"
              placeholder="请选择"
              style="width: 50%;"
              clearable
              v-if="isSelect == 0"
            >
              <el-option
                v-for="item in metals"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-if="isSelect == 1"
              v-model="metal"
              style="width: 50%;"
              placeholder="请输入"
            ></el-input>
            <el-button type="text" @click="isSelectSel">{{
              isSelect == 0 ? "输入" : "选择"
            }}</el-button>
          </el-form-item>
          <el-form-item label="色号">
            <el-input
              style="width:50%;"
              placeholder="请输入色号"
              v-model="colorId"
              @input="colorIdBlur"
              clearable
            >
            </el-input>
            <el-button style="border: 0;" type="text" @click="isColorSel">{{
              isColor == 0 ? "无色号" : "有色号"
            }}</el-button>
          </el-form-item>
          <el-form-item label="颜色" :required="isRequire == 0 ? true : false">
            <el-input
              style="width:50%;"
              v-model="color"
              clearable
              :disabled="isColor == 0 ? true : false"
            ></el-input>
          </el-form-item>
          <el-form-item label="色系">
            <el-input
              style="width:50%;"
              v-model="colorSeries"
              clearable
              :disabled="isColor == 0 ? true : false"
            ></el-input>
          </el-form-item>
          <el-form-item label="刻度">
            <el-input
              style="width:50%;"
              placeholder="请输入刻度"
              v-model="letter"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" :required="isRequire == 0 ? true : false">
            <el-checkbox-group v-model="stock" style="width:50%;">
              <el-checkbox
                v-for="stock in stockStats"
                :label="stock"
                :key="stock"
                >{{ stock }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="采购及价格" name="second">
        <el-form label-width="100px">
          <el-form-item label="买手">
            <el-input
              style="width:50%;"
              placeholder="请输入买手"
              v-model="source"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="采购外币金额">
            <div style="width: 50%;display: flex;">
              <el-input-number
                style="flex: 1;"
                type="text"
                placeholder="请输入采购外币金额"
                v-model="buyAllPrice"
                clearable
                :controls="false"
                @change="isPurchaseHKD"
              ></el-input-number>
              <el-select
                v-model="currencyId"
                placeholder="请选择采购价币种"
                clearable
                @change="isPurchaseHKD"
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
          <el-form-item label="是否付款完成">
            <el-switch v-model="isPayCheck"></el-switch>
          </el-form-item>
          <el-form-item label="入库价(HKD)">
            <el-input-number
              style="width:50%;"
              type="text"
              placeholder="请输入入库价"
              v-model="totalHkPrice"
              clearable
              :controls="false"
              @change="costCalculate"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="物流费(HKD)">
            <el-input-number
              style="width:50%;"
              type="text"
              placeholder="请输入物流金额"
              v-model="logHkPrice"
              clearable
              :controls="false"
              @change="costCalculate"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="总成本(HKD)">
            <el-input-number
              style="width:50%;"
              type="text"
              placeholder="请输入总成本"
              v-model="cost"
              clearable
              :controls="false"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="同行价(HKD)">
            <el-input-number
              :controls="false"
              style="width:50%;"
              placeholder="请输入同行价"
              v-model="pricePeer"
              clearable
            ></el-input-number>
          </el-form-item>
          <el-form-item label="散客价(HKD)">
            <el-input-number
              :controls="false"
              style="width:50%;"
              placeholder="请输入散客价"
              v-model="priceIndi"
              clearable
            ></el-input-number>
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
              <el-table-column
                width="250px"
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
                width="250px"
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
      </el-tab-pane>
      <el-tab-pane label="销售信息" name="third" v-if="sold == 2 || sold == 3">
        <el-form ref="saleForm" label-width="110px">
          <el-form-item
            label="账单号"
            :required="isStock == 0 ? false : true"
            v-if="sold == 3"
          >
            <el-input v-model="bill" style="width: 50%;"></el-input>
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
              style="width:50%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="出售外币金额">
            <div style="width: 50%;display: flex;">
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
            <div style="width: 50%;display: flex;">
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
            <div style="width: 50%;display: flex;">
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
          >
            <el-autocomplete
              style="width: 50%;"
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
              style="width:50%;"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            ></el-date-picker>
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
              <el-table-column
                width="250px"
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
                width="250px"
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
      </el-tab-pane>
      <el-tab-pane label="资金流" name="fifth" v-if="allPaymentList.length > 0">
        <el-table
          :data="allPaymentList"
          style="width: 100%;margin-bottom: 22px;"
        >
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
          <el-table-column
            width="250px"
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
                  scope.row.totalToHkRate == "" || scope.row.totalToHkRate == 0
                    ? "/"
                    : scope.row.totalToHkRate
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="totalHkPrice" label="港幣金額">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.totalHkPrice == "" || scope.row.totalHkPrice == 0
                    ? "/"
                    : formatNumberRgx(scope.row.totalHkPrice) + " HKD"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="receiveType" label="交易方式">
          </el-table-column>
          <el-table-column
            width="250px"
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
      </el-tab-pane>
      <el-tab-pane label="备注信息" name="fourth">
        <el-form ref="noteForm">
          <el-form-item label="备注">
            <el-input
              type="textarea"
              placeholder="请输入备注信息"
              style="width:50%;"
              v-model="note"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-button
      @click="basicInfoUpdateSure"
      class="update-sure-button"
      style="background:#9695f3;color:#fff;"
      >确 定
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      modelSize: [],
      updateId: this.updatesId,

      imgSrc: [],
      imgSrc2: [],
      imgurls: [],
      imgurls2: [],

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
      priceIndi: "", //散客价
      source: "", //买手
      stockLoc: "", //库存地
      model: {}, //款式
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
      sizes: [],
      leathers: [],
      clrs: [],
      metals: [],

      stockStats: [],
      colorList: [],
      imgs: "",
      delList: [],
      delList2: [],
      b: "",
      c: "",
      e: "",
      d: "",
      showImg: false,

      stockOutTime: null,
      stockLocList: [],
      stockLoc: "",
      isInput: 1,
      isSelect: 1,
      isColor: 0,
      loading: null,
      pageSel: 0,
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

      bill: "",
      isRequire: 0,
      dialogWarehouseLocUpdateVisible: false,
      locUpdateId: null,

      activeName: "first",
      saleLogHkPrice: "",
      saleTotalHkPrice: "",

      buyAllPrice: undefined,
      totalHkPrice: undefined,
      logHkPrice: undefined,

      customerList: [],
      buyPaymentList: [],
      sellPaymentList: [],
      allPaymentList: []
    };
  },
  props: ["updatesId"],
  created() {
    this.getData();
    this.getCustomerList();
  },
  methods: {
    // 获取产品信息
    getDetails() {
      this.showImg = false;
      this.$store.state.imgUrl = "";
      this.$store.state.imgUrl2 = "";
      this.isInput = 1;
      this.isSelect = 1;
      this.$axios
        .get(this.baseUrl + "/detail?id=" + this.updateId)
        .then(res => {
          console.log("产品详情");
          console.log(res);
          let data = res.data;

          this.$store.state.imgUrl = data.pics;
          this.$store.state.imgUrl2 = data.privateImg;

          let p = data.pics.split("|");
          this.imgSrc = [];
          this.imgSrc2 = [];
          for (let i = 0; i < p.length - 1; i++) {
            this.imgSrc.push(p[i]);
          }

          if (data.privateImg !== "" && data.privateImg !== null) {
            let q = data.privateImg.split("|");
            for (let i = 0; i < q.length - 1; i++) {
              this.imgSrc2.push(q[i]);
            }
          }

          this.productCode = data.productCode;
          this.createAccount = data.createAccount;
          this.currencyId = data.currencyId;
          this.cost = data.cost == 0 ? "" : data.cost;
          this.pricePeer = data.pricePeer == 0 ? "" : data.pricePeer;
          this.priceIndi = data.priceIndi == 0 ? "" : data.priceIndi;
          this.source = data.source;
          this.stockLoc = data.stockLoc;

          if (data.modelId > 100) {
            this.isRequire = 1;
          } else {
            this.isRequire = 0;
          }

          this.model = {
            name: data.model
          };

          this.size = data.size;
          for (let i = 0; i < this.modelSize.length; i++) {
            if (this.model.name == this.modelSize[i].name) {
              this.sizes = this.modelSize[i].size;
            }
          }
          this.leather = data.leather;
          this.metal = data.metal;
          this.colorId = data.colorId;
          this.color = data.color;
          this.colorSeries = data.colorSeries;
          this.letter = data.letter;
          this.stockStat = data.stockStat;
          this.stock = data.stockStat.split("|");
          this.note = data.note;
          this.logHkPrice = data.logHkPrice;

          this.buyAllPrice = data.buyAllPrice;
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

          if (data.sold == 3) {
            this.isStock = 0;
          } else if (data.sold == 4) {
            this.isStock = 1;
          }

          this.activeName = "first";
          this.pageSel = 1;
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
      // console.log(this.sold);
      if (this.sold == 1 || this.sold == 2 || this.sold == 3) {
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
          console.log("-");
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
    data1() {
      this.stockStat = "";
      console.log(this.stock);
      for (let item of this.stock) {
        if (item !== "") {
          this.stockStat += item + "|";
        }
      }

      if (
        this.$store.state.imgUrl == "" ||
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
      if (this.data1() !== 1 && this.dataCheck() !== 1) {
        console.log(this.productCode);
        this.updateData();
      }
    },
    updateData() {
      let name;
      if (this.metal == "") {
        if (this.isRequire == 1) {
          name =
            this.model.name +
            " " +
            this.size +
            " " +
            this.colorId +
            " " +
            this.color +
            " " +
            this.leather;
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
      } else {
        if (this.isRequire == 1) {
          name =
            this.model.name +
            " " +
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

      this.$axios
        .put(this.baseUrl + "/update", {
          id: this.updateId,
          pics: this.$store.state.imgUrl,
          privateImg: this.$store.state.imgUrl2,
          productCode: this.productCode,
          createAccount: this.createAccount,
          currencyId: this.currencyId,
          cost: this.cost,
          pricePeer: this.pricePeer,
          priceIndi: this.priceIndi,
          source: this.source,
          stockLoc: this.stockLoc,
          model: this.model.name,
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
          isPayCheck: this.isPayCheck == false ? 0 : 1,
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
      // this.estimateTime = "";
      // this.createTime = "";
      // this.stockOutTime = "";
      // this.bill = "";
      // this.isPayCheck = false;
      // this.isReceiveCheck = false;
      // if (this.sold != 2 && this.sold != 3) {
      //   this.priceTran = "";
      //   this.customer = "";
      //   this.soldTime = "";
      //   this.sellCurrencyId = "";
      //   this.saleLogHkPrice = "";
      //   this.saleTotalHkPrice = "";
      // } else {
      //   this.soldTime = "";
      //   this.isStock = 0;
      // }
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

      this.size = "";
      for (let i = 0; i < this.modelSize.length; i++) {
        if (this.model.name == this.modelSize[i].name) {
          this.sizes = this.modelSize[i].size;
        }
      }
    },
    // 采购为港币
    isPurchaseHKD() {
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
    // 计算总成本  变量直接赋值时@input事件会触发，@change事件不会
    costCalculate() {
      console.log("是否来了");
      this.cost = this.totalHkPrice + this.logHkPrice;
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
      this.b = "";
      this.c = "";
      this.e = "";
      this.d = "";
      this.color = "";
      this.colorSeries = "";
      for (let i in this.clrs) {
        for (let j in this.clrs[i].yanse) {
          if (this.colorId.match(/[a-z]/g) !== null) {
            this.colorId = this.colorId.toUpperCase();
            if (this.colorId.indexOf("/") !== -1) {
              this.colorList = this.colorId.split("/");
              if (this.colorList[0] == this.clrs[i].yanse[j].sehao) {
                this.e = this.clrs[i].yanse[j].name;
                this.b = this.clrs[i].sexi;
              }
              if (this.colorList[1] == this.clrs[i].yanse[j].sehao) {
                this.d = this.clrs[i].yanse[j].name;
                this.c = this.clrs[i].sexi;
              }
              this.color = this.e + "拼" + this.d;
              this.colorSeries = this.b + "/" + this.c;
            } else {
              if (this.colorId == this.clrs[i].yanse[j].sehao) {
                this.color = this.clrs[i].yanse[j].name;
                this.colorSeries = this.clrs[i].sexi;
              }
            }
          } else {
            if (this.colorId.indexOf("/") !== -1) {
              this.colorList = this.colorId.split("/");
              if (this.colorList[0] == this.clrs[i].yanse[j].sehao) {
                this.e = this.clrs[i].yanse[j].name;
                this.b = this.clrs[i].sexi;
              }
              if (this.colorList[1] == this.clrs[i].yanse[j].sehao) {
                this.d = this.clrs[i].yanse[j].name;
                this.c = this.clrs[i].sexi;
              }
              this.color = this.e + "拼" + this.d;
              this.colorSeries = this.b + "/" + this.c;
            } else {
              if (this.colorId == this.clrs[i].yanse[j].sehao) {
                this.color = this.clrs[i].yanse[j].name;
                this.colorSeries = this.clrs[i].sexi;
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

    // 删除图片
    delImage(item, index) {
      this.$store.state.imgUrl = "";
      console.log("-----" + item);
      console.log(index);
      let delImg = document.getElementById("delImg");
      let child = delImg.children;
      console.log(child);
      for (let i = 0; i < child.length; i++) {
        this.delList.push(child[i]);
      }
      console.log(this.delList);
      this.delList.splice(index, 1);
      this.imgSrc.splice(index, 1);
      console.log(this.imgSrc);
      let b = item + "|";
      console.log(b);
      for (let src of this.imgSrc) {
        this.$store.state.imgUrl += src + "|";
      }
      console.log(this.$store.state.imgUrl);
    },
    // 上传图片
    inputChange1(e) {
      let file = e.target.files;
      let that = this;
      let check = file[0];
      console.log(check);
      if (check == undefined) {
        return;
      } else {
        if (file.length > 9) {
          this.$message.error({
            message: "最多上传9张图片，请重新选择",
            showClose: true,
            duration: 2000
          });
        } else {
          this.loading = this.$loading({
            lock: true,
            text: "图片上传中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          for (let item of file) {
            if (item.size / 1024 > 2050) {
              // 文件大于2M，进行压缩上传
              this.photoCompress(
                item,
                {
                  // 调用压缩图片方法
                  quality: 0.7
                },
                function(base64Codes) {
                  // console.log("压缩后：" + base.length / 1024 + " " + base);
                  let bl = that.base64UrlToBlob(base64Codes);
                  // file.append('file', bl, 'file_' + Date.parse(new Date()) + '.jpg') // 文件对象
                  that.uploadLice(bl); // 请求图片上传接口
                }
              );
            } else {
              // 小于等于2M 原图上传
              this.uploadLice(item);
            }
          }
        }
      }
    },
    // base64 转 Blob 格式 和file格式
    base64UrlToBlob(urlData) {
      let arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
        bstr = atob(arr[1]), // 处理异常,将ascii码小于0的转换为大于0
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // 转blob
      // return new Blob([u8arr], {type: mime})
      let filename = Date.parse(new Date()) + ".jpg";
      // 转file
      return new File([u8arr], filename, {
        type: mime
      });
    },
    photoCompress(file, obj, callback) {
      let that = this;
      let ready = new FileReader();
      /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
      ready.readAsDataURL(file);
      ready.onload = function() {
        let re = this.result;
        that.canvasDataURL(re, obj, callback); // 开始压缩
      };
    },
    canvasDataURL(path, obj, callback) {
      let img = new Image();
      img.src = path;
      img.onload = function() {
        let that = this; // 指到img
        // 默认按比例压缩
        let w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        let quality = 0.7; // 默认图片质量为0.7
        // 生成canvas
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        // 创建属性节点
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        // 铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(that, 0, 0, w, h);

        // 图像质量
        if (obj.quality && obj.quality >= 1 && obj.quality < 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        let base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    //  返回file文件，调用接口执行上传
    uploadLice(file) {
      console.log(file);
      let formdata1 = new FormData(); //创建form对象
      formdata1.append("upload-images", file); //通过append向form对象添加数据
      this.uploadImg(formdata1);
    },
    uploadImg(formdata1) {
      if (this.imgSrc.length > 8) {
        this.$message.error({
          message: "最多上传9张图片",
          showClose: true,
          duration: 2000
        });
        this.loading.close();
      } else {
        this.$axios
          .post(this.baseUrl + "/upload", formdata1)
          .then(res => {
            if (res.status == 200) {
              this.$message.success({
                message: "图片上传成功",
                showClose: true,
                duration: 2000
              });
            }
            console.log(res);
            this.imgurls = res.data.split("|");
            console.log(this.imgurls);
            let preview1 = document.getElementById("preview1");
            console.log(this.$store.state.imgUrl);
            for (let i = 0; i < this.imgurls.length - 1; i++) {
              console.log(this.baseUrl + "/file/" + this.imgurls[i]);
              this.$store.state.imgUrl +=
                this.baseUrl + "/file/" + this.imgurls[i] + " | ";
              let a = this.baseUrl + "/file/" + this.imgurls[i];
              this.imgSrc.push(a);
              console.log(this.$store.state.imgUrl);
            }
            this.loading.close();
          })
          .catch(err => {
            this.loading.close();
            console.log(err);
            this.$message.error({
              message: err.data.status,
              showClose: true,
              duration: 2000
            });
          });
      }
    },
    // 删除内部图片
    delImage2(item, index) {
      this.$store.state.imgUrl2 = "";
      console.log("-----" + item);
      console.log(index);
      let delImg = document.getElementById("delImg2");
      let child = delImg.children;
      console.log(child);
      for (let i = 0; i < child.length; i++) {
        this.delList2.push(child[i]);
      }
      console.log(this.delList2);
      this.delList2.splice(index, 1);
      this.imgSrc2.splice(index, 1);
      console.log(this.imgSrc2);
      let b = item + "|";
      console.log(b);
      for (let src of this.imgSrc2) {
        this.$store.state.imgUrl2 += src + "|";
      }
      console.log(this.$store.state.imgUrl2);
    },
    // 上传图片
    inputChange2(e) {
      let file = e.target.files;
      let that = this;
      let check = file[0];
      console.log(check);
      if (check == undefined) {
        return;
      } else {
        if (file.length > 30) {
          this.$message.error({
            message: "最多上传30张图片，请重新选择",
            showClose: true,
            duration: 2000
          });
        } else {
          this.loading = this.$loading({
            lock: true,
            text: "图片上传中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          for (let item of file) {
            if (item.size / 1024 > 2050) {
              // 文件大于2M，进行压缩上传
              this.photoCompress2(
                item,
                {
                  // 调用压缩图片方法
                  quality: 0.7
                },
                function(base64Codes) {
                  // console.log("压缩后：" + base.length / 1024 + " " + base);
                  let bl = that.base64UrlToBlob2(base64Codes);
                  // file.append('file', bl, 'file_' + Date.parse(new Date()) + '.jpg') // 文件对象
                  that.uploadLice2(bl); // 请求图片上传接口
                }
              );
            } else {
              // 小于等于2M 原图上传
              this.uploadLice2(item);
            }
          }
        }
      }
    },
    // base64 转 Blob 格式 和file格式
    base64UrlToBlob2(urlData) {
      let arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
        bstr = atob(arr[1]), // 处理异常,将ascii码小于0的转换为大于0
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // 转blob
      // return new Blob([u8arr], {type: mime})
      let filename = Date.parse(new Date()) + ".jpg";
      // 转file
      return new File([u8arr], filename, {
        type: mime
      });
    },
    photoCompress2(file, obj, callback) {
      let that = this;
      let ready = new FileReader();
      /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
      ready.readAsDataURL(file);
      ready.onload = function() {
        let re = this.result;
        that.canvasDataURL2(re, obj, callback); // 开始压缩
      };
    },
    canvasDataURL2(path, obj, callback) {
      let img = new Image();
      img.src = path;
      img.onload = function() {
        let that = this; // 指到img
        // 默认按比例压缩
        let w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        let quality = 0.7; // 默认图片质量为0.7
        // 生成canvas
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        // 创建属性节点
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        // 铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(that, 0, 0, w, h);

        // 图像质量
        if (obj.quality && obj.quality >= 1 && obj.quality < 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        let base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    //  返回file文件，调用接口执行上传
    uploadLice2(file) {
      console.log(file);
      let formdata1 = new FormData(); //创建form对象
      formdata1.append("upload-images", file); //通过append向form对象添加数据
      this.uploadImg2(formdata1);
    },
    uploadImg2(formdata1) {
      console.log(formdata1);
      formdata1.append("state", 0);
      formdata1.append("type", 0);
      console.log("11111");
      if (this.imgSrc2.length > 29) {
        this.$message.error({
          message: "最多上传30张图片",
          showClose: true,
          duration: 2000
        });
        this.loading.close();
      } else {
        this.$axios
          .post(this.baseUrl + "/upload", formdata1)
          .then(res => {
            if (res.status == 200) {
              this.$message.success({
                message: "图片上传成功",
                showClose: true,
                duration: 2000
              });
            }
            console.log(res);
            this.imgurls2 = res.data.split("|");
            console.log(this.imgurls2);
            let preview1 = document.getElementById("preview1");
            console.log(this.$store.state.imgUrl2);
            for (let i = 0; i < this.imgurls2.length - 1; i++) {
              console.log(this.baseUrl + "/file/" + this.imgurls2[i]);
              this.$store.state.imgUrl2 +=
                this.baseUrl + "/file/" + this.imgurls2[i] + " | ";
              let a = this.baseUrl + "/file/" + this.imgurls2[i];
              this.imgSrc2.push(a);
              console.log(this.$store.state.imgUrl2);
            }
            this.loading.close();
          })
          .catch(err => {
            this.loading.close();
            console.log(err);
            this.$message.error({
              message: err.data.status,
              showClose: true,
              duration: 2000
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.update-container {
  margin: 40px;

  .upload-imgs {
    width: 100%;
    margin-bottom: 10px;
    position: relative;
    display: flex;

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
    margin-left: 40%;
  }
}
</style>
