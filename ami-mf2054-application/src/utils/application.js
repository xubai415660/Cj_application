/**
 * @description: 应用管理-工具类
 * @author: 王浩
 * @Date: 2023-01-02 14:27:54
 * @Modified By: --
 * @version: 1.0.0
 **/

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

// 求次幂
function pow1024(num) {
  return Math.pow(1024, num);
}

/**
 * 文件大小 字节转换单位
 * @param size
 * @returns {string|*}
 * @name:王浩
 */
export const filterSize = (size) => {
  if (size === 0) return "0.01KB";
  if (size < pow1024(1)) return size + "KB";
  if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + " MB";
  if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + " GB";
  if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + " TB";
  return (size / pow1024(4)).toFixed(2) + " TB";
};

/**
 * @description: 配置不支持的附件类型
 */
export const Mapping = {
  zip: "zip",
  rar: "rar",
  sql: "sql",
  jar: "jar",
};

/**
 * @description: 文件类型
 */
export const fileType = {
  xlsx: "ami-icon-svg-excel",
  xls: "ami-icon-svg-excel",
  zip: "ami-icon-svg-zip",
  pdf: "ami-icon-svg-pdf",
  docx: "ami-icon-svg-word",
  doc: "ami-icon-svg-word",
  mp4: "ami-icon-svg-mp4",
  rar: "ami-icon-svg-rar",
  json: "ami-icon-svg-json",
  svg: "ami-icon-svg-svg",
  png: "ami-icon-svg-PNG",
  jpg: "ami-icon-svg-PNG",
  csv: "ami-icon-svg-csv",
  ppt: "ami-icon-svg-ppt",
  pptx: "ami-icon-svg-ppt",
  html: "ami-icon-svg-web-page",
  txt: "ami-icon-svg-txt",
  file: "ami-icon-svg-file",
  apk: "ami-icon-svg-apk",
  exe: "ami-icon-svg-exe",
  mp3: "ami-icon-svg-mp3",
};

/**
 *
 * @param {*} date
 * @returns 字符串转base64
 */
export function encode(date) {
  // 对字符串进行编码
  const encode = encodeURI(date);
  // 对编码的字符串转化base64
  const base64 = btoa(encode); // btoa() 将字符串转换为 base64
  return base64;
}

/**
 *
 * @param {*} date
 * @returns base64转字符串
 */
export function decode(date) {
  // 对base64进行解码
  const decode = atob(date);
  // 对解码的字符串进行解码
  const decodeStr = decodeURI(decode);
  return decodeStr;
}
