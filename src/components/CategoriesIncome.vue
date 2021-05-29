<template>
  <div>
    <h4>В наличии {{ Math.round(total) }}</h4>
    <chart-pie :data="heaps" />
  </div>
</template>

<script>
import {computed} from 'vue'
import {state} from '../services/store'
import ChartPie from './ChartPie.vue'

export default {
  name: 'CategoriesIncome',
  components: {ChartPie},
  setup () {
    let heaps = computed(() => {
      return Object.keys(state.heaps).map(key => ({
        title: state.heaps[key].title,
        value: state.heaps[key].categories.reduce((acc, category) => {
          acc += category.value * state.currencyRates[category.currency]
          return acc
        }, 0)
      }))
    })
    let total = computed(() => {
      return heaps.value.reduce((total, sector) => {
        total += sector.value
        return total
      }, 0)
    })
    return {heaps, total}
  }
}
</script>
