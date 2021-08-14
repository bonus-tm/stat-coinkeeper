<template>
  <h2>Анализ доходов</h2>

  <div class="analyze">
    <div>
      <div v-for="(heap, i) of heapsIncomes" :key="`h-in-${i}`">
        <HeapOfCoins
          v-model="heapsIncomes[i]"
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
      :data="chartData"
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

export default {
  name: 'AnalyzeIncomes',
  components: {HeapOfCoins, Coin, LineChart},
  setup () {
    let heapsIncomes = computed(() => state.heaps.incomes)

    let chartOptions = {
      responsive: true,
      aspectRatio: 3,
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
        }
      }
    }
    let monthAxis = createMonthAxis(readonly.operations)

    let chartData = computed(() => ({
      xLabels: monthAxis.map((ym, i) => {
        let [y, m] = ym.split('-')
        return m === '0' || i === 0 ? `${months[m]}\n${y}` : months[m]
      }),
      datasets: heapsIncomes.value.map(heap => {
        let coinTitles = heap.coins.map(coin => coin.title)
        let data = sumByMonths(coinTitles, readonly.operations)
        return {
          label: heap.title,
          data: monthAxis.map(ym => Math.abs(data[ym])),
          borderColor: heap.color.border,
          backgroundColor: hex2rgba(heap.color.border, 0.2),
          datalabels: {
            color: heap.color.border,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
      state.heaps.incomes.push({
        type: 'operations',
        title: 'Куча',
        color: {},
        coins: [],
      })
    }
    let removeHeap = index => {
      console.log('removeHeap', index)
      state.heaps.incomes.splice(index, 1)
    }

    return {
      chartRef,
      palette,
      heapsIncomes,
      chartOptions,
      chartData,
      addHeap,
      removeHeap,
    }
  },
}
</script>