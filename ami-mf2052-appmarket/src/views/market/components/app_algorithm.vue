<!--
 * @description: 数模下载
 * @author: wanghao
 * @Date: 2022-04-02 17:04:20
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <ami-card>
    <div class="algorithm">
      <!-- 头部 -->
      <div class="algorithm-top" :ApplicaData="ApplicaData">
        <Appdetails :item="item"></Appdetails>
      </div>
      <div class="algorithm-mian">
        <ami-model-title title="数模下载" borderBottom />
        <div class="algorithm-eff">
          <div v-for="(item, index) in algorithmlist.list" :key="index" style="margin-bottom: 10px">
            <span>{{ item.verNo }}</span>
            <span>{{ item.createTime }}</span>
            <ami-clamp autoresize :maxLines="maxLines" :expanded="expanded" :text="item.calcRule" showtip>
              <div slot="after">
                <ami-button type="text" @click="clickToggle()">{{ expanded ? "点击收起" : "点击展开>>" }}</ami-button>
              </div>
            </ami-clamp>
          </div>
        </div>
        <ami-empty v-if="algorithmlist.list == ![]" :image-size="200"></ami-empty>
      </div>
    </div>
  </ami-card>
</template>
<script>
import { Applicationdetails, queryAppVerInfos } from "@/api/market/market.js";
import Appdetails from "@/components/Appdetails/app_details.vue";
export default {
  name: "AMI-MA0102052-05",
  components: { Appdetails },
  data() {
    return {
      expanded: false, //展开
      maxLines: 2, //最大行数
      ApplicaData: {}, //应用信息
      algorithmlist: [], //数模下载
    };
  },
  created() {
    this.loadTable_info();
    this.load_algorithm();
  },
  methods: {
    // 获取应用详情
    loadTable_info() {
      let params = {
        appId: this.$route.query.appId,
        appCls: this.$route.query.appCls,
        appVerId: this.$route.query.appVerId,
        mgtOrgCode: this.$route.query.mgtOrgCode,
      };
      Applicationdetails(params).then((res) => {
        if (res.data.code === 200) {
          this.ApplicaData = res.data.data;
        }
      });
    },
    load_algorithm() {
      let params = {
        filter: {
          appId: this.$route.query.appId, //	appID确认APP
          mgtOrgCode: this.mgtOrgCode, //省侧编码
        },
      };
      queryAppVerInfos(params).then((res) => {
        if (res.data.code === 200) {
          this.algorithmlist = res.data.data;
          console.log(this.algorithmlist);
        }
      });
    },
    // 文字展开
    clickToggle() {
      this.expanded = !this.expanded;
    },
  },
};
</script>
<style lang="scss" scoped>
.algorithm {
  width: 90%;
  margin: 0 auto;
  &-top {
    margin-top: 80px;
  }
  &-mian {
    margin: 20px 0px;
    width: 100%;
    height: 100%;
    .algorithm-eff {
      padding: 20px;
      height: 30px;
      line-height: 30px;
      span {
        line-height: 15px;
        color: #999999;
        margin-right: 30px;
      }
      /deep/ .ami-clamp .autoresize {
        margin-top: 5px;
        color: #666666;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.02em;
      }
      /deep/ .ami-button--text {
        text-decoration: underline;
      }
    }
  }
}
</style>
