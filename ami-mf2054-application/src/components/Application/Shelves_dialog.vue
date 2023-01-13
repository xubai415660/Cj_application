<!--
 * @description: 应用下架申请弹窗
 * @author: 王浩
 * @Date: 2022-10-24 10:09:39
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="shelves">
    <ami-dialog title="应用下架申请" width="960px" :visible.sync="shelvesVisible" :before-close="handleCancel">
      <!-- 内容区域 -->
      <div class="shelf-dialog">
        <!-- 简介信息 -->
        <div class="header">
          <div class="header-img">
            <img :src="Icon(shelvesForm.appIcon)" :onerror="defaultImg" />
          </div>
          <div class="header-mark">
            <span class="mask-title">{{ shelvesForm.appName }}</span>
            <span class="mask-title">V{{ shelvesForm.verNo }}</span>
            <span class="mask-title">{{ shelvesForm.busClsName }}</span>
          </div>
        </div>
        <!-- 信息行 -->
        <div class="table-name">
          <ami-row>
            <ami-col :span="4">
              <div class="table-div">应用编号</div>
            </ami-col>
            <ami-col :span="8">
              <span>{{ shelvesForm.appId }}</span>
            </ami-col>
            <ami-col :span="4">
              <div class="table-div">创建时间</div>
            </ami-col>
            <ami-col :span="8">
              <span>{{ shelvesForm.createTime }}</span>
            </ami-col>
          </ami-row>
        </div>
        <!-- 表单 -->
        <ami-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
          <ami-row>
            <ami-col :span="8">
              <ami-form-item label="下架分类" prop="auditStatus">
                <ami-radio-group v-model="ruleForm.auditStatus">
                  <ami-radio label="01">应用下架</ami-radio>
                </ami-radio-group>
              </ami-form-item>
            </ami-col>
            <ami-col :span="8" v-show="false">
              <!-- <ami-form-item label="下架原因" prop="rmApplyCls">
                <ami-select v-model="ruleForm.rmApplyCls" placeholder="请选择">
                  <ami-option label="全部" value=""></ami-option>
                  <ami-option
                    v-for="item in approval_offreason"
                    :label="item.codeClsValName"
                    :value="item.codeClsVal"
                    :key="item.codeClsVal"
                  ></ami-option>
                </ami-select>
              </ami-form-item> -->
            </ami-col>
          </ami-row>
          <ami-row>
            <ami-form-item label="在用单位:">
              <span>{{ shelvesForm.pubRange }}</span>
            </ami-form-item>
          </ami-row>
          <ami-row>
            <ami-form-item label="下架原因" prop="rmApplyDesc">
              <ami-input
                type="textarea"
                v-model.trim="ruleForm.rmApplyDesc"
                :rows="4"
                maxlength="1000"
                show-word-limit
                placeholder="请输入下架原因"
              ></ami-input>
            </ami-form-item>
          </ami-row>
          <!-- 附件 -->
          <ami-row>
            <ami-form-item label="附件" prop="attInfoVOList">
              <UploadExample
                ref="uploadExample"
                :config="configBlue"
                @fileUploadFinished="fileUploadFinishedHandle"
              ></UploadExample>
            </ami-form-item>
          </ami-row>
        </ami-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <ami-button round @click="resetForm('ruleForm')">取 消</ami-button>
        <ami-button round type="primary" @click="submitForm('ruleForm')" :loading="loading">确 定</ami-button>
      </span>
    </ami-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import UploadExample from "@/components/UploadExample";
import { IFileConfigBlue } from "@/components/FileUploaderBlue/IFileConfigBlue";
import { Iconinformation, addLowershelf } from "@/api/approval/approval";
const configBlue = new IFileConfigBlue();
configBlue.isMultiple = true;
configBlue.fileTypeFlag = ["doc", "docx", "pdf", "xlsx"]; // 上传文件类型
configBlue.reminder = "支持上传文件格式为：doc,docx,pdf,xlsx";
configBlue.getFileTypeFlagTip = "支持上传文件格式为：doc,docx,pdf,xlsx"; //提示
configBlue.fileQuantityLimit = 1; // 附件数量限制
export default {
  name: "AMI-MA0102054-12",
  components: { UploadExample },
  props: {
    shelvesForm: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 弹窗显示隐藏
    shelvesVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // 附件校验
    var attInfoList = (rule, value, callback) => {
      if (this.ruleForm.attInfoVOList.length === 0) {
        callback(new Error("请上传附件"));
      } else if (this.ruleForm.attInfoVOList.length > 0) {
        callback();
      }
    };
    return {
      loading: false,
      configBlue: configBlue,
      Icon: Iconinformation, //图标信息
      ruleForm: {
        auditStatus: "01",
        rmApplyCls: "", //下架原因
        rmApplyDesc: "", //申请描述
        attInfoVOList: [], // 附件列表
      },
      // 表单验证
      rules: {
        auditStatus: [{ required: true, message: "请选择审批结果", trigger: "change" }],
        // rmApplyCls: [{ required: true, message: "请选择下架原因", trigger: "change" }],
        rmApplyDesc: [{ required: true, message: "请输入下架原因", trigger: "blur" }],
        attInfoVOList: [{ required: true, validator: attInfoList, trigger: "blur" }],
      },
      defaultImg: 'this.src="' + require("@/assets/img/pgy1.jpg") + '"',
    };
  },
  computed: {
    ...mapGetters(["approval_offreason"]),
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions(["getApprovalOffreason"]),
    init() {
      this.getApprovalOffreason({ codeClsType: "02_REMOVE_CLS" });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = {
            appId: this.shelvesForm.appId,
            appVerId: this.shelvesForm.appVerId,
            rmApplyCls: this.ruleForm.rmApplyCls,
            rmApplyDesc: this.ruleForm.rmApplyDesc,
            attInfoVOList: this.ruleForm.attInfoVOList,
          };
          addLowershelf(params)
            .then((res) => {
              if (res.data.code === 200) {
                this.$refs.uploadExample.helper.fileList = [];
                this.$refs[formName].resetFields();
                this.loading = false;
                this.$message.success("提交成功");
                this.$emit("update:shelvesVisible", false);
                this.$emit("loadTable"); //刷新表格
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
    // 文件上传完成
    fileUploadFinishedHandle(e) {
      if (e && e.length) {
        for (const iterator of e) {
          const source = iterator.data.data;
          this.ruleForm.attInfoVOList.push({
            attId: source.fileId,
            attName: source.fullName,
            attSize: source.fileSize,
            attType: source.fileType,
          });
        }
      }
    },
    // 重置表单-关闭
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.uploadExample.helper.fileList = [];
      this.$emit("update:shelvesVisible", false);
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("update:shelvesVisible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.shelves {
  width: 100%;
  height: 100%;
  .shelf-dialog {
    width: 100%;
    height: 100%;
    overflow: auto;
    max-height: 600px;
    .header {
      display: flex;
      width: 100%;
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
        margin-left: 20px;
        width: 95%;
        span {
          height: 30px;
          line-height: 30px;
          display: block;
        }
      }
    }
    .table-name {
      width: 100%;
      height: 42px;
      margin: 16px 0px;
      line-height: 40px;
      border: 1px solid #e8e8e8;
      .table-div {
        padding: 0px 6px;
        background: #f5f5f5;
        border-left: 1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
      }
      span {
        padding: 0px 6px;
      }
    }
    /deep/ .ami-form-item {
      margin-bottom: 14px;
    }
  }
}
</style>
