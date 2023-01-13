<!--
 * @description: 缺陷来源
 * @author: 王浩
 * @Date: 2023-01-03 18:26:22
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <div class="Defect">
    <ami-dialog title="缺陷列表" width="960px" :visible.sync="DefectShow" :before-close="handleCancel">
      <div class="transfer-shuttle">
        <ami-transfer
          filterable
          v-model="DefectList"
          :data="generateData"
          @change="handleChange"
          :filter-method="filterMethod"
          :titles="['待选区', '已选区']"
          filter-placeholder="请输入名称"
          :props="{
            key: 'reqId',
            label: 'fbTitle',
          }"
        >
        </ami-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <ami-button round @click="sgFrameCancel()">取 消</ami-button>
        <ami-button round type="primary" @click="sgFrameDetermine()">确 定</ami-button>
      </span>
    </ami-dialog>
  </div>
</template>
<script>
export default {
  name: "Defect_source",
  data() {
    return {
      DefectList: [], // 缺陷列表
      storageList: [], // 缺陷列表-存储
    };
  },
  props: {
    // 数据列表
    generateData: {
      type: Array,
      default: () => [],
    },
    DefectShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 需求任务列表-取消
    sgFrameCancel() {
      this.storageList = [];
      this.$emit("update:DefectShow", false);
    },
    // 需求任务列表-确定
    sgFrameDetermine() {
      let list = this.generateData.filter((item) => {
        return this.DefectList.includes(item.reqId);
      });
      // 传递数据
      this.$emit("DefectDataChang", list);
      // 关闭弹窗
      this.$emit("update:DefectShow", false);
    },
    // 删除已选内容
    removeItem(item) {
      this.DefectList.splice(this.DefectList.indexOf(item), 1);
    },
    // 自定义搜索方法-模糊搜索
    filterMethod(query, item) {
      return item.fbTitle.indexOf(query) > -1;
    },
    // 缺陷列表-促发
    handleChange(value) {
      this.storageList = value;
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("update:DefectShow", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.Defect {
  width: 100%;
  height: 100%;
  /deep/ .transfer-shuttle {
    width: 100%;
    height: 100%;
    .ami-transfer-panel {
      width: 44%;
    }
    .ami-transfer__buttons {
      display: inline-grid;
    }
    .ami-button + .ami-button {
      margin-left: 0px;
    }
  }
}
</style>
