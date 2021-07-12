<template>
  <div class="coins-source">
    <h2>Кошельки</h2>
    <div class="coins-list">
      <Coin
        v-for="(account, i) of accounts"
        :key="`inc-${i}`"
        :coin="account"
      />
    </div>
  </div>
</template>

<script>
import Coin from './Coin.vue'
import {computed} from 'vue'
import {readonly} from '../services/store'

export default {
  name: 'CoinsAccounts',
  components: {Coin},
  setup () {
    let accounts = computed(() => readonly.accounts)

    return {
      accounts,
    }
  }
}
</script>

<style scoped>
  h2 {
    margin-left: 1rem;
  }
</style>
