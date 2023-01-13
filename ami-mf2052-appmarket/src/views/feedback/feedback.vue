<!--
 * @description: 应用详情-需求反馈
 * @author: wanghao
 * @Date: 2022-04-01 17:36:57
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <ami-card class="feedback">
    <div class="feedback-title">
      <ami-model-title title="新增需求反馈" />
      <ami-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <ami-row>
          <!-- 应用分类 -->
          <ami-col :span="12">
            <ami-form-item label="应用分类：" prop="appsCategory">
              <ami-select v-model="ruleForm.appsCategory" clearable style="width: 90%" disabled>
                <ami-option :label="'微应用'" :value="'01'"></ami-option>
                <ami-option :label="'微服务'" :value="'02'"></ami-option>
                <ami-option :label="'组件'" :value="'03'"></ami-option>
                <ami-option :label="'模型'" :value="'04'"></ami-option>
              </ami-select>
            </ami-form-item>
          </ami-col>
          <!-- 应用名称 -->
          <ami-col :span="12">
            <ami-form-item label="应用名称：" prop="appName">
              <ami-input v-model="ruleForm.appName" style="width: 90%" disabled></ami-input>
            </ami-form-item>
          </ami-col>
        </ami-row>
        <ami-row>
          <!-- 标题 -->
          <ami-col :span="12">
            <ami-form-item label="标题：" prop="questionTitle">
              <ami-input
                v-model.trim="ruleForm.questionTitle"
                maxlength="30"
                show-word-limit
                placeholder="请输入问题标题"
                style="width: 90%"
              ></ami-input>
            </ami-form-item>
          </ami-col>
          <!-- 反馈类型 -->
          <ami-col :span="12">
            <ami-form-item label="反馈类型：" prop="questionCategory">
              <ami-select v-model="ruleForm.questionCategory" clearable placeholder="请选择" style="width: 90%">
                <ami-option label="优化" :value="'02'"></ami-option>
                <ami-option label="漏洞" :value="'01'"></ami-option>
              </ami-select>
            </ami-form-item>
          </ami-col>
        </ami-row>
        <!-- 反馈内容 -->
        <ami-form-item label="反馈内容：" prop="describe">
          <ami-input :rows="5" type="textarea" maxlength="500" show-word-limit v-model.trim="ruleForm.describe"></ami-input>
        </ami-form-item>
        <!-- 反馈建议 -->
        <ami-form-item label="反馈建议：" prop="propose">
          <ami-input :rows="5" type="textarea" maxlength="500" show-word-limit v-model.trim="ruleForm.propose"></ami-input>
        </ami-form-item>
        <!-- 附件 -->
        <ami-form-item label="附件：" prop="fileNum">
          <UploadModalExample ref="appendix" />
          <span>支持上传格式：DOC、DOCX、TXT、PDF、RAR、ZIP。</span>
        </ami-form-item>
        <ami-form-item class="edit">
          <ami-button size="medium" @click="resetForm('ruleForm')" class="">取消</ami-button>
          <ami-button size="medium" type="primary" :loading="loading" @click="submitForm('ruleForm')">提交</ami-button>
        </ami-form-item>
      </ami-form>
    </div>
  </ami-card>
</template>
<script>
import { getUserInfo } from "@/utils/store";
import { inMineWantOn } from "@/api/market/market.js";
import UploadModalExample from "@/components/UploadModalExample";
export default {
  name: "AMI-MA0102052-07",
  components: { UploadModalExample },
  data() {
    return {
      loading: false, //加载动态
      userInfo: {}, //当前登陆人信息
      token: "", //token值
      // 表单
      ruleForm: {
        questionTitle: "", //标题
        appsNo: "", //程序
        appName: "", //应用名称
        appsCategory: "", //应用类型
        businessCategory: "", //业务分类
        questionCategory: "", //反馈类型
        questionStatus: "01", //反馈状态（固定01-未审核）
        describe: "", //反馈内容
        propose: "", //反馈意见
        verNo: "", //发布的应用版本号
        mgtOrgCode: "", //管理组织代码
        creator: "",
        pkVal: "", //上传文件的ID
      },
      // 文本校验
      rules: {
        appName: [{ required: true, message: "请输入应用名称", trigger: "blur" }], //应用名称
        appsCategory: [{ required: true, message: "请选择应用分类", trigger: "change" }], //应用分类
        questionTitle: [{ required: true, message: "请输入问题标题", trigger: "blur" }], //标题
        questionCategory: [{ required: true, message: "请选择反馈类型", trigger: "change" }], //反馈类型
        describe: [{ required: true, message: "请输入反馈内容", trigger: "blur" }], //反馈内容
        propose: [{ required: true, message: "请输入反馈建议", trigger: "blur" }], //反馈建议
      },
    };
  },
  mounted() {
    this.userInfo = getUserInfo();
    this.ruleForm.appName = this.$route.query.appName;
    this.ruleForm.appsCategory = this.$route.query.appCls; //应用分类
    this.ruleForm.businessCategory = this.$route.query.busCls; //业务分类
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true; //加载
          let params = {
            appName: this.$route.query.appName || this.ruleForm.appName, //应用名称 - 新增
            appId: this.$route.query.appId, //程序编号
            fbTitle: this.ruleForm.questionTitle, //新增标题
            fbType: this.ruleForm.questionCategory, //反馈类型
            appCls: this.ruleForm.appsCategory, //应用分类
            busCls: this.ruleForm.businessCategory || "01", //应用分类
            fbContent: this.ruleForm.describe, //反馈内容
            fbSuggest: this.ruleForm.propose, //反馈建议
            reqBfOrgCode: this.userInfo.mgtOrgCode, //管理组织代码
            attType: "08", //附件类型（08-反馈）
            fileId: this.$refs.appendix.uploadedFileList
              .map((item) => {
                return item.fileId;
              })
              .toString(),
            attName: this.$refs.appendix.uploadedFileList
              .map((item) => {
                return item.fullName;
              })
              .toString(),
            attSize: this.$refs.appendix.uploadedFileList
              .map((item) => {
                return item.fileSize;
              })
              .toString(),
          };
          inMineWantOn(params)
            .then((res) => {
              if (res.data.code === 200) {
                this.$message.success({
                  type: "info",
                  message: "提交成功",
                });
                this.loading = false; //关闭加载
                // 返回上一级
                this.$router.go(-1);
              }
            })
            .catch(() => {
              this.loading = false; //关闭加载效果
              this.$message.error("提交失败！");
            });
        } else {
          return false;
        }
      });
    },
    // 取消表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.feedback {
  width: 100%;
  height: 100%;
  background: #fff;
  &-title {
    width: 90%;
    margin: 0 auto;
  }
  /deep/ .ami-form-item {
    padding: 0;
  }
  .edit {
    float: right;
  }
}
</style>
