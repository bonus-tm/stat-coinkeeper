import {computed, reactive, ref, toRaw, watch} from 'vue'
import localForage from 'localforage'

export const ready = ref(false)
export const currencyRates = ref({
  status: 'uninitialized',
  progress: 0,
})
export const dragging = ref(false)

export const appSettings = reactive({
  // Шаг графиков — по месяцам, кварталам или годам
  timeStep: 'month',
  // Выравнивать ли графики по годам
  roundToWholeYear: true,
})
watch(appSettings, value => localForage.setItem('appSettings', toRaw(value)))

export const heaps = reactive({
  accounts: [
    {
      type: 'accounts',
      title: 'Безнал',
      color: 'blue',
      coins: [],
    },
    {
      type: 'accounts',
      title: 'Наличка',
      color: 'cyan',
      coins: [],
    },
    {
      type: 'accounts',
      title: 'Валюта',
      color: 'green',
      coins: [],
    },
  ],
  allIncomesVsExpenses: [
    {
      type: 'operations',
      title: 'Все доходы',
      color: 'cyan',
      coins: [],
    },
    {
      type: 'operations',
      title: 'Все расходы',
      color: 'red',
      coins: [],
    },
  ],
  incomes: [
    {
      type: 'operations',
      title: 'Первая куча доходов',
      color: 'cyan',
      coins: [],
    },
    {
      type: 'operations',
      title: 'Вторая куча доходов',
      color: 'yellow',
      coins: [],
    },
  ],
  expenses: [
    {
      type: 'operations',
      title: 'Постоянные расходы',
      color: 'red',
      coins: [],
    },
    {
      type: 'operations',
      title: 'Редкие',
      color: 'orange',
      coins: [],
    },
  ],
})
watch(heaps, value => localForage.setItem('heaps', toRaw(value)))

export const ckData = reactive({
  operations: [],
  incomes: [],
  accounts: [],
  expenses: [],
  tags: [],
})

const load = async (key, obj) => {
  let value = await localForage.getItem(key)
  Object.assign(obj, value)
}

export const hasData = computed(() => {
  return ckData.operations.length || ckData.accounts.length
})

export const lastOperationDate = computed(() => {
  return ckData.operations.at(-1).date.date
})

export const initStore = async () => {
  console.log('initialize store')
  try {
    await Promise.all([
      load('appSettings', appSettings),
      load('heaps', heaps),
      load('data', ckData),
    ])
    console.log('store initialized', {appSettings, heaps, ckData})

    ready.value = true
  } catch (e) {
    console.log({e})
  }
}

const updateCoins = coins => {
  for (let key of Object.keys(heaps)) {
    heaps[key].forEach(heap => {
      if (!heap.coins) heap.coins = []
      heap.coins.forEach((coin, index) => {
        heap.coins[index] = coins.find(n => {
          return n.type === coin.type && n.id === coin.id
        })
      })
    })
  }
}

const fillDefaultHeaps = (incomes, expenses) => {
  heaps.allIncomesVsExpenses[0].coins = [...incomes]
  heaps.allIncomesVsExpenses[1].coins = [...expenses]
}

export const fillData = data => {
  console.log('fill ck data', data)

  Object.assign(ckData, data)
  updateCoins([...data.accounts, ...data.incomes, ...data.expenses])
  if (
    !heaps.allIncomesVsExpenses?.[0]?.coins?.length &&
    !heaps.allIncomesVsExpenses?.[1]?.coins?.length
  ) {
    fillDefaultHeaps(data.incomes, data.expenses)
  }

  console.log('ck data filled', {heaps, ckData})

  return localForage.setItem('data', toRaw(ckData))
}

export const clearData = () => localForage.removeItem('data')
