<!--
 * @description: APP入口文件
 * @author: 王浩
 * @Date: 2022-11-03 18:24:05
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { getToken } from "@/utils/store";
export default {
  data() {
    return {
      timer: null,
    };
  },
  computed: {
    windowResize() {
      return this.$store.state.permission.windowResize;
    },
  },
  methods: {
    changeSize() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.$store.commit("UPDATE_WINDOW_RESIZE", this.windowResize + 1);
      }, 500);
    },
    setTokenForLuckySheet() {
      if (window.__POWERED_BY_QIANKUN__) {
        return;
      }
      // eslint-disable-next-line no-undef
      $.ajaxSetup({
        beforeSend: function (jqXHR) {
          /*header里加请求头参数*/
          jqXHR.setRequestHeader("Authorization", "Bearer " + getToken());
        },
      });
    },
  },
  mounted() {
    // eslint-disable-next-line no-undef
    const erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById("app"), () => {
      this.changeSize();
    });
    this.setTokenForLuckySheet();
  },
};
</script>
<style>
#app {
  height: 100%;
  font-family: "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #ececec;
  color: #2c3e50;
}

div {
  box-sizing: border-box;
}
</style>
