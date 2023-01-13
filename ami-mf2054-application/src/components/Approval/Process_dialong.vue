<!--
 * @description:定制应用-流程节点弹窗
 * @author: 王浩
 * @Date: 2022-10-15 16:10:55
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="process">
    <ami-dialog title="流程节点" width="960px" :visible.sync="ProcessVisible" :before-close="handleCancel">
      <div class="process-main">
        <ami-table :data="processList" ami-table-style headerStripe stripe border style="width: 100%" max-height="450">
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
          <ami-table-column prop="operDesc" align="center" label="处理意见" width="200" :show-overflow-tooltip="true">
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
  name: "AMI-MA0102054-16",
  props: {
    // 流程节点数据
    processList: {
      type: Array,
      default: () => [],
    },
    // 弹窗状态
    ProcessVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("update:ProcessVisible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.process {
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
    /deep/ .ami-table--border::after {
      background-color: none;
    }
  }
}
</style>
