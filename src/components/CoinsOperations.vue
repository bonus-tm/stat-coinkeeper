<script setup>
import {computed} from 'vue'
import store from '@/services/store'
import Coin from '@/components/Coin.vue'

let incomes = computed(() => store.readonly.incomes)
let expenses = computed(() => store.readonly.expenses)
</script>

<template>
  <div>
    <div class="ck-coins-container">
      <Coin
        v-for="(income, i) of incomes"
        :key="`inc-${i}`"
        :coin="income"
      />
    </div>
    <div class="ck-coins-container">
      <Coin
        v-for="(expense, i) of expenses"
        :key="`inc-${i}`"
        :coin="expense"
      />
    </div>
  </div>
</template>
