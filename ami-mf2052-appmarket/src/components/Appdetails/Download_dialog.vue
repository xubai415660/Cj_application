<!--
 * @description: 下载功能弹窗
 * @author: 王浩
 * @Date: 2022-04-02 10:08:23
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="Download">
    <ami-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <!-- 标题 -->
      <div slot="title" class="Download-title">
        <div class="title-icon"></div>
        <span>下载应用</span>
      </div>
      <div class="Download-select">
        <ami-form ref="form" :model="form" label-width="100px">
          <ami-form-item label="当前使用版本">
            <ami-select v-model="verRecProVerNo" placeholder="请选择版本" @change="getRole($event)">
              <ami-option v-for="item in Versiondata" :key="item.verNo" :label="item.verNo" :value="item.verNo"></ami-option>
            </ami-select>
          </ami-form-item>
        </ami-form>
      </div>
      <!-- 表单 -->
      <ami-table
        ref="multipleTable"
        align="center"
        style="width: 100%"
        size="small"
        :data="renumber"
        @selection-change="handleSelectionChange"
      >
        <ami-table-column type="selection" width="80"> </ami-table-column>
        <ami-table-column prop="verNo" label="版本号"> </ami-table-column>
        <ami-table-column prop="createTime" label="发布日期"> </ami-table-column>
      </ami-table>
      <span slot="footer" class="dialog-footer">
        <ami-button @click="handleClose()">取 消</ami-button>
        <ami-button type="primary" @click="download()">下 载</ami-button>
      </span>
    </ami-dialog>
  </div>
</template>
<script>
import { getUserInfo } from "@/utils/store";
import { exportFile } from "@/utils/exportFile";
import { information, downLoadFile } from "@/api/market/market.js";
export default {
  name: "AMI-MA0102052-11",
  props: {
    //弹窗
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    //传递数据
    Versiondata: {
      type: Array,
      default: () => [],
    },
    info: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.userInfo = getUserInfo();
  },
  data() {
    return {
      userInfo: {},
      form: {}, //表单
      renumber: [], //当前版本号
      appVerIds: [], //id的集合
      verRecProVerNo: "", //省测当前版本号
      multipleSelection: [], //多选数据
    };
  },
  methods: {
    // 下载
    download() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择版本号",
          type: "warning",
        });
        return;
      } else if (this.multipleSelection.length > 1) {
        this.$message({
          message: "只能选择一个版本号",
          type: "warning",
        });
        return;
      } else {
        let params = {
          appCls: this.info.appCls,
          appId: this.info.appId,
          verNo: this.multipleSelection[0].verNo,
          appVerId: this.multipleSelection[0].appVerId,
          dlUserNo: this.userInfo.operatorId, //登陆人的账号
        };
        downLoadFile(params)
          .then((res) => {
            if (res.status === 200) {
              console.log(res);
              exportFile(res);
              this.$message({
                type: "success",
                message: "文件下载成功!",
              });
              this.$emit("init");
              //下载成功关闭弹窗
              this.$emit("update:dialogVisible", false);
            }
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "文件下载失败!",
            });
          });
      }
    },
    // 数据联动
    getRole(val) {
      let params = {
        appId: this.info.appId,
        verNo: val,
        mgtOrgCode: this.userInfo.mgtOrgCode,
      };
      information(params).then((res) => {
        if (res.data.code === 200) {
          this.renumber = res.data.data;
        }
      });
    },
    // 赋值
    verRecProVerNole(val) {
      this.verRecProVerNo = val;
    },
    // 全选
    select_all() {
      this.$refs.multipleTable.toggleAllSelection();
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 取消多选内容
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.Download {
  &-title {
    span {
      margin-left: 12px;
    }
    .title-icon {
      position: absolute;
      width: 4px;
      height: 17px;
      background: #0040d1;
      border-radius: 2px;
    }
  }
  &-select {
    width: 100%;
  }
  /deep/ .ami-dialog__body {
    padding: 30px;
  }
}
</style>
