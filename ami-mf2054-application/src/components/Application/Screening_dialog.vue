<!--
 * @description: 应用详情-筛选弹窗
 * @author: 王浩
 * @Date: 2022-10-15 17:18:38
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="screening">
    <ami-dialog title="选择单位" width="960px" :visible.sync="ScreeningVisible" :before-close="handleCancel">
      <div class="screening-main">
        <ami-checkbox-group v-model="checkboxGroup">
          <ami-checkbox-button
            @change="handleCheckedCitiesChange"
            label="10000"
            :checked="checkAll"
            v-model="checkAll"
            class="check"
            >全部
          </ami-checkbox-button>
          <ami-checkbox-button
            v-for="(item, index) in apply_unit"
            :label="item.no"
            :key="index"
            @change="handleCheckedCitiesChanges"
            class="check"
            >{{ item.name }}
          </ami-checkbox-button>
        </ami-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <ami-button type="primary" @click="handlesub()" round>确 定</ami-button>
      </span>
    </ami-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "AMI-MA0102054-17",
  props: {
    ScreeningVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checkAll: false, //多选
      checkboxGroup: [], //多选
    };
  },
  computed: {
    ...mapGetters(["apply_unit"]),
  },
  methods: {
    ...mapActions(["getApplyUnit"]),
    // 全选
    handleCheckedCitiesChange(value) {
      if (value) {
        this.checkboxGroup = ["10000"];
        this.apply_unit.forEach((item) => {
          this.checkboxGroup.push(item.no);
        });
      } else {
        this.checkboxGroup = [];
      }
    },
    // 发布范围多选
    handleCheckedCitiesChanges() {
      let lengths = [];
      if (this.checkboxGroup[0] == "10000") {
        lengths = this.checkboxGroup.slice(1);
      } else {
        lengths = this.checkboxGroup;
      }
      if (lengths.length != this.apply_unit.length) {
        if (this.checkboxGroup[0] == "10000") {
          this.checkboxGroup.splice(0, 1);
        }
      } else {
        this.checkboxGroup.unshift("10000");
      }
    },
    // 确定
    handlesub() {
      this.$emit("scrInfo", this.checkboxGroup);
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("update:ScreeningVisible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.screening {
  width: 100%;
  height: 100%;
  &-main {
    width: 100%;
    height: 100%;
    overflow: auto;
    max-height: 600px;
    // 多选框
    /deep/ .ami-checkbox-button,
    .ami-checkbox-button__inner {
      margin: 3px 0px;
    }
    /deep/ .ami-checkbox-button__inner {
      border-radius: 15px;
      margin-right: 15px;
      border: 1px solid #edeef5;
    }
    /deep/ .ami-checkbox-button:first-child .ami-checkbox-button__inner {
      border-radius: 15px;
      margin-right: 15px;
      border-left-color: snow;
    }
    /deep/ .ami-checkbox-button:last-child .ami-checkbox-button__inner {
      border-radius: 15px;
      margin-right: 15px;
      border-left-color: snow;
    }
    /deep/ .ami-checkbox-button.is-checked .ami-checkbox-button__inner {
      color: #fff;
      background-color: #0040d1;
      border-color: #0040d1;
    }
  }
}
</style>
