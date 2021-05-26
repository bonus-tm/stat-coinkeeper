<template>
  <button v-if="currentState !== states.noData" @click="reset">Reset</button>

  <upload-file v-if="currentState === states.noData" @load="onDataLoaded" />

  <app-categories
    v-if="currentState === states.dataRead"
    :incomes="incomes"
    :accounts="accounts"
    :expenses="expenses"
  />
</template>

<script>
import UploadFile from './components/UploadFile.vue'
import AppCategories from './components/AppCategories.vue'

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
      currentState: states.noData,
      incomes: [],
      accounts: [],
      expenses: [],
    }
  },
  methods: {
    reset () {
      this.currentState = this.states.noData
      this.incomes = []
      this.accounts = []
      this.expenses = []
    },
    onDataLoaded (allData) {
      this.incomes = allData.incomes
      this.accounts = allData.accounts
      this.expenses = allData.expenses
      this.currentState = this.states.dataRead
    },
  }
}
</script>

<style>
  #app {
    font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
  }

  .fade-enter-active,
  .fade-leave-active {
    pointer-events: none;
    transition: opacity 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
