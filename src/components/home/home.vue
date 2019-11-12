<template>
  <div class="container">
    <el-container class="container">
      <el-container class="container">
        <el-aside class="aside">
          <el-row>
            <el-col :span="24">
              <el-menu :router=true class="el-menu-vertical-demo container" :default-active="actives">
                <el-submenu index="1" selected>
                  <template slot="title">
                    <i class="el-icon-s-fold"></i>
                    <span>个人数据</span>
                  </template>
                  <el-menu-item index="1-1" @click="selected1()">在售商品</el-menu-item>
                  <el-menu-item index="1-2" @click="selected2()">已售商品</el-menu-item>
                  <el-menu-item index="1-3" @click="selected3()">导出数据</el-menu-item>
                </el-submenu>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title" @click="selected4()">发布商品</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main class="main">
          <el-col :span="24">
            <el-row>
              <div style="position:absolute;left:10px;display:flex;line-height:2;">
                <span style="font-weight:bold;font-size:15px;cursor:pointer;" @click="jump">首页</span>
                <span style="font-size:13px;line-height:2.3">
                  <span v-if="selected==1">
                    <i class="el-icon-arrow-right"></i>个人数据
                    <i class="el-icon-arrow-right"></i>在售商品
                  </span>
                  <span v-if="selected==2">
                    <i class="el-icon-arrow-right"></i>个人数据
                    <i class="el-icon-arrow-right"></i>已售商品
                  </span>
                  <span v-if="selected==3">
                    <i class="el-icon-arrow-right"></i>个人数据
                    <i class="el-icon-arrow-right"></i>数据导出
                  </span>
                  <span v-if="selected==4">
                    <i class="el-icon-arrow-right"></i>发布商品
                  </span>
                </span>
              </div>
              <div style="position:absolute;top:5px;right:0;">
                <span>您好
                  <span
                    style="font-weight:bold;">{{this.$store.state.currentRole=='admin'?'管理员':(this.$store.state.currentRole=='peer'?'同行':'')}}
                    !</span>
                </span>
              </div>
            </el-row>
          </el-col>
          <el-col :span="24" style="position:absolute;top:100px;left:310px;">
            <div>
              <onSale v-if="selected==1"></onSale>
              <sold v-if="selected==2"></sold>
              <export v-if="selected==3"></export>
              <publish v-if="selected==4"></publish>
            </div>
          </el-col>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  // import { Provide, Component, Watch, Prop, Vue } from 'vue-property-decorator';
  export default {
    data() {
      return {
        msg: '我是home组件',
        selected: 1,
        breadsName: {
          '1': '个人数据',
          '1-1': '在售商品',
          '1-2': '已售商品',
          '1-3': '数据导出',
          '2': '商品发布'
        },
        breadList: [],
        actives: '1-1'
      }
    },
    created() {
      this.getBreadList();
    },
    // watch: {

    // },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      getBreadList() {
        for (let routeInfo of this.$route.matched) {
          console.log(routeInfo);
          if (typeof routeInfo.name === 'string' && routeInfo.name !== 'home') {
            this.breadList.push(routeInfo.name);
          }
        }
      },
      jump(){
        this.selected1();
      },
      selected1() {
        this.selected = 1;
      },
      selected2() {
        this.selected = 2;
      },
      selected3() {
        this.selected = 3;
      },
      selected4() {
        this.selected = 4;
      },
    },
    computed: {

    }
  }

</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    min-height: 850px;

    // display: flex;
    .el-col-24 {
      width: 80%;
    }

    .el-row {
      display: flex;
      justify-content: space-between;
    }

    .main {
      border-bottom: 1px solid #666;
    }

    .aside {
      height: 999px;


    }

  }

  .logOut {
    cursor: pointer;
  }


  .el-main {
    height: 70px;
    padding-left: 30px;
    padding-right: 0;
    padding-bottom: 0;
    margin-left: -45px;
  }

  .breadcrumb {
    // margin-bottom: 20px;
    position: absolute;
    top: 5px;
    left: 0;
  }

</style>
