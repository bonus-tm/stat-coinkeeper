import {computed} from 'vue'
import {sumPeriods} from '@/services/calculator'
import {changeOpacity, colors, palette} from '@/services/colors'
import {humanize} from '@/services/numerals'
import {ckData, timescale} from '@/services/store'

export const incomeVsExpensesMonthly = (axis, axisLabels, heaps) => {
  let coins = [...ckData.incomes, ...ckData.expenses]
  let balanceData = sumPeriods(timescale.value, coins, ckData.operations)
  console.log({balanceData})

  return computed(() => ({
    xLabels: axisLabels,
    datasets: [
      {
        type: 'bar',
        yAxisID: 'yBalance',
        label: 'Доход',
        data: axis.map(ym => balanceData[ym] >= 0 ? balanceData[ym] : 0),
        grouped: false,
        borderColor: palette.value.green,
        backgroundColor: changeOpacity(palette.value.green, 0.2),
        datalabels: {
          display (context) {
            return context.dataset.data[context.dataIndex] !== 0
          },
          color: palette.value.green,
          borderRadius: 3,
          padding: {top: 1, bottom: 0, left: 3, right: 3},
          anchor: 'start',
          align: 'start',
          font: {
            size: 11,
            weight: 'bold',
          },
          formatter (value) {
            return humanize(value)
          },
        },
      },
      {
        type: 'bar',
        yAxisID: 'yBalance',
        label: 'Убыток',
        data: axis.map(ym => balanceData[ym] < 0 ? balanceData[ym] : 0),
        grouped: false,
        borderColor: palette.value.red,
        backgroundColor: changeOpacity(palette.value.red, 0.2),
        datalabels: {
          display (context) {
            return context.dataset.data[context.dataIndex] !== 0
          },
          color: palette.value.red,
          borderRadius: 3,
          padding: {top: 1, bottom: 0, left: 3, right: 3},
          anchor: 'end',
          align: 'end',
          font: {
            size: 11,
            weight: 'bold',
          },
          formatter (value) {
            return humanize(value)
          },
        },
      },
      ...heaps.map(heap => {
        let data = sumPeriods(timescale.value, heap.coins, ckData.operations)
        return {
          yAxisID: 'yIE',
          label: heap.title,
          data: axis.map(ym => Math.abs(data[ym])),
          borderColor: palette.value[heap.color],
          backgroundColor: changeOpacity(heap.color, 0.2),
          datalabels: {
            display: 'auto',
            color: palette.value[heap.color],
            backgroundColor: colors.value.chartLabelBgColor,
            borderRadius: 3,
            padding: {top: 1, bottom: 0, left: 3, right: 3},
            align: 'end',
            font: {
              size: 11,
              weight: 'bold',
            },
            formatter (value) {
              return humanize(value)
            },
          },
        }
      }),
    ],
  }))
}
