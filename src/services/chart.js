import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {humanize} from '@/services/numerals'
import {colors} from '@/services/store'

export const initChart = () => {
  const MultiStringAxisLabels = {
    id: 'labels-split',
    beforeInit (chart) {
      // console.log('beforeInit', chart)
      chart.data.xLabels?.forEach((value, i, labels) => {
        if (/\n/.test(value)) {
          labels[i] = value.split(/\n/)
        }
      })
    },
  }

  Chart.register(
    Legend,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    ChartDataLabels,
    BarController,
    BarElement,
    MultiStringAxisLabels,
  )
}

// const {borderColor, gridColor: color, tickColor} = toRefs(colors)

export const defaultChartOptions = {
  responsive: true,
  aspectRatio: 3,
  layout: {
    padding: {
      right: 20,
    },
  },
  elements: {
    line: {
      tension: 0.2,
      fill: true,
    }
  },
  scales: {},
}
export const defaultScaleX = {
  id: 'x-axis',
  type: 'category',
  grid: {
    // borderDash: [1, 3],
    color: colors.value.gridColor,
    borderColor: colors.value.borderColor,
    tickColor: colors.value.tickColor,
    tickLength: 5,
  },
  ticks: {
    maxRotation: 0,
    padding: 5,
    autoSkip: false,
  },
}
export const defaultScaleY = {
  type: 'linear',
  grid: {
    // borderDash: [1, 2],
    color: colors.value.gridColor,
    borderColor: colors.value.borderColor,
    tickColor: colors.value.tickColor,
  },
  ticks: {
    callback (value) {
      return humanize(value)
    },
  },
  afterFit (axis) {
    axis.width = 50
  },
}
