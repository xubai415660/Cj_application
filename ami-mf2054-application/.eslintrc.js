/*
 * @description: eslint配置文件
 * @author: wanghao
 * @Date: 2022-05-27 16:29:56
 * @Modified By: 
 * @version: 1.0.0
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    semi: ["error", "always"], // eslint末尾添加分号
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
