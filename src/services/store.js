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

export const initReadonly = ({operations, incomes, accounts, expenses, tags}) => {
  readonly.operations = operations
  readonly.incomes = incomes
  readonly.accounts = accounts
  readonly.expenses = expenses
  readonly.tags = tags
}
