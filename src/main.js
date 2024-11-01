import {createApp} from 'vue'
import localForage from 'localforage'
import {ckData, initStore} from '@/services/store'
import Currencies from '@/services/currencies/cbr-xml-daily.ru'
import {initChart} from '@/services/chart'
import {startDarkModeWatch} from '@/services/colors'

import App from '@/App.vue'
import '@/css/main.css'
import '@/css/ck.css'
import {calcAccountInitialValue} from '@/services/calculator.js'

localForage.config({
  name: 'coin-keeper-stat',
  storeName: 'sck',
})

initChart()

createApp(App).mount('#app')

startDarkModeWatch()

await Promise.all([
  initStore(),
  Currencies.init('RUB', ['USD', 'EUR', 'TRY']),
])

console.log(ckData.accounts)
ckData.accounts.forEach(acc => {
  let i = calcAccountInitialValue(acc, ckData.operations)
  console.log({title: acc.title, initialValue: i, currency: acc.currency})
})
