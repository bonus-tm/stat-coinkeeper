<template>
  <h2>Анализ наличности</h2>

  <div class="analyze">
    <div>
      <HeapOfCoins
        v-for="(heap, i) of heapsAccount"
        :key="`dz-acc-${i}`"
        v-model="heapsAccount[i]"
        editable
      />
    </div>

    <ChartPie :data="chartData" />
  </div>
</template>

<script>
import {computed} from 'vue'
import {state} from '../services/store'
import ChartPie from './ChartPie.vue'
import Coin from './Coin.vue'
import CoinsAccounts from './CoinsAccounts.vue'
import HeapOfCoins from './HeapOfCoins.vue'

export default {
  name: 'AnalyzeAccounts',
  components: {ChartPie, Coin, CoinsAccounts, HeapOfCoins},
  setup () {
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
      heapsAccount,
      chartData,
    }
  }
}
</script>

<style>
</style>
