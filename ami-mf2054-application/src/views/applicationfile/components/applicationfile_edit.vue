<!--
 * @description: 编辑标准应用档案
 * @author: 王浩
 * @Date: 2023-01-02 11:29:53
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <ami-card class="application-edit">
    <ami-form ref="form" :model="ruleForm" :rules="rules" label-width="100px" label-position="right">
      <!-- 基本信息 -->
      <div class="edit-basic">
        <ami-model-title title="基本信息" />
        <ami-row>
          <ami-col :span="6">
            <ami-form-item label="应用名称" prop="appNameBa">
              <ami-input v-model="ruleForm.appNameBa" clearable placeholder="请输入" maxlength="10" show-word-limit></ami-input>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="应用分类" prop="busClsBa">
              <ami-select v-model="ruleForm.busClsBa" clearable placeholder="请选择">
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
            <ami-form-item label="开发厂商" prop="appManufacturerBa">
              <ami-select v-model="ruleForm.appManufacturerBa" clearable placeholder="请选择">
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
            <ami-form-item label="基座版本" prop="baseVer">
              <ami-select v-model="ruleForm.baseVer" clearable placeholder="请选择">
                <ami-option
                  v-for="item in approval_classify"
                  :key="item.businessCategory"
                  :label="item.businessCategoryName"
                  :value="item.businessCategory"
                ></ami-option>
              </ami-select>
            </ami-form-item>
          </ami-col>
        </ami-row>
        <ami-row>
          <ami-col :span="6">
            <ami-form-item label="版本号" prop="verNoVer">
              <ami-version-number clearable maxlength="2" v-model="ruleForm.verNoVer"></ami-version-number>
            </ami-form-item>
          </ami-col>
        </ami-row>
      </div>
      <!-- 应用图标 -->
      <div class="edit-img">
        <ami-model-title title="应用图标" />
        <div style="display: flex">
          <div style="margin-right: 4px; color: #ec5757">*</div>
          <div class="img-image">
            <div class="img-show" v-if="codeImg">
              <img :src="codeImg" alt />
              <div class="img-delete">
                <i class="ami-icon-delete" @click="handleRemove"></i>
              </div>
            </div>
            <ami-upload
              v-else
              ref="uploads"
              list-type="picture-card"
              :multiple="false"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="uploadImg"
              accept="image/jpg,image/jpeg,image/png"
              action="/ami/ma01-02-056/minio-file/fileUpload"
            >
              <i class="ami-icon-plus"></i>
            </ami-upload>
          </div>
        </div>
      </div>
      <!-- 应用介绍 -->
      <div class="edit-Introduction">
        <ami-model-title title="应用介绍" />
        <div class="Introduction-mark" style="display: flex">
          <div class="xing">*</div>
          <div class="Introduction-sginput">
            <ami-form-item prop="appInfoBa">
              <ami-input
                :rows="6"
                clearable
                type="textarea"
                resize="none"
                maxlength="1000"
                show-word-limit
                placeholder="请输入介绍信息"
                v-model="ruleForm.appInfoBa"
              ></ami-input>
            </ami-form-item>
          </div>
        </div>
      </div>
      <!-- 版本说明 -->
      <div class="edit-Imprint">
        <ami-model-title title="版本说明" />
        <div class="Introduction-mark" style="display: flex">
          <div class="xing">*</div>
          <div class="Introduction-sginput">
            <ami-form-item prop="verDescVer">
              <ami-input
                :rows="6"
                clearable
                type="textarea"
                resize="none"
                maxlength="1000"
                show-word-limit
                placeholder="请输入版本更新说明"
                v-model="ruleForm.verDescVer"
              ></ami-input>
            </ami-form-item>
          </div>
        </div>
      </div>
    </ami-form>
    <!-- 需求来源 -->
    <div class="edit-transfer">
      <ami-model-title title="需求来源" class="require-resource-title-area">
        <ami-button round icon="ami-icons-a-add" type="primary" @click="handleAdd()"> 新增</ami-button>
        <ami-button round icon="ami-icon-delete" @click="handleDelete()"> 删除</ami-button>
      </ami-model-title>
      <div class="transfer-table">
        <div v-if="amiTable" style="height: calc(100% - 10px)">
          <ami-table
            border
            stripe
            class="tables"
            size="mini"
            height="100%"
            style="width: 100%"
            ref="requireTable"
            :data="tableData"
            @selection-change="handleSelectionChange"
          >
            <ami-table-column header-align="center" align="center" type="selection" width="60"> </ami-table-column>
            <ami-table-column type="index" width="65" :index="indexMethod" label="序号" show-overflow-tooltip></ami-table-column>
            <ami-table-column prop="fbTitle" label="需求名称" show-overflow-tooltip> </ami-table-column>
            <ami-table-column prop="fbContent" label="实现方式" show-overflow-tooltip></ami-table-column>
            <ami-table-column prop="fbContent" label="需求描述" show-overflow-tooltip></ami-table-column>
            <ami-table-column prop="busClsName" label="分类" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.appClsName }}/{{ scope.row.busClsName }}</span>
              </template>
            </ami-table-column>
            <ami-table-column prop="fileName" label="附件" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.fullName" class="file-name" @click="download(scope.row)">{{ scope.row.fullName }}</span>
                <span v-else>-</span>
              </template>
            </ami-table-column>
          </ami-table>
          <div class="pagination-area">
            <ami-pagination
              background
              size="mini"
              layout="prev,pager,next,totalPage,sizes,slot,jumper"
              :current-page="page.pageIndex"
              :page-size="page.pageSize"
              :page-sizes="[5, 10, 15, 20]"
              :total="page.tableTotal"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </ami-pagination>
          </div>
        </div>
        <ami-empty v-else description="暂无数据"></ami-empty>
      </div>
    </div>
    <!-- 功能按钮 -->
    <div class="edit-button">
      <ami-button round @click="handleClose('form')">取 消</ami-button>
      <ami-button round type="primary" @click="submitForm('form')">保 存</ami-button>
    </div>
    <!-- 需求列表弹窗 -->
    <div class="dialog">
      <ami-dialog title="需求列表" width="960px" :visible.sync="DemandVisible">
        <div class="transfer-shuttle">
          <ami-transfer
            filterable
            v-model="DemandList"
            :data="generateData"
            @change="handleChange"
            :filter-method="filterMethod"
            :titles="['待选区', '已选区']"
            filter-placeholder="请输入名称"
            :props="{
              key: 'reqId',
              label: 'fbTitle',
            }"
          >
          </ami-transfer>
        </div>
        <span slot="footer" class="dialog-footer">
          <ami-button round @click="sgFrameCancel()">取 消</ami-button>
          <ami-button round type="primary" @click="sgFrameDetermine()">确 定</ami-button>
        </span>
      </ami-dialog>
    </div>
  </ami-card>
</template>
<script>
import mixin from "./mixin";
import { remoteRoute } from "@/utils/remoteUtil";
export default {
  name: "AMI-MA0102054-04",
  mixins: [mixin],
  data() {
    return {
      DemandVisible: false, // 需求列表弹窗
      multipleSelection: [], // 选中的数据
      ruleForm: {
        appIcon: "", // 应用图标
        appNameBa: "", // 应用名称
        busClsBa: "", // 应用分类
        verNoVer: "", // 版本号
        baseVer: "", // 基座版本
        appManufacturerBa: "", // 开发厂商,
        appInfoBa: "", // 应用介绍
        verDescVer: "", // 版本说明
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getApprovalClassify({ appsCategory: "01" }); //应用分类
    },
    // 需求-新增
    handleAdd() {
      this.DemandVisible = true;
    },
    // 需求-删除
    handleDelete() {
      if (!this.multipleSelection.length) {
        return this.$message.warning("请选择需求来源");
      } else {
        const reqId = this.multipleSelection.map((item) => item.reqId);
        this.requireTable = this.requireTable.filter((item) => !reqId.includes(item.reqId));
        this.DemandList = this.DemandList.filter((item) => !reqId.includes(item));
        this.page.tableTotal = this.requireTable.length;
        this.multipleSelection = [];
      }
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.appIcon) {
            this.$message.warning("请上传应用图标");
            return;
          }
          this.$message.success("提交成功");
          this.handleClose(formName);
        } else {
          return false;
        }
      });
    },
    // 取消
    handleClose(formName) {
      this.$refs[formName].resetFields();
      remoteRoute.closePath({
        path: "/applicationfile_add",
        toPath: "/mf0102054/applicationfile",
      });
    },
    // 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.application-edit {
  width: calc(100% - 24px);
  height: calc(100% - 12px);
  margin: 0 auto;
  overflow-y: auto;
  .edit-basic {
    /deep/ .ami-select {
      width: 100%;
    }
  }
  //新增 应用图片
  .edit-img {
    padding-left: 0px;
    .img-show {
      position: relative;
      .img-delete {
        cursor: default;
        position: absolute;
        width: 150px;
        height: 100%;
        line-height: 150px;
        left: 0;
        top: 0;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-transition: opacity 0.3s;
        transition: opacity 0.5s;
        border-radius: 5px;
      }
      .img-delete:hover {
        opacity: 0.8;
      }
      img {
        width: 150px;
        height: 150px;
        border-radius: 5px;
      }
    }
  }
  .edit-Introduction,
  .edit-Imprint {
    padding: 10px;
    padding-left: 0px;
    .Introduction-mark {
      display: flex;
      .xing {
        margin-right: 4px;
        color: #ec5757;
      }
      .Introduction-sginput {
        width: calc(100% - 11px);
        /deep/ {
          .ami-form-item__label {
            width: 0px;
            height: 0px;
            overflow: hidden;
          }
          .ami-form-item__content {
            margin-left: 0px !important;
          }
        }
      }
    }
  }
  .edit-transfer {
    .require-resource-title-area {
      margin-bottom: 10px;
      /deep/ .ami-icons-a-add:before {
        color: #fff;
        content: "\e629";
      }
    }
    .transfer-table {
      width: 100%;
      height: 300px;
      text-align: center;
      .tables {
        height: 100%;
        border-radius: 8px 8px 0 0;
        .file-name {
          color: #0040d0;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .pagination-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        background: #fafafa;
        border: 1px solid #dee0e6;
        border-top-color: #fff;
        border-radius: 0 0 8px 8px;
      }
    }
    .transfer-but {
      width: 100%;
      span {
        float: right;
        color: #409eff;
        cursor: pointer;
      }
    }
  }
  .dialog {
    /deep/ .transfer-shuttle {
      width: 100%;
      height: 100%;
      .ami-transfer-panel {
        width: 44%;
      }
      .ami-transfer__buttons {
        display: inline-grid;
      }
      .ami-button + .ami-button {
        margin-left: 0px;
      }
    }
  }
  .edit-button {
    height: 60px;
    padding: 12px;
    padding-left: 0px;
    display: flex;
    justify-content: right;
  }
}
</style>
