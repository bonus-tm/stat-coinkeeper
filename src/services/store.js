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
    currencyRates: {
      RUB: 1,
      USD: 73.41,
      EUR: 89.52,
    },
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
  loaded: ref(false),

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
      this.readonly = await localForage.getItem(DATA_SAVE_KEY) || {}
      this.loaded.value = true
      console.log('initial readonly user data', this.loaded.value, this.readonly)
    } catch (e) {
      console.log({e})
    }

    // console.log('accounts', readonly.accounts)
    // readonly.accounts.forEach(acc => {
    //   console.log(
    //     acc.title,
    //     acc.currency,
    //     calcAccountInitialValue(acc, readonly.operations),
    //     '→',
    //     acc.value
    //   )
    //   console.log(accountHistoryByMonths(acc, readonly.operations))
    // })
  },

  async setReadonly ({timestamp, data}) {
    this.readonly.timestamp = timestamp
    this.readonly.operations = data.operations
    this.readonly.incomes = data.incomes
    this.readonly.accounts = data.accounts
    this.readonly.expenses = data.expenses
    this.readonly.tags = data.tags

    await localForage.setItem(DATA_SAVE_KEY, this.readonly)

    this.loaded.value = true
  },

  async clearReadonly () {
    this.readonly.timestamp = null
    this.readonly.operations = null
    this.readonly.incomes = null
    this.readonly.accounts = null
    this.readonly.expenses = null
    this.readonly.tags = null

    await localForage.removeItem(DATA_SAVE_KEY)

    this.loaded.value = false
  },

}
