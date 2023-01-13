<!--
 * @description: echarts-应用评价
 * @author: 王浩
 * @Date: 2022-10-12 16:52:02
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="evaluation" ref="main"></div>
</template>
<script>
import { echarsResize } from "@/utils/echarsResize";
export default {
  name: "Evaluation",
  props: {
    // 应用发布图表
    releaseList: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      line: null,
    };
  },
  mounted() {
    this.loadEvaluationFn();
  },
  methods: {
    // 柱状图
    loadEvaluationFn() {
      this.line = this.$echarts.init(this.$refs.main);
      this.line.setOption({
        color: ["#3399FF"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ["评分"],
          right: "center",
          top: 0,
          itemWidth: 12,
          itemHeight: 10,
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "12%",
          top: "16%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
              lineStyle: {
                color: "white",
              },
            },
            axisPointer: {
              type: "shadow",
            },
            //x轴文字的配置
            axisLabel: {
              show: true,
              interval: 0,
              formatter: function (params) {
                let newParamsName = "";
                const paramsNameNumber = params.length; // 文字总长度
                const provideNumber = 6; //一行显示几个字
                const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                if (paramsNameNumber > provideNumber) {
                  for (let p = 0; p < rowNumber; p++) {
                    const start = p * provideNumber;
                    const end = start + provideNumber;
                    const tempStr =
                      p === rowNumber - 1 ? params.substring(start, paramsNameNumber) : params.substring(start, end) + "\n";
                    newParamsName += tempStr;
                  }
                } else {
                  newParamsName = params;
                }
                return newParamsName;
              },
            },
            data: this.releaseList.xAxisData,
          },
        ],
        yAxis: [
          {
            min: 0,
            max: 5,
            type: "value",
            name: "单位：分",
            nameGap: 10,
            nameLocation: "end", //---轴名称相对位置在右边
            axisLabel: {
              formatter: "{value}",
              lineStyle: {
                color: "#58f371", //最左侧Y轴颜色
              },
            },
            // 坐标轴线
            axisLine: {
              show: true,
              margin: 10,
            },
          },
        ],
        // 滚动条
        dataZoom: [
          {
            show: false, //是否显示滚动条
            realtime: true,
            start: 0,
            end: 30, // 滚动条的长度-结束位置
            height: 10, //这里可以设置dataZoom的尺寸
            bottom: 10,
          },
          {
            type: "inside",
            realtime: true,
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            name: "评分",
            type: "bar",
            barWidth: 30,
            tooltip: {
              valueFormatter: function (value) {
                if (value == undefined || value == null) {
                  return 0;
                } else {
                  return value;
                }
              },
            },
            data: this.releaseList.cAxisData,
          },
        ],
      });
      echarsResize(this.line);
    },
  },
  watch: {
    releaseList: {
      deep: true,
      handler() {
        this.loadEvaluationFn();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.evaluation {
  width: 100%;
  height: 100%;
}
</style>
