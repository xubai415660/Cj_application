/*
 * @description:应用市场--接口
 * @author: wanghao
 * @Date: 2022-03-31 10:33:26
 * @Modified By:
 * @version: 1.0.0
 */
import request from "@/utils/axios";

// 码值表接口
export function getSelectByCodeCls(data) {
  return request({
    url: "/ami/ma01-04-003/code-cls-val/queryCodeClsValCache",
    data: data,
    method: "post",
  });
}

// 列表查询（tab栏切换）
export function queryBuinessCategory(data) {
  return request({
    url: "/ami/ma01-02-052/demand-manage/queryBuinessCategory",
    data: data,
    method: "post",
  });
}

// 应用详情列表
export function queryAllAppInfoAndCommonDl(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/queryAllAppInfoAndCommonDl",
    data: data,
    method: "post",
  });
}

// 应用详情接口
export function Applicationdetails(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/selectAppDetailsCommentDTO",
    data: data,
    method: "post",
  });
}

// 相关推荐接口
export function recommends(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/queryAllAppInfoAndCommonDl",
    data: data,
    method: "post",
  });
}

// 查询评论列表信息
export function queryBmasAppCommentInfo(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/queryBmasAppCommentInfo",
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

// 添加我的评论信息
export function addBmasAppCommentInfo(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/addBmasAppCommentInfo",
    data: data,
    method: "post",
  });
}

// 新增问题反馈--旧
export function addBmcmQuestion(data) {
  return request({
    url: "/ami/ma01-02-052/demand-manage/addBmcmQuestion",
    data: data,
    method: "post",
  });
}

// 新增问题反馈
export function inMineWantOn(data) {
  return request({
    url: "/ami/ma01-02-052/demandmanage/inMineWantOn",
    data: data,
    method: "post",
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

// 应用版本接口
export function queryAppVerInfos(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/queryAppVerInfos",
    data: data,
    method: "post",
  });
}

//下载弹窗接口
export function information(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/information",
    data: data,
    method: "post",
  });
}

// 下载文件
export function downLoadFile(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/downLoadFile",
    responseType: "blob",
    data: data,
    method: "post",
  });
}

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
