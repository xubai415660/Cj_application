/*
 * @Author: 袁徐澄
 * @Description: 数模
 * @Date: 2023-01-06 19:45:50
 * @LastEditTime: 2023-01-07 11:04:10
 * @FilePath: \ami-mf2052-appmarket\src\api\model\model.js
 */
import request from "@/utils/axios";
// 分页查询 数据模型应用市场列表
// /ami/ma01-02-052/dmmycomments/queryPublishingModel
export function queryPublishingModel(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/queryPublishingModel",
    method: "post",
    data: data,
  });
}
// 查询 数模下载页面
// /ami/ma01-02-052/dmmycomments/selCurrentVersionInfo
export function selCurrentVersionInfo(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/selCurrentVersionInfo",
    method: "post",
    data: data,
  });
}
// 评论
// /ami/ma01-02-052/dmmycomments/inModelReview

export function inModelReview(data) {
  return request({
    url: "/ami/ma01-02-052/dmmycomments/inModelReview",
    method: "post",
    data: data,
  });
}
// 下载
// /ami/ma01-03-069/digital/inDownloadLog
export function inDownloadLog(data) {
  return request({
    url: "/ami/ma01-03-069/digital/inDownloadLog",
    method: "post",
    data: data,
  });
}
