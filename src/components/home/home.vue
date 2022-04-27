<template>
  <div class="home-container" id="home-container" @click="otherClick">
    <el-container ref="homePage">
      <el-header height="78px">
        <div class="main-top-right">
          <div class="left-con">
            <img
              src="../../assets/imgs/logo_white.png"
              style="width: 65px;height: 65px;object-fit: cover;"
            />
            <p class="left-font-one">愛馬仕後台管理系統</p>
          </div>
          <div style="display: flex;">
            <div class="right-div" @click="updateUserClick">
              <span class="span1">{{ username }}</span>
              <div class="span-img">
                <img src="../../assets/imgs/home/down.png" class="img-self" />
              </div>
            </div>
          </div>
          <div class="downbtn" v-if="updateUser == 1">
            <div class="logout-div" @click="logoutSure">
              <div class="logout-img">
                <img
                  src="../../assets/imgs/logOut.png"
                  style="width: 17px;height: 18px;"
                />
              </div>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="218px" :style="defaultHeight">
          <ul class="aside-ul-dad">
            <li class="dad-li" v-show="role != 'system_admin'">
              <div style="width: 100%;">
                <p class="dad-li-font">庫存管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="selectedPage(4)"
                  :style="{
                    backgroundColor: selected == 4 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 4"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 4 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/04.png"
                      />
                    </div>
                    <p class="center-font">商品入庫</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="selectedPage(5)"
                  :style="{
                    backgroundColor: selected == 5 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 5"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 5 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/01.png"
                      />
                    </div>
                    <p class="center-font">庫存查詢</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="selectedPage(2)"
                  :style="{
                    backgroundColor: selected == 2 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 2"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 2 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/sold.png"
                      />
                    </div>
                    <p class="center-font">已售商品</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="selectedPage(1)"
                  :style="{
                    backgroundColor: selected == 1 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 1"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 1 ? '-24px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/not.png"
                      />
                    </div>
                    <p class="center-font">售價未錄入</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="selectedPage(15)"
                  :style="{
                    backgroundColor: selected == 15 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 15"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 15 ? '-24px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/not.png"
                      />
                    </div>
                    <p class="center-font">成本未錄入</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="selectedPage(3)"
                  :style="{
                    backgroundColor: selected == 3 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 3"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 3 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/export.png"
                      />
                    </div>
                    <p class="center-font">導出數據</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
              </ul>
            </li>
            <li class="dad-li" v-show="role != 'system_admin'">
              <div style="width: 100%;">
                <p class="dad-li-font">銷售與寄賣</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="selectedPage(10)"
                  :style="{
                    backgroundColor: selected == 10 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 10"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 10 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/sales.png"
                      />
                    </div>
                    <p class="center-font">銷售開單</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="selectedPage(11)"
                  :style="{
                    backgroundColor: selected == 11 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 11"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 11 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/history.png"
                      />
                    </div>
                    <p class="center-font">銷售歷史</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>

                <li
                  class="son-li"
                  @click="selectedPage(13)"
                  :style="{
                    backgroundColor: selected == 13 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 13"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 13 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/sales.png"
                      />
                    </div>
                    <p class="center-font">新增寄賣</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="selectedPage(14)"
                  :style="{
                    backgroundColor: selected == 14 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 14"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 14 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/history.png"
                      />
                    </div>
                    <p class="center-font">寄賣記錄</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
              </ul>
            </li>
            <li class="dad-li" v-show="role != 'system_admin'">
              <div style="width: 100%;">
                <p class="dad-li-font">銷售報表</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="selectedPage(12)"
                  :style="{
                    backgroundColor: selected == 12 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 12"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 12 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/12.png"
                      />
                    </div>
                    <p class="center-font">銷售報表</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
              </ul>
            </li>
            <li class="dad-li" v-show="role == 'admin'">
              <div style="width: 100%;">
                <p class="dad-li-font">賬單管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="selectedPage(6)"
                  :style="{
                    backgroundColor: selected == 6 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 6"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 6 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/bill_add.png"
                      />
                    </div>
                    <p class="center-font">賬單錄入</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  class="son-li"
                  @click="selectedPage(7)"
                  :style="{
                    backgroundColor: selected == 7 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 7"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 7 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/search.png"
                      />
                    </div>
                    <p class="center-font">賬單查詢</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
              </ul>
            </li>
            <li
              class="dad-li"
              v-show="
                role == 'system_admin' ||
                  role == 'admin' ||
                  role == 'normal_admin'
              "
            >
              <div style="width: 100%;">
                <p class="dad-li-font">公司管理</p>
              </div>
              <ul class="aside-ul-son">
                <li
                  class="son-li"
                  @click="selectedPage(8)"
                  :style="{
                    backgroundColor: selected == 8 ? '#303e53' : 'transparent'
                  }"
                  v-show="isHeadCompanyAdmin != -1"
                >
                  <p class="son-li-line" v-if="selected == 8"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 8 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/company_admin.png"
                      />
                    </div>
                    <p class="center-font">公司管理</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
                <li
                  v-show="role == 'admin'"
                  class="son-li"
                  @click="selectedPage(9)"
                  :style="{
                    backgroundColor: selected == 9 ? '#303e53' : 'transparent'
                  }"
                >
                  <p class="son-li-line" v-if="selected == 9"></p>
                  <div
                    class="son-li-center"
                    :style="{ marginLeft: selected == 9 ? '-38px' : '32px' }"
                  >
                    <div class="center-img-div">
                      <img
                        class="center-img"
                        src="../../assets/imgs/home/08.png"
                      />
                    </div>
                    <p class="center-font">人員管理</p>
                  </div>
                  <div class="son-li-right">
                    <img
                      class="right-img"
                      src="../../assets/imgs/home/right.png"
                    />
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </el-aside>
        <el-main
          :style="defaultHeight"
          class="home-container-main"
          id="mainContainer"
        >
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
          <normal-admin
            v-if="selected == 8 && role == 'normal_admin'"
          ></normal-admin>
          <user-admin v-if="selected == 9"></user-admin>
          <sales-ticket-admin v-if="selected == 10"></sales-ticket-admin>
          <sales-history v-if="selected == 11"></sales-history>
          <sales-report v-if="selected == 12"></sales-report>
          <send-documents-add v-if="selected == 13"></send-documents-add>
          <send-documents-history
            v-if="selected == 14"
          ></send-documents-history>
          <cost-not v-if="selected == 15"></cost-not>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: 4,
      role: "",
      updateUser: 0,
      defaultHeight: {
        height: ""
      },
      isHeadCompanyAdmin: null,
      username: sessionStorage.getItem("username")
    };
  },
  created() {
    this.role = sessionStorage.getItem("role");
    this.isHeadCompanyAdmin = sessionStorage.getItem("isHeadCompanyAdmin");
    if (this.role == "system_admin") {
      this.selected = 8;
    }
    this.$nextTick(() => {
      if (this.role == "system_admin") {
        this.selectedPage(8);
      }
    });

    //页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
  methods: {
    //定义方法，获取高度减去头尾
    getHeight() {
      this.defaultHeight.height = window.innerHeight - 78 + "px";
    },
    selectedPage(sel) {
      this.$store.state.imgUrl = "";
      this.$store.state.imgUrl2 = "";
      this.selected = sel;
    },
    // 退出登录
    updateUserClick() {
      if (this.updateUser == 1) {
        this.updateUser = 0;
      } else if (this.updateUser == 0) {
        this.updateUser = 1;
      }
    },
    otherClick() {
      let e = e || window.event;
      let className = e.target.className;
      if (
        className !== "downbtn" &&
        className !== "right-div" &&
        className !== "span1" &&
        className !== "span-img" &&
        className !== "img-self"
      ) {
        if (this.updateUser == 1) {
          this.updateUser = 0;
        }
      }
    },

    // 退出登录
    logoutSure() {
      this.$router.push("/");
      this.$store.dispatch("setRole", null);
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setType", "");
      sessionStorage.setItem("username", "");
      sessionStorage.setItem("role", "");
      sessionStorage.setItem("token", "");
      sessionStorage.setItem("userId", null);
      sessionStorage.setItem("type", "");
      sessionStorage.setItem("companyId", "");
      sessionStorage.setItem("currencyGlobal", "");
      sessionStorage.setItem("isHeadCompanyAdmin", "");
    }
  }
};
</script>
<style lang="scss" scoped>
ul li {
  list-style: none;
  text-align: left;
  cursor: pointer;
}

ul li a {
  text-decoration: none;
}

.font {
  width: 57px;
  margin: 0;
  margin-right: 10px;
  font-size: 14px;
  line-height: 40px;
}

.update-nick {
  width: 390px;
  height: 38px;
  line-height: 38px;
  padding: 0;
  padding-left: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
  outline: none;
}

.home-container {
  height: 100%;
  position: relative;

  .main-top-right {
    width: 100%;
    height: 78px;
    position: relative;

    .left-con {
      position: absolute;
      left: 40px;
      display: flex;
      align-items: center;

      .left-font-one {
        margin: 0;
        margin-left: 15px;
        line-height: 78px;
        font-size: 23px;
        font-weight: 600;
        color: #fff;
      }
    }

    .right-div {
      // width: 150px;
      position: absolute;
      top: 0;
      right: 175px;
      height: 60px;
      line-height: 78px;
      padding: 0;

      display: flex;
      cursor: pointer;

      .span1 {
        display: inline-block;
        font-size: 18px;
        color: #fff;
        overflow: hidden;
        word-break: keep-all;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .span-img {
        img {
          width: 15px;
          margin-left: 10px;
        }
      }
    }

    .downbtn {
      width: 120px;
      height: 50px;
      padding: 0;
      line-height: 50px;
      position: absolute;
      top: 78px;
      right: 155px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 10px;
      z-index: 999;

      .logout-div {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        .logout-img {
          display: flex;
          align-items: center;
          margin-right: 5px;
        }

        span {
          font-size: 15px;
        }
      }
    }
  }

  .aside-ul-dad {
    padding: 30px 0 30px 10px;
    margin: 0;
    color: #fff;

    p {
      margin: 0;
    }

    .dad-li {
      margin-top: 30px;

      .dad-li-font {
        font-size: 12px;
        color: #6f84a8;
      }

      .aside-ul-son {
        padding: 20px 0 0 0;

        .son-li {
          height: 46px;
          line-height: 46px;
          padding-right: 20px;
          display: flex;
          justify-content: space-between;

          .son-li-line {
            width: 4px;
            height: 46px;
            background-color: #3d81fd;
          }

          .son-li-center {
            display: flex;

            .center-img-div {
              padding-top: 3px;
              margin-right: 10px;

              .center-img {
                width: 18px;
                height: 18px;
              }
            }

            .center-font {
              font-size: 14px;
              color: #b7bdc6;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.handle-button {
  color: #409eff;
  font-size: 15px;
}

.el-message {
  z-index: 99999 !important;
}

.font-warp {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  // overflow: hidden;
  // text-overflow: ellipsis;
  // display: -webkit-box;
  // -webkit-line-clamp: 4;
  // -webkit-box-orient: vertical;
}

.tooltipWarp {
  max-width: 300px;
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

#home-container {
  .el-dialog__body {
    padding-bottom: 30px;
  }

  .el-header {
    position: relative;
    width: 100%;
    height: 78px;
    padding: 0;
    background-color: #26303c;
  }

  .el-aside {
    position: absolute;
    height: 80vh;
    left: 0;
    top: 78px;
    bottom: 0;
    display: block;
    background-color: #202732;
  }

  .el-aside::-webkit-scrollbar {
    width: 0;
  }

  .el-main {
    // height: fit-content;
    position: absolute;
    left: 218px;
    right: 0;
    top: 78px;
    bottom: 0;
    overflow-y: scroll;
    padding: 20px;
    background-color: #ececec;
  }

  .el-pagination__editor.el-input .el-input__inner {
    height: 28px;
  }

  .el-input__inner {
    height: 40px;
  }
}

.el-dialog {
  width: 520px;
  border-radius: 10px !important;
}

.el-dialog__header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #3d82fe;
}

.el-dialog__title {
  color: #fff;
  font-weight: bold;
}

.el-dialog__headerbtn {
  font-size: 18px;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}

.el-dialog__headerbtn .el-dialog__close:hover {
  color: #000;
}

[class*=" el-icon-"],
[class^="el-icon-"] {
  font-weight: bolder;
}

.el-dialog__body {
  text-align: left;
}

.el-dialog__footer {
  padding: 10px 20px 30px 0;
  text-align: right;
}

.el-button + .el-button {
  margin-left: 20px;
}

.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #ccc;
}

.el-table--border,
.el-table--group {
  border-color: #ccc;
}

.el-table td {
  padding: 5px 0;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #ccc;
}

.el-table--border th,
.el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #ccc;
}

.el-table--border td,
.el-table--border th {
  border-right: 1px solid #ccc;
}

.el-table th {
  background-color: #f2f2f2;
}

.el-table {
  color: #666;
}

.el-table thead {
  color: #666;
}

.el-button--primary {
  color: #fff;
  background-color: #3d81fd;
  border-color: #3d81fd;
}

.el-drawer__header {
  text-align: left;
}

.el-drawer__header > :first-child {
  flex: 1;
  outline: 0;
}

.el-table__body,
.el-table__footer,
.el-table__header {
  width: 100% !important;
}

.el-table--border::after,
.el-table--group::after {
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
}

.el-drawer {
  overflow: scroll;
}
</style>
