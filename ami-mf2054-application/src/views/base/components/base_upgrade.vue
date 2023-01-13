<!--
 * @description: 基座升级登记
 * @author: 王浩
 * @Date: 2023-01-02 14:22:40
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <ami-card class="base_upgrade">
    <!--头部 -->
    <div class="header">
      <div class="header-img">
        <div class="img-image" v-if="codeImg">
          <img :src="codeImg" :onerror="defaultImg" />
          <div class="img-delete">
            <i class="ami-icon-delete" @click="handleRemove"></i>
          </div>
        </div>
        <ami-upload
          v-else
          class="img-uploader"
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
      <div class="header-mark">
        <div class="mark-start">
          <span class="mask-title">时钟管理</span>
          <span>(v1.1.1)</span>
          <div class="mark-btn">
            <button>合众伟奇</button>
          </div>
        </div>
        <p>主站获取标准时钟源的时间信号，实现主站时钟的监测与同步对比营销服务中心（计量中心）</p>
      </div>
    </div>
    <ami-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
      <!-- 版本 -->
      <div class="imprint">
        <ami-model-title title="版本说明" />
        <ami-row>
          <ami-form-item label="说明" prop="Description">
            <ami-input
              :rows="4"
              clearable
              type="textarea"
              resize="none"
              maxlength="1000"
              show-word-limit
              placeholder="请输入版本更新说明"
              v-model="ruleForm.Description"
            ></ami-input>
          </ami-form-item>
        </ami-row>
      </div>
      <!-- 需求来源 -->
      <div class="transfer">
        <ami-model-title title="需求来源" class="require-resource-title-area">
          <ami-button round icon="ami-icons-a-add" type="primary" @click="handleAdd()"> 新增</ami-button>
          <ami-button round icon="ami-icon-delete" @click="handleDelete()"> 删除</ami-button>
        </ami-model-title>
        <div class="transfer-table">
          <div v-if="page.tableTotal" style="height: calc(100% - 60px)">
            <ami-table
              border
              stripe
              class="tables"
              size="mini"
              height="100%"
              style="width: 100%"
              ref="tables"
              :data="tableData"
              @selection-change="handleSelectionChange"
            >
              <ami-table-column header-align="center" align="center" type="selection" width="60"> </ami-table-column>
              <ami-table-column
                type="index"
                width="65"
                :index="indexMethod"
                label="序号"
                show-overflow-tooltip
              ></ami-table-column>
              <ami-table-column prop="fbTitle" label="需求名称" show-overflow-tooltip> </ami-table-column>
              <ami-table-column prop="fbContent" label="实现方式" show-overflow-tooltip></ami-table-column>
              <ami-table-column prop="fbContent" label="需求描述" show-overflow-tooltip></ami-table-column>
              <ami-table-column prop="busClsName" label="应用分类" show-overflow-tooltip>
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
      <!-- 缺陷来源 -->
      <div class="defect-source">
        <ami-model-title title="缺陷来源" class="require-resource-title-area">
          <ami-button round icon="ami-icons-a-add" type="primary" @click="DefectAdd()"> 新增</ami-button>
          <ami-button round icon="ami-icon-delete" @click="DefectDelete()"> 删除</ami-button>
        </ami-model-title>
        <div class="transfer-table">
          <div v-if="page2.tableTotal" style="height: calc(100% - 50px)">
            <ami-table
              border
              stripe
              class="tables"
              size="mini"
              height="100%"
              style="width: 100%"
              ref="requireTable"
              :data="tableData2"
              @selection-change="DefectCheck"
            >
              <ami-table-column header-align="center" align="center" type="selection" width="60"> </ami-table-column>
              <ami-table-column
                type="index"
                width="65"
                :index="indexMethod"
                label="序号"
                show-overflow-tooltip
              ></ami-table-column>
              <ami-table-column prop="fbTitle" label="缺陷名称" show-overflow-tooltip> </ami-table-column>
              <ami-table-column prop="fbContent" label="实现方式" show-overflow-tooltip></ami-table-column>
              <ami-table-column prop="fbContent" label="缺陷描述" show-overflow-tooltip></ami-table-column>
              <ami-table-column prop="busClsName" label="应用分类" show-overflow-tooltip>
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
                :current-page="page2.pageIndex"
                :page-size="page2.pageSize"
                :page-sizes="[5, 10, 15, 20]"
                :total="page2.tableTotal"
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
              >
              </ami-pagination>
            </div>
          </div>
          <ami-empty v-else description="暂无数据"></ami-empty>
        </div>
      </div>
      <!-- 升级原因 -->
      <div class="upgrade">
        <ami-model-title title="升级说明" />
        <ami-row>
          <ami-form-item label="升级原因" prop="UpgradeReason">
            <ami-input
              :rows="4"
              clearable
              type="textarea"
              resize="none"
              maxlength="1000"
              show-word-limit
              placeholder="请输入升级原因"
              v-model="ruleForm.UpgradeReason"
            ></ami-input>
          </ami-form-item>
        </ami-row>
      </div>
    </ami-form>
    <!-- 功能按钮 -->
    <div class="add-button">
      <ami-button round @click="handleClose('ruleForm')">取 消</ami-button>
      <ami-button round type="primary" @click="submitForm('ruleForm')">保 存</ami-button>
    </div>
    <div class="dialog">
      <!-- 需求弹窗 -->
      <DemandSource
        ref="demand"
        :DemandShow.sync="DemandShow"
        :generateData="generateData"
        @DemandDate="DemandDate"
      ></DemandSource>
      <!-- 缺陷弹窗 -->
      <DefectSource
        ref="defect"
        :DefectShow.sync="DefectShow"
        :generateData="generateData"
        @DefectDataChang="DefectDataChang"
      ></DefectSource>
    </div>
  </ami-card>
</template>
<script>
import mixins from "./mixins";
import { remoteRoute } from "@/utils/remoteUtil";
export default {
  name: "AMI-MA0102054-1",
  mixins: [mixins],
  data() {
    return {
      DemandShow: false, // 需求列表弹窗
      DefectShow: false, // 缺陷列表弹窗
      DemandTable: [], // 需求列表-表格数据
      DefectTable: [], // 缺陷列表-表格数据
      multipleSelection: [],
      multipleSelection2: [],
      ruleForm: {
        Description: "", // 版本说明
        UpgradeReason: "", // 升级原因
      },
      // 校验规则
      rules: {
        Description: [{ required: true, message: "请输入说明", trigger: "blur" }],
        UpgradeReason: [{ required: true, message: "请输入升级原因", trigger: "blur" }],
      },
      generateData: [
        {
          reqId: "1",
          reqName: "需求名称",
          fbTitle: "应用名称",
        },
        {
          reqId: "2",
          reqName: "需求名称2",
          fbTitle: "应用名称2",
        },
        {
          reqId: "3",
          reqName: "需求名称3",
          fbTitle: "应用名称3",
        },
      ],
    };
  },
  mounted() {},
  methods: {
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
        path: "/base_upgrade",
        toPath: "/mf0102054/base",
      });
    },
    // 需求-新增
    handleAdd() {
      this.DemandShow = true;
    },
    // 需求-删除
    handleDelete() {
      if (!this.multipleSelection.length) {
        return this.$message.warning("请选择需求来源");
      } else {
        this.multipleSelection.forEach((item) => {
          // 删除表格数据
          this.DemandTable.splice(this.DemandTable.indexOf(item.reqId), 1);
          // 删除穿梭框数据
          this.$refs.demand.removeItem(item.monitorObjId);
        });
        this.page.tableTotal = this.DemandTable.length;
        this.multipleSelection = [];
      }
    },
    // 需求-列表
    DemandDate(val) {
      this.DemandTable = val;
      this.page.tableTotal = val.length;
    },
    // 缺陷-新增
    DefectAdd() {
      this.DefectShow = true;
    },
    // 缺陷-删除
    DefectDelete() {
      if (!this.multipleSelection2.length) {
        return this.$message.warning("请选择缺陷来源");
      } else {
        this.multipleSelection2.forEach((item) => {
          // 删除表格数据
          this.DefectTable.splice(this.DefectTable.indexOf(item.reqId), 1);
          // 删除缺陷穿梭框数据
          this.$refs.defect.removeItem(item.monitorObjId);
        });
        this.page2.tableTotal = this.DefectTable.length;
        this.multipleSelection2 = []; // 清空勾选
      }
    },
    // 缺陷-列表
    DefectDataChang(val) {
      this.DefectTable = val;
      this.page2.tableTotal = val.length;
    },
    // 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 缺陷-勾选
    DefectCheck(val) {
      this.multipleSelection2 = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.base_upgrade {
  width: calc(100% - 24px);
  height: calc(100% - 12px);
  margin: 0 auto;
  overflow-y: auto;
  .header {
    display: flex;
    width: 100%;
    padding: 10px;
    .header-img {
      width: 90px;
      height: 90px;
      .img-image {
        width: 100%;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
        .img-delete {
          cursor: default;
          position: absolute;
          width: 100%;
          height: 100%;
          line-height: 90px;
          left: 0;
          top: 0;
          color: #fff;
          opacity: 0;
          font-size: 20px;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.5);
          -webkit-transition: opacity 0.3s;
          transition: opacity 0.5s;
          border-radius: 5px;
        }
      }
      .img-delete:hover {
        opacity: 0.8;
      }
      .img-uploader {
        /deep/ .ami-upload--picture-card {
          position: relative;
          width: 90px;
          height: 90px;
        }
        /deep/ .ami-upload--picture-card i {
          position: absolute;
          left: 0px;
          top: 30%;
          width: 90px;
        }
      }
    }
    &-mark {
      width: 100%;
      margin-left: 20px;
      .mark-start {
        width: 100%;
        height: 36px;
        line-height: 40px;
        .mask-title {
          font-size: 21px;
          font-weight: bold;
        }
      }
      .mark-btn {
        margin-left: 16px;
        display: inline-flex;
        button {
          margin: 0px 6px;
          padding: 2px 6px;
          border: none;
          border-radius: 4px;
          background: #dcdfe6;
        }
      }
      p {
        overflow: hidden;
        font-size: 14px;
        font-weight: 400;
        width: 100%;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2; /*截取2行*/
        -webkit-box-orient: vertical;
      }
    }
  }
  .imprint,
  .upgrade {
    margin-top: 12px;
    width: 100%;
  }
  .transfer,
  .defect-source {
    margin-top: 12px;
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
  .add-button {
    height: 60px;
    padding: 12px;
    padding-left: 0px;
    display: flex;
    justify-content: right;
  }
}
</style>
