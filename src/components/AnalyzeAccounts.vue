<script setup>
import {computed, ref, toRaw} from 'vue'
import {BarChart} from 'vue-chart-3'

import {accountHistoryByMonths} from '@/services/calculator'
import {createAxis, defaultChartOptions, defaultScaleX, defaultScaleY} from '@/services/chart'
import Currencies from '@/services/currencies'
import {changeOpacity, palette} from '@/services/colors'
import {humanize} from '@/services/numerals'
import {ckData, heaps, lastOperationDate} from '@/services/store'

import ChartPie from '@/components/ChartPie.vue'
import HeapOfCoins from '@/components/HeapOfCoins.vue'
import Icon from '@/components/Icon.vue'
import HeapsConfig from '@/components/HeapsConfig.vue'

let pieChartData = computed(() => {
  return heaps.accounts.map(heap => ({
    title: heap.title,
    color: palette.value[heap.color],
    value: heap.coins.reduce((acc, coin) => {
      let rate = coin.currency === Currencies.baseCurrency
        ? 1
        : Currencies.rate(coin.currency)
      acc += coin.value / rate
      return acc
    }, 0),
  }))
})

let chartOptions = {
  ...defaultChartOptions,
  elements: {
    bar: {},
  },
  scales: {
    x: defaultScaleX,
    y: {...defaultScaleY, min: 0, stacked: true},
  },
}
let {axis, axisLabels} = createAxis(
  ckData.operations[0].date.date,
  lastOperationDate.value,
)

let totals = {}
for (let heap of heaps.accounts) {
  for (let account of heap.coins) {
    let history = accountHistoryByMonths(account, ckData.operations)
    if (account.currency !== Currencies.baseCurrency) {
      for (let [ym, value] of Object.entries(history)) {
        let rate = Currencies.rate(account.currency, ym)
        history[ym] = Math.round(value / rate)
      }
    }
    for (let [ym, value] of Object.entries(history)) {
      totals[ym] ??= 0
      totals[ym] += value
    }
  }
}
console.log({totals})
let totalsNull = axis.map(() => null)
let totalsData = axis.map(ym => totals[ym])

let chartData = computed(() => ({
  xLabels: axisLabels,
  datasets: heaps.accounts.map(heap => {
    // посчитать для каждого кошелька в куче историю по месяцам
    // получим массив объектов
    let histories = heap.coins.map(account => {
      let history = accountHistoryByMonths(account, ckData.operations)
      if (account.currency !== Currencies.baseCurrency) {
        for (let [ym, value] of Object.entries(history)) {
          let rate = Currencies.rate(account.currency, ym)
          history[ym] = Math.round(value / rate)
        }
      }
      // console.log('histories', account, history)
      return history
    })

    let dataLabelFontSize = 11
    return {
      label: heap.title,
      // дальше надо их одинаковые поля просуммировать
      data: axis.map(ym => {
        return histories.reduce((sum, history) => {
          sum += history[ym]
          return sum
        }, 0)
      }),
      grouped: false,
      borderColor: palette.value[heap.color],
      backgroundColor: changeOpacity(heap.color, 0.3),
      datalabels: {
        display (context) {
          // Определить минимальное значение, в которое по высоте влезет лейбл
          let threshold = context.chart.scales.y.max / context.chart.scales.y.maxHeight * (dataLabelFontSize + 4)
          return context.dataset.data[context.dataIndex] > threshold
        },
        color: palette.value[heap.color],
        // backgroundColor: getDataLabelBg(),
        // borderRadius: 3,
        // padding: {top: 1, bottom: 0, left: 3, right: 3},
        anchor: 'center',
        labels: {
          value: {
            align: 'end',
            offset: -5,
            font: {
              size: dataLabelFontSize,
              weight: 'bold',
            },
            formatter (value, context) {
              return humanize(value)
            },
          },
          percent: {
            align: 'start',
            offset: -4,
            font: {
              size: 9,
              weight: 'normal',
            },
            formatter (value, context) {
              return `${Math.round(100 * value / totalsData[context.dataIndex])}%`
            },
          },
        },
      },
    }
  }).concat([{
    label: '',
    data: totalsNull,
    grouped: false,
    skipNulls: true,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    datalabels: {
      display: true,
      color: '#777',
      backgroundColor: 'transparent',
      borderRadius: 3,
      padding: {top: 1, bottom: 0, left: 3, right: 3},
      anchor: 'end',
      align: 'end',
      offset (context) {
        return context.chart.chartArea.height - 15
      },
      font: {
        size: 10,
        weight: 'bold',
      },
      formatter (value, context) {
        return humanize(totalsData[context.dataIndex])
      },
    },
  }]),
}))

let chartRef = ref()

let addHeap = () => {
  heaps.accounts.push({
    type: 'accounts',
    title: 'Куча',
    color: 'gray',
    coins: [],
  })
}
let moveHeapUp = index => {
  if (index > 0) {
    let [heap] = heaps.accounts.splice(index, 1)
    heaps.accounts.splice(index - 1, 0, toRaw(heap))
  }
}
let moveHeapDown = index => {
  if (index < heaps.accounts.length - 1) {
    let [heap] = heaps.accounts.splice(index, 1)
    heaps.accounts.splice(index + 1, 0, toRaw(heap))
  }
}
let removeHeap = index => {
  heaps.accounts.splice(index, 1)
}

let show = ref(false)
</script>

<template>
  <HeapsConfig v-model:show="show" :title="'Наличность'" accounts>
    <div v-for="(heap, i) of heaps.accounts" :key="`h-ex-${i}`">
      <HeapOfCoins
        v-model="heaps.accounts[i]"
        editable
        movable
        @moveUp="moveHeapUp(i)"
        @moveDown="moveHeapDown(i)"
        @remove="removeHeap(i)"
      />
    </div>
    <button class="btn" @click="addHeap">
      Добавить кучу
    </button>
  </HeapsConfig>

  <section>
    <h2>
      <button class="btn btn-icon" @click="show = true">
        <Icon icon="gear" />
      </button>
      Анализ наличности
    </h2>

    <div>
      <BarChart
        ref="chartRef"
        :chart-data="chartData"
        :options="chartOptions"
      />
      <ChartPie :data="pieChartData" />
    </div>
  </section>
</template>
