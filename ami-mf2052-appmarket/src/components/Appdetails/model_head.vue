<!--
 * @description: 数模下载-头部
 * @author: 袁徐澄
* @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="Appdetails">
    <div class="details">
      <!-- 图片 -->
      <div class="details-img">
        <img :src="Iconinformation(item.icon)" :onerror="defaultImg" />
      </div>
      <!-- 内容区域 -->
      <div class="details-mian">
        <div class="mian-start">
          <!-- 应用标题 -->
          <span> {{ item.applTitle }}</span>
          <span>数模</span>
          <!-- <span v-else-if="item.appCls === '02'">微服务</span>
          <span v-else-if="item.appCls === '03'">组件</span>
          <span v-else-if="item.appCls === '04'">模型</span> -->
          <ami-button class="mian-start-btn" type="text" @click="Download(item)">下载</ami-button>
        </div>
        <div class="mian-center">
          <span>V{{ item.stdDmVerNo }}</span>
          <span>国家电网总公司</span>
          <!-- app下载次数 -->
          <span>{{ item.sumDownload }}次下载</span>
        </div>
        <div class="mian-end">
          <ami-rate style="display: initial" disabled v-model="item.evalScoreAverage" :colors="colors"></ami-rate>
          <span>({{ item.evalScoreNum }}个评分)</span>
          <ami-button
            v-if="comment !== 'new'"
            class="mian-end-btn"
            icon="ami-icons-fabu"
            size="small"
            @click="GO_feedback(item)"
            round
          >
            需求反馈</ami-button
          >
          <ami-button v-else class="mian-end-btn" icon="ami-icons-fabu" size="small" @click="Go_comment()" round>
            新增评论</ami-button
          >
        </div>
      </div>
    </div>
    <!-- 下载弹窗 -->
    <!-- <DownloadDialog
      ref="mychild"
      :dialogVisible.sync="dialogVisible"
      :info="item"
      :Versiondata="Versiondata"
      @init="refresh()"
    ></DownloadDialog> -->
  </div>
</template>
<script>
import { getUserInfo } from "@/utils/store";
import { Iconinformation, downLoadFile } from "@/api/market/market.js";
import { inDownloadLog } from "@/api/model/model.js";
import { remoteRoute } from "@/utils/remoteUtil";
// import { exportFile } from "@/utils/exportFile";
// import DownloadDialog from "./Download_dialog";
export default {
  name: "AMI-MA0102052-10",
  //   components: { DownloadDialog },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      comment: "", //评论-状态
      Model: "", //模型-状态
      userInfo: {},
      Versiondata: [], //版本数据
      dialogVisible: false, //下载弹窗状态
      Iconinformation: Iconinformation,
      colors: ["#44D7B7", "#44D7B7", "#44D7B7"], // 评分样式
      defaultImg: 'this.src="' + require("@/assets/img/wyy.png") + '"', //图片加载失败默认使用该图片
    };
  },
  created() {
    this.userInfo = getUserInfo();
    this.comment = this.$route.query.comment; // 判断从评论过来
    this.Model = this.$route.query.appCls; // 判断-模型
  },
  methods: {
    //下载
    Download(item) {
      //   this.dialogVisible = true;
      let params = {
        // appId: item.appId,
        // verNo: item.verNo,
        // mgtOrgCode: this.userInfo.mgtOrgCode,
        verId: item.verId,
      };
      inDownloadLog(params).then((res) => {
        if (res.data.code == 200) {
          //   console.log(item.fileId);

          downLoadFile({ fileId: item.fileId, fileName: item.fileName }).then((res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: "文件下载成功!",
            });
            this.$emit("init");
          });
        } else {
          this.$message({
            type: "error",
            message: "文件下载失败!",
          });
        }
      });
      //   if (this.Versiondata == undefined || this.Versiondata.length <= 0) return;
      //   this.$refs.mychild.getRole(item.verNo); //调用子组件的方法
      // this.$refs.mychild.verRecProVerNole(item.verNo); //赋值
    },
    // 控制-新增评论展开
    Go_comment() {
      this.$parent.add_comment();
    },
    // 路由跳转---需求反馈
    GO_feedback() {
      remoteRoute.openMenu("/analogDemand/demand_add");
      //   this.$router.push({
      //     path: "/feedback",
      //     query: {
      //       appId: item.appId,
      //       appName: item.appName,
      //       appCls: item.appCls,
      //       busCls: item.busCls,
      //     },
      //   });
    },
    // 刷新列表
    refresh() {
      this.$emit("fun");
    },
  },
};
</script>
<style lang="scss" scoped>
.Appdetails {
  width: 100%;
  flex-wrap: wrap;
  margin-top: 10px;
  .details {
    height: 130px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    // 图片
    &-img {
      height: 120px;
      width: 120px;
      margin: 0px 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
    // 内容区域
    &-mian {
      padding-left: 8px;
      width: 100%;
      .mian-start {
        font-family: "Microsoft YaHei";
        color: #979090;
        height: 40px;
        line-height: 40px;
        span:first-child {
          color: #333333;
          font-style: normal;
          font-weight: bold;
          font-size: 16px;
          line-height: 21px;
        }
        span:nth-child(2) {
          border: 1px solid gray;
          border-radius: 5px;
          padding: 3px 6px;
          font-size: 14px;
          margin-left: 10px;
          margin-right: 10px;
        }
        &-btn {
          float: right;
          text-decoration: underline;
        }
        // 模型-样式
        &-span {
          float: right;
          font-size: 14px;
          color: #d9001b;
        }
      }
      .mian-center {
        color: #979090;
        font-size: 14px;
        font-weight: 400;
        margin: 10px 0px;
        span:nth-child(2) {
          padding: 0 14px;
        }
        span:last-child {
          float: right;
        }
      }
      .mian-end {
        font-size: 14px;
        font-weight: 400;
        height: 100%;
        width: 100%;
        span {
          margin-left: 20px;
        }
        &-btn {
          float: right;
          /deep/ .ami-icons-fabu {
            font-size: 15px;
            color: #0040d1;
          }
        }
      }
    }
  }
}
</style>
