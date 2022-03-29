<script setup>
import {computed} from 'vue'
import store from '@/services/store'
import Coin from '@/components/Coin.vue'

let accounts = computed(() => store.readonly.accounts)
</script>

<template>
  <div class="ck-coins-container">
    <Coin
      v-for="(account, i) of accounts"
      :key="`inc-${i}`"
      :coin="account"
    />
  </div>
</template>
