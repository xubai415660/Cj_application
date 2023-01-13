<template>
  <div class="detail">
    <div class="app-detail">
      <div :ApplicaData="ApplicaData">
        <!-- 头部信息 -->
        <div class="app-detail-top">
          <Appdetails :item="ApplicaData" @fun="init()"></Appdetails>
        </div>
        <!-- 应用介绍 -->
        <div class="app-detail-introduce">
          <ami-model-title title="应用介绍" borderBottom />
          <p style="margin-top: 10px">{{ ApplicaData.appInfo }}</p>
        </div>
        <!-- 算法  -->
        <div class="app-detail-algorithm" v-if="Model == '04'">
          <ami-model-title title="算法" borderBottom>
            <span class="ami-span" @click="Go_algorithm()">查看更多>></span>
          </ami-model-title>
          <div class="algorithm-eff">
            <span>{{ ApplicaData.verNo }}</span>
            <span>{{ ApplicaData.createTime }}</span>
            <p>{{ ApplicaData.calcRule }}</p>
          </div>
        </div>
        <!-- 应用版本 -->
        <div class="app-detail-Version">
          <ami-model-title title="应用版本" borderBottom>
            <span class="ami-span" @click="Go_version()">查看更多>></span>
          </ami-model-title>
          <div class="Version-eff">
            <span style="margin-right: 20px">V{{ ApplicaData.verNo }}</span>
            <span>{{ ApplicaData.createTime }}</span>
            <p>{{ ApplicaData.verDesc }}</p>
          </div>
        </div>
        <!-- 评论及评分 -->
        <div class="app-detail-Comment">
          <ami-model-title title="评论及评分" borderBottom>
            <span class="ami-span" @click="Go_comment()">查看更多>></span>
          </ami-model-title>
          <!-- 添加评论区 -->
          <ami-collapse-transition>
            <div class="Comment-add_comment" v-if="operate">
              <ami-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <ami-form-item label="选择评分：" prop="evalScore">
                  <ami-rate
                    v-model="ruleForm.evalScore"
                    :colors="colors"
                    score-template="{value}"
                    style="display: inline"
                  ></ami-rate>
                </ami-form-item>
                <ami-form-item prop="evalDesc">
                  <ami-input
                    type="textarea"
                    v-model.trim="ruleForm.evalDesc"
                    :rows="5"
                    maxlength="500"
                    show-word-limit
                    placeholder="请输入内容"
                    style="margin: 20px 0px"
                  >
                  </ami-input>
                </ami-form-item>
                <div class="add-right">
                  <ami-button size="medium" round @click="resetForm('ruleForm')">取消</ami-button>
                  <ami-button type="primary" round size="medium" @click="submit('ruleForm')">提交</ami-button>
                </div>
              </ami-form>
            </div>
          </ami-collapse-transition>
          <!-- 展示区 -->
          <div class="Comment-mian">
            <!-- 评分 -->
            <h3>
              {{ ApplicaData.appAverageScore }}
              <br />
              <span>满分 5 分</span>
            </h3>
            <!-- 得分 -->
            <div class="Comment-wrap">
              <div v-for="(score, index) in newdataList" :key="index">
                <!-- Rate 评分 -->
                <div class="Comment-wrap-rate">
                  <ami-rate v-model="score.evalScore" disabled score-template="{value}" :colors="colors"> </ami-rate>
                </div>
                <!-- 进度条 -->
                <div class="Comment-wrap-countNum">
                  <ami-progress :percentage="Number(score.countNum)" :show-text="false" color="#44D7B7"></ami-progress>
                </div>
              </div>
            </div>
          </div>
          <!-- 操作区 -->
          <div class="Comment-operate">
            <!-- 多少评分 -->
            <span>（共{{ comment_list.totalCount }}个评分）</span>
            <ami-button icon="ami-icons-fabu" size="small" @click="operate = !operate" round> 新增评论</ami-button>
          </div>
          <!-- 浏览评论 -->
          <ami-carousel
            v-show="comment_list.list !== []"
            class="Comment-carousel"
            trigger="click"
            :interval="4000"
            type="card"
            height="210px"
          >
            <ami-carousel-item v-for="(commit, index) in comment_list.list" :key="index" class="carousel-row">
              <div class="carousel-mian">
                <ami-avatar
                  class="carousel-img"
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                ></ami-avatar>
                <span class="carousel-name">{{ commit.evalUserNo }}</span>
                <span class="carousel-time">{{ commit.evalTime }}</span>
                <ami-rate class="carousel-rate" v-model="commit.evalScore" disabled score-template="{value}" :colors="colors">
                </ami-rate>
              </div>
              <!-- 评价描述 -->
              <p>{{ commit.evalDesc }}</p>
            </ami-carousel-item>
          </ami-carousel>
        </div>
        <!-- 相关推荐 -->
        <div class="app-detail-recommend">
          <ami-model-title title="相关推荐" borderBottom>
            <span class="ami-span" @click="Go_recommended(ApplicaData)">查看更多>></span>
          </ami-model-title>
          <div class="recommend-mian">
            <div v-for="(info, index) in Related" :key="index" @click="Go_details(info)">
              <img :src="Iconinformation(info.icon)" :onerror="defaultImg" />
              <!-- 应用名称 -->
              <p>{{ info.appName }}</p>
            </div>
          </div>
          <ami-empty v-if="Related == ![]" :image-size="200"></ami-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs"; //时间格式化
import { getUserInfo } from "@/utils/store";
import {
  recommends,
  Applicationdetails,
  queryBmasAppCommentInfo,
  queryCommentCounts,
  addBmasAppCommentInfo,
  Iconinformation,
} from "@/api/market/market.js";
import Appdetails from "@/components/Appdetails/app_details.vue";
export default {
  name: "AMI-MA0102052-02",
  components: { Appdetails },
  data() {
    // 自定校验评星
    const validateEvalScore = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error("请选择评星"));
      } else {
        callback();
      }
    };
    return {
      Model: "", //模型-控制(勿删)
      loading: false, //加载动态
      expanded: false, //控制文字-展开
      operate: false, //新增评论状态
      userInfo: {}, //当前登陆人信息
      evalUserNo: "", //操作员账号id
      ApplicaData: {}, //应用详情数据
      comment_list: [], //评论列表
      scoreList: [], //评分分布数据
      Related: [], //相关推荐数据
      //  表单
      ruleForm: {
        evalDesc: "", //评论弹窗--评价描述等
        evalScore: 0, //	评论弹窗--评价得分
        evalTime: dayjs().format("YYYY-MM-DD hh:mm:ss"), //评价时间
      },
      // 表单校验
      rules: {
        evalScore: [{ required: true, validator: validateEvalScore, trigger: "blur" }], //评价得分
        evalDesc: [{ required: true, message: "请填写评论内容", trigger: "blur" }], //评价描述等
      },
      colors: ["#44D7B7", "#44D7B7", "#44D7B7"], // 评分样式
      Iconinformation: Iconinformation, // 图标信息
      defaultImg: 'this.src="' + require("@/assets/img/wyy.png") + '"', //图片加载失败默认使用该图片
    };
  },
  created() {
    // 获取登陆人信息（************）
    this.userInfo = getUserInfo();
    this.evalUserNo = this.userInfo.operatorId; //操作员账号id
    this.Model = this.$route.query.appCls; // 判断-模型
    this.init();
  },
  methods: {
    // 初始化数据
    init() {
      this.$nextTick(() => {
        this.loadTable();
        this.Recommend();
      });
    },
    // 获取应用详情
    loadTable() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.$route.query.appVerId,
        appCls: this.$route.query.appCls,
        mgtOrgCode: this.userInfo.mgtOrgCode,
      };
      Applicationdetails(params).then((res) => {
        if (res.data.code === 200) {
          this.ApplicaData = res.data.data;
          this.queryScore();
          this.queryComment();
        }
      });
    },
    // 查询--评论信息
    queryComment() {
      let params = {
        filter: {
          appId: this.ApplicaData.reviewId,
          appVerId: this.ApplicaData.reviewVerId,
        },
      };
      queryBmasAppCommentInfo(params).then((res) => {
        if (res.data.code === 200) {
          this.comment_list = res.data.data;
        }
      });
    },
    // 查询-评分
    queryScore() {
      let params = {
        appId: this.ApplicaData.reviewId, //id
        appVerId: this.ApplicaData.reviewVerId,
        countNum: 2, //评价数量
        evalScore: 1, //评价得分
      };
      queryCommentCounts(params).then((res) => {
        if (res.data.code === 200) {
          this.scoreList = res.data.data;
        }
      });
    },
    // 提交评论
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            appCls: this.ApplicaData.appCls, //应用分类
            appId: this.ApplicaData.reviewId,
            appVerId: this.ApplicaData.reviewVerId, //版本
            evalDesc: this.ruleForm.evalDesc, //评论描述
            evalScore: this.ruleForm.evalScore, //评价得分
            evalUserNo: this.userInfo.operatorId, //操作员账号id
            mgtOrgCode: this.userInfo.mgtOrgCode, //管理机构代码
          };
          addBmasAppCommentInfo(params).then((res) => {
            if (res.data.code === 200) {
              this.operate = false;
              this.$message({ type: "success", message: "提交成功!" });
              this.$refs[formName].resetFields();
              this.init();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 取消-清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.operate = false;
    },
    // 相关推荐
    Recommend() {
      let params = {
        pageIndex: 1,
        pageSize: 8,
        filter: {
          sort: "1",
          instPackage: "1",
          busCls: this.$route.query.busCls,
          mgtOrgCode: this.userInfo.mgtOrgCode, //省侧编码
          recommendAppId: this.$route.query.appId, //相关推荐id
        },
      };
      recommends(params).then((res) => {
        if (res.data.code === 200) {
          let arr = res.data.data.list;
          // 数组进行倒叙排序
          this.Related = arr.reverse();
        }
      });
    },
    // 应用介绍-文字展开
    clickToggle() {
      this.expanded = !this.expanded;
    },
    // 评分排序
    sortKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
    // --------------------路由跳转------------------------
    // 路由跳转---算法
    Go_algorithm() {
      this.$router.push({
        path: "/app_algorithm",
        query: {
          appId: this.ApplicaData.appId, //模型id
          appVerId: this.ApplicaData.appVerId,
          appCls: this.$route.query.appCls,
          mgtOrgCode: this.userInfo.mgtOrgCode,
        },
      });
    },
    // 路由跳转---应用版本
    Go_version() {
      this.$router.push({
        path: "/app_version",
        query: {
          appId: this.ApplicaData.appId,
          appVerId: this.ApplicaData.appVerId,
          appCls: this.$route.query.appCls,
          mgtOrgCode: this.userInfo.mgtOrgCode,
        },
      });
    },
    // 路由跳转---所有评论
    Go_comment() {
      this.$router.push({
        path: "/app_comment",
        query: {
          comment: "new",
          appId: this.ApplicaData.reviewId,
          appVerId: this.ApplicaData.appVerId,
          appCls: this.$route.query.appCls,
          mgtOrgCode: this.userInfo.mgtOrgCode,
        },
      });
    },
    // 相关推荐
    Go_recommended(item) {
      this.$router.push({
        path: "/related_suggestion",
        query: {
          appId: item.appId,
          busCls: item.busCls,
          appVerId: this.ApplicaData.appVerId,
          mgtOrgCode: this.userInfo.mgtOrgCode,
        },
      });
    },
    // 路由跳转---应用详情
    Go_details(item) {
      let routeUrl = this.$router.resolve({
        path: "/application_details",
        query: {
          appId: item.appId,
          appCls: item.appCls,
          appVerId: item.appVerId,
          mgtOrgCode: this.userInfo.mgtOrgCode,
        },
      });
      window.open(routeUrl.href, "_blank");
    },
  },
  computed: {
    // 按照评分进行排序
    newdataList() {
      return this.sortKey(this.scoreList, "evalScore");
    },
  },
  watch: {
    // 监听路由变化
    $route(to) {
      if (to?.name === "MA0104025-15" && to.query.appId !== null && to.query.appId !== undefined) {
        this.init();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// 按钮-下划线
.detail {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #fff;
  .app-detail {
    width: 90%;
    margin: 0 auto;
    // 应用介绍
    &-introduce {
      margin: 20px 0px;
      height: 100%;
      font-size: 14px;
      /deep/ .ami-clamp {
        margin-top: 20px;
        position: relative;
        color: #666666;
        text-indent: 2em;
      }
      .after-btn {
        cursor: pointer;
        float: right;
        color: #3f6cf1;
      }
    }
    // 算法
    &-algorithm {
      margin: 10px 0px;
      .algorithm-eff {
        padding: 10px;
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        span {
          color: #999999;
          margin-left: 30px;
        }
        p {
          margin-top: 10px;
          margin-left: 30px;
        }
      }
    }
    // 应用版本
    &-Version {
      margin: 10px 0px;
      .Version-eff {
        padding: 10px;
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        span {
          color: #999999;
        }
        p {
          margin-top: 10px;
        }
      }
    }
    // 评论及评分
    &-Comment {
      .Comment-mian {
        margin-top: 17px;
        display: flex;
        align-items: center;
        h3 {
          width: 100px;
          font-size: 40px;
          padding: 0 30px;
          text-align: center;
        }
        span {
          font-size: 12px;
          color: gray;
        }
      }
      .Comment-wrap {
        width: 80%;
        // 评分
        &-rate {
          float: left;
          height: 100%;
          margin-right: 16px;
        }
        // 等分
        &-countNum {
          width: 50%;
          /deep/ .ami-progress {
            padding: 7px 0;
          }
        }
      }
      // 添加评论
      .Comment-add_comment {
        /deep/ .ami-form-item {
          margin-bottom: 0px;
        }
        // 按钮
        .add-right {
          float: right;
        }
      }
      .Comment-operate {
        width: 100%;
        position: relative;
        span {
          position: absolute;
          right: 51%;
        }
        /deep/ .ami-button {
          position: absolute;
          right: 0px;
          font-size: 14px;
          .ami-icons-fabu:before {
            color: #0040d1;
          }
        }
      }
      .Comment-carousel {
        margin-top: 30px;
        .carousel-row {
          background: #f7f7f7;
          border-radius: 20px;
          padding: 12px;
          width: 650px;
          .carousel-mian {
            position: relative;
            float: left;
            width: 100%;
            align-items: center;
            .carousel-img {
              height: 50px;
              width: 50px;
              border-radius: 50%;
            }
            .carousel-name {
              position: absolute;
              font-size: 16px;
              font-weight: bold;
              left: 10%;
            }
            .carousel-time {
              position: absolute;
              right: 20px;
            }
            .carousel-rate {
              position: absolute;
              display: inline-flex;
              left: 10%;
              bottom: 5px;
            }
          }
        }
      }
    }
    // 相关推荐
    &-recommend {
      width: 100%;
      height: 100%;
      .recommend-mian {
        cursor: pointer;
        margin-top: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        img {
          width: 100px;
          height: 100px;
          border-radius: 10px;
        }
        p {
          text-align: center;
          font-size: 14px;
          color: #666666;
        }
      }
    }
    .ami-span {
      cursor: pointer;
      color: #0040d1;
      font-size: 14px;
      text-decoration: underline;
    }
  }
  /deep/.ami-carousel__indicators--outside button {
    background: none;
  }
  // 更改评论轮播偏移
  /deep/ .ami-carousel__item,
  .ami-carousel__mask {
    left: 100px;
  }
}
</style>
