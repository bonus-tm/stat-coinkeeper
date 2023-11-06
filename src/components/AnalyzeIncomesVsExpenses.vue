<script setup>
import {ref} from 'vue'
import {LineChart} from 'vue-chart-3'

import {createAxis, defaultChartOptions, defaultScaleX} from '@/services/chart'
import {colors} from '@/services/colors'
import {humanize} from '@/services/numerals'
import {incomeVsExpensesMonthly} from '@/services/prep-chart-data'
import {ckData, heaps, lastOperationDate} from '@/services/store'

import HeapOfCoins from '@/components/HeapOfCoins.vue'
import HeapsConfig from '@/components/HeapsConfig.vue'
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

let {axis, axisLabels} = createAxis(
  ckData.operations[0].date.date,
  lastOperationDate.value,
)
console.log({monthAxis: axis})

let chartData = incomeVsExpensesMonthly(axis, axisLabels, heaps.allIncomesVsExpenses)
console.log('income vs expenses chartData', chartData)

let chartRef = ref()

let show = ref(false)
</script>

<template>
  <HeapsConfig v-model:show="show" operations title="Расходы и доходы">
    <div v-for="(heap, i) of heaps.allIncomesVsExpenses" :key="`h-in-ex-${i}`">
      <HeapOfCoins v-model="heaps.allIncomesVsExpenses[i]" changeable-color />
    </div>
  </HeapsConfig>

  <section>
    <h2>
      <button class="btn btn-icon" @click="show = true">
        <Icon icon="gear" />
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
