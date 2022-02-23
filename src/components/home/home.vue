<template>
  <div class="container">
    <el-container class="container">
      <el-container class="container">
        <el-aside class="aside" style="width: 218px;min-height: 100vh;">
          <div class="aside-container">
            <div class="aside-one">
              <div class="aside-top">爱马仕包包</div>
              <div class="aside-top-admin">后台管理系统</div>
            </div>
            <ul class="person-ul">
              <li>
                <div
                  style="display: flex;justify-content: center;line-height:16px;"
                >
                  <img
                    class="icon"
                    style="width: 17px;height: 16px;"
                    src="../../assets/imgs/ge.png"
                  />
                  <span class="icon" style="color:#fff;" @click="closeAndOpen1"
                    >个人数据</span
                  >
                  <i id="arrows1" class="el-icon-arrow-up"></i>
                </div>
                <ul id="openOrClose1" class="open">
                  <li
                    @click="selected5"
                    ref="onWarehouse"
                    class="font"
                    style="background-color: #000;"
                  >
                    库存查询
                  </li>
                  <li @click="selected2" ref="sold" class="font">
                    已出售商品
                  </li>
                  <li @click="selected1" ref="onsale" class="font">
                    价格未录入
                  </li>
                  <li @click="selected3" ref="export" class="font">
                    导出数据
                  </li>
                </ul>
              </li>
              <li class="person-li" @click="selected4" ref="publish">
                <img
                  class="icon"
                  style="width: 17px;height: 16px;"
                  src="../../assets/imgs/fa.png"
                />
                <span class="publish icon">发布商品</span>
                <div style="width: 16px;"></div>
              </li>
              <li style=" margin-top: 30px;" v-show="role == 'admin'">
                <div
                  style="display: flex;justify-content: center;line-height:16px;"
                >
                  <img
                    class="icon"
                    style="width: 17px;height: 16px;"
                    src="../../assets/imgs/ge.png"
                  />
                  <span class="icon" style="color:#fff;" @click="closeAndOpen2"
                    >账单管理</span
                  >
                  <i id="arrows2" class="el-icon-arrow-down"></i>
                </div>
                <ul id="openOrClose2" class="close">
                  <li class="person-li" @click="selected6" ref="billEntry">
                    账单录入
                    <!-- <img
                      class="icon"
                      style="width: 17px;height: 16px;"
                      src="../../assets/imgs/fa.png"
                    />
                    <span class="publish icon">账单录入</span>
                    <div style="width: 16px;"></div> -->
                  </li>
                  <li class="person-li" @click="selected7" ref="billReport">
                    账单查询
                    <!-- <img
                      class="icon"
                      style="width: 17px;height: 16px;"
                      src="../../assets/imgs/search2.png"
                    />
                    <span class="publish icon">账单查询</span>
                    <div style="width: 16px;"></div> -->
                  </li>
                </ul>
              </li>
              <li
                class="person-li"
                @click="selected8"
                ref="companyAdmin"
                v-show="role == 'system_admin' || role == 'admin'"
              >
                <img
                  class="icon"
                  style="width: 17px;height: 16px;"
                  src="../../assets/imgs/fa.png"
                />
                <span class="publish icon">公司管理</span>
                <div style="width: 16px;"></div>
              </li>
              <li style=" margin-top: 30px;" v-show="role == 'admin'">
                <div
                  style="display: flex;justify-content: center;line-height:16px;"
                >
                  <img
                    class="icon"
                    style="width: 17px;height: 16px;"
                    src="../../assets/imgs/ge.png"
                  />
                  <span class="icon" style="color:#fff;" @click="closeAndOpen3"
                    >人員管理</span
                  >
                  <i id="arrows3" class="el-icon-arrow-down"></i>
                </div>
                <ul id="openOrClose3" class="close">
                  <li
                    class="person-li"
                    @click="selected9"
                    ref="departmentAdmin"
                  >
                    部門管理
                  </li>
                  <li class="person-li" @click="selected10" ref="userAdmin">
                    人員管理
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-main class="main">
          <el-col :span="24" class="main-top">
            <el-row>
              <div class="main-top-left">
                <span
                  style="cursor:pointer;"
                  class="first-fint-size"
                  @click="jump"
                  >首页</span
                >
                <span>
                  <span v-if="selected == 1" class="fint-size">
                    <i class="el-icon-arrow-right"></i>个人数据
                    <i class="el-icon-arrow-right"></i>价格未录入
                  </span>
                  <span v-if="selected == 2" class="fint-size">
                    <i class="el-icon-arrow-right"></i>个人数据
                    <i class="el-icon-arrow-right"></i>已出售商品
                  </span>
                  <span v-if="selected == 3" class="fint-size">
                    <i class="el-icon-arrow-right"></i>个人数据
                    <i class="el-icon-arrow-right"></i>数据导出
                  </span>
                  <span v-if="selected == 5" class="fint-size">
                    <i class="el-icon-arrow-right"></i>个人数据
                    <i class="el-icon-arrow-right"></i>库存查询
                  </span>
                  <span v-if="selected == 4" class="fint-size">
                    <i class="el-icon-arrow-right"></i>发布商品
                  </span>
                  <span v-if="selected == 6" class="fint-size">
                    <i class="el-icon-arrow-right"></i>账单管理
                    <i class="el-icon-arrow-right"></i>账单录入
                  </span>
                  <span v-if="selected == 7" class="fint-size">
                    <i class="el-icon-arrow-right"></i>账单管理
                    <i class="el-icon-arrow-right"></i>账单查询
                  </span>
                  <span v-if="selected == 8" class="fint-size">
                    <i class="el-icon-arrow-right"></i>公司管理
                  </span>
                  <span v-if="selected == 9" class="fint-size">
                    <i class="el-icon-arrow-right"></i>人員管理
                    <i class="el-icon-arrow-right"></i>部門管理
                  </span>
                  <span v-if="selected == 10" class="fint-size">
                    <i class="el-icon-arrow-right"></i>人員管理
                  </span>
                </span>
              </div>
              <div class="main-top-right">
                <span style="font-size:16px;">
                  您好{{
                    role == "admin"
                      ? "，管理员"
                      : role == "peer"
                      ? "，同行"
                      : ""
                  }}
                  !
                </span>
                <div class="logout" @click="logoutSure">退出登录</div>
              </div>
            </el-row>
          </el-col>
          <el-col :span="24" class="main-container">
            <div class="main-center">
              <onSale v-if="selected == 1"></onSale>
              <sold v-if="selected == 2"></sold>
              <export v-if="selected == 3"></export>
              <publish v-if="selected == 4"></publish>
              <warehouse v-if="selected == 5"></warehouse>
              <bill-entry v-if="selected == 6"></bill-entry>
              <bill-report v-if="selected == 7"></bill-report>
              <system-company-admin
                v-if="selected == 8 && role == 'system_admin'"
              ></system-company-admin>
              <company-admin
                v-if="selected == 8 && role == 'admin'"
              ></company-admin>
              <department-admin v-if="selected == 9"></department-admin>
              <user-admin v-if="selected == 10"></user-admin>
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
      selected: 5,
      role: ""
    };
  },
  created() {
    this.role = sessionStorage.getItem("role");
  },
  methods: {
    // 侧边栏
    closeAndOpen1() {
      if (openOrClose1.className == "close") {
        openOrClose1.className = "open";
        arrows1.className = "el-icon-arrow-up";
        this.selected5();
      } else if (openOrClose1.className == "open") {
        openOrClose1.className = "close";
        arrows1.className = "el-icon-arrow-down";
      }
      openOrClose2.className = "close";
      arrows2.className = "el-icon-arrow-down";
      openOrClose3.className = "close";
      arrows3.className = "el-icon-arrow-down";
    },
    closeAndOpen2() {
      if (openOrClose2.className == "close") {
        openOrClose2.className = "open";
        arrows2.className = "el-icon-arrow-up";
        this.selected6();
      } else if (openOrClose2.className == "open") {
        openOrClose2.className = "close";
        arrows2.className = "el-icon-arrow-down";
      }
      openOrClose1.className = "close";
      arrows1.className = "el-icon-arrow-down";
      openOrClose3.className = "close";
      arrows3.className = "el-icon-arrow-down";
    },
    closeAndOpen3() {
      if (openOrClose3.className == "close") {
        openOrClose3.className = "open";
        arrows3.className = "el-icon-arrow-up";
        this.selected9();
      } else if (openOrClose3.className == "open") {
        openOrClose3.className = "close";
        arrows3.className = "el-icon-arrow-down";
      }
      openOrClose1.className = "close";
      arrows1.className = "el-icon-arrow-down";
      openOrClose2.className = "close";
      arrows2.className = "el-icon-arrow-down";
    },
    jump() {
      if (openOrClose1.className == "close") {
        openOrClose1.className = "open";
        arrows1.className = "el-icon-arrow-up";
      }
      if (openOrClose2.className == "open") {
        openOrClose2.className = "close";
        arrows2.className = "el-icon-arrow-down";
      }
      this.selected5();
    },
    selected1() {
      this.selected = 1;
      this.$store.state.imgUrl = "";
      this.$store.state.imgUrl2 = "";

      this.$refs.onWarehouse.style.backgroundColor = "transparent";
      this.$refs.onsale.style.backgroundColor = "#000";
      this.$refs.export.style.backgroundColor = "transparent";
      this.$refs.publish.style.backgroundColor = "transparent";
      this.$refs.sold.style.backgroundColor = "transparent";
      this.$refs.billEntry.style.backgroundColor = "transparent";
      this.$refs.billReport.style.backgroundColor = "transparent";
      this.$refs.companyAdmin.style.backgroundColor = "transparent";
      this.$refs.departmentAdmin.style.backgroundColor = "transparent";
      this.$refs.userAdmin.style.backgroundColor = "transparent";

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
    selected2() {
      this.selected = 2;

      this.$refs.sold.style.backgroundColor = "#000";
      this.$refs.onWarehouse.style.backgroundColor = "transparent";
      this.$refs.onsale.style.backgroundColor = "transparent";
      this.$refs.export.style.backgroundColor = "transparent";
      this.$refs.publish.style.backgroundColor = "transparent";
      this.$refs.billEntry.style.backgroundColor = "transparent";
      this.$refs.billReport.style.backgroundColor = "transparent";
      this.$refs.companyAdmin.style.backgroundColor = "transparent";
      this.$refs.departmentAdmin.style.backgroundColor = "transparent";
      this.$refs.userAdmin.style.backgroundColor = "transparent";

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
    selected3() {
      this.selected = 3;
      this.$refs.onWarehouse.style.backgroundColor = "transparent";
      this.$refs.onsale.style.backgroundColor = "transparent";
      this.$refs.export.style.backgroundColor = "#000";
      this.$refs.publish.style.backgroundColor = "transparent";
      this.$refs.sold.style.backgroundColor = "transparent";
      this.$refs.billEntry.style.backgroundColor = "transparent";
      this.$refs.billReport.style.backgroundColor = "transparent";
      this.$refs.companyAdmin.style.backgroundColor = "transparent";
      this.$refs.departmentAdmin.style.backgroundColor = "transparent";
      this.$refs.userAdmin.style.backgroundColor = "transparent";
    },
    selected4() {
      this.selected = 4;
      this.$store.state.imgUrl = "";
      this.$store.state.imgUrl2 = "";

      this.$refs.onWarehouse.style.backgroundColor = "transparent";
      this.$refs.onsale.style.backgroundColor = "transparent";
      this.$refs.export.style.backgroundColor = "transparent";
      this.$refs.publish.style.backgroundColor = "#000";
      this.$refs.sold.style.backgroundColor = "transparent";
      this.$refs.billEntry.style.backgroundColor = "transparent";
      this.$refs.billReport.style.backgroundColor = "transparent";
      this.$refs.companyAdmin.style.backgroundColor = "transparent";
      this.$refs.departmentAdmin.style.backgroundColor = "transparent";
      this.$refs.userAdmin.style.backgroundColor = "transparent";

      openOrClose1.className = "close";
      arrows1.className = "el-icon-arrow-down";
      openOrClose2.className = "close";
      arrows2.className = "el-icon-arrow-down";

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
    selected5() {
      this.selected = 5;
      this.$refs.onWarehouse.style.backgroundColor = "#000";
      this.$refs.onsale.style.backgroundColor = "transparent";
      this.$refs.export.style.backgroundColor = "transparent";
      this.$refs.publish.style.backgroundColor = "transparent";
      this.$refs.sold.style.backgroundColor = "transparent";
      this.$refs.billEntry.style.backgroundColor = "transparent";
      this.$refs.billReport.style.backgroundColor = "transparent";
      this.$refs.companyAdmin.style.backgroundColor = "transparent";
      this.$refs.departmentAdmin.style.backgroundColor = "transparent";
      this.$refs.userAdmin.style.backgroundColor = "transparent";

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
    selected6() {
      this.selected = 6;

      this.$refs.billEntry.style.backgroundColor = "#000";
      this.$refs.onWarehouse.style.backgroundColor = "transparent";
      this.$refs.onsale.style.backgroundColor = "transparent";
      this.$refs.export.style.backgroundColor = "transparent";
      this.$refs.publish.style.backgroundColor = "transparent";
      this.$refs.sold.style.backgroundColor = "transparent";
      this.$refs.billReport.style.backgroundColor = "transparent";
      this.$refs.companyAdmin.style.backgroundColor = "transparent";
      this.$refs.departmentAdmin.style.backgroundColor = "transparent";
      this.$refs.userAdmin.style.backgroundColor = "transparent";

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
    selected7() {
      this.selected = 7;

      this.$refs.billEntry.style.backgroundColor = "transparent";
      this.$refs.onWarehouse.style.backgroundColor = "transparent";
      this.$refs.onsale.style.backgroundColor = "transparent";
      this.$refs.export.style.backgroundColor = "transparent";
      this.$refs.publish.style.backgroundColor = "transparent";
      this.$refs.sold.style.backgroundColor = "transparent";
      this.$refs.billReport.style.backgroundColor = "#000";
      this.$refs.companyAdmin.style.backgroundColor = "transparent";
      this.$refs.departmentAdmin.style.backgroundColor = "transparent";
      this.$refs.userAdmin.style.backgroundColor = "transparent";

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
    selected8() {
      this.selected = 8;

      this.$refs.billEntry.style.backgroundColor = "transparent";
      this.$refs.onWarehouse.style.backgroundColor = "transparent";
      this.$refs.onsale.style.backgroundColor = "transparent";
      this.$refs.export.style.backgroundColor = "transparent";
      this.$refs.publish.style.backgroundColor = "transparent";
      this.$refs.sold.style.backgroundColor = "transparent";
      this.$refs.billReport.style.backgroundColor = "transparent";
      this.$refs.companyAdmin.style.backgroundColor = "#000";
      this.$refs.departmentAdmin.style.backgroundColor = "transparent";
      this.$refs.userAdmin.style.backgroundColor = "transparent";

      openOrClose1.className = "close";
      arrows1.className = "el-icon-arrow-down";
      openOrClose2.className = "close";
      arrows2.className = "el-icon-arrow-down";

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
    selected9() {
      this.selected = 9;

      this.$refs.billEntry.style.backgroundColor = "transparent";
      this.$refs.onWarehouse.style.backgroundColor = "transparent";
      this.$refs.onsale.style.backgroundColor = "transparent";
      this.$refs.export.style.backgroundColor = "transparent";
      this.$refs.publish.style.backgroundColor = "transparent";
      this.$refs.sold.style.backgroundColor = "transparent";
      this.$refs.billReport.style.backgroundColor = "transparent";
      this.$refs.companyAdmin.style.backgroundColor = "transparent";
      this.$refs.departmentAdmin.style.backgroundColor = "#000";
      this.$refs.userAdmin.style.backgroundColor = "transparent";

      openOrClose1.className = "close";
      arrows1.className = "el-icon-arrow-down";
      openOrClose2.className = "close";
      arrows2.className = "el-icon-arrow-down";

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },
    selected10() {
      this.selected = 10;

      this.$refs.billEntry.style.backgroundColor = "transparent";
      this.$refs.onWarehouse.style.backgroundColor = "transparent";
      this.$refs.onsale.style.backgroundColor = "transparent";
      this.$refs.export.style.backgroundColor = "transparent";
      this.$refs.publish.style.backgroundColor = "transparent";
      this.$refs.sold.style.backgroundColor = "transparent";
      this.$refs.billReport.style.backgroundColor = "transparent";
      this.$refs.companyAdmin.style.backgroundColor = "transparent";
      this.$refs.departmentAdmin.style.backgroundColor = "transparent";
      this.$refs.userAdmin.style.backgroundColor = "#000";

      openOrClose1.className = "close";
      arrows1.className = "el-icon-arrow-down";
      openOrClose2.className = "close";
      arrows2.className = "el-icon-arrow-down";

      (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll);
          window.scrollTo(0, currentScroll - currentScroll / 5);
        }
      })();
    },

    // 退出登录
    logoutSure() {
      this.$router.push("/");
      this.$store.dispatch("setRole", null);
      sessionStorage.setItem("username", "");
      sessionStorage.setItem("role", "");
      sessionStorage.setItem("token", "");
    }
  }
};
</script>
<style lang="scss">
.el-message {
  z-index: 99999 !important;
}

.font-warp {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.container {
  width: 100%;

  .aside {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #282828;

    .open {
      padding-left: 0;
      text-align: center;

      li {
        height: 46px;
        line-height: 46px;
        margin-top: 20px;
        list-style: none;
        cursor: pointer;
        color: #fff;
      }
    }

    ul {
      padding-left: 0;
      text-align: center;

      li {
        list-style: none;
        cursor: pointer;
        color: #fff;
      }
    }

    .aside-container {
      height: 100%;

      .aside-one {
        height: 80px;
        display: flex;
        justify-content: center;
        flex-direction: column;

        .aside-top,
        .aside-top-admin {
          font-size: 18px;
          color: #fff;
          text-align: center;
        }
      }

      .person-ul {
        margin-top: 30px;

        .person-li {
          margin-top: 30px;
          height: 46px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .icon {
          margin-right: 20px;
          font-size: 18px;
        }

        .font {
          font-size: 14px;
        }
      }
    }
  }

  .main {
    margin-left: 218px;
    padding: 0;

    .main-top {
      height: 80px;
      padding-left: 40px;
      line-height: 80px;
      position: fixed;
      top: 0;
      left: 218px;
      right: 0;
      border-bottom: 1px solid #dedede;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      z-index: 3333;

      .main-top-left {
        display: flex;

        .first-fint-size {
          font-size: 16px;
        }

        .fint-size {
          font-size: 16px;
          color: #aaa;
        }
      }

      .main-top-right {
        display: flex;
        position: absolute;
        top: 0;
        right: 300px;

        .logout {
          margin-left: 20px;
          font-size: 16px;
          cursor: pointer;
        }
      }
    }

    .main-container {
      min-height: 100vh;
      padding: 0 10px;
      padding-top: 80px;
      z-index: 0;
      background-color: #fafdff;

      .onsale-top {
        margin-top: 38px;
        margin-left: 0;
      }

      table {
        background-color: #fff;

        tr > th {
          padding: 3px 0;
          line-height: 41px;
          background-color: #f6f6f6;
          font-size: 16px !important;
          font-weight: normal;
          color: #000;
        }

        tr > td {
          padding: 10px 0 !important;
          font-size: 14px !important;
        }

        /*设置奇数行颜色*/
        // tr:nth-child(odd) {
        //   background-color: #fff;
        // }

        /*设置偶数行颜色*/
        // tr:nth-child(even) {
        //   background-color: #f6f6f6;
        // }
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

.el-input-number .el-input__inner {
  text-align: left;
}

.el-dialog--center .el-dialog__footer {
  text-align: right;
}

.el-textarea__inner {
  min-height: 100px !important;
}

.el-dialog .el-dialog__body {
  max-height: 600px;
  overflow-y: auto;
}

.el-pagination button:disabled {
  color: #c0c4cc;
  background-color: transparent;
  cursor: not-allowed;
}

.el-pagination .btn-next,
.el-pagination .btn-prev {
  background: center center no-repeat transparent;
}

.el-pager li {
  background: transparent;
}

img {
  object-fit: cover;
}
</style>
