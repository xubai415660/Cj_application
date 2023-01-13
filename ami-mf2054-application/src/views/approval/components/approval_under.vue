<!--
 * @description: 下架审批
 * @author: 王浩
 * @Date: 2022-10-12 10:38:20
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <ami-card class="under" :Approval="Approval">
    <!-- 简介 -->
    <div class="under-header">
      <div class="header-top">
        <div class="header-img">
          <img :src="Icon(Approval.appIcon)" :onerror="defaultImg" />
        </div>
        <div class="header-mark">
          <div class="mark-start">
            <span class="mask-title">{{ Approval.appName }}</span>
            <span>({{ Approval.attributeTypeName == null ? "--" : Approval.attributeTypeName }})</span>
            <span>适合基座版本：{{ Approval.verNo }}</span>
            <div>{{ Approval.busClsName == null ? "--" : Approval.busClsName }}</div>
            <ami-button type="text" style="float: right">
              <span class="text" @click="handle_version()">版本历史记录</span>
            </ami-button>
          </div>
          <p>{{ Approval.appInfo == null ? "--" : Approval.appInfo }}</p>
        </div>
      </div>
      <!-- 发布范围 -->
      <div class="header-basic">
        <img :src="require('@/assets/img/ditu.jpg')" />
        <span> 发布范围:{{ Approval.pubRange }}</span>
        <div class="Cutin">{{ Approval.pubType === "01" ? "全网发布" : "试点发布" }}</div>
      </div>
    </div>
    <!-- 版本说明 -->
    <div class="under-version">
      <ami-model-title title="版本说明">
        <span>更新时间：{{ Approval.lastChgTime == null ? "--" : Approval.lastChgTime }}</span>
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
    <!-- 附件列表 -->
    <div class="under-attachment">
      <ami-model-title title="附件列表" />
      <!-- 附件表单 -->
      <ami-table
        stripe
        border
        headerStripe
        class="tables"
        style="width: 100%"
        max-height="450"
        :data="AppendixData"
        :span-method="objectSpanMethod"
      >
        <ami-table-column prop="attTypeName" align="center" label="文件类型"> </ami-table-column>
        <ami-table-column align="center" label="文件名称" width="400">
          <template slot-scope="scope">
            <span style="color: #0004d0; cursor: pointer" @click="previewer(scope.row)"> {{ scope.row.attName }}</span>
          </template>
        </ami-table-column>
        <ami-table-column align="center" label="当前状态">
          <template slot-scope="scope">
            <div class="yuan"></div>
            <span>{{ scope.row.updateUserNo }}</span>
          </template>
        </ami-table-column>
        <ami-table-column prop="attSize" align="center" label="文件大小">
          <template slot-scope="scope">
            <span>{{ filterSize(scope.row.attSize) }}</span>
          </template>
        </ami-table-column>
        <ami-table-column prop="updateTime" align="center" label="上传日期"> </ami-table-column>
        <ami-table-column fixed="right" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <ami-button type="text" @click="download(scope.row)">下载</ami-button>
          </template>
        </ami-table-column>
      </ami-table>
    </div>
    <!-- 监测环节 -->
    <div class="under-shelves">
      <ami-model-title title="检测环节"></ami-model-title>
      <div class="shelves-main">
        <ami-row style="line-height: 40px">
          <ami-col :span="6">
            <span>是否有总部验签环节：{{ Approval.isSignVerify === 1 ? "是" : "否" }}</span>
          </ami-col>
          <ami-col :span="6">
            <span>第三方检测报告：XX检测报告.pdf</span>
            <span class="xia">下载</span>
          </ami-col>
        </ami-row>
      </div>
    </div>
    <!-- 下架申请 -->
    <div class="under-shelves">
      <ami-model-title title="下架申请信息"></ami-model-title>
      <div class="shelves-main">
        <ami-row style="line-height: 40px">
          <ami-col :span="6">
            <span>下架分类：{{ Approval.rmApplyType == null ? "应用下架" : Approval.rmApplyType }}</span>
          </ami-col>
          <ami-col :span="6">
            <span>下架原因：{{ Approval.rmApplyCls }}</span>
          </ami-col>
        </ami-row>
        <ami-row>
          <ami-col :span="2">
            <span class="shelf-txt">申请描述：</span>
          </ami-col>
          <ami-col :span="22">{{ Approval.rmApplyDesc == null ? "--" : Approval.rmApplyDesc }} </ami-col>
        </ami-row>
      </div>
    </div>
    <!-- 审批流程 -->
    <div class="release-approve">
      <ami-model-title title="下架审批意见"></ami-model-title>
      <ami-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
        <ami-row>
          <ami-form-item label="营销部审批意见" prop="auditStatus">
            <ami-radio-group v-model="ruleForm.auditStatus" @change="change_auditResult($event)">
              <ami-radio label="02">通过</ami-radio>
              <ami-radio label="03">不通过</ami-radio>
            </ami-radio-group>
          </ami-form-item>
        </ami-row>
        <ami-row>
          <ami-form-item label="营销部审批说明" prop="pubAuditDesc">
            <ami-input
              type="textarea"
              v-model.trim="ruleForm.pubAuditDesc"
              :rows="5"
              maxlength="300"
              show-word-limit
              placeholder="请输入审核说明"
            ></ami-input>
          </ami-form-item>
        </ami-row>
        <ami-row>
          <ami-form-item style="float: right">
            <ami-button round @click="resetForm('ruleForm')">取消</ami-button>
            <ami-button type="primary" round @click="submitForm('ruleForm')" :loading="loading">提交</ami-button>
          </ami-form-item>
        </ami-row>
      </ami-form>
    </div>
    <!-- 弹窗 -->
    <div class="dialong">
      <!-- 版本历史记录弹窗 -->
      <VersioneDialog v-if="versionVisible" :versionVisible.sync="versionVisible" :verNoList="verNoList"></VersioneDialog>
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
import { getUserInfo } from "@/utils/store";
import { remoteRoute } from "@/utils/remoteUtil";
import { queryInfoDetailById, addLowerShelflApproval } from "@/api/approval/approval";
export default {
  name: "AMI-MA0102054-12",
  mixins: [mixins],
  data() {
    return {
      loading: false,
      Approval: {}, //详情数据
      userInfo: {}, //当前登陆人信息
      AssociateList: {}, //关联需求列表数据
      AppendixData: [], //附件信息
      ruleForm: {
        auditStatus: "", //审批结果
        pubAuditDesc: "", // 审核描述
      },
      rules: {
        auditStatus: [{ required: true, message: "请选择审批意见", trigger: "change" }],
        pubAuditDesc: [{ required: true, message: "请输入审批描述", trigger: "blur" }],
      },
    };
  },
  created() {
    this.$nextTick(() => {
      this.userInfo = getUserInfo(); // 获取登陆人信息
      this.load_detail();
    });
  },
  methods: {
    // 查询-详情
    load_detail() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.$route.query.appVerId,
        evalOrgCodeList: [], //省份
      };
      queryInfoDetailById(params).then((res) => {
        if (res.data.code === 200) {
          this.Approval = res.data.data;
          this.AppendixData = res.data.data.attInfoVOList;
          this.Appendix(this.AppendixData); //附件
          // 处理发布范围-转换
          if (this.Approval.pubRangeList == null) return;
          this.Approval.pubRange = this.Approval.pubRangeList.map((item) => item.pubOrgName).join("\r");
        }
      });
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = {
            appId: this.Approval.appId, // 应用ID
            attStatus: "02", //	01：待上传 02：已上传
            appVerId: this.Approval.appVerId, //应用审批时：传应用版本唯一id
            auditStatus: this.ruleForm.auditStatus, //审批结果
            pubAuditDesc: this.ruleForm.pubAuditDesc, //审核描述
          };
          addLowerShelflApproval(params)
            .then((res) => {
              if (res.data.code === 200) {
                this.loading = false;
                this.$message.success("提交成功");
                remoteRoute.closePath({ path: "/approval_under" }); // 关闭标签页
                this.$router.push({ path: "/approval" });
              }
            })
            .catch(() => {
              this.loading = false;
              this.$message.error("提交失败");
            });
        } else {
          return false;
        }
      });
    },
    // 更改_审核结果
    change_auditResult(val) {
      if (val == "02") {
        this.ruleForm.pubAuditDesc = "同意";
      } else {
        this.ruleForm.pubAuditDesc = "";
      }
    },
    // 取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      remoteRoute.closePath({ path: "/approval_under" }); // 关闭标签页
      this.$router.push({ path: "/approval" });
    },
  },
};
</script>
<style lang="scss" scoped>
.under {
  width: calc(100% - 24px);
  height: calc(100% - 12px);
  margin: 0 auto;
  overflow-y: auto;
  &-header {
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #e8e8e8;
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
            margin-left: 12px;
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
    .header-basic {
      width: 100%;
      height: 40px;
      line-height: 40px;
      display: flex;
      margin-left: 12px;
      img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
      .Cutin {
        margin-left: 20px;
        height: 28px;
        line-height: 28px;
        border-radius: 6px;
        padding: 0px 6px;
        background: #f2f2f2;
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
  &-attachment {
    padding: 10px 0px;
    width: 100%;
    .tables {
      height: 100%;
      border-radius: 6px;
      .yuan {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #67c23a;
        display: inline-block;
        margin-right: 12px;
      }
    }
  }
  &-shelves {
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
  &-approve {
    width: 100%;
    padding: 10px;
  }
}
</style>
