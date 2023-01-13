<!----------------------------------------------------------------------------
 @description 子应用页面框架文件 （禁动）
 @author：基座组提供
 @date：Created in  2022/2/15 09:36
 @modified By：
 @version: 1.0.0
 ---------------------------------------------------------------------------->
<template>
  <div style="width: 100%; height: 100%; position: relative">
    <div
      style="width: 100%; height: 60px; overflow-y: auto; background: linear-gradient(180deg, #0069c4, #0055ae)"
      v-if="!isQiankun"
    >
      <span v-for="item in menus" :key="item.menuNo" :index="item.menuNo">
        <ami-button :type="active === item.path ? 'primary' : ''" style="margin: 6px" @click="select(item.path)">
          {{ item.menuName }}
        </ami-button>
      </span>
    </div>
    <div
      :style="{
        width: '100%',
        height: isQiankun ? '100%' : 'calc(100% - 84px)',
      }"
    >
      <keep-alive :exclude="uncacheList" :include="cacheList">
        <router-view v-if="activeDate" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { remoteEvent } from "@/utils/remoteUtil";

const moduleId = require("../../../package.json").moduleId.toLowerCase();
import { setStore } from "@/utils/store";

export default {
  name: "layout",
  computed: {
    ...mapState({
      menus: (state) => state.permission.menus,
      showMenu: (state) => state.permission.showMenu,
    }),
    isQiankun() {
      return !!window.__POWERED_BY_QIANKUN__ || !!this.showMenu;
    },
  },
  data() {
    return {
      active: "",
      cacheList: [],
      uncacheList: [
        "AMI-MA0102052-01",
        "AMI-MA0102052-02",
        "AMI-MA0102052-03",
        "AMI-MA0102052-04",
        "AMI-MA0102052-05",
        "AMI-MA0102052-06",
        "AMI-MA0102052-07",
        "AMI-MA0102052-08",
        "AMI-MA0102052-09",
        "AMI-MA0102052-10",
      ],
      activeDate: true,
    };
  },
  mounted() {
    this.cacheList = this.menus.map((item) => item.resourceCode);
    // 主应用更新tabs触发
    remoteEvent.on("public.home.updateCacheList", (list) => {
      let cacheList = [];
      list.forEach((element) => {
        cacheList.push(element.meta.resourceCode);
      });
      this.cacheList = cacheList.concat([]);
      console.log("====11111==public.home.updateCacheList==", this.cacheList);
    });
    remoteEvent.on("public.home.refresh.tab", (detail) => {
      if (detail.path.indexOf(moduleId) > -1) {
        this.cacheList = this.cacheList.filter((item) => {
          return item !== detail.meta.resourceCode;
        });
        this.activeDate = false;
        this.$nextTick(() => {
          this.activeDate = true;
          this.cacheList.push(detail.meta.resourceCode);
        });
      }
    });
    this.select(this.$route.path);
  },
  methods: {
    select(path) {
      if (this.isQiankun) return;
      console.log(path);
      this.active = path;
      setStore({ name: moduleId + "-router", content: path, type: "session" }, false);
      this.$router.push({
        path: path,
      });
    },
  },
};
</script>

<style scoped></style>
