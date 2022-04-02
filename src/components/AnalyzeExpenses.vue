<script setup>
import {computed, ref} from 'vue'
import {LineChart} from 'vue-chart-3'
import {ckData, heaps, lastOperationDate} from '@/services/store'
import {sumByMonths} from '@/services/calculator'
import {getDataLabelBg} from '@/services/canvas-colors'
import {hex2rgba, humanize} from '@/services/numerals'
import {createMonthsAxis, monthsAxisLabels} from '@/services/dates'

import HeapOfCoins from '@/components/HeapOfCoins.vue'
import Icon from '@/components/Icon.vue'
import SlidePanel from '@/components/SlidePanel.vue'

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
      afterFit (axis) {
        axis.width = 50
      },
    }
  }
}
let monthAxis = createMonthsAxis(
  ckData.operations[0].date.date,
  lastOperationDate.value
)

let chartData = computed(() => ({
  xLabels: monthsAxisLabels(monthAxis),
  datasets: heaps.expenses.map(heap => {
    let coinTitles = heap.coins.map(coin => coin.title)
    let data = sumByMonths(coinTitles, ckData.operations)
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

let chartRef = ref()

let addHeap = () => {
  heaps.expenses.push({
    type: 'operations',
    title: 'Куча',
    color: {},
    coins: [],
  })
}
let removeHeap = index => {
  heaps.expenses.splice(index, 1)
}

let show = ref(false)
</script>

<template>
  <SlidePanel v-model:show="show" :title="'Расходы'" operations>
    <div v-for="(heap, i) of heaps.expenses" :key="`h-ex-${i}`">
      <HeapOfCoins
        v-model="heaps.expenses[i]"
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
      Анализ расходов
    </h2>
    <LineChart
      ref="chartRef"
      :chart-data="chartData"
      :options="chartOptions"
    />
  </section>
</template>
