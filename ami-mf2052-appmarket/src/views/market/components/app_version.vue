<!--
 * @description: 应用版本
 * @author: wanghao
 * @Date: 2022-04-01 17:20:47
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="version">
    <div class="app_version">
      <!-- 头部 -->
      <div class="app_version-top" :ApplicaData="ApplicaData">
        <Appdetails :item="ApplicaData"></Appdetails>
      </div>
      <div class="app_version-mian">
        <ami-model-title title="应用版本" borderBottom />
        <div class="mian-eff">
          <div v-for="(item, index) in versionList" :key="index" style="margin-bottom: 10px">
            <span>V{{ item.verNo }}</span>
            <span>{{ item.createTime }}</span>
            <ami-clamp autoresize :maxLines="maxLines" :expanded="expanded" :text="item.verDesc" effect="light">
              <div slot="after">
                <ami-button type="text" @click="clickToggle()">{{ expanded ? "点击收起" : "点击展开>>" }}</ami-button>
              </div>
            </ami-clamp>
          </div>
          <ami-empty v-if="this.versionList == ![]" :image-size="200"></ami-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Appdetails from "@/components/Appdetails/app_details.vue";
import { queryVerNoHistory, Applicationdetails } from "@/api/market/market.js";
export default {
  name: "AMI-MA0102052-03",
  components: { Appdetails },
  data() {
    return {
      expanded: false, //展开
      maxLines: 2, //最大行数
      versionList: [], //版本
      ApplicaData: {}, //应用详情
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loadTable();
      this.Version_data();
    },
    // 获取应用详情
    loadTable() {
      let params = {
        appId: this.$route.query.appId,
        appVerId: this.$route.query.appVerId,
        appCls: this.$route.query.appCls,
        mgtOrgCode: this.$route.query.mgtOrgCode,
      };
      Applicationdetails(params).then((res) => {
        if (res.data.code === 200) {
          this.ApplicaData = res.data.data;
        }
      });
    },
    // 版本数据
    Version_data() {
      let data = {
        appId: this.$route.query.appId, //	appID确认APP
        appVerId: this.$route.query.appVerId,
      };
      queryVerNoHistory(data).then((res) => {
        if (res.data.code === 200) {
          this.versionList = res.data.data;
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
.version {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow-y: auto;
  .app_version {
    width: 90%;
    margin: 0 auto;
    &-mian {
      margin: 20px 0px;
      width: 100%;
      height: 100%;
      .mian-eff {
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
}
</style>
