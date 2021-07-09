import {reactive, ref, watch, toRaw} from 'vue'
import localForage from 'localforage'

const SAVE_KEY = 'sck-state'

export const palette = [
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
]
// export const months = [
//   'январь',
//   'февраль',
//   'март',
//   'апрель',
//   'май',
//   'июнь',
//   'июль',
//   'август',
//   'сентябрь',
//   'октябрь',
//   'ноябрь',
//   'декабрь',
// ]
export const months = [
  'янв',
  'фев',
  'март',
  'апр',
  'май',
  'июнь',
  'июль',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
]

export const dragging = ref(false)



// heaps can be two types — accounts and operations (incomes + expenses)
const defaultState = {
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
      {
        type: 'accounts',
        title: 'Валюта',
        color: {bg: '#ccc', border: '#ddd'},
        coins: []
      },
      {
        type: 'accounts',
        title: 'Клад',
        color: {bg: '#ccc', border: '#ddd'},
        coins: []
      },
      {
        type: 'accounts',
        title: 'Остальное',
        color: {bg: '#ccc', border: '#ddd'},
        coins: []
      },
    ],
    allIncomesVsExpenses: [
      {
        type: 'operations',
        title: 'Все доходы',
        color: {bg: '#34c759', border: '#34c759'},
        coins: []
      },
      {
        type: 'operations',
        title: 'Все расходы',
        color: {bg: '#ff3b30', border: '#ff3b30'},
        coins: []
      },
    ],
    incomes: [
      {type: 'operations', title: 'Доходы Тоша', color: {}, coins: []},
      {type: 'operations', title: 'Доходы Тани', color: {}, coins: []},
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
}

export let state = reactive({})

export const initState = async () => {
  console.log('init state')
  let initial
  try {
    initial = await localForage.getItem(SAVE_KEY)
    console.log('initial', initial)
  } catch (e) {
    console.log({e})
  }
  if (initial) {
    state = reactive({...initial})
  } else {
    state = reactive({...defaultState})
  }

  watch(
    () => state,
    async state => {
      console.log('state change observed', state)
      await localForage.setItem(SAVE_KEY, toRaw(state))
    },
    {deep: true}
  )
}

(async () => {
  await initState()
})()

export const readonly = {}

export const initReadonly = ({timestamp, data}) => {
  readonly.timestamp = timestamp
  readonly.operations = data.operations
  readonly.incomes = data.incomes
  readonly.accounts = data.accounts
  readonly.expenses = data.expenses
  readonly.tags = data.tags
}

export const clearReadonly = () => {
  readonly.timestamp = null
  readonly.operations = null
  readonly.incomes = null
  readonly.accounts = null
  readonly.expenses = null
  readonly.tags = null
}
