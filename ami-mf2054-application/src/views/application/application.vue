<!--
 * @description: 标准应用管理
 * @author: 王浩
 * @Date: 2022-10-22 10:40:58
 * @Modified By:
 * @version: 1.0.0
-->
<template>
  <div class="application">
    <!-- 查询部分 -->
    <div class="application-Inquire">
      <ami-card>
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
            <ami-col :span="6">
              <ami-form-item label="审批状态" prop="auditStatus">
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
            <ami-col :span="6" v-show="isShow">
              <ami-form-item label="最新版本号" prop="verNo">
                <ami-input v-model="ruleForm.verNo" clearable placeholder="请输入"></ami-input>
              </ami-form-item>
            </ami-col>
            <ami-col :span="6" v-show="!isShow">
              <div style="float: right">
                <ami-button round @click="resetForm('form')">重 置</ami-button>
                <ami-button round type="primary" icon="ami-icon-search" @click="submitForm('form')" v-dbClick>查 询</ami-button>
              </div>
            </ami-col>
          </ami-row>
          <ami-row v-show="isShow">
            <ami-col :span="6">
              <ami-form-item label="适合基座版本" prop="Baseversion">
                <ami-input v-model="ruleForm.Baseversion" clearable placeholder="请输入"></ami-input>
              </ami-form-item>
            </ami-col>
            <ami-col :span="18">
              <div style="float: right">
                <ami-button round @click="resetForm('form')">重 置</ami-button>
                <ami-button round type="primary" icon="ami-icon-search" @click="submitForm('form')" v-dbClick>查 询</ami-button>
              </div>
            </ami-col>
          </ami-row>
        </ami-form>
      </ami-card>
    </div>
    <!-- 表单部分 -->
    <div class="application-table">
      <div class="content">
        <Tables
          ref="tables"
          title="标准应用列表"
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
            <ami-button icon="ami-icons-a-edit" @click="handleFile()" round type="primary">档案管理</ami-button>
            <ami-button icon="ami-icon-delete" @click="handleDelete()" round> 删除</ami-button>
            <ami-button icon="ami-icons-daochu" @click="exportExcel()" round> 导出</ami-button>
          </template>
          <!-- 底部按钮 -->
          <div slot="bottom">
            <ami-button round :type="downStatus ? 'primary' : ''" @click="handleApply()">申请下架</ami-button>
            <ami-button round :type="updateStatus ? 'primary' : ''" @click="updateVer()">版本升级登记</ami-button>
          </div>
        </Tables>
      </div>
    </div>
    <div class="dialog">
      <ShelvesDialog
        ref="shelves"
        :shelvesVisible.sync="shelvesVisible"
        :shelvesForm="shelvesForm"
        @loadTable="loadTable"
      ></ShelvesDialog>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs"; //时间格式化
import { mapGetters, mapActions } from "vuex";
import ShelvesDialog from "@/components/Application/Shelves_dialog.vue"; //下架申请
import { deleteStandardId, exportAppStandardPage, queryLowershelf } from "@/api/approval/approval";
export default {
  name: "AMI-MA0102054-06",
  components: { ShelvesDialog },
  data() {
    return {
      isShow: false, //是否显示
      downStatus: false, //下载按钮
      updateStatus: false, //版本升级按钮
      shelvesVisible: false, //下架申请弹窗
      shelvesForm: {}, //下架申请表单
      multipleSelection: [], // 多选
      ruleForm: {
        appName: "", //应用名称
        busCls: "", //应用类型
        auditStatus: "", //审批状态
        verNo: "", //最新版本号
        Baseversion: "", //适合基座版本
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
          label: "应用版本号",
          key: "verNo",
        },

        {
          label: "应用分类",
          key: "busClsName",
        },
        {
          label: "审核状态",
          key: "auditStatusName",
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
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["approval_classify", "approval_examine"]),
  },
  methods: {
    ...mapActions(["getApprovalClassify", "getApprovalExamine"]),
    init() {
      this.$nextTick(() => {
        this.getApprovalExamine({ codeClsType: "02_EXAM_STATUS" }); //审批状态
        this.getApprovalClassify({ appsCategory: "01" }); //应用分类
        this.loadTable();
      });
    },
    // 查询
    submitForm() {
      this.loadTable();
    },
    // 分页查询-加载列表
    loadTable() {
      this.axiosData.filter = this.ruleForm; // 赋值
      this.$refs.tables.queryTableData();
    },
    // 档案管理-跳转
    handleFile() {
      this.$router.push({ path: "/applicationfile" });
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
              let list = this.multipleSelection.map((item) => item.appVerId);
              deleteStandardId(list).then((res) => {
                if (res.data.code === 200) {
                  this.$message.success("删除成功");
                  this.loadTable();
                }
              });
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
    // 升级版本
    updateVer() {
      const change = this.multipleSelection.length;
      if (change == 0 || change > 1) {
        this.$message.warning("请选择一条数据");
        return;
      } else {
        if (this.updateStatus) {
          this.$router.push({
            path: "/application_upgrade",
            query: {
              appId: this.multipleSelection[0].appId,
              appVerId: this.multipleSelection[0].appVerId,
            },
          });
        } else {
          this.$message.warning("仅支持待发布的应用");
        }
      }
    },
    // 下架申请
    handleApply() {
      const change = this.multipleSelection.length;
      if (change == 0 || change > 1) {
        this.$message.warning("请选择一条数据");
        return;
      } else {
        if (this.downStatus) {
          let params = {
            appId: this.multipleSelection[0].appId,
            appVerId: this.multipleSelection[0].appVerId,
            evalOrgCodeList: [],
          };
          queryLowershelf(params).then((res) => {
            if (res.data.code === 200) {
              this.shelvesVisible = true;
              this.shelvesForm = res.data.data;
            }
          });
        } else {
          this.$message.warning("仅支持已发布的应用");
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
    // 导出
    exportExcel() {
      this.ruleForm.appVerIdList = this.multipleSelection.map((item) => item.appVerId);
      let params = {
        filter: this.ruleForm,
      };
      exportAppStandardPage(params).then((res) => {
        let data = new Date();
        const blob = new Blob([res.data]);
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        const time = dayjs(data).format("YYYY-MM-DD");
        a.href = url;
        a.download = `标准应用列表${time}.xlsx`; //文件名称
        a.click();
        window.URL.revokeObjectURL(url);
        this.$message.success("导出成功");
        this.ruleForm.appVerIdList = []; //清空
      });
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length === 1) {
        if (val[0].verStatus === "01") {
          this.updateStatus = true; // 升级版本状态
        }
        if (val[0].auditStatus == "02" && val[0].verStatus === "01") {
          this.downStatus = true; // 下架状态
        }
      } else {
        this.downStatus = false;
        this.updateStatus = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.application {
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
