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
        <drop-zone :heap="heap" :title-bg="palette[i]">
          <template v-slot:title>
            {{ heap.title }}
          </template>
        </drop-zone>
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
    let heapsAccount = computed(() => {
      return state.heaps.filter(heap => heap.type === 'accounts')
    })
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
  .analyze {
    display: grid;
    grid-template-columns: repeat(2, calc(4 * var(--category-container-width) + 2rem)) auto;
    align-items: start;
  }
  .categories-list {
    display: grid;
    grid-template-columns: repeat(4, var(--category-container-width));
  }
</style>
