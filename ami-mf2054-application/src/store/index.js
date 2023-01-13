/*
 * @description:
 * @author: 王浩
 * @Date: 2022-12-21 20:35:41
 * @Modified By: --
 * @version: 1.0.0
 */
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import permission from "./modules/permission";
import orgSelect from "./modules/org";
import base from "./modules/base";
import template from "./modules/template";
import approval from "./modules/approval";
Vue.use(Vuex);
/**
 * 本地化数据字典数据
 * */
const activePath = createPersistedState({
  storage: window["sessionStorage"],
  paths: ["base"],
});
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    permission,
    orgSelect,
    base,
    template,
    approval,
  },
  plugins: [activePath],
});
