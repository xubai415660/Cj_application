<!--
 * @description: 应用市场
 * @author: wanghao
 * @Date: 2022-10-27 10:49:58
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="market">
    <!-- banner图 -->
    <div class="market-image">
      <p>应用市场</p>
      <span>标准化应用 一键下载 即刻使用</span>
    </div>
    <div class="market-box">
      <!-- 搜索框 -->
      <div class="market-input">
        <ami-input placeholder="搜索应用名称" clearable v-model="needsInput">
          <!-- 插槽 -->
          <i slot="prefix" class="ami-input__icon ami-icons-sousuo"></i>
          <ami-button slot="suffix" type="primary" icon="ami-icon-search" round @click="search()">查询</ami-button>
        </ami-input>
      </div>
      <!-- tan栏 -->
      <div class="market-sortNeeds">
        <ul>
          <li>应用分类</li>
          <li
            v-for="(item, index) in ApplicationList_in"
            :key="item.codeClsVal"
            :class="tabActive.application === index ? 'active' : ''"
            @click="tabClicks(0, index, item.codeClsVal)"
          >
            {{ item.codeClsValName }}
          </li>
        </ul>
        <ul v-if="Businesslist.length > 1">
          <li>业务分类</li>
          <li
            v-for="(item, index) in Businesslist"
            :key="item.businessCategory"
            :class="tabActive.business === index ? 'active' : ''"
            @click="tabClicks(1, index, item.businessCategory)"
          >
            {{ item.businessCategoryName }}
          </li>
        </ul>
      </div>
      <ami-model-title class="sortNeeds-title" title="应用市场" borderBottom>
        <ami-button round icon="ami-icon-circle-plus" style="color: #0040d0" @click="addNeeds()" v-show="modelCode != '06'"
          >新增需求</ami-button
        >
        <ami-button round icon="ami-icon-circle-plus" style="color: #0040d0" @click="addReport()" v-show="modelCode != '06'"
          >新增报备</ami-button
        >
        <ami-select
          v-model="instPack_info"
          placeholder="请选择"
          style="margin-left: 16px; width: 160px"
          @change="instPack($event)"
        >
          <i
            slot="prefix"
            :class="sortShow ? 'ami-icons-zhengxu' : 'ami-icons-daoxu'"
            style="border-right: 1px solid #666666; padding-right: 6px; cursor: pointer"
            @click="sortShow = !sortShow"
          ></i>
          <ami-option v-for="item in instPackage" :key="item.value" :value="item.value" :label="item.label">
            {{ item.label }}
          </ami-option>
        </ami-select>
      </ami-model-title>
      <!-- 内容 -->
      <div class="market-mian" v-infinite-scroll="onLoad" infinite-scroll-disabled="disabled" infinite-scroll-immediate="false">
        <Marketlist :ApplicaData="ApplicaData" v-if="modelCode != '06'"></Marketlist>
        <ModelList :ApplicaData="ApplicaData" v-if="modelCode == '06'"></ModelList>
      </div>
    </div>
    <!-- 加载中 -->
    <p class="loading" v-if="listParams.loading">加载中...</p>
    <p class="loading" v-if="listParams.finished">没有更多了</p>
    <!-- 暂无数据 -->
    <ami-empty v-if="this.ApplicaData == ![]" :image-size="200"></ami-empty>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { getUserInfo } from "@/utils/store";
import { remoteRoute } from "@/utils/remoteUtil";
import { queryBuinessCategory, queryAllAppInfoAndCommonDl } from "@/api/market/market.js";
import { queryPublishingModel } from "@/api/model/model.js";
import Marketlist from "./components/market_list.vue";
import ModelList from "../dataModel/modelList.vue";
export default {
  name: "AMI-MA0102052-01",
  components: { Marketlist, ModelList },
  data() {
    return {
      // 加载
      listParams: {
        pageIndex: 1,
        pageSize: 8,
        loading: false,
        error: false,
        finished: false,
      },
      // 排序
      instPackage: [
        { label: "用户评分", value: 1 },
        { label: "下载量", value: 2 },
        { label: "发布时间", value: 3 },
      ],
      // tab切换状态
      tabActive: {
        application: 0, //应用
        business: 0, //业务
      },
      // 分类列表
      Classification: {
        appsCategory: "", // 查询业务分类--传参
      },
      userInfo: [], //当前登陆人信息
      ApplicaData: [], //列表数据
      Businesslist: [], //业务分类--tab切换
      mgtOrgCode: "", //引用操作账号表中的操作员账号
      needsInput: "", //搜索框
      busCls: "", //业务分类
      instPack_info: 2, //下拉框
      sort: "2", //排序
      sortShow: false, //排序显示
      modelCode: "",
    };
  },
  created() {
    // 获取登陆人信息（************）
    getUserInfo();
    let params = [];
    params = getUserInfo();
    this.userInfo = params;
    this.mgtOrgCode = this.userInfo.mgtOrgCode; //编码
    this.init();
  },
  computed: {
    ...mapGetters(["ApplicationList"]),
    ApplicationList_in() {
      return [{ codeClsValName: "全部", codeClsVal: "" }, ...this.ApplicationList];
    },
    // 禁用加载更多
    disabled() {
      return this.listParams.loading || this.listParams.finished;
    },
  },
  methods: {
    ...mapActions(["getApplicationList"]),
    init() {
      this.Application();
      this.getApplicationList({ codeClsType: "02_APPLI_CLS" }); //应用分类
    },
    //搜索框
    search() {
      this.Application();
    },
    // 新增需求--跳转
    addNeeds() {
      remoteRoute.openMenu("/my/province/new_need");
    },
    // 新增报备--跳转
    addReport() {
      remoteRoute.openMenu("/my_reported/DataAdd", { type: "0" });
    },
    // 上拉加载
    onLoad() {
      this.listParams.loading = true;
      if (this.listParams.finished == false) {
        this.listParams.pageIndex++;
        this.Application();
      }
    },
    // 应用市场--接口
    Application() {
      if (this.modelCode != "06") {
        let params = {
          pageIndex: this.listParams.pageIndex,
          pageSize: this.listParams.pageSize,
          filter: {
            appName: this.needsInput, //应用名称
            mgtOrgCode: this.mgtOrgCode,
            appCls: this.Classification.appsCategory, //应用分类
            busCls: this.busCls, //业务分类
            verStatus: "03", //版本状态：01 待发布、02 发布驳回、03 已发布、04 下架驳回、05 已下架
            instPackage: this.instPack_info.toString(),
            sort: this.sort, //排序:1=>升序 2=>降序
          },
        };
        queryAllAppInfoAndCommonDl(params)
          .then((res) => {
            if (res.data.data.list.length > 0) {
              if (this.listParams.pageIndex == 1) this.ApplicaData = [];
              if (res.data.data.list.length == 0) return;
              this.ApplicaData = this.ApplicaData.concat(res.data.data.list);
              // 如果分页大于1，将数据push进列表
              if (this.listParams.pageIndex > 1) {
                this.ApplicaData.push(...res.data.data.list);
              }
              this.ApplicaData.forEach((item) => {
                item.appAverageScore = Number(item.appAverageScore);
                if (item.appInfo.length > 115) {
                  item.isShow = false;
                } else {
                  item.isShow = true;
                }
              });
              // 判断是否有数据（如果有加载关闭）
              this.listParams.loading = false;
              // 判断是否有数据（如果没有提示没有数据）
              if (res.data.data.list.length < this.listParams.pageSize) {
                this.listParams.finished = true;
              }
            } else {
              // 如果数据为空，则显示暂无数据
              this.ApplicaData = [];
              this.listParams.loading = false;
              this.listParams.finished = true;
            }
          })
          .catch(() => {
            this.listParams.error = true;
            this.listParams.loading = false;
          });
      } else if (this.modelCode == "06") {
        let params = {
          pageIndex: this.listParams.pageIndex,
          pageSize: this.listParams.pageSize,
          filter: {
            applTitle: this.needsInput, //应用名称
            // mgtOrgCode: this.mgtOrgCode,
            // appCls: this.Classification.appsCategory, //应用分类
            // busCls: this.busCls, //业务分类
            // verStatus: "03", //版本状态：01 待发布、02 发布驳回、03 已发布、04 下架驳回、05 已下架
            typeStatus: this.instPack_info.toString(),
            sort: this.sort, //排序:1=>升序 2=>降序
          },
        };
        queryPublishingModel(params)
          .then((res) => {
            if (res.data.data.list.length > 0) {
              if (this.listParams.pageIndex == 1) this.ApplicaData = [];
              if (res.data.data.list.length == 0) return;
              this.ApplicaData = this.ApplicaData.concat(res.data.data.list);
              // 如果分页大于1，将数据push进列表
              if (this.listParams.pageIndex > 1) {
                this.ApplicaData.push(...res.data.data.list);
              }
              this.ApplicaData.forEach((item) => {
                item.appAverageScore = Number(item.appAverageScore);
                if (item.appInfo.length > 115) {
                  item.isShow = false;
                } else {
                  item.isShow = true;
                }
              });
              // 判断是否有数据（如果有加载关闭）
              this.listParams.loading = false;
              // 判断是否有数据（如果没有提示没有数据）
              if (res.data.data.list.length < this.listParams.pageSize) {
                this.listParams.finished = true;
              }
            } else {
              // 如果数据为空，则显示暂无数据
              this.ApplicaData = [];
              this.listParams.loading = false;
              this.listParams.finished = true;
            }
          })
          .catch(() => {
            this.listParams.error = true;
            this.listParams.loading = false;
          });
      }
    },
    // tab切换
    tabClicks(num, index, value) {
      switch (num) {
        case 0:
          if (value != "06") {
            this.modelCode = value;
            this.$set(this.tabActive, "application", index);
            this.Classification.appsCategory = value;
            this.listParams.pageIndex = 1; // 页码重置
            this.listParams.finished = false; // 加载数据
            this.tabbusiness(); //促发业务分类-接口
            this.Application();
          } else if (value == "06") {
            // console.log(value);
            this.modelCode = value;
            this.$set(this.tabActive, "application", index);
            this.Classification.appsCategory = value;
            this.listParams.pageIndex = 1; // 页码重置
            this.listParams.finished = false; // 加载数据
            this.Businesslist.length = 0;
            this.Application();
          }

          break;
        case 1:
          this.$set(this.tabActive, "business", index);
          this.busCls = value;
          this.listParams.pageIndex = 1; // 页码重置
          this.listParams.finished = false; // 加载数据
          this.Application();
          break;
        default:
          break;
      }
    },
    // 数据模型接口

    // 业务分类
    tabbusiness() {
      queryBuinessCategory(this.Classification).then((res) => {
        if (res.data.code === 200) {
          this.Businesslist = [{ businessCategoryName: "全部", businessCategory: "" }, ...res.data.data];
        }
      });
    },
    // 排序切换
    instPack(value) {
      this.ApplicaData = [];
      this.instPack_info = value;
      this.listParams.pageIndex = 1; // 页码重置
      this.listParams.finished = false; // 加载数据
      this.Application();
    },
  },
  watch: {
    sortShow(value) {
      if (value) {
        this.sort = "1";
        this.ApplicaData = [];
        this.listParams.pageIndex = 1; // 页码重置
        this.listParams.finished = false; // 加载数据
      } else {
        this.sort = "2";
        this.ApplicaData = [];
        this.listParams.pageIndex = 1; // 页码重置
        this.listParams.finished = false; // 加载数据
      }
      this.Application();
    },
  },
};
</script>
<style lang="scss" scoped>
.market {
  width: 100%;
  height: 100%;
  background: #fff; //背景色
  &-image {
    position: relative;
    width: 100%;
    height: 170px;
    margin: auto;
    background: url("~@/assets/img/imgWrap.png") no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    p {
      position: absolute;
      left: 52%;
      margin-left: -10%;
      font-size: 42px;
      text-align: center;
      letter-spacing: 0.4em;
      font-family: "Microsoft YaHei";
      // 文字倾斜
      font-style: italic;
      color: #ffffff;
    }
    span {
      position: absolute;
      left: 50%;
      bottom: 36px;
      margin-left: -9%;
      font-family: "Microsoft YaHei";
      font-style: normal;
      font-weight: 290;
      font-size: 14px;
      text-align: center;
      letter-spacing: 0.4em;
      color: #ffffff;
      // 文字水平居中
    }
    @media screen and (min-width: 962px) and (max-width: 1440px) {
      width: 100%;
      height: 100px;
      p {
        margin: 0px;
        position: absolute;
        top: 20px;
        left: 54%;
        margin-left: -10%;
        font-size: 32px;
        text-align: center;
        letter-spacing: 0.3em;
        font-family: "Microsoft YaHei";
        // 文字倾斜
        font-style: italic;
        color: #ffffff;
      }
      span {
        position: absolute;
        left: 50%;
        bottom: 10px;
        margin-left: -9%;
        font-family: "Microsoft YaHei";
        font-style: normal;
        font-weight: 290;
        font-size: 12px;
        text-align: center;
        letter-spacing: 0.4em;
        color: #ffffff;
      }
    }
  }
  .market-box {
    width: 95%;
    margin: 0 auto;
    .market-input {
      margin-top: 20px;
      margin: 25px auto;
      width: 75%;
      /deep/ .ami-input__inner {
        border-radius: 50px;
      }
      /deep/ .ami-input__prefix {
        left: 16px;
      }
      // 查询
      /deep/ .ami-button.is-round {
        position: relative;
        height: 100%;
        right: -5px;
        padding: 8px 20px;
        border-radius: 0px 20px 20px 0px;
      }
      // 清空按钮
      /deep/ .ami-input__clear {
        position: absolute;
        right: 90px;
      }
      /deep/ .ami-input--prefix .ami-input__inner {
        padding-left: 40px;
      }
      // 标题部分
      /deep/ .ami-select-dropdown__item.selected {
        color: #0040d1;
        font-weight: 700;
        margin-left: 30px;
      }
      i {
        font-weight: bold;
        color: #0040d1;
      }
    }
    .market-sortNeeds {
      width: 90%;
      font-size: 16px;
      &-title {
        @media screen and (min-width: 962px) and (max-width: 1440px) {
          /deep/ .ami-input--prefix .ami-input__inner {
            padding-left: 40px;
          }
        }
      }
      ul {
        margin: 0;
        padding: 0;
        display: flex;
        height: 50px;
        list-style-type: none;
        text-decoration: none;
        li:nth-child(1) {
          font-style: normal;
          font-weight: 700;
          font-size: 16px;
          line-height: 24px;
        }
        li {
          cursor: pointer;
          padding: 15px;
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
        }
      }
      ul li:first-child {
        color: #0040d1;
      }
    }
    .market-mian {
      display: inline-block;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      max-height: calc(100vh - 48vh);
      overflow: auto;
      @media screen and (min-width: 962px) and (max-width: 1440px) {
        max-height: calc(100vh - 54vh);
      }
    }
    /deep/ .ami-input--prefix .ami-input__inner {
      padding-left: 40px;
    }
  }
  // 加载上文
  .loading {
    color: #5e6d82;
    font-size: 14px;
    text-align: center;
  }
}
.active {
  color: #0040d1;
  font-weight: 600;
}
</style>
