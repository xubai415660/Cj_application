<!--
 * @description: 标准应用档案详情
 * @author: 王浩
 * @Date: 2023-01-02 11:34:51
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <ami-card class="applicationfile_details">
    <!--头部 -->
    <div class="header">
      <div class="header-img">
        <img :src="Icon(Approval.appIcon)" :onerror="defaultImg" />
      </div>
      <div class="header-mark">
        <div class="mark-start">
          <span class="mask-title">{{ Approval.appName }}</span>
          <span>({{ Approval.verNo == null ? "--" : Approval.verNo }})</span>
          <span style="margin-left: 24px">适用基座版本：{{ Approval.verNo }}</span>
        </div>
        <p>{{ Approval.appInfo }}</p>
      </div>
    </div>
    <!-- 范围-操作按钮 -->
    <div class="score-list">
      <!-- 发布范围 -->
      <div class="scope-basic">
        <img :src="require('@/assets/img/ditu.jpg')" />
        <span class="txt"> 试点省份:{{ Approval.pubRange }}</span>
        <span class="lead-unit">牵头单位：测试</span>
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
      </div>
    </div>
    <ami-form ref="form" style="margin-left: 6px">
      <!-- 设计文件 -->
      <div class="design-file">
        <ami-model-title title="设计文件" />
        <ami-row>
          <ami-col :span="6">
            <ami-form-item label="业务需求设计说明书:">
              <span class="file">业务需求设.pdf</span>
              <span class="xia">下载</span>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="业务模型设计说明书:">
              <span class="file">业务需求设.pdf</span>
              <span class="xia">下载</span>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="功能需求设计说明书:">
              <span class="file">业务需求设.pdf</span>
              <span class="xia">下载</span>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="数据模型设计说明书:">
              <span class="file">业务需求设.pdf</span>
              <span class="xia">下载</span>
            </ami-form-item>
          </ami-col>
        </ami-row>
      </div>
      <!-- 设计评审  -->
      <div class="design-review">
        <ami-model-title title="设计评审结论" />
        <ami-row>
          <ami-col :span="6">
            <ami-form-item label="功能设计评审结论:">
              <span class="file">评审通过</span>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="功能设计评审会议纪要:">
              <span class="file">会议.pdf</span>
              <span class="xia">下载</span>
            </ami-form-item>
          </ami-col>
        </ami-row>
        <ami-row>
          <ami-col :span="6">
            <ami-form-item label="数模评审结论:">
              <span class="file">评审通过</span>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="数模检验报告:">
              <span class="file">会议.pdf</span>
              <span class="xia">下载</span>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="标准数模升级脚本:">
              <span class="file">会议.pdf</span>
              <span class="xia">下载</span>
            </ami-form-item>
          </ami-col>
        </ami-row>
      </div>
      <!-- 监测环节 -->
      <div class="inspection">
        <ami-model-title title="检测环节"> </ami-model-title>
        <ami-row :gutter="20">
          <ami-col :span="5">
            <div class="grid-content bg-purple">
              <ami-form-item label="是否通过第三方监测环节:" prop="isSignVerify" class="ml-20">
                <span>{{ Approval.isSignVerify === 1 ? "是" : "否" }}</span>
              </ami-form-item>
            </div>
          </ami-col>
          <ami-col :span="5">
            <div class="grid-content bg-purple-light">
              <ami-form-item label="是否有总部验签:" prop="securityVerify">
                <span>第三方监测报告.pdf</span>
                <span class="xia">下载</span>
              </ami-form-item>
            </div>
          </ami-col>
        </ami-row>
      </div>
    </ami-form>
    <div class="under-attachment">
      <ami-model-title title="附件列表" />
      <!-- 附件表单 -->
      <ami-table
        stripe
        border
        headerStripe
        class="tables"
        style="width: 100%"
        max-height="450"
        :data="AppendixData"
        :span-method="objectSpanMethod"
      >
        <ami-table-column prop="attTypeName" align="center" label="文件类型"> </ami-table-column>
        <ami-table-column align="center" label="文件名称" width="400">
          <template slot-scope="scope">
            <span style="color: #0004d0; cursor: pointer" @click="previewer(scope.row)"> {{ scope.row.attName }}</span>
          </template>
        </ami-table-column>
        <ami-table-column align="center" label="当前状态">
          <template slot-scope="scope">
            <div class="yuan"></div>
            <span>{{ scope.row.updateUserNo }}</span>
          </template>
        </ami-table-column>
        <ami-table-column prop="attSize" align="center" label="文件大小">
          <template slot-scope="scope">
            <span>{{ filterSize(scope.row.attSize) }}</span>
          </template>
        </ami-table-column>
        <ami-table-column prop="updateTime" align="center" label="上传日期"> </ami-table-column>
        <ami-table-column fixed="right" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <ami-button type="text" @click="download(scope.row)">下载</ami-button>
          </template>
        </ami-table-column>
      </ami-table>
    </div>
    <div class="dialog">
      <!-- 操作日志弹窗-流程 -->
      <OperationDialog :OperationVisible.sync="OperationVisible" :operationList="operationList"></OperationDialog>
      <!-- 关联需求列表弹窗 -->
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
    </div>
  </ami-card>
</template>
<script>
import mixin from "./mixin";
import { filterSize } from "@/utils/util";
import { Iconinformation, queryInfoDetailById, queryAppOperLog, queryNeed, fileDownLoad } from "@/api/approval/approval";
import AssociateDialog from "@/components/Application/Associate_dialog"; // 需求明细弹窗
import OperationDialog from "@/components/Application/Operation_dialog"; // 操作记录弹窗
import DefectDialog from "@/components/Application/Defect_dialog"; // 缺陷信息弹窗
import PreviewDialog from "@/components/Approval/Preview_Dialog.vue";
export default {
  name: "AMI-MA0102054-05",
  mixins: [mixin],
  components: {
    AssociateDialog,
    OperationDialog,
    DefectDialog,
    PreviewDialog,
  },
  data() {
    return {
      appVerId: "",
      visible: false, //预览弹窗状态
      allowEdit: false, //是否允许编辑
      AssociateVisible: false, // 关联需求弹窗
      DefectVisible: false, // 缺陷信息弹窗
      OperationVisible: false, // 操作记录弹窗
      Approval: {}, //详情数据
      AppendixData: [], //附件信息
      spanArr: [], //附件--暂存数据
      AssociateList: {}, //关联需求列表数据
      operationList: [], //操作日志
      filterSize: filterSize, //文件大小过滤器
      Icon: Iconinformation, //图标信息
      defaultImg: 'this.src="' + require("@/assets/img/pgy1.jpg") + '"',
      // 文件-预览数据
      file: {
        fileId: "", //文件id
        fileName: "", //文件名称
        fileType: "", //文件类型
      },
    };
  },
  created() {
    this.$nextTick(() => {
      this.appVerId = this.$route.query.appVerId;
      this.load_detail();
    });
  },
  methods: {
    // 查询-详情
    load_detail() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.appVerId,
      };
      queryInfoDetailById(params).then((res) => {
        if (res.data.code === 200) {
          this.Approval = res.data.data;
          this.AppendixData = res.data.data.attInfoVOList;
          this.Appendix(this.AppendixData); //附件
          // 处理发布范围-转换
          if (this.Approval.pubRangeList == null) return;
          this.Approval.pubRange = this.Approval.pubRangeList.map((item) => item.pubOrgName).join("\n");
        }
      });
    },
    // 附件信息
    Appendix(data) {
      if (data === null) return; //如果为null的话直接停止
      for (let i = 0; i < data.length; i++) {
        // 判断attNo为null或者为空，为空的话将数组里面删除
        if (data[i].attId === "" || data[i].attId == null || typeof data[i].attId === undefined) {
          data.splice(i, 1);
          i = i - 1;
        } else if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].attTypeName === data[i - 1].attTypeName) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    // 合并单元格
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
    // 操作日志-弹窗
    operation_log() {
      let params = {
        appId: this.Approval.appId,
        appVerId: this.Approval.appVerId,
      };
      queryAppOperLog(params).then((res) => {
        if (res.data.code === 200) {
          this.operationList = res.data.data;
        }
      });
      this.OperationVisible = true;
    },
    // 关联缺陷-弹窗
    Associate_defects() {
      this.DefectVisible = true;
    },
    // 关联需求-弹窗
    handle_relation() {
      let params = {
        filter: {
          appVerId: this.Approval.appVerId, //应用版本id
        },
      };
      queryNeed(params).then((res) => {
        if (res.data.code === 200) {
          this.AssociateList = res.data.data;
          console.log(this.AssociateList, "需求管理");
          this.AssociateVisible = true;
        }
      });
    },
    // 文件-预览
    previewer(row) {
      this.allowEdit = false;
      // 获取attName中的文件后缀名
      let fileType = row.attName.split(".").pop().toString();
      console.log(fileType);
      if (fileType == this.Mapping[fileType]) {
        this.$message.warning("暂不支持该文件类型预览！");
      } else {
        this.file = {
          fileId: "616329654119002112",
          fileName: row.attName,
          fileType: fileType,
        };
        this.visible = true;
      }
    },
    // 下载附件
    download(row) {
      if (row.attId === null) return;
      let params = { fileId: row.attId };
      fileDownLoad(params)
        .then((res) => {
          if (res.status === 200) {
            let fileName = row.attName; // fileName文件名称
            let url = window.URL.createObjectURL(new Blob([res.data]));
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            this.$message({
              type: "success",
              message: "下载文件成功!",
            });
          }
        })
        .catch(() => {
          this.$message.error("下载文件失败！");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.applicationfile_details {
  width: calc(100% - 24px);
  height: calc(100% - 12px);
  margin: 0 auto;
  overflow-y: auto;
  .header {
    position: relative;
    display: flex;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #e8e8e8;
    &-img {
      width: 90px;
      height: 90px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
    &-sp {
      width: 140px;
      position: absolute;
      right: 40px;
      top: 10px;
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
        .mark-select {
          margin-left: 20px;
          display: inline-block;
        }
        .text {
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
  .score-list {
    width: 100%;
    padding: 10px;
    display: flex;
    margin-bottom: 12px;
    border-bottom: 1px solid #e8e8e8;
    .scope-basic {
      width: 100%;
      height: 40px;
      line-height: 40px;
      display: flex;
      margin-left: 12px;
      img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
      .txt {
        font-size: 13px;
        color: #0f0f0f;
      }
      .lead-unit {
        font-size: 15px;
        margin-left: 16px;
      }
    }
    .scope-btn {
      display: flex;
      flex: 1;
      align-content: center;
      justify-content: flex-end;
      .text {
        margin-left: 10px;
        font-size: 15px;
        font-weight: bold;
        text-decoration: underline;
      }
    }
  }
  .design-file,
  .design-review,
  .inspection {
    /deep/ .ami-form-item {
      margin-bottom: 0;
    }
    .file {
      font-size: 14px;
      font-weight: bold;
    }
    .xia {
      cursor: pointer;
      color: #0040d1;
      margin-left: 10px;
      font-size: 14px;
      font-weight: bold;
      text-decoration: underline;
    }
  }
  .under-attachment {
    width: 100%;
    .tables {
      height: 100%;
      border-radius: 6px;
      .yuan {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #67c23a;
        display: inline-block;
        margin-right: 12px;
      }
    }
  }
}
</style>
