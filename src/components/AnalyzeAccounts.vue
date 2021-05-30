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

    <div class="dropzones">
      <div v-for="(heapKey, i) of heapsAccountKeys" :key="heapKey">
        <drop-zone
          :heap="heaps[heapKey]"
          :title-bg="palette[i]"
        >
          <template v-slot:title>
            {{ heaps[heapKey].title }}
          </template>
        </drop-zone>
      </div>
    </div>

    <chart-pie :data="heapsAccount" />
  </div>
</template>

<script>
import {computed} from 'vue'
import {readonly, state, palette} from '../services/store'
import CkCategory from './CkCategory.vue'
import DropZone from './DropZone.vue'
import ChartPie from './ChartPie.vue'

export default {
  name: 'AnalyzeAccounts',
  components: {ChartPie, CkCategory, DropZone},
  setup () {
    let accounts = computed(() => readonly.accounts)
    let heaps = computed(() => state.heaps)
    let heapsAccountKeys = computed(() => {
      return Object.keys(state.heaps)
        .filter(key => state.heaps[key].type === 'accounts')
    })
    let heapsAccount = computed(() => {
      return Object.keys(state.heaps).map(key => ({
        title: state.heaps[key].title,
        value: state.heaps[key].categories.reduce((acc, category) => {
          acc += category.value * state.currencyRates[category.currency]
          return acc
        }, 0)
      }))
    })
    return {
      palette,
      accounts,
      heaps,
      heapsAccountKeys,
      heapsAccount,
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
