import request from "@/utils/axios";
//标准应用列表查询
export function queryAppStandardList(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/queryAppStandardPage",
    method: "post",
    data: data,
  });
}
// 应用分类
export function queryBuinessCategory(data) {
  return request({
    url: "/ami/ma01-02-052/demand-manage/queryBuinessCategory",
    method: "post",
    data: data,
  });
}
// 审核状态
export function queryCodeClsValCache(data) {
  return request({
    url: "/ami/ma01-04-003/code-cls-val/queryCodeClsValCache",
    method: "post",
    data: data,
  });
}
// 获取省份
export function queryOrg(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info/queryOrg",
    method: "post",
    data: data,
  });
}
// 标准应用列表删除
export function deleteStandardId(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/deleteStandardId",
    method: "post",
    data: data,
  });
}

// 标准应用列表导出
export function exportAppStandardPage(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/exportAppStandardPage",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// 分页查询需求管理列表
export function queryNeed(data) {
  return request({
    url: "/ami/ma01-02-053/bmcmdetask/queryNeed",
    method: "post",
    data: data,
  });
}
export function queryReqmList(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryReqmList",
    method: "post",
    data: data,
  });
}

// 应用保存和新增
export function newlyAppVerInfo(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/newlyAppVerInfo",
    method: "post",
    data: data,
  });
}

//查询标准应用详情
export function queryInfoDetailById(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryInfoDetailById",
    method: "post",
    data: data,
  });
}

// 编辑保存/发布
export function updateInfoDetailById(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/updateInfoDetailById",
    method: "post",
    data: data,
  });
}
//版本升级
export function upgradeInfoDetailById(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/upgradeInfoDetailById",
    method: "post",
    data: data,
  });
}

// 版本号和应用名称校验
export function queryAppCheckout(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryAppCheckout",
    method: "post",
    data: data,
  });
}
// 查询版本号
export function queryVerNo(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryVerNo",
    method: "post",
    data: data,
  });
}
