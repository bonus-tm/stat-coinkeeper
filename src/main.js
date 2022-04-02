import {createApp} from 'vue'
import localForage from 'localforage'
import {initStore} from '@/services/store'
import Currencies from '@/services/currencies'
import {initChart} from '@/services/chart'

import App from '@/App.vue'
import '@/css/main.css'
import '@/css/ck.css'

localForage.config({
  name: 'coin-keeper-stat',
  storeName: 'sck',
})

initChart()

createApp(App).mount('#app')

await Promise.all([
  initStore(),
  Currencies.init('RUB', ['USD', 'EUR']),
])
