/*
 * @description:定制系统应用报备
 * @author: 王浩
 * @Date: 2022-10-13 16:48:43
 * @Modified By:
 * @version: 1.0.0
 */
import request from "@/utils/axios";

// 申请单位接口
export function queryOrg(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info/queryOrg",
    method: "post",
    data: data,
  });
}

// 定制应用详情查询id
export function queryCustomizedById(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryCustomizedById",
    data: data,
    method: "post",
  });
}

// 分页查询定制应用
export function queryAppCustomizedPage(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/queryAppCustomizedPage",
    data: data,
    method: "post",
  });
}

// 报备应用审批-保存
export function addApprovalFiling(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/addApprovalFiling",
    method: "post",
    data: data,
  });
}

// 报备应用验签生成-保存
export function addApprovalCheck(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/addApprovalCheck",
    method: "post",
    data: data,
  });
}

// 分页查询定制应用-导出
export function exportAppCustomizedPage(data) {
  return request({
    url: "/ami/ma01-02-054/app-dl-rec/exportAppCustomizedPage",
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
