<!--
 * @description: 版本历史记录
 * @author: 王浩
 * @Date: 2022-10-14 16:33:15
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="Version">
    <ami-dialog title="版本历史记录" width="960px" :visible.sync="versionVisible" :before-close="handleCancel">
      <div class="Version-dialog">
        <div class="shelf-item" v-for="(item, index) in verNoList" :key="index">
          <ami-model-title :title="item.verNo">
            <span>{{ item.createTime }}</span>
          </ami-model-title>
          <ami-clamp :maxLines="maxLines" showtip style="width: 100%" effect="light" :expanded="expanded" :text="item.verDesc">
            <!--  判断行数，大于1显示 -->
            <span class="comment-zhan" slot="after" v-show="maxLines > 1" @click="expanded = !expanded">
              {{ expanded ? "收起" : "更多" }}
            </span>
          </ami-clamp>
        </div>
      </div>
      <ami-empty v-if="verNoList == ![]" description="暂无数据"></ami-empty>
      <span slot="footer" class="dialog-footer">
        <ami-button round type="primary" @click="handleCancel()">确 定</ami-button>
      </span>
    </ami-dialog>
  </div>
</template>
<script>
export default {
  name: "AMI-MA0102054-18",
  props: {
    versionVisible: {
      type: Boolean,
      default: false,
    },
    verNoList: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      maxLines: 2, //最大行数
      expanded: false, //展开--显示状态
    };
  },
  methods: {
    // 关闭弹窗
    handleCancel() {
      this.$emit("update:versionVisible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.Version {
  width: 100%;
  height: 100%;
  &-dialog {
    width: 100%;
    height: 100%;
    overflow: auto;
    max-height: 560px;
    .shelf-item {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #e8e8e8;
      /deep/ .ami-model-title {
        margin: 0px 0px 0px -17px;
      }
      .comment-zhan {
        font-size: 14px;
        cursor: pointer;
        right: 10px;
        color: #0040d1;
      }
    }
  }
}
</style>
