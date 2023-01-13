/*
 * @description:
 * @author: wanghao
 * @Date: 2022-03-31 17:21:57
 * @Modified By:
 * @version: 1.0.0
 */
/*
 * @description:
 * @author: wanghao
 * @Date: 2022-03-08 11:55:47
 * @Modified By:
 * @version: 1.0.0
 */
/**
 * 文件大小 字节转换单位
 * @param size
 * @returns {string|*}
 * @name:王浩
 */
export const filterSize = (size) => {
  if (!size) return "";
  if (size < pow1024(1)) return size + " B";
  if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + " KB";
  if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + " MB";
  if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + " GB";
  return (size / pow1024(4)).toFixed(2) + " TB";
};

// 求次幂
function pow1024(num) {
  return Math.pow(1024, num);
}

/**
 * @name:王浩
 * @description: 当前系统日期 yyyy-MM-dd
 * @param {String} date 需要转换的时间例如："2020-1-1"
 * @return {String} "2020-01-01"
 */
export const getYearMonthDay = function (date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  let MM = d.getMonth() + 1;
  MM = MM < 10 ? `0${MM}` : MM;
  let dd = d.getDate();
  dd = dd < 10 ? `0${dd}` : dd;
  return `${yyyy}-${MM}-${dd}`;
};

/**
 * @description: 格式 时间到时分秒
 * @param {String} date 需要转换的时间例如："2020-1-1"
 * @return {String} 年月日时分秒
 */
export const format = function (date) {
  if (!date) return;
  var date2 = new Date(date);
  var y = date2.getFullYear();
  var m = date2.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date2.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date2.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date2.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  var seconds = date2.getSeconds();
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + seconds;
};

/**
 * split分隔符号
 * @param {*} data
 * @returns
 */
export const split = (data) => {
  return data ? String(data).split(",") : "";
};
