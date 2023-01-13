/*
 * @description:知识库
 * @author: 王浩
 * @Date: 2022-06-23 19:37:13
 * @Modified By:
 * @version: 1.0.0
 */
import { getSelectByCodeCls } from "@/api/market/market.js";

export default {
  state: {
    knowledge_type: [], // 知识类型
    knowledge_cla: [], // 专业分类
    ApplicationList: [], //应用分类
  },
  mutations: {
    /**
     * 提交数据到state
     */
    setTypeData(state, data) {
      state.knowledge_type = data;
    },
    setClaData(state, data) {
      state.knowledge_cla = data;
    },
    setApplicationList(state, data) {
      state.ApplicationList = data;
    },
  },
  /**
   *相当于store的计算属性  将store数据映射到selectData 方便页面在计算属性中使用
   **/
  getters: {
    knowledge_type: (state) => state.knowledge_type,
    knowledge_cla: (state) => state.knowledge_cla,
    ApplicationList: (state) => state.ApplicationList,
  },
  // 请求
  actions: {
    // 知识类型
    getType({ commit }, payload) {
      getSelectByCodeCls({ ...payload }).then((res) => {
        // console.log(res.data.data, "知识类型");
        let data = res.data;
        commit("setTypeData", data.data);
      });
    },
    // 专业分类
    getCla({ commit }, payload) {
      getSelectByCodeCls({ ...payload }).then((res) => {
        // console.log(res.data.data, "专业分类");
        let data = res.data;
        commit("setClaData", data.data);
      });
    },
    // 应用分类
    getApplicationList({ commit }, payload) {
      getSelectByCodeCls({ ...payload }).then((res) => {
        // console.log(res.data.data, "应用分类");
        let data = res.data;
        commit("setApplicationList", data.data);
      });
    },
  },
};
