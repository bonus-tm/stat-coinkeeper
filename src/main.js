import {createApp} from 'vue'
import localForage from 'localforage'
import {initStore} from '@/services/store'
import Currencies from '@/services/currencies/cbr-xml-daily.ru'
import {initChart} from '@/services/chart'
import {startDarkModeWatch} from '@/services/colors'

import App from '@/App.vue'
import '@/css/main.css'
import '@/css/ck.css'

localForage.config({
  name: 'coin-keeper-stat',
  storeName: 'sck',
})

initChart()

createApp(App).mount('#app')

startDarkModeWatch()

await Promise.all([
  initStore(),
  Currencies.init(['USD', 'EUR']),
])
