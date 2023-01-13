<!--
 * @description: 基座档案详情
 * @author: 王浩
 * @Date: 2023-01-02 14:44:13
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <ami-card class="details" :Approval="Approval">
    <!-- 简介 -->
    <div class="details-header">
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
    <div class="details-version">
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
    <div class="details-upgrade">
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
    <div class="details-design">
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
export default {
  name: "AMI-MA0102054-18",
  mixins: [mixins],
  data() {
    return {
      fileType: fileType,
      Approval: {}, //详情数据
    };
  },
  mounted() {},
  methods: {
    // 下载文件
    downloader() {},
  },
};
</script>
<style lang="scss" scoped>
.details {
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
  &-design,
  &-designReview {
    width: 100%;
    padding: 10px 0px;
    .row {
      margin-left: 24px;
      margin-bottom: 12px;
    }
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
}
</style>
