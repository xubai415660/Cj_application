<!--
 * @description: 相关推荐
 * @author: 王浩
 * @Date: 2022-10-11 10:17:37
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="related">
    <!-- 推荐 -->
    <div class="related-box">
      <ami-model-title title="相关推荐" borderBottom>
        <ami-select v-model="instPack_info" placeholder="请选择" style="width: 160px" @change="instPack($event)">
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
      <!-- 内容区域 -->
      <div class="market-mian" v-infinite-scroll="onLoad" infinite-scroll-disabled="disabled" infinite-scroll-immediate="false">
        <Marketlist :ApplicaData="ApplicaData"></Marketlist>
      </div>
      <p class="loading" v-if="listParams.loading">加载中...</p>
      <p class="loading" v-if="listParams.finished && this.ApplicaData == []">没有更多了</p>
      <!-- 暂无数据 -->
      <ami-empty v-if="this.ApplicaData == ![]" :image-size="200"></ami-empty>
    </div>
  </div>
</template>
<script>
import Marketlist from "./market_list.vue";
import { recommends } from "@/api/market/market.js";
export default {
  name: "AMI-MA0102052-06",
  components: { Marketlist },
  data() {
    return {
      sort: "2", //排序
      sortShow: false, //排序显示
      instPack_info: 2, //下拉框
      ApplicaData: [], //列表数据
      // 下拉框数据
      instPackage: [
        { label: "用户评分", value: 1 },
        { label: "下载量", value: 2 },
        { label: "发布时间", value: 3 },
      ],
      listParams: {
        pageIndex: 1,
        pageSize: 14,
        loading: false,
        error: false,
        finished: false,
      },
    };
  },
  created() {
    this.Application();
  },
  computed: {
    // 禁用加载更多
    disabled() {
      return this.listParams.loading || this.listParams.finished;
    },
  },
  methods: {
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
      let params = {
        pageIndex: this.listParams.pageIndex,
        pageSize: this.listParams.pageSize,
        filter: {
          busCls: this.$route.query.busCls,
          verStatus: "03",
          mgtOrgCode: this.$route.query.mgtOrgCode, //省侧编码
          recommendAppId: this.$route.query.appId, //相关推荐id
          instPackage: this.instPack_info.toString(),
          sort: this.sort, //排序:1=>升序 2=>降序
        },
      };
      recommends(params)
        .then((res) => {
          if (res.data.data.list.length > 0) {
            // 如果是第一页需手动置空列表
            if (this.listParams.pageIndex == 1) this.ApplicaData = [];
            if (res.data.data.list.length == 0) return;
            this.ApplicaData = this.ApplicaData.concat(res.data.data.list);
            // 判断文字
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
    },
    // 下拉框
    instPack(value) {
      this.instPack_info = value;
      this.ApplicaData = [];
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
.related {
  width: 100%;
  background: #fff;
  height: calc(100% - 24px);
  &-box {
    width: 95%;
    margin: 16px auto;
    /deep/ .ami-input--prefix .ami-input__inner {
      padding-left: 38px;
    }
    // 标题部分
    /deep/ .ami-select-dropdown__item.selected {
      color: #0040d1;
      font-weight: 700;
      margin-left: 30px;
    }
    .market-mian {
      display: inline-block;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      max-height: calc(100vh - 200px);
      overflow: auto;
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
