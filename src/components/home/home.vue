<template>
  <div class="container">
    <el-container class="container">
      <el-container class="container">
        <el-aside class="aside" style="width:16%;min-height:1460px;">
          <div class="aside-container">
            <div class="aside-top">爱马仕包包</div>
            <div class="aside-top-admin">后台管理系统</div>
            <ul class="person-ul">
              <li class="person-li">
                <div style="display: flex;line-height:20px;">
                  <img class="icon icon-size" src="../../assets/imgs/person.png" />
                  <span class="icon" style="color:#fff;" @click="closeAndOpen($event)">个人数据</span>
                  <i id="arrows" class="el-icon-arrow-up"></i>
                </div>
                <ul id="openOrClose" class="open">
                  <li @click="selected1($event)" ref="onsale" class="font" style="color:#0aa1ed;">在售商品</li>
                  <li @click="selected2($event)" ref="sold" class="font">已售商品</li>
                  <li @click="selected3($event)" ref="export" class="font">导出数据</li>
                </ul>
              </li>
              <li @click="selected4($event)">
                <div style="display: flex;line-height:20px;">
                  <img class="icon icon-size" src="../../assets/imgs/exportProduct.png" />
                  <span class="publish icon" ref="publish">发布商品</span>
                </div>
              </li>
            </ul>
            <canvas id="canvas"></canvas>
          </div>
          <ul class="bg-bubbles">
            <li v-for="(item, index) in bubbles" :key="index"></li>
          </ul>
        </el-aside>
        <el-main class="main">
          <el-col :span="24" class="main-top">
            <el-row>
              <div class="main-top-left">
                <span style="cursor:pointer;" class="first-fint-size" @click="jump">首页</span>
                <span style="font-size:12px;line-height:2.3">
                  <span v-if="selected==1" class="fint-size">
                    <i class="el-icon-arrow-right"></i>个人数据
                    <i class="el-icon-arrow-right"></i>在售商品
                  </span>
                  <span v-if="selected==2" class="fint-size">
                    <i class="el-icon-arrow-right"></i>个人数据
                    <i class="el-icon-arrow-right"></i>已售商品
                  </span>
                  <span v-if="selected==3" class="fint-size">
                    <i class="el-icon-arrow-right"></i>个人数据
                    <i class="el-icon-arrow-right"></i>数据导出
                  </span>
                  <span v-if="selected==4" class="fint-size">
                    <i class="el-icon-arrow-right"></i>发布商品
                  </span>
                </span>
              </div>
              <div class="main-top-right">
                <span style="font-weight:bold;font-size:22px;">
                  您好，{{this.$store.state.currentRole=='admin'?'管理员':(this.$store.state.currentRole=='peer'?'同行':'')}}!
                </span>
              </div>
            </el-row>
          </el-col>
          <el-col :span="24" style="position:absolute;top:100px;left:16%;">
            <div>
              <onSale v-show="selected==1"></onSale>
              <sold v-show="selected==2"></sold>
              <export v-show="selected==3"></export>
              <publish v-show="selected==4"></publish>
            </div>
          </el-col>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        msg: '我是home组件',
        selected: 1,
        breadList: [],
        actives: '1-1',
        bubbles: []
      }
    },
    created() {
      this.getBreadList();
      this.bubbles.length = 10;
    },
    methods: {
      // 侧边栏
      closeAndOpen(e) {
        console.log('5555');
        let openOrClose = document.getElementById('openOrClose');
        let arrows = e.target.nextElementSibling;
        console.log(arrows);
        if (openOrClose.className == 'close') {
          openOrClose.className = 'open';
          arrows.className = 'el-icon-arrow-up';
        } else if (openOrClose.className == 'open') {
          openOrClose.className = 'close';
          arrows.className = 'el-icon-arrow-down';
        }
      },
      getBreadList() {
        for (let routeInfo of this.$route.matched) {
          console.log(routeInfo);
          if (typeof routeInfo.name === 'string' && routeInfo.name !== 'home') {
            this.breadList.push(routeInfo.name);
          }
        }
      },
      jump() {
        this.selected1();
      },
      selected1() {
        this.selected = 1;
        this.$refs.onsale.style.color = "#0aa1ed";
        this.$refs.sold.style.color = '#fff';
        this.$refs.export.style.color = '#fff';
        this.$refs.publish.style.color = '#fff';
      },
      selected2(e) {
        this.selected = 2;
        e.target.style.color = "#0aa1ed";
        console.log('222');
        this.$refs.onsale.style.color = '#fff';
        this.$refs.export.style.color = '#fff';
        this.$refs.publish.style.color = '#fff';
      },
      selected3(e) {
        this.selected = 3;
        e.target.style.color = "#0aa1ed";
        this.$refs.onsale.style.color = '#fff';
        this.$refs.sold.style.color = '#fff';
        this.$refs.publish.style.color = '#fff';
      },
      selected4(e) {
        this.selected = 4;
        e.target.style.color = "#0aa1ed";
        this.$refs.onsale.style.color = '#fff';
        this.$refs.sold.style.color = '#fff';
        this.$refs.export.style.color = '#fff';
      },

    },
  }

</script>
<style lang="scss">
  .aside {
    width: 16%;
    padding-top: 20px;
    background: url('../../assets/imgs/onsale.png') no-repeat;

    ul li {
      margin-top: 60px;
      list-style: none;
      cursor: pointer;
      color: #fff;
    }

    .aside-container {
      position: absolute;
      z-index: 999;

      .aside-top,
      .aside-top-admin {
        font-size: 28px;
        color: #fff;
        text-align: center;
        line-height: 36px;
      }

      .aside-top {
        padding: 0 60px;
      }

      .aside-top-admin {
        padding: 0 50px;
      }

      .person-ul {
        margin-left: 35px;

        .icon {
          margin-right: 20px;
          font-size: 22px;
        }

        .icon-size {
          width: 20px;
          height: 20px;
        }

        .font {
          font-size: 20px;
        }
      }

    }
  }

  .close {
    display: none;
  }

  .open {
    display: block;
  }

  .main {
    padding: 0;
    margin: 0;

    .main-top {
      height: 100px;
      padding-left: 40px;
      line-height: 100px;
      border-bottom: 1px solid #dedede;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      .main-top-left {
        position: absolute;
        top: 30px;
        left: 0;
        display: flex;
        line-height: 2;

        .first-fint-size {
          font-size: 18px;
        }

        .fint-size {
          font-size: 16px;
          color: #aaa;
        }
      }

      .main-top-right {
        position: absolute;
        top: 0;
        right: 96px;
      }
    }
  }

</style>
<style lang="scss" scoped>
  .bg-bubbles {
    position: absolute;
    // 使气泡背景充满整个屏幕
    bottom: 0;
    left: 0;
    width: 16%;
    min-height: 1460px;
    z-index: 1;

    li {
      position: absolute;
      // bottom 的设置是为了营造出气泡从页面底部冒出的效果；
      bottom: -160px;
      // 默认的气泡大小；
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      list-style: none;
      // 使用自定义动画使气泡渐现、上升和翻滚；
      animation: square 30s infinite;
      transition-timing-function: linear;
    }

    // 分别设置每个气泡不同的位置、大小、透明度和速度，以显得有层次感；
    li:nth-child(1) {
      left: 10%;
    }

    li:nth-child(2) {
      left: 20%;
      width: 90px;
      height: 90px;
      animation-delay: 2s;
      animation-duration: 7s;
    }

    li:nth-child(3) {
      left: 25%;
      animation-delay: 4s;
    }

    li:nth-child(4) {
      left: 40%;
      width: 60px;
      height: 60px;
      animation-duration: 8s;
      background-color: rgba(255, 255, 255, 0.3);
    }

    li:nth-child(5) {
      left: 70%;
    }

    li:nth-child(6) {
      left: 80%;
      width: 120px;
      height: 120px;
      animation-delay: 3s;
      background-color: rgba(255, 255, 255, 0.2);
    }

    li:nth-child(7) {
      left: 32%;
      width: 160px;
      height: 160px;
      animation-delay: 2s;
    }

    li:nth-child(8) {
      left: 55%;
      width: 20px;
      height: 20px;
      animation-delay: 4s;
      animation-duration: 15s;
    }

    li:nth-child(9) {
      left: 25%;
      width: 10px;
      height: 10px;
      animation-delay: 2s;
      animation-duration: 12s;
      background-color: rgba(255, 255, 255, 0.3);
    }

    li:nth-child(10) {
      left: 85%;
      width: 160px;
      height: 160px;
      animation-delay: 5s;
    }

    // 自定义 square 动画；
    @keyframes square {
      0% {
        opacity: 0.75;
        transform: translateY(400px) rotate(45deg);
      }

      100% {
        opacity: 0;
        transform: translateY(-1000px) rotate(180deg);
      }
    }
  }

</style>
