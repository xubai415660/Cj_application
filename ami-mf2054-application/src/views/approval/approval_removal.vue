<!--
 * @description: 标准应用下架审批
 * @author: 王浩
 * @Date: 2023-01-02 14:11:08
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <div class="removal">
    <!-- 查询部分 -->
    <ami-card class="removal-Inquire">
      <ami-model-title title="查询条件">
        <div class="results-show" @click="isShow = !isShow">
          {{ isShow ? "收起" : "更多查询条件" }}
          <i :class="isShow ? 'ami-icon-arrow-up' : 'ami-icon-arrow-down'"></i>
        </div>
      </ami-model-title>
      <ami-form label-width="120px" ref="form" :model="ruleForm">
        <ami-row>
          <ami-col :span="6">
            <ami-form-item label="应用名称" prop="appName">
              <ami-input v-model="ruleForm.appName" clearable placeholder="请输入"></ami-input>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="审核状态" prop="auditStatus">
              <ami-select v-model="ruleForm.auditStatus" clearable placeholder="请选择">
                <ami-option label="全部" value></ami-option>
                <ami-option
                  v-for="item in approval_examine"
                  :label="item.codeClsValName"
                  :value="item.codeClsVal"
                  :key="item.codeClsVal"
                ></ami-option>
              </ami-select>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
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
            <ami-form-item label="申请类型" prop="busCls">
              <ami-select v-model="ruleForm.verType" clearable placeholder="请选择">
                <ami-option label="全部" value></ami-option>
                <ami-option
                  v-for="item in apply_type"
                  :label="item.codeClsValName"
                  :value="item.codeClsVal"
                  :key="item.codeClsVal"
                ></ami-option>
              </ami-select>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6" v-show="!isShow">
            <div style="float: right">
              <ami-button round @click="resetForm('form')">重 置</ami-button>
              <ami-button round @click="submitForm('form')" type="primary" v-dbClick>查 询</ami-button>
            </div>
          </ami-col>
        </ami-row>
        <ami-row v-show="isShow">
          <ami-col :span="6">
            <ami-form-item label="最新版本号" prop="verNo">
              <ami-input v-model="ruleForm.verNo" clearable placeholder="请输入"></ami-input>
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
          <ami-col :span="6">
            <ami-form-item label="申请人" prop="createUserName">
              <ami-input v-model="ruleForm.createUserName" clearable placeholder="请输入" maxlength="10"></ami-input>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <div style="float: right">
              <ami-button round @click="resetForm('form')">重 置</ami-button>
              <ami-button round type="primary" @click="submitForm('form')" v-dbClick>查 询</ami-button>
            </div>
          </ami-col>
        </ami-row>
      </ami-form>
    </ami-card>
    <!-- 表单部分 -->
    <div class="removal-table">
      <div class="content">
        <Tables
          ref="tables"
          title="标准应用审批列表"
          operation
          :columns="columns"
          :axiosData="axiosData"
          @selection-change="handleSelectionChange"
        >
          <!-- 上面操作按钮 -->
          <template slot="titleRight">
            <ami-button icon="ami-icon-delete" @click="handleDelete()" round> 删除</ami-button>
            <ami-button icon="ami-icons-daochu" @click="exportExcel()" round> 导出</ami-button>
          </template>
          <!-- 底部按钮 -->
          <div slot="bottom">
            <ami-button round :type="examineShow ? 'primary' : ''" @click="handleAudit()">下架审批</ami-button>
          </div>
          <!-- 应用名称 -->
          <template slot="appName" slot-scope="{ scope }">
            <ami-link @click="ApplicationName(scope.row)" style="color: #0040d0"> {{ scope.row.appName }} </ami-link>
          </template>
          <!-- 申请类型 -->
          <template slot="verType" slot-scope="{ scope }">
            <span v-if="scope.row.verType === '01'" style="color: #8080ff">{{ scope.row.verTypeName }}</span>
            <span v-else-if="scope.row.verType === '02'" style="color: #155cca">{{ scope.row.verTypeName }}</span>
            <span v-else-if="scope.row.verType === '03'" style="color: #f59a23">{{ scope.row.verTypeName }}</span>
          </template>
          <!-- 审批状态 -->
          <template slot="auditStatus" slot-scope="{ scope }">
            <span v-if="scope.row.auditStatus === '-'">--</span>
            <span v-if="scope.row.auditStatus === '01'" style="color: #155cca">审核中</span>
            <span v-else-if="scope.row.auditStatus === '02'" style="color: #2bca15">审批通过</span>
            <span v-else-if="scope.row.auditStatus === '03'" style="color: #f2510c">审批不通过</span>
          </template>
        </Tables>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs"; //时间格式化
import { mapGetters, mapActions } from "vuex";
import { exportAppAppExaminePage } from "@/api/approval/approval";
export default {
  name: "AMI-MA0102054-07",
  data() {
    return {
      isShow: false, // 展开|收起
      examineShow: false, // 审核状态
      multipleSelection: [], // 多选
      createDate: "", // 申请时间
      ruleForm: {
        appName: "", //应用名称
        auditStatus: "", //审批状态
        busCls: "", //应用分类
        verType: "", // 申请类型
        verNo: "", //最新版本号
        applyStartTime: "", //申请开始时间
        applyEndTime: "", //申请结束时间
        createUserName: "", //申请人
        appVerIdList: [], //导出id
      },
      // 查询条件
      axiosData: {
        url: "/ami/ma01-02-054/app-dl-rec/queryAppExaminePage",
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
          label: "申请类型",
          key: "verType",
          renderType: "slot",
        },
        {
          label: "审核状态",
          key: "auditStatus",
          renderType: "slot",
        },
        {
          label: "开发厂商",
          key: "createUserName",
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
    ...mapGetters(["approval_examine", "approval_classify", "apply_type"]),
  },
  methods: {
    ...mapActions(["getApprovalExamine", "getApplyType", "getApprovalClassify"]),
    init() {
      this.$nextTick(() => {
        this.getApprovalClassify({ appsCategory: "01" }); //应用分类
        this.getApprovalExamine({ codeClsType: "02_EXAM_STATUS" }); //审批状态
        this.getApplyType({ codeClsType: "02_APP_TYPE_WORK" }); //申请类型
        this.loadTable();
      });
    },
    // 分页查询-加载列表
    loadTable() {
      this.ruleForm.applyStartTime = this.createDate ? this.createDate[0] : "";
      this.ruleForm.applyEndTime = this.createDate ? this.createDate[1] : "";
      this.axiosData.filter = this.ruleForm; // 赋值
      this.$refs.tables.queryTableData();
    },
    // 删除
    handleDelete() {
      const change = this.multipleSelection.length;
      if (change == 0 || change > 1) {
        this.$message.warning("请至少选择一条数据");
        return;
      } else {
        if (this.multipleSelection[0].auditStatusName === "--") {
          this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              // let list = this.multipleSelection.map((item) => item.appVerId);
              this.$message.success("删除成功");
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除",
              });
            });
        } else {
          this.$message.warning("不能删除");
          return;
        }
      }
    },
    // 导出
    exportExcel() {
      this.ruleForm.appVerIdList = this.multipleSelection.map((item) => item.appVerId);
      let params = {
        filter: this.ruleForm,
      };
      exportAppAppExaminePage(params).then((res) => {
        let data = new Date();
        const blob = new Blob([res.data]);
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        const time = dayjs(data).format("YYYY-MM-DD");
        a.href = url;
        a.download = `标准应用审批明细${time}.xlsx`; //文件名称
        a.click();
        window.URL.revokeObjectURL(url);
        this.$message.success("导出成功");
        this.ruleForm.appVerIdList = []; //清空
      });
    },
    // 发布审核
    handleAudit() {
      const change = this.multipleSelection.length;
      if (change <= 0) {
        this.$message.warning("请至少选择一条数据");
        return;
      } else if (change > 1) {
        this.$message.warning("请选择一条数据");
        return;
      } else {
        if (this.multipleSelection[0].auditStatus === "01" && this.multipleSelection[0].verType !== "03") {
          this.$router.push({
            path: "/approval_under",
            query: {
              appId: this.multipleSelection[0].appId,
              appVerId: this.multipleSelection[0].appVerId,
            },
          });
        } else {
          this.$message.warning("请选择审核中的数据");
          return;
        }
      }
    },
    // 跳转-应用详情
    ApplicationName(row) {
      this.$router.push({
        path: "/application_details",
        query: {
          appId: row.appId,
          appVerId: row.appVerId,
        },
      });
    },
    // 重置
    resetForm(formName) {
      this.createDate = "";
      this.$refs[formName].resetFields();
    },
    // 查询
    submitForm() {
      this.loadTable();
    },
    // 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length === 1) {
        // 判断审核状态
        if (val[0].auditStatus === "01" || val[0].auditStatus === null) {
          this.examineShow = true;
        }
      } else {
        this.examineShow = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.removal {
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
}
</style>
