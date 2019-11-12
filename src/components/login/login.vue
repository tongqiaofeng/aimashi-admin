<template>
  <div class="login-container" @keydown="keyLogin()">
    <el-form ref="loginForm" :model="loginForm" label-width="80px" class="login-form">
      <div class="title-container">
        <h3 class="title">欢迎您 !</h3>
      </div>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-s-custom"
          tabindex="1" auto-complete="on"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入不少于6位的密码" prefix-icon="el-icon-lock"
          tabindex="2" auto-complete="on"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-left:36.4%;">
      <el-button type="primary" @click="handleLogin" class="loginBtn">登录</el-button>
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
              this.loginForm.password="";
            }
          }).catch(function (err) {
            console.log(err);
          })
        }

      },
      keyLogin(){
        if(event.keyCode==13){
          this.handleLogin();
        }
      }
    },
  }

</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 50px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .loginBtn{
      width: 520px;
      max-width: 100%;
      margin-bottom: 30px;
      text-align: center;
    }
  }

</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    height: 999px;
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }

</style>
