<!--
 * @description: 定制应用报备
 * @author: 王浩
 * @Date: 2022-10-12 10:45:23
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="custom">
    <!-- 查询部分 -->
    <div class="custom-Inquire">
      <ami-card>
        <ami-model-title title="查询条件">
          <div class="results-show" @click="isShow = !isShow">
            {{ isShow ? "收起" : "更多查询条件" }}
            <i :class="isShow ? 'ami-icon-arrow-up' : 'ami-icon-arrow-down'"></i>
          </div>
        </ami-model-title>
        <ami-form label-width="130px" ref="form" :model="ruleForm">
          <ami-row>
            <ami-col :span="6">
              <ami-form-item label="审核状态" prop="auditStatus">
                <ami-select v-model="ruleForm.auditStatus" clearable placeholder="请选择">
                  <ami-option label="全部" value></ami-option>
                  <ami-option label="待审核" value="02"></ami-option>
                  <ami-option label="待生成数字签名" value="06"></ami-option>
                  <!-- <ami-option
                    v-for="item in approval_examine"
                    :label="item.codeClsValName"
                    :value="item.codeClsVal"
                    :key="item.codeClsVal"
                  ></ami-option> -->
                </ami-select>
              </ami-form-item>
            </ami-col>
            <ami-col :span="6" v-show="!isShow">
              <ami-form-item label="应用分类" prop="busCls">
                <ami-select v-model="ruleForm.busCls" clearable placeholder="请选择">
                  <ami-option label="全部" value></ami-option>
                  <ami-option
                    v-for="item in approval_classify"
                    :key="item.businessCategory"
                    :label="item.businessCategoryName"
                    :value="item.businessCategory"
                  ></ami-option>
                </ami-select>
              </ami-form-item>
            </ami-col>
            <ami-col :span="6" v-show="isShow">
              <ami-form-item label="业务分类" prop="busCls">
                <ami-select v-model="ruleForm.busCls" clearable placeholder="请选择">
                  <ami-option
                    v-for="item in approval_classify"
                    :key="item.businessCategory"
                    :label="item.businessCategoryName"
                    :value="item.businessCategory"
                  ></ami-option>
                </ami-select>
              </ami-form-item>
            </ami-col>
            <ami-col :span="6">
              <ami-form-item label="申请时间" prop="createDate">
                <ami-date-picker
                  v-model="createDate"
                  type="daterange"
                  clearable
                  style="width: 100%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:00']"
                ></ami-date-picker>
              </ami-form-item>
            </ami-col>
            <ami-col :span="6" v-show="isShow">
              <ami-form-item label="应用名称" prop="appName">
                <ami-input v-model="ruleForm.appName" clearable placeholder="请输入"></ami-input>
              </ami-form-item>
            </ami-col>
            <ami-col :span="6" v-show="!isShow">
              <div style="float: right">
                <ami-button round @click="resetForm('form')">重 置</ami-button>
                <ami-button round type="primary" @click="submitForm('form')" v-dbClick>查 询</ami-button>
              </div>
            </ami-col>
          </ami-row>
          <ami-row v-show="isShow">
            <ami-col :span="6">
              <ami-form-item label="申请单位" prop="pubRange">
                <ami-select v-model="ruleForm.pubRange" clearable placeholder="请选择">
                  <ami-option label="全部" value></ami-option>
                  <ami-option v-for="item in apply_unit" :key="item.no" :label="item.name" :value="item.no"></ami-option>
                </ami-select>
              </ami-form-item>
            </ami-col>
            <ami-col :span="6">
              <ami-form-item label="申请人" prop="createUserName">
                <ami-input v-model="ruleForm.createUserName" clearable placeholder="请输入" maxlength="10"></ami-input>
              </ami-form-item>
            </ami-col>
            <ami-col :span="6">
              <ami-form-item label="程序包&监测证明" prop="attStatus">
                <ami-select v-model="ruleForm.attStatus" clearable placeholder="请选择">
                  <ami-option label="全部" value></ami-option>
                  <ami-option label="待上传" value="01"></ami-option>
                  <ami-option label="已上传" value="02"></ami-option>
                  <!-- <ami-option
                    v-for="item in approval_package"
                    :label="item.codeClsValName"
                    :value="item.codeClsVal"
                    :key="item.codeClsVal"
                  ></ami-option> -->
                </ami-select>
              </ami-form-item>
            </ami-col>
            <!-- <ami-col :span="6">
              <ami-form-item label="数字签名" prop="singStatus">
                <ami-select v-model="ruleForm.singStatus" clearable placeholder="请选择">
                  <ami-option label="全部" value></ami-option>
                  <ami-option
                    v-for="item in approval_sign"
                    :label="item.codeClsValName"
                    :value="item.codeClsVal"
                    :key="item.codeClsVal"
                  ></ami-option>
                </ami-select>
              </ami-form-item>
            </ami-col> -->
          </ami-row>
          <ami-row v-show="isShow">
            <div style="float: right">
              <ami-button round @click="resetForm('form')">重 置</ami-button>
              <ami-button round type="primary" @click="submitForm('form')" v-dbClick>查 询</ami-button>
            </div>
          </ami-row>
        </ami-form>
      </ami-card>
    </div>
    <!-- 表单部分 -->
    <div class="custom-table">
      <div class="content">
        <Tables
          ref="tables"
          title="审核列表"
          operation
          :columns="columns"
          :axiosData="axiosData"
          @selection-change="handleSelectionChange"
        >
          <!-- 上面操作按钮 -->
          <template slot="titleRight">
            <ami-button icon="ami-icons-daochu" @click="exportExcel()" round> 导出</ami-button>
          </template>
          <!-- 底部按钮 -->
          <div slot="bottom">
            <ami-button @click="haneleReport()" round :type="isReport ? 'primary' : ''">报备审核</ami-button>
            <ami-button @click="haneleSign()" round :type="isSign ? 'primary' : ''">验签生成</ami-button>
          </div>
          <!-- 应用名称 -->
          <template slot="appName" slot-scope="{ scope }">
            <ami-link @click="ApplicationName(scope.row)" style="color: #0040d0"> {{ scope.row.appName }} </ami-link>
          </template>
          <!-- 审批状态 -->
          <template slot="repStatus" slot-scope="{ scope }">
            <span v-if="scope.row.repStatus == '02'" class="the-review">审核中</span>
            <span v-else-if="scope.row.repStatus == '09'" class="approved">审核通过</span>
            <span v-else-if="scope.row.repStatus == '08'" class="not-through">审核不通过</span>
          </template>
          <template slot="attStatus" slot-scope="{ scope }">
            <span v-if="scope.row.attStatus === '01'" style="color: #d9001b">未上传</span>
            <span v-else-if="scope.row.attStatus === '02'" style="color: #70b603">已上传</span>
          </template>
        </Tables>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs"; //时间格式化
import { mapGetters, mapActions } from "vuex";
import { exportAppCustomizedPage } from "@/api/custom/custom";
export default {
  name: "AMI-MA0102054-10",
  data() {
    return {
      isReport: false, //报备状态
      isSign: false, //验签状态
      isShow: false, // 展开|收起
      createDate: "", // 申请时间
      multipleSelection: [], // 多选
      ruleForm: {
        busCls: "", //应用分类
        auditStatus: "", //审批状态
        appName: "", //应用名称
        pubRange: "", //申请单位
        createUserName: "", //申请人
        appTimeWo: "", //申请时间
        attStatus: "", //程序包&检测证明
        singStatus: "", //签名类型
        applyStartTime: "", //申请开始时间
        applyEndTime: "", //申请结束时间
        appVerIdList: [], //导出id
      },
      // 查询条件
      axiosData: {
        url: "/ami/ma01-02-054/app-dl-rec/queryAppCustomizedPage",
        filter: {},
      },
      // 配置表单
      columns: [
        {
          key: "selection",
          fixed: "left",
          type: "selection",
          align: "center",
        },
        {
          label: "序号",
          key: "index",
          type: "index",
          width: "80px",
          align: "center",
          disabledSet: true,
        },
        {
          label: "应用名称",
          key: "appName",
          renderType: "slot",
        },
        {
          label: "应用版本号",
          key: "verNo",
        },
        {
          label: "应用分类",
          key: "busClsName",
        },
        {
          label: "审核状态",
          key: "repStatusName",
        },
        {
          label: "程序包&监测证明",
          key: "attStatusName",
        },
        {
          label: "申请单位",
          key: "ceApplyOrgCodeName",
        },
        {
          label: "申请人",
          key: "createUserName",
        },
        {
          label: "申请时间",
          key: "createTime",
        },
      ],
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["approval_examine", "approval_classify", "apply_unit", "approval_package", "approval_sign"]),
  },
  methods: {
    ...mapActions(["getApprovalExamine", "getApprovalClassify", "getApplyUnit", "getApprovalPackage", "getApprovalSign"]),
    init() {
      this.$nextTick(() => {
        this.getApplyUnit();
        this.getApprovalExamine({ codeClsType: "02_EXAM_STATUS" }); //审批状态
        this.getApprovalClassify({ appsCategory: "01" }); //业务分类
        this.getApprovalPackage({ codeClsType: "02_ATT_STATUS" }); //程序包&检测证明
        this.getApprovalSign({ codeClsType: "02_SIGN_TYPE" }); //签名类型
        this.loadTable();
      });
    },
    // 分页查询-加载定制表格
    loadTable() {
      this.ruleForm.applyStartTime = this.createDate ? this.createDate[0] : "";
      this.ruleForm.applyEndTime = this.createDate ? this.createDate[1] : "";
      this.axiosData.filter = this.ruleForm; // 赋值
      this.$refs.tables.queryTableData();
    },
    // 报备
    haneleReport() {
      const change = this.multipleSelection.length;
      if (change <= 0) {
        this.$message.warning("请至少选择一条数据");
        return;
      } else if (change > 1) {
        this.$message.warning("请选择一条数据");
        return;
      } else {
        if (this.isReport) {
          this.$router.push({
            path: "/custom_approval",
            query: {
              appId: this.multipleSelection[0].appId,
              appVerId: this.multipleSelection[0].appVerId,
            },
          });
        } else {
          this.$message.warning("该应用已报备");
        }
      }
    },
    // 验签
    haneleSign() {
      const change = this.multipleSelection.length;
      if (change <= 0) {
        this.$message.warning("请至少选择一条数据");
        return;
      } else if (change > 1) {
        this.$message.warning("请选择一条数据");
        return;
      } else {
        if (this.isSign) {
          this.$router.push({
            path: "/custom_verify",
            query: {
              appId: this.multipleSelection[0].appId,
              appVerId: this.multipleSelection[0].appVerId,
            },
          });
        } else {
          this.$message.warning("该应用已验签");
        }
      }
    },
    // 跳转-定制应用详情
    ApplicationName(row) {
      this.$router.push({
        path: "/custom_details",
        query: {
          appId: row.appId,
          appVerId: row.appVerId,
        },
      });
    },
    // 导出
    exportExcel() {
      this.ruleForm.appVerIdList = this.multipleSelection.map((item) => item.appVerId);
      let params = {
        filter: this.ruleForm,
      };
      exportAppCustomizedPage(params).then((res) => {
        let data = new Date();
        const blob = new Blob([res.data]);
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        const time = dayjs(data).format("YYYY-MM-DD");
        a.href = url;
        a.download = `定制应用报备审核明细${time}.xlsx`; //文件名称
        a.click();
        window.URL.revokeObjectURL(url);
        this.$message.success("导出成功");
        this.ruleForm.appVerIdList = []; //清空
      });
    },
    // 查询
    submitForm() {
      this.loadTable();
    },
    // 重置
    resetForm(formName) {
      this.createDate = "";
      this.$refs[formName].resetFields();
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length === 1) {
        if (val[0].repStatus === "02") {
          this.isReport = true; //报备
        }
        if (val[0].repStatus == "06" && val[0].attStatusName == "已上传") {
          this.isSign = true; //验签
        }
      } else {
        this.isReport = false;
        this.isSign = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.custom {
  width: calc(100% - 24px);
  height: calc(100% - 12px);
  margin: 0 12px 12px 12px;
  display: flex;
  flex-direction: column;
  &-Inquire {
    margin-bottom: 12px;
    .results-show {
      color: #0040d0;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      i {
        margin-left: 2px;
      }
    }
    /deep/ .ami-select {
      width: 100%;
    }
  }
  &-table {
    flex: 1;
    position: relative;
    overflow: auto;
    .content {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      height: 100%;
    }
  }
  .the-review {
    color: #155cca;
    border: 1px solid #155cca;
    padding: 1px 6px;
    border-radius: 4px;
    background: #dae8ff;
  }
  .approved {
    color: rgb(43, 202, 21);
    border: 1px solid #2bca15;
    padding: 1px 6px;
    border-radius: 4px;
    background: #d8ffea;
  }
  .not-through {
    color: #f5551d;
    border: 1px solid #f5551d;
    padding: 1px 6px;
    border-radius: 4px;
    background: #f9e3e2;
  }
}
</style>
