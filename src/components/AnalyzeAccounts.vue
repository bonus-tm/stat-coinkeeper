<template>
  <h2>Анализ наличности</h2>
  <div class="analyze">
    <div class="categories-list">
      <ck-category
        v-for="(account, i) of accounts"
        :key="`inc-${i}`"
        :category="account"
      />
    </div>

    <div>
      <div v-for="(heap, i) of heapsAccount" :key="`dz-acc-${i}`">
        <drop-zone v-model="heapsAccount[i]" />
      </div>
    </div>

    <chart-pie :data="chartData" />
  </div>
</template>

<script>
import {computed} from 'vue'
import {palette, readonly, state} from '../services/store'
import CkCategory from './CkCategory.vue'
import DropZone from './DropZone.vue'
import ChartPie from './ChartPie.vue'

export default {
  name: 'AnalyzeAccounts',
  components: {ChartPie, CkCategory, DropZone},
  setup () {
    let accounts = computed(() => readonly.accounts)
    let heapsAccount = computed(() => state.heaps.accounts)
    let chartData = computed(() => {
      return heapsAccount.value.map(heap => ({
        title: heap.title,
        value: heap.categories.reduce((acc, category) => {
          acc += category.value * state.currencyRates[category.currency]
          return acc
        }, 0)
      }))
    })
    return {
      palette,
      accounts,
      heapsAccount,
      chartData,
    }
  }
}
</script>

<style>
</style>
