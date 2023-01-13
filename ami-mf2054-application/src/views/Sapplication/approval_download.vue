<!--
 * @description: 应用下载记录
 * @author: 王浩
 * @Date: 2022-10-12 10:40:54
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="download">
    <!-- 查询部分 -->
    <div class="download-Inquire">
      <ami-card>
        <ami-model-title title="查询条件"></ami-model-title>
        <ami-form label-width="120px" ref="form" :model="ruleForm">
          <ami-row>
            <ami-col :span="6">
              <ami-form-item label="应用版本" prop="verNo">
                <ami-select v-model="ruleForm.verNo" clearable placeholder="请选择">
                  <ami-option label="全部" value=""></ami-option>
                  <ami-option v-for="item in versionList" :key="item.verNo" :label="item.verNo" :value="item.verNo"></ami-option>
                </ami-select>
              </ami-form-item>
            </ami-col>
            <ami-col :span="6">
              <ami-form-item label="下载人" prop="dlUserName">
                <ami-input
                  v-model="ruleForm.dlUserName"
                  clearable
                  placeholder="请输入"
                  maxlength="10"
                  show-word-limit
                ></ami-input>
              </ami-form-item>
            </ami-col>
            <ami-col :span="6">
              <ami-form-item label="下载时间" prop="createDate">
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
                >
                </ami-date-picker>
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
    </div>
    <!-- 表单部分 -->
    <div class="download-table">
      <div class="content">
        <Tables
          ref="tables"
          title="应用下载记录列表"
          :columns="columns"
          :axiosData="axiosData"
          @selection-change="handleSelectionChange"
        >
          <template slot="titleRight">
            <ami-button icon="ami-icons-daochu" @click="exportExcel()" round> 导出</ami-button>
          </template>
          <template slot="appName" slot-scope="{ scope }">
            <ami-link @click="approval_details(scope.row)" style="color: #0040d0">
              {{ scope.row.appName }}
            </ami-link>
          </template>
        </Tables>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs"; //时间格式化
import { exportAppDIRecords, queryVerNoHistory } from "@/api/approval/approval";
export default {
  name: "AMI-MA0102054-06",
  data() {
    return {
      createDate: "", // 时间
      versionList: [], // 版本号
      multipleSelection: [], // 多选
      ruleForm: {
        appId: "", // 应用ID
        verNo: "", // 版本
        dlUserName: "", //下载人
        dlStartTime: "", //下载开始时间
        dlEndTime: "", //下载结束时间
        appVerIdList: [], //导出id
      },
      // 查询条件
      axiosData: {
        url: "/ami/ma01-02-054/app-dl-rec/queryAppDlRecPage",
        filter: {},
      },
      // 配置表单
      columns: [
        {
          label: "序号",
          key: "index",
          type: "index",
          align: "center",
          width: "80px",
        },
        {
          label: "应用名称",
          key: "appName",
          renderType: "slot",
          width: "200px",
        },
        {
          label: "应用类型",
          key: "appCls",
        },
        {
          label: "应用分类",
          key: "appType",
        },
        {
          label: "版本号",
          key: "verNo",
        },
        {
          label: "发布时间",
          key: "pubTime",
        },
        {
          label: "下载人",
          key: "dlUserName",
        },
        {
          label: "下载时间",
          key: "dlTime",
        },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.ruleForm.appId = this.$route.query.appId;
        this.loadTable();
        this.load_version();
      });
    },
    // 分页查询-加载列表
    loadTable() {
      // 赋值
      this.axiosData.filter = {
        appId: this.$route.query.appId || this.ruleForm.appId,
        verNo: this.ruleForm.verNo, // 版本
        dlUserName: this.ruleForm.dlUserName,
        dlStartTime: this.createDate ? this.createDate[0] : "",
        dlEndTime: this.createDate ? this.createDate[1] : "",
      };
      this.$refs.tables.queryTableData();
    },
    // 查询-应用版本
    load_version() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.$route.query.appVerId,
      };
      queryVerNoHistory(params).then((res) => {
        if (res.data.code === 200) {
          this.versionList = res.data.data;
        }
      });
    },
    // 跳转-应用详情
    approval_details(row) {
      this.$router.push({
        path: "/application_details",
        query: {
          appId: row.appId,
          appVerId: row.appId,
        },
      });
    },
    // 导出
    exportExcel() {
      this.ruleForm.appVerIdList = this.multipleSelection.map((item) => item.appVerId);
      let params = {
        filter: this.ruleForm,
      };
      exportAppDIRecords(params).then((res) => {
        let data = new Date();
        const blob = new Blob([res.data]);
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        const time = dayjs(data).format("YYYY-MM-DD");
        a.href = url;
        a.download = `应用下载记录列表${time}.xlsx`; //文件名称
        a.click();
        window.URL.revokeObjectURL(url);
        this.$message.success("导出成功");
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
    //勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  watch: {
    $route(to) {
      console.log(to);
    },
  },
};
</script>
<style lang="scss" scoped>
.download {
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  margin: 0 12px 12px 12px;
  display: flex;
  flex-direction: column;
  &-Inquire {
    margin-bottom: 12px;
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
