<!--
 * @description: 应用发布
 * @author: 王浩
 * @Date: 2022-11-10 17:36:47
 * @Modified By:
 * @version: 1.0.0
-->
<template>
  <div class="application">
    <!-- 查询部分 -->
    <div class="application-Inquire">
      <ami-card>
        <ami-model-title title="查询条件"> </ami-model-title>
        <ami-form label-width="120px" ref="form" :model="ruleForm">
          <ami-row>
            <ami-col :span="6">
              <ami-form-item label="应用名称" prop="appName">
                <ami-input v-model="ruleForm.appName" clearable placeholder="请输入"></ami-input>
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
            <div style="float: right">
              <ami-button round @click="resetForm('form')">重 置</ami-button>
              <ami-button round @click="submitForm('form')" type="primary">查 询</ami-button>
            </div>
          </ami-row>
        </ami-form>
      </ami-card>
    </div>
    <!-- 表单部分 -->
    <div class="application-table">
      <div class="content">
        <Tables
          ref="tables"
          title="应用列表"
          operation
          :columns="columns"
          :axiosData="axiosData"
          @selection-change="handleSelectionChange"
        >
          <!-- 应用名称 -->
          <template slot="appName" slot-scope="{ scope }">
            <ami-link @click="ApplicationName(scope.row)" style="color: #0040d0"> {{ scope.row.appName }} </ami-link>
          </template>
          <!-- 上面操作按钮 -->
          <template slot="titleRight">
            <ami-button icon="ami-icons-daochu" @click="exportExcel()" round> 导出</ami-button>
          </template>
          <!-- 底部按钮 -->
          <div slot="bottom">
            <ami-button round :type="release ? 'primary' : ''" @click="handleCommit()">发布</ami-button>
          </div>
        </Tables>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { exportReleasePage, addrelease } from "@/api/approval/approval";
export default {
  name: "Application",
  data() {
    return {
      release: false, //发布按钮
      multipleSelection: [], // 多选
      ruleForm: {
        appName: "", //应用名称
        busCls: "", //应用类型
        auditStatus: "02", //审批状态
        verNo: "", //最新版本号
        pubRange: "", //发布范围
        pubType: "", //发布类型
        verStatus: "00", //发布状态
        appVerIdList: [], //导出id
      },
      // 查询条件
      axiosData: {
        url: "/ami/ma01-02-054/app-dl-rec/queryAppStandardPage",
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
          label: "应用类型",
          key: "appClsName",
        },
        {
          label: "版本号",
          key: "verNo",
        },
        {
          label: "业务分类",
          key: "busClsName",
        },
        {
          label: "审核时间",
          key: "pubAuditTime",
        },
      ],
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["approval_classify", "approval_examine", "apply_unit", "approval_pubtype", "approval_publish"]),
  },
  methods: {
    ...mapActions(["getApprovalClassify", "getApprovalExamine", "getApplyUnit", "getApprovalPubtype", "getApprovalPublish"]),
    init() {
      this.$nextTick(() => {
        this.getApplyUnit(); //发布范围
        this.getApprovalExamine({ codeClsType: "02_EXAM_STATUS" }); //审批状态
        this.getApprovalClassify({ appsCategory: "01" }); //应用分类
        this.getApprovalPubtype({ codeClsType: "02_PUB_TYPE" }); //发布类型
        this.getApprovalPublish({ codeClsType: "02_VER_STATUS" }); //发布状态
        this.loadTable();
      });
    },

    // 查询
    submitForm() {
      this.loadTable();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 分页查询-加载列表
    loadTable() {
      this.axiosData.filter = this.ruleForm; // 赋值
      this.$refs.tables.queryTableData();
    },
    // 发布
    handleCommit() {
      const change = this.multipleSelection.length;
      if (change == 0) {
        this.$message.warning("请选择一条数据");
        return;
      } else {
        this.$confirm("此操作将提交该应用, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            const params = [];
            this.multipleSelection.forEach((item) => {
              let items = {
                appId: "",
                appVerId: "",
              };
              items.appId = item.appId;
              items.appVerId = item.appVerId;
              params.push(items);
            });
            addrelease(params).then((res) => {
              if (res.data.code === 200) {
                this.$message.success("发布成功");
                this.loadTable();
              }
            });
          })
          .catch(() => {
            this.$message.info("已取消提交");
          });
      }
    },
    // 导出
    exportExcel() {
      this.ruleForm.appVerIdList = this.multipleSelection.map((item) => item.appVerId);
      let params = {
        filter: this.ruleForm,
      };
      exportReleasePage(params).then((res) => {
        const blob = new Blob([res.data]);
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `发布应用列表.xlsx`; //文件名称
        a.click();
        window.URL.revokeObjectURL(url);
        this.$message.success("导出成功");
        this.ruleForm.appVerIdList = []; //清空
      });
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
    // 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length > 0) {
        this.release = true;
      } else {
        this.release = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.application {
  width: calc(100% - 24px);
  height: calc(100% - 24px);
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
  // 选中
  .active {
    color: #fff;
    background-image: -webkit-gradient(linear, left top, left bottom, from(#0040d1), to(#356ceb));
  }
  // 未选中
  .actives {
    background: #ffffff;
  }
}
</style>
