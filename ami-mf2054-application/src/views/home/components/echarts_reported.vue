<!--
 * @description: echarts-应用报备
 * @author: 王浩
 * @Date: 2022-10-12 16:53:42
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="main" ref="reported"></div>
</template>
<script>
import { echarsResize } from "@/utils/echarsResize";
export default {
  name: "Reported",
  props: {
    reportedList: {
      type: Object,
      default: () => [],
    },
  },
  data() {
    return {
      line: null,
    };
  },
  mounted() {
    this.loadlineFn();
  },
  methods: {
    // 折线图
    loadlineFn() {
      this.line = this.$echarts.init(this.$refs.reported);
      this.line.setOption({
        color: ["#669999", "#33CC99", "#3399FF"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ["审核中", "审核通过", "审核不通过"],
          right: "center",
          top: 6,
          itemWidth: 12,
          itemHeight: 10,
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "20%",
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
            data: this.reportedList.xAxisData,
          },
        ],
        yAxis: [
          {
            // min: "dataMin", //取最小值为最小刻度
            // max: "dataMax", //取最大值为最大刻度
            min: function (value) {
              //取最小值向下取整为最小刻度
              return Math.floor(value.min);
            },
            max: function (value) {
              //取最大值向上取整为最大刻度
              return Math.ceil(value.max + 5);
            },
            scale: true, //自适应
            type: "value",
            name: "单位：个",
            nameGap: 10,
            nameLocation: "end", //---轴名称相对位置在右边
            axisLabel: {
              formatter: "{value}",
            },
            axisLine: {
              show: true,
            },
          },
        ],
        series: [
          {
            name: "审核中",
            type: "bar",
            barWidth: 15, //柱子宽度
            stack: "Search Engine",
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: this.reportedList.yAxisData,
          },
          {
            name: "审核通过",
            type: "bar",
            barWidth: 15, //柱子宽度
            stack: "Search Engine",
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: this.reportedList.zAxisData,
          },
          {
            name: "审核不通过",
            type: "bar",
            barWidth: 15, //柱子宽度
            stack: "Search Engine",
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: this.reportedList.cAxisData,
          },
        ],
      });
      echarsResize(this.line);
    },
  },
  watch: {
    reportedList: {
      deep: true,
      handler() {
        this.loadlineFn();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
}
</style>
