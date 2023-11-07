<script setup>
import {computed, ref} from 'vue'
import {Line} from 'vue-chartjs'

import {createAxis, defaultChartOptions, defaultScaleX} from '@/services/chart'
import {changeOpacity, colors, palette} from '@/services/colors'
import {humanize} from '@/services/numerals'
import {appSettings, ckData, heaps, lastOperationDate} from '@/services/store'
import {sumPeriods} from '@/services/calculator'

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

const chartRef = ref()
const chartOptions = {
  ...defaultChartOptions,
  aspectRatio: 4,
  scales: {
    x: defaultScaleX,
    // scale for balance
    yBalance: {
      ...scaleY,
      stacked: 'single',
      stackWeight: 1,
    },
    // scale for incomes vs expenses
    IvE: {
      ...scaleY,
      stackWeight: 3,
      min: 0,
    },
  },
}
const chartData = computed(() => {
  let {axis, axisLabels} = createAxis({
    startDate: ckData.operations[0].date.date,
    endDate: lastOperationDate.value,
    step: appSettings.timeStep,
    wholeYear: appSettings.roundToWholeYear,
  })

  let coins = [...ckData.incomes, ...ckData.expenses]
  let balanceData = sumPeriods(appSettings.timeStep, coins, ckData.operations)
  console.log({balanceData})

  return {
    labels: axisLabels,
    datasets: [
      {
        type: 'bar',
        yAxisID: 'yBalance',
        label: 'Доход',
        data: axis.map(ym => balanceData[ym] >= 0 ? balanceData[ym] : 0),
        grouped: false,
        borderColor: palette.value.green,
        backgroundColor: changeOpacity(palette.value.green, 0.2),
        datalabels: {
          display (context) {
            return context.dataset.data[context.dataIndex] !== 0
          },
          color: palette.value.green,
          borderRadius: 3,
          padding: {top: 1, bottom: 0, left: 3, right: 3},
          anchor: 'start',
          align: 'start',
          font: {
            size: 11,
            weight: 'bold',
          },
          formatter (value) {
            return humanize(value)
          },
        },
      },
      {
        type: 'bar',
        yAxisID: 'yBalance',
        label: 'Убыток',
        data: axis.map(ym => balanceData[ym] < 0 ? balanceData[ym] : 0),
        grouped: false,
        borderColor: palette.value.red,
        backgroundColor: changeOpacity(palette.value.red, 0.2),
        datalabels: {
          display (context) {
            return context.dataset.data[context.dataIndex] !== 0
          },
          color: palette.value.red,
          borderRadius: 3,
          padding: {top: 1, bottom: 0, left: 3, right: 3},
          anchor: 'end',
          align: 'end',
          font: {
            size: 11,
            weight: 'bold',
          },
          formatter (value) {
            return humanize(value)
          },
        },
      },
      ...heaps.allIncomesVsExpenses.map(heap => {
        let data = sumPeriods(appSettings.timeStep, heap.coins, ckData.operations)
        return {
          yAxisID: 'IvE',
          label: heap.title,
          data: axis.map(ym => Math.abs(data[ym])),
          borderColor: palette.value[heap.color],
          backgroundColor: changeOpacity(heap.color, 0.2),
          datalabels: {
            display: 'auto',
            color: palette.value[heap.color],
            backgroundColor: colors.value.chartLabelBgColor,
            borderRadius: 3,
            padding: {top: 1, bottom: 0, left: 3, right: 3},
            align: 'end',
            font: {
              size: 11,
              weight: 'bold',
            },
            formatter (value) {
              return humanize(value)
            },
          },
        }
      }),
    ],
  }
})

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
    <div class="line-bar-container">
      <Line
        ref="chartRef"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </section>
</template>
