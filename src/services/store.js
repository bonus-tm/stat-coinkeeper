import {reactive} from 'vue'

// heaps can be two types — accounts and operations (incomes + expenses)
export const state = reactive({
  dragging: false,
  heaps: {
    cashless: {type: 'accounts', title: 'Безнал', categories: []},
    cash: {type: 'accounts', title: 'Наличка', categories: []},
    currency: {type: 'accounts', title: 'Валюта', categories: []},
    gulden: {type: 'accounts', title: 'Клад', categories: []},
    rest: {type: 'accounts', title: 'Остальное', categories: []},
  },
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
