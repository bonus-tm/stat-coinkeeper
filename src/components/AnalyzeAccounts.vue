<template>
  <h2>Анализ наличности</h2>

  <div class="analyze">
    <div>
      <div v-for="(heap, i) of heapsAccount" :key="`h-ex-${i}`">
        <HeapOfCoins
          v-model="heapsAccount[i]"
          editable
          movable
          @moveUp="moveHeapUp(i)"
          @moveDown="moveHeapDown(i)"
          @remove="removeHeap(i)"
        />
      </div>
      <button @click="addHeap">
        Добавить кучу
      </button>
    </div>

    <div>
      <BarChart
        ref="chartRef"
        :chart-data="chartData"
        :options="chartOptions"
      />
      <ChartPie :data="pieChartData" />
    </div>
  </div>
</template>

<script>
import {computed, ref, toRaw} from 'vue'
import {BarChart} from 'vue-chart-3'
import store from '../services/store'
import Currencies from '../services/currencies'
import ChartPie from './ChartPie.vue'
import Coin from './Coin.vue'
import CoinsAccounts from './CoinsAccounts.vue'
import HeapOfCoins from './HeapOfCoins.vue'
import {hex2rgba, humanize} from '../services/numerals'
import {accountHistoryByMonths} from '../services/calculator'
import {createMonthsAxis, monthsAxisLabels} from '../services/dates'

export default {
  name: 'AnalyzeAccounts',
  components: {ChartPie, Coin, CoinsAccounts, HeapOfCoins, BarChart},
  setup () {
    let heapsAccount = computed(() => store.state.heaps.accounts)

    let pieChartData = computed(() => {
      return heapsAccount.value.map(heap => ({
        title: heap.title,
        color: heap.color.border,
        value: heap.coins.reduce((acc, coin) => {
          let rate = coin.currency === store.state.baseCurrency
            ? 1
            : Currencies.rate(coin.currency)
          acc += coin.value / rate
          return acc
        }, 0)
      }))
    })

    let chartOptions = {
      responsive: true,
      aspectRatio: 3,
      layout: {
        padding: {
          right: 20,
        },
      },
      elements: {
        bar: {},
      },
      scales: {
        x: {
          id: 'x-axis',
          type: 'category',
          grid: {
            borderDash: [1, 3],
            color: 'rgba(128,128,128,0.4)',
            borderColor: 'rgba(128,128,128,0.5)',
            tickColor: 'rgba(128,128,128,0.5)',
            tickLength: 5,
          },
          ticks: {
            maxRotation: 0,
            padding: 5,
            autoSkip: false,
          }
        },
        y: {
          stacked: true,
          type: 'linear',
          min: 0,
          grid: {
            borderDash: [1, 2],
            color: 'rgba(128,128,128,0.2)',
            borderColor: 'rgba(128,128,128,0.5)',
            tickColor: 'rgba(128,128,128,0.5)',
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
      }
    }
    let monthAxis = createMonthsAxis(
      store.readonly.operations[0].date.date,
      store.readonly.operations[store.readonly.operations.length - 1].date.date
    )

    let totals = {}
    for (let heap of heapsAccount.value) {
      for (let account of heap.coins) {
        let history = accountHistoryByMonths(account, store.readonly.operations)
        if (account.currency !== store.state.baseCurrency) {
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
    let totalsNull = monthAxis.map(() => null)
    let totalsData = monthAxis.map(ym => totals[ym])

    let chartData = computed(() => ({
      xLabels: monthsAxisLabels(monthAxis),
      datasets: heapsAccount.value.map(heap => {
        // посчитать для каждого кошелька в куче историю по месяцам
        // получим массив объектов
        let histories = heap.coins.map(account => {
          let history = accountHistoryByMonths(account, store.readonly.operations)
          if (account.currency !== store.state.baseCurrency) {
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
          data: monthAxis.map(ym => {
            return histories.reduce((sum, history) => {
              sum += history[ym]
              return sum
            }, 0)
          }),
          grouped: false,
          borderColor: heap.color.border,
          backgroundColor: hex2rgba(heap.color?.border, 0.3),
          datalabels: {
            display (context) {
              // Определить минимальное значение, в которое по высоте влезет лейбл
              let threshold = context.chart.scales.y.max / context.chart.scales.y.maxHeight * (dataLabelFontSize + 4)
              return context.dataset.data[context.dataIndex] > threshold
            },
            color: heap.color?.border,
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
                  weight: 'bold'
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
                  weight: 'normal'
                },
                formatter (value, context) {
                  return `${Math.round(100 * value / totalsData[context.dataIndex])}%`
                },
              }
            },
          }
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
            weight: 'bold'
          },
          formatter (value, context) {
            return humanize(totalsData[context.dataIndex])
          }
        }
      }]),
    }))

    let chartRef = ref()

    let addHeap = () => {
      store.state.heaps.accounts.push({
        type: 'accounts',
        title: 'Куча',
        color: {},
        coins: [],
      })
    }
    let moveHeapUp = index => {
      if (index > 0) {
        let [heap] = store.state.heaps.accounts.splice(index, 1)
        store.state.heaps.accounts.splice(index - 1, 0, toRaw(heap))
      }
    }
    let moveHeapDown = index => {
      if (index < store.state.heaps.accounts.length - 1) {
        let [heap] = store.state.heaps.accounts.splice(index, 1)
        store.state.heaps.accounts.splice(index + 1, 0, toRaw(heap))
      }
    }
    let removeHeap = index => {
      store.state.heaps.accounts.splice(index, 1)
    }

    return {
      heapsAccount,
      pieChartData,
      chartRef,
      chartOptions,
      chartData,
      addHeap,
      moveHeapUp,
      moveHeapDown,
      removeHeap,
    }
  }
}
</script>
