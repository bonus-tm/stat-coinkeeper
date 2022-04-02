<script setup>
import {ckData} from '@/services/store'
import Coin from '@/components/Coin.vue'
</script>

<template>
  <div>
    <div class="ck-coins-container">
      <Coin
        v-for="(income, i) of ckData.incomes"
        :key="`inc-${i}`"
        :coin="income"
      />
    </div>
    <div class="ck-coins-container">
      <Coin
        v-for="(expense, i) of ckData.expenses"
        :key="`inc-${i}`"
        :coin="expense"
      />
    </div>
  </div>
</template>
