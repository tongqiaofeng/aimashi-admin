<template>
  <!-- 銷售報表 -->
  <div style="margin-top: -20px;overflow: hidden;" id="salesReportContainer">
    <div class="sales-report-container">
      <div v-show="pageSel == 0" class="back-style">
        <div style="text-align: right;">
          <el-button
            style="width: 100px;height: 34px;padding: 8px 22px;"
            type="primary"
            @click="dataComparison(2)"
            >數據對比</el-button
          >
          <el-button
            style="width: 100px;height: 34px;padding: 8px 22px;"
            type="primary"
            @click="dataComparison(3)"
            >數據統計</el-button
          >
        </div>

        <el-tabs
          style="margin-top: 20px;"
          type="border-card"
          v-model="activeName"
          @tab-click="handleTabsClick"
        >
          <el-tab-pane label="利潤TOP10" name="first">
            <el-table border :data="profitTopList" style="width: 1200px;">
              <el-table-column
                width="180px"
                align="center"
                prop="pics"
                label="圖片"
              >
                <template slot-scope="scope">
                  <div>
                    <img
                      style="width: 90px; height: 90px"
                      :src="scope.row.pic"
                    />
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
          </el-tab-pane>
          <el-tab-pane label="銷量TOP10" name="second">
            <el-checkbox-group
              size="medium"
              v-model="checkboxGroup"
              @change="checkboxChange"
            >
              <el-checkbox-button label="包款"></el-checkbox-button>
              <el-checkbox-button label="大小"></el-checkbox-button>
              <el-checkbox-button label="材質"></el-checkbox-button>
              <el-checkbox-button label="金屬質感"></el-checkbox-button>
              <el-checkbox-button label="顏色"></el-checkbox-button>
            </el-checkbox-group>
            <el-table
              border
              :data="salesVolumeTopList"
              style="margin-top: 20px;width: 1200px;"
            >
              <el-table-column
                width="180px"
                align="center"
                prop="pics"
                label="圖片"
              >
                <template slot-scope="scope">
                  <div>
                    <img
                      style="width: 90px; height: 90px"
                      :src="scope.row.pic"
                    />
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
                    <img
                      src="../../assets/imgs/certificate/line_img.png"
                      style="width: 20px;height: 20px;cursor: pointer;"
                      title="查看銷售價格歷史曲線圖"
                      @click="salesPriceHistory(scoped.row)"
                    />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="pageSel == 1" class="back-style">
        <div
          style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="goback(0)"
        >
          <img src="../../assets/imgs/goback.png" style="height: 21px;" />
          <p style="margin: 0;">返回</p>
        </div>
        <div>
          <!-- 700px -->
          <div
            id="myPriceChart"
            style="width: 100%;height: 75vh;margin-top: 20px;"
          ></div>
        </div>
      </div>
      <div v-if="pageSel == 2" class="back-style" style="padding: 10px;">
        <div style="display: flex;justify-content:space-between;">
          <div
            style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
            @click="goback(0)"
          >
            <img src="../../assets/imgs/goback.png" style="height: 21px;" />
            <p style="margin: 0;">返回</p>
          </div>
          <el-radio-group
            size="mini"
            v-model="comparisonData"
            @change="getSalesComparison"
          >
            <el-radio-button label="1">年</el-radio-button>
            <el-radio-button label="2">季度</el-radio-button>
            <el-radio-button label="3">月</el-radio-button>
          </el-radio-group>
        </div>
        <div class="comparison-top">
          <div class="top-title">關鍵數據</div>
          <div class="top-main">
            <div class="mian-every">
              <div class="every-title">總營業額</div>
              <div class="every-num">
                {{ formatNumberRgx(turnoverTotal) + " " + currencyGlobal }}
              </div>
            </div>
            <div class="mian-every">
              <div class="every-title">總銷售利潤</div>
              <div class="every-num">
                {{ formatNumberRgx(costTotal) + " " + currencyGlobal }}
              </div>
            </div>
            <div class="mian-every" style="border: none;">
              <div class="every-title">總銷售數量</div>
              <div class="every-num">{{ numTotal }}</div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div style="border: 1px solid #ccc;">
              <div class="echarts-title">
                營業額
              </div>
              <div id="turnoverChart" style="width: 100%;height: 600px;"></div>
            </div>
            <div style="border: 1px solid #ccc;">
              <div class="echarts-title">
                銷售利潤
              </div>
              <div id="salesCostChart" style="width: 100%;height: 600px;"></div>
            </div>
            <div style="border: 1px solid #ccc;">
              <div class="echarts-title">
                銷售數量
              </div>
              <div
                id="salesNumberChart"
                style="width: 100%;height: 600px;"
              ></div>
            </div>
            <!-- <div
              id="salesNumberChart"
              style="width: 100%;height: 600px;padding-top: 20px;border: 1px solid #ccc;"
            ></div> -->
          </div>
        </div>
      </div>
      <div v-if="pageSel == 3" class="back-style">
        <div
          style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="goback(0)"
        >
          <img src="../../assets/imgs/goback.png" style="height: 21px;" />
          <p style="margin: 0;">返回</p>
        </div>
        <div>
          <el-table :data="statisticsList" style="width: 100%" border key="1">
            <el-table-column
              prop="stockLocName"
              align="center"
              label="倉庫名稱"
            >
            </el-table-column>
            <el-table-column prop="stockNum" align="center" label="庫存數量">
            </el-table-column>
            <el-table-column prop="amount" align="center" label="庫存總金額">
              <template slot-scope="scope">
                <div>
                  {{ formatNumberRgx(scope.row.amount) + " " + currencyGlobal }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="overstockNum"
              align="center"
              label="積壓貨物數量"
            >
              <template slot-scope="scope">
                <div>
                  <el-button type="text" @click="checkProductNum(scope.row)">{{
                    scope.row.overstockNum
                  }}</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="pageSel == 4" class="back-style">
        <div
          style="width: 60px;margin-bottom: 20px;display: flex;justify-content:space-between;cursor: pointer;"
          @click="goback(3)"
        >
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
            <el-table-column align="center" prop="prop" label="内部图">
              <template slot-scope="scope">
                <div
                  v-if="
                    scope.row.privateImg !== '' && scope.row.privateImg !== null
                  "
                >
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.privatePic.trim()"
                    :preview-src-list="bigImg(scope.row.privateImg)"
                    :z-index="5000"
                  >
                  </el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="300px"
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
                  <el-button
                    style="margin-left: 3px;"
                    type="text"
                    @click="editProduct(scope.row)"
                    >查看詳情</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:15px;text-align: right;">
            <el-pagination
              @current-change="handleCurrentChangeSell"
              :current-page="page"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div v-if="pageSel == 5">
        <details-vue
          :updatesId="updateId"
          @goback="gobackAdd"
          @updateSuccess="updateSuccess"
        ></details-vue>
      </div>
    </div>
  </div>
</template>

<script>
import * as $echarts from "echarts";
import detailsVue from "../common/details.vue";
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
      stockLocId: null
    };
  },
  created() {
    this.currencyGlobal = sessionStorage.getItem("currencyGlobal");
    this.getProfitTopMsg();
  },
  methods: {
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
                    normal: {
                      color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#3B64D8" },
                        { offset: 1, color: "#85A5FF" }
                      ])
                    }
                  }
                }
              ]
            },
            true
          );
          window.addEventListener("resize", () => {
            this.myTurnoverChart.resize();
          });
        });
      }
    },
    // 銷售利潤對比
    salesCostData() {
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
                    normal: {
                      color: res => {
                        if (res.value > 0) {
                          return new $echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                              { offset: 0, color: "#E24A79" },
                              { offset: 1, color: "#FF81A8" }
                            ]
                          );
                        } else {
                          return new $echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                              { offset: 0, color: "#FF81A8" },
                              { offset: 1, color: "#E24A79" }
                            ]
                          );
                        }
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
                    normal: {
                      color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#0DB57E" },
                        { offset: 1, color: "#27DCA1" }
                      ])
                    }
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

      this.pageSel = 1;
      if (this.dataSalesHistoryList.length > 0) {
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
      let num = this.checkboxGroup.length - 1;
      this.$axios
        .get(this.$store.state.baseUrl + "/salesVolumesTopMsgGet?flag=" + num)
        .then(res => {
          console.log("銷量Top10商品列表");
          console.log(res);
          this.salesVolumeTopList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 獲取對比數據
    getSalesComparison() {
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
          this.salesCostData();
          this.salesNumberData();
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
      if (e.length < 2) {
        this.checkboxGroup = ["包款"];
      } else if (e.length == 2) {
        this.checkboxGroup = ["包款", "大小"];
      } else if (e.length == 3) {
        this.checkboxGroup = ["包款", "大小", "材質"];
      } else if (e.length == 4) {
        this.checkboxGroup = ["包款", "大小", "材質", "金屬質感"];
      } else if (e.length == 5) {
        this.checkboxGroup = ["包款", "大小", "材質", "金屬質感", "顏色"];
      }

      this.getSalesVolumeTopMsg();
    },
    goback(val) {
      console.log("頁面選擇", val);
      this.pageSel = val;
    },
    // 數據對比
    dataComparison(val) {
      this.pageSel = val;
      if (val == 2) {
        this.comparisonData = 1;
        this.$nextTick(() => {
          // 基于准备好的dom，初始化echarts实例
          this.myTurnoverChart = $echarts.init(
            document.getElementById("turnoverChart")
          );
          this.mySalesCostChart = $echarts.init(
            document.getElementById("salesCostChart")
          );
          this.mySalesNumChart = $echarts.init(
            document.getElementById("salesNumberChart")
          );
          this.getSalesComparison();
        });
      } else if (val == 3) {
        this.getStatisticsData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sales-report-container {
  margin-top: 20px;

  .back-style {
    padding: 10px;
    background-color: #fff;
    border-radius: 6px;
  }

  .comparison-top {
    width: 100%;
    margin: 10px 0;
    border: 1px solid #ccc;

    .top-title {
      padding: 12px 0 13px 20px;
      font-size: 16px;
      color: #666;
      background-color: #f2f2f2;
      border-bottom: 1px solid #ccc;
    }

    .top-main {
      display: flex;
      justify-content: space-between;

      .mian-every {
        width: 33.33333%;
        padding: 34px 40px;
        text-align: left;
        border-right: 1px solid #ccc;

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
  }

  .echarts-title {
    padding: 20px 0 0 30px;
    color: #666;
    font-size: 14px;
  }
}
</style>
<style lang="scss">
#salesReportContainer {
  .el-tabs--border-card
    > .el-tabs__header
    .el-tabs__item:not(.is-disabled):hover {
    color: #000;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #000;
  }

  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    color: #fff;
    background-color: #3d81fd;
    border-color: #3d81fd;
  }

  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
    background-color: #3d81fd;
    border-color: #3d81fd;
  }
}
</style>
