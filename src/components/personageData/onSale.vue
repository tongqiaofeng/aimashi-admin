<template>
  <div>
    <!-- 价格未录入 -->
    <div v-show="pageSel == 0">
      <div style="margin-top: 38px;margin-left: 10px;">
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
      </div>
      <table
        class="onsale-top"
        border="0"
        cellspacing="0"
        cellpadding="0"
        width="100%"
      >
        <tr align="center">
          <th class="th-style">货号</th>
          <th class="th-style">商品展示图</th>
          <th class="th-style">内部图</th>
          <th class="th-style">账单号</th>
          <th class="th-style">商品信息</th>
          <th class="th-style">总成本</th>
          <th class="th-style">同行价</th>
          <th class="th-style">散客价</th>
          <th class="th-style">在库时长</th>
          <th class="th-style">操作</th>
        </tr>
        <tr v-show="onSaleProducts.length == 0" align="center">
          <td colspan="10" style="font-size:20px;color:#ddd;">
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
          <td>{{ item.bill }}</td>
          <td>{{ item.name }}</td>
          <td>
            {{ "HKD " + formatNumberRgx(item.cost) }}
          </td>
          <td>
            {{ "HKD " + formatNumberRgx(item.pricePeer) }}
          </td>
          <td>
            {{ "HKD " + formatNumberRgx(item.priceIndi) }}
          </td>
          <td>{{ timeLong(item.createTime) }}</td>
          <td>
            <div style="width:130px;display:flex;justify-content: center;">
              <div>
                <el-button
                  type="text"
                  @click="editProduct(item.id)"
                  class="handle-button"
                  >编辑</el-button
                >
              </div>
            </div>
          </td>
        </tr>
      </table>

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
      page: 1,
      pagesize: 10,
      total: 0,
      userId: null,
      userList: [],

      delId: 0,
      updateId: 0,
      onSaleProducts: []
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    goback(val) {
      this.pageSel = val;
    },
    // 编辑
    editProduct(id) {
      this.updateId = id;
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
        .get(this.$store.state.baseUrl + "/userList")
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
      this.searchProducts();
    },
    // 计算时长
    timeLong(time) {
      if (time !== null && time !== "") {
        let startTime = new Date(time); // 开始时间
        let endTime = new Date(); // 结束时间
        let times =
          Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24) + " 天";
        return times;
      } else {
        return "-";
      }
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
            "&pageNum=10&userId=" +
            this.userId
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
.update-container {
  margin-top: 40px;
  margin-left: 40px;
  margin-bottom: 50px;

  .update-sure-button {
    width: 160px;
    height: 48px;
    margin-top: 30px;
    margin-left: 40%;
  }
}

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
.handle-button {
  color: #9695f3;
  font-size: 16px;
}
thead,
th,
td {
  font-weight: normal;
  padding: 5px 10px;
  margin-right: 100px;
}

tr {
  margin-top: 30px;
}

td {
  width: 100px;
  font-size: 16px;
}

.onsale-top {
  margin-top: 38px;
  // margin-left: 40px;

  .onsale-top-radio {
    margin-right: 80px;
    font-size: 16px;
    color: #000;
  }

  .el-input__inner {
    width: 670px;
    height: 48px;
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
  }
}

.th-style {
  width: 100px;
  margin-right: 100px;
  font-size: 18px;
}
</style>
<style lang="scss">
.el-upload--picture-card {
  width: 100px;
  height: 100px;
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

.el-pager li.active {
  color: #9695f3;
  cursor: pointer;
}
</style>
