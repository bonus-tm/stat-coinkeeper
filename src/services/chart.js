import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {colors} from '@/services/colors'
import {MONTHS_LABELS_RUS, QUARTER_LABELS} from '@/constants'
import {date2m, date2q, date2y, pad} from '@/services/dates'
import {humanize} from '@/services/numerals'

export const initChart = () => {
  const MultiStringAxisLabels = {
    id: 'labels-split',
    beforeLayout (chart) {
      // console.log('beforeLayout', chart)
      chart.data.labels?.forEach((value, i, labels) => {
        if (/\n/.test(value)) {
          labels[i] = value.split(/\n/)
        }
      })
    },
  }

  ChartJS.register(
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

export const defaultChartOptions = {
  responsive: true,
  aspectRatio: 5,
  layout: {
    padding: {
      right: 20,
    },
  },
  elements: {
    line: {
      tension: 0.2,
      fill: true,
    },
  },
  scales: {},
}
export const defaultScaleX = {
  id: 'x-axis',
  type: 'category',
  grid: {
    // color: colors.value.chartGridColor,
    color (context) {
      let label = ''
      if (Array.isArray(context.tick?.label)) {
        label = context.tick.label[0]
      }
      let isJanuary = label.toLocaleLowerCase().startsWith('я')
      let isFirstQuarter = label === QUARTER_LABELS['1']
      return isJanuary || isFirstQuarter
        ? colors.value.chartBorderColor
        : colors.value.chartGridColor
    },
    border: {
      z: -9,
      color: colors.value.chartBorderColor,
      // dash: [1, 3],
    },
    tickColor (context) {
      let label = ''
      if (Array.isArray(context.tick?.label)) {
        label = context.tick.label[0]
      }
      let isJanuary = label.toLocaleLowerCase().startsWith('я')
      let isFirstQuarter = label === QUARTER_LABELS['1']
      return isJanuary || isFirstQuarter
        ? colors.value.chartBorderColor
        : colors.value.chartGridColor
    },
    tickLength: 5,
    z: -10,
  },
  ticks: {
    maxRotation: 0,
    padding: 5,
    autoSkip: false,
    z: -5,
  },
}
export const defaultScaleY = {
  type: 'linear',
  grid: {
    color: colors.value.chartGridColor,
    tickColor: colors.value.chartTickColor,
    border: {
      color: colors.value.chartBorderColor,
      // dash: [1, 2],
    },
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

/**
 *
 * @param startDate {Date}
 * @param endDate {Date}
 * @param step {'month'|'quarter'|'year'} шаг графика
 * @param wholeYear {boolean} дополнять ли пустыми месяцами до целого года
 * @return {{axisLabels: string[], axis: string[]}}
 */
export const createAxis = ({startDate, endDate, step, wholeYear}) => {
  let axis = []
  let axisLabels = []

  switch (step) {
    case 'month':
      axis = createMonthsAxis(startDate, endDate, wholeYear)
      axisLabels = createMonthsAxisLabels(axis)
      break
    case 'quarter':
      axis = createQuarterAxis(startDate, endDate, wholeYear)
      axisLabels = createQuarterAxisLabels(axis)
      break
    case 'year':
      axis = createYearAxis(startDate, endDate)
      axisLabels = createYearAxisLabels(axis)
  }
  return {axis, axisLabels}
}

/**
 * Ось по месяцам
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {boolean} wholeYear дополнять ли пустыми месяцами до целого года
 * @return {string[]}
 */
const createMonthsAxis = (startDate, endDate, wholeYear) => {
  let firstYear = date2y(startDate, true)
  let firstMonth = wholeYear ? 1 : date2m(startDate, true)
  let lastYear = date2y(endDate, true)
  let lastMonth = wholeYear ? 12 : date2m(endDate, true)

  let months = []
  for (let y = firstYear; y <= lastYear; y++) {
    let startMonth = y === firstYear ? firstMonth : 1
    let endMonth = y === lastYear ? lastMonth : 12
    for (let m = startMonth; m <= endMonth; m++) {
      months.push(`${y}-${pad(m)}`)
    }
  }
  return months
}

/**
 * Ось по кварталам
 * @param startDate
 * @param endDate
 * @param {boolean} wholeYear дополнять ли пустыми кварталами до целого года
 */
const createQuarterAxis = (startDate, endDate, wholeYear) => {
  let firstYear = date2y(startDate, true)
  let firstQuarter = wholeYear ? 1 : date2q(startDate, true)
  let lastYear = date2y(endDate, true)
  let lastQuarter = wholeYear ? 4 : date2q(endDate, true)

  let quarters = []
  for (let y = firstYear; y <= lastYear; y++) {
    let startQuarter = y === firstYear ? firstQuarter : 1
    let endQuarter = y === lastYear ? lastQuarter : 4
    for (let q = startQuarter; q <= endQuarter; q++) {
      quarters.push(`${y}-${q}`)
    }
  }
  return quarters
}

/**
 * Ось по годам
 * @param startDate
 * @param endDate
 * @return {string[]}
 */
const createYearAxis = (startDate, endDate) => {
  let firstYear = date2y(startDate, true)
  let lastYear = date2y(endDate, true)

  let years = []
  for (let y = firstYear; y <= lastYear; y++) {
    years.push(y.toString())
  }
  return years
}

/**
 * Подписи оси по месяцам
 * @param {string[]} axis
 * @param {Object} monthsLabels
 * @return {string[]}
 */
const createMonthsAxisLabels = (axis, monthsLabels = MONTHS_LABELS_RUS) => {
  return axis.map((ym, i) => {
    let [y, m] = ym.split('-')
    return m === '01' || i === 0 ? `${monthsLabels[m]}\n${y}` : monthsLabels[m]
  })
}

/**
 * Подписи оси по кварталам
 * @param {string[]} axis
 * @param {Object} quarterLabels
 * @return {string[]}
 */
const createQuarterAxisLabels = (axis, quarterLabels = QUARTER_LABELS) => {
  return axis.map((yq, i) => {
    let [y, q] = yq.split('-')
    return q === '1' || i === 0 ? `${quarterLabels[q]}\n${y}` : quarterLabels[q]
  })
}

/**
 * Подписи оси по годам
 * @param {string[]} axis
 * @return {string[]}
 */
const createYearAxisLabels = (axis) => {
  return axis
}
