<template>
  <div>
    <h2>Операции</h2>
    <div class="coins-list">
      <Coin
        v-for="(income, i) of incomes"
        :key="`inc-${i}`"
        :coin="income"
      />
    </div>
    <div class="coins-list">
      <Coin
        v-for="(expense, i) of expenses"
        :key="`inc-${i}`"
        :coin="expense"
      />
    </div>
  </div>
</template>

<script>
import {computed} from 'vue'
import {readonly} from '../services/store'
import Coin from './Coin.vue'

export default {
  name: 'CoinsOperations',
  components: {Coin},
  setup () {
    let incomes = computed(() => readonly.incomes)
    let expenses = computed(() => readonly.expenses)

    return {
      incomes,
      expenses,
    }
  }
}
</script>

<style scoped>
  h2 {
    margin-left: 1rem;
  }
</style>
