<!--
 * @description: 关联需求弹窗
 * @author: 王浩
 * @Date: 2022-10-14 16:30:49
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="Associate">
    <ami-dialog title="关联需求" width="960px" :visible.sync="AssociateVisible" :before-close="handleCancel">
      <!-- 弹窗内容区 -->
      <div class="shelf-dialog">
        <div class="shelf-item" v-for="(item, index) in AssociateList.list" :key="index">
          <ami-model-title :title="item.fbTitle"> </ami-model-title>
          <div class="shelf-main">
            <!-- 需求描述 -->
            <ami-row>
              <ami-col :span="2">
                <span class="shelf-txt">需求描述：</span>
              </ami-col>
              <ami-col :span="22">{{ item.fbContent }}</ami-col>
            </ami-row>
            <!-- 解决问题 -->
            <ami-row>
              <ami-col :span="2">
                <span class="shelf-txt">解决问题：</span>
              </ami-col>
              <ami-col :span="22">{{ item.fbSuggest }}</ami-col>
            </ami-row>
            <!-- 附件 -->
            <ami-row>
              <ami-col :span="2">
                <span class="shelf-txt">附件：</span>
              </ami-col>
              <ami-col :span="22">
                <span v-if="item.fileName == null">--</span>
                <span class="attachment" @click="download(item)" v-else>{{ item.fileName }}</span>
              </ami-col>
            </ami-row>
            <ami-row>
              <button>{{ item.appClsName == null ? "--" : item.appClsName }}</button>
              <button>{{ item.busClsName == null ? "--" : item.busClsName }}</button>
              <button>{{ item.appName == null ? "--" : item.appName }}</button>
            </ami-row>
          </div>
        </div>
      </div>
      <ami-empty v-if="AssociateList.list == ![]" description="暂无数据"></ami-empty>
    </ami-dialog>
  </div>
</template>
<script>
import { fileDownLoad } from "@/api/approval/approval";
export default {
  name: "AMI-MA0102054-13",
  props: {
    // 弹窗显示隐藏
    AssociateVisible: {
      type: Boolean,
      default: false,
    },
    AssociateList: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    // 下载附件
    download(row) {
      if (row.fileId === null) return;
      let params = { fileId: row.fileId };
      fileDownLoad(params)
        .then((res) => {
          if (res.status === 200) {
            let fileName = row.fileName; // fileName文件名称
            let url = window.URL.createObjectURL(new Blob([res.data]));
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            this.$message({
              type: "success",
              message: "下载文件成功!",
            });
          }
        })
        .catch(() => {
          this.$message.error("下载文件失败！");
        });
    },
    // 关闭弹窗
    handleCancel() {
      this.$emit("update:AssociateVisible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.Associate {
  width: 100%;
  height: 100%;
  .shelf-dialog {
    width: 100%;
    height: 100%;
    overflow: auto;
    max-height: 600px;
    .shelf-item {
      margin-top: 10px;
      /deep/ .ami-model-title {
        margin: 0px 0px 0px -17px;
      }
      .shelf-main {
        width: 100%;
        border-bottom: 16px;
        border-bottom: 1px solid #e8e8e8;
        /deep/ .ami-row {
          margin-bottom: 20px;
        }
        .shelf-txt {
          color: #999999;
          font-size: 14px;
          float: right;
        }
        .attachment {
          cursor: pointer;
          color: #0040d1;
          text-decoration: underline;
        }
        button {
          margin-right: 10px;
          cursor: text;
          border: none;
          color: #fff;
          border-radius: 5px;
        }
        button:nth-child(1) {
          background: #0040d1;
        }
        button:nth-child(2) {
          background: #46a8e0;
        }
        button:nth-child(3) {
          background: #e6a23c;
        }
      }
    }
  }
}
</style>
