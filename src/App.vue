<template>
  <div id="app">
    <router-view></router-view>
    <!-- <div v-show="!isLogin">
      <Login></Login>
    </div>
    <div v-show="isLogin" v-if="isRouterAlive">
      <Home></Home>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  computed: {
    isLogin() {
      if (sessionStorage.getItem("role") && sessionStorage.getItem("token")) {
        this.$store.commit("userStatus", sessionStorage.getItem("role"));
      } else {
        this.$store.commit("userStatus", null);
      }
      console.log("ddd");
      console.log(this.$store.getters.isLogin);
      return this.$store.getters.isLogin;
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
}

#app {
  font-family: "微软雅黑";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  /* margin-top: 60px; */

  .sure-button {
    width: 100px;
  }
}

.el-dialog {
  margin-top: 10vh !important;
}
</style>
