<template>
  <div class="coins-source">
    <h2>Кошельки</h2>
    <div class="coins-container">
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
import store from '../services/store'

export default {
  name: 'CoinsAccounts',
  components: {Coin},
  setup () {
    let accounts = computed(() => store.readonly.accounts)

    return {
      accounts,
    }
  }
}
</script>
