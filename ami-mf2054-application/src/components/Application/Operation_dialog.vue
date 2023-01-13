<!--
 * @description: 操作日志弹窗
 * @author: 王浩
 * @Date: 2022-10-15 10:00:31
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="operation">
    <ami-dialog title="操作日志" width="960px" :visible.sync="OperationVisible" :before-close="handleCancel">
      <div class="operation-main">
        <ami-table :data="operationList" ami-table-style headerStripe stripe border style="width: 100%" max-height="450">
          <ami-table-column type="index" align="center" width="50"> </ami-table-column>
          <ami-table-column prop="operType" align="center" label="节点">
            <template slot-scope="scope">
              <span>{{ scope.row.operType === null ? "--" : scope.row.operType }}</span>
            </template>
          </ami-table-column>
          <ami-table-column prop="operUserName" align="center" label="处理人">
            <template slot-scope="scope">
              <span>{{ scope.row.operUserName === null ? "--" : scope.row.operUserName }}</span>
            </template>
          </ami-table-column>
          <ami-table-column prop="operTime" align="center" label="处理时间">
            <template slot-scope="scope">
              <span>{{ scope.row.operTime === null ? "--" : scope.row.operTime }}</span>
            </template>
          </ami-table-column>
          <ami-table-column prop="operDesc" align="center" label="处理意见" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.operDesc === null ? "--" : scope.row.operDesc }}</span>
            </template>
          </ami-table-column>
        </ami-table>
      </div>
    </ami-dialog>
  </div>
</template>
<script>
export default {
  name: "AMI-MA0102054-14",
  props: {
    // 日志数据
    operationList: {
      type: Array,
      default: () => [],
    },
    // 弹窗状态
    OperationVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      multipleSelection: [],
    };
  },
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("update:OperationVisible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.operation {
  width: 100%;
  height: 100%;
  &-main {
    width: 100%;
    height: 100%;
    overflow: auto;
    max-height: 600px;
    /deep/ .ami-table {
      border-radius: 8px;
      border: 1px solid #dee0e6;
    }
  }
}
</style>
