import request from "@/utils/axios";
//标准代码-下拉框
export function approvalScope(data) {
  return request({
    url: "/ami/ma01-04-003/code-cls-val/queryCodeClsValCache",
    method: "post",
    data: data,
  });
}

//标准代码-来源机构
export function approvalSource(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info/queryOrg",
    // url: "ami/ma01-04-018/bmcm-question/queryOrg",
    method: "post",
    params: data,
  });
}

// 发布范围下拉
export function releaseScope(data) {
  return request({
    url: "/ami/ma01-04-018/bmcm-demand/queryManufacturer",
    method: "post",
    params: data,
  });
}

// 查询业务分类及其二级分类
export function queryCategory(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info/queryAppClsAndBusCls",
    data: data,
    method: "post",
  });
}

// 应用编码去重
export function queryAppNo(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info/queryAllSysAppBasicInfo",
    data: data,
    method: "post",
  });
}

//微应用管理tab表格
export function queryAppTable(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryAppVerInfoAsPage",
    method: "post",
    data: data,
  });
}

//微应用管理新增
export function queryAppAdd(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/newlyAppVerInfo",
    method: "post",
    data: data,
  });
}

//微应用管理编辑
export function queryAppUpDate(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/editAppVerInfo",
    method: "post",
    data: data,
  });
}

//微应用管理升级
export function queryAppUpgrade(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/upgradeAppVerInfo",
    method: "post",
    data: data,
  });
}

// //微应用管理穿梭框
// export function queryShuttle(data) {
//   return request({
//     url: "/ami/ma4018/bmcm-de-task/viewBmcmDeTask",
//     method: "post",
//     data: data
//   });
// }
//微应用管理删除
export function queryAppDelete(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/deleteAppVerInfoBatch",
    method: "post",
    data: data,
  });
}

// 查看
export function queryEditList(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/viewVerInfoDetailById",
    method: "post",
    data: data,
  });
}

// 查看 关联上传
export function updateAppVerInfo(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/updateAppVerInfo",
    method: "post",
    data,
  });
}

// 传图片信息
export function imgDataUpload(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info-uploadFile/addAttachmentInfoText",
    method: "post",
    data: data,
  });
}

//微应用管理应用图标删除
export function queryAppImageDel(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info-uploadFile/deleteAttachmentInfoBatch",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

//编辑回显图片
export function queryImageEdit(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info-uploadFile/queryAllAttachmentInfo",
    method: "post",
    data: data,
  });
}
//申请下架
export function queryShelfdete(data) {
  return request({
    url: "/ami/ma01-02-054/work-order-info/addWorkOrderInfo",
    method: "post",
    data: data,
  });
}
// 申请下架校验
export function queryShelfCheck(data) {
  return request({
    url: "/ami/ma01-02-054/work-order-info/queryAllWorkOrderInfo",
    method: "post",
    data: data,
  });
}
// 上传文件,回显
export function queryAttachmentByVerId(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info-uploadFile/queryAttachmentByAppCls",
    method: "post",
    data,
  });
}

// 上传文件
export function queryAppUploadAdd(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info-uploadFile/addAttachmentInfo",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 上传文件删除
export function queryAppUploadRemover(data) {
  return request({
    url: "/ami/ma01-02-054/sys-app-basic-info-uploadFile/deleteAttachmentInfoBatch",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

//微应用管理应用添加穿梭框左
export function queryAppTransfer(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryBmcmDeTaskXzb",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

//微应用管理应用添加穿梭框右
export function queryVerDeTaskAsPage(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryVerDeTaskAsPage",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

//下载记录导出
export function approvalExport(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/exportVerInfo",
    method: "post",
    data: data,
    responseType: "blob",
  });
}

// 图片下载接口
export function deviceDoDownload(data) {
  return request({
    url: "/ami/ma01-02-056/minio-file/imageDownload",
    responseType: "blob",
    method: "post",
    data,
  });
}

//切换版本
export function approvalNum(data) {
  return request({
    url: "/ami/ma01-02-054/app-ver-info/queryVerIdsByAppId",
    method: "post",
    data: data,
  });
}

//流程节点
export function approvalProcess(data) {
  return request({
    url: "/ami/ma01-02-054/work-order-info/queryAllWorkOrderInfo",
    method: "post",
    data: data,
  });
}

//发布详情评分列表
export function approvalEvalInfo(data) {
  return request({
    url: "/ami/ma01-02-054/app-eval-info/viewAppEvalInfoAverage",
    method: "post",
    data: data,
  });
}

//评论评价列表
export function approvalEvaluation(data) {
  return request({
    url: "/ami/ma01-02-054/app-eval-info/queryAppEvalInfoAsPage",
    method: "post",
    data: data,
  });
}

// 小文件上传 不分片
export function smallFileUpload(data) {
  return request({
    url: "/ami/ma01-02-056/minio-file/fileUpload",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 公共 文件删除
export function fileUploadRemover(data) {
  return request({
    url: "/ami/ma01-02-056/minio-file/deleteFile",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
