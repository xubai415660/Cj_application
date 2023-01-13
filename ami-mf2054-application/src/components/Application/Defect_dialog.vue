<!--
 * @description: 关联缺陷弹窗
 * @author: 王浩
 * @Date: 2023-01-03 15:00:17
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <div class="defect">
    <ami-dialog title="关联缺陷" width="960px" :visible.sync="DefectVisible" :before-close="handleCancel">
      <!-- 弹窗内容区 -->
      <div class="shelf-dialog">
        <div class="shelf-item">
          <ami-model-title title="标题" />
          <div class="shelf-main">
            <!-- 缺陷描述 -->
            <ami-row>
              <ami-col :span="2">
                <span class="shelf-txt">缺陷描述：</span>
              </ami-col>
              <ami-col :span="22">哈哈哈哈哈</ami-col>
            </ami-row>
            <!-- 附件 -->
            <ami-row>
              <ami-col :span="2">
                <span class="shelf-txt">附件：</span>
              </ami-col>
              <ami-col :span="10">
                <!-- <span v-if="item.fileName == null">--</span> -->
                <!-- v-else -->
                <span class="attachment" @click="download(item)">业务需求设计说明书</span>
              </ami-col>
              <ami-col :span="2">
                <span class="shelf-txt">实现方式：</span>
              </ami-col>
              <ami-col :span="10">
                <span>基座升级</span>
              </ami-col>
            </ami-row>
          </div>
        </div>
      </div>
    </ami-dialog>
  </div>
</template>
<script>
export default {
  name: "Associate_dialog",
  data() {
    return {};
  },
  props: {
    DefectVisible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("update:DefectVisible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.defect {
  width: 100%;
  height: 100%;
  .shelf-dialog {
    width: 100%;
    height: 100%;
    overflow: auto;
    max-height: 600px;
    .shelf-item {
      margin-top: 10px;
      /deep/ .ami-model-title {
        margin: 0px 0px 0px -17px;
      }
      .shelf-main {
        width: 100%;
        border-bottom: 16px;
        border-bottom: 1px solid #e8e8e8;
        /deep/ .ami-row {
          margin-bottom: 20px;
        }
        .shelf-txt {
          color: #999999;
          font-size: 14px;
          float: right;
        }
        .attachment {
          cursor: pointer;
          color: #0040d1;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
