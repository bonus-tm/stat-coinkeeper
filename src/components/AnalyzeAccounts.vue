<template>
  <h2>Анализ наличности</h2>

  <div class="analyze">
    <div>
      <div v-for="(heap, i) of heapsAccount" :key="`h-ex-${i}`">
        <HeapOfCoins
          v-model="heapsAccount[i]"
          editable
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
import {computed, ref} from 'vue'
import {BarChart} from 'vue-chart-3'
import {months, readonly, state} from '../services/store'
import ChartPie from './ChartPie.vue'
import Coin from './Coin.vue'
import CoinsAccounts from './CoinsAccounts.vue'
import HeapOfCoins from './HeapOfCoins.vue'
import {hex2rgba, humanize} from '../services/numerals'
import {accountHistoryByMonths, createMonthAxis} from '../services/calculator'
import {getDataLabelBg} from '../services/canvas-colors'
import {key} from 'localforage'

export default {
  name: 'AnalyzeAccounts',
  components: {ChartPie, Coin, CoinsAccounts, HeapOfCoins, BarChart},
  setup () {
    let heapsAccount = computed(() => state.heaps.accounts)

    let pieChartData = computed(() => {
      return heapsAccount.value.map(heap => ({
        title: heap.title,
        color: heap.color.border,
        value: heap.coins.reduce((acc, coin) => {
          acc += coin.value * state.currencyRates[coin.currency]
          return acc
        }, 0)
      }))
    })

    let chartOptions = {
      responsive: true,
      aspectRatio: 3,
      elements: {},
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
        }
      }
    }
    let monthAxis = createMonthAxis(readonly.operations)
    let chartData = computed(() => ({
      xLabels: monthAxis.map((ym, i) => {
        let [y, m] = ym.split('-')
        return m === '0' || i === 0 ? `${months[m]}\n${y}` : months[m]
      }),
      datasets: heapsAccount.value.map(heap => {
        // посчитать для каждого кошелька в куче историю по месяцам
        // получим массив объектов
        let histories = heap.coins.map(account => {
          return accountHistoryByMonths(account, readonly.operations)
        })

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
          backgroundColor: hex2rgba(heap.color.border, 0.2),
          datalabels: {
            display: false,
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
      }),
    }))

    let chartRef = ref()

    let addHeap = () => {
      state.heaps.accounts.push({
        type: 'accounts',
        title: 'Куча',
        color: {},
        coins: [],
      })
    }
    let removeHeap = index => {
      state.heaps.accounts.splice(index, 1)
    }

    return {
      heapsAccount,
      pieChartData,
      chartRef,
      chartOptions,
      chartData,
      addHeap,
      removeHeap,
    }
  }
}
</script>

<style>
</style>
