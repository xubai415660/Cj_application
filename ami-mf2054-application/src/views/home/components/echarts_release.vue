<!--
 * @description: echarts-应用发布
 * @author: 王浩
 * @Date: 2022-10-12 16:50:46
 * @Modified By: 
 * @version: 1.0.0
-->
<template>
  <div class="release" ref="release"></div>
</template>
<script>
import { echarsResize } from "@/utils/echarsResize";
export default {
  name: "Release",
  props: {
    // 应用发布图表
    releaseList: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      myrelease: null,
    };
  },
  mounted() {
    this.loadreleaseFn();
  },
  methods: {
    // 柱状图
    loadreleaseFn() {
      this.myrelease = this.$echarts.init(this.$refs.release);
      this.myrelease.setOption({
        color: ["#3399FF", "#33CC99"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ["发布次数", "下载次数"],
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
            name: "月份",
            type: "category",
            axisTick: {
              alignWithLabel: true,
              lineStyle: {
                color: "white",
              },
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
            axisPointer: { type: "shadow" },
            data: this.releaseList.xAxisData,
          },
        ],
        yAxis: [
          {
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
            name: "单位：次",
            nameGap: 10,
            nameLocation: "end", //---轴名称相对位置在右边
            splitLine: { show: true },
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
            left: 10,
            right: 10,
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
            name: "发布次数",
            type: "bar",
            barWidth: 20, //柱子宽度
            barCategoryGap: "10%",
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: this.releaseList.yAxisData,
          },
          {
            name: "下载次数",
            type: "bar",
            barWidth: 20, //柱子宽度
            barCategoryGap: "10%",
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: this.releaseList.zAxisData,
          },
        ],
      });
      echarsResize(this.myrelease);
    },
  },
  watch: {
    releaseList: {
      deep: true,
      handler() {
        this.loadreleaseFn();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.release {
  width: 100%;
  height: 100%;
}
</style>
