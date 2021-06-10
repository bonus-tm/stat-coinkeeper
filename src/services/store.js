import {reactive} from 'vue'

export const palette = [
  '#d70206',
  '#f05b4f',
  '#f4c63d',
  '#d17905',
  '#453d3f',
  '#59922b',
  '#0544d3',
  '#6b0392',
  '#f05b4f',
  '#dda458',
  '#eacf7d',
  '#86797d',
  '#b2c326',
  '#6188e2',
  '#a748ca',
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
