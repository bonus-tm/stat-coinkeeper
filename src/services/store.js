import {computed, reactive, ref, toRaw, watch} from 'vue'
import localForage from 'localforage'

export const ready = ref(false)
export const dragging = ref(false)

// тёмный режим включён или нет
export const isDark = ref(
  window.matchMedia('(prefers-color-scheme: dark)').matches
)

export const settings = reactive({
  baseCurrency: 'RUB',
  colors: {
    light: {
      gridColor: 'rgba(128,128,128,0.1)',
      borderColor: 'rgba(128,128,128,0.5)',
      tickColor: 'rgba(128,128,128,0.5)',
      labelBgColor: 'rgba(255, 255, 255, 0.6)',
      palette: [
        '#cccccc',
        '#ff3b30',
        '#ff9500',
        '#ffcc00',
        '#34c759',
        '#5ac8fa',
        '#007aff',
        '#5856d6',
        '#af52de',
        '#000000',
      ],
    },
    dark: {
      gridColor: 'rgba(128,128,128,0.1)',
      borderColor: 'rgba(128,128,128,0.5)',
      tickColor: 'rgba(128,128,128,0.5)',
      labelBgColor: 'rgba(0, 0, 0, 0.4)',
      palette: [
        '#cccccc',
        '#ff3b30',
        '#ff9500',
        '#ffcc00',
        '#34c759',
        '#5ac8fa',
        '#007aff',
        '#5856d6',
        '#af52de',
        '#000000',
      ],
    },
  },
})
watch(settings, value => localForage.setItem('settings', toRaw(value)))

export const colors = computed(() => {
  return settings.colors[isDark.value ? 'dark' : 'light']
})

export const heaps = reactive({
  accounts: [
    {
      type: 'accounts',
      title: 'Безнал',
      color: {bg: '#007aff', border: '#007aff'},
      coins: []
    },
    {
      type: 'accounts',
      title: 'Наличка',
      color: {bg: '#5ac8fa', border: '#5ac8fa'},
      coins: []
    },
    {
      type: 'accounts',
      title: 'Валюта',
      color: {bg: '#34c759', border: '#34c759'},
      coins: []
    },
  ],
  allIncomesVsExpenses: [
    {
      type: 'operations',
      title: 'Все доходы',
      color: {bg: '#0491d1', border: '#0491d1'},
      coins: []
    },
    {
      type: 'operations',
      title: 'Все расходы',
      color: {bg: '#e53935', border: '#e53935'},
      coins: []
    },
  ],
  incomes: [
    {
      type: 'operations',
      title: 'Первая куча доходов',
      color: {bg: '#0491d1', border: '#0491d1'},
      coins: []
    },
    {
      type: 'operations',
      title: 'Вторая куча доходов',
      color: {bg: '#ffcc00', border: '#ffcc00'},
      coins: []
    },
  ],
  expenses: [
    {
      type: 'operations',
      title: 'Постоянные расходы',
      color: {bg: '#e53935', border: '#e53935'},
      coins: []
    },
    {
      type: 'operations',
      title: 'Редкие',
      color: {bg: '#ff9500', border: '#ff9500'},
      coins: []
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
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', e => {
      isDark.value = e.matches
    })

  console.log('initialize store')
  try {
    await Promise.all([
      load('settings', settings),
      load('heaps', heaps),
      load('data', ckData),
    ])
    console.log('store initialized', {settings, heaps, ckData})

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
