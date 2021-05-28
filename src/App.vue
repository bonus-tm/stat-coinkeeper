<template>
  <button v-if="appState !== states.noData" @click="reset">Reset</button>

  <upload-file v-if="appState === states.noData" @load="onDataLoaded" />

  <app-categories v-if="appState === states.dataRead" />
</template>

<script>
import UploadFile from './components/UploadFile.vue'
import AppCategories from './components/AppCategories.vue'
import {initReadonly, clearReadonly} from './services/store'

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
  methods: {
    reset () {
      this.appState = this.states.noData
      clearReadonly()
    },
    onDataLoaded (allData) {
      initReadonly(allData)
      this.appState = this.states.dataRead
    },
  }
}
</script>
