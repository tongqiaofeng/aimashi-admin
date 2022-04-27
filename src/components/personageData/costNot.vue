<template>
  <div style="margin-top: -20px;overflow: hidden;" id="onsaleContainer">
    <div class="onsale-container">
      <!-- 成本未录入 -->
      <div v-if="pageSel == 0">
        <el-table :data="onSaleProducts" style="width: 100%" border>
          <el-table-column align="center" prop="productCode" label="货号">
          </el-table-column>
          <el-table-column align="center" prop="pic" label="图片">
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
          <el-table-column align="center" prop="name" label="商品信息">
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
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="editProduct(scope.row.id)"
                  >编辑</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:15px;text-align: right;">
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
      page: 1,
      pagesize: 10,
      total: 0,

      delId: 0,
      updateId: 0,
      onSaleProducts: []
    };
  },
  created() {
    this.searchProducts();
  },
  methods: {
    goback(val) {
      this.pageSel = val;
    },
    // 编辑
    editProduct(id) {
      this.updateId = id;
      this.pageSel = 1;

      document
        .getElementById("onsaleContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    // 编辑成功
    updateSuccess(val) {
      this.pageSel = val;
      this.searchProducts();
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

      document
        .getElementById("onsaleContainer")
        .scrollIntoView({ behavior: "smooth" });
    },
    radioChange() {
      this.page = 1;
      this.searchProducts();
    },
    // 不足六位数补0
    PrefixInteger(num) {
      return (Array(6).join("0") + num).slice(-6);
    },
    // 利润计算
    money(x, y) {
      console.log(x, y);
      let money = y - x;
      return this.formatNumberRgx(money);
    },

    // 模糊查询
    searchProducts() {
      console.log("ffff222");
      this.$axios
        .get(
          this.$store.state.baseUrl +
            "/noPriceList?page=" +
            this.page +
            "&pageNum=10&flag=1"
        )
        .then(res => {
          console.log(res);
          this.onSaleProducts = res.data.list;
          this.total = res.data.total;
          console.log(this.onSaleProducts);
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

  .onsale-top {
    margin-top: 38px;
  }

  .th-style {
    width: 100px;
    margin-right: 100px;
    font-size: 18px;
  }
}
</style>
