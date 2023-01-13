<!--
 * @description:文件预览-弹窗
 * @author: 王浩
 * @Date: 2022-06-15 15:19:11
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="Preview">
    <ami-dialog width="960px" :titleIcon="true" :title="fileName" :visible.sync="visible" :before-close="beforeClose">
      <!-- 视频格式预览 -->
      <div v-if="videoType.includes(fileType)" style="width: 100%; height: 100%">
        <ami-video ref="videoPlayer" style="width: 100%" :src="video_url"> </ami-video>
      </div>
      <div class="Preview-main" v-loading="loading" v-else>
        <!-- xlsx预览 -->
        <excel-preview
          v-if="visible && fileType === 'xlsx'"
          style="height: 600px; width: 100%; z-index: 9999"
          ref="onlineRef"
          :id="id"
          :container="container"
          :fileName="fileName"
          :fileId="fileId"
          :loadUrl="loadUrl"
          :loadSheetUrl="loadSheetUrl"
          :allowEdit="allowEdit"
          :editable="allowEdit"
          :allowUpdate="allowUpdate"
          :updateUrl="updateUrl"
        ></excel-preview>
        <div v-else-if="fileType === 'txt'">{{ content }}</div>
        <!-- 转成pdf预览 -->
        <div v-else-if="fileType !== 'xlsx'" style="width: 100%; height: 100%">
          <pdf ref="pdf" v-for="i in pages" :key="i" :src="files" :page="i"></pdf>
        </div>
        <!-- 文本格式 -->
      </div>
    </ami-dialog>
  </div>
</template>
<script>
import pdf from "vue-pdf";
import excelPreview from "./excelPreview.vue";
import { downLoadFile, onlinePreview, addOrUpdExcel } from "@/api/public/public";
const moduleId = require("../../../package.json").moduleId.toLowerCase();
export default {
  name: "AMI-MA0102069-15",
  props: {
    /**
     * fileName:文件名称
     * @description: 文件名称
     */
    fileName: {
      type: String,
      required: true,
    },
    /**
     * fileId：文件id
     * @description:文件id
     */
    fileId: {
      type: String,
      required: true,
    },
    /**
     * fileType
     * @description:文件类型
     */
    fileType: {
      required: true,
      type: String,
    },
    /**
     * updateUrl
     * @description:更新url
     */
    updateUrl: {
      type: String,
      default: "",
    },
    /**
     * allowEdit：是否允许编辑
     * @description:是否可编辑
     */
    allowEdit: {
      type: Boolean,
      default: false,
    },
    /**
     * 弹窗原生属性 必传
     */
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    excelPreview,
    pdf,
  },
  data() {
    return {
      loading: false, //加载中
      allowUpdate: this.allowEdit, //是否允许更新
      luckySheetFlag: false, //是否显示luckySheet
      pdfDoc: null, //pdf文档
      pages: 0, //页数
      files: "", //文件地址
      file: {}, //文件对象
      content: "", //文本内容
      video_url: "", //视频地址
      id: moduleId + "-online-excel",
      container: "luckysheet_" + new Date().getTime(),
      loadUrl: "/ami/ma01-02-061/api/load",
      loadSheetUrl: "/ami/ma01-08-888/api/loadsheet",
      updateUrlForData: this.updateUrl,
      // 视频格式
      videoType: [
        "video/mp4",
        "video/3gp",
        "video/webm",
        "video/ogg",
        "avi",
        "wmv",
        "mpeg",
        "mp4",
        "m4v",
        "mov",
        "asf",
        "flv",
        "f4v",
        "rmvb",
        "rm",
        "3gp",
        "vob",
      ],
    };
  },
  computed: {
    change() {
      const { allowEdit, fileId } = this;
      return {
        allowEdit, //是否允许编辑
        fileId, //文件id
      };
    },
  },
  watch: {
    change() {
      this.init();
    },
    visible(val) {
      if (val) {
        this.init();
      }
    },
  },
  methods: {
    init() {
      this.loadFileInternal();
    },
    loadFileInternal() {
      this.loading = true;
      // 视频预览
      if (this.videoType.includes(this.fileType)) {
        const domian = window.location.origin;
        // 视频地址
        this.video_url = domian + "/ami/ma01-02-056/minio-file/previewVideo?fileId=" + this.fileId;
        this.loading = false;
        // xlsx预览
      } else if (this.fileType === "xlsx") {
        this.loading = false;
      }
      // txt预览
      else if (this.fileType === "txt") {
        downLoadFile({
          fileId: this.fileId,
          fileName: this.fileName,
          fileType: this.fileType,
        }).then((res) => {
          this.loading = false;
          var reader = new FileReader();
          // 以文本的方式读取blob中的内容
          reader.readAsText(res.data);
          reader.onload = function (evt) {
            //内容就在这里
            this.content = evt.target.result;
          }.bind(this);
        });
      } else {
        // 除excel外的附件预览-转成pdf格式
        onlinePreview({
          fileIdVo: this.fileId,
          fileType: this.fileType,
        })
          .then((res) => {
            const fileBlob = new Blob([res.data], { type: "application/pdf" });
            this.files = window.URL.createObjectURL(fileBlob);
            this.loadFile(this.files);
          })
          .catch(() => {
            this.loading = false;
            this.$message.warning("加载失败");
          });
      }
    },
    // 加载文件
    loadFile(url) {
      let loadingTask = pdf.createLoadingTask(url);
      loadingTask.promise
        .then((pdf) => {
          this.loading = false;
          this.pages = pdf.numPages;
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: "文件加载失败",
            type: "warning",
          });
        });
    },
    // 获取数据--excel 表格编辑
    getData(val) {
      let newFormData = new FormData();
      newFormData.append("fileId", this.fileId);
      newFormData.append("fileType", this.fileType);
      newFormData.append("fileName", this.fileName);
      newFormData.append("wb", JSON.stringify(val));
      addOrUpdExcel(newFormData)
        .then((res) => {
          this.$message({
            message: "数据保存成功！",
            type: "success",
          });
          this.$emit("saveSuccess", { fileId: res.data.data.fileId });
          this.beforeClose();
        })
        .catch(() => {
          this.$message({
            message: "数据保存失败！",
            type: "warning",
          });
          this.loading = false;
        });
    },
    // 关闭弹窗
    beforeClose() {
      // 清空数据
      this.video_url = "";
      this.content = "";
      if (this.videoType.includes(this.fileType)) {
        // 关闭弹窗销毁组件
        this.$refs.videoPlayer.$refs.videoPlayer.player.pause();
      }
      this.$emit("update:visible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.Preview {
  width: 100%;
  height: 100%;
  .Preview-main {
    height: 600px;
    overflow-y: auto;
    /deep/ .luckysheet-share-logo {
      display: none;
    }
  }
  /deep/ .video-js .vjs-progress-control {
    display: none !important; //先隐藏
  }
}
</style>
