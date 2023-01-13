<!--
 * @description: echarts-应用分布
 * @author: 王浩
 * @Date: 2022-10-12 15:02:54
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div ref="distribution" style="width: 100%; height: 100%"></div>
</template>
<script>
export default {
  name: "Distribution",
  props: {
    // 应用分布图表数据
    distributionList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      myChart: null,
    };
  },
  mounted() {
    this.chartsMethod();
  },
  methods: {
    //初始化echarts
    chartsMethod() {
      this.myChart = this.$echarts.init(this.$refs.distribution);
      this.myChart.setOption({
        legend: {
          //图例文字
          data: this.distributionList.map((item) => item.name),
          y: "center",
          right: 20,
          show: true,
          icon: "circle",
          //图例的类型，默认为plain，可选plain（普通） | scroll（可滚动翻页图例）
          type: "scroll",
          // 图例的布局朝向，默认为horizontal，可选为 horizontal | vertical
          orient: "vertical",
          // 图例每项间隔
          itemGap: 16,
        },
        title: {
          text: `${this.distributionList.reduce((total, item) => total + item.value, 0)}个`,
          left: "37.5%",
          top: "52%",
          textStyle: {
            fontSize: 14,
            align: "center",
          },
        },
        graphic: {
          type: "text",
          left: "39%",
          top: "45%",
          style: {
            text: "总",
            textAlign: "center",
            fill: "#333",
            fontSize: 14,
          },
        },
        //鼠标移入,显示气泡
        tooltip: {
          formatter: function (params) {
            if (params) {
              return `${params.marker}${params.name} ${params.value}个 ${params.percent}%`;
            }
          },
          textStyle: {
            height: 30,
            lineHeight: 30,
          },
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
        },
        series: [
          {
            data: this.distributionList,
            type: "pie",
            center: ["40%", "50%"],
            radius: ["40%", "55%"], //圆环
            color: ["#5b8ff9", "#85e2bd", "#5d7092", "#f6bd16", "#6f5ef9", "#6dc8ec", "#905ab7", "#fd7c16"],
            labelLine: {
              length: 20,
              length2: 0,
            },
            //图形样式
            itemStyle: {
              normal: {
                //label（图形文本标签）设置
                label: {
                  //引导线
                  show: true,
                  fontWeight: "bold", //字体加粗
                  position: "outer",
                  alignTo: "labelLine", //设置方向
                  margin: "30%",
                  // formatter: "{d}%", //引导线显示数据
                  formatter: (params) => {
                    if (params.name !== "") {
                      return `${params.percent === undefined ? 0 : params.percent}%`;
                    }
                    return `${0}%`;
                  },
                },
                // 文本标签样式设置
                textStyle: {
                  // 字号
                  fontSize: 36,
                },
              },
            },
            emphasis: {
              focus: "self", //其他虚化
              itemStyle: {
                borderColor: "#000",
                borderWidth: 1,
              },
            },
          },
        ],
      });
      window.addEventListener("resize", () => this.myChart.resize());
    },
  },
  watch: {
    distributionList: {
      deep: true,
      handler() {
        this.chartsMethod();
      },
    },
  },
};
</script>
