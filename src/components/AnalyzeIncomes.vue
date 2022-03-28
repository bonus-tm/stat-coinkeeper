<template>
  <SlidePanel v-model:show="show" :title="'Доходы'" operations>
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
  </SlidePanel>

  <section>
    <h2>
      <button class="btn-icon">
        <Icon icon="gear" @click="show = true" />
      </button>
      Анализ доходов
    </h2>
    <LineChart
      ref="chartRef"
      :chart-data="chartData"
      :options="chartOptions"
    />
  </section>
</template>

<script>
import {computed, ref} from 'vue'
import {LineChart} from 'vue-chart-3'
import {sumByMonths} from '../services/calculator'
import store from '../services/store'
import Coin from './Coin.vue'
import HeapOfCoins from './HeapOfCoins.vue'
import Icon from './Icon.vue'
import SlidePanel from './SlidePanel.vue'
import {hex2rgba, humanize} from '../services/numerals'
import {getDataLabelBg} from '../services/canvas-colors'
import {createMonthsAxis, monthsAxisLabels} from '../services/dates'

export default {
  name: 'AnalyzeIncomes',
  components: {Icon, SlidePanel, HeapOfCoins, Coin, LineChart},
  setup () {
    let heapsIncomes = computed(() => store.state.heaps.incomes)

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
          // min: -24000,
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

    let chartData = computed(() => ({
      xLabels: monthsAxisLabels(monthAxis),
      datasets: heapsIncomes.value.map(heap => {
        let coinTitles = heap.coins.map(coin => coin.title)
        let data = sumByMonths(coinTitles, store.readonly.operations)
        return {
          label: heap.title,
          data: monthAxis.map(ym => data[ym]),
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
      store.state.heaps.incomes.push({
        type: 'operations',
        title: 'Куча',
        color: {},
        coins: [],
      })
    }
    let removeHeap = index => {
      console.log('removeHeap', index)
      store.state.heaps.incomes.splice(index, 1)
    }

    let show = ref(false)
    return {
      show,
      chartRef,
      heapsIncomes,
      chartOptions,
      chartData,
      addHeap,
      removeHeap,
    }
  },
}
</script>
