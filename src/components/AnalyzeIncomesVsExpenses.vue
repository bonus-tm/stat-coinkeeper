<script setup>
import {ref} from 'vue'
import {LineChart} from 'vue-chart-3'

import {defaultChartOptions, defaultScaleX} from '@/services/chart'
import {createMonthsAxis} from '@/services/dates'
import {colors} from '@/services/colors'
import {humanize} from '@/services/numerals'
import {incomeVsExpensesMonthly} from '@/services/prep-chart-data'
import {ckData, heaps, lastOperationDate} from '@/services/store'

import HeapOfCoins from '@/components/HeapOfCoins.vue'
import SlidePanel from '@/components/SlidePanel.vue'
import Icon from '@/components/Icon.vue'

const scaleY = {
  type: 'linear',
  position: 'left',
  stack: 'incomes-vs-expenses',
  grid: {
    color (context) {
      return context.tick.value === 0
        ? colors.value.chartBorderColor
        : colors.value.chartGridColor
    },
    borderColor: colors.value.chartBorderColor,
    tickColor: colors.value.chartTickColor,
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
}

let chartOptions = {
  ...defaultChartOptions,
  aspectRatio: 2,
  scales: {
    x: defaultScaleX,
    // scale for balance
    yBalance: {
      ...scaleY,
      stacked: 'single',
      stackWeight: 1,
    },
    // scale for incomes vs expenses
    yIE: {
      ...scaleY,
      stackWeight: 3,
      min: 0,
    },
  },
}

let monthAxis = createMonthsAxis(
  ckData.operations[0].date.date,
  lastOperationDate.value
)
console.log({monthAxis})

let chartData = incomeVsExpensesMonthly(monthAxis, heaps.allIncomesVsExpenses)
console.log('income vs expenses chartData', chartData)

let chartRef = ref()

let show = ref(false)
</script>

<template>
  <SlidePanel v-model:show="show" :title="'Расходы и доходы'" operations>
    <div v-for="(heap, i) of heaps.allIncomesVsExpenses" :key="`h-in-ex-${i}`">
      <HeapOfCoins v-model="heaps.allIncomesVsExpenses[i]" changeable-color />
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
