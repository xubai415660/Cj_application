<!--
 * @description: 定制应用审批
 * @author: 王浩
 * @Date: 2022-10-12 10:47:03
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <ami-card class="custom" :custom="custom">
    <!-- 应用信息 -->
    <div class="custom-information">
      <ami-model-title title="应用信息"></ami-model-title>
      <div class="custom-mask">
        <ami-row :gutter="20">
          <ami-col :span="8">
            <span class="title"> 应用名称：</span>
            <span>{{ custom.appName }}</span>
          </ami-col>
          <ami-col :span="8">
            <span class="title"> 版本号：</span>
            <span>V{{ custom.verNo }}</span>
          </ami-col>
          <ami-col :span="8">
            <span class="title"> 应用分类：</span>
            <span>{{ custom.busClsName }}</span>
          </ami-col>
        </ami-row>
        <ami-row>
          <ami-col :span="1.5">
            <span class="title">应用介绍：</span>
          </ami-col>
          <ami-col :span="22">{{ custom.appInfo }}</ami-col>
        </ami-row>
        <ami-row>
          <ami-col :span="1.5">
            <span class="title">版本说明：</span>
          </ami-col>
          <ami-col :span="22">{{ custom.verDesc }} </ami-col>
        </ami-row>
        <!-- 附件 -->
        <ami-row :gutter="20">
          <ami-col :span="1.5">
            <span class="title" style="float: right">附件：</span>
          </ami-col>
          <span>{{ attInfoVO.attName == null ? "--" : attInfoVO.attName }}</span>
          <span v-show="attInfoVO !== null" class="xia" @click="handle_download(attInfoVO)">下载</span>
        </ami-row>
      </div>
    </div>
    <!-- 申请信息 -->
    <div class="custom-apply">
      <ami-model-title title="申请信息">
        <ami-button type="text" @click="handle_process()">
          <span class="text">查看流程节点</span>
        </ami-button>
      </ami-model-title>
      <div class="mask-info">
        <ami-row :gutter="20">
          <ami-col :span="6">
            <span class="title"> 申请人：</span>
            <span>{{ custom.createUserName }}</span>
          </ami-col>
          <ami-col :span="6">
            <span class="title"> 申请单位：</span>
            <span>{{ custom.ceMgtOrgName == null ? "--" : custom.ceMgtOrgName }}</span>
          </ami-col>
          <ami-col :span="6">
            <span class="title"> 申请时间：</span>
            <span>{{ getYearMonthDay(custom.createTime) }}</span>
          </ami-col>
        </ami-row>
        <ami-row>
          <ami-col :span="1.5">
            <span class="title">申请原因：</span>
          </ami-col>
          <ami-col :span="22">{{ custom.pubApplyDesc == null ? "--" : custom.pubApplyDesc }} </ami-col>
        </ami-row>
      </div>
    </div>
    <!-- 审核信息 -->
    <div class="custom-approve">
      <ami-model-title title="审核信息"></ami-model-title>
      <ami-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <ami-row>
          <ami-form-item label="审批意见" prop="auditStatus">
            <ami-radio-group v-model="ruleForm.auditStatus" @change="change_auditResult($event)">
              <ami-radio label="02">通过</ami-radio>
              <ami-radio label="03">不通过</ami-radio>
              <ami-radio label="04">退回</ami-radio>
            </ami-radio-group>
          </ami-form-item>
        </ami-row>
        <ami-row>
          <ami-form-item label="审批描述" prop="pubAuditDesc">
            <ami-input
              type="textarea"
              v-model.trim="ruleForm.pubAuditDesc"
              :rows="6"
              maxlength="1000"
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
    <div class="dialong">
      <Processdialong :ProcessVisible.sync="ProcessVisible" :processList="processList"></Processdialong>
    </div>
  </ami-card>
</template>
<script>
import { getYearMonthDay } from "@/utils/time";
import { remoteRoute } from "@/utils/remoteUtil";
import { queryAppOperLog } from "@/api/approval/approval";
import { queryCustomizedById, addApprovalFiling, fileDownLoad } from "@/api/custom/custom";
import Processdialong from "@/components/Approval/Process_dialong.vue"; // 流程节点
export default {
  name: "AMI-MA0102054-11",
  components: {
    Processdialong,
  },
  data() {
    return {
      loading: false, // 提交按钮loading
      ProcessVisible: false, // 流程节点弹窗
      custom: {}, // 详情数据
      attInfoVO: {}, // 附件数据
      processList: [], // 流程数据
      ruleForm: {
        auditStatus: "", //审批结果
        pubAuditDesc: "", // 审核描述
      },
      rules: {
        auditStatus: [{ required: true, message: "请选择审批结果", trigger: "change" }],
        pubAuditDesc: [{ required: true, message: "请输入审批描述", trigger: "blur" }],
      },
    };
  },
  created() {
    this.init();
  },
  computed: {
    getYearMonthDay() {
      return getYearMonthDay;
    },
  },
  methods: {
    init() {
      this.load_detail();
    },
    // 查询-详情
    load_detail() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.$route.query.appVerId,
        evalOrgCodeList: [],
      };
      queryCustomizedById(params).then((res) => {
        if (res.data.code === 200) {
          this.custom = res.data.data;
          if (this.custom.attInfoVO === null) return;
          this.attInfoVO = res.data.data.attInfoVO;
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = {
            appId: this.custom.appId,
            appVerId: this.custom.appVerId,
            auditStatus: this.ruleForm.auditStatus,
            pubAuditDesc: this.ruleForm.pubAuditDesc,
          };
          addApprovalFiling(params)
            .then((res) => {
              if (res.data.code === 200) {
                this.loading = false;
                this.$message.success("提交成功");
                remoteRoute.closePath({ path: "/custom_approval" }); // 关闭当前页面
                this.$router.push({ path: "/custom" });
              }
            })
            .catch((error) => {
              this.loading = false;
              this.$message.error(error);
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
    // 流程节点-弹窗
    handle_process() {
      let params = {
        appId: this.custom.appId,
        appVerId: this.custom.appVerId,
      };
      queryAppOperLog(params).then((res) => {
        if (res.data.code === 200) {
          this.processList = res.data.data;
        }
      });
      this.ProcessVisible = true;
    },
    // 应用信息-附件下载
    handle_download(row) {
      if (row.attId === null) return;
      let params = { fileId: row.attId };
      fileDownLoad(params)
        .then((res) => {
          if (res.status === 200) {
            let fileName = row.attName; // fileName文件名称
            let url = window.URL.createObjectURL(new Blob([res.data]));
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            this.$message({
              type: "success",
              message: "下载文件成功!",
            });
          }
        })
        .catch(() => {
          this.$message.error("下载文件失败！");
        });
    },
    // 取消-重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      remoteRoute.closePath({ path: "/custom_approval" }); // 关闭当前页面
      this.$router.push({ path: "/custom" });
    },
  },
};
</script>
<style lang="scss" scoped>
.custom {
  width: calc(100% - 24px);
  height: calc(100% - 12px);
  margin: 0 auto;
  overflow-y: auto;
  &-information {
    width: 100%;
    padding: 10px;
    .custom-mask {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      background: #f2f2f2;
      /deep/ .ami-row {
        margin-bottom: 16px;
      }
      .xia {
        margin-left: 16px;
        cursor: pointer;
        color: #0004d1;
        text-decoration: underline;
      }
    }
  }
  &-apply {
    width: 100%;
    padding: 10px;
    .mask-info {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      background: #f2f2f2;
      /deep/ .ami-row {
        margin-bottom: 16px;
      }
    }
    .text {
      color: #0004d0;
      margin-left: 30px;
      font-size: 15px;
      font-weight: bold;
      text-decoration: underline;
    }
  }
  &-approve {
    width: 100%;
    padding: 10px;
  }
}
.title {
  color: #666666;
}
</style>
