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
import {CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, Tooltip} from 'chart.js'
import {LineChart} from 'vue-chart-3'
import {createMonthAxis, sumByMonths} from '../services/calculator'
import {palette, readonly, state} from '../services/store'
import CkCategory from './CkCategory.vue'
import DropZone from './DropZone.vue'

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

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
      elements: {
        line: {
          tension: 0.2
        }
      },
      scales: {
        x: {
          id: 'x-axis',
          type: 'category',
          grid: {
            borderDash: [1, 3],
            color: 'rgba(128,128,128,0.5)',
            zeroLineColor: 'rgba(128,128,128,0.5)',
            tickMarkLength: 5,
          },
          ticks: {
            maxRotation: 0,
            padding: 5,
            autoSkip: false,
          }
        },
        y: {
          type: 'linear',
          ticks: {
            beginAtZero: true,
          },
          grid: {
            borderDash: [1, 2],
            color: 'rgba(128,128,128,0.2)',
            zeroLineColor: 'rgba(128,128,128,0.5)',
          },
        }
      }
    }
    let monthAxis = createMonthAxis(readonly.operations)

    let chartData = computed(() => ({
      xLabels: monthAxis.map((ym, i) => {
        let [y, m] = ym.split('-')
        return m === '0' || i === 0 ? `${months[m]} ${y}` : months[m]
      }),
      datasets: heaps.value.map((heap, i) => {
        let categoryTitles = heap.categories.map(cat => cat.title)
        let data = sumByMonths(categoryTitles, readonly.operations)
        console.log(data)
        return {
          label: heap.title,
          data: monthAxis.map(ym => Math.abs(data[ym])),
          borderColor: heap.color.bg,
          backgroundColor: 'rgba(250,50,20,0.5)',
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
