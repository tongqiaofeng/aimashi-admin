<template>
  <div class="login-container" @keydown="keyLogin()">
    <div class="login-font-style">
      <div class="hermes-font">HERMES</div>
      <div class="hermes-bottom">ta的名字本身像极了一封吸引力十足的邀请函</div>
      <div class="welcome">欢迎您</div>
      <div>
        <img class="handbag" src="../../assets/imgs/handbag.png" />
        <img class="handleimg" src="../../assets/imgs/shadow.png" />
      </div>
    </div>
    <div class="login-form">
      <div class="username">
        <span><img :src="usernameImg" /></span>
        <input class="user-input" type="text" v-model="loginForm.username" placeholder="请输入用户名"
          prefix-icon="el-icon-s-custom" tabindex="1" auto-complete="on" @focus="usernameFocus" @blur="usernameBlur" />
      </div>
      <div class="password">
        <span><img :src="passwordImg" /></span>
        <input class="pass-input" type="password" v-model="loginForm.password" placeholder="请输入不少于6位的密码"
          prefix-icon="el-icon-lock" tabindex="2" auto-complete="on" @focus="passwordFocus" @blur="passwordBlur" />
      </div>
    </div>
    <div class="login-button">
      <button @click="handleLogin" class="loginBtn">登录</button>
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
          psaaword: ""
        },
        usernameImg: require('../../assets/imgs/user.png'),
        passwordImg: require('../../assets/imgs/password.png')
      }
    },
    beforeRouteEnter: (to, from, next) => {
      // 组件内守卫
      // 已登录状态回到登录状态，即 登出
      next(vm => {
        vm.$store.dispatch('setRole', null)
      })
    },
    methods: {
      handleLogin(loginForm) {
        if (this.loginForm.username == "" || this.loginForm.password == "") {
          this.$message.warning({
            message: "用户名或密码不能为空 !",
            showClose: true,
            duration: 2000
          })
        } else {
          this.$axios.post(this.$store.state.baseUrl + '/login', {
            'username': this.loginForm.username,
            'password': this.loginForm.password
          }).then((res) => {
            console.log(res)
            if (res.data.token) {
              this.$message.success({
                message: '登陆成功',
                showClose: true,
                duration: 2000
              });
              sessionStorage.setItem('username',this.loginForm.username);
              // 将用户角色和token放入sessionStorage
              sessionStorage.setItem('role', res.data.role);
              sessionStorage.setItem('token', res.data.token);
              // 将用户角色及token放入vuex
              this.$store.dispatch('setRole', res.data.role);
              this.$store.dispatch('setToken', res.data.token);
              // this.$store.dispatch('setToken',res.data.token);
              // 打印login状态
              console.log(this.$store.state.isLogin);
              this.$router.push('/home');
            } else {
              this.$message.error({
                message: "啊偶，登录失败，请检查用户名或密码输入是否正确",
                showClose: true,
                duration: 2000
              });
              this.$store.dispatch('setRole', null);
              this.loginForm.password = "";
            }
          }).catch(function (err) {
            console.log(err);
          })
        }

      },
      usernameFocus() {
        this.usernameImg = require('../../assets/imgs/userselect.png');
      },
      usernameBlur(){
        this.usernameImg = require('../../assets/imgs/user.png');
      },
      passwordFocus() {
        this.passwordImg = require('../../assets/imgs/passwordSelect.png');
      },
      passwordBlur(){
        this.passwordImg = require('../../assets/imgs/password.png');
      },
      keyLogin() {
        if (event.keyCode == 13) {
          this.handleLogin();
        }
      }
    },
  }

</script>
<style lang="scss">
  $width: 330px;
  $height: 40px;

  .login-container {
    width: 100%;
    min-height: 1000px;
    position: relative;
    background: url("../../assets/imgs/login.png") no-repeat;

    .login-font-style {
      position: absolute;
      top: 178px;
      left: 248px;

      .hermes-font {
        color: #fff;
        font-size: 48px;
        font-weight: bold;
      }

      .hermes-bottom {
        margin-top: 70px;
        font-size: 28px;
        color: #fff;
      }

      .welcome {
        margin-left: 660px;
        margin-top: 88px;
        font-size: 60px;
        color: #fff;
        font-weight: bold;
      }
      .handbag{
        position: absolute;
        top: 185px;
        right: -600px;
      }
      .handleimg{
        position: absolute;
        top: 525px;
        right: -600px;
      }
    }

    .login-form {
      position: absolute;
      top: 590px;
      left: 204px;

      .user-input,
      .pass-input {
        width: $width;
        height: $height;
        padding-left: 20px;
        border: 0;
        background: 0;
        font-size: 28px;
        color: #fff;
      }

      .password {
        margin-top: 40px;
      }
    }

    .login-button {
      position: absolute;
      top: 78%;
      left: 40%;

      .loginBtn {
        width: 260px;
        height: 90px;
        font-size: 28px;
        color: #fff;
        background-color: rgba($color: #000000, $alpha: 0.2);
        border: 0;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }

</style>
