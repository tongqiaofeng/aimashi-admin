<template>
  <div style="margin-top: -20px;overflow: hidden;" id="warehouseContainer">
    <div class="onsale-container">
      <!-- 未出库 -->
      <div v-if="pageSel == 0">
        <div>
          <el-form inline>
            <el-form-item label="库存地：">
              <el-cascader v-model="stockLoc2" :options="stockLocList" :props="{
                value: 'id',
                label: 'name',
                children: 'warehouseList',
                checkStrictly: true
              }" @change="radioChange" clearable popper-class="disableFirstLevel"></el-cascader>
            </el-form-item>
            <el-form-item label="库存状态：">
              <el-select v-model="soldSel" @change="radioChange">
                <el-option v-for="item in stateList2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否为客人寄卖">
              <el-select v-model="isCustomerConsignsFilter">
                <el-option label="全部" value="null"> </el-option>
                <el-option label="客人寄卖" value="1"></el-option>
                <el-option label="非客人寄卖" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input clearable style="width: 600px;" v-model="searchKey"
                placeholder="输入商品款式、尺寸、材质、色号、色系、客户、货号可搜索,如：H000001、000001、1" @focus="radioChange"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="searchProducts">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="onSaleProducts" style="width: 100%" border>
          <el-table-column align="center" prop="productCode" label="货号">
            <template slot-scope="scope">
              <div>
                <el-popover placement="right" trigger="click">
                  <div class="popover-container">
                    <div class="popover-img">
                      <img v-show="popoverImg01" :src="popoverImg01" />
                    </div>
                    <div class="popover-img">
                      <img v-show="popoverImg02" :src="popoverImg02" />
                    </div>
                    <div class="popover-main">
                      <div class="every" style="align-items: flex-end;">
                        <span class="title">货号：</span>
                        <span class="content">{{ proShowMsg.productCode }}</span>
                      </div>
                      <div class="every">
                        <span class="title">款式：</span>
                        <span class="content">{{ proShowMsg.model }}</span>
                      </div>
                      <div class="every">
                        <span class="title">大小：</span>
                        <span class="content">{{ proShowMsg.size ? proShowMsg.size : '--' }}</span>
                      </div>
                      <div class="every">
                        <span class="title">金属：</span>
                        <span class="content" style="font-weight: normal;">{{ proShowMsg.metal ? proShowMsg.metal : '--'
                        }}</span>
                      </div>
                      <div class="every">
                        <span class="title">皮质：</span>
                        <span class="content">{{ proShowMsg.leather ? proShowMsg.leather : '--' }}</span>
                      </div>
                      <div class="every">
                        <span class="title">颜色：</span>
                        <span class="content">{{ proShowMsg.color ? proShowMsg.color : '--' }}</span>
                      </div>
                      <div class="every">
                        <span class="title">色号：</span>
                        <span class="content">{{ proShowMsg.colorId ? proShowMsg.colorId : '--' }}</span>
                      </div>
                      <div class="every">
                        <span class="title">刻印：</span>
                        <span class="content">{{ proShowMsg.letter ? proShowMsg.letter.split('')[0] : '--' }}</span>
                      </div>
                      <div class="every">
                        <span class="title">成本价：</span>
                        <div class="content">
                          <div>{{ proShowMsg.buyAllPrice ? proShowMsg.foreignCurrency + ' ' +
                            formatNumberRgx(proShowMsg.buyAllPrice) : '--' }}</div>
                          <div>{{ proShowMsg.cost ? proShowMsg.currency + ' ' + formatNumberRgx(proShowMsg.cost) : '--' }}
                          </div>
                        </div>
                      </div>
                      <div class="state">
                        存货地：{{ stockReg(scope.row.stockLocId) }}
                      </div>
                    </div>
                  </div>
                  <el-button type="text" slot="reference" @click="showProMsg(scope.row)">{{ scope.row.productCode
                  }}</el-button>
                </el-popover>

              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pic" label="展示图">
            <template slot-scope="scope">
              <div>
                <el-image style="width: 100px; height: 100px" :src="scope.row.pic.trim()"
                  :preview-src-list="bigImg(scope.row.pics)" :z-index="5000">
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="prop" label="内部图">
            <template slot-scope="scope">
              <div v-if="
                scope.row.privateImg !== '' && scope.row.privateImg !== null
              ">
                <el-image style="width: 100px; height: 100px" :src="scope.row.privatePic.trim()"
                  :preview-src-list="bigImg(scope.row.privateImg)" :z-index="5000">
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="300px" align="center" prop="name" label="商品信息">
            <template slot-scope="scope">
              <div>
                <el-tooltip class="item" effect="light" :content="scope.row.name" placement="bottom">
                  <div class="font-warp">{{ scope.row.name }}</div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="cost" label="总成本">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.cost == 0
                  ? "-"
                  : formatNumberRgx(scope.row.cost)
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pricePeer" label="同行价">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.pricePeer == 0
                  ? "-"
                  : scope.row.peerCurrency + ' ' + formatNumberRgx(scope.row.pricePeer)
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="priceIndi" label="散客价">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.priceIndi == 0
                  ? "-"
                  : scope.row.peerCurrency + ' ' + formatNumberRgx(scope.row.priceIndi)
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="入库日期"></el-table-column>
          <!-- <el-table-column width="180px" align="center" label="时间">
            <template slot-scope="scope">
              <div>
                <p style="margin-top: 0;" v-if="
                  scope.row.estimateTime &&
                  (scope.row.sold == 0 ||
                    scope.row.sold == 2 ||
                    scope.row.sold == 3)
                ">
                  预计到达：{{ scope.row.estimateTime }}
                </p>
                <p style="margin-top: 0;" v-if="
                  scope.row.createTime &&
                  (scope.row.sold == 1 ||
                    scope.row.sold == 2 ||
                    scope.row.sold == 3 ||
                    scope.row.sold == 5 ||
                    scope.row.sold == 6 ||
                    scope.row.sold == 7 ||
                    scope.row.sold == 9)
                ">
                  入库时间：{{ scope.row.createTime }}
                </p>
                <p style="margin-top: 0;" v-if="scope.row.soldTime">
                  出售时间：{{ scope.row.soldTime }}
                </p>
                <p style="margin-top: 0;" v-if="scope.row.stockOutTime && scope.row.sold == 5">
                  取回时间：{{ scope.row.stockOutTime }}
                </p>
                <p style="margin-top: 0;" v-if="scope.row.stockOutTime && scope.row.sold == 6">
                  退货时间：{{ scope.row.stockOutTime }}
                </p>
                <p style="margin: 0;" v-if="scope.row.stockOutTime && scope.row.sold == 7">
                  时间：{{ scope.row.stockOutTime }}
                </p>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column align="center" prop="createTime" label="在库时长">
            <template slot-scope="scope">
              <div>
                {{ timeLong(scope.row.createTime) }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column align="center" prop="stockLocId" label="库存点">
            <template slot-scope="scope">
              <div>
                <div style="cursor: pointer;" @click="warehouseLocUpdate(scope.row)">
                  <span class="handle-button">{{
                    stockReg(scope.row.stockLocId)
                  }}</span>
                  <img src="../../assets/imgs/update.png" style="width: 15px;height: 18px;" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sold" label="库存状态">
            <template slot-scope="scope">
              <div>
                <div style="cursor: pointer;" @click="stateupdate(scope.row)">
                  <span class="handle-button">{{
                    soldStateRgx(scope.row.sold)
                  }}</span>
                  <img src="../../assets/imgs/update.png" style="width: 15px;height: 18px;" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="delProduct(scope.row)">删除</el-button>
                <el-button style="margin-left: 3px;" type="text" @click="editProduct(scope.row)">编辑</el-button>
                <el-button style="margin-left: 3px;" type="text" @click="noteCheck(scope.row)">备注</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="500px">
          <div style="text-align:center;font-size: 16px;">
            <span>确定删除该商品？删除后不能恢复</span>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteSure">确 定 </el-button>
          </span>
        </el-dialog>
        <el-dialog title="备注" :visible.sync="noteDialogVisible" width="500px">
          <div style="text-align:center;">
            <p style="font-size: 16px;" v-if="note">{{ note }}</p>
            <p style="font-size: 16px;" v-else>暂无备注信息~</p>
          </div>
        </el-dialog>
        <el-dialog title="库存地" :visible.sync="dialogWarehouseLocUpdateVisible" width="500px">
          <div>
            <el-form label-width="80px">
              <el-form-item label="库存地" required>
                <el-select v-if="sold == 8" v-model="stockLoc" placeholder="请选择" clearable style="width:100%;"
                  value-key="warehouseId">
                  <el-option v-for="item in stockLocs" :key="item.warehouseId" :label="item.warehouseName" :value="item">
                    <span style="float: left">{{ item.warehouseName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.companyName }}</span>
                  </el-option>
                </el-select>
                <el-select v-else v-model="stockLoc" placeholder="请选择" clearable style="width:100%;"
                  value-key="warehouseId" @change="selectChange">
                  <el-option v-for="item in stockLocs" :key="item.warehouseId" :label="item.warehouseName" :value="item"
                    v-show="item.companyId == companyId">
                    <span style="float: left">{{ item.warehouseName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.companyName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="入库时间" required v-if="isWarehouse != 0">
                <el-date-picker v-model="createTime" type="date" placeholder="请选择日期时间" value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd" style="width:100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" style="width:100%;" v-model="note"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer">
            <el-button @click="dialogWarehouseLocUpdateVisible = false">取 消</el-button>
            <el-button type="primary" @click="warehouseLocUpdateSure">确 定
            </el-button>
          </div>
        </el-dialog>
        <el-dialog title="库存数据" v-if="dialogStateVisible" :visible.sync="dialogStateVisible" width="800px"
          :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="true"
          :append-to-body="true">
          <div>
            <el-form label-width="121px">
              <el-form-item label="库存状态" required>
                <el-select v-model="sold" placeholder="请选择" style="width:100%;" @change="soldChange">
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
                <el-date-picker type="date" placeholder="请选择日期时间" v-model="estimateTime" style="width:100%;"
                  value-format="yyyy-MM-dd" format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="入库时间" required v-if="sold == 1 || sold == 9">
                <el-form-item>
                  <el-date-picker type="date" placeholder="请选择日期时间" v-model="createTime" style="width:100%;"
                    value-format="yyyy-MM-dd" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="取回时间" required v-if="sold == 5">
                <el-date-picker v-model="stockOutTime" type="date" style="width:100%;" placeholder="请选择日期"
                  value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item label="退货时间" required v-if="sold == 6">
                <el-date-picker v-model="stockOutTime" type="date" style="width:100%;" placeholder="请选择日期"
                  value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item label="时间" required v-if="sold == 7">
                <el-date-picker v-model="stockOutTime" type="date" style="width:100%;" placeholder="请选择日期"
                  value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item label="账单号" :required="isStock == 1 || sold == 8 ? true : false"
                v-if="sold == 3 || sold == 8">
                <el-input v-model="bill"></el-input>
              </el-form-item>
              <el-form-item :label="sold == 8 ? '寄卖时间' : '出售时间'" :required="isStock == 1 || sold == 8 ? true : false"
                v-if="sold == 3 || sold == 8">
                <el-date-picker v-model="soldTime" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd" style="width:100%;"></el-date-picker>
              </el-form-item>
              <el-form-item :label="sold == 8 ? '寄卖外币金额' : '出售外币金额'" v-if="sold == 2 || sold == 3 || sold == 8">
                <div style="width:100%;display: flex;">
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
                <div style="display: flex;">
                  <el-input style="flex: 1;" v-model="saleLogHkPrice" placeholder="请输入物流费/银行手续费送货"></el-input>
                  <span>{{ currencyGlobal }}</span>
                </div>
              </el-form-item>

              <el-form-item
                :label="sold == 8 ? '寄卖' + currencyFontRgx(currencyGlobal) + '金额' : '出售' + currencyFontRgx(currencyGlobal) + '金额'"
                :required="isHeadConsigns == 0 && (isStock == 1 || sold == 8) ? true : false"
                v-if="sold == 3 || sold == 8">
                <div style="display: flex;">
                  <el-input style="flex: 1;" v-model="saleTotalHkPrice" :placeholder="
                    sold == 8
                      ? '请输入寄卖' +
                      currencyFontRgx(currencyGlobal) +
                      '金额'
                      : '请输入出售' +
                      currencyFontRgx(currencyGlobal) +
                      '金额'
                  "></el-input>
                </div>
              </el-form-item>
              <el-form-item :label="'出售' + currencyFontRgx(headCurrency) + '金额'" :required="isStock == 1 ? true : false"
                v-if="sold == 3 && isHeadConsigns == 1">
                <div style="display: flex;">
                  <el-input style="flex: 1;" v-model="headSellMoney" :placeholder="
                    '请输入出售' +
                    currencyFontRgx(headCurrency) +
                    '金额，用于与总公司结算'
                  "></el-input>
                </div>
              </el-form-item>
              <el-form-item label="销售人员" :required="isStock == 1 || sold == 8 ? true : false"
                v-if="sold == 3 || sold == 8">
                <el-select style="width: 100%;" v-model="sellerId" placeholder="请选择销售人员">
                  <el-option v-for="item in sellerList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户姓名" :required="isStock == 1 || sold == 2 ? true : false"
                v-if="sold == 2 || sold == 3">
                <el-autocomplete style="width: 100%;" v-model="customer" :fetch-suggestions="querySearch"
                  placeholder="请选择/输入客户姓名" @select="handleSelect"></el-autocomplete>
              </el-form-item>
              <el-form-item label="客户类型" :required="isStock == 1 || sold == 8 ? true : false"
                v-if="sold == 3 || sold == 8">
                <el-autocomplete style="width: 100%;" v-model="customerType" :fetch-suggestions="queryCustomerTypeSearch"
                  placeholder="请选择/输入客户类型" @select="handleCustomerTypeSelect"></el-autocomplete>
              </el-form-item>
              <el-form-item label="接收仓库" v-show="sold == 8" required>
                <el-cascader style="width: 100%;" v-model="receiveWarehouseId" :options="companyAndWarehouseList" :props="{
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
                <el-date-picker v-model="stockOutTime" type="date" style="width:100%;" placeholder="请选择日期"
                  value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" style="width:100%;" v-model="note"></el-input>
              </el-form-item>
              <el-form-item label="出售记录" v-show="salePaymentList.length > 0 && sold == 3">
                <el-table :data="salePaymentList" style="width: 100%;">
                  <el-table-column align="center" prop="time" label="日期" width="200px">
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
                  <el-table-column width="200px" align="center" prop="productDes" label="產品描述">
                    <template slot-scope="scope">
                      <div>
                        <el-tooltip class="item" effect="light" :content="scope.row.productDes" placement="top-end">
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
                  <el-table-column width="200px" align="center" prop="remark" label="Remarks">
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
          </div>
          <div slot="footer">
            <el-button @click="dialogStateVisible = false">取 消</el-button>
            <el-button type="primary" @click="stateupdateSure">确 定
            </el-button>
          </div>
        </el-dialog>
        <div style="margin-top:15px;text-align: right;">
          <el-pagination @current-change="handleCurrentChange" :current-page="page"
            layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
      <div v-if="pageSel == 1">
        <details-vue :updatesId="updateId" @goback="goback" @updateSuccess="updateSuccess"></details-vue>
      </div>
    </div>
  </div>
</template>

<script>
import detailsVue from "@/components/details.vue";
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

      stockLoc2: [],
      isCustomerConsigns: '0',
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
          label: "已出售",
          value: "3"
        },
        {
          label: "已寄卖",
          value: "8"
        },
        {
          label: "客人预留",
          value: "2"
        },
        {
          label: "购入退货",
          value: "6"
        },
        {
          label: "客人取回",
          value: "5"
        },
        {
          label: "遗失",
          value: "7"
        }
      ],
      dialogStateVisible: false,
      updateStateId: null,
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
          label: "已出售",
          value: "3"
        },
        {
          label: "已寄卖",
          value: "8"
        },
        {
          label: "客人预留",
          value: "2"
        },
        {
          label: "购入退货",
          value: "6"
        },
        {
          label: "客人取回",
          value: "5"
        },
        {
          label: "遗失",
          value: "7"
        }
      ],
      isCustomerConsignsFilter: 'null',
      soldSel: "1",
      noteDialogVisible: false,
      bill: "",

      isRequire: 0,
      dialogWarehouseLocUpdateVisible: false,
      locUpdateId: null,
      saleLogHkPrice: "",
      saleTotalHkPrice: "",
      headSellMoney: "",
      isHeadConsigns: 0,
      headCurrency: "",
      buyAllPrice: undefined,
      totalHkPrice: undefined,
      logHkPrice: undefined,

      isWarehouse: null,
      customerList: [],
      salePaymentList: [],
      role: null,
      isUpdateOrDel: null,

      companyId: null,
      currencyGlobal: "",

      sellerId: "",
      sellerList: [],
      customerTypeList: [],
      customerType: "",
      numIsEquality: false,

      proShowMsg: {},
      popoverImg01: '',
      popoverImg02: ''
    };
  },
  created() {
    this.role = sessionStorage.getItem("role");
    this.currencyGlobal = sessionStorage.getItem("currencyGlobal");
    this.getStockLocList();
    this.getCustomerList();
    this.getCompanyAndWarehouseList();
    this.getSellerAndCustomerType();
  },
  methods: {
    showProMsg(item) {
      console.log(item);
      this.popoverImg01 = '';
      this.popoverImg02 = '';

      let imgs = item.pics.split('|').filter(item => {
        return item && item.trim()
      })
      if (imgs.length > 0) {
        this.popoverImg01 = imgs[0];

        if (imgs.length > 1) {
          this.popoverImg02 = imgs[1];
        }
      }

      this.proShowMsg = item;
    },
    soldChange() {
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
      let companys = sessionStorage.getItem("companyId");
      if (item.companyId != companys) {
        this.$message.error({
          message: "该商品不在您所管理的仓库中，不可进行修改",
          showClose: true,
          duration: 2000
        });
      } else {
        this.locUpdateId = item.id;
        for (const items of this.stockLocs) {
          if (
            items.warehouseId == item.stockLocId &&
            items.companyId == item.companyId
          ) {
            this.stockLoc = {
              warehouseId: Number(item.stockLocId),
              warehouseName: items.warehouseName,
              companyId: Number(item.companyId)
            };
          }
        }

        console.log(this.stockLoc);
        this.sold = item.sold;
        this.companyId = item.companyId;
        this.createTime = item.createTime;
        this.isWarehouse = item.sold;
        this.isUpdateOrDel = item.isUpdateOrDel;
        this.note = item.note;

        this.dialogWarehouseLocUpdateVisible = true;
      }
    },
    selectChange() {
      console.log(this.stockLoc);
    },
    // 确定修改
    warehouseLocUpdateSure() {
      if (this.isUpdateOrDel === -1) {
        this.$message.error({
          message: "该商品不在您所管理的仓库中，不可进行修改",
          showClose: true,
          duration: 2000
        });
        this.dialogWarehouseLocUpdateVisible = false;
      } else {
        if (
          this.isWarehouse != 0 &&
          (this.createTime == "" || this.createTime == null)
        ) {
          this.$message.error({
            message: "数据不能为空",
            showClose: true,
            duration: 2000
          });
          return;
        }
        if (this.stockLoc == "") {
          this.$message.error({
            message: "数据不能为空",
            showClose: true,
            duration: 2000
          });
        } else {
          this.$axios
            .put(this.baseUrl + "/stockLocSave", {
              id: this.locUpdateId,
              stockLocId: this.stockLoc.warehouseId,
              companyId: this.stockLoc.companyId,
              createTime: this.createTime,
              note: this.note
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
      }
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
        if (item.sold == 4) {
          this.sold = "3";
        } else {
          this.sold = item.sold;
        }

        this.bill = item.bill;
        this.estimateTime = item.estimateTime;
        this.isCustomerConsigns = item.isCustomerConsigns + '';
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
        this.headSellMoney = item.headSellMoney == 0 ? "" : item.headSellMoney;
        this.isHeadConsigns =
          item.isHeadConsigns == null || item.isHeadConsigns == -1
            ? 0
            : item.isHeadConsigns;
        this.headCurrency = item.headCurrency;

        this.salePaymentList = item.salePaymentList;
        this.isUpdateOrDel = item.isUpdateOrDel;

        this.isReceiveCheck =
          item.isReceiveCheck == 0 || item.isReceiveCheck == null
            ? false
            : true;

        if (item.sold == 3) {
          this.isStock = 0;
        } else if (item.sold == 4) {
          this.isStock = 1;
        }
        if (item.sold == 8) {
          this.receiveWarehouseId = [
            item.receiveCompanyId,
            item.receiveWarehouseId
          ];
          console.log(this.receiveWarehouseId);
        } else {
          this.receiveWarehouseId = null;
        }
        this.sellerId = item.sellerId;
        this.customerType = item.customerType;

        this.dialogStateVisible = true;
      }
    },
    dataCheck() {
      // console.log(this.sold);
      if (this.sold == 1 || this.sold == 9) {
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
          ((this.saleTotalHkPrice == "" ||
            this.saleTotalHkPrice == undefined ||
            this.saleTotalHkPrice == null) &&
            this.isHeadConsigns == 0) ||
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

      // 有出售記錄
      if (
        this.salePaymentList.length > 0 &&
        (this.sold == 3 ||
          (this.sold == 3 && this.isStock == 1) ||
          this.sold == 8)
      ) {
        let totalSaleMoney = 0;

        totalSaleMoney = this.salePaymentList.reduce(
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
              this.submitData();
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
        if (this.dataCheck() !== 1 && this.numIsEquality == false) {
          this.submitData();
        }
      }
    },
    submitData() {
      this.$axios
        .put(this.baseUrl + "/stateSave", {
          id: this.updateStateId,
          sold: this.sold,
          bill: this.bill,
          createTime: this.sold == 1 || this.sold == 9 ? this.createTime : "",
          estimateTime: this.estimateTime,
          isCustomerConsigns: this.isCustomerConsigns,
          priceTran: this.priceTran,
          customer: this.customer,
          soldTime: this.soldTime,
          sellCurrencyId: this.sellCurrencyId,
          isStock: this.isStock,
          stockOutTime: this.sold == 8 ? this.soldTime : this.stockOutTime,
          note: this.note,
          saleLogHkPrice: this.saleLogHkPrice,
          saleTotalHkPrice: this.saleTotalHkPrice,
          headSellMoney: this.headSellMoney,
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
    },
    // 删除
    delProduct(item) {
      console.log(item.sold);
      let companys = sessionStorage.getItem("companyId");
      if (item.companyId != companys) {
        this.$message.error({
          message: "该商品不在您所管理的仓库中，不可进行删除",
          showClose: true,
          duration: 2000
        });
      } else {
        if (item.sold == 3 || item.sold == 4 || item.sold == 8) {
          this.$message.error({
            message: "该商品已出售，不可刪除",
            showClose: true,
            duration: 2000
          });
        } else {
          this.centerDialogVisible = true;
          console.log(item);
          this.delId = item.id;
        }
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
      document
        .getElementById("warehouseContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    // 编辑成功
    updateSuccess(val) {
      this.pageSel = val;
      this.searchProducts();
    },
    goback(val) {
      this.pageSel = val;
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.searchProducts();

      document
        .getElementById("warehouseContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    radioChange() {
      this.page = 1;
    },
    // 模糊查询
    searchProducts() {
      this.$axios
        .post(this.baseUrl + "/stockSearch", {
          keyword: this.searchKey,
          page: this.page,
          pageNum: 10,
          stockLocId: this.stockLoc2
            ? this.stockLoc2.length == 2
              ? this.stockLoc2[1]
              : null
            : null,
          companyId: this.stockLoc2
            ? this.stockLoc2.length == 1 && this.stockLoc2[0] != -1
              ? this.stockLoc2[0]
              : null
            : null,
          sold: this.soldSel,
          isCustomerConsigns: this.isCustomerConsignsFilter
        })
        .then(res => {
          console.log("模糊搜索數據");
          console.log(res);
          this.onSaleProducts = res.data.list;
          this.total = res.data.total;
          console.log(this.onSaleProducts);
        });
    },

    // 获取所有公司库存点
    getStockLocList() {
      this.$axios
        .get(this.baseUrl + "/stockSearchLocList")
        .then(res => {
          console.log("所有公司库存地列表");
          console.log(res);
          this.stockLocList = res.data;
          this.stockLoc2 = [];
          if (this.stockLocList.length > 0) {
            this.stockLocList[0].warehouseList = undefined;
            let companyId = Number(sessionStorage.getItem("companyId"));
            this.stockLoc2.push(companyId);
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
.onsale-container {
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 6px;
}

.popover-container {
  padding: 10px 0 10px;
  display: flex;
  align-items: center;
  font-size: 18px;

  .popover-img {
    width: 280px;
    height: 380px;
    margin-right: 20px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .popover-main {
    padding: 10px 20px 20px;
    border: 1px solid #000;

    .every {
      margin-top: 10px;
      display: flex;

      .title {
        color: #101010;
      }

      .content {
        font-weight: 600;
        color: #101010;
      }
    }

    .state {
      margin-top: 10px;
      color: #647AA3;
    }
  }
}
</style>