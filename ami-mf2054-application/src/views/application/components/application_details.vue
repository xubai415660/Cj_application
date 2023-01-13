<!--
 * @description: 标准应用详情
 * @author: 王浩
 * @Date: 2022-10-12 10:43:05
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <ami-card class="application" :Approval="Approval">
    <!--头部 -->
    <div class="header">
      <div class="header-img">
        <img :src="Icon(Approval.appIcon)" :onerror="defaultImg" />
      </div>
      <div class="header-mark">
        <div class="mark-start">
          <span class="mask-title">{{ Approval.appName }}</span>
          <span>({{ Approval.attributeTypeName == null ? "--" : Approval.attributeTypeName }})</span>
          <!-- 版本下拉框 -->
          <div class="mark-select">
            <ami-form ref="form" :model="ruleForm" label-width="100px">
              <ami-form-item label="版本号：" prop="knoAut">
                <ami-select v-model="ruleForm.verNo" placeholder="请选择版本" @change="verNoChang($event)">
                  <ami-option
                    v-for="item in versionList"
                    :key="item.appVerId"
                    :label="`V${item.verNo} (${item.auditStatus})`"
                    :value="item.appVerId"
                    >{{ `V${item.verNo} (${item.auditStatus})` }}</ami-option
                  >
                </ami-select>
              </ami-form-item>
            </ami-form>
          </div>
          <span style="margin-left: 24px">适用基座版本：基座版本</span>
          <ami-button type="text">
            <span class="text" @click="handle_version()">版本历史记录</span>
          </ami-button>
        </div>
        <p>{{ Approval.appInfo }}</p>
      </div>
      <!-- 审批通过 -->
      <img v-if="Approval.auditStatus == '01'" class="header-sp" :src="require('@/assets/img/spz.png')" />
      <img v-else-if="Approval.auditStatus == '02'" class="header-sp" :src="require('@/assets/img/ytg.png')" />
      <img v-else-if="Approval.auditStatus == '03'" class="header-sp" :src="require('@/assets/img/ybh.png')" />
    </div>
    <!-- 发布范围 -->
    <div class="score-list">
      <div class="scope-basic">
        <img :src="require('@/assets/img/ditu.jpg')" />
        <span class="txt"> 发布范围:{{ Approval.pubRange }}</span>
        <div class="Cutin">{{ Approval.pubType === "01" ? "全网发布" : "试点发布" }}</div>
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
    <!-- 版本说明 -->
    <div class="version">
      <ami-model-title title="版本说明" />
      <p>版本说明{{ Approval.verDesc }}</p>
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
      <!-- 检验环节 -->
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
      <!-- 试运行  -->
      <div class="practice-running">
        <ami-model-title title="试运行结论" />
        <ami-row>
          <ami-col :span="6">
            <ami-form-item label="试运行结论:">
              <span class="file">通过</span>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="试运行监测报告:">
              <span class="file">会议.pdf</span>
              <span class="xia">下载</span>
            </ami-form-item>
          </ami-col>
        </ami-row>
        <ami-row>
          <ami-col :span="21">
            <ami-form-item label="试运行结论说明:">
              <span>评审通过XXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
            </ami-form-item>
          </ami-col>
        </ami-row>
      </div>
      <!-- 中心审核  -->
      <div class="design-file">
        <ami-model-title title="中心审核意见" />
        <ami-row>
          <ami-col :span="6">
            <ami-form-item label="中心审核意见:">
              <span class="file">通过</span>
            </ami-form-item>
          </ami-col>
          <ami-col :span="6">
            <ami-form-item label="中心审核说明:">
              <span class="file">可以通过，正式发布</span>
            </ami-form-item>
          </ami-col>
        </ami-row>
      </div>
    </ami-form>
    <!-- 附件 -->
    <div class="under-attachment">
      <ami-model-title title="附件列表" />
      <!-- 附件表单 -->
      <ami-table
        stripe
        border
        headerStripe
        class="tables"
        style="width: 100%"
        max-height="400"
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
    <!-- 评论 -->
    <div class="comments">
      <ami-model-title title="评分及评论"> </ami-model-title>
      <div class="comments-title">
        <!-- 评分平均分 -->
        <div class="foot-nav">
          <span>{{ Approval.avgFraction === null ? "0" : Approval.avgFraction }}</span>
          <span>满分5分</span>
        </div>
        <div class="font-shu">{{ Approval.appNum == null ? "0" : Approval.appNum }}个评分</div>
        <div class="wrap">
          <div v-for="(score, index) in newdataList" :key="index">
            <!-- 评价得分 -->
            <div class="wrap-evalScore icox">
              <ami-rate v-model="score.evalScore" disabled score-template="{value}" :colors="colors"> </ami-rate>
            </div>
            <!-- 评价数量 -->
            <div class="wrap-countNum">
              <ami-progress :percentage="Number(score.countNum)"></ami-progress>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评价 -->
      <div class="comments-releases">
        <ul>
          <li
            v-for="comment in CommentTab"
            :key="comment.key"
            :class="tabActive.Commentlist === comment.key ? 'active' : ''"
            @click="tabClicks(0, comment.key)"
          >
            {{ comment.lable }}
          </li>
        </ul>
        <ami-button class="shaixuan" type="primary" round @click="handle_screening()">筛选</ami-button>
      </div>
      <!-- 评论部分 -->
      <div class="comments-comment">
        <div v-for="(item, index) in commentList.list" :key="index" style="margin-bottom: 20px">
          <div class="info-nei">
            <!-- 头像 -->
            <ami-avatar> {{ item.evalUserName }} </ami-avatar>
            <!-- 内容 -->
            <div class="releases-comment-top">
              <div class="comment-top-nei">
                <!-- 评论--名称 -->
                <span class="nei-span">{{ item.evalUserName }}</span>
                <ami-rate v-model="item.evalScore" disabled text-color="#99A9BF" score-template="{value}" :colors="colors">
                </ami-rate>
                <!-- 时间 -->
                <span class="releases-right">发布时间：{{ item.evalTime }}</span>
              </div>

              <!-- 评价单位 -->
              <div>
                <ami-clamp
                  :maxLines="2"
                  :expanded="commentTxt[index]"
                  showtip
                  style="width: 100%"
                  effect="light"
                  :text="item.evalDesc"
                >
                  <!--  判断行数，大于1显示 -->
                  <span class="comment-zhan" slot="after">
                    <span v-if="commentTxt[index]" @click="clickToggle(1, index)">收起</span>
                    <span v-else @click="clickToggle(2, index)">更多</span>
                  </span>
                </ami-clamp>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <ami-pagination
        class="comments-page"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageIndex"
        :page-sizes="pageSizes"
        :page-size="page.pageSize"
        layout="prev, pager, next, totalPage, total, sizes,  jumper"
        :total="commentList.totalCount"
      >
      </ami-pagination>
    </div>
    <!-- 弹窗部分 -->
    <div class="dialog">
      <!-- 版本历史记录弹窗 -->
      <VersioneDialog :versionVisible.sync="versionVisible" :verNoList="verNoList"></VersioneDialog>
      <!-- 操作日志弹窗-流程 -->
      <OperationDialog :OperationVisible.sync="OperationVisible" :operationList="operationList"></OperationDialog>
      <!-- 关联需求列表弹窗 -->
      <AssociateDialog :AssociateVisible.sync="AssociateVisible" :AssociateList="AssociateList"></AssociateDialog>
      <DefectDialog :DefectVisible.sync="DefectVisible"></DefectDialog>
      <!-- 筛选弹窗 -->
      <ScreeningDialong ref="screening" :ScreeningVisible.sync="ScreeningVisible" @scrInfo="screeningSure"></ScreeningDialong>
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
import config from "@/config/website";
import { filterSize } from "@/utils/util";
import { getUserInfo } from "@/utils/store";
import { Mapping } from "@/utils/echarsResize";
import VersioneDialog from "@/components/Application/Version_dialog.vue"; // 版本信息弹窗
import OperationDialog from "@/components/Application/Operation_dialog.vue"; // 操作日志弹窗
import AssociateDialog from "@/components/Application/Associate_dialog.vue"; // 关联弹窗
import DefectDialog from "@/components/Application/Defect_dialog"; // 缺陷信息弹窗
import ScreeningDialong from "@/components/Application/Screening_dialog.vue"; // 筛选弹窗
import PreviewDialog from "@/components/Approval/Preview_Dialog.vue";
import {
  queryInfoDetailById,
  Iconinformation,
  fileDownLoad,
  queryNeed,
  queryVerNoHistory,
  queryAppOperLog,
  queryCommentCounts,
  queryCommentInfoPage,
} from "@/api/approval/approval";
export default {
  name: "AMI-MA0102054-08",
  data() {
    return {
      visible: false, //预览弹窗状态
      allowEdit: false, //是否允许编辑
      AssociateVisible: false, // 关联弹窗
      DefectVisible: false, // 缺陷信息弹窗
      versionVisible: false, // 版本信息弹窗
      OperationVisible: false, // 操作记录弹窗
      ScreeningVisible: false, // 筛选弹窗
      tabActive: { Commentlist: "01" }, //tab切换
      appVerId: "", //版本id(切换版本时传)
      Approval: {}, //详情数据
      versionList: [], //版本历史记录
      userInfo: {}, //当前登陆人信息
      verNoList: [], //版本信息数据
      AssociateList: {}, //关联需求列表数据
      commentList: {}, //评价信息
      operationList: [], //操作日志
      scoreList: [], //星级列表(评分信息)
      AppendixData: [], //附件信息
      spanArr: [], //附件--暂存数据
      commentTxt: [], // 暂存-评论展开状态
      evalOrgCodeList: [], // 省份列表
      pageSizes: config.PAGE_SIZES, //页码大小
      Icon: Iconinformation, //图标信息
      filterSize: filterSize, //文件大小过滤器
      colors: ["#0040D0", "#0040D0", "#0040D0"], // 评分样式
      fistType: ["zip", "rar", "sql", "jar"], //文件类型
      defaultImg: 'this.src="' + require("@/assets/img/pgy1.jpg") + '"', //图片加载失败默认使用该图片
      ruleForm: {
        verNo: "", //版本号
      },
      // 文件-预览数据
      file: {
        fileId: "", //文件id
        fileName: "", //文件名称
        fileType: "", //文件类型
      },
      // 分页部分
      page: {
        pageIndex: 1, //页码
        pageSize: 10, //分页
      },
      // 标签切换
      CommentTab: [
        { lable: "最新评价", key: "01" },
        { lable: "最高评价", key: "02" },
        { lable: "最低评价", key: "03" },
      ],
    };
  },
  components: {
    VersioneDialog,
    OperationDialog,
    AssociateDialog,
    DefectDialog,
    ScreeningDialong,
    PreviewDialog,
  },
  computed: {
    // 按照评分进行排序
    newdataList() {
      return this.sortKey(this.scoreList, "evalScore");
    },
  },
  created() {
    this.$nextTick(() => {
      this.appVerId = this.$route.query.appVerId;
      this.load_detail();
      this.load_version();
      this.load_score();
      this.load_comment();
      this.userInfo = getUserInfo();
    });
  },
  methods: {
    // 查询-详情
    load_detail() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.appVerId,
        evalOrgCodeList: [], //省份
      };
      queryInfoDetailById(params).then((res) => {
        if (res.data.code === 200) {
          this.Approval = res.data.data;
          this.ruleForm.verNo = this.Approval.appVerId; //版本-赋值
          this.AppendixData = res.data.data.attInfoVOList;
          this.Appendix(this.AppendixData); //附件
          // 处理发布范围-转换
          if (this.Approval.pubRangeList == null) return;
          this.Approval.pubRange = this.Approval.pubRangeList.map((item) => item.pubOrgName).join("、");
        }
      });
    },
    // 查询-评论
    load_comment() {
      let params = {
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        filter: {
          appId: this.$route.query.appId,
          appVerId: this.appVerId,
          conditionStatus: this.tabActive.Commentlist,
          evalOrgCodeList: this.evalOrgCodeList, //省份
        },
      };
      queryCommentInfoPage(params).then((res) => {
        if (res.data.code === 200) {
          this.commentList = res.data.data;
          this.commentTxt = [];
          this.commentList.list.forEach((item) => {
            item.flag = false; //新增属性控制，是否展开，默认false/false
            this.commentTxt.push(item.flag);
          });
        }
      });
    },
    // 查询-评分
    load_score() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.appVerId,
        countNum: 2, //评价数量
        evalScore: 1, //评价得分
      };
      queryCommentCounts(params).then((res) => {
        if (res.data.code === 200) {
          this.scoreList = res.data.data;
        }
      });
    },
    // 查询-版本历史
    load_version() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.appVerId,
      };
      queryVerNoHistory(params).then((res) => {
        if (res.data.code === 200) {
          this.versionList = res.data.data;
        }
      });
    },
    // 版本-切换历史版本
    verNoChang(val) {
      this.appVerId = val;
      this.load_detail();
      this.load_comment();
      this.load_score();
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
    // 版本历史记录-弹窗
    handle_version() {
      let params = {
        appId: this.Approval.appId,
        appVerId: this.Approval.appVerId,
      };
      queryVerNoHistory(params)
        .then((res) => {
          if (res.data.code === 200) {
            this.verNoList = res.data.data;
            this.versionVisible = true;
          }
        })
        .catch(() => {
          this.$message.error("查询失败");
        });
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
    // 关联缺陷-弹窗
    Associate_defects() {
      this.DefectVisible = true;
    },
    // 筛选-选择单位弹窗
    handle_screening() {
      this.$refs.screening.getApplyUnit();
      this.ScreeningVisible = true;
    },
    // 筛选-选择单位弹窗-确定
    screeningSure(data) {
      this.evalOrgCodeList = data; //赋值
      if (data.length === 28) {
        this.evalOrgCodeList = [];
      }
      this.ScreeningVisible = false;
      this.load_comment(); // 查询评论
    },
    // 评分tab切换
    tabClicks(num, value) {
      switch (num) {
        case 0:
          this.$set(this.tabActive, "Commentlist", value);
          this.load_comment();
          break;
      }
    },
    // 评论-展开|收起
    clickToggle(num, index) {
      switch (num) {
        case 1:
          this.$set(this.commentTxt, index, false);
          break;
        case 2:
          this.$set(this.commentTxt, index, true);
          break;
        default:
          break;
      }
    },
    // 每页的条数
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.commentTxt = [];
      this.load_comment();
    },
    // 页码
    handleCurrentChange(val) {
      this.page.pageIndex = val;
      this.commentTxt = [];
      this.load_comment();
    },
    // 评分排序
    sortKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.application {
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
          margin-left: 36px;
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
    // 背景图-通过
    &-sp {
      width: 140px;
      position: absolute;
      right: 40px;
      top: 10px;
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
      .Cutin {
        margin-left: 20px;
        height: 30px;
        line-height: 30px;
        border-radius: 6px;
        padding: 0px 6px;
        background: #f2f2f2;
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
  .version {
    width: 100%;
    padding: 6px;
  }
  .design-file,
  .design-review,
  .inspection,
  .practice-running {
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
  .comments {
    margin-top: 10px;
    width: 100%;
    // height: 700px;
    max-height: 700px;
    padding: 10px;
    &-title {
      width: 100%;
      display: flex;
      position: relative;
      .foot-nav {
        width: 20%;
        margin-left: 20px;
        span:nth-child(1) {
          font-size: 80px;
          line-height: 120px;
          color: #666;
        }
      }
      //评分数量
      .font-shu {
        position: absolute;
        bottom: 10px;
        right: 900px;
        font-size: 16px;
        font-weight: bold;
        color: #666;
      }
      // 评分样式
      .wrap {
        position: absolute;
        width: 800px;
        right: 0px;
        top: 0px;
        .wrap-evalScore {
          display: inline;
          float: left;
        }
        .wrap-countNum {
          float: right;
          display: inline;
          width: 80%;
          // 进度条
          /deep/ .ami-progress {
            margin: 3px 0px;
          }
          /deep/ .ami-progress__text {
            display: none;
          }
        }
      }
    }
    &-releases {
      width: 100%;
      height: 35px;
      position: relative;
      ul {
        list-style: none;
        left: -20px;
        li {
          cursor: pointer;
          float: left;
          padding: 6px 12px;
          border-radius: 20px;
          background: #f8f8f8;
          margin-right: 20px;
        }
        :hover {
          color: #fff;
          background: #0040d1;
        }
      }
      .shaixuan {
        float: right;
      }
      .active {
        color: #fff;
        background: #0d7f58 !important;
      }
    }
    &-comment {
      width: 100%;
      height: 100%;
      max-height: 600px;
      overflow-y: auto;
      margin-top: 30px;
      .info-nei {
        position: relative;
        display: flex;
        margin-bottom: 10px;
        .ami-avatar {
          width: 60px;
          height: 60px;
          line-height: 60px;
          margin: auto;
        }
        .releases-comment-top {
          margin-left: 10px;
          position: relative;
          width: 98%;
          .comment-top-nei {
            display: flex;
            .nei-span {
              font-size: 16px;
              font-weight: bold;
              margin-right: 20px;
            }
            .releases-right {
              position: absolute;
              right: 20px;
              top: 0px;
            }
          }
        }
        .releases-comment-di {
          position: absolute;
          font-size: 14px;
          bottom: 0px;
        }
      }
      .comment-zhan {
        font-size: 14px;
        cursor: pointer;
        right: 10px;
        color: #0040d1;
      }
    }
    &-page {
      width: 100%;
      height: 60px;
      margin-bottom: 30px;
    }
  }
}
</style>
