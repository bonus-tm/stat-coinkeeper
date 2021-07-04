import {reactive} from 'vue'

export const palette = [
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#34c759',
  '#5ac8fa',
  '#007aff',
  '#5856d6',
  '#af52de',
]

// heaps can be two types — accounts and operations (incomes + expenses)
export const state = reactive({
  dragging: false,
  heaps: [
    {type: 'accounts', title: 'Безнал', categories: []},
    {type: 'accounts', title: 'Наличка', categories: []},
    {type: 'accounts', title: 'Валюта', categories: []},
    {type: 'accounts', title: 'Клад', categories: []},
    {type: 'accounts', title: 'Остальное', categories: []},

    {type: 'operations', title: 'Доходы Тоша', categories: []},
    {type: 'operations', title: 'Доходы Тани', categories: []},
    {type: 'operations', title: 'Постоянные расходы', categories: []},
    {type: 'operations', title: 'Редкие', categories: []},
  ],
  currencyRates: {
    RUB: 1,
    USD: 73.41,
    EUR: 89.52,
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
