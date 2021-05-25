<template>
  <div class="categories-list">
    <ck-category
      v-for="(income, i) of incomes"
      :key="`inc-${i}`"
      :icon="income.icon"
      :title="income.title"
      type="income"
    />
  </div>
  <div class="categories-list">
    <ck-category
      v-for="(account, i) of accounts"
      :key="`acc-${i}`"
      :icon="account.icon"
      :title="account.title"
      type="account"
    />
  </div>
  <div class="categories-list">
    <ck-category
      v-for="(expense, i) of expenses"
      :key="`exp-${i}`"
      :icon="expense.icon"
      :title="expense.title"
      type="expense"
    />
  </div>
</template>

<script>
import CkCategory from './CkCategory.vue'

export default {
  name: 'AppCategories',
  components: {CkCategory},
  props: {
    incomes: {type: Array, required: true},
    accounts: {type: Array, required: true},
    expenses: {type: Array, required: true},
  }
}
</script>

<style>
  .categories-list {
    display: flex;
  }
</style>
