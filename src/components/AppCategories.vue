<template>
  <div class="categories-list">
    <ck-category
      v-for="(income, i) of incomes"
      :key="`inc-${i}`"
      :category="income"
    />
  </div>
  <div class="categories-list">
    <ck-category
      v-for="(account, i) of accounts"
      :key="`acc-${i}`"
      :category="account"
    />
  </div>
  <div class="categories-list">
    <ck-category
      v-for="(expense, i) of expenses"
      :key="`exp-${i}`"
      :category="expense"
    />
  </div>

  <div class="dropzones">
    <div v-for="heapKey of heapsAccountKeys" :key="heapKey">
      <drop-zone :heap="heaps[heapKey]">
        <template v-slot:title>
          {{ heaps[heapKey].title }}
        </template>
      </drop-zone>
    </div>
  </div>
</template>

<script>
import {state} from '../services/store'
import CkCategory from './CkCategory.vue'
import DropZone from './DropZone.vue'

export default {
  name: 'AppCategories',
  components: {DropZone, CkCategory},
  props: {
    incomes: {type: Array, required: true},
    accounts: {type: Array, required: true},
    expenses: {type: Array, required: true},
  },
  computed: {
    dragging () {
      return state.dragging
    },
    heaps () {
      return state.heaps
    },
    heapsAccountKeys () {
      return Object.keys(state.heaps)
        .filter(key => state.heaps[key].type === 'accounts')
    },
    moneyValues () {
      let values = {}
      for (let key of Object.keys(this.money)) {
        values[key] = this.money[key].categories.reduce((acc, category) => {
          acc += category.value * this.currencyRates[category.currency]
          return acc
        }, 0)
      }
      return values
    },
  }
}
</script>

<style>
  .categories-list {
    display: flex;
  }
  .dropzones {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, 400px);
  }
</style>
