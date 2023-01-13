<!--
 * @description: 标准应用档案管理
 * @author: 王浩
 * @Date: 2023-01-02 11:21:02
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <div class="applicationfile">
    <!-- 查询部分 -->
    <ami-card class="applicationfile-Inquire">
      <ami-model-title title="查询条件">
        <div class="results-show" @click="isShow = !isShow">
          {{ isShow ? "收起" : "更多查询条件" }}
          <i :class="isShow ? 'ami-icon-arrow-up' : 'ami-icon-arrow-down'"></i>
        </div>
      </ami-model-title>
      <ami-form :model="ruleForm" ref="form" label-width="140px">
        <ami-row>
          <ami-col :span="6">
            <ami-form-item label="应用名称" prop="appName">
              <ami-input v-model="ruleForm.appName" clearable placeholder="请输入"></ami-input>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="应用分类" prop="busCls">
              <ami-select v-model="ruleForm.busCls" clearable placeholder="请选择">
                <ami-option label="全部" :value="''"></ami-option>
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
            <ami-form-item label="功能设计评审结论" prop="Reviewconclusion">
              <ami-select v-model="ruleForm.Reviewconclusion" clearable placeholder="请选择">
                <ami-option label="全部" :value="''"></ami-option>
                <ami-option
                  v-for="item in approval_examine"
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
              <ami-button round type="primary" @click="submitForm('form')" v-dbClick>查 询</ami-button>
            </div>
          </ami-col>
        </ami-row>
        <ami-row v-show="isShow">
          <ami-col :span="6">
            <ami-form-item label="数模评审结论" prop="modelconclusion">
              <ami-select v-model="ruleForm.modelconclusion" clearable placeholder="请选择">
                <ami-option label="全部" :value="''"></ami-option>
                <ami-option
                  v-for="item in approval_examine"
                  :label="item.codeClsValName"
                  :value="item.codeClsVal"
                  :key="item.codeClsVal"
                ></ami-option>
              </ami-select>
            </ami-form-item>
          </ami-col>
          <ami-col :span="18">
            <div style="float: right">
              <ami-button round @click="resetForm('form')">重 置</ami-button>
              <ami-button round type="primary" @click="submitForm('form')" v-dbClick>查 询</ami-button>
            </div>
          </ami-col>
        </ami-row>
      </ami-form>
    </ami-card>
    <!-- 表单部分 -->
    <div class="applicationfile-table">
      <div class="content">
        <Tables
          ref="tables"
          title="标准应用档案列表"
          operation
          :columns="columns"
          :axiosData="axiosData"
          @selection-change="handleSelectionChange"
        >
          <!-- 上面操作按钮 -->
          <template slot="titleRight">
            <ami-button round icon="ami-icons-a-add" type="primary" @click="handleAdd()"> 新增</ami-button>
            <ami-button round icon="ami-icons-a-edit" :type="edits ? 'primary' : ''" @click="handleEdit()"> 编辑 </ami-button>
            <ami-button icon="ami-icon-delete" :type="deletes ? 'primary' : ''" @click="handleDelete()" round> 删除</ami-button>
            <ami-button icon="ami-icons-daochu" @click="exportExcel()" round> 导出</ami-button>
          </template>
          <!-- 底部按钮 -->
          <div slot="bottom">
            <ami-button round :type="review ? 'primary' : ''" @click="handleReview()">选择评审单位</ami-button>
          </div>
          <!-- 应用名称 -->
          <template slot="appName" slot-scope="{ scope }">
            <ami-link @click="ApplicationName(scope.row)" style="color: #0040d0"> {{ scope.row.appName }} </ami-link>
          </template>
        </Tables>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs"; //时间格式化
import { mapGetters, mapActions } from "vuex";
import { exportAppStandardPage } from "@/api/approval/approval";
export default {
  name: "AMI-MA0102054-02",
  data() {
    return {
      isShow: false, //是否显示
      edits: false, //编辑按钮
      deletes: false, //删除按钮
      review: false, //选择评审单位
      multipleSelection: [], // 多选
      ruleForm: {
        appName: "", //应用名称
        busCls: "", //应用类型
        Reviewconclusion: "", //功能设计评审结论
        modelconclusion: "", //数模评审结论
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
          label: "应用分类",
          key: "busClsName",
        },
        {
          label: "功能设计评审结论",
          key: "auditStatusName",
        },
        {
          label: "数模评审结论",
          key: "auditStatusName",
        },
        {
          label: "版本号",
          key: "verNo",
        },
        {
          label: "试点省份",
          key: "pubRange",
        },
        {
          label: "开发厂商",
          key: "appAverageScore",
        },
      ],
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters(["approval_classify", "approval_examine"]),
  },
  methods: {
    ...mapActions(["getApprovalClassify", "getApprovalExamine"]),
    // 初始化
    init() {
      this.getApprovalClassify({ appsCategory: "01" }); //应用分类
      this.getApprovalExamine({ codeClsType: "02_EXAM_STATUS" }); //审批状态
      this.loadTable();
    },
    // 分页查询-加载列表
    loadTable() {
      this.axiosData.filter = this.ruleForm; // 赋值
      this.$nextTick(() => {
        this.$refs.tables.queryTableData();
      });
    },
    // 新增
    handleAdd() {
      this.$router.push({ path: "/applicationfile_add" });
    },
    // 编辑
    handleEdit() {
      const change = this.multipleSelection.length;
      if (change == 0 || change > 1) {
        this.$message.warning("请选择一条数据");
        return;
      } else {
        if (this.edits) {
          this.$router.push({
            path: "/applicationfile_edit",
            query: {
              appId: this.multipleSelection[0].appId,
              appVerId: this.multipleSelection[0].appVerId,
            },
          });
        } else {
          this.$message.warning("该应用不可编辑");
          return;
        }
      }
    },
    // 删除
    handleDelete() {
      const change = this.multipleSelection.length;
      if (change == 0 || change > 1) {
        this.$message.warning("请至少选择一条数据");
        return;
      } else {
        if (this.deletes) {
          this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
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
    // 选择评审单位
    handleReview() {
      const change = this.multipleSelection.length;
      if (change == 0 || change > 1) {
        this.$message.warning("请选择一条数据");
        return;
      } else {
        if (this.review) {
          this.$message.success("选择评审单位");
        } else {
          this.$message.warning("该应用不可评审");
          return;
        }
      }
    },
    // 导出
    exportExcel() {
      let params = {
        filter: {
          appVerIdList: this.multipleSelection.map((item) => item.appVerId),
        },
      };
      exportAppStandardPage(params).then((res) => {
        let data = new Date();
        const blob = new Blob([res.data]);
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        const time = dayjs(data).format("YYYY-MM-DD");
        a.href = url;
        a.download = `标准应用档案列表${time}.xlsx`; //文件名称
        a.click();
        window.URL.revokeObjectURL(url);
        this.$message.success("导出成功");
      });
    },
    // 跳转-应用详情
    ApplicationName(row) {
      this.$router.push({
        path: "/applicationfile_details",
        query: {
          appId: row.appId,
          appVerId: row.appVerId,
        },
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
    // 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length == 1) {
        this.edits = true;
        this.deletes = true;
        this.review = true;
      } else {
        this.edits = false;
        this.deletes = false;
        this.review = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.applicationfile {
  display: flex;
  width: calc(100% - 24px);
  height: calc(100% - 12px);
  margin: 0 12px 12px 12px;
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
