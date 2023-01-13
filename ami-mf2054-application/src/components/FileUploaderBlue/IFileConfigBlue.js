/**
 * @description：大文件上传配置
 * @author：宋乾
 * @date：Created in 2022/02/16 16:45
 * @modified By：
 * @version: 1.0.0
 */
import { uuid } from "./uuid";

export const ComponentMode = {
  upload: 1, // 新增页面
  edit: 2, // 编辑页面 控制组件内部文件数量，需要加上新增的、当前页面回显的文件数量 checkFileLen
};

export class IFileConfigBlue {
  // 有文件分片上传失败时，重复上传的次数；
  tryTimes = 3;

  // 组件模式
  mode = ComponentMode.upload;

  // drag area dom id
  dragAreaDomId = uuid();
  // id
  domId = uuid();
  // 是否多文件
  isMultiple = false;
  // 文件类型
  fileAccept = `
    application/pdf,
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
    application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
  `;
  // 切片长度
  sliceLength = 1024 * 1024 * 5; // 5M
  // 文件大小限制
  maxFileSize = 1024 * 1024 * 1024 * 5; // 5G
  // 启用文件切片功能的文件大小的下限
  sliceLimit = 1024 * 1024 * 300; // 300M
  // 禁止删除上传成功的文件
  cantDeleteServerFile = false;
  // 提示
  reminder = "支持上传文件格式为：doc,docx,xlsx,pdf";
  // 文件类型错误提示
  wrongFileTypeAlert = "此文件格式暂时不支持，请核对文件格式重新上传";
  // 按钮文本
  buttonTxt = "上传文件";

  viewList = [];

  viewLength = 0;

  // 回显列表
  // 文件数量限制
  fileQuantityLimit = 3;

  // 是否支持文件夹
  doesSupportDirectory = false;

  constructor() {}
}

/**
 * 常用配置
 */
export const MyCommonFileConfig = (() => {
  const config = new IFileConfigBlue();
  config.doesSupportDirectory = true;
  return config;
})();
