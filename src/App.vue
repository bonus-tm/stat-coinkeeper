<template>
  <header>
    <div>
      <div v-if="appState === states.dataRead">
        Данные экспортированы
        {{ dataDate }}
      </div>
    </div>
    <h1>Статистика из Coin Keeper</h1>
    <div>
      <button v-if="appState !== states.noData" @click="clearData">
        Очистить только данные
      </button>
      &nbsp;
      <button v-if="appState !== states.noData" @click="reset">
        Удалить всё
      </button>
    </div>
  </header>

  <main>
    <UploadFile v-if="appState === states.noData" @import="onDataImport" />

    <template v-if="appState === states.dataRead">
      <div class="section">
        <CoinsOperations />

        <div>
          <AnalyzeIncomesVsExpenses />
          <AnalyzeIncomes />
          <AnalyzeExpenses />
        </div>
      </div>

      <div class="section">
        <CoinsAccounts />

        <div>
          <AnalyzeAccounts />
        </div>
      </div>
    </template>
  </main>

  <footer>
    <p>
      Все данные хранятся только в браузере и никуда не передаются.
      Сайт только загружается с сервера и больше с ним не взаимодействует.
    </p>
  </footer>
</template>

<script>
import {formatDistanceToNow} from 'date-fns'
import {ru} from 'date-fns/locale'
import {
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
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {clearReadonly, initReadonly, readonly} from './services/store'
import AnalyzeAccounts from './components/AnalyzeAccounts.vue'
import AnalyzeExpenses from './components/AnalyzeExpenses.vue'
import AnalyzeIncomes from './components/AnalyzeIncomes.vue'
import AnalyzeIncomesVsExpenses from './components/AnalyzeIncomesVsExpenses.vue'
import CoinsAccounts from './components/CoinsAccounts.vue'
import CoinsOperations from './components/CoinsOperations.vue'
import UploadFile from './components/UploadFile.vue'

const pl = {
  id: 'labels-split',
  beforeInit (chart) {
    console.log('beforeInit', chart)
    chart.data.xLabels.forEach((value, i, labels) => {
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
  pl
)

export default {
  name: 'App',
  components: {
    AnalyzeAccounts,
    AnalyzeExpenses,
    AnalyzeIncomes,
    AnalyzeIncomesVsExpenses,
    CoinsAccounts,
    CoinsOperations,
    UploadFile
  },
  data () {
    let states = {
      noData: 0,
      fileDropped: 1,
      dataRead: 2
    }
    return {
      states,
      appState: states.noData,
    }
  },
  computed: {
    dataDate () {
      if (!readonly.timestamp) return ''
      return formatDistanceToNow(
        new Date(readonly.timestamp),
        {addSuffix: true, locale: ru}
      )
    },
  },
  methods: {
    clearData () {
      this.appState = this.states.noData
      clearReadonly()
    },
    reset () {
      return confirm(
        'Удалить всю инфу и настройки?\n' +
        'Будут удалены все данные, кучи и их настройки цвета, названия прочее.'
      )
    },
    onDataImport (allData) {
      console.log(allData)
      initReadonly(allData)
      this.appState = this.states.dataRead
    },
  }
}
</script>
