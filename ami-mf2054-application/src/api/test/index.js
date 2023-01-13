/********************************************************
 * @description：
 * @author：
 * @date：Created in 2022/3/23 10:19
 * @modified By：
 * @version: 1.0.0
 *******************************************************/
import request from "@/utils/axios";

export const queryMenusByModuleId = (moduleId) => {
  return request({
    url: `/ami/ma01-00-001/list/`,
    method: "post",
    params: {
      moduleId: moduleId,
    },
  });
};

// 全局收索配置 -分页查询所有资源列表
export function querysresourcelist(data) {
  return request({
    url: "/ami/ma01-02-066/system-search/querysresourcelist",
    method: "post",
    data,
  });
}

// 添加搜索配置
export function addSyjsFunctionData(data) {
  return request({
    url: "/ami/ma01-02-066/system-search/addSyjsFunctionData",
    method: "post",
    data,
  });
}
