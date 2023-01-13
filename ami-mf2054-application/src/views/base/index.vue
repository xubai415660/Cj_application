<!--
 * @description: 基座档案管理
 * @author: 王浩
 * @Date: 2023-01-02 14:18:44
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <div class="base">
    <!-- 查询部分 -->
    <ami-card class="base-Inquire">
      <ami-model-title title="查询条件" />
      <ami-form :model="ruleForm" ref="form" label-width="140px">
        <ami-row>
          <ami-col :span="6">
            <ami-form-item label="基座版本" prop="verNo">
              <ami-input v-model="ruleForm.verNo" clearable placeholder="请输入"></ami-input>
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
    <div class="base-table">
      <div class="content">
        <Tables
          ref="tables"
          title="基座档案列表"
          operation
          :columns="columns"
          :axiosData="axiosData"
          @selection-change="handleSelectionChange"
        >
          <template slot="titleRight">
            <ami-button round icon="ami-icons-a-add" type="primary" @click="handleUpgrade()"> 升级登记</ami-button>
            <ami-button icon="ami-icon-delete" :type="deletes ? 'primary' : ''" @click="handleDelete()" round> 删除</ami-button>
            <ami-button icon="ami-icons-daochu" @click="exportExcel()" round> 导出</ami-button>
          </template>
          <div slot="bottom">
            <ami-button round :type="design ? 'primary' : ''" @click="handleDesign_file()">提交设计文件</ami-button>
            <ami-button round :type="conclusion ? 'primary' : ''" @click="handleConclusion()">提交功能设计结论</ami-button>
            <ami-button round :type="publish ? 'primary' : ''" @click="handlePublish()">正式版发布</ami-button>
          </div>
          <!-- 应用名称 -->
          <template slot="appName" slot-scope="{ scope }">
            <ami-link @click="BaseName(scope.row)" style="color: #0040d0"> {{ scope.row.appName }} </ami-link>
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
  name: "AMI-MA0102054-13",
  data() {
    return {
      deletes: false, //删除按钮
      design: false, //设计文件
      conclusion: false, //功能设计结论
      publish: false, //正式版发布
      multipleSelection: [], // 多选
      ruleForm: {
        verNo: "", // 基座版本
        Reviewconclusion: "", // 功能设计评审结论
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
          label: "基座版本",
          key: "appName",
          renderType: "slot",
        },
        {
          label: "功能设计评审结论",
          key: "auditStatus",
        },
        {
          label: "数模评审结论",
          key: "auditStatusName",
        },
        {
          label: "登记单位",
          key: "appAverageScore",
        },
        {
          label: "登记时间",
          key: "time",
        },
      ],
    };
  },
  mounted() {
    this.getApprovalExamine({ codeClsType: "02_EXAM_STATUS" }); //审批状态
    this.loadTable();
  },
  computed: {
    ...mapGetters(["approval_examine"]),
  },
  methods: {
    ...mapActions(["getApprovalExamine"]),
    // 分页查询-加载列表
    loadTable() {
      this.axiosData.filter = this.ruleForm; // 赋值
      this.$nextTick(() => {
        this.$refs.tables.queryTableData();
      });
    },
    // 升级
    handleUpgrade() {
      this.$router.push({
        path: "/base_upgrade",
      });
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
    // 提交设计文件
    handleDesign_file() {
      const change = this.multipleSelection.length;
      if (change == 0 || change > 1) {
        this.$message.warning("请至少选择一条数据");
        return;
      } else {
        if (this.design) {
          this.$router.push({
            path: "/base_designfile",
          });
        } else {
          this.$message.warning("该基座不可提交设计文件");
          return;
        }
      }
    },
    // 提交功能设计结论
    handleConclusion() {
      const change = this.multipleSelection.length;
      if (change == 0 || change > 1) {
        this.$message.warning("请至少选择一条数据");
        return;
      } else {
        if (this.conclusion) {
          this.$router.push({
            path: "/base_designConclusion",
          });
        } else {
          this.$message.warning("该基座不可提交功能设计结论");
          return;
        }
      }
    },
    // 正式版发布
    handlePublish() {
      const change = this.multipleSelection.length;
      if (change == 0 || change > 1) {
        this.$message.warning("请至少选择一条数据");
        return;
      } else {
        if (this.publish) {
          this.$router.push({
            path: "/base_publish",
          });
        } else {
          this.$message.warning("该基座不可发布正式版");
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
        a.download = `基座档案列表${time}.xlsx`; //文件名称
        a.click();
        window.URL.revokeObjectURL(url);
        this.$message.success("导出成功");
      });
    },
    // 跳转-基座详情
    BaseName(row) {
      this.$router.push({
        path: "/base_details",
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
        this.deletes = true;
        this.design = true;
        this.conclusion = true;
        this.publish = true;
      } else {
        this.deletes = false;
        this.design = false;
        this.conclusion = false;
        this.publish = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.base {
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
