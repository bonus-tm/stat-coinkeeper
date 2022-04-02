import {computed} from 'vue'
import {monthsAxisLabels} from '@/services/dates'
import {sumByMonths} from '@/services/calculator'
import {hex2rgba, humanize} from '@/services/numerals'
import {ckData, colors} from '@/services/store'

export const incomeVsExpensesMonthly = (monthAxis, heaps) => {
  let coinTitles = [
    ...ckData.incomes.map(cat => cat.title),
    ...ckData.expenses.map(cat => cat.title),
  ]
  let balanceData = sumByMonths(coinTitles, ckData.operations)
  console.log({balanceData})

  return computed(() => ({
    xLabels: monthsAxisLabels(monthAxis),
    datasets: [
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
      ...heaps.map(heap => {
        let coinTitles = heap.coins.map(cat => cat.title)
        let data = sumByMonths(coinTitles, ckData.operations)
        return {
          yAxisID: 'yIE',
          label: heap.title,
          data: monthAxis.map(ym => Math.abs(data[ym])),
          borderColor: heap.color.border,
          backgroundColor: hex2rgba(heap.color.border, 0.2),
          datalabels: {
            display: 'auto',
            color: heap.color.border,
            backgroundColor: colors.value.labelBgColor,
            borderRadius: 3,
            padding: {top: 1, bottom: 0, left: 3, right: 3},
            align: 'end',
            font: {
              size: 11,
              weight: 'bold'
            },
            formatter (value) {
              return humanize(value)
            },
          },
        }
      }),
    ]
  }))
}
