import {reactive, ref, toRaw, watch} from 'vue'
import localForage from 'localforage'

const CONFIG_SAVE_KEY = 'sck-config'
const DATA_SAVE_KEY = 'sck-data'


export default {
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

  dragging: ref(false),

  // heaps can be two types — accounts and operations (incomes + expenses)
  _defaultState: {
    baseCurrency: 'RUB',
    heaps: {
      accounts: [
        {
          type: 'accounts',
          title: 'Безнал',
          color: {bg: '#ccc', border: '#ddd'},
          coins: []
        },
        {
          type: 'accounts',
          title: 'Наличка',
          color: {bg: '#ccc', border: '#ddd'},
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
          title: 'Доходы Тоша',
          color: {bg: '#0491d1', border: '#0491d1'},
          coins: []
        },
        {
          type: 'operations',
          title: 'Доходы Тани',
          color: {bg: '#e53935', border: '#e53935'},
          coins: []
        },
      ],
      expenses: [
        {
          type: 'operations',
          title: 'Постоянные расходы',
          color: {},
          coins: []
        },
        {type: 'operations', title: 'Редкие', color: {}, coins: []},
      ],
    }
  },

  state: reactive({}),
  readonly: {},
  hasData: ref(false),

  async init () {
    console.log('init')
    let initial
    try {
      initial = await localForage.getItem(CONFIG_SAVE_KEY)
      console.log('initial', initial)
    } catch (e) {
      console.log({e})
    }
    if (initial) {
      this.state = reactive({...initial})
    } else {
      this.state = reactive({...this._defaultState})
    }

    watch(
      () => this.state,
      async state => {
        console.log('state change observed', state)
        await localForage.setItem(CONFIG_SAVE_KEY, toRaw(state))
      },
      {deep: true}
    )

    try {
      this.readonly = await localForage.getItem(DATA_SAVE_KEY)
      if (this.readonly) {
        this.hasData.value = true
      } else {
        this.readonly = {}
      }
      console.log('initial readonly user data', this.hasData.value, this.readonly)
    } catch (e) {
      console.log({e})
    }
  },

  async setReadonly ({timestamp, data}) {
    this.readonly.timestamp = timestamp
    this.readonly.operations = data.operations
    this.readonly.incomes = data.incomes
    this.readonly.accounts = data.accounts
    this.readonly.expenses = data.expenses
    this.readonly.tags = data.tags

    this.updateCoins([...data.accounts, ...data.incomes, ...data.expenses])

    if (
      this.state.heaps?.allIncomesVsExpenses?.[0]?.coins?.length === 0 &&
      this.state.heaps?.allIncomesVsExpenses?.[1]?.coins?.length === 0
    ) {
      this.fillDefaultHeaps(data.incomes, data.expenses)
    }

    await localForage.setItem(DATA_SAVE_KEY, this.readonly)

    this.hasData.value = true
  },

  updateCoins (coins) {
    for (let key of Object.keys(this.state.heaps)) {
      this.state.heaps[key].forEach(heap => {
        if (!heap.coins) heap.coins = []
        heap.coins.forEach((coin, index) => {
          heap.coins[index] = coins.find(n => {
            return n.type === coin.type && n.id === coin.id
          })
        })
      })
    }
  },

  fillDefaultHeaps (incomes, expenses) {
    this.state.heaps.allIncomesVsExpenses[0].coins = [...incomes]
    this.state.heaps.allIncomesVsExpenses[1].coins = [...expenses]
  },

  async clearReadonly () {
    this.readonly.timestamp = null
    this.readonly.operations = null
    this.readonly.incomes = null
    this.readonly.accounts = null
    this.readonly.expenses = null
    this.readonly.tags = null

    await localForage.removeItem(DATA_SAVE_KEY)

    this.hasData.value = false
  },
}
