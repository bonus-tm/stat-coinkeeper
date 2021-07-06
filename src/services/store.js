import {reactive} from 'vue'

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

// heaps can be two types — accounts and operations (incomes + expenses)
export const state = reactive({
  dragging: false,
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
})

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
