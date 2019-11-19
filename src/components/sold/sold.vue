<template>
  <div @keydown="keyLogin()">
    <div class="onsale-top">
      <el-radio-group v-model="self">
        <el-radio :label="0" class="onsale-top-radio">查看所有人发布的商品</el-radio>
        <el-radio :label="1" class="onsale-top-radio">仅查看自己发布的商品</el-radio>
      </el-radio-group>
      <input placeholder="输入包款,大小,材质,色号,货号可搜索,如:H000001、000001、1" class="el-input__inner" v-model="searchKey"
        @input="searchProducts" />
    </div>
    <table border="0" cellspacing="0" cellpadding="0" width="84%">
      <tr align="center">
        <th class="th-style">货号</th>
        <th class="th-style">图片</th>
        <th class="th-style">账单号</th>
        <th class="th-style">客户名称</th>
        <th class="th-style">出库时间</th>
        <th class="th-style">商品信息</th>
        <th class="th-style">成本价</th>
        <th class="th-style">出库价</th>
        <th class="th-style">利润</th>
        <th class="th-style">在库时长</th>
      </tr>
      <tr v-show="onSaleProducts.length==0">
        <div style="width:100%;margin:100px 315%;font-size:20px;color:#ddd;">没有数据要展示哦~</div>
      </tr>
      <tr v-for="(item,index) in onSaleProducts" :key="index" align="center">
        <td>H{{PrefixInteger(item.id)}}</td>
        <td>
          <img :src="item.pics.split('|')[0]" style="width:100px;height:100px;object-fit:cover;" />
        </td>
        <td>HS{{PrefixInteger(item.id)}}</td>
        <td>{{item.customer}}</td>
        <td>{{item.soldTime}}</td>
        <td>{{item.name}}</td>
        <td>{{moneys(item.currencyId)+item.cost}}</td>
        <td>{{moneys(item.currencyId)+item.priceTran}}</td>
        <td>{{moneys(item.currencyId)+money(item.cost,item.priceTran)}}</td>
        <td>{{timeLong(item.createTime)}}天</td>
      </tr>
    </table>
    <div style="margin:15px 0;position:absolute;right:20%;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
        layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: '我是已售商品页',
        searchKey: '',
        self: 1,
        page: 1,
        pagesize: 10,
        total: 0,
        onSaleProducts: [],
        myList: [],
      }
    },
    created() {
      this.handleList();
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page = val;
        console.log(this.page);
        this.handleList();
        this.smoothscroll();
      },
      smoothscroll() {
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - (currentScroll / 5));
        }
      },
      handleList() {
        console.log('mmmm' + this.page);
        this.$axios.get(this.$store.state.baseUrl + '/sold?self=' + this.self + '&page=' + this.page).then((res) => {
          console.log(res.data.list);
          // let a = res.data.list;
          // console.log(a);
          this.onSaleProducts = res.data.list;
          this.total = res.data.total;
          this.myList = res.data.list;
          console.log(this.onSaleProducts);
          console.log(this.onSaleProducts[0].bill);
          console.log(this.onSaleProducts[0].currencyId);
        }).catch(err => {
          console.log(err);
        })
      },
      // 计算时长
      timeLong(time) {
        let startTime = new Date(time); // 开始时间
        let endTime = new Date(); // 结束时间
        let times = Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24);
        return times
      },
      // 不足六位数补0
      PrefixInteger(num) {
        return (Array(6).join('0') + num).slice(-6);
      },
      // 币种判定
      moneys(money) {
        // console.log(money);
        if (money == 1) {
          return 'CNY';
        } else if (money == 2) {
          return 'HKD';
        } else if (money == 3) {
          return 'USD';
        } else if (money == 4) {
          return 'EUR';
        } else if (money == 5) {
          return 'GBP';
        } else if (money == 6) {
          return 'AUD';
        }
      },
      // 利润计算
      money(x, y) {
        console.log(x, y);
        let money = y - x;
        console.log(money);
        return money;
      },
      // 模糊查询
      searchProducts() {
        console.log('111');
        if (this.searchKey) {
          let rex = /^[0-9]+$/; //正则表达式
          let flag = rex.test(this.searchKey); //通过表达式进行匹配
          if (flag) {
            console.log('ffff222');
            this.$axios.post(this.$store.state.baseUrl + '/search?sold=1&self=' + this.self + '&or=1&page=' + this
              .page, {
                id: this.searchKey,
                size: this.searchKey,
                model: this.searchKey,
                leather: this.searchKey,
                colorId: this.searchKey,
                colorSeries: this.searchKey
              }).then((res) => {
              console.log(res);
              this.onSaleProducts = res.data.list;
              console.log(this.onSaleProducts);
            })
          } else if (!flag) {
            this.$axios.post(this.$store.state.baseUrl + '/search?sold=1&self=' + this.self + '&or=1&page=' + this
              .page, {
                id: -1,
                size: this.searchKey,
                model: this.searchKey,
                leather: this.searchKey,
                colorId: this.searchKey,
                colorSeries: this.searchKey
              }).then((res) => {
              console.log('1111' + res);
              this.onSaleProducts = res.data.list;
              console.log(this.onSaleProducts);
            })
          }
        } else {
          this.onSaleProducts = this.myList;
        }
      },
      keyLogin() {
        if (event.keyCode == 13) {
          this.searchProducts();
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
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
    margin-bottom: 55px;
    margin-left: 40px;

    .onsale-top-radio {
      margin-right: 80px;
      font-size: 16px;
      color: #000;
    }

    .el-input__inner {
      width: 600px;
      height: 48px;
      position: absolute;
      top: 20px;
      right: 450px;
      -webkit-appearance: none;
      background-color: #FFF;
      background-image: url('../../assets/imgs/search2.png');
      background-size: 20px;
      background-repeat: no-repeat;
      background-position: 30px center;
      border-radius: 30px;
      border: 1px solid #DCDFE6;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: inherit;
      line-height: 40px;
      outline: 0;
      padding: 0 65px;
      -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
      transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
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
