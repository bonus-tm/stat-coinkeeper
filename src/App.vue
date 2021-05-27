<template>
  <button v-if="appState !== states.noData" @click="reset">Reset</button>

  <upload-file v-if="appState === states.noData" @load="onDataLoaded" />

  <app-categories
    v-if="appState === states.dataRead"
    :incomes="incomes"
    :accounts="accounts"
    :expenses="expenses"
  />
</template>

<script>
import UploadFile from './components/UploadFile.vue'
import AppCategories from './components/AppCategories.vue'
import {initReadonly} from './services/store'

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
      incomes: [],
      accounts: [],
      expenses: [],
    }
  },
  methods: {
    reset () {
      this.appState = this.states.noData
      this.incomes = []
      this.accounts = []
      this.expenses = []
    },
    onDataLoaded (allData) {
      initReadonly(allData)
      this.incomes = allData.incomes
      this.accounts = allData.accounts
      this.expenses = allData.expenses
      this.appState = this.states.dataRead
    },
  }
}
</script>
