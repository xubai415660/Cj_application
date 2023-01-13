<!--
 * @description: 提交功能设计结论
 * @author: 王浩
 * @Date: 2023-01-02 14:27:54
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <ami-card class="designConclusion" :Approval="Approval">
    <!-- 简介 -->
    <div class="designConclusion-header">
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
    <div class="designConclusion-version">
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
    <div class="designConclusion-upgrade">
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
    <div class="designConclusion-design">
      <ami-model-title title="设计文件" />
      <ami-row style="margin-left: 24px">
        <ami-col :span="8">
          <div class="fileMain">
            <span>基座设计说明书：</span>
            <div class="download_nei">
              <ami-svg-icon :name="fileType['docx']" class="icon-img"></ami-svg-icon>
              <span @click="previewer(item)">基座设计说明书.word</span>
              <img :src="require('@/assets/img/xia_icon.png')" @click="downloader(item)" />
            </div>
          </div>
        </ami-col>
        <ami-col :span="8">
          <div class="fileMain">
            <span>数据模型设计说明书：</span>
            <div class="download_nei">
              <ami-svg-icon :name="fileType['docx']" class="icon-img"></ami-svg-icon>
              <span @click="previewer(item)">数据模型设计说明书.word</span>
              <img :src="require('@/assets/img/xia_icon.png')" @click="downloader(item)" />
            </div>
          </div>
        </ami-col>
      </ami-row>
    </div>
    <!-- 功能设计评审结论 -->
    <div class="designConclusion-review">
      <ami-model-title title="功能设计评审结论" />
      <ami-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="165px">
        <ami-row>
          <ami-form-item label="功能设计评审结论" prop="auditStatus">
            <ami-radio-group v-model="ruleForm.auditStatus" @change="change_auditResult($event)">
              <ami-radio label="02">通过</ami-radio>
              <ami-radio label="03">不通过</ami-radio>
            </ami-radio-group>
          </ami-form-item>
        </ami-row>
        <ami-row>
          <ami-form-item label="评审结论说明" prop="pubAuditDesc">
            <ami-input
              type="textarea"
              v-model.trim="ruleForm.pubAuditDesc"
              :rows="4"
              maxlength="1000"
              show-word-limit
              placeholder="请输入评审结论说明"
            ></ami-input>
          </ami-form-item>
        </ami-row>
        <ami-row class="minutes">
          <ami-form-item label="功能设计评审会议纪要" prop="fileList">
            <UploadModalExample
              ref="uploadModal"
              :uploadShow="true"
              name="选择文件"
              uploadFormat="支持上传格式：DOC、DOCX、XLSX、PDF"
            ></UploadModalExample>
          </ami-form-item>
        </ami-row>
      </ami-form>
    </div>
    <!-- 功能按钮 -->
    <div class="add-button">
      <ami-button round @click="resetForm('ruleForm')">取 消</ami-button>
      <ami-button round type="primary" @click="submitForm('ruleForm')">确 定</ami-button>
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
import { fileType } from "@/utils/application";
import UploadModalExample from "@/components/UploadModalExample";
export default {
  name: "AMI-MA0102054-16",
  mixins: [mixins],
  data() {
    var validateFile = (rule, value, callback) => {
      if (this.$refs.uploadModal.uploadedFileList.length == 0) {
        callback(new Error("请上传文件"));
      } else {
        callback();
      }
    };
    return {
      fileType: fileType,
      Approval: {}, //详情数据
      ruleForm: {
        auditStatus: "", //功能设计评审结论
        pubAuditDesc: "", //评审结论说明
        fileList: [], //附件
      },
      rules: {
        auditStatus: [{ required: true, message: "请选择功能设计评审结论", trigger: "change" }],
        pubAuditDesc: [{ required: true, message: "请输入评审结论说明", trigger: "blur" }],
        fileList: [{ validator: validateFile, trigger: "blur" }],
      },
    };
  },
  components: {
    UploadModalExample,
  },
  mounted() {},
  methods: {
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: "提交成功",
            type: "success",
          });
          this.remoteRoute.closePath({
            path: "/base_designConclusion",
            toPath: "/mf0102054/base",
          });
        } else {
          return false;
        }
      });
    },
    // 取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.remoteRoute.closePath({
        path: "/base_designConclusion",
        toPath: "/mf0102054/base",
      });
    },
    // 下载附件
    downloader(item) {
      console.log(item);
    },
    // 更改_审核结果
    change_auditResult(val) {
      if (val == "02") {
        this.ruleForm.pubAuditDesc = "同意";
      } else {
        this.ruleForm.pubAuditDesc = "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.designConclusion {
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
    .fileMain {
      display: flex;
      height: 40px;
      line-height: 40px;
      span {
        font-size: 14px;
      }
      .download_nei {
        display: flex;
        align-items: center;
        width: 50%;
        height: 40px;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        padding: 10px;
        position: relative;
        .icon-img {
          width: 24px;
          height: 24px;
          margin-right: 20px;
        }
        span {
          width: 80%;
          font-size: 14px;
          cursor: pointer;
        }
        span:hover {
          color: #0040d0;
          text-decoration: underline;
        }
        img {
          position: absolute;
          cursor: pointer;
          right: 20px;
        }
      }
    }
  }
  &-review {
    width: 100%;
    .minutes {
      width: 100%;
      /deep/ .ami-form-item__content {
        line-height: 20px;
      }
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
