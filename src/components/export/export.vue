<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="卖家：" v-if="this.$store.state.currentRole == 'admin'">
        <el-input v-model="seller" placeholder="请输入卖家用户名"></el-input>
      </el-form-item>
      <el-form-item label="入库时间">
        <el-date-picker v-model="createTime" type="datetimerange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出库时间">
        <el-date-picker v-model="soldTime" type="datetimerange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="tong">导出数据</el-button>
      </el-form-item>
    </el-form>
    <!-- <export-excel></export-excel> -->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        seller: '',
        createTime: [],
        soldTime: [],
        in1: '',
        in2: '',
        out1: '',
        put2: ''
      }
    },
    methods: {
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
      tong() {
        console.log(this.createTime);
        console.log(this.soldTime);
        this.in1 = this.transitionTime(this.createTime[0]);
        this.in2 = this.transitionTime(this.createTime[1]);
        this.out1 = this.transitionTime(this.soldTime[0]);
        this.out2 = this.transitionTime(this.soldTime[1]);

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
  .el-input {
    width: 27.5%;
  }

</style>
