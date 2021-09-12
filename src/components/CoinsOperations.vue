<template>
  <div class="coins-source">
    <h2>Операции</h2>
    <div class="coins-container">
      <Coin
        v-for="(income, i) of incomes"
        :key="`inc-${i}`"
        :coin="income"
      />
    </div>
    <div class="coins-container">
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
import store from '../services/store'
import Coin from './Coin.vue'

export default {
  name: 'CoinsOperations',
  components: {Coin},
  setup () {
    let incomes = computed(() => store.readonly.incomes)
    let expenses = computed(() => store.readonly.expenses)

    return {
      incomes,
      expenses,
    }
  }
}
</script>
