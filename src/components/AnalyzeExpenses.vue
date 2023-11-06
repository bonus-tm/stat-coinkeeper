<script setup>
import {computed, ref} from 'vue'
import {Line} from 'vue-chartjs'

import {sumPeriods} from '@/services/calculator'
import {createAxis, defaultChartOptions, defaultScaleX, defaultScaleY} from '@/services/chart'
import {changeOpacity, colors, palette} from '@/services/colors'
import {humanize} from '@/services/numerals'
import {appSettings, ckData, heaps, lastOperationDate} from '@/services/store'

import HeapOfCoins from '@/components/HeapOfCoins.vue'
import Icon from '@/components/Icon.vue'
import HeapsConfig from '@/components/HeapsConfig.vue'

let chartOptions = {
  ...defaultChartOptions,
  scales: {
    x: defaultScaleX,
    y: {...defaultScaleY, min: 0},
  },
}
let {axis, axisLabels} = createAxis({
  startDate: ckData.operations[0].date.date,
  endDate: lastOperationDate.value,
  step: appSettings.timeStep,
  wholeYear: appSettings.roundToWholeYear,
})

let chartData = computed(() => ({
  labels: axisLabels,
  datasets: [
    {type: 'bar', label: '', backgroundColor: 'transparent'},
    // ↑ это чтобы точки выравнивались посередине между линиями сетки
    ...heaps.expenses.map(heap => {
      let data = sumPeriods(appSettings.timeStep, heap.coins, ckData.operations)
      return {
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
}))

let chartRef = ref()

let addHeap = () => {
  heaps.expenses.push({
    type: 'operations',
    title: 'Куча',
    color: 'gray',
    coins: [],
  })
}
let removeHeap = index => {
  heaps.expenses.splice(index, 1)
}

let show = ref(false)
</script>

<template>
  <HeapsConfig v-model:show="show" :title="'Расходы'" operations>
    <div v-for="(heap, i) of heaps.expenses" :key="`h-ex-${i}`">
      <HeapOfCoins
        v-model="heaps.expenses[i]"
        editable
        @remove="removeHeap(i)"
      />
    </div>
    <button class="btn" @click="addHeap">
      Добавить кучу
    </button>
  </HeapsConfig>

  <section>
    <h2>
      <button class="btn btn-icon" @click="show = true">
        <Icon icon="gear" />
      </button>
      Анализ расходов
    </h2>
    <div class="line-container">
      <Line
        ref="chartRef"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </section>
</template>
