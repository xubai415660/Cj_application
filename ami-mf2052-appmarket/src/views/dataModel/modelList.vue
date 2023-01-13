<!--
 * @description:应用市场列表--数据模型
 * @author: 袁徐澄
 * @Date: 2022-03-31 10:46:55
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="market_list">
    <div class="market_list-box" v-for="(item, index) in ApplicaData" :key="index">
      <div class="suggestion">
        <!-- 图片 -->
        <div class="market_list-img">
          <img :src="Iconinformation(item.icon)" :onerror="defaultImg" @click="toDetail(item)" />
        </div>
        <!-- 内容 -->
        <div class="contRinght">
          <!-- 上部 -->
          <div class="cont-start">
            <span @click="toDetail(item)">{{ item.applTitle }}</span>
            <span>数模</span>
            <ami-rate style="display: initial" disabled v-model="item.evalScoreAverage" :colors="colors"></ami-rate>
            <span v-if="item.sumDownload === null">0次下载</span>
            <span v-else>{{ item.sumDownload }}次下载</span>
          </div>
          <h3 class="cont-center">
            <div class="cont-center-dz">V{{ item.stdDmVerNo }}</div>
            <span>{{ item.issueTime | getYearMonthDay }}</span>
            <!-- 类型 -->
            <span>国家电网总公司</span>
          </h3>
          <!-- 应用简介 -->
          <ami-tooltip :content="item.dmIntro" :disabled="item.isShow" placement="bottom" effect="light">
            <p class="cont-p">{{ item.dmIntro }}</p>
          </ami-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Iconinformation } from "@/api/market/market.js";
export default {
  name: "AMI-MA0102052-08",
  props: {
    // 应用市场列表数据
    ApplicaData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      colors: ["#00796A", "#00796A", "#00796A"], // 评分样式
      Iconinformation: Iconinformation, // 图标信息
      defaultImg: 'this.src="' + require("@/assets/img/wyy.png") + '"', //图片加载失败默认使用该图片
    };
  },
  methods: {
    // 路由跳转--（应用详情）
    toDetail(item) {
      console.log(item);
      this.$router.push({
        path: "/dataModel/modelDown",
        query: {
          verId: item.verId,
        },
      });
    },
  },
  filters: {
    // 判断文字超过两行显示省略号
    ellipsis(value) {
      if (!value.length === 0) return "";
      if (value.length > 115) {
        return value.slice(0, 115) + "...";
      }
      return value;
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.market_list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
  justify-content: space-between;
  &-box {
    width: 48%;
    padding: 0px 6px;
    .suggestion {
      height: 130px;
      width: 100%;
      display: flex;
      justify-content: space-around;
      // 图片
      .market_list-img {
        cursor: pointer;
        height: 100px;
        width: 120px;
        border-radius: 10px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .contRinght {
        padding-left: 8px;
        width: 100%;
        // 上部
        .cont-start {
          cursor: pointer;
          color: #979090;
          font-family: "Microsoft YaHei";
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
            padding: 0px 6px;
            font-size: 14px;
            margin-left: 10px;
            margin-right: 10px;
          }
          span:last-child {
            float: right;
            font-weight: 400;
            font-size: 14px;
            line-height: 16px;
          }
        }
        // 中部
        .cont-center {
          color: #979090;
          font-size: 14px;
          font-weight: 400;
          margin: 10px 0px;
          .cont-center-dz {
            display: inline-flex;
          }
          span:nth-child(2) {
            padding: 0 14px;
          }
          span:last-child {
            float: right;
          }
        }
        .cont-p {
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
}
</style>
