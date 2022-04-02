<script setup>
import {computed, ref} from 'vue'
import {LineChart} from 'vue-chart-3'

import {sumByMonths} from '@/services/calculator'
import {defaultChartOptions, defaultScaleX, defaultScaleY} from '@/services/chart'
import {createMonthsAxis, monthsAxisLabels} from '@/services/dates'
import {hex2rgba, humanize} from '@/services/numerals'
import {ckData, colors, heaps, lastOperationDate} from '@/services/store'

import HeapOfCoins from '@/components/HeapOfCoins.vue'
import Icon from '@/components/Icon.vue'
import SlidePanel from '@/components/SlidePanel.vue'

let chartOptions = {
  ...defaultChartOptions,
  scales: {
    x: defaultScaleX,
    y: defaultScaleY,
  },
}
let monthAxis = createMonthsAxis(
  ckData.operations[0].date.date,
  lastOperationDate.value
)

let chartData = computed(() => ({
  xLabels: monthsAxisLabels(monthAxis),
  datasets: [
    {type: 'bar'}, // чтобы точки выравнивались посередине между линиями сетки
    ...heaps.incomes.map(heap => {
      let coinTitles = heap.coins.map(coin => coin.title)
      let data = sumByMonths(coinTitles, ckData.operations)
      return {
        label: heap.title,
        data: monthAxis.map(ym => data[ym]),
        borderColor: heap.color.border,
        backgroundColor: hex2rgba(heap.color.border, 0.2),
        datalabels: {
          display: 'auto',
          color: heap.color.border,
          backgroundColor: colors.value.labelBgColor,
          borderRadius: 3,
          padding: {top: 1, bottom: 0, left: 3, right: 3},
          align: 'end',
          font: {
            size: 11,
            weight: 'bold'
          },
          formatter (value) {
            return humanize(value)
          },
        },
      }
    }),
  ]
}))

let chartRef = ref()

let addHeap = () => {
  heaps.incomes.push({
    type: 'operations',
    title: 'Куча',
    color: {},
    coins: [],
  })
}
let removeHeap = index => {
  console.log('removeHeap', index)
  heaps.incomes.splice(index, 1)
}

let show = ref(false)
</script>

<template>
  <SlidePanel v-model:show="show" :title="'Доходы'" operations>
    <div v-for="(heap, i) of heaps.incomes" :key="`h-in-${i}`">
      <HeapOfCoins
        v-model="heaps.incomes[i]"
        editable
        @remove="removeHeap(i)"
      />
    </div>
    <button @click="addHeap">
      Добавить кучу
    </button>
  </SlidePanel>

  <section>
    <h2>
      <button class="btn-icon">
        <Icon icon="gear" @click="show = true" />
      </button>
      Анализ доходов
    </h2>
    <LineChart
      ref="chartRef"
      :chart-data="chartData"
      :options="chartOptions"
    />
  </section>
</template>
