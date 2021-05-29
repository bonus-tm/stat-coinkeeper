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

  <app-categories v-if="appState === states.dataRead" />
</template>

<script>
import {formatDistanceToNow} from 'date-fns'
import {ru} from 'date-fns/locale'
import UploadFile from './components/UploadFile.vue'
import AppCategories from './components/AppCategories.vue'
import {clearReadonly, initReadonly, readonly} from './services/store'

export default {
  name: 'App',
  components: {AppCategories, UploadFile},
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
