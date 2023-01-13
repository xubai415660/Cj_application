<!--
 * @description: 提交设计文件
 * @author: 王浩
 * @Date: 2023-01-02 14:26:15
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <ami-card class="designfile" :Approval="Approval">
    <!-- 简介 -->
    <div class="designfile-header">
      <div class="header-top">
        <div class="header-img">
          <img :src="Icon(Approval.appIcon)" :onerror="defaultImg" />
        </div>
        <div class="header-mark">
          <div class="mark-start">
            <span class="mask-title">{{ Approval.appName == null ? "--" : Approval.appName }}</span>
            <span>({{ Approval.attributeTypeName == null ? "--" : Approval.attributeTypeName }})</span>
            <div>{{ Approval.busClsName == null ? "--" : Approval.busClsName }}</div>
          </div>
          <p>{{ Approval.appInfo == null ? "--" : Approval.appInfo }}</p>
        </div>
      </div>
    </div>
    <!-- 版本说明 -->
    <div class="designfile-version">
      <ami-model-title title="版本说明">
        <div class="scope-btn">
          <ami-button type="text" @click="operation_log()">
            <span class="text">操作日志</span>
          </ami-button>
          <ami-button type="text" @click="handle_relation()">
            <span class="text"> 关联需求</span>
          </ami-button>
          <ami-button type="text" @click="Associate_defects()">
            <span class="text"> 关联缺陷</span>
          </ami-button>
        </div>
      </ami-model-title>
      <p>{{ Approval.verDesc == null ? "--" : Approval.verDesc }}</p>
    </div>
    <!-- 升级原因 -->
    <div class="designfile-upgrade">
      <ami-model-title title="升级说明" />
      <div class="shelves-main">
        <ami-row>
          <ami-col :span="1">
            <span class="shelf-txt">升级原因：</span>
          </ami-col>
          <ami-col :span="22">{{ Approval.rmApplyDesc == null ? "--" : Approval.rmApplyDesc }} </ami-col>
        </ami-row>
      </div>
    </div>
    <!-- 设计文件 -->
    <div class="designfile-design">
      <ami-model-title title="设计文件" />
      <ami-row style="line-height: 40px">
        <ami-col :span="1.5">
          <div class="xing" style="margin-right: 4px; color: #ec5757">*</div>
          <span>设计文件：</span>
        </ami-col>
        <ami-col :span="22">
          <UploadDialog class="upload" ref="base" name="基座设计说明书" @uploadSuccess="uploadSuccess" />
          <UploadDialog class="upload" ref="model" name="数据模型设计说明书" @uploadSuccess="uploadSuccess" />
          <br />
          <span class="format">支持上传格式：DOC、DOCX、XLSX、PDF</span>
          <FileViewer
            v-for="(file, index) in viewerList"
            :key="'file_viewer2_' + index"
            :file="file"
            style="display: inline-block; width: 45%; margin-right: 10px"
            :class="{ 'mag-l-20': index > 0 }"
            @deleteFileHanppened="viewerDeleteFile"
          />
        </ami-col>
      </ami-row>
    </div>
    <!-- 功能按钮 -->
    <div class="add-button">
      <ami-button round @click="handleClose()">取 消</ami-button>
      <ami-button round type="primary" @click="submitForm()">确 定</ami-button>
    </div>
    <!-- 弹窗 -->
    <div class="dialong">
      <!-- 操作日志弹窗-流程 -->
      <OperationDialog :OperationVisible.sync="OperationVisible" :operationList="operationList"></OperationDialog>
      <!-- 关联需求弹窗 -->
      <AssociateDialog :AssociateVisible.sync="AssociateVisible" :AssociateList="AssociateList"></AssociateDialog>
      <DefectDialog :DefectVisible.sync="DefectVisible"></DefectDialog>
      <!-- 预览弹窗 -->
      <PreviewDialog
        :visible.sync="visible"
        :allowEdit="allowEdit"
        :fileId="file.fileId"
        :fileName="file.fileName"
        :fileType="file.fileType"
      ></PreviewDialog>
    </div>
  </ami-card>
</template>
<script>
import mixins from "./mixins";
import { mapping } from "@/components/FileUploaderBlue/mapping";
import UploadDialog from "@/components/UploadDialog";
import FileViewer from "@/components/FileUploaderBlue/fileViewer";
import { IFileViewerBlue } from "@/components/FileUploaderBlue/IFileViewerBlue";
import { fileUploadRemover } from "@/api/application/application";
export default {
  name: "AMI-MA0102054-15",
  mixins: [mixins],
  data() {
    return {
      Approval: {}, //详情数据
      viewerList: [], // 文件预览列表
      DesignfileList: [
        { name: "基座设计说明书", ref: "base", fileList: [] },
        { name: "数据模型设计说明书", ref: "model", fileList: [] },
      ],
    };
  },
  components: {
    UploadDialog,
    FileViewer,
  },
  mounted() {},
  methods: {
    // 保存
    submitForm() {
      if (this.DesignfileList[0].fileList.length == 0) {
        this.$message.warning("请上传基座设计说明书");
        return;
      } else if (this.DesignfileList[1].fileList.length == 0) {
        this.$message.warning("请上传数据模型设计说明书");
        return;
      } else {
        this.$message.success("保存成功");
        this.remoteRoute.closePath({
          path: "/base_designfile",
          toPath: "/mf0102054/base",
        });
      }
    },
    // 取消
    handleClose() {
      // 清空文件列表
      this.DesignfileList.forEach((item) => {
        item.fileList = [];
      });
      this.remoteRoute.closePath({
        path: "/base_designfile",
        toPath: "/mf0102054/base",
      });
    },
    // 文件上传成功
    uploadSuccess(e, name) {
      if (e && e.length && name) {
        const t = new IFileViewerBlue();
        for (const file of e) {
          const source = file.data.data;
          t.type = mapping[source.fileType] ? mapping[source.fileType] : "text/plain";
          t.delFlag = false;
          t.fileId = source.fileId;
          t.fullName = source.fullName;
          t.fileType = source.fileType;
        }
        // 给预览列表添加数据
        this.viewerList.push(t);
        // 给对应的设计文件列表添加数据
        this.DesignfileList.forEach((item) => {
          if (item.name === name) {
            item.fileList.push(t);
          }
        });
      }
    },
    // 文件删除
    viewerDeleteFile(e) {
      fileUploadRemover({ fileId: e.fileId })
        .then((res) => {
          if (res.data.code == 200) {
            this.viewerList = this.viewerList.filter((item) => item.fileId !== e.fileId);
            this.DesignfileList.forEach((item) => {
              item.fileList = item.fileList.filter((item) => item.fileId !== e.fileId);
            });
            this.$message.success("删除成功");
          }
        })
        .catch(() => {
          this.$message.error("删除失败");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.designfile {
  width: calc(100% - 24px);
  height: calc(100% - 12px);
  margin: 0 auto;
  overflow-y: auto;
  &-header {
    width: 100%;
    padding: 10px;
    .header-top {
      display: flex;
      width: 100%;
      margin-bottom: 20px;
      .header-img {
        width: 90px;
        height: 90px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
      .header-mark {
        width: 100%;
        margin-left: 20px;
        .mark-start {
          width: 100%;
          height: 36px;
          line-height: 36px;
          .mask-title {
            font-size: 21px;
            font-weight: bold;
          }
          div {
            display: inline-block;
            height: 28px;
            line-height: 28px;
            padding: 0px 6px;
            background: #f2f2f2;
            margin-left: 24px;
            border-radius: 6px;
          }
          span:nth-child(3) {
            margin-left: 24px;
            font-size: 14px;
            color: #666;
          }
          .text {
            float: right;
            margin-left: 30px;
            font-size: 15px;
            font-weight: bold;
            text-decoration: underline;
          }
        }
        p {
          overflow: hidden;
          font-size: 14px;
          font-weight: 400;
          width: 100%;
          display: -webkit-box;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2; /*截取2行*/
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  &-version {
    width: 100%;
    padding: 10px 0px;
    span:nth-child(1) {
      color: #666;
      font-size: 14px;
    }
    .scope-btn {
      display: inline-block;
      .text {
        color: #0040d1;
        margin-left: 10px;
        font-size: 15px;
        font-weight: bold;
        text-decoration: underline;
      }
    }
    p {
      margin: 0px;
      font-size: 14px;
      font-weight: 400;
      word-break: break-all;
    }
  }
  &-upgrade {
    width: 100%;
    .shelves-main {
      width: 100%;
      margin-left: 24px;
      .xia {
        cursor: pointer;
        color: #0040d1;
        margin-left: 12px;
        font-size: 14px;
        font-weight: bold;
        text-decoration: underline;
      }
    }
  }
  &-design {
    width: 100%;
    padding: 10px 0px;
    .xing {
      display: inline-block;
      margin-right: 4px;
      color: #ec5757;
    }
    .upload {
      display: inline-block;
      margin-right: 12px;
    }
    .format {
      display: block;
      color: #909399;
      font-size: 12px;
    }
  }
  .add-button {
    height: 60px;
    padding: 12px;
    padding-left: 0px;
    display: flex;
    justify-content: right;
  }
}
</style>
