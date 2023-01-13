/*
 * @description: 标准应用档案-混入
 * @author: 王浩
 * @Date: 2023-01-02 16:51:54
 * @Modified By: --
 * @version: 1.0.0
 */
import * as valid from "@/utils/rules";
import { Mapping } from "@/utils/echarsResize";
import { mapGetters, mapActions } from "vuex";
import { Iconinformation, fileDownLoad } from "@/api/approval/approval";
import { smallFileUpload, fileUploadRemover } from "@/api/application/application";
export default {
  data() {
    return {
      codeImg: "", // 图标
      fileList: [], // 文件列表
      amiTable: false, //控制需求来源表格显示/隐藏
      generateData: [], // 需求列表-生成
      DemandList: [], // 需求列表
      requireTable: [], // 需求来源列表
      storageList: [], // 暂存数据-需求列表(id)
      requiredHxCodes: [], //需求回显的reqId集合
      Mapping: Mapping, // 不支持的附件类型
      page: {
        pageIndex: 1, //当前页数
        pageSize: 5, //每页显示条目个数
        tableTotal: 0, //总条目数
      },
      // 表单验证
      rules: {
        appNameBa: [{ required: true, message: "请输入应用名称", trigger: "blur" }],
        busClsBa: [{ required: true, message: "请选择应用分类", trigger: "change" }],
        appManufacturerBa: [{ required: true, message: "请选择开发厂商", trigger: "change" }],
        baseVer: [{ required: true, message: "请选择基座版本", trigger: "change" }],
        verNoVer: [
          { required: true, message: "请输入版本号", trigger: "blur" },
          { validator: valid.numberValidUppers, message: "不允许输入特殊字符", trigger: "blur" },
        ],
        appInfoBa: [{ required: true, message: "请输入应用介绍", trigger: "blur" }],
        verDescVer: [{ required: true, message: "请输入版本说明", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["approval_classify", "approval_examine"]),
    tableData() {
      return this.requireTable.slice((this.page.pageIndex - 1) * this.page.pageSize, this.page.pageIndex * this.page.pageSize);
    },
  },
  methods: {
    ...mapActions(["getApprovalClassify", "getApprovalExamine"]),

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
    // 自定义搜索方法-模糊搜索
    filterMethod(query, item) {
      return item.fbTitle.indexOf(query) > -1;
    },
    // 需求列表-促发
    handleChange(value) {
      this.storageList = value;
    },
    // 需求任务列表-取消
    sgFrameCancel() {
      this.requireTable.length ? (this.amiTable = true) : (this.amiTable = false);
      this.DemandVisible = false;
      this.storageList = [];
    },
    // 需求任务列表-确定
    sgFrameDetermine() {
      this.requireTable = this.generateData.filter((item) => {
        return this.DemandList.includes(item.reqId);
      });
      this.requireTable.length ? (this.amiTable = true) : (this.amiTable = false);
      this.DemandVisible = false;
    },
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
  },
};
