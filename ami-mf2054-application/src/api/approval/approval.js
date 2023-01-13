/*
 * @description:标准系统应用
 * @author: 王浩
 * @Date: 2022-10-13 16:48:43
 * @Modified By:
 * @version: 1.0.0
 */
import request from "@/utils/axios";

/**
 *  图片封装
 * @param {string} url 图片地址
 * @param {string} port 获取本地端口
 */

export const Iconinformation = (icon_ID) => {
  let port = window.location.origin; // 获取本地端口
  const imageUrl = port + "/ami/ma01-02-056/minio-file/imageView?fileId=" + icon_ID; //图片路径
  return imageUrl;
};

// 码值表接口
export function getSelectByCodeCls(data) {
  return request({
    url: "/ami/ma01-04-003/code-cls-val/queryCodeClsValCache",
    data: data,
    method: "post",
  });
}

// 列表查询（应用分类）
export function queryBuinessCategory(data) {
  return request({
    url: "/ami/ma01-02-052/demand-manage/queryBuinessCategory",
    data: data,
    method: "post",
  });
}

// 申请单位接口
export function queryOrg(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info/queryOrg",
    method: "post",
    data: data,
  });
}

// 版本历史查询
export function queryVerNoHistory(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/queryVerNoHistory",
    method: "post",
    data: data,
  });
}

// 系统应用总览-头部查询
export function queryHeaderBasicInfo(data) {
  return request({
    url: "/ami/ma01-02-054/appOverview/queryHeaderBasicInfo",
    data: data,
    method: "post",
  });
}

// 系统应用总览-应用分布
export function queryBasicInfoDistribution(data) {
  return request({
    url: "/ami/ma01-02-054/appOverview/queryBasicInfoDistribution",
    data: data,
    method: "post",
  });
}

// 系统应用总览-应用下载情况
export function queryBasicInfoDownloads(data) {
  return request({
    url: "/ami/ma01-02-054/appOverview/queryBasicInfoDownloads",
    data: data,
    method: "post",
  });
}

// 系统应用总览-应用报备
export function queryBasicInfoReporting(data) {
  return request({
    url: "/ami/ma01-02-054/appOverview/queryBasicInfoReporting",
    data: data,
    method: "post",
  });
}

// 分页查询标准应用
export function queryAppStandardPage(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/queryAppStandardPage",
    data: data,
    method: "post",
  });
}

// 分页查询标准应用审批
export function queryAppExaminePage(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/queryAppExaminePage",
    data: data,
    method: "post",
  });
}

// 分页查询应用下载记录
export function queryAppDlRecPage(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/queryAppDlRecPage",
    data: data,
    method: "post",
  });
}

// 标准应用列表-删除
export function deleteStandardId(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/deleteStandardId",
    data: data,
    method: "post",
  });
}

// 标准应用-发布
export function addApprovalRelease(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/addApprovalRelease",
    data: data,
    method: "post",
  });
}
// 标准应用-发布1
export function addrelease(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/addrelease",
    data: data,
    method: "post",
  });
}

// 根据id查询应用详情
export function queryInfoDetailById(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryInfoDetailById",
    data: data,
    method: "post",
  });
}

// 应用下架申请-查询详情
export function queryLowershelf(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/queryLowershelf",
    data: data,
    method: "post",
  });
}

//查询评论分布
export function queryCommentCounts(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/queryCommentCounts",
    data: data,
    method: "post",
  });
}

// 分页评论查询
export function queryCommentInfoPage(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryCommentInfoPage",
    data: data,
    method: "post",
  });
}

// 操作日志查询
export function queryAppOperLog(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryAppOperLog",
    data: data,
    method: "post",
  });
}

/**
 * 分页查询需求管理列表
 * @param {*} data
 * @returns {appId: 应用id,reqIdList: 需求id集合 }
 */
export function queryNeed(data) {
  return request({
    // url: "/ami/ma01-02-053/bmcmdetask/queryNeed",
    url: "/ami/ma01-02-054/app-ver-info/queryReqmList",
    data: data,
    method: "post",
  });
}

// 查询版本号
export function queryVerNo(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryVerNo",
    data: data,
    method: "post",
  });
}

// 应用版本接口
export function queryAppVerInfos(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/queryAppVerInfos",
    data: data,
    method: "post",
  });
}

// 应用审批-保存
export function addApproval(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/addApproval",
    data: data,
    method: "post",
  });
}

// 应用下架申请-保存
export function addLowershelf(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/addLowershelf",
    data: data,
    method: "post",
  });
}

// 应用下架审核-保存
export function addLowerShelflApproval(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/addLowerShelflApproval",
    data: data,
    method: "post",
  });
}

// 标准应用列表-导出
export function exportAppStandardPage(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/exportAppStandardPage",
    responseType: "blob",
    method: "post",
    data: data,
  });
}

// 应用发布-导出
export function exportReleasePage(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/exportReleasePage",
    responseType: "blob",
    method: "post",
    data: data,
  });
}

// 应用审批列表-导出
export function exportAppAppExaminePage(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/exportAppAppExaminePage",
    responseType: "blob",
    method: "post",
    data: data,
  });
}

// 下载记录-导出
export function exportAppDIRecords(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/exportAppDIRecords",
    responseType: "blob",
    method: "post",
    data: data,
  });
}

// 下载文件
export function fileDownLoad(data) {
  return request({
    url: "/ami/ma01-02-056/minio-file/fileDownLoad",
    data: data,
    method: "post",
    responseType: "blob",
  });
}
