import {computed} from 'vue'
import {monthsAxisLabels} from './dates.js'
import {sumByMonths} from './calculator.js'
import store from './store.js'
import {hex2rgba, humanize} from './numerals.js'
import {getDataLabelBg} from './canvas-colors.js'

export const incomeVsExpensesMonthly = (monthAxis, heaps) => {
  let incomesVsExpensesDataset = heaps.value.map(heap => {
      let coinTitles = heap.coins.map(cat => cat.title)
      let data = sumByMonths(coinTitles, store.readonly.operations)
      return {
        yAxisID: 'yIE',
        label: heap.title,
        data: monthAxis.map(ym => Math.abs(data[ym])),
        borderColor: heap.color.border,
        backgroundColor: hex2rgba(heap.color.border, 0.2),
        datalabels: {
          display: 'auto',
          color: heap.color.border,
          backgroundColor: getDataLabelBg(),
          borderRadius: 3,
          padding: {top: 1, bottom: 0, left: 3, right: 3},
          align: 'end',
          font: {
            size: 11,
            weight: 'bold'
          },
          formatter (value) {
            return humanize(value)
          }
        }
      }
    })

  let coinTitles = [
    ...store.readonly.incomes.map(cat => cat.title),
    ...store.readonly.expenses.map(cat => cat.title),
  ]
  let balanceData = sumByMonths(coinTitles, store.readonly.operations)
  console.log({balanceData})
  let balanceDataset = [
    {
      type: 'bar',
      yAxisID: 'yBalance',
      label: 'Доход',
      data: monthAxis.map(ym => balanceData[ym] >= 0 ? balanceData[ym] : 0),
      grouped: false,
      borderColor: '#34c759',
      backgroundColor: hex2rgba('#34c759', 0.2),
      datalabels: {
        display (context) {
          return context.dataset.data[context.dataIndex] !== 0
        },
        color: '#34c759',
        borderRadius: 3,
        padding: {top: 1, bottom: 0, left: 3, right: 3},
        anchor: 'start',
        align: 'start',
        font: {
          size: 11,
          weight: 'bold'
        },
        formatter (value) {
          return humanize(value)
        }
      }
    },
    {
      type: 'bar',
      yAxisID: 'yBalance',
      label: 'Убыток',
      data: monthAxis.map(ym => balanceData[ym] < 0 ? balanceData[ym] : 0),
      grouped: false,
      borderColor: '#ff3b30',
      backgroundColor: hex2rgba('#ff3b30', 0.2),
      datalabels: {
        display (context) {
          return context.dataset.data[context.dataIndex] !== 0
        },
        color: '#ff3b30',
        borderRadius: 3,
        padding: {top: 1, bottom: 0, left: 3, right: 3},
        anchor: 'end',
        align: 'end',
        font: {
          size: 11,
          weight: 'bold'
        },
        formatter (value) {
          return humanize(value)
        }
      }
    },
  ]

  return computed(() => ({
    xLabels: monthsAxisLabels(monthAxis),
    datasets: [...incomesVsExpensesDataset, ...balanceDataset]
  }))
}
