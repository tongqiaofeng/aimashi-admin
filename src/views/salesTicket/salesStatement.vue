<template>
  <!-- 銷售報表 -->
  <div style="margin-top: -20px;overflow: hidden;" id="salesReportContainer">
    <div v-show="pageSel == 0">
      <div class="sales-report-container">
        <div class="container-left">
          <div class="comparison-top">
            <div class="mian-every">
              <div class="every-left">
                <div class="left-title">
                  <span>{{ isCheckEvery == 1 ? selName : "" }}</span>
                  <span>總營業額</span>
                </div>
                <div class="left-num">
                  {{ currencyGlobal + " " + formatNumberRgx(turnoverTotal) }}
                </div>
              </div>
              <div class="every-img">
                <img src="../../assets/imgs/statement/turnover.png" />
              </div>
            </div>
            <div class="mian-every">
              <div class="every-left">
                <div class="left-title">
                  <span>{{ isCheckEvery == 1 ? selName : "" }}</span>
                  <span>總銷售利潤</span>
                </div>
                <div class="left-num">
                  {{ currencyGlobal + " " + formatNumberRgx(costTotal) }}
                </div>
              </div>
              <div class="every-img">
                <img src="../../assets/imgs/statement/cost.png" />
              </div>
            </div>
            <div class="mian-every">
              <div class="every-left">
                <div class="left-title">
                  <span>{{ isCheckEvery == 1 ? selName : "" }}</span>
                  <span>總銷售數量</span>
                </div>
                <div class="left-num">
                  {{ numTotal }}
                </div>
              </div>
              <div class="every-img">
                <img src="../../assets/imgs/statement/num.png" />
              </div>
            </div>
          </div>
          <div class="container-main">
            <div class="main-top">
              <el-radio-group v-model="chartRadio" @change="radioChange">
                <el-radio :label="1">營業額</el-radio>
                <el-radio :label="2">銷售利潤</el-radio>
                <el-radio :label="3">銷售數量</el-radio>
              </el-radio-group>

              <div class="main-top-right">
                <el-select style="width: 80px;" v-model="comparisonData" @change="dataComparison">
                  <el-option label="年" value="1"> </el-option>
                  <el-option label="季度" value="2"> </el-option>
                  <el-option label="月" value="3"> </el-option>
                </el-select>
              </div>
            </div>
            <div class="main-chart"></div>
            <div v-show="chartRadio == 1" id="turnoverChart" style="width: 100%;height: 500px;"></div>

            <div v-show="chartRadio == 2" id="salesCostChart" style="width: 100%;height: 500px;"></div>

            <div v-show="chartRadio == 3" id="salesNumberChart" style="width: 100%;height: 500px;"></div>
          </div>
          <div class="container-bottom" id="selfTable">
            <div>
              <div style="display: flex;justify-content: space-between;">
                <div class="top-title" id="top10Change">
                  <el-select style="width: 130px;" v-model="activeName" @change="handleTabsClick">
                    <el-option label="利潤TOP10" value="first"> </el-option>
                    <el-option label="銷量TOP10" value="second"> </el-option>
                  </el-select>
                  <div class="line"></div>
                </div>
                <div v-show="activeName == 'second'">
                  <el-button-group>
                    <el-button style="background-color: #3d81fd;color: #fff;" @click="checkboxChange(0)">包款</el-button>
                    <el-button :style="{
                      'background-color':
                        checkboxGroup.indexOf('大小') == -1
                          ? '#fff'
                          : '#3d81fd',
                      color:
                        checkboxGroup.indexOf('大小') == -1
                          ? '#606266'
                          : '#fff'
                    }" @click="checkboxChange(1)">大小</el-button>
                    <el-button :style="{
                      'background-color':
                        checkboxGroup.indexOf('材質') == -1
                          ? '#fff'
                          : '#3d81fd',
                      color:
                        checkboxGroup.indexOf('材質') == -1
                          ? '#606266'
                          : '#fff'
                    }" @click="checkboxChange(2)">材質</el-button>
                    <el-button :style="{
                      'background-color':
                        checkboxGroup.indexOf('金屬質感') == -1
                          ? '#fff'
                          : '#3d81fd',
                      color:
                        checkboxGroup.indexOf('金屬質感') == -1
                          ? '#606266'
                          : '#fff'
                    }" @click="checkboxChange(3)">金屬質感</el-button>
                    <el-button :style="{
                      'background-color':
                        checkboxGroup.indexOf('顏色') == -1
                          ? '#fff'
                          : '#3d81fd',
                      color:
                        checkboxGroup.indexOf('顏色') == -1
                          ? '#606266'
                          : '#fff'
                    }" @click="checkboxChange(4)">顏色</el-button>
                  </el-button-group>
                </div>
              </div>
            </div>
            <div class="bottom-main">
              <el-table v-show="activeName == 'first'" :data="profitTopList">
                <el-table-column width="180px" align="center" prop="pics" label="圖片">
                  <template slot-scope="scope">
                    <div>
                      <img style="width: 66px; height: 66px" :src="scope.row.pic" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name" align="center" label="商品屬性">
                </el-table-column>
                <el-table-column prop="profit" label="利潤" align="center">
                  <template slot-scope="scope">
                    <div>
                      {{
                        formatNumberRgx(scope.row.profit) +
                        " " +
                        scope.row.currency
                      }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>

              <el-table v-show="activeName == 'second'" v-loading="loading" element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                :data="salesVolumeTopList" style="margin-top: 20px;" id="salesVolumeContainer">
                <el-table-column width="180px" align="center" prop="pics" label="圖片">
                  <template slot-scope="scope">
                    <div>
                      <img style="width: 66px; height: 66px" :src="scope.row.pic" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="450px" align="center" label="商品屬性">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.model }}
                      {{ checkboxGroup.length > 1 ? scope.row.size : "" }}
                      {{ checkboxGroup.length > 4 ? scope.row.color : "" }}
                      {{ checkboxGroup.length > 2 ? scope.row.leather : "" }}
                      {{
                        checkboxGroup.length > 3
                        ? scope.row.metal
                          ? scope.row.metal + "扣"
                          : ""
                        : ""
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="salesVolumes" label="銷量" align="center">
                </el-table-column>
                <el-table-column prop="prop" label="操作" align="center">
                  <template slot-scope="scoped">
                    <div>
                      <img src="../../assets/imgs/statement/line.png" style="width: 22px;height: 19px;cursor: pointer;"
                        title="查看銷售價格歷史曲線圖" @click="salesPriceHistory(scoped.row)" />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="container-right">
          <div class="right-container">
            <div class="top-title">
              <div class="title">庫存統計</div>
              <div class="line"></div>
            </div>
            <div id="selfTable">
              <el-table :summary-method="getSummaries" show-summary :data="statisticsList" style="width: 100%" key="1">
                <el-table-column prop="stockLocName" align="left" label="倉庫名稱">
                </el-table-column>
                <el-table-column prop="stockNum" align="left" label="庫存數量">
                </el-table-column>
                <el-table-column width="150px" prop="amount" align="left" :label="'庫存總金額' + ' (' + currencyGlobal + ')'">
                  <template slot-scope="scope">
                    <div>
                      {{ formatNumberRgx(scope.row.amount) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="110px" prop="overstockNum" align="left" label="積壓貨物數量">
                  <template slot-scope="scope">
                    <div>
                      <el-button type="text" @click="checkProductNum(scope.row)">{{ scope.row.overstockNum }}</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="pageSel == 1" class="back-style">
      <div style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
        @click="goback(0)">
        <img src="../../assets/imgs/goback.png" style="height: 21px;" />
        <p style="margin: 0;">返回</p>
      </div>
      <div>
        <div id="myPriceChart" style="width: 100%;height: 75vh;margin-top: 20px;"></div>
      </div>
    </div>
    <div v-if="pageSel == 4" class="back-style">
      <div style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
        @click="goback(0)">
        <img src="../../assets/imgs/goback.png" style="height: 21px;" />
        <p style="margin: 0;">返回</p>
      </div>
      <div>
        <el-table :data="overStockList" style="width: 100%" border key="2">
          <el-table-column align="center" prop="productCode" label="货号">
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
          <el-table-column width="180px" align="center" label="时间">
            <template slot-scope="scope">
              <div>
                <p style="margin-top: 0;" v-if="scope.row.createTime">
                  入库时间：{{ scope.row.createTime }}
                </p>
                <p style="margin-top: 0;" v-if="scope.row.soldTime">
                  出售时间：{{ scope.row.soldTime }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="在库时长">
            <template slot-scope="scope">
              <div>
                {{ timeLong(scope.row.createTime) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <div>
                <el-button style="margin-left: 3px;" type="text" @click="editProduct(scope.row)">查看詳情</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:15px;text-align: right;">
          <el-pagination @current-change="handleCurrentChangeSell" :current-page="page" :page-size="10"
            layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div v-if="pageSel == 5" style="margin-top: 20px;">
      <details-vue :updatesId="updateId" @goback="gobackAdd" @updateSuccess="updateSuccess"></details-vue>
    </div>
  </div>
</template>

<script>
import { getAnnulusOption } from "../../utils/option";
import * as $echarts from "echarts";
import detailsVue from "@/components/details.vue";
export default {
  components: { detailsVue },
  data() {
    return {
      pageSel: 0,
      activeName: "first",
      profitTopList: [],
      dataSalesHistoryList: [],
      salesVolumeTopList: [],
      checkboxGroup: ["包款"],
      currencyGlobal: "",

      comparisonData: "1",
      statisticsList: [],
      turnoverComparisonList: [],
      salesCostComparisonList: [],
      salesNumComparisonList: [],

      myTurnoverChart: null,
      mySalesCostChart: null,
      mySalesNumChart: null,
      turnoverTotal: 0,
      costTotal: 0,
      numTotal: 0,

      page: 1,
      total: 0,
      overStockList: [],
      updateId: null,
      overstockNum: 0,
      stockLocId: null,

      chartRadio: 1,
      loading: false,

      isCheckEvery: 0,
      selName: ""
    };
  },
  created() {
    this.currencyGlobal = sessionStorage.getItem("currencyGlobal");
    this.getProfitTopMsg();
    this.getStatisticsData();
  },
  mounted() {
    this.$nextTick(() => {
      document
        .getElementById("salesReportContainer")
        .scrollIntoView({ behavior: "smooth" });
      this.getSalesComparison();
    });
  },
  methods: {
    /**
     * @param {String} id  获取HTML div元素的 ID,
     * @param {Number} dividend  数值1 ，（成功个数）
     * @param {Number} divisor   数值2，（总数）
     */
    renderChart(id, dividend, divisor) {
      $echarts.dispose(document.getElementById(id));
      const data = [dividend, divisor - dividend];
      const colors = ["#4b7efe", "#beddff"];
      const percentage = divisor === 0 ? 0 : (dividend / divisor) * 100;
      const text = this.formatValue(percentage, 1) + "%";
      const subText = "";
      const textFontSize = 20;
      const subTextFontSize = 0;
      const option = getAnnulusOption(
        data,
        colors,
        text,
        subText,
        textFontSize,
        subTextFontSize
      );
      const charts = $echarts.init(document.getElementById(id));
      charts.setOption(option);
    },
    /**
     * @param {number or string} value 数值
     * @param {Number} digits 保留小数位数
     * @param {bool} returnStr 返回值是字符串（如果保留位数那么返回是一个string）
     */
    formatValue(value, digits, returnStr = false) {
      if (digits < 0) {
        console.log("小数点后位数不能为负数");
        value = 0;
      }
      if (!value) {
        value = 0;
      }
      if (returnStr) {
        return parseFloat(value).toFixed(digits);
      }
      return parseFloat(parseFloat(value).toFixed(digits));
    },

    // radio切換
    radioChange() {
      if (this.chartRadio == 1) {
        this.turnoverData();
      } else if (this.chartRadio == 2) {
        this.salesCostData();
      } else if (this.chartRadio == 3) {
        this.salesNumberData();
      }
    },
    // 编辑商品信息
    editProduct(item) {
      this.updateId = item.id;
      this.pageSel = 5;

      document
        .getElementById("salesReportContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    // 编辑成功
    updateSuccess() {
      this.pageSel = 4;
      this.page = 1;
      this.checkProductNum();

      document
        .getElementById("salesReportContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    gobackAdd() {
      this.pageSel = 4;
    },
    // 查看積壓貨物
    checkProductNum(item) {
      if (item) {
        this.page = 1;
        console.log(item.stockLocId);
        this.stockLocId = item.stockLocId;
        this.overstockNum = item.overstockNum;
      }

      if (this.overstockNum > 0) {
        this.$axios
          .get(
            this.$store.state.baseUrl +
            "/overStockSearchList?stockLocId=" +
            this.stockLocId +
            "&page=" +
            this.page +
            "&pageNum=10"
          )
          .then(res => {
            console.log("積壓貨物列表");
            console.log(res);
            this.overStockList = res.data.list;
            this.total = res.data.total;
            this.pageSel = 4;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message.warning({
          message: "該倉庫暫無積壓貨物"
        });
      }
    },
    // 分页
    handleCurrentChangeSell(val) {
      this.page = val;
      this.checkProductNum();

      document
        .getElementById("salesReportContainer")
        .scrollIntoView({ behavior: "smooth" });
    },

    // 營業額對比
    turnoverData() {
      if (!this.myTurnoverChart) {
        this.myTurnoverChart = $echarts.init(
          document.getElementById("turnoverChart")
        );
      }

      let yList = [];
      let xList = [];

      if (this.turnoverComparisonList.length > 0) {
        for (let item of this.turnoverComparisonList) {
          xList.push(item.time);
          yList.push(item.saleMoney);
        }

        // Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，nextTick会保证其内的代码在DOM更新后执行
        this.$nextTick(() => {
          this.myTurnoverChart.resize();
          // 绘制图表
          this.myTurnoverChart.setOption(
            {
              // title: {
              //   text: "營業額對比",
              //   x: "center"
              // },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: "line" // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: "2%", //默认10%
                right: "3%", //默认10%
                bottom: "0", //默认60
                containLabel: true
                //grid区域是否包含坐标轴的刻度标签
              },
              xAxis: {
                data: xList
              },
              // name: "營業額(" + this.currencyGlobal + ")",
              yAxis: {
                name: this.currencyGlobal,
                type: "value"
              },
              series: [
                {
                  name: "營業額",
                  type: "bar",
                  data: yList,
                  barWidth: 20,
                  itemStyle: {
                    color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: "#3B64D8" },
                      { offset: 1, color: "#85A5FF" }
                    ])
                  }
                }
              ]
            },
            true
          );
          window.addEventListener("resize", () => {
            this.myTurnoverChart.resize();
          });
          this.myTurnoverChart.on("click", params => {
            this.isCheckEvery = 1;
            console.log(params);
            this.selName = params.name;
            this.turnoverTotal = params.data;

            for (let item of this.salesCostComparisonList) {
              if (item.time == this.selName) {
                this.costTotal = item.profit;
              }
            }

            for (let item of this.salesNumComparisonList) {
              if (item.time == this.selName) {
                this.numTotal = item.salesVolume;
              }
            }
          });
        });
      }
    },
    // 銷售利潤對比
    salesCostData() {
      if (!this.mySalesCostChart) {
        this.mySalesCostChart = $echarts.init(
          document.getElementById("salesCostChart")
        );
      }

      let yList = [];
      let xList = [];

      if (this.salesCostComparisonList.length > 0) {
        for (let item of this.salesCostComparisonList) {
          xList.push(item.time);
          yList.push(item.profit);
        }

        // Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，nextTick会保证其内的代码在DOM更新后执行
        this.$nextTick(() => {
          this.mySalesCostChart.resize();
          // 绘制图表
          this.mySalesCostChart.setOption(
            {
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: "line" // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: "2%", //默认10%
                right: "3%", //默认10%
                bottom: "0", //默认60
                containLabel: true
                //grid区域是否包含坐标轴的刻度标签
              },
              xAxis: {
                data: xList
              },
              yAxis: {
                name: this.currencyGlobal,
                type: "value"
              },
              series: [
                {
                  name: "利潤",
                  type: "bar",
                  data: yList,
                  barWidth: 20,
                  itemStyle: {
                    color: res => {
                      if (res.value > 0) {
                        return new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: "#E24A79" },
                          { offset: 1, color: "#FF81A8" }
                        ]);
                      } else {
                        return new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: "#FF81A8" },
                          { offset: 1, color: "#E24A79" }
                        ]);
                      }
                    }
                  }
                }
              ]
            },
            true
          );
          window.addEventListener("resize", () => {
            this.mySalesCostChart.resize();
          });
        });
      }
    },
    // 銷售數量對比
    salesNumberData() {
      if (!this.mySalesNumChart) {
        this.mySalesNumChart = $echarts.init(
          document.getElementById("salesNumberChart")
        );
      }

      let yList = [];
      let xList = [];

      if (this.salesNumComparisonList.length > 0) {
        for (let item of this.salesNumComparisonList) {
          xList.push(item.time);
          yList.push(item.salesVolume);
        }

        // Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，nextTick会保证其内的代码在DOM更新后执行
        this.$nextTick(() => {
          this.mySalesNumChart.resize();
          // 绘制图表
          this.mySalesNumChart.setOption(
            {
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: "line" // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: "2%", //默认10%
                right: "3%", //默认10%
                bottom: "0", //默认60
                containLabel: true
                //grid区域是否包含坐标轴的刻度标签
              },
              xAxis: {
                data: xList
              },
              yAxis: {
                name: "銷量",
                type: "value"
              },
              series: [
                {
                  name: "銷量",
                  type: "bar",
                  data: yList,
                  barWidth: 20,
                  itemStyle: {
                    color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: "#0DB57E" },
                      { offset: 1, color: "#27DCA1" }
                    ])
                  }
                }
              ]
            },
            true
          );
          window.addEventListener("resize", () => {
            this.mySalesNumChart.resize();
          });
        });
      }
    },

    // 查看售價歷史曲線
    salesPriceHistory(item) {
      console.log(item);
      this.dataSalesHistoryList = item.saleHisResList;
      let yList = [];
      let xList = [];

      if (this.dataSalesHistoryList.length > 0) {
        this.pageSel = 1;
        for (let item of this.dataSalesHistoryList) {
          xList.push(item.soldTime);
          yList.push(item.sellTotalHkPrice);
        }

        // Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，nextTick会保证其内的代码在DOM更新后执行
        this.$nextTick(() => {
          // 基于准备好的dom，初始化echarts实例
          let myChart = $echarts.init(document.getElementById("myPriceChart"));
          myChart.resize();
          // 绘制图表
          myChart.setOption({
            title: {
              text: "銷售價格歷史曲線圖",
              x: "center"
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "line" // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: "3%", //默认10%
              right: "4%", //默认10%
              bottom: "5%", //默认60
              containLabel: true
              //grid区域是否包含坐标轴的刻度标签
            },
            xAxis: {
              data: xList
            },
            yAxis: {
              name: "售價(" + this.currencyGlobal + ")",
              type: "value"
            },
            series: [
              {
                name: "售價",
                type: "line",
                data: yList
              }
            ]
          });

          window.addEventListener("resize", () => {
            myChart.resize();
          });
        });
      } else {
        this.$message.warning({
          message: "該商品暫無歷史售價"
        });
      }
    },
    // 獲取利潤top10數據
    getProfitTopMsg() {
      this.$axios
        .get(this.$store.state.baseUrl + "/profitTopMsgGet")
        .then(res => {
          console.log("利潤Top10商品列表");
          console.log(res);
          this.profitTopList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 獲取銷量top10數據
    getSalesVolumeTopMsg() {
      document.getElementById("salesVolumeContainer").scrollIntoView({
        behavior: "smooth"
      });
      let num = this.checkboxGroup.length - 1;
      this.$axios
        .get(this.$store.state.baseUrl + "/salesVolumesTopMsgGet?flag=" + num)
        .then(res => {
          console.log("銷量Top10商品列表");
          console.log(res);
          this.salesVolumeTopList = res.data;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    // 獲取對比數據
    getSalesComparison() {
      this.isCheckEvery = 0;
      this.$axios
        .get(
          this.$store.state.baseUrl +
          "/salesComparison?flag=" +
          this.comparisonData
        )
        .then(res => {
          console.log("對比數據");
          console.log(res);
          this.turnoverTotal = res.data.allAnnualTurnover;
          this.costTotal = res.data.allAnnualProfit;
          this.numTotal = res.data.allAnnualSalesVolume;

          this.turnoverComparisonList = res.data.annualTurnoverList;
          this.salesCostComparisonList = res.data.annualProfitList;
          this.salesNumComparisonList = res.data.annualSalesVolumeList;
          this.turnoverData();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 獲取統計數據
    getStatisticsData() {
      this.$axios
        .get(this.$store.state.baseUrl + "/overStockGoodsCensus")
        .then(res => {
          console.log("統計數據");
          console.log(res);
          this.statisticsList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 合計
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合計";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          console.log(sums);
        }
      });
      sums[2] = this.formatNumberRgx(sums[2]);

      return sums;
    },
    // tabs切換
    handleTabsClick() {
      if (this.activeName == "second") {
        this.checkboxGroup = ["包款"];
        this.getSalesVolumeTopMsg();
      }
    },
    // checkbox切換
    checkboxChange(e) {
      console.log(e);
      this.loading = true;
      if (e == 0) {
        this.checkboxGroup = ["包款"];
      } else if (e == 1) {
        this.checkboxGroup = ["包款", "大小"];
      } else if (e == 2) {
        this.checkboxGroup = ["包款", "大小", "材質"];
      } else if (e == 3) {
        this.checkboxGroup = ["包款", "大小", "材質", "金屬質感"];
      } else if (e == 4) {
        this.checkboxGroup = ["包款", "大小", "材質", "金屬質感", "顏色"];
      }

      this.getSalesVolumeTopMsg();
    },
    goback(val) {
      console.log("頁面選擇", val);
      this.pageSel = val;
      this.getSalesComparison();
    },
    // 數據對比
    dataComparison() {
      this.chartRadio = 1;
      this.getSalesComparison();
    }
  }
};
</script>

<style lang="scss" scoped>
.sales-report-container {
  margin-top: 20px;
  display: flex;

  .container-left {
    width: 70%;
    margin-right: 20px;

    .comparison-top {
      display: flex;
      justify-content: space-between;

      .mian-every {
        width: 29%;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        border-radius: 6px;

        .every-left {
          .left-title span {
            vertical-align: bottom;
            font-size: 14px;
          }

          .left-num {
            margin-top: 10px;
            font-size: 24px;
            font-weight: bold;
          }
        }

        .every-img {
          padding: 13px 14px;
          background-color: rgba(61, 129, 253, 0.14);
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 31px;
            height: 33px;
          }
        }

        .every-title {
          color: #666;
          font-size: 14px;
        }

        .every-num {
          margin-top: 14px;
          color: #409eff;
          font-size: 28px;
        }
      }
    }

    .container-main {
      margin-top: 20px;
      padding: 20px;
      background-color: #fff;
      border-radius: 6px;

      .main-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .container-bottom {
      margin-top: 20px;
      padding: 20px;
      background-color: #fff;
      border-radius: 6px;
    }

    .bottom-main {
      max-height: 400px;
      overflow-y: scroll;
    }

    .bottom-main::-webkit-scrollbar {
      display: none;
    }
  }

  .container-right {
    width: 30%;

    .right-container {
      padding: 25px 20px 25px;
      margin-bottom: 20px;
      background-color: #fff;
      border-radius: 6px;

      .total-stock-num {
        width: fit-content;
        padding: 12px 11px;
        margin: 0 auto;
        background-color: #e6efff;
        border-radius: 6px;
        font-size: 16px;

        .stock-num {
          font-weight: bold;
        }
      }
    }
  }

  .echarts-title {
    padding: 20px 0 0 30px;
    color: #666;
    font-size: 14px;
  }
}

.back-style {
  margin-top: 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 6px;
}

.top-title {
  text-align: left;

  .title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }

  .line {
    width: 20px;
    height: 2px;
    margin-top: 14px;
    margin-bottom: 20px;
    background-color: #3d81fd;
  }
}
</style>
<style lang="scss">
#salesReportContainer {
  .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    color: #000;
  }

  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: #000;
  }

  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    color: #fff;
    background-color: #3d81fd;
    border-color: #3d81fd;
  }

  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #fff;
    background-color: #3d81fd;
    border-color: #3d81fd;
  }
}

#selfTable {

  .el-table__footer-wrapper tbody td,
  .el-table__header-wrapper tbody td {
    background-color: #fff;
    color: #000;
    font-weight: bold;
  }

  .el-table__footer-wrapper td {
    border-top: 1px solid #f4f4f4;
  }

  .el-table--border:after,
  .el-table--group:after,
  .el-table:before {
    background-color: #fff;
  }

  .el-table td {
    padding: 10px 0;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #f4f4f4;
  }

  .el-table--border th,
  .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #f4f4f4;
  }

  .el-table--border td,
  .el-table--border th {
    border-right: 1px solid #f4f4f4;
  }

  .el-table th {
    background-color: #f0f5ff;
    font-size: 14px;
  }

  .el-table {
    color: #000;
  }

  .el-table thead {
    color: #000;
  }
}

.main-top-right {
  .el-input__inner {
    height: 36px !important;
    line-height: 36px !important;
    color: #3d81fd;
    border: 1px solid #3d81fd;
  }

  .el-input__inner:hover {
    border: 1px solid #3d81fd;
  }

  .el-select .el-input .el-select__caret {
    color: #3d81fd;
  }

  .el-input__icon {
    line-height: 36px !important;
  }
}

#top10Change {
  .el-input__inner {
    height: 20px !important;
    line-height: 20px !important;
    padding: 0;
    color: #000;
    border: none;
    font-size: 18px;
    font-weight: bold;
  }

  .el-input__inner:hover {
    border: none;
  }

  .el-select .el-input .el-select__caret {
    color: #000;
    font-size: 18px;
  }

  .el-input__icon {
    line-height: 20px !important;
  }
}
</style>
