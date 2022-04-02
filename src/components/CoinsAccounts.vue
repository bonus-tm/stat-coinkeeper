<script setup>
import {ckData} from '@/services/store'
import Coin from '@/components/Coin.vue'
</script>

<template>
  <div class="ck-coins-container">
    <Coin
      v-for="(account, i) of ckData.accounts"
      :key="`inc-${i}`"
      :coin="account"
    />
  </div>
</template>
