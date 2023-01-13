<!--
 * @description:所有评论
 * @author: wanghao
 * @Date: 2022-04-01 17:30:11
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="app_comment">
    <div class="comment">
      <div :ApplicaData="ApplicaData">
        <!-- 头部 -->
        <div class="comment-tag">
          <Appdetails :item="ApplicaData"></Appdetails>
        </div>
        <!-- 评分及评论 -->
        <div class="comment-card">
          <!-- 标题 -->
          <ami-model-title title="评分及评论" borderBottom />
          <!-- 添加评论 -->
          <ami-collapse-transition>
            <div class="comment-add" v-show="isShow">
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
                    v-model.trim="ruleForm.evalDesc"
                    type="textarea"
                    border-position="top"
                    :rows="5"
                    maxlength="200"
                    show-word-limit
                    placeholder="请输入评论信息.."
                  ></ami-input>
                </ami-form-item>
                <div class="add-right">
                  <ami-button size="medium" @click="resetForm('ruleForm')">取消</ami-button>
                  <ami-button type="primary" size="medium" @click="submit('ruleForm')">提交</ami-button>
                </div>
              </ami-form>
            </div>
          </ami-collapse-transition>
          <!-- 评分 -->
          <div class="comment-mian">
            <h4>
              {{ ApplicaData.appAverageScore }}
              <br />
              <span>满分5分</span>
            </h4>
            <!-- 评价数量 -->
            <div class="comment-wrap">
              <div v-for="(score, index) in newdataList" :key="index">
                <!-- Rate 评分 -->
                <div class="comment-wrap-rate">
                  <ami-rate v-model="score.evalScore" disabled score-template="{value}" :colors="colors"> </ami-rate>
                </div>
                <!-- 进度条 -->
                <div class="comment-wrap-countNum">
                  <ami-progress :percentage="Number(score.countNum)" :show-text="false" color="#44D7B7"></ami-progress>
                </div>
              </div>
            </div>
            <!-- 多少评分 -->
            <span class="comment-operate">（共{{ comment_list.length }}个评分）</span>
          </div>
        </div>
        <!-- 评论 -->
        <div
          class="comment-mien"
          v-infinite-scroll="onLoad"
          infinite-scroll-disabled="disabled"
          infinite-scroll-immediate="false"
        >
          <div style="margin: 10px" v-for="(commit, index) in comment_list" :key="index">
            <div class="comment-browse">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="" />
              <div class="browse-mian">
                <span>{{ commit.evalUserNo === null ? "--" : commit.evalUserNo }}</span>
                <span>{{ commit.evalTime }}</span>
                <br />
                <ami-rate class="carousel-rate" v-model="commit.evalScore" disabled score-template="{value}" :colors="colors">
                </ami-rate>
                <span>({{ commit.verNo }})</span>
              </div>
            </div>
            <p>{{ commit.evalDesc }}</p>
            <!-- 评论描述 -->
            <!-- <ami-clamp showtip :maxLines="maxLines" :expanded="expanded" :text="commit.evalDesc">
            <div slot="after">
              <span class="after-btn" @click="clickToggle()">{{ expanded ? "收起" : "展开" }}</span>
            </div>
          </ami-clamp> -->
          </div>
        </div>
        <p class="loading" v-if="listParams.loading">加载中...</p>
        <p class="loading" v-if="listParams.finished">没有更多了</p>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs"; //时间格式化
import { getUserInfo } from "@/utils/store";
import { Applicationdetails, queryCommentCounts, queryBmasAppCommentInfo, addBmasAppCommentInfo } from "@/api/market/market.js";
import Appdetails from "@/components/Appdetails/app_details.vue";
export default {
  name: "AMI-MA0102052-04",
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
      maxLines: 2, //最大行数
      expanded: false, //文字展开
      isShow: false, //新增评论状态
      ApplicaData: {}, //应用详情
      scoreList: [], //评分列表
      comment_list: [], //评论列表
      userInfo: {}, //当前登陆人信息
      colors: ["#44D7B7", "#44D7B7", "#44D7B7"], // 评分样式
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
      listParams: {
        pageIndex: 1,
        pageSize: 10,
        loading: false,
        error: false,
        finished: false,
      },
    };
  },
  created() {
    this.userInfo = getUserInfo();
    this.loadTable_info();
    this.queryCommentCounts();
  },
  methods: {
    onLoad() {
      this.listParams.loading = true;
      if (this.listParams.finished == false) {
        this.listParams.pageIndex++;
        this.queryCommentCounts();
      }
    },
    // 获取应用详情
    loadTable_info() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.$route.query.appVerId,
        appCls: this.$route.query.appCls,
        mgtOrgCode: this.$route.query.mgtOrgCode,
      };
      Applicationdetails(params).then((res) => {
        if (res.data.code === 200) {
          this.ApplicaData = res.data.data;
          this.queryScore();
          this.queryCommentCounts();
        }
      });
    },
    // 查询-评分
    queryScore() {
      let params = {
        appId: this.ApplicaData.reviewId,
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
    // 查询--评论信息
    queryCommentCounts() {
      let params = {
        pageIndex: this.listParams.pageIndex,
        pageSize: this.listParams.pageSize,
        filter: {
          appId: this.ApplicaData.reviewId,
          appVerId: this.ApplicaData.reviewVerId,
        },
      };
      queryBmasAppCommentInfo(params)
        .then((res) => {
          if (res.data.data.list.length > 0) {
            if (this.listParams.pageIndex == 1) this.comment_list = [];
            this.comment_list = this.comment_list.concat(res.data.data.list);
            // 判断是否有数据（如果有加载关闭）
            this.listParams.loading = false;
            // 判断是否有数据（如果没有提示没有数据）
            if (res.data.data.list.length < this.listParams.pageSize) {
              this.listParams.finished = true;
            }
          } else {
            // 如果数据为空，则显示暂无数据
            this.comment_list = [];
            this.listParams.loading = false;
            this.listParams.finished = true;
          }
        })
        .catch(() => {
          this.listParams.error = true;
          this.listParams.loading = false;
        });
    },
    // 提交表单
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
              this.isShow = false;
              this.$message({ type: "success", message: "评论成功!" });
              this.$refs[formName].resetFields();
              this.queryScore();
              this.queryCommentCounts();
            }
          });
          this.isShow = false;
        } else {
          return false;
        }
      });
    },
    // 取消-清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.isShow = false;
    },
    // 子组件调用-新增评论按钮
    add_comment() {
      this.isShow = !this.isShow;
    },
    //文字展开
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
  },
  computed: {
    // 按照评分进行排序
    newdataList() {
      return this.sortKey(this.scoreList, "evalScore");
    },
    disabled() {
      return this.listParams.loading || this.listParams.finished;
    },
  },
};
</script>
<style lang="scss" scoped>
.app_comment {
  width: 100%;
  height: calc(100% - 24px);
  background: #fff;
  overflow-y: auto;
  .comment {
    width: 90%;
    margin: 0 auto;
    flex-wrap: wrap;
    // 评分展示
    &-card {
      margin: auto;
      .comment-add {
        width: 100%;
        // 按钮问题
        .add-right {
          float: right;
        }
      }
      .comment-mian {
        display: flex;
        position: relative;
        align-items: center;
        height: 150px;
        h4 {
          width: 100px;
          font-size: 40px;
          padding: 0 30px;
          text-align: center;
        }
        span {
          font-size: 12px;
          color: gray;
        }
        .comment-wrap {
          width: 80%;
          // 评分
          &-rate {
            float: left;
            height: 100%;
            margin-right: 20px;
          }
          // 等分
          &-countNum {
            width: 50%;
            /deep/ .ami-progress {
              padding: 7px 0;
            }
          }
        }
        .comment-operate {
          position: absolute;
          font-size: 14px;
          left: 44%;
          bottom: 10px;
        }
      }
    }
    &-mien {
      padding: 10px;
      max-height: calc(100vh - 46vh);
      overflow: auto;
      .comment-browse {
        display: flex;
        width: 100%;
        align-items: center;
        margin-bottom: 10px;
        img {
          width: 50px;
          height: 50px;
        }
        .browse-mian {
          width: 100%;
          height: 40px;
          margin-left: 30px;
          line-height: 20px;

          color: #999999;
          span:first-child {
            color: #333333;
            font-weight: bold;
            font-size: 16px;
          }
          span:nth-child(2) {
            float: right;
          }
          span:last-child {
            font-weight: 400;
            font-size: 14px;
            line-height: 16px;
          }
          .carousel-rate {
            display: inline-block;
          }
        }
      }
      /deep/ .ami-tooltip {
        color: #666666;
        font-size: 14px;
        line-height: 18px;
      }
      .after-btn {
        cursor: pointer;
        color: #0040d1;
      }
    }
    // 加载上文
    .loading {
      color: #5e6d82;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
