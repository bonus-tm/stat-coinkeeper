<template>
  <h2>Анализ доходов и расходов</h2>
  <div class="analyze">
    <div>
      <div class="categories-list">
        <ck-category
          v-for="(income, i) of incomes"
          :key="`inc-${i}`"
          :category="income"
        />
      </div>
      <div class="categories-list">
        <ck-category
          v-for="(expense, i) of expenses"
          :key="`inc-${i}`"
          :category="expense"
        />
      </div>
    </div>

    <div>
      <div v-for="(heap, i) of heaps" :key="`dz-acc-${i}`">
        <drop-zone v-model="heaps[i]" />
      </div>
    </div>

    <line-chart ref="chartRef" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import {CategoryScale, Chart, Filler, LinearScale, LineController, LineElement, PointElement, Tooltip} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {LineChart} from 'vue-chart-3'
import {createMonthAxis, sumByMonths} from '../services/calculator'
import {palette, readonly, state} from '../services/store'
import {humanize} from '../services/numerals'
import CkCategory from './CkCategory.vue'
import DropZone from './DropZone.vue'

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, ChartDataLabels)

// const months = [
//   'январь',
//   'февраль',
//   'март',
//   'апрель',
//   'май',
//   'июнь',
//   'июль',
//   'август',
//   'сентябрь',
//   'октябрь',
//   'ноябрь',
//   'декабрь',
// ]
const months = [
  'янв',
  'фев',
  'март',
  'апр',
  'май',
  'июнь',
  'июль',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
]

export default {
  name: 'AnalyzeIncomesVsExpenses',
  components: {DropZone, CkCategory, LineChart},
  setup () {
    let incomes = computed(() => readonly.incomes)
    let expenses = computed(() => readonly.expenses)
    let heaps = computed(() => state.heaps.allIncomesVsExpenses)

    let chartOptions = {
      responsive: true,
      aspectRatio: 3,
      plugins: [
        Filler,
      //   {
      //     beforeInit (chart) {
      //       console.log('beforeInit', chart.data.labels)
      //       chart.data.labels.forEach((e, i, a) => {
      //         console.log(e)
      //         if (/\n/.test(e)) {
      //           a[i] = e.split(/\n/)
      //         }
      //       })
      //     },
      //     beforeUpdate (chart) {
      //       console.log('beforeUpdate', chart.data.labels)
      //       chart.data.labels.forEach((e, i, a) => {
      //         console.log('beforeUpdate', e)
      //         if (/\n/.test(e)) {
      //           a[i] = e.split(/\n/)
      //         }
      //       })
      //     },
      //   }
      ],
      elements: {
        line: {
          tension: 0.2,
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
            // callback (value, index, ticks) {
            //   console.log(value, this.getLabelForValue(value))
            //   return value
            // }
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
      datasets: heaps.value.map((heap, i) => {
        let categoryTitles = heap.categories.map(cat => cat.title)
        let data = sumByMonths(categoryTitles, readonly.operations)
        console.log(data)
        return {
          label: heap.title,
          data: monthAxis.map(ym => Math.abs(data[ym])),
          borderColor: heap.color.bg,
          // backgroundColor: 'rgba(250,50,20,0.5)',
          fill: {
            target: 'origin',
            below: 'rgba(250,50,20,0.5)',
          },
          datalabels: {
            color: heap.color.bg,
            backgroundColor: 'var(--bg-color)',
            borderRadius: 3,
            padding: {top: 1, bottom: 0, left: 3, right: 3},
            align: 'end',
            font: {
              size: 11,
              weight: 'bold'
            },
            formatter(value){
              return humanize(value)
            }
          }
        }
      }),
    }))

    let chartRef = ref()

    return {
      chartRef,
      palette,
      incomes,
      expenses,
      heaps,
      chartOptions,
      chartData,
    }
  },
}
</script>
