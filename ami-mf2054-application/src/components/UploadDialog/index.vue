<!--
 * @description: 提交设计文件-上传文件弹窗
 * @author: 王浩
 * @Date: 2022-11-11 15:23:38
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <div class="UploadDialog">
    <ami-button class="icon" icon="ami-icons-daoru" @click="handFormVisible()">{{ name }}</ami-button>
    <ami-dialog :visible.sync="dialogFormVisible" :titleIcon="titleIcon" width="480px">
      <ModalFileUpload
        ref="modalUploader"
        :config="configBlue"
        @UploadStatusChange="uploadStatusChange"
        @fileUploadFinished="fileUploadFinishedHandle2"
        @fileDeleteFinished="fileDeleteFinishedHanlde"
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
import ModalFileUpload from "@/components/FileUploaderBlue/modalFileUpload";
import { IFileConfigBlue } from "@/components/FileUploaderBlue/IFileConfigBlue";
import { deepClone } from "@/utils/util";
const configBlue = new IFileConfigBlue();
configBlue.isMultiple = true;
export default {
  name: "UploadDialog",
  data() {
    return {
      dialogFormVisible: false,
      configBlue: configBlue,
      titleIcon: false,
      uploadStatus: "n",
      uploadedFileList: [],
    };
  },
  props: {
    name: {
      type: String,
      default: "上传",
    },
  },
  components: {
    ModalFileUpload,
  },
  methods: {
    // 上传弹窗
    handFormVisible() {
      // 当附件列表有一个的时候，提示只能上传一个附件
      if (this.uploadedFileList.length == 1) {
        this.$message({
          message: `只能上传一个附件`,
          type: "warning",
          duration: 2000,
        });
        return;
      }
      this.dialogFormVisible = true;
    },
    // 断点续传
    reUpload() {
      this.$refs.modalUploader.helper.reUpload();
    },
    // 上传状态
    uploadStatusChange(e) {
      this.uploadStatus = e;
    },
    // 上传完成
    fileUploadFinishedHandle2(e) {
      console.log(e);
      // 通知子组件
      this.$emit("uploadSuccess", e, this.name);
      // if (e && e.length) {
      //   for (const file of e) {
      //     const f = deepClone(file.data.data);
      //     f.delFlag = false;
      //   }
      // }
    },
    fileDeleteFinishedHanlde(e) {
      this.uploadedFileList = this.uploadedFileList.filter((item) => item.fileId !== e.fileId);
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
    confirm() {
      this.dialogFormVisible = false;
      this.$refs.modalUploader.helper.clear();
    },
    cancel() {
      this.dialogFormVisible = false;
      this.$refs.modalUploader.helper.clear();
    },
  },
};
</script>
<style lang="scss" scoped>
.UploadDialog {
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
