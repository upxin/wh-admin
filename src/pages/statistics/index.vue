<script lang="ts" setup>
// 注册必须的组件
// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
import type {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption
} from "echarts/charts"
import type {
  DatasetComponentOption,
  GridComponentOption,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption
} from "echarts/components"
import type { ComposeOption, ECharts } from "echarts/core" // 引入 ECharts 类型
import { userCount } from "@@/apis/statistics/index"
import dayjs from "dayjs"
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, PieChart } from "echarts/charts"
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
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
  | PieSeriesOption
>

echarts.use([
  PieChart,
  LegendComponent,
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
function setOpts(x: any, y: any) {
  const option: ECOption = {
    color: ["#fe9739", "#F56C6C"],
    xAxis: {
      type: "category",
      data: x
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: y,
        type: "bar"
      }
    ]
  }
  myChart.setOption(option)
}
onMounted(() => {
  nextTick(() => {
    myChart = echarts.init(document.getElementById("main"))
    getUserCount()
  })
})
const formInline = reactive({
  year: dayjs().format("YYYY")
})

function getUserCount() {
  userCount({ year: formInline.year }).then((res) => {
    setOpts(res.xnameList, res.countList)
  })
}
</script>

<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="年份">
          <el-date-picker v-model="formInline.year" type="year" clearable format="YYYY" value-format="YYYY" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserCount">
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <div class="w-full flex justify-center">
        <div id="main" style="height: 600px;width:1400px;" />
      </div>
    </el-card>
  </div>
</template>
