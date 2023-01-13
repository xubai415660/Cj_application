/*
 * @description:v-dbClick自定义指令，防止按钮重复点击提交的方法
 * @author: 王浩
 * @Date: 2022-11-28 17:13:01
 * @Modified By: --
 * @version: 1.0.0
 */

// 创建自定义指令：

import Vue from "vue";

Vue.directive("dbClick", {
  bind(el, binding) {
    el.addEventListener("click", () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 1000);
      }
    });
  },
});
