import request from "@/utils/axios";

/**
 * // 获取验证图片  以及token
 * @param data
 * @returns {*}
 */
export function reqGet(data) {
  return request({
    url: "/ami/ma01-00-101/captcha/get",
    method: "post",
    data,
  });
}

/**
 * 滑动或者点选验证
 * @param data
 * @returns {*}
 */
export function reqCheck(data) {
  return request({
    url: "/ami/ma01-00-101/captcha/check",
    method: "post",
    data,
  });
}
