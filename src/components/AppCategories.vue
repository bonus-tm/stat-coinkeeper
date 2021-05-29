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

  <categories-income />

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
import {readonly, state} from '../services/store'
import CkCategory from './CkCategory.vue'
import DropZone from './DropZone.vue'
import CategoriesIncome from './CategoriesIncome.vue'

export default {
  name: 'AppCategories',
  components: {CategoriesIncome, DropZone, CkCategory},
  computed: {
    incomes () {
      return readonly.incomes
    },
    accounts () {
      return readonly.accounts
    },
    expenses () {
      return readonly.expenses
    },
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
