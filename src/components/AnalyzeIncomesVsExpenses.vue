<template>
  <SlidePanel v-model:show="show" :title="'Расходы и доходы'" operations>
    <div v-for="(heap, i) of heaps" :key="`h-in-ex-${i}`">
      <HeapOfCoins v-model="heaps[i]" changeable-color />
    </div>
  </SlidePanel>

  <section>
    <h2>
      <button class="btn-icon">
        <Icon icon="gear" @click="show = true" />
      </button>
      Анализ доходов и расходов
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
import {BarChart, LineChart} from 'vue-chart-3'
import store from '../services/store'
import {humanize} from '../services/numerals'
import Coin from './Coin.vue'
import HeapOfCoins from './HeapOfCoins.vue'
import {createMonthsAxis} from '../services/dates'
import {incomeVsExpensesMonthly} from '../services/prep-chart-data.js'
import SlidePanel from './SlidePanel.vue'
import Icon from './Icon.vue'

export default {
  name: 'AnalyzeIncomesVsExpenses',
  components: {Icon, SlidePanel, HeapOfCoins, Coin, LineChart, BarChart},
  setup () {
    let heaps = computed(() => store.state.heaps.allIncomesVsExpenses)

    let chartOptions = {
      responsive: true,
      aspectRatio: 2,
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
        // scale for balance
        yBalance: {
          type: 'linear',
          stacked: 'single',
          position: 'left',
          stack: 'incomes-vs-expenses',
          stackWeight: 1,
          grid: {
            color (context) {
              return context.tick.value === 0
                ? 'rgba(128,128,128,0.5)'
                : 'rgba(128,128,128,0.1)'
            },
            borderColor: 'rgba(128,128,128,0.5)',
            tickColor: 'rgba(128,128,128,0.5)',
          },
          ticks: {
            // stepSize: 200000,
            callback (value) {
              return humanize(value)
            },
          },
          afterFit (axis) {
            axis.width = 50
          },
        },
        // scale for incomes vs expenses
        yIE: {
          type: 'linear',
          position: 'left',
          stack: 'incomes-vs-expenses',
          stackWeight: 3,
          min: 0,
          grid: {
            color (context) {
              return context.tick.value === 0
                ? 'rgba(128,128,128,0.5)'
                : 'rgba(128,128,128,0.1)'
            },
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
        },
      },
    }
    let monthAxis = createMonthsAxis(
      store.readonly.operations[0].date.date,
      store.readonly.operations[store.readonly.operations.length - 1].date.date
    )
    console.log({monthAxis})

    let chartData = incomeVsExpensesMonthly(monthAxis, heaps)
    console.log('income vs expenses chartData', chartData)

    let chartRef = ref()

    let show = ref(false)
    return {
      show,
      chartRef,
      heaps,
      chartOptions,
      chartData,
    }
  },
}
</script>
