/*
 * @description: 配置echars自适应
 * @author: 王浩
 * @Date: 2022-10-12 18:29:31
 * @Modified By:
 * @version: 1.0.0
 */

import elementResizeDetectorMaker from "element-resize-detector";

/**
 * @description: 配置echars自适应
 * @param {*} el 需要自适应的dom
 */

export const echarsResize = (el) => {
  window.addEventListener("resize", () => el.resize());
  elementResizeDetectorMaker({
    strategy: "scroll",
  }).listenTo(el, () => {
    el.resize();
  });
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
