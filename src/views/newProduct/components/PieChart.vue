<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions({ questionData, choiceData } = {}) {
      this.chart.setOption({
        title: {
          text: `问题名称：${questionData}`,
          x: 'left',
          left: '20%',
          textStyle: {
            color: 'black'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            name: 'Answer Statistics',
            type: 'pie',
            radius: ['30%', '70%'],
            label: {
              formatter: "{b} \n\n {c} ({d}%)",
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '18',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              length: 35,
              length2: 25
            },
            data: choiceData
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
