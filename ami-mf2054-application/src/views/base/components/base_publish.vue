<!--
 * @description: 基座正式版发布
 * @author: 王浩
 * @Date: 2023-01-02 14:30:08
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <ami-card class="publish" :Approval="Approval">
    <!-- 简介 -->
    <div class="publish-header">
      <div class="header-top">
        <div class="header-img">
          <img :src="Icon(Approval.appIcon)" :onerror="defaultImg" />
        </div>
        <div class="header-mark">
          <div class="mark-start">
            <span class="mask-title">{{ Approval.appName == null ? "--" : Approval.appName }}</span>
            <span>({{ Approval.attributeTypeName == null ? "--" : Approval.attributeTypeName }})</span>
            <div>{{ Approval.busClsName == null ? "--" : Approval.busClsName }}</div>
          </div>
          <p>{{ Approval.appInfo == null ? "--" : Approval.appInfo }}</p>
        </div>
      </div>
    </div>
    <!-- 版本说明 -->
    <div class="publish-version">
      <ami-model-title title="版本说明">
        <div class="scope-btn">
          <ami-button type="text" @click="operation_log()">
            <span class="text">操作日志</span>
          </ami-button>
          <ami-button type="text" @click="handle_relation()">
            <span class="text"> 关联需求</span>
          </ami-button>
          <ami-button type="text" @click="Associate_defects()">
            <span class="text"> 关联缺陷</span>
          </ami-button>
        </div>
      </ami-model-title>
      <p>{{ Approval.verDesc == null ? "--" : Approval.verDesc }}</p>
    </div>
    <!-- 升级原因 -->
    <div class="publish-upgrade">
      <ami-model-title title="升级说明" />
      <div class="shelves-main">
        <ami-row>
          <ami-col :span="1">
            <span class="shelf-txt">升级原因：</span>
          </ami-col>
          <ami-col :span="22">{{ Approval.rmApplyDesc == null ? "--" : Approval.rmApplyDesc }} </ami-col>
        </ami-row>
      </div>
    </div>
    <!-- 设计文件 -->
    <div class="publish-design">
      <ami-model-title title="设计文件" />
      <ami-row style="margin-left: 24px">
        <ami-col :span="8">
          <div class="fileMain">
            <span>基座设计说明书：</span>
            <div class="download_nei">
              <ami-svg-icon :name="fileType['docx']" class="icon-img"></ami-svg-icon>
              <span @click="previewer(item)">基座设计说明书.word</span>
              <img :src="require('@/assets/img/xia_icon.png')" @click="downloader(item)" />
            </div>
          </div>
        </ami-col>
        <ami-col :span="8">
          <div class="fileMain">
            <span>数据模型设计说明书：</span>
            <div class="download_nei">
              <ami-svg-icon :name="fileType['docx']" class="icon-img"></ami-svg-icon>
              <span @click="previewer(item)">数据模型设计说明书.word</span>
              <img :src="require('@/assets/img/xia_icon.png')" @click="downloader(item)" />
            </div>
          </div>
        </ami-col>
      </ami-row>
    </div>
    <!-- 设计评审结论 -->
    <div class="publish-designReview">
      <ami-model-title title="设计评审结论" />
      <!-- 功能设计 -->
      <ami-row class="row">
        <span>功能设计评审结论： 评审通过</span>
      </ami-row>
      <ami-row class="row">
        <ami-col :span="8">
          <div class="fileMain">
            <span>功能设计评审会议纪要：</span>
            <div class="download_nei">
              <ami-svg-icon :name="fileType['docx']" class="icon-img"></ami-svg-icon>
              <span @click="previewer(item)">基座设计说明书.word</span>
              <img :src="require('@/assets/img/xia_icon.png')" @click="downloader(item)" />
            </div>
          </div>
        </ami-col>
      </ami-row>
      <!-- 数模 -->
      <ami-row class="row">
        <span>数模评审结论： 评审通过</span>
      </ami-row>
      <ami-row class="row">
        <ami-col :span="8">
          <div class="fileMain">
            <span>数模校验报告：</span>
            <div class="download_nei">
              <ami-svg-icon :name="fileType['docx']" class="icon-img"></ami-svg-icon>
              <span @click="previewer(item)">数模校验报告.word</span>
              <img :src="require('@/assets/img/xia_icon.png')" @click="downloader(item)" />
            </div>
          </div>
        </ami-col>
        <ami-col :span="8">
          <div class="fileMain">
            <span>数标准数模升级脚本：</span>
            <div class="download_nei">
              <ami-svg-icon :name="fileType['docx']" class="icon-img"></ami-svg-icon>
              <span @click="previewer(item)">数模校验报告.word</span>
              <img :src="require('@/assets/img/xia_icon.png')" @click="downloader(item)" />
            </div>
          </div>
        </ami-col>
        <ami-col :span="8">
          <div class="fileMain">
            <span>基座数模升级脚本：</span>
            <div class="download_nei">
              <ami-svg-icon :name="fileType['docx']" class="icon-img"></ami-svg-icon>
              <span @click="previewer(item)">数模校验报告.word</span>
              <img :src="require('@/assets/img/xia_icon.png')" @click="downloader(item)" />
            </div>
          </div>
        </ami-col>
      </ami-row>
    </div>
    <!-- 附件 -->
    <div class="publish-attachments">
      <ami-model-title title="附件上传" />
      <ami-table
        stripe
        border
        max-height="300"
        :data="tableList"
        :span-method="objectSpanMethod"
        :headerCellStyle="{ 'text-align': 'center' }"
      >
        <ami-table-column prop="attType" label="附件类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color: red">*</span>
            <span>{{ scope.row.attTypeName }}</span>
          </template>
        </ami-table-column>
        <ami-table-column prop="attName" label="文件名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color: #00796a">{{ scope.row.attName == null ? "--" : scope.row.attName }}</span>
            <span v-if="scope.row.attName" @click="deleteField(scope.row)"><i class="ami-icon-close"></i></span>
          </template>
        </ami-table-column>
        <ami-table-column prop="upStatus" label="当前状态">
          <template slot-scope="scope">
            <span v-if="scope.row.upStatus === '1'" class="yuan"></span>
            <span v-else class="yuan"></span>
            {{ scope.row.upStatus === "1" ? "已上传" : "未上传" }}
          </template>
        </ami-table-column>
        <ami-table-column prop="attSize" label="文件大小（MB）">
          <template slot-scope="scope">{{ filterSize(scope.row.attSize) }}</template>
        </ami-table-column>
        <ami-table-column prop="updateTime" label="上传日期">
          <template slot-scope="scope">{{ scope.row.upStatus == "2" ? "--" : scope.row.updateTime.substring(0, 10) }}</template>
        </ami-table-column>
        <ami-table-column prop="address" label="操作" align="center">
          <template slot-scope="scope">
            <ami-button type="text" @click="handelUpload(scope.$index, scope.row)">上传附件</ami-button>
          </template>
        </ami-table-column>
      </ami-table>
    </div>
    <!-- 功能按钮 -->
    <div class="publish-button">
      <ami-button round @click="resetForm()">取 消</ami-button>
      <ami-button round type="primary" @click="submitForm()">确认发布</ami-button>
    </div>
    <!-- 弹窗 -->
    <div class="dialong">
      <!-- 操作日志弹窗-流程 -->
      <OperationDialog :OperationVisible.sync="OperationVisible" :operationList="operationList"></OperationDialog>
      <!-- 关联需求弹窗 -->
      <AssociateDialog :AssociateVisible.sync="AssociateVisible" :AssociateList="AssociateList"></AssociateDialog>
      <DefectDialog :DefectVisible.sync="DefectVisible"></DefectDialog>
      <!-- 预览弹窗 -->
      <PreviewDialog
        :visible.sync="visible"
        :allowEdit="allowEdit"
        :fileId="file.fileId"
        :fileName="file.fileName"
        :fileType="file.fileType"
      ></PreviewDialog>
      <!-- 表格附件弹窗 -->
      <UploadModalFile
        ref="uploadModalFile"
        :TableVisible.sync="TableVisible"
        :configBlue="configBlue"
        @uploadSuccess="uploadSuccess"
      ></UploadModalFile>
    </div>
  </ami-card>
</template>
<script>
import mixins from "./mixins";
import UploadModalFile from "@/components/UploadModalFile";
import { fileType } from "@/utils/application";
import { IFileConfigBlue } from "@/components/FileUploaderBlue/IFileConfigBlue";
import { fileUploadRemover } from "@/api/application/application";
export default {
  name: "AMI-MA0102054-17",
  mixins: [mixins],
  data() {
    return {
      fileType: fileType,
      configBlue: new IFileConfigBlue(),
      TableVisible: false, //附件上传弹窗
      Approval: {}, //详情数据
      position: 0, //表格位置
      spanArr: [], //表格暂存
      tableList: [
        {
          attType: "01", //附件类型
          attTypeName: "基座程序文件(.tar/.zip/.rar)",
          attName: null, //文件名称
          upStatus: "2", //当前状态
          attSize: "", //文件大小(MB)
          updateTime: "", //上传日期
        },
        {
          attType: "02", //附件类型
          attTypeName: "数据初始化升级脚本(.tar/.zip/.rar)",
          attName: null, //文件名称
          upStatus: "2", //当前状态
          attSize: "", //文件大小(MB)
          updateTime: "", //上传日期
        },
        {
          attType: "03", //附件类型
          attTypeName: "基座部署手册(.word/.pdf)",
          attName: null, //文件名称
          upStatus: "2", //当前状态
          attSize: "", //文件大小(MB)
          updateTime: "", //上传日期
        },
        {
          attType: "04", //附件类型
          attTypeName: "基座发布说明(.word/.pdf)",
          attName: null, //文件名称
          upStatus: "2", //当前状态
          attSize: "", //文件大小(MB)
          updateTime: "", //上传日期
        },
        {
          attType: "05", //附件类型
          attTypeName: "基座测试功能报告(.word/.pdf)",
          attName: null, //文件名称
          upStatus: "2", //当前状态
          attSize: "", //文件大小(MB)
          updateTime: "", //上传日期
        },
      ],
    };
  },
  components: { UploadModalFile },
  mounted() {
    this.rowspan();
  },
  methods: {
    // 发布
    submitForm() {
      for (let i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].attName == null && this.tableList[i].upStatus == "2") {
          this.$message.error("请上传" + this.tableList[i].attTypeName);
          return;
        }
      }
      this.$message.success("发布成功");
    },
    // 取消
    resetForm() {
      this.remoteRoute.closePath({
        path: "/base_publish",
        toPath: "/mf0102054/base",
      });
    },
    // 上传附件
    handelUpload(index, row) {
      this.rowIndex = index; //当前行
      this.TableVisible = true;
      let config = new IFileConfigBlue();
      // 附件上传配置
      config.domId = "file__" + Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
      for (let i = 0; i < row.length; i++) {
        if (row[i].attType == "01") {
          config.fileAccept = `application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf`;
          config.reminder = "支持上传文件格式为：.doc,.docx,.pdf";
        }
      }
    },
    // 附件完成
    uploadSuccess(e) {
      if (e && e.length) {
        const params = e[0]?.data.data;
        this.tableList.forEach((item, index) => {
          if (index === this.rowIndex) {
            //未上传
            if (item.upStatus == "2") {
              item.upStatus = "1";
              item.attName = params.fileName;
              item.attSize = params.fileSize;
              item.updateTime = e[0]?.data.timestamp;
              item["attNo"] = params.fileId;
            } else {
              let data = {
                upStatus: "1",
                attTypeName: item.attTypeName,
                attType: item.attType,
                attName: params.fileName,
                attSize: params.fileSize,
                updateTime: e[0].data.timestamp,
                attNo: params.fileId,
              };
              // 添加占位
              this.tableList.splice(this.rowIndex + 1, 0, data);
            }
          }
        });
        this.spanArr = [];
        this.$refs.uploadModalFile.clear();
        this.rowspan();
        this.$message.success("上传成功");
        this.TableVisible = false;
        console.log(this.tableList);
      } else {
        this.$message.error("上传失败");
      }
    },
    // 附件删除
    deleteField(row) {
      var webPackageData = []; //新数组
      var instPackageData = [];
      var servicePackageData = [];
      var dbScriptData = [];
      var configFileData = [];
      var testReportManualData = [];
      var instManualData = [];
      var useManualData = [];
      var otherAttachmentData = [];
      var dataModelData = [];
      if (
        !this.tableList.some((item) => {
          return item.attType == "01";
        })
      ) {
        this.tableList.forEach((item) => {
          if (item.attType === "03") {
            servicePackageData.push(item);
          } else if (item.attType === "04") {
            dbScriptData.push(item);
          } else if (item.attType === "09") {
            configFileData.push(item);
          } else if (item.attType === "06") {
            testReportManualData.push(item);
          } else if (item.attType === "07") {
            instManualData.push(item);
          } else if (item.attType === "08") {
            useManualData.push(item);
          } else if (item.attType === "09") {
            otherAttachmentData.push(item);
          } else if (item.attType === "10") {
            dataModelData.push(item);
          }
        });
      } else {
        this.tableList.forEach((item) => {
          if (item.attType === "01") {
            webPackageData.push(item);
          } else if (item.attType === "02") {
            instPackageData.push(item);
          } else if (item.attType === "03") {
            servicePackageData.push(item);
          } else if (item.attType === "04") {
            dbScriptData.push(item);
          } else if (item.attType === "09") {
            configFileData.push(item);
          } else if (item.attType === "06") {
            testReportManualData.push(item);
          } else if (item.attType === "07") {
            instManualData.push(item);
          } else if (item.attType === "08") {
            useManualData.push(item);
          } else if (item.attType === "09") {
            otherAttachmentData.push(item);
          } else if (item.attType === "10") {
            dataModelData.push(item);
          }
        });
      }

      let param = {
        fileId: row.attNo,
      };
      fileUploadRemover(param).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("删除成功");
          this.tableList.forEach((item, index, self) => {
            if (item.attNo === row.attNo) {
              if (item.attType === "01" && webPackageData.length > 1) {
                self.splice(index, 1);
              } else if (item.attType === "02" && instPackageData.length > 1) {
                self.splice(index, 1);
              } else if (item.attType === "03" && servicePackageData.length > 1) {
                self.splice(index, 1);
              } else if (item.attType === "04" && dbScriptData.length > 1) {
                self.splice(index, 1);
              } else if (item.attType === "09" && configFileData.length > 1) {
                self.splice(index, 1);
              } else if (item.attType === "06" && testReportManualData.length > 1) {
                self.splice(index, 1);
              } else if (item.attType === "07" && instManualData.length > 1) {
                self.splice(index, 1);
              } else if (item.attType === "08" && useManualData.length > 1) {
                self.splice(index, 1);
              } else if (item.attType === "09" && otherAttachmentData.length > 1) {
                self.splice(index, 1);
              } else if (item.attType === "10" && dataModelData.length > 1) {
                self.splice(index, 1);
              } else {
                item.attTypeName = row.attTypeName;
                item.attType = row.attType;
                item.attName = null;
                item.upStatus = "2";
                item.attSize = "";
                item.updateTime = "";
                item.attNo = "";
              }
            }
          });
          this.spanArr = []; // 清缓存
          this.rowspan();
        } else {
          this.$message({
            type: "info",
            message: "删除失败！",
          });
        }
      });
    },
    // 下载文件
    downloader() {},
    // 表格-初始化
    rowspan() {
      this.tableList.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (this.tableList[index].attType === this.tableList[index - 1].attType) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    // 表格合并
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.publish {
  width: calc(100% - 24px);
  height: calc(100% - 12px);
  margin: 0 auto;
  overflow-y: auto;
  &-header {
    width: 100%;
    padding: 10px;
    .header-top {
      display: flex;
      width: 100%;
      margin-bottom: 20px;
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
        width: 100%;
        margin-left: 20px;
        .mark-start {
          width: 100%;
          height: 36px;
          line-height: 36px;
          .mask-title {
            font-size: 21px;
            font-weight: bold;
          }
          div {
            display: inline-block;
            height: 28px;
            line-height: 28px;
            padding: 0px 6px;
            background: #f2f2f2;
            margin-left: 24px;
            border-radius: 6px;
          }
          span:nth-child(3) {
            margin-left: 24px;
            font-size: 14px;
            color: #666;
          }
          .text {
            float: right;
            margin-left: 30px;
            font-size: 15px;
            font-weight: bold;
            text-decoration: underline;
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
  }
  &-version {
    width: 100%;
    padding: 10px 0px;
    span:nth-child(1) {
      color: #666;
      font-size: 14px;
    }
    .scope-btn {
      display: inline-block;
      .text {
        color: #0040d1;
        margin-left: 10px;
        font-size: 15px;
        font-weight: bold;
        text-decoration: underline;
      }
    }
    p {
      margin: 0px;
      font-size: 14px;
      font-weight: 400;
      word-break: break-all;
    }
  }
  &-upgrade {
    width: 100%;
    .shelves-main {
      width: 100%;
      margin-left: 24px;
      .xia {
        cursor: pointer;
        color: #0040d1;
        margin-left: 12px;
        font-size: 14px;
        font-weight: bold;
        text-decoration: underline;
      }
    }
  }
  &-design,
  &-designReview {
    width: 100%;
    padding: 10px 0px;
    .row {
      margin-left: 24px;
      margin-bottom: 12px;
    }
    .fileMain {
      display: flex;
      height: 40px;
      line-height: 40px;
      span {
        font-size: 14px;
      }
      .download_nei {
        display: flex;
        align-items: center;
        width: 50%;
        height: 40px;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        padding: 10px;
        position: relative;
        .icon-img {
          width: 24px;
          height: 24px;
          margin-right: 20px;
        }
        span {
          width: 80%;
          font-size: 14px;
          cursor: pointer;
        }
        span:hover {
          color: #0040d0;
          text-decoration: underline;
        }
        img {
          position: absolute;
          cursor: pointer;
          right: 20px;
        }
      }
    }
  }
  &-attachments {
    .ami-table {
      width: 98%;
      margin: 15px auto;
      border-radius: 8px;
    }
    .yuan {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background: #1cc612;
    }
  }
  &-button {
    height: 60px;
    padding: 12px;
    padding-left: 0px;
    display: flex;
    justify-content: right;
  }
}
</style>
