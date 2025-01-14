<script lang="ts" setup>
// 注册必须的组件
// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
import type {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineSeriesOption
} from "echarts/charts"
import type {
  DatasetComponentOption,
  GridComponentOption,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption
} from "echarts/components"
import type { ComposeOption, ECharts } from "echarts/core" // 引入 ECharts 类型
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, PieChart } from "echarts/charts"
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  DatasetComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent
} from "echarts/components"
import * as echarts from "echarts/core"
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features"
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers"

type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])
let myChart: ECharts
function setOpts() {
  const option: ECOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: "value"
      }
    ],
    series: [
      {
        name: "Direct",
        type: "bar",
        barWidth: "60%",
        data: [10, 52, 200, 334, 390, 330, 220]
      }
    ]
  }
  myChart.setOption(option)
}
onMounted(() => {
  nextTick(() => {
    myChart = echarts.init(document.getElementById("main"))
    setOpts()
  })
})
</script>

<template>
  <div class="app-container">
    <el-card>
      <div id="main" style="height: 500px;width:100%;" />
    </el-card>
  </div>
</template>
