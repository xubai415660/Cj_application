<!--
 * @description: 表格（合并）附件上传-弹窗
 * @author: 王浩
 * @Date: 2023-01-05 14:34:29
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <div class="UploadModalFile">
    <ami-dialog :title="titleIcon" width="25%" :visible.sync="TableVisible" :before-close="handleCancel">
      <ModalFileUpload
        ref="modalUploader"
        :config="configBlue"
        @UploadStatusChange="uploadStatusChange"
        @fileUploadFinished="fileUploadFinishedHandle"
        @fileTitleChanged="fileTitleChangedHandle2"
      />
      <div slot="footer" class="dialog-footer">
        <ami-button type="primary" :loading="true" v-if="uploadStatus === 'u'">上传中</ami-button>
        <ami-button type="primary" @click="reUpload()" v-if="uploadStatus === 'f'">断点续传</ami-button>
        <ami-button @click="cancel" v-if="uploadStatus !== 'u' && uploadStatus !== 'f'">取 消</ami-button>
        <ami-button type="primary" @click="confirm" v-if="uploadStatus !== 'u' && uploadStatus !== 'f'">确 定</ami-button>
      </div>
    </ami-dialog>
  </div>
</template>
<script>
import { deepClone } from "@/utils/util";
import { IFileConfigBlue } from "@/components/FileUploaderBlue/IFileConfigBlue";
import ModalFileUpload from "@/components/FileUploaderBlue/modalFileUpload";
const configBlue = new IFileConfigBlue();
export default {
  name: "UploadModalFile",
  components: { ModalFileUpload },
  data() {
    return {
      uploadStatus: "n",
      uploadedFileList: [],
    };
  },
  props: {
    titleIcon: {
      type: String,
      default: "附件上传",
    },
    // 弹窗显示隐藏
    TableVisible: {
      type: Boolean,
      default: false,
    },
    // 上传配置
    configBlue: {
      type: Object,
      default: () => {
        return {
          configBlue,
        };
      },
    },
  },
  methods: {
    // 上传状态
    uploadStatusChange(e) {
      this.uploadStatus = e;
    },
    // 上传完成
    fileUploadFinishedHandle(e) {
      // 通知子组件
      this.$emit("uploadSuccess", e);
    },
    // 断点续传
    reUpload() {
      this.$refs.modalUploader.helper.reUpload();
    },
    // 重传
    fileTitleChangedHandle2(e) {
      const t = deepClone(this.uploadedFileList);
      const index = t.findIndex((item) => item.fileId === e.fileId);
      if (index > -1) {
        t[index].fileName = e.newName.split(".")[0];
        t[index].fullName = e.newName;
        this.uploadedFileList = t;
      }
    },
    // 确定
    confirm() {
      this.$emit("update:TableVisible", false);
      this.$refs.modalUploader.helper.clear();
    },
    // 取消
    cancel() {
      this.$emit("update:TableVisible", false);
      this.$refs.modalUploader.helper.clear();
    },
    // 清空列表
    clear() {
      this.$refs.modalUploader.helper.clear();
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("update:TableVisible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.UploadModalFile {
  width: 100%;
  height: 100%;
  .mag-t-12 {
    margin-top: 12px;
  }
  .mag-l-20 {
    margin-left: 20px;
  }
  .icon {
    /deep/ .ami-icons-daoru:before {
      content: "\e62c";
      color: #0040d1;
      font-size: 16px;
    }
  }
}
</style>
