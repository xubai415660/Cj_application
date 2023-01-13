<!--
 * @description: 定制应用详情
 * @author: 王浩
 * @Date: 2022-10-12 10:50:01
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <ami-card class="custom_details" :custom="custom">
    <!-- 应用信息 -->
    <div class="custom_details-information">
      <ami-model-title title="应用信息"></ami-model-title>
      <div class="custom-mask">
        <ami-row :gutter="20">
          <ami-col :span="8">
            <span class="title"> 应用名称：</span>
            <span>{{ custom.appName }}</span>
          </ami-col>
          <ami-col :span="8">
            <span class="title"> 版本号：</span>
            <span>V{{ custom.verNo }}</span>
          </ami-col>
          <ami-col :span="8">
            <span class="title"> 应用分类：</span>
            <span>{{ custom.busClsName }}</span>
          </ami-col>
        </ami-row>
        <ami-row>
          <ami-col :span="1.5">
            <span class="title">应用介绍：</span>
          </ami-col>
          <ami-col :span="22">{{ custom.appInfo }}</ami-col>
        </ami-row>
        <ami-row>
          <ami-col :span="1.5">
            <span class="title">版本说明：</span>
          </ami-col>
          <ami-col :span="22">{{ custom.verDesc }} </ami-col>
        </ami-row>
        <!-- 附件 -->
        <ami-row :gutter="20">
          <ami-col :span="1.5">
            <span class="title" style="float: right">附件：</span>
          </ami-col>
          <span>{{ attInfoVO.attName == null ? "--" : attInfoVO.attName }}</span>
          <span v-show="attInfoVO !== null" class="xia" @click="handle_download(attInfoVO)">下载</span>
        </ami-row>
      </div>
      <img v-if="custom.repStatusName == '01'" class="header-sp" :src="require('@/assets/img/spz.png')" />
      <img v-else-if="custom.repStatusName == '04'" class="header-sp" :src="require('@/assets/img/ytg.png')" />
    </div>
    <!-- 申请信息 -->
    <div class="custom_details-apply">
      <ami-model-title title="申请信息">
        <ami-button type="text" @click="handle_process()">
          <span class="text">查看流程节点</span>
        </ami-button>
      </ami-model-title>
      <div class="mask-info">
        <ami-row :gutter="20">
          <ami-col :span="6">
            <span class="title"> 申请人：</span>
            <span>{{ custom.createUserName }}</span>
          </ami-col>
          <ami-col :span="6">
            <span class="title"> 申请单位：</span>
            <span>{{ custom.ceMgtOrgName }}</span>
          </ami-col>
          <ami-col :span="6">
            <span class="title"> 申请时间：</span>
            <span>{{ getYearMonthDay(custom.createTime) }}</span>
          </ami-col>
        </ami-row>
        <ami-row>
          <ami-col :span="1.5">
            <span class="title">申请原因：</span>
          </ami-col>
          <ami-col :span="22">{{ custom.pubApplyDesc }} </ami-col>
        </ami-row>
      </div>
    </div>
    <!-- 程序包 -->
    <div class="custom_details-attachment">
      <ami-model-title title="程序包&检测证明"> </ami-model-title>
      <!-- 附件表单 -->
      <ami-table
        :data="AppendixData"
        :span-method="objectSpanMethod"
        headerStripe
        stripe
        border
        style="width: 100%"
        max-height="450"
      >
        <ami-table-column prop="attTypeName" align="center" label="文件类型"> </ami-table-column>
        <ami-table-column align="center" label="文件名称" width="400">
          <template slot-scope="scope">
            <span style="color: #0004d0; cursor: pointer" @click="previewer(scope.row)"> {{ scope.row.attName }}</span>
          </template>
        </ami-table-column>
        <ami-table-column prop="attSize" align="center" label="文件大小">
          <template slot-scope="scope">
            <span>{{ filterSize(scope.row.attSize) }}</span>
          </template>
        </ami-table-column>
        <ami-table-column prop="updateTime" align="center" label="上传日期"> </ami-table-column>
        <ami-table-column prop="updateUserNo" align="center" label="上传人">
          <template slot-scope="scope">
            <span>{{ scope.row.updateUserNo === null ? "--" : scope.row.updateUserNo }}</span>
          </template>
        </ami-table-column>
        <ami-table-column fixed="right" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <ami-button type="text" @click="download(scope.row)">下载</ami-button>
          </template>
        </ami-table-column>
      </ami-table>
    </div>
    <!-- 验签 -->
    <div class="custom_details-attestation">
      <ami-model-title title="验签生成"></ami-model-title>
      <div class="attestation-main">
        <ami-row :gutter="20">
          <ami-col :span="6">
            <span class="title"> 审批意见：</span>
            <span>{{ custom.repStatusName }}</span>
          </ami-col>
          <ami-col :span="6">
            <span class="title"> 数字签名：</span>
            <span>{{ custom.signTypeName }}</span>
          </ami-col>
        </ami-row>
      </div>
    </div>
    <div class="dialong">
      <!-- 流程节点弹窗 -->
      <Processdialong :ProcessVisible.sync="ProcessVisible" :processList="processList"></Processdialong>
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
import { filterSize } from "@/utils/util";
import { getYearMonthDay } from "@/utils/time";
import { Mapping } from "@/utils/echarsResize";
import { queryAppOperLog } from "@/api/approval/approval";
import { queryCustomizedById, fileDownLoad } from "@/api/custom/custom";
import Processdialong from "@/components/Approval/Process_dialong.vue";
import PreviewDialog from "@/components/Approval/Preview_Dialog.vue";
export default {
  name: "AMI-MA0102054-13",
  components: { Processdialong, PreviewDialog },
  data() {
    return {
      visible: false, //预览弹窗状态
      allowEdit: false, //是否允许编辑
      ProcessVisible: false, // 流程节点弹窗
      filterSize: filterSize, //文件大小过滤器
      custom: {}, // 详情数据
      processList: [], // 流程数据
      spanArr: [], // 合并行（数据）
      attInfoVO: {}, //应用信息-附件
      AppendixData: [], //附件信息
      // 文件-预览数据
      file: {
        fileId: "", //文件id
        fileName: "", //文件名称
        fileType: "", //文件类型
      },
    };
  },
  created() {
    this.init();
  },
  computed: {
    getYearMonthDay() {
      return getYearMonthDay;
    },
  },
  methods: {
    init() {
      this.load_detail();
    },
    // 查询-详情
    load_detail() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.$route.query.appVerId,
        evalOrgCodeList: [],
      };
      queryCustomizedById(params).then((res) => {
        if (res.data.code === 200) {
          this.custom = res.data.data;
          this.AppendixData = res.data.data.attInfoVOList;
          this.Appendix(this.AppendixData); //附件
          if (this.custom.attInfoVO === null) return;
          this.attInfoVO = res.data.data.attInfoVO; //应用-附件信息
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
    // 流程节点-弹窗
    handle_process() {
      let params = {
        appId: this.custom.appId,
        appVerId: this.custom.appVerId,
      };
      queryAppOperLog(params).then((res) => {
        if (res.data.code === 200) {
          this.processList = res.data.data;
        }
      });
      this.ProcessVisible = true;
    },
    // 文件-预览
    previewer(row) {
      this.allowEdit = false;
      // 获取attName中的文件后缀名
      let fileType = row.attName.split(".").pop().toString();
      if (fileType == Mapping[fileType]) {
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
    // 应用信息-附件下载
    handle_download(row) {
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
.custom_details {
  width: calc(100% - 24px);
  height: calc(100% - 12px);
  margin: 0 auto;
  overflow-y: auto;
  &-information {
    position: relative;
    width: 100%;
    padding: 10px;
    .custom-mask {
      padding: 10px;
      border-radius: 10px;
      background: #f2f2f2;
      width: 100%;
      /deep/ .ami-row {
        margin-bottom: 16px;
      }
      .xia {
        margin-left: 16px;
        cursor: pointer;
        color: #0004d1;
        text-decoration: underline;
      }
    }
    .header-sp {
      position: absolute;
      left: 180px;
      top: 36px;
      width: 82px;
    }
  }
  &-apply {
    width: 100%;
    padding: 10px;
    .mask-info {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      background: #f2f2f2;
      /deep/ .ami-row {
        margin-bottom: 16px;
      }
    }
    .text {
      color: #0004d0;
      margin-left: 30px;
      font-size: 15px;
      font-weight: bold;
      text-decoration: underline;
    }
  }
  &-attachment {
    width: 100%;
    padding: 10px;
    /deep/ .ami-table {
      border-radius: 8px;
      border: 1px solid #dee0e6;
    }
    /deep/ .ami-table--border::after {
      background-color: none;
    }
  }
  &-attestation {
    width: 100%;
    padding: 10px;
    .attestation-main {
      width: 100%;
      padding: 10px;
      /deep/ .ami-row {
        line-height: 40px;
      }
    }
  }
}
</style>
