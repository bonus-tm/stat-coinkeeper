<template>
  <h2>Анализ наличности</h2>
  <div class="analyze">
    <div class="coins-list">
      <Coin
        v-for="(account, i) of accounts"
        :key="`inc-${i}`"
        :coin="account"
      />
    </div>

    <div>
      <div v-for="(heap, i) of heapsAccount" :key="`dz-acc-${i}`">
        <HeapOfCoins v-model="heapsAccount[i]" editable />
      </div>
    </div>

    <chart-pie :data="chartData" />
  </div>
</template>

<script>
import {computed} from 'vue'
import {palette, readonly, state} from '../services/store'
import Coin from './Coin.vue'
import HeapOfCoins from './HeapOfCoins.vue'
import ChartPie from './ChartPie.vue'

export default {
  name: 'AnalyzeAccounts',
  components: {ChartPie, Coin, HeapOfCoins},
  setup () {
    let accounts = computed(() => readonly.accounts)
    let heapsAccount = computed(() => state.heaps.accounts)
    let chartData = computed(() => {
      return heapsAccount.value.map(heap => ({
        title: heap.title,
        color: heap.color.border,
        value: heap.coins.reduce((acc, coin) => {
          acc += coin.value * state.currencyRates[coin.currency]
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
