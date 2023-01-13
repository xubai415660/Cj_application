/**
 * @description：标准代码-系统应用管理
 * @author：王浩
 * @date：Created in 2022/10/18 11:51
 * @modified By：
 * @version: 1.0.0
 */
import { getSelectByCodeCls, queryOrg, queryBuinessCategory } from "@/api/approval/approval";
export default {
  state: {
    apply_type: [], // 申请类型
    apply_unit: [], // 申请单位
    approval_examine: [], // 审批状态
    approval_classify: [], // 应用分类
    approval_package: [], // 程序包
    approval_sign: [], // 数字签名
    approval_pubtype: [], // 发布类型
    approval_publish: [], // 发布状态
    approval_offreason: [], // 下架原因
  },
  // 提交数据到state
  mutations: {
    setApplyType(state, data) {
      state.apply_type = data;
    },
    setApplyUnit(state, data) {
      state.apply_unit = data;
    },
    setApprovalExamine(state, data) {
      state.approval_examine = data;
    },
    setApprovalClassify(state, data) {
      state.approval_classify = data;
    },
    setApprovalPackage(state, data) {
      state.approval_package = data;
    },
    setApprovalSign(state, data) {
      state.approval_sign = data;
    },
    setApprovalPubtype(state, data) {
      state.approval_pubtype = data;
    },
    setApprovalPublish(state, data) {
      state.approval_publish = data;
    },
    setApprovalOffreason(state, data) {
      state.approval_offreason = data;
    },
  },
  // 相当于store的计算属性  将store数据映射到selectData 方便页面在计算属性中使用
  getters: {
    apply_type: (state) => state.apply_type,
    apply_unit: (state) => state.apply_unit,
    approval_examine: (state) => state.approval_examine,
    approval_classify: (state) => state.approval_classify,
    approval_package: (state) => state.approval_package,
    approval_sign: (state) => state.approval_sign,
    approval_pubtype: (state) => state.approval_pubtype,
    approval_publish: (state) => state.approval_publish,
    approval_offreason: (state) => state.approval_offreason,
  },
  // 请求
  actions: {
    // 申请类型
    getApplyType({ commit }, payload) {
      getSelectByCodeCls({ ...payload }).then((res) => {
        let data = res.data;
        commit("setApplyType", data.data);
      });
    },
    // 申请单位
    getApplyUnit({ commit }, payload) {
      queryOrg({ ...payload }).then((res) => {
        let data = res.data;
        commit("setApplyUnit", data.data);
      });
    },
    // 审批状态
    getApprovalExamine({ commit }, payload) {
      getSelectByCodeCls({ ...payload }).then((res) => {
        let data = res.data;
        commit("setApprovalExamine", data.data);
      });
    },
    // 应用分类
    getApprovalClassify({ commit }, payload) {
      queryBuinessCategory({ ...payload }).then((res) => {
        let data = res.data;
        commit("setApprovalClassify", data.data);
      });
    },
    // 发布状态
    getApprovalPublish({ commit }, payload) {
      getSelectByCodeCls({ ...payload }).then((res) => {
        let data = res.data;
        commit("setApprovalPublish", data.data);
      });
    },
    // 发布类型
    getApprovalPubtype({ commit }, payload) {
      getSelectByCodeCls({ ...payload }).then((res) => {
        let data = res.data;
        commit("setApprovalPubtype", data.data);
      });
    },
    // 程序包
    getApprovalPackage({ commit }, payload) {
      getSelectByCodeCls({ ...payload }).then((res) => {
        let data = res.data;
        commit("setApprovalPackage", data.data);
      });
    },
    // 数字签名
    getApprovalSign({ commit }, payload) {
      getSelectByCodeCls({ ...payload }).then((res) => {
        let data = res.data;
        commit("setApprovalSign", data.data);
      });
    },
    // 下架原因
    getApprovalOffreason({ commit }, payload) {
      getSelectByCodeCls({ ...payload }).then((res) => {
        let data = res.data;
        commit("setApprovalOffreason", data.data);
      });
    },
  },
};
