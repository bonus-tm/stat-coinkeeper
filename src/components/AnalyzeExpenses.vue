<template>
  <h2>Анализ расходов</h2>

  <div class="analyze">
    <div>
      <div v-for="(heap, i) of heapsExpenses" :key="`h-ex-${i}`">
        <HeapOfCoins
          v-model="heapsExpenses[i]"
          editable
          @remove="removeHeap(i)"
        />
      </div>
      <button @click="addHeap">
        Добавить кучу
      </button>
    </div>

    <LineChart
      ref="chartRef"
      :chart-data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import {LineChart} from 'vue-chart-3'
import {createMonthAxis, sumByMonths} from '../services/calculator'
import {palette, months, readonly, state} from '../services/store'
import Coin from './Coin.vue'
import HeapOfCoins from './HeapOfCoins.vue'
import {hex2rgba, humanize} from '../services/numerals'
import {getDataLabelBg} from '../services/canvas-colors'
import {createMonthsAxis, monthsAxisLabels} from '../services/dates'

export default {
  name: 'AnalyzeExpenses',
  components: {HeapOfCoins, Coin, LineChart},
  setup () {
    let heapsExpenses = computed(() => state.heaps.expenses)

    let chartOptions = {
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
          afterFit(axis) {
            axis.width = 50
          },
        }
      }
    }
    let monthAxis = createMonthsAxis(
      readonly.operations[0].date.date,
      readonly.operations[readonly.operations.length - 1].date.date
    )

    let chartData = computed(() => ({
      xLabels: monthsAxisLabels(monthAxis),
      datasets: heapsExpenses.value.map(heap => {
        let coinTitles = heap.coins.map(coin => coin.title)
        let data = sumByMonths(coinTitles, readonly.operations)
        return {
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
      }),
    }))

    let chartRef = ref()

    let addHeap = () => {
      state.heaps.expenses.push({
        type: 'operations',
        title: 'Куча',
        color: {},
        coins: [],
      })
    }
    let removeHeap = index => {
      state.heaps.expenses.splice(index, 1)
    }

    return {
      chartRef,
      palette,
      heapsExpenses,
      chartOptions,
      chartData,
      addHeap,
      removeHeap,
    }
  },
}
</script>
