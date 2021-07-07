<template>
  <h2>Анализ доходов и расходов</h2>

  <div class="analyze">
    <div>
      <div v-for="(heap, i) of heapsIncome" :key="`dz-acc-${i}`">
        <HeapOfCoins v-model="heapsIncome[i]" @remove="removeHeap(i)" />
      </div>
      <button @click="addHeap">
        Добавить кучу
      </button>

      <h3>Кучи расходов</h3>
      <div v-for="(heap, i) of heapsExpense" :key="`dz-acc-${i}`">
        <HeapOfCoins v-model="heapsExpense[i]" @remove="removeHeap(i)" />
      </div>
      <button @click="addHeap">
        Добавить кучу
      </button>
    </div>

    <LineChart
      ref="chartRef"
      :data="chartIncomesData"
      :options="chartIncomesOptions"
    />
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import {LineChart} from 'vue-chart-3'
import {createMonthAxis, sumByMonths} from '../services/calculator'
import {palette, readonly, state} from '../services/store'
import Coin from './Coin.vue'
import HeapOfCoins from './HeapOfCoins.vue'

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
  name: 'AnalyzeExpenses',
  components: {HeapOfCoins, Coin, LineChart},
  setup () {
    let incomes = computed(() => readonly.incomes)
    let expenses = computed(() => readonly.expenses)
    let heaps = computed(() => state.heaps.allIncomesVsExpenses)

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

    let chartIncomesData = computed(() => ({
      xLabels: monthAxis.map((ym, i) => {
        let [y, m] = ym.split('-')
        return m === '0' || i === 0 ? `${months[m]} ${y}` : months[m]
      }),
      datasets: heaps.value.map((heap, i) => {
        let coinTitles = heap.coins.map(coin => coin.title)
        let data = sumByMonths(coinTitles, readonly.operations)
        console.log({coinTitles, data})
        return {
          label: heap.title,
          data: monthAxis.map(ym => data[ym]),
          borderColor: heap.titleBg,
          backgroundColor: 'rgba(250,50,20,0.5)',
        }
      }),
    }))

    let chartRef = ref()

    let addHeap = () => {
      state.heaps.push({
        type: 'operations',
        title: 'Куча',
        coins: [],
      })
    }
    let removeHeap = index => {
      console.log('removeHeap', index)
      state.heaps.splice(index, 1)
    }

    return {
      chartRef,
      palette,
      incomes,
      expenses,
      heaps,
      chartIncomesOptions,
      chartIncomesData,
      addHeap,
      removeHeap,
    }
  },
}
</script>
