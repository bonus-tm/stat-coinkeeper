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

  <upload-file v-if="appState === states.noData" @import="onDataImport" />

  <template v-if="appState === states.dataRead">
    <AnalyzeIncomesVsExpenses />
    <analyze-accounts />
  </template>
</template>

<script>
import {formatDistanceToNow} from 'date-fns'
import {ru} from 'date-fns/locale'
import UploadFile from './components/UploadFile.vue'
import AnalyzeAccounts from './components/AnalyzeAccounts.vue'
import AnalyzeIncomesVsExpenses from './components/AnalyzeIncomesVsExpenses.vue'
import {clearReadonly, initReadonly, readonly} from './services/store'
import {sumByMonths} from './services/calculator'

export default {
  name: 'App',
  components: {AnalyzeIncomesVsExpenses, AnalyzeAccounts, UploadFile},
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

      let tosh = sumByMonths(['Айпеченье'], readonly.operations)
      console.log(tosh)

      let byt = sumByMonths(['Бытовуха'], readonly.operations)
      console.log(byt)

      let ta = sumByMonths(['Украшения'], readonly.operations)
      let ta2 = sumByMonths(['Украшения', 'Материалы'], readonly.operations)
      console.log(ta, ta2)

      /*
      let accs = {}
      for (let acc of readonly.accounts) {
        accs[acc.title] = calcAccountInitialValue(acc, readonly.operations)
      }
      console.log(accs)
      */
    },
  }
}
</script>
