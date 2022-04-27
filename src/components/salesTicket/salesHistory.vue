<template>
  <div style="margin-top: -20px;overflow: hidden;" id="salesHistoryContainer">
    <div class="new-consignment-container">
      <!-- 銷售歷史 -->
      <div v-show="pageSel === 0">
        <div class="back-style">
          <el-form inline>
            <el-form-item label="庫存狀態">
              <el-select v-model="sellSold">
                <el-option
                  v-for="item in stateList2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出售時間">
              <el-date-picker
                v-model="sellTime"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input
                style="width: 450px;"
                v-model="sellKeyword"
                placeholder="可輸入賬單號、商品貨號、客戶名稱搜索"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchSell">查詢</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          style="width: 100%;padding: 20px 0;margin-top: 20px;text-align: center;background-color: #fff;border-radius: 6px;"
          v-if="sellOrderList.length == 0"
        >
          暫無數據
        </div>
        <div v-else style="margin-top: 20px;">
          <div
            v-for="(item, index) in sellOrderList"
            :key="index"
            style="padding: 20px;margin-bottom: 20px;background-color: #fff;border-radius: 6px;"
          >
            <div>
              <div class="bill-container">
                <div style="font-size: 16px;color: #000;">
                  賬單號：<span>{{ item.bill }}</span>
                </div>
                <div class="print">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="updateSellOrder(item)"
                    >修改</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="printSalesCredentials(item.bill)"
                    >銷售憑證</el-button
                  >
                  <el-button
                    type="danger"
                    size="mini"
                    @click="cancelSales(item)"
                    >撤銷</el-button
                  >
                  <el-dialog
                    title="撤銷"
                    :visible.sync="dialogDeleteBillVisible"
                  >
                    <div style="text-align:center;font-size: 16px;">
                      確定刪除該銷售單？刪除後不可恢復
                    </div>
                    <div slot="footer">
                      <el-button @click="dialogDeleteBillVisible = false"
                        >取 消</el-button
                      >
                      <el-button type="primary" @click="cancelSureSales"
                        >确 定</el-button
                      >
                    </div>
                  </el-dialog>
                </div>
              </div>
              <el-table
                border
                stripe
                :data="item.stockList"
                style="width: 100%"
              >
                <el-table-column
                  width="80px"
                  align="center"
                  prop="productCode"
                  label="貨號"
                >
                </el-table-column>
                <el-table-column
                  width="120px"
                  align="center"
                  prop="pic"
                  label="圖片"
                >
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
                <el-table-column
                  align="center"
                  prop="priceTran"
                  label="出售外幣金額"
                >
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.priceTran
                          ? formatNumberRgx(scope.row.priceTran) +
                            " " +
                            currencyRgx(scope.row.sellCurrencyId)
                          : "--"
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="saleLogHkPrice"
                  :label="'物流費/手續費(' + currencyGlobal + ')'"
                >
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.saleLogHkPrice
                          ? formatNumberRgx(scope.row.saleLogHkPrice) +
                            " " +
                            currencyGlobal
                          : "--"
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="saleTotalHkPrice"
                  :label="'出售' + currencyFontRgx(currencyGlobal) + '金額'"
                >
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.saleTotalHkPrice
                          ? formatNumberRgx(scope.row.saleTotalHkPrice) +
                            " " +
                            currencyGlobal
                          : "--"
                      }}
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
                      <el-tooltip placement="bottom" effect="light">
                        <div class="tooltipWarp" slot="content">
                          {{ scope.row.note }}
                        </div>
                        <div class="font-warp">{{ scope.row.note }}</div>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  width="120px"
                  align="center"
                  prop="note"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <div>
                      <el-button type="text" @click="salesReturn(scope.row)"
                        >退貨</el-button
                      >
                      <el-button type="text" @click="editProduct(scope.row)"
                        >詳情</el-button
                      >
                      <el-dialog
                        title="退貨"
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
                            <el-form-item label="庫存狀態" required>
                              <el-select
                                v-model="updateSellMsg.sold"
                                placeholder="請選擇"
                                style="width:100%;"
                              >
                                <el-option
                                  v-for="item in stateUpdateList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                >
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="入庫時間" required>
                              <el-form-item>
                                <el-date-picker
                                  type="date"
                                  placeholder="請選擇日期時間"
                                  v-model="updateSellMsg.createTime"
                                  style="width:100%;"
                                  value-format="yyyy-MM-dd"
                                  format="yyyy-MM-dd"
                                >
                                </el-date-picker>
                              </el-form-item>
                            </el-form-item>
                            <el-form-item label="備註">
                              <el-input
                                type="textarea"
                                style="width:100%;"
                                v-model="updateSellMsg.note"
                              ></el-input>
                            </el-form-item>
                          </el-form>
                        </div>
                        <div slot="footer">
                          <el-button @click="dialogStateVisible = false"
                            >取 消</el-button
                          >
                          <el-button type="primary" @click="salesReturnSure"
                            >确 定
                          </el-button>
                        </div>
                      </el-dialog>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div style="margin-top:15px;text-align: right;">
            <el-pagination
              @current-change="handleCurrentChangeSell"
              :current-page="sellPage"
              :page-size="5"
              layout="total, prev, pager, next, jumper"
              :total="sellOrderTotal"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div v-if="pageSel == 1">
        <details-vue
          :updatesId="updateId"
          @goback="gobackAdd"
          @updateSuccess="updateSuccess"
        ></details-vue>
      </div>
      <div v-show="pageSel === 2" class="back-style">
        <div
          style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="gobackAdd"
        >
          <img src="../../assets/imgs/goback.png" style="height: 21px;" />
          <p style="margin: 0;">返回</p>
        </div>
        <div>
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
            <el-form-item label="客戶姓名" prop="customer">
              <el-autocomplete
                style="width: 300px;"
                v-model="addDataConsign.customer"
                :fetch-suggestions="querySearch"
                placeholder="請選擇/輸入客戶姓名"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item prop="soldTime" label="出售日期">
              <el-date-picker
                style="width: 300px;"
                v-model="addDataConsign.soldTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="請選擇"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="出庫時間"
              prop="stockOutTime"
              v-show="addDataConsign.sold == 4"
            >
              <el-date-picker
                style="width: 300px;"
                v-model="addDataConsign.stockOutTime"
                type="date"
                placeholder="請選擇日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
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
                width="120px"
                align="center"
                prop="pic"
                label="圖片"
              >
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
              <el-table-column
                align="center"
                prop="priceTran"
                label="出售外幣金額
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
                :label="'物流費/手續費(' + currencyGlobal + ')'"
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
                    <span>出售{{ currencyFontRgx(currencyGlobal) }}金額</span>
                    <span v-show="addDataConsign.sold == 4" style="color: red;"
                      >*</span
                    >
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
      </div>
      <div v-if="pageSel == 4" class="back-style">
        <div style="display: flex;justify-content:space-between;">
          <div
            style="width: 60px;display: flex;justify-content:space-between;cursor: pointer;"
            @click="goback"
          >
            <img src="../../assets/imgs/goback.png" style="height: 21px;" />
            <p style="margin: 0;">返回</p>
          </div>
          <div>
            <el-button type="primary" v-preventClick @click="downloadExcel"
              >下載憑證</el-button
            >
            <!-- '#printArea'   printData-->
            <el-button type="primary" v-print="printData">打印憑證</el-button>
            <el-dialog
              title="選擇下載格式"
              :visible.sync="dialogDownloadVisible"
            >
              <div id="selectType">
                <el-form label-width="20px">
                  <el-form-item label="">
                    <el-radio-group
                      v-model="downloadType"
                      @change="downloadSureExcel"
                    >
                      <el-radio :label="0">
                        <img
                          src="../../assets/imgs/certificate/excel.png"
                          style="width: 80px;height: 80px;object-fit: cover;"
                        />
                      </el-radio>
                      <el-radio :label="1">
                        <img
                          src="../../assets/imgs/certificate/pdf.png"
                          style="width: 80px;height: 80px;object-fit: cover;"
                        />
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </div>
            </el-dialog>
          </div>
        </div>
        <div
          style="margin: 30px;padding-bottom: 50px;"
          ref="reconciliationWrapper"
          id="printArea"
        >
          <div>
            <img src="../../assets/imgs/certificate/title.png" />
          </div>
          <div style="width: 395px;">
            <input
              type="text"
              v-model="certificateData.electronicBill.companyName"
              placeholder="請輸入公司名稱"
            />
          </div>
          <div style="width: 395px;">
            <input
              type="text"
              v-model="certificateData.electronicBill.companyAddr"
              placeholder="請輸入公司地址"
            />
          </div>
          <div
            style="margin-top: 20px;
                  text-align: center;
                  font-size: 24px;
                  font-weight: bold;"
          >
            Invoice
          </div>
          <div
            style="margin-top: 20px;
                  text-align: left;
                  font-size: 16px;
                  font-weight: bold;"
          >
            To：{{ certificateData.customer }}
          </div>
          <div style="text-align: right;">
            <div style="display: flex;justify-content: flex-end;">
              <div
                style="width: 150px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                    text-align: right;
                    font-size: 15px;"
              >
                Invoice No.:
              </div>
              <div
                style="width: 100px;
                    text-align: left;
                    font-size: 15px;"
              >
                {{ certificateData.bill }}
              </div>
            </div>
            <div style="display: flex;justify-content: flex-end;">
              <div
                style="width: 150px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                    text-align: right;
                    font-size: 15px;"
              >
                Invoice Date:
              </div>
              <div
                style="width: 100px;
                    text-align: left;
                    font-size: 15px;"
              >
                {{ certificateData.soldTime }}
              </div>
            </div>
            <div
              style="display: flex;justify-content: flex-end;align-items: center;"
            >
              <div
                style="width: 150px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                    text-align: right;
                    font-size: 15px;"
              >
                Payment Terms:
              </div>
              <div
                style="width: 100px;
                    text-align: left;
                    font-size: 15px;"
              >
                <input
                  type="text"
                  v-model="certificateData.electronicBill.paymentTerms"
                />
              </div>
            </div>
            <div style="display: flex;justify-content: flex-end;">
              <div
                style="width: 150px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                    text-align: right;
                    font-size: 15px;"
              >
                Currency:
              </div>
              <div
                style="width: 100px;
                    text-align: left;
                    font-size: 15px;"
              >
                {{ certificateData.currency }}
              </div>
            </div>
          </div>
          <table
            style="width: 100%;margin: 20px 0;border-spacing: 0;border-collapse: collapse;"
            border
          >
            <tr style="width: 100%;">
              <th
                style="width: 10%;padding: 10px;text-align: center;background-color: #ccc;color: #fff;"
              >
                Brand
              </th>
              <th
                style="width: 10%;padding: 10px;text-align: center;background-color: #ccc;color: #fff;"
              >
                Images
              </th>
              <th
                style="width: 10%;padding: 10px;text-align: center;background-color: #ccc;color: #fff;"
              >
                Product No.
              </th>
              <th
                style="width: 10%;padding: 10px;text-align: center;background-color: #ccc;color: #fff;"
              >
                Model
              </th>
              <th
                style="width: 10%;padding: 10px;text-align: center;background-color: #ccc;color: #fff;"
              >
                Size
              </th>
              <th
                style="width: 10%;padding: 10px;text-align: center;background-color: #ccc;color: #fff;"
              >
                Color
              </th>
              <th
                style="width: 10%;padding: 10px;text-align: center;background-color: #ccc;color: #fff;"
              >
                Leather
              </th>
              <th
                style="width: 10%;padding: 10px;text-align: center;background-color: #ccc;color: #fff;"
              >
                Qty
              </th>
              <th
                style="width: 10%;padding: 10px;text-align: center;background-color: #ccc;color: #fff;"
              >
                AMOUNT
              </th>
            </tr>
            <tr
              style="width: 100%;"
              v-for="item in certificateData.stockDetailList"
              :key="item.id"
            >
              <td
                style="width: 10%;padding: 10px;text-align: center;font-size: 14px;"
              >
                Hermes
              </td>
              <td style="width: 10%;padding: 10px;text-align: center;">
                <img
                  style="width: 100px; height: 100px"
                  :src="item.pics.split('|')[0]"
                />
              </td>
              <td
                style="width: 10%;padding: 10px;text-align: center;font-size: 14px;"
              >
                {{ item.productCode }}
              </td>
              <td
                style="width: 10%;padding: 10px;text-align: center;font-size: 14px;"
              >
                {{ item.model }}
              </td>
              <td
                style="width: 10%;padding: 10px;text-align: center;font-size: 14px;"
              >
                {{ item.size }}
              </td>
              <td
                style="width: 10%;padding: 10px;text-align: center;font-size: 14px;"
              >
                {{ item.color }}
              </td>
              <td
                style="width: 10%;padding: 10px;text-align: center;font-size: 14px;"
              >
                {{ item.leather }}
              </td>
              <td
                style="width: 10%;padding: 10px;text-align: center;font-size: 14px;"
              >
                1
              </td>
              <td
                style="width: 10%;padding: 10px;text-align: center;font-size: 14px;"
              >
                {{ formatNumberRgx(item.priceTran) }}
              </td>
            </tr>
          </table>

          <div style="text-align: right;">
            <div style="display: flex;justify-content: flex-end;">
              <div
                style="width: 150px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                    text-align: right;
                    font-size: 15px;"
              >
                Subtotal:
              </div>
              <div
                style="width: 100px;
                    text-align: left;
                    font-size: 15px;"
              >
                {{ formatNumberRgx(certificateData.subtotal) }}
              </div>
            </div>
            <div style="display: flex;justify-content: flex-end;">
              <div
                style="width: 150px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                    text-align: right;
                    font-size: 15px;"
              >
                Shipping Cost:
              </div>
              <div
                style="width: 100px;
                    text-align: left;
                    font-size: 15px;"
              >
                {{ formatNumberRgx(certificateData.shippingCost) }}
              </div>
            </div>
            <div style="display: flex;justify-content: flex-end;">
              <div
                style="width: 150px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                    text-align: right;
                    font-size: 15px;"
              >
                Total in {{ currencyGlobal }}:
              </div>
              <div
                style="width: 100px;
                    text-align: left;
                    font-size: 15px;"
              >
                {{ formatNumberRgx(certificateData.totalInHkd) }}
              </div>
            </div>
          </div>
          <div
            style="margin-top: 30px;display: flex;justify-content: space-between;align-items: center;"
          >
            <el-form label-width="235px">
              <el-form-item>
                <span slot="label">
                  <span style="font-size: 14px;color: #000;"
                    >Bank account name (收款人):</span
                  >
                </span>
                <input
                  style="width: 460px;"
                  type="text"
                  v-model="certificateData.electronicBill.bankAccountName"
                />
              </el-form-item>
              <el-form-item>
                <span slot="label">
                  <span style="font-size: 14px;color: #000;"
                    >Bank Name (銀行名稱):</span
                  >
                </span>
                <input
                  type="text"
                  v-model="certificateData.electronicBill.bankName"
                />
              </el-form-item>
              <el-form-item>
                <span slot="label">
                  <span style="font-size: 14px;color: #000;"
                    >Bank Code (銀行代碼):</span
                  >
                </span>
                <input
                  type="text"
                  v-model="certificateData.electronicBill.bankCode"
                />
              </el-form-item>
              <el-form-item>
                <span slot="label">
                  <span style="font-size: 14px;color: #000;"
                    >Bank account Number (收款賬號):</span
                  >
                </span>
                <input
                  type="text"
                  v-model="certificateData.electronicBill.bankAccountNumber"
                />
              </el-form-item>
              <el-form-item>
                <span slot="label">
                  <span style="font-size: 14px;color: #000;"
                    >Swift code (銀行國際代碼):</span
                  >
                </span>
                <input
                  type="text"
                  v-model="certificateData.electronicBill.swiftCode"
                />
              </el-form-item>
              <el-form-item>
                <span slot="label">
                  <span style="font-size: 14px;color: #000;"
                    >Bank Address (銀行地址):</span
                  >
                </span>
                <input
                  type="text"
                  v-model="certificateData.electronicBill.bankAddr"
                />
              </el-form-item>
            </el-form>
            <div style="width: 250px;text-align: center;">
              <img src="../../assets/imgs/certificate/foot.png" />
              <div style="width: 259px;">
                <img src="../../assets/imgs/certificate/line.png" />
              </div>
              <div style="text-align: right;">Stamp</div>
            </div>
          </div>
          <div
            style="margin-top: 20px;
                  font-weight: bold;
                  font-size: 14px;"
          >
            此單所列貨物均為香港交貨價，如需攜帶出香港請貴客自行向所到地海關申報，並承擔有關費用，本公司概不負責!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import detailsVue from "../common/details.vue";
export default {
  components: { detailsVue },
  data() {
    let that = this;
    let loading;
    return {
      baseUrl: this.$store.state.baseUrl,
      role: null,

      pageSel: 0,
      addDataConsign: {
        sold: null,
        bill: "",
        isReceiveCheck: false,
        customer: "",
        soldTime: "",
        stockOutTime: "",
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
            required: false,
            message: "請輸入賬單號",
            trigger: "blur"
          }
        ],
        customer: [
          {
            required: false,
            message: "請選擇客戶",
            trigger: "change"
          }
        ],
        soldTime: [
          {
            required: false,
            message: "請選擇日期",
            trigger: "change"
          }
        ],
        stockOutTime: [
          {
            required: false,
            message: "請選擇出庫時間",
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
          label: "已出售",
          value: "3"
        },
        {
          label: "已出库",
          value: "4"
        }
      ],
      stateList2: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "已售未出库",
          value: "3"
        },
        {
          label: "已出库",
          value: "4"
        }
      ],
      stateUpdateList: [
        {
          label: "存货",
          value: "1"
        }
      ],

      sellStockList: [],
      customerList: [],

      sellOrderList: [],
      sellOrderTotal: 0,
      sellKeyword: "",
      sellPage: 1,
      sellSold: "",
      sellTime: null,

      dialogStateVisible: false,
      updateSellMsg: {},
      updateSellId: null,

      certificateData: {
        id: 8,
        bill: "20220329",
        companyName: "POWER EXPRESS INTERNATIONAL TRADING LIMITED",
        companyAddr: "7F,68 Kimberley Road, Tsim Sha Tsui, Kowloon",
        paymentTerms: "C.O.D",
        bankAccountName:
          "Power Express International Trading Limited (威通國際貿易有限公司)",
        bankName: "BANK OF COMMUNICATIONS CO., LTD (交通銀行)",
        bankCode: "027",
        bankAccountNumber: "8411 - 0124 - 4401",
        swiftCode: "COMMHKHH",
        bankAddr: "20 Pedder Street, Central, Hong Kong (香港中環畢打街20號)"
      },
      BagBillList: [],
      printLoading: false,
      printData: {
        id: "printArea",
        popTitle: "", // 打印配置页上方的标题
        extraHead: "銷售憑證", // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
        preview: false, // 是否启动预览模式，默认是false
        previewTitle: "", // 打印预览的标题
        previewPrintBtnLabel: "預覽結束，開始打印", // 打印预览的标题下方的按钮文本，点击可进入打印
        zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
        previewBeforeOpenCallback() {
          console.log("正在加载预览窗口！");
          console.log(that);
        }, // 预览窗口打开之前的callback
        previewOpenCallback() {
          console.log("已经加载完预览窗口，预览打开了！");
        }, // 预览窗口打开时的callback
        beforeOpenCallback() {
          console.log("开始打印之前！");
        }, // 开始打印之前的callback
        openCallback() {
          loading.close();
          console.log("执行打印了！");
        }, // 调用打印时的callback
        closeCallback() {
          console.log("关闭了打印工具！");
        }, // 关闭打印的callback(无法区分确认or取消)
        clickMounted() {
          console.log("点击v-print绑定的按钮了！");
          loading = that.$loading({
            lock: true,
            text: "加載中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
        },
        standard: "",
        extarCss: ""
      },

      dialogDownloadVisible: false,
      downloadType: "",
      deleteBill: null,
      dialogDeleteBillVisible: false,
      subTotal: 0,

      pdfUrl: "",
      isShow: false,
      currencyGlobal: "",
      updateId: null
    };
  },
  created() {
    this.currencyGlobal = sessionStorage.getItem("currencyGlobal");
    this.role = sessionStorage.getItem("role");

    this.getSellOrderList();
  },
  mounted() {
    this.getCustomerList();
  },
  methods: {
    // 编辑商品信息
    editProduct(item) {
      this.updateId = item.id;
      this.pageSel = 1;

      document
        .getElementById("salesHistoryContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    // 编辑成功
    updateSuccess() {
      this.pageSel = 0;
      this.page = 1;
      this.getSellOrderList();

      document
        .getElementById("salesHistoryContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    gobackAdd() {
      this.pageSel = 0;
    },
    // 計算總金額
    getSubPrice() {
      this.subTotal = 0;
      for (const item of this.sellStockList) {
        this.subTotal += item.saleTotalHkPrice;
      }
    },
    // 撤銷銷售單
    cancelSales(item) {
      console.log(item);
      this.deleteBill = item.bill;

      this.dialogDeleteBillVisible = true;
    },
    cancelSureSales() {
      this.$axios
        .post(
          this.$store.state.baseCompanyUrl +
            "/sell/sellOrderRevoke?bill=" +
            this.deleteBill
        )
        .then(res => {
          console.log(res);
          this.dialogDeleteBillVisible = false;
          if (res.status == 200) {
            this.$message.success({
              message: "撤銷成功",
              showClose: true,
              duration: 2000
            });
            this.getSellOrderList();
          }
        })
        .catch(err => {
          console.log(err);
          this.dialogDeleteBillVisible = false;
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },
    // 銷售憑證
    printSalesCredentials(bill) {
      console.log(bill);
      this.$axios
        .get(
          this.$store.state.baseCompanyUrl +
            "/sell/salesCredentials?bill=" +
            bill
        )
        .then(res => {
          console.log("銷售憑證");
          console.log(res);
          this.certificateData = res.data;
          this.pageSel = 4;

          document
            .getElementById("salesHistoryContainer")
            .scrollIntoView({ behavior: "smooth" });
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
    blobToArrayBuffer(blob, callback) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onload = function() {
        return callback(this.result);
      };
    },
    // 下载文件
    downloadExcel() {
      this.downloadType = "";
      this.dialogDownloadVisible = true;
    },
    // 確定
    downloadSureExcel() {
      this.dialogDownloadVisible = false;
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      this.$axios
        .post(
          this.$store.state.baseCompanyUrl + "/sell/electronicBillingSave",
          this.certificateData.electronicBill
        )
        .then(res => {
          loading.close();
          console.log("修改下載憑證");
          console.log(res);
          let url = "";
          if (this.downloadType == 0) {
            url = this.$store.state.baseUrl + "/file/" + res.data.excelUrl;
          } else if (this.downloadType == 1) {
            url = this.$store.state.baseUrl + "/file/" + res.data.pdfUrl;
          }

          console.log(url);

          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          loading.close();
          console.log(err);
          this.$message.error({
            message: err.data.status,
            showClose: true,
            duration: 2000
          });
        });
    },

    // 修改銷售單
    updateSellOrder(val) {
      console.log(val);
      this.updateSellId = "修改";
      this.addDataConsign.sold = val.sold + "";
      this.addDataConsign.bill = val.bill;
      this.addDataConsign.isReceiveCheck =
        val.isReceiveCheck == 0 ? false : true;
      this.addDataConsign.customer = val.customer;

      this.addDataConsign.soldTime = val.soldTime;
      this.addDataConsign.stockOutTime = val.stockOutTime;
      this.addDataConsign.sellCurrencyId = val.sellCurrencyId
        ? val.sellCurrencyId + ""
        : "";

      this.sellStockList = val.stockList;
      let list = this.sellStockList.map(item => {
        return {
          stockId: item.id,
          productCode: item.productCode,
          pic: item.pic,
          pics: item.pics,
          name: item.name,
          priceTran: item.priceTran,
          saleLogHkPrice: item.saleLogHkPrice,
          saleTotalHkPrice: item.saleTotalHkPrice,
          note: item.note
        };
      });
      this.sellStockList = list;

      this.getSubPrice();

      this.pageSel = 2;
      this.stateChange();

      document
        .getElementById("salesHistoryContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    // 退貨
    salesReturn(row) {
      console.log(row);
      this.updateSellMsg = row;
      this.updateSellMsg.sold = "1";
      this.dialogStateVisible = true;
    },
    // 確定退貨
    salesReturnSure() {
      if (this.updateSellMsg.createTime && this.updateSellMsg.sold) {
        this.$axios
          .put(this.baseUrl + "/stateSave", {
            id: this.updateSellMsg.id,
            sold: this.updateSellMsg.sold,
            createTime: this.updateSellMsg.createTime,
            note: this.updateSellMsg.note
          })
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              this.$message.success({
                message: "退貨成功",
                showClose: true,
                duration: 2000
              });
              this.dialogStateVisible = false;
              this.getSellOrderList();
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
      } else {
        this.$message.error({
          message: "庫存狀態/入庫時間不能為空",
          showClose: true,
          duration: 2000
        });
      }
    },
    // 填寫銷售信息
    addSold() {
      if (this.sellStockList.length == 0) {
        this.$message.error({
          message: "請選擇銷售商品",
          showClose: true,
          duration: 2000
        });
      } else {
        this.$refs.addSalesTicketForm.resetFields();

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

        this.pageSel = 2;
      }
    },
    // 提交銷售單信息
    submitSales(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.sellStockList);
          this.sellStockList.forEach(item => {
            this.$set(
              item,
              "sellCurrencyId",
              this.addDataConsign.sellCurrencyId
            );
          });
          if (this.addDataConsign.sold != 3) {
            let arr = this.sellStockList.map(item => {
              return item.saleTotalHkPrice;
            });
            if (!arr.includes("")) {
              this.updateRequest();
            } else {
              this.$message.error({
                message:
                  "請填寫出售" +
                  this.currencyFontRgx(this.currencyGlobal) +
                  "金額",
                showClose: true,
                duration: 2000
              });
            }
          } else {
            this.updateRequest();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改銷售單請求
    updateRequest() {
      console.log("修改銷售單");
      console.log(this.addDataConsign);
      this.$axios
        .post(this.$store.state.baseCompanyUrl + "/sell/sellOrderUpdate", {
          sold: this.addDataConsign.sold,
          bill: this.addDataConsign.bill,
          customer: this.addDataConsign.customer,
          soldTime: this.addDataConsign.soldTime,
          stockOutTime:
            this.addDataConsign.sold == 4
              ? this.addDataConsign.stockOutTime
              : null,
          isReceiveCheck: this.addDataConsign.isReceiveCheck == false ? 0 : 1,
          sellCurrencyId: this.addDataConsign.sellCurrencyId,
          sellStockList: this.sellStockList
        })
        .then(res => {
          console.log("修改銷售單信息");
          console.log(res);
          if (res.status == 200) {
            this.$message.success({
              message: "修改成功",
              showClose: true,
              duration: 2000
            });
            this.pageSel = 0;
            this.getSellOrderList();
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
      this.addDataConsign.customer = item.value;
    },
    stateChange() {
      console.log(this.addDataConsign.sold);
      if (this.addDataConsign.sold == 3) {
        console.log("33333333");
        this.addDataRules.bill[0].required = false;
        this.addDataRules.customer[0].required = false;
        this.addDataRules.soldTime[0].required = false;
        this.addDataRules.stockOutTime[0].required = false;
      } else if (this.addDataConsign.sold == 4) {
        console.log("4444444444");
        this.addDataRules.bill[0].required = true;
        this.addDataRules.customer[0].required = true;
        this.addDataRules.soldTime[0].required = true;
        this.addDataRules.stockOutTime[0].required = true;
      }
    },
    getRowKeys(row) {
      return row.id;
    },
    goback() {
      this.pageSel = 0;
    },
    gobackAdd() {
      this.pageSel = 0;
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
    // 銷售为港币
    isSellHKD(item) {
      if (this.addDataConsign.sellCurrencyId == 2) {
        item.saleTotalHkPrice = item.priceTran;
        this.getSubPrice();
      } else {
        item.saleTotalHkPrice = "";
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
    // 分页
    handleCurrentChangeSell(val) {
      this.sellPage = val;
      this.getSellOrderList();

      document
        .getElementById("salesHistoryContainer")
        .scrollIntoView({ behavior: "smooth" });
    },

    // 查询
    searchSell() {
      this.sellPage = 1;
      this.getSellOrderList();
    },
    // 獲取銷售單列表
    getSellOrderList() {
      this.$axios
        .post(this.$store.state.baseCompanyUrl + "/sell/sellOrderList", {
          page: this.sellPage,
          pageNum: 5,
          keyword: this.sellKeyword,
          sold: this.sellSold,
          startTime: this.sellTime ? this.sellTime[0] : "",
          endTime: this.sellTime ? this.sellTime[1] : ""
        })
        .then(res => {
          console.log("銷售單列表");
          console.log(res);
          this.sellOrderList = res.data.data;
          this.sellOrderTotal = res.data.total;
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

  .back-style {
    padding: 20px;
    background-color: #fff;
    border-radius: 6px;
  }

  .bill-container {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 14px;
    }
  }

  .every {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .every-left {
      width: 150px;
      margin-right: 5px;
      margin-bottom: 5px;
      text-align: right;
      font-size: 16px;
    }

    .every-right {
      width: 100px;
      text-align: left;
      font-size: 16px;
    }
  }
  .certificate-title {
    margin-top: 20px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }

  .certificate-to {
    margin-top: 20px;
    text-align: left;
    font-size: 16px;
    font-weight: bold;
  }

  .certificate-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .certificate-foot {
    margin-top: 20px;
    font-weight: bold;
    font-size: 14px;
  }
}
</style>
<style lang="scss">
#selectType {
  .el-radio-group {
    display: flex;
    align-items: center;
  }

  .el-radio {
    display: flex;
    align-items: center;
  }
}

#printArea {
  input {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #000;
    display: inline-block;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    outline: 0;
    padding: 0 5px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }

  input:focus {
    // padding: 0
    border: 1px solid #dcdfe6;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-form-item__label {
    color: #2c3e50;
  }
}
</style>
