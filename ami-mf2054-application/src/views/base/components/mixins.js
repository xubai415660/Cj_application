/*
 * @description: 基座管理-混入
 * @author: 王浩
 * @Date: 2023-01-04 15:28:18
 * @Modified By: --
 * @version: 1.0.0
 */
import { remoteRoute } from "@/utils/remoteUtil";
import { filterSize, Mapping } from "@/utils/application";
import { queryAppOperLog, queryNeed, Iconinformation, fileDownLoad } from "@/api/approval/approval";
import { smallFileUpload, fileUploadRemover } from "@/api/application/application";
import DemandSource from "@/components/Application/Demand_source";
import DefectSource from "@/components/Application/Defect_source";
import AssociateDialog from "@/components/Application/Associate_dialog"; // 需求明细弹窗
import OperationDialog from "@/components/Application/Operation_dialog"; // 操作记录弹窗
import DefectDialog from "@/components/Application/Defect_dialog"; // 缺陷信息弹窗
import PreviewDialog from "@/components/Approval/Preview_Dialog.vue"; // 文件预览弹窗
export default {
  data() {
    return {
      visible: false, //预览弹窗状态
      allowEdit: false, //是否允许编辑
      AssociateVisible: false, // 关联需求弹窗
      DefectVisible: false, // 缺陷信息弹窗
      OperationVisible: false, // 操作记录弹窗
      codeImg: "", // 图标
      fileList: [], // 文件列表
      operationList: [], //操作日志
      AssociateList: {}, //关联需求数据
      DefectList: {}, //关联缺陷数据
      Mapping: Mapping, // 不支持的附件类型
      filterSize: filterSize, //文件大小过滤器
      Icon: Iconinformation, //图标信息
      remoteRoute: remoteRoute, // 路由跳转
      // 文件-预览数据
      file: {
        fileId: "", //文件id
        fileName: "", //文件名称
        fileType: "", //文件类型
      },
      defaultImg: 'this.src="' + require("@/assets/img/pgy1.jpg") + '"', //默认图片
      // 需求分页
      page: {
        pageIndex: 1, //当前页数
        pageSize: 5, //每页显示条目个数
        tableTotal: 0, //总条目数
      },
      // 缺陷分页
      page2: {
        pageIndex: 1, //当前页数
        pageSize: 5, //每页显示条目个数
        tableTotal: 0, //总条目数
      },
    };
  },
  // 注册组件
  components: {
    DemandSource,
    DefectSource,
    AssociateDialog,
    OperationDialog,
    DefectDialog,
    PreviewDialog,
  },
  // 计算属性
  computed: {
    tableData() {
      return this.DemandTable.slice((this.page.pageIndex - 1) * this.page.pageSize, this.page.pageIndex * this.page.pageSize);
    },
    tableData2() {
      return this.DefectTable.slice((this.page2.pageIndex - 1) * this.page2.pageSize, this.page2.pageIndex * this.page2.pageSize);
    },
  },
  methods: {
    // -----------------------图标上传-----------------------
    // 应用图标-上传
    uploadImg(file) {
      let types = ["image/jpeg", "image/jpg", "image/png"];
      const isImage = types.includes(file.raw.type);
      const isLtSize = file.raw.size / 1024 / 1024 < 1;
      if (!isImage) {
        this.$message.error("上传图片只能是 JPG、JPEG、PNG 格式!");
        return;
      }
      if (!isLtSize) {
        this.$message.error("上传图片大小不能超过 1MB!");
        return;
      }

      this.limitFileWH(120, 120, file.raw).then((res) => {
        file.isFlag = res;
        if (file.isFlag) {
          this.fileList = [file];
          this.queryAppImageAdd();
        }
      });
    },
    // 限制图片的宽高
    limitFileWH(E_width, E_height, file) {
      const _this = this;
      let imgWidth = "";
      let imgHight = "";
      const isSize = new Promise(function (resolve, reject) {
        const width = E_width;
        const height = E_height;
        const _URL = window.URL || window.webkitURL;
        const img = new Image();
        img.onload = function () {
          imgWidth = img.width;
          imgHight = img.height;
          // 判断图片的宽高是否符合要求（ 小于等于）
          const valid = img.width <= width && img.height <= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return true;
        },
        () => {
          _this.$message.warning({
            message: "上传图片的尺寸应为" + E_width + "*" + E_height + "，当前上传图片的尺寸为：" + imgWidth + "*" + imgHight,
            btn: false,
          });
          return false;
        },
      );
      return isSize;
    },
    // 应用图片-上传
    queryAppImageAdd() {
      let param = new FormData();
      param.append("multipartFile", this.fileList[0].raw);
      smallFileUpload(param).then((res) => {
        if (res.data.code === 200 && res.data.data != null) {
          // 给 图片id 赋值
          this.ruleForm.iconVer = res.data.data.fileId;
          this.codeImg = Iconinformation(res.data.data.fileId);
          this.$message({
            type: "success",
            message: "上传成功！",
          });
          return;
        } else {
          this.$message({
            type: "info",
            message: "上传失败！",
          });
        }
      });
    },
    // 应用图标-删除
    handleRemove() {
      let param = {
        fileId: this.ruleForm.appIcon,
      };
      fileUploadRemover(param).then((res) => {
        if (res.data.code === 200) {
          this.ruleForm.appIcon = "";
          this.codeImg = "";
          this.$message({
            type: "success",
            message: "删除成功！",
          });
        } else {
          this.$message({
            type: "info",
            message: "删除失败！",
          });
        }
      });
    },
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

    // ----------------操作日志、关联需求、关联缺陷弹窗--------------------------
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

    // --------------------------需求、缺陷来源--------------------------
    // 序号-计算
    indexMethod(index) {
      return (this.page.pageIndex - 1) * this.page.pageSize + index + 1;
    },
    // 需求来源-分页数量
    handleSizeChange(val) {
      this.page.pageSize = val;
    },
    // 需求来源-分页
    handleCurrentChange(val) {
      this.page.pageIndex = val;
    },
    // 缺陷来源-分页数量
    handleSizeChange2(val) {
      this.page2.pageSize = val;
    },
    // 缺陷来源-分页
    handleCurrentChange2(val) {
      this.page2.pageIndex = val;
    },
  },
};
