<script setup>
import {computed, onBeforeMount, ref} from 'vue'
import {formatDistanceToNow} from 'date-fns'
import {ru} from 'date-fns/locale'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

import store from '@/services/store'
import Currencies from '@/services/currencies'

import AnalyzeAccounts from '@/components/AnalyzeAccounts.vue'
import AnalyzeExpenses from '@/components/AnalyzeExpenses.vue'
import AnalyzeIncomes from '@/components/AnalyzeIncomes.vue'
import AnalyzeIncomesVsExpenses from '@/components/AnalyzeIncomesVsExpenses.vue'
import UploadFile from '@/components/UploadFile.vue'

const MultiStringAxisLabels = {
  id: 'labels-split',
  beforeInit (chart) {
    // console.log('beforeInit', chart)
    chart.data.xLabels?.forEach((value, i, labels) => {
      if (/\n/.test(value)) {
        labels[i] = value.split(/\n/)
      }
    })
  },
}

Chart.register(
  Legend,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ChartDataLabels,
  BarController,
  BarElement,
  MultiStringAxisLabels,
)

let appInitialized = ref(false)

let dataExportedAgo = computed(() => {
  if (!store.readonly.timestamp) return ''
  return formatDistanceToNow(
    new Date(store.readonly.timestamp),
    {addSuffix: true, locale: ru}
  )
})

let currenciesLoaded = ref(false)

onBeforeMount(async () => {
  await store.init()
  await Currencies.init('RUB', ['USD', 'EUR'])
  currenciesLoaded.value = Currencies.loaded
  appInitialized.value = true
})

const {hasData} = store

const clearData = async () => {
  await store.clearReadonly()
}

const reset = () => {
  return confirm(
    'Удалить всю инфу и настройки?\n' +
    'Будут удалены все данные, кучи и их настройки цвета, названия прочее.'
  )
}

const onDataImport = async allData => {
  console.log(allData)
  try {
    await store.setReadonly(allData)
  } catch (error) {
    alert(
      'Какая-то ошибка при импорте данных.\n' +
      'Надо копаться в консоли и разбираться.\n' +
      'store.setReadonly failed'
    )
    console.log('store.setReadonly failed', {error})
  }
}
</script>

<template>
  <header>
    <div>
      <div v-if="hasData">
        Данные экспортированы
        {{ dataExportedAgo }}
      </div>
    </div>
    <h1>Статистика из Coin Keeper</h1>
    <div>
      <button v-if="hasData" @click="clearData">
        Очистить только данные
      </button>
      &nbsp;
      <button v-if="hasData" @click="reset">
        Удалить всё
      </button>
    </div>
  </header>

  <main>
    <template v-if="appInitialized">
      <UploadFile v-if="!hasData" @import="onDataImport" />

      <template v-if="hasData">
        <AnalyzeIncomesVsExpenses />
        <AnalyzeIncomes />
        <AnalyzeExpenses />
        <AnalyzeAccounts />
      </template>
    </template>
  </main>

  <footer>
    <p>
      Все данные хранятся только в браузере и никуда не передаются.
      Сайт только загружается с сервера и больше с ним не взаимодействует.
    </p>
  </footer>
</template>
