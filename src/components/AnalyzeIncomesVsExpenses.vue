<template>
  <h2>Анализ доходов и расходов</h2>

  <div class="analyze">
    <div>
      <div v-for="(heap, i) of heaps" :key="`h-in-ex-${i}`">
        <HeapOfCoins v-model="heaps[i]" changeable-color />
      </div>
    </div>

    <div>
      <LineChart
        ref="chartRef"
        :chart-data="chartData"
        :options="chartOptions"
      />
      <BarChart
        ref="barChartRef"
        :chart-data="barChartData"
        :options="barChartOptions"
      />
    </div>
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import {BarChart, LineChart} from 'vue-chart-3'
import {sumByMonths} from '../services/calculator'
import {palette, readonly, state} from '../services/store'
import {hex2rgba, humanize} from '../services/numerals'
import Coin from './Coin.vue'
import HeapOfCoins from './HeapOfCoins.vue'
import {getDataLabelBg} from '../services/canvas-colors'
import {createMonthsAxis, monthsAxisLabels} from '../services/dates'

export default {
  name: 'AnalyzeIncomesVsExpenses',
  components: {HeapOfCoins, Coin, LineChart, BarChart},
  setup () {
    let heaps = computed(() => state.heaps.allIncomesVsExpenses)

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
      },
    }
    let monthAxis = createMonthsAxis(
      readonly.operations[0].date.date,
      readonly.operations[readonly.operations.length - 1].date.date
    )
    console.log({monthAxis})

    let chartData = computed(() => ({
      xLabels: monthsAxisLabels(monthAxis),
      datasets: heaps.value.map(heap => {
        let coinTitles = heap.coins.map(cat => cat.title)
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
    console.log('income vs expenses chartData', chartData)

    let barChartOptions = {
      responsive: true,
      aspectRatio: 7,
      layout: {
        padding: {
          right: 20,
        },
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
            // drawTicks: false,
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
      },
      plugins: {
        legend: {
          display: false,
        }
      }
    }

    let coinTitles = [
      ...readonly.incomes.map(cat => cat.title),
      ...readonly.expenses.map(cat => cat.title),
    ]
    let balanceData = sumByMonths(coinTitles, readonly.operations)
    console.log({balanceData})

    let barChartData = computed(() => ({
      xLabels: monthsAxisLabels(monthAxis),
      datasets: [
        {
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
            backgroundColor: getDataLabelBg(),
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
            backgroundColor: getDataLabelBg(),
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
    }))

    let chartRef = ref()
    let barChartRef = ref()

    return {
      chartRef,
      palette,
      heaps,
      chartOptions,
      chartData,
      barChartRef,
      barChartOptions,
      barChartData,
    }
  },
}
</script>
