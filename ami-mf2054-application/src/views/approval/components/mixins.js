/*
 * @description:标准应用-审批详情-混入文件
 * @author: 王浩
 * @Date: 2023-01-04 09:46:24
 * @Modified By: --
 * @version: 1.0.0
 */
import { filterSize, Mapping } from "@/utils/util";
import { queryAppOperLog, queryNeed, queryAppVerInfos, Iconinformation, fileDownLoad } from "@/api/approval/approval";
import VersioneDialog from "@/components/Application/Version_dialog.vue"; // 版本信息弹窗
import AssociateDialog from "@/components/Application/Associate_dialog"; // 需求明细弹窗
import OperationDialog from "@/components/Application/Operation_dialog"; // 操作记录弹窗
import DefectDialog from "@/components/Application/Defect_dialog"; // 缺陷信息弹窗
import PreviewDialog from "@/components/Approval/Preview_Dialog.vue"; // 文件预览弹窗
export default {
  data() {
    return {
      visible: false, //预览弹窗状态
      allowEdit: false, //是否允许编辑
      versionVisible: false, // 版本信息弹窗
      AssociateVisible: false, // 关联需求弹窗
      DefectVisible: false, // 缺陷信息弹窗
      OperationVisible: false, // 操作记录弹窗
      spanArr: [], //附件--暂存数据
      verNoList: {}, //版本信息数据
      operationList: [], //操作日志
      AssociateList: {}, //关联需求数据
      Mapping: Mapping, // 不支持的附件类型
      filterSize: filterSize, //文件大小过滤器
      Icon: Iconinformation, //图标信息
      // 文件-预览数据
      file: {
        fileId: "", //文件id
        fileName: "", //文件名称
        fileType: "", //文件类型
      },
      defaultImg: 'this.src="' + require("@/assets/img/pgy1.jpg") + '"', //默认图片
    };
  },
  // 注册组件
  components: {
    VersioneDialog,
    AssociateDialog,
    OperationDialog,
    DefectDialog,
    PreviewDialog,
  },
  computed: {},
  methods: {
    // 附件信息
    Appendix(data) {
      if (data === null) return; //如果为null的话直接停止
      for (let i = 0; i < data.length; i++) {
        // 判断attNo为null或者为空，为空的话将数组里面删除
        if (data[i].attId === "" || data[i].attId == null || typeof data[i].attId === undefined) {
          data.splice(i, 1);
          i = i - 1;
        } else if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].attTypeName === data[i - 1].attTypeName) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    // 合并单元格
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    // 版本历史记录-弹窗
    handle_version() {
      let params = {
        filter: {
          appId: this.Approval.appId,
          mgtOrgCode: this.userInfo.mgtOrgCode,
        },
      };
      queryAppVerInfos(params)
        .then((res) => {
          if (res.data.code === 200) {
            this.verNoList = res.data.data;
            this.versionVisible = true;
          }
        })
        .catch(() => {
          this.$message.error("查询失败");
        });
    },
    // 操作日志-弹窗
    operation_log() {
      let params = {
        appId: this.Approval.appId,
        appVerId: this.Approval.appVerId,
      };
      queryAppOperLog(params).then((res) => {
        if (res.data.code === 200) {
          this.operationList = res.data.data;
        }
      });
      this.OperationVisible = true;
    },
    // 关联需求-弹窗
    handle_relation() {
      let params = {
        filter: {
          appVerId: this.Approval.appVerId, //应用版本id
        },
      };
      queryNeed(params).then((res) => {
        if (res.data.code === 200) {
          this.AssociateList = res.data.data;
          console.log(this.AssociateList, "需求管理");
          this.AssociateVisible = true;
        }
      });
    },
    // 关联缺陷-弹窗
    Associate_defects() {
      this.DefectVisible = true;
    },
    // 文件-预览
    previewer(row) {
      this.allowEdit = false;
      // 获取attName中的文件后缀名
      let fileType = row.attName.split(".").pop().toString();
      console.log(fileType);
      if (fileType == this.Mapping[fileType]) {
        this.$message.warning("暂不支持该文件类型预览！");
      } else {
        this.file = {
          fileId: row.attId,
          fileName: row.attName,
          fileType: fileType,
        };
        this.visible = true;
      }
    },
    // 下载附件
    download(row) {
      if (row.attId === null) return;
      let params = { fileId: row.attId };
      fileDownLoad(params)
        .then((res) => {
          if (res.status === 200) {
            let fileName = row.attName; // fileName文件名称
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
  },
};
