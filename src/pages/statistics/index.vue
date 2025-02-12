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
function setOpts(data) {
  const option: ECOption = {
    color: ["#fe9739", "#F56C6C"],
    tooltip: {
      trigger: "item"
    },
    legend: {
      top: "5%",
      left: "center"
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data
      }
    ]
  }
  myChart.setOption(option)
}
onMounted(() => {
  nextTick(() => {
    myChart = echarts.init(document.getElementById("main"))
  })
})
const formInline = reactive({
  company: "",
  endDate: "",
  startDate: "",
  date: ""
})
const tableData1 = ref([])
const tableData2 = ref([])

function getUserCount() {
  console.log(formInline)
  const params = {
    company: formInline.company,
    endDate: formInline.date[1],
    startDate: formInline.date[0]
  }
  userCount(params).then((res) => {
    console.log(res)
    const data = res.list?.map((item) => {
      return { ...item, value: item.count }
    })
    tableData1.value = res.list1
    tableData2.value = res.list2

    setOpts(data)
  })
}
</script>

<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="所属公司">
          <el-input v-model="formInline.company" placeholder="输入所属公司" clearable style="width: 240px" />
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            v-model="formInline.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserCount">
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <div class="w-full flex justify-center">
        <div id="main" style="height: 400px;width:600px;" />
      </div>
    </el-card>
    <section class="flex">
      <div class="min-w-600px  flex-1 mr-30px">
        <h2 class="pt-20px">
          该期间离职人员
        </h2>
        <el-card>
          <el-table :data="tableData2" height="400">
            <el-table-column prop="userName" label="用户名" width="120" />
            <el-table-column prop="phonenumber" label="手机号" width="140" />
            <el-table-column prop="leaveDate" label="离职时间" width="140" />
            <el-table-column prop="company" label="所属公司" />
          </el-table>
        </el-card>
      </div>
      <div class="min-w-600px flex-1">
        <h2 class="pt-20px">
          该期间入职人员
        </h2>
        <el-card>
          <el-table :data="tableData1" height="400">
            <el-table-column prop="userName" label="用户名" width="120" />
            <el-table-column prop="phonenumber" label="手机号" width="140" />
            <el-table-column prop="employmentDate" label="入职时间" width="140" />
            <!-- <el-table-column prop="disabledCard" label="残疾人证" width="220" /> -->
            <el-table-column prop="company" label="所属公司" />
          </el-table>
        </el-card>
      </div>
    </section>
  </div>
</template>
