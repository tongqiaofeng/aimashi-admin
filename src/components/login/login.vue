<template>
  <div class="login-container" @keydown="keyLogin()">
    <div class="login-main">
      <div class="login-form">
        <div class="login-font">
          <div>
            <img
              style="width: 120px;height: 120px;object-fit: cover;"
              src="../../assets/imgs/logo_black.png"
            />
          </div>
          <div class="font-02">
            愛馬仕後台管理系統
          </div>
          <!-- <div class="font-01">HERMES</div>
          <div class="font-02">ta的名字本身像极了一封吸引力十足的邀请函</div> -->
        </div>
        <div class="username">
          <input
            class="user-input"
            type="text"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-s-custom"
            tabindex="1"
            auto-complete="on"
            @focus="usernameFocus"
            @blur="usernameBlur"
          />
        </div>
        <div class="password">
          <input
            class="pass-input"
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            tabindex="2"
            auto-complete="on"
            @focus="passwordFocus"
            @blur="passwordBlur"
          />
        </div>
        <div class="login-btn">
          <!-- <img src="../../assets/imgs/login-button.png" @click="handleLogin" /> -->
          <!-- <el-button class="btn-self" type="primary" @click="handleLogin"
            >登錄</el-button
          > -->
          <div class="btn-self" @click="handleLogin">登錄</div>
        </div>
      </div>
      <div class="right-img">
        <img src="../../assets/imgs/bg.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: ""
      }
    };
  },
  beforeRouteEnter: (to, from, next) => {
    // 组件内守卫
    // 已登录状态回到登录状态，即 登出
    next(vm => {
      vm.$store.dispatch("setRole", null);
    });
  },
  methods: {
    handleLogin() {
      if (this.loginForm.username == "" || this.loginForm.password == "") {
        this.$message.warning({
          message: "用户名或密码不能为空 !",
          showClose: true,
          duration: 2000
        });
      } else {
        this.$axios
          .post(this.$store.state.baseUrl + "/login", {
            username: this.loginForm.username,
            password: this.loginForm.password
          })
          .then(res => {
            console.log("000000000");
            console.log(res);
            if (res.data.role == "indi") {
              this.$message.error({
                message: "对不起,您没有访问该系统的权限",
                showClose: true,
                duration: 2000
              });
            } else {
              if (res.data.token) {
                this.$message.success({
                  message: "登陆成功",
                  showClose: true,
                  duration: 2000
                });
                sessionStorage.setItem("userId", res.data.id);
                // 将用户角色和token放入sessionStorage
                sessionStorage.setItem("role", res.data.role);
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("type", res.data.type);
                sessionStorage.setItem("companyId", res.data.companyId);
                sessionStorage.setItem("currencyGlobal", res.data.currency);
                sessionStorage.setItem(
                  "isHeadCompanyAdmin",
                  res.data.isHeadCompanyAdmin
                );
                sessionStorage.setItem("username", res.data.username);

                // 将用户角色及token放入vuex
                this.$store.dispatch("setRole", res.data.role);
                this.$store.dispatch("setToken", res.data.token);
                this.$store.dispatch("setType", res.data.type);

                // 打印login状态
                console.log(this.$store.state.isLogin);
                this.$router.push("/home");
              } else {
                this.$message.error({
                  message: "啊哦，登录失败，请检查用户名或密码输入是否正确",
                  showClose: true,
                  duration: 2000
                });
                this.$store.dispatch("setRole", null);
                this.loginForm.password = "";
                sessionStorage.setItem("username", "");
                sessionStorage.setItem("role", "");
                sessionStorage.setItem("token", "");
              }
            }
          })
          .catch(err => {
            console.log("11111111");
            console.log(err);
            this.$message.error({
              message: "啊偶，登录失败，请检查用户名或密码输入是否正确",
              showClose: true,
              duration: 2000
            });
            this.$store.dispatch("setRole", null);
            this.loginForm.password = "";
          });
      }
    },
    usernameFocus() {
      this.usernameImg = require("../../assets/imgs/userselect.png");
    },
    usernameBlur() {
      this.usernameImg = require("../../assets/imgs/user.png");
    },
    passwordFocus() {
      this.passwordImg = require("../../assets/imgs/passwordSelect.png");
    },
    passwordBlur() {
      this.passwordImg = require("../../assets/imgs/password.png");
    },
    keyLogin() {
      if (event.keyCode == 13) {
        this.handleLogin();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  /*定义body的元素垂直居中*/
  justify-content: center;
  background: url("../../assets/imgs/bgc01.png") no-repeat 100%;

  .login-main {
    display: flex;
    box-shadow: 20px 20px 30px -10px rgba(0, 0, 0, 0.4);

    .login-form {
      width: 540px;
      height: 720px;
      background-color: #fff;
      text-align: center;

      .login-font {
        // margin-top: 169px;
        margin-top: 60px;
        font-family: "Arial";

        .font-01 {
          font-size: 30px;
        }

        .font-02 {
          font-size: 20px;
          // color: #e0e0e0;
          color: #26303c;
          font-style: italic;
        }
      }

      .user-input,
      .pass-input {
        // width: 372px;
        // height: 57px;
        // padding-left: 20px;
        // border: 1px solid #e0e0e0;
        // border-radius: 60px;
        // background: #f8f8f8;
        // font-size: 18px;
        // color: #797979;

        width: 372px;
        height: 50px;
        padding-left: 20px;
        border: 0;
        background-color: #f8f8f8;
        outline: none;
        font-size: 16px;
        color: #797979;
      }

      .username {
        margin-top: 50px;
      }

      .password {
        margin-top: 26px;
      }

      .login-btn {
        margin-top: 60px;

        img {
          width: 372px;
          height: 50px;
        }

        .btn-self {
          width: 372px;
          height: 50px;
          line-height: 50px;
          margin: 0 auto;
          font-size: 16px;
          color: #fff;
          background: url("../../assets/imgs/aside.png") no-repeat;
          background-size: 100% 100%;
          border: 0;
          outline: none;
          cursor: pointer;
        }
      }
    }

    .right-img {
      width: auto;
      height: 720px;
    }
  }
}

input:focus {
  outline: none;
}
</style>
