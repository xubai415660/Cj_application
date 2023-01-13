<!--
 * @description: xlsx预览
 * @author: 王浩
 * @Date: 2022-11-24 18:04:47
 * @Modified By: --
 * @version: 1.0.0
-->
<template>
  <div class="excel-preview">
    <ami-lucky-sheet
      v-if="showFlag"
      style="height: 600px; width: 100%; z-index: 9999"
      ref="online"
      :id="container"
      :container="container"
      :fileName="fileName"
      :gridKey="gridKey"
      :loadUrl="loadUrl"
      :loadSheetUrl="loadSheetUrl"
      :allowEdit="editable"
      :editable="editable"
      :allowUpdate="allowUpdate"
      :updateUrl="updateUrlForData"
      myFolderUrl=""
    ></ami-lucky-sheet>
  </div>
</template>

<script>
import { getUserInfo } from "@/utils/store";
import website from "@/config/website";
export default {
  name: "excelPreview",
  props: {
    fileName: {
      type: String,
      require: true,
    },
    fileId: {
      type: String,
      require: true,
    },
    editable: {
      type: Boolean,
      require: true,
    },
    loadUrl: {
      type: String,
      default: "/ami/ma01-02-061/api/load",
    },
    loadSheetUrl: {
      type: String,
      default: "/ami/ma01-02-061/api/loadsheet",
    },
    updateUrl: {
      type: String,
      default: "",
    },
  },
  methods: {
    setUpdateUrl() {
      this.updateUrlForData = `ws://${website.productionUrl}/ami/ma01-02-061/ws/luckysheet/${this.userInfo.operatorId}/${this.fileId}?Sgami=headquarters&token=${this.token}`;
      this.showFlag = true;
      this.moreBtnControl();
    },
    moreBtnControl() {
      let counter = 0;
      let moreBtn = null;
      const loop10 = setInterval(() => {
        counter++;
        if (counter < 11 && !moreBtn) {
          moreBtn = document.getElementById("luckysheet-icon-morebtn");
          if (moreBtn) {
            clearInterval(loop10);
            moreBtn.addEventListener("click", () => {
              setTimeout(() => {
                const moreBar = document.getElementById("luckysheet-icon-morebtn-div");
                if (moreBar) {
                  moreBar.style.zIndex = 9000;
                }
              }, 100);
            });
          }
        } else {
          clearInterval(loop10);
        }
      }, 3000);
    },
  },
  data() {
    return {
      userInfo: {}, // 用户信息
      container: "luckysheet_" + new Date().getTime(),
      gridKey: this.fileId,
      allowEdit: this.editable,
      allowUpdate: this.editable,
      updateUrlForData: this.updateUrl,
      showFlag: false,
    };
  },
  mounted() {
    this.userInfo = getUserInfo();
    this.setUpdateUrl();
  },
};
</script>

<style lang="scss" scoped>
.excel-preview {
  overflow: hidden;
  height: 70%;
}
</style>
