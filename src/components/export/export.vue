<template>
  <div class="export-container">
    <div v-if="this.$store.state.currentRole == 'admin'" class="seller-style">
      <span style="margin-right:8.6%;">卖家</span>
      <el-select v-model="seller" placeholder="请选择" @focus="sellerUsername" width="100%">
        <el-option v-for="item in sellerList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
    </div>
    <div class="create-time-style">
      <span>入库时间</span>
      <div class="create">
        <el-date-picker v-model="in1" type="datetime" placeholder="开始日期时间" class="create-time-input-style1">
        </el-date-picker>
        <span class="create-time-span-style">至</span>
        <el-date-picker v-model="in2" type="datetime" placeholder="结束日期时间" class="create-time-input-style2">
        </el-date-picker>
      </div>
    </div>
    <div class="create-time-style">
      <span>出库时间</span>
      <div class="create">
        <el-date-picker v-model="out1" type="datetime" placeholder="开始日期时间" class="create-time-input-style1">
        </el-date-picker>
        <span class="create-time-span-style">至</span>
        <el-date-picker v-model="out2" type="datetime" placeholder="结束日期时间" class="create-time-input-style2">
        </el-date-picker>
      </div>
    </div>
    <div class="export-button">
      <button @click="exportExcel" class="export-excel">导出数据</button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        sellerList: [],
        seller: '',
        in1: '',
        in2: '',
        out1: '',
        out2: ''
      }
    },
    created() {
      this.sellerList.push(sessionStorage.getItem('username'));
    },
    methods: {
      // 获取卖家用户名
      sellerUsername() {
        this.$axios.get(this.$store.state.baseUrl + '/clients').then((res) => {
          console.log(res);
          for(let item of res.data){
            this.sellerList.push(item);
          }
          console.log(this.sellerList);
        })
      },
      // 时间转换
      transitionTime(time) {
        if (time) {
          let date = new Date(time);
          console.log('MMM' + date);
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          var d = date.getDate();
          var h = date.getHours();
          var m1 = date.getMinutes();
          var s = date.getSeconds();
          m = m < 10 ? ("0" + m) : m;
          d = d < 10 ? ("0" + d) : d;
          h = h < 10 ? ("0" + h) : h;
          m1 = m1 < 10 ? ("0" + m1) : m1;
          s = s < 10 ? ("0" + s) : s;
          console.log('qqq' + y + "-" + m + "-" + d + " " + h + ":" + m1 + ":" + s);
          return y + "-" + m + "-" + d + " " + h + ":" + m1 + ":" + s;
        }
      },
      // 导出Excel表格
      exportExcel() {
        this.in1 = this.transitionTime(this.in1);
        this.in2 = this.transitionTime(this.in2);
        this.out1 = this.transitionTime(this.out1);
        this.out2 = this.transitionTime(this.out2);

        this.$axios.get(this.$store.state.baseUrl + '/export?username=' + this.seller + '&in1=' + this
          .in1 + '&in2=' + this.in2 + '&out1=' + this.out1 + '&out2=' + this.out2, {
            responseType: 'blob'
          }).then((res) => {
          console.log(res.data)
          const link = document.createElement('a')
          let blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel'
          });
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob);
          let num = ''
          for (let i = 0; i < 10; i++) {
            num += Math.ceil(Math.random() * 10)
          }
          link.setAttribute('download', '商品数据_' + num + '.xlsx')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }).catch((err) => {
          console.log(err);
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  .export-container {
    margin-top: 60px;
    position: absolute;
    top: 0;
    left: 5%;

    .seller-style,
    .create-time-style {
      display: flex;
      margin-bottom: 30px;
    }

    .seller-style {
      .seller-input-style {
        width: 496px;
        height: 48px;
        padding-left: 20px;
        margin-left: 51px;
        border: 1px solid #ddd;
        border-radius: 10px;
        font-size: 16px;
        color: #c8c8c8;
      }

      .seller-input-style:focus {
        outline: 0;
        border-radius: 10px;
      }
    }

    .create-time-style {

      .create {
        height: 48px;
        line-height: 48px;

        .create-time-input-style1 {
          width: 210px;
          height: 48px;
          margin-left: 20px;
        }

        .create-time-span-style {
          margin-left: 30px;
          margin-right: 30px;
        }

        .create-time-input-style2 {
          width: 210px;
        }
      }

    }

    .export-button {
      margin-top: 40px;
      margin-left: 70%;

      .export-excel {
        width: 160px;
        height: 48px;
        background: url('../../assets/imgs/export.png') no-repeat;
        border: 0;
        border-radius: 10px;
        font-size: 15px;
        color: #fff;
        cursor: pointer;
      }

      .export-excel:focus {
        outline: 0;
      }
    }
  }

  input::-webkit-input-placeholder {
    color: #c8c8c8;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #c8c8c8;
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #c8c8c8;
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #c8c8c8;
  }

</style>
<style lang="scss">
  .el-input__inner {
    height: 48px;
    border-radius: 10px;
  }
</style>
