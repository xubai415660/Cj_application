<!--
 * @description: 系统应用总览
 * @author: 王浩
 * @Date: 2022-10-12 10:08:30
 * @Modified By: 首页
 * @version: 1.0.0
-->
<template>
  <ami-card class="home">
    <ami-model-title title="系统应用总览"></ami-model-title>
    <!-- 列表标题 -->
    <div class="banner">
      <div class="banner-box" v-for="(item, index) in bannerList" :key="index" :style="item.bannerImgUrl" @click="toJump(index)">
        <p class="title">{{ item.title }}</p>
        <span>
          <span style="text-decoration: underline">{{ item.num }}</span> 个</span
        >
        <div class="banner_bottom">
          <!-- <p>
            近七日新增个
            <i v-if="item.sevenDay > 5" class="ami-icons-shangsheng" style="color: red"></i>
            <i v-else class="ami-icons-xiajiang" style="color: green"></i>
          </p> -->
        </div>
      </div>
    </div>
    <!-- 中部 -->
    <div class="center">
      <div class="center-leaf">
        <ami-model-title title="应用分布"> </ami-model-title>
        <Distribution :distributionList="distributionList"></Distribution>
      </div>
      <div class="center-right">
        <ami-model-title title="应用发布下载情况"> </ami-model-title>
        <!-- 按钮切换 -->
        <div class="group">
          <ami-radio-group v-model="activeName" size="small" @change="radioChang">
            <ami-radio-button label="release">应用发布&下载</ami-radio-button>
            <ami-radio-button label="evaluation">应用评价</ami-radio-button>
          </ami-radio-group>
        </div>
        <!-- 图标内容区域 -->
        <div class="group-mark">
          <Release v-if="activeName == 'release'" :releaseList="releaseList"></Release>
          <Evaluation v-else :releaseList="releaseList"></Evaluation>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="bottom">
      <ami-model-title title="应用报备"></ami-model-title>
      <Reported :reportedList="reportedList"></Reported>
    </div>
  </ami-card>
</template>
<script>
import Distribution from "./components/echarts_distribution.vue"; // 应用分布
import Release from "./components/echarts_release.vue"; // 应用发布下载情况
import Evaluation from "./components/echarts_evaluation.vue"; // 应用评价
import Reported from "./components/echarts_reported.vue"; // 应用报备
import {
  queryHeaderBasicInfo,
  queryBasicInfoDistribution,
  queryBasicInfoDownloads,
  queryBasicInfoReporting,
} from "@/api/approval/approval";
export default {
  name: "Home",
  components: {
    Distribution,
    Evaluation,
    Release,
    Reported,
  },
  data() {
    return {
      heartList: [], // 标题头数据
      releaseList: {}, // 应用发布下载情况
      distributionList: [], // 应用分布数据
      reportedList: {}, // 应用报备数据
      activeName: "release",
      // banner数据
      bannerList: [
        {
          bannerImgUrl: {
            backgroundImage: "url(" + require("@/assets/img/banner_1.jpg") + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          },
          title: "已发布标准应用",
          num: 0,
        },
        {
          bannerImgUrl: {
            backgroundImage: "url(" + require("@/assets/img/banner_2.jpg") + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          },
          title: "已下架标准应用",
          num: 0,
        },
        {
          bannerImgUrl: {
            backgroundImage: "url(" + require("@/assets/img/banner_3.jpg") + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          },
          title: "在用标准应用",
          num: 0,
        },
        {
          bannerImgUrl: {
            backgroundImage: "url(" + require("@/assets/img/banner_4.jpg") + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          },
          title: "版本发布",
          num: 0,
        },
        {
          bannerImgUrl: {
            backgroundImage: "url(" + require("@/assets/img/banner_5.jpg") + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          },
          title: "定制应用报备",
          num: 0,
        },
      ],
    };
  },
  created() {
    this.queryHeader();
    this.query_release();
    this.query_distribution();
    this.query_reported();
  },
  methods: {
    // 查询头部
    queryHeader() {
      queryHeaderBasicInfo({}).then((res) => {
        if (res.data.code === 200) {
          this.heartList = res.data.data;
          this.bannerList[0].num = this.heartList[0];
          this.bannerList[1].num = this.heartList[1];
          this.bannerList[2].num = this.heartList[2];
          this.bannerList[3].num = this.heartList[3];
          this.bannerList[4].num = this.heartList[4];
        }
      });
    },
    // 查询应用分布
    query_distribution() {
      queryBasicInfoDistribution().then((res) => {
        if (res.data.code === 200) {
          this.distributionList = res.data.data;
        }
      });
    },
    // 查询发布下载(评价)
    query_release() {
      queryBasicInfoDownloads().then((res) => {
        if (res.data.code === 200) {
          this.releaseList = res.data.data;
        }
      });
    },
    // 查询应用报备
    query_reported() {
      queryBasicInfoReporting().then((res) => {
        if (res.data.code === 200) {
          this.reportedList = res.data.data;
        }
      });
    },
    // 路由跳转-暂时不用（路由跳转）
    toJump(index) {
      switch (index) {
        case 0:
          this.$router.push({
            path: "/application",
            query: {
              // 传递参数-已发布
              verStatus: "01",
            },
          });
          break;
        case 1:
          this.$router.push({
            path: "/application",
            query: {
              // 传递参数-已下架
              verStatus: "03",
            },
          });
          break;
        case 2:
          // 跳转到再用标准应用
          this.$router.push({
            path: "/application",
            query: {
              // 传递参数-已发布，审核-审核通过
              verStatus: "01",
              auditStatus: "02",
            },
          });
          break;
        case 3:
          this.$router.push({ path: "/application" });
          break;
        case 4:
          this.$router.push({ path: "/custom" });
          break;
      }
    },
    // tab切换(应用发布)
    radioChang(value) {
      if (value == "release") {
        this.query_release();
      } else {
        this.query_release();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  .banner {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
    &-box {
      cursor: pointer;
      width: calc((100% - 50px) / 5);
      height: 133px;
      padding: 0 16px;
      border-radius: 5px;
      .title {
        font-size: 16px;
      }
      .banner_bottom {
        color: #666;
        i {
          font-size: 10px;
        }
      }
      span {
        font-size: 24px;
        font-weight: 600;
      }
      @media screen and (min-width: 962px) and (max-width: 1440px) {
        width: calc((100% - 50px) / 5);
        height: 90px;
        padding: 0 10px;
        span {
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
  }
  .center {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
    height: 38%;
    &-leaf,
    &-right {
      width: calc(40% - 6px);
      padding: 10px 12px;
      border: 1px solid rgba(230, 237, 249, 1);
      border-radius: 8px;
    }
    &-right {
      width: calc(60% - 6px);
      .group {
        display: flex;
        justify-content: flex-end;
      }
      .group-mark {
        width: 100%;
        height: calc(100% - 55px);
      }
    }
  }
  .bottom {
    width: 100%;
    height: 38%;
    margin: 12px 0;
    padding: 10px 12px;
    border: 1px solid rgba(230, 237, 249, 1);
    border-radius: 8px;
  }
}
</style>
