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
      <div v-for="(heap, i) of heapsIncomes" :key="`dz-acc-${i}`">
        <drop-zone :heap="heap" :title-bg="palette[i]">
          <template v-slot:title>
            {{ heap.title }}
          </template>
        </drop-zone>
      </div>
    </div>

    <line-chart
      ref="chartRef"
      :data="chartIncomesData"
      :options="chartIncomesOptions"
    />
  </div>
</template>

<script>
import {computed, ref, toRaw} from 'vue'
import {Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip} from 'chart.js'
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
  name: 'AnalyzeIncomes',
  components: {DropZone, CkCategory, LineChart},
  setup () {
    let incomes = computed(() => readonly.incomes)
    let expenses = computed(() => readonly.expenses)
    let heapsIncomes = computed(() => {
      return state.heaps.filter(heap => heap.type === 'operations')
    })

    let chartIncomesOptions = {
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
          stacked: true,
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

    // let datasets = computed(() => {
    //   return heapsIncomes.value.map((heap, i) => {
    //     let data = sumByMonths(toRaw(heap.categories), readonly.operations)
    //     console.log({heap, data})
    //     return {
    //       label: heap.title,
    //       data: monthAxis.map(ym => data[ym]),
    //       borderColor: palette[i],
    //       // backgroundColor: 'rgba(250,50,20,0.5)',
    //     }
    //   })
    // })
    // let data = sumByMonths(['Украшения', 'Материалы'], readonly.operations)
    // let data2 = sumByMonths(['Айпеченье', 'Кхмер'], readonly.operations)
    // for (let key of Object.keys(data)) {
    //   if (data[key] < 0) {
    //     data2[key] += data[key]
    //     data[key] = 0
    //   }
    // }

    let chartIncomesData = computed(() => ({
      xLabels: monthAxis.map((ym, i) => {
        let [y, m] = ym.split('-')
        return m === '0' || i === 0 ? `${months[m]} ${y}` : months[m]
      }),
      datasets: state.heaps.filter(heap => heap.type === 'operations')
        .map((heap, i) => {
          let categoryTitles = heap.categories.map(cat => cat.title)
          let data = sumByMonths(categoryTitles, readonly.operations)
          console.log({categoryTitles, data})
          return {
            label: heap.title,
            data: monthAxis.map(ym => data[ym]),
            borderColor: palette[i],
            // backgroundColor: 'rgba(250,50,20,0.5)',
          }
        }),
    }))

    let chartRef = ref()
    return {
      chartRef,
      palette,
      incomes,
      expenses,
      heapsIncomes,
      chartIncomesOptions,
      chartIncomesData,
    }
  }
}
</script>
