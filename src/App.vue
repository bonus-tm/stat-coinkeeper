<template>
  <div>
    <button v-if="appState !== states.noData" @click="clearData">
      Очистить только данные
    </button>
    <button v-if="appState !== states.noData" @click="reset">
      Удалить всё
    </button>
  </div>
  <div v-if="appState === states.dataRead">
    Данные экспортированы
    {{ dataDate }}
  </div>

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
</template>

<script>
import {formatDistanceToNow} from 'date-fns'
import {ru} from 'date-fns/locale'
import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {sumByMonths} from './services/calculator'
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
      return confirm('Удалить всю инфу и настройки?')
    },
    onDataImport (allData) {
      console.log(allData)
      initReadonly(allData)
      this.appState = this.states.dataRead
    },
  }
}
</script>
