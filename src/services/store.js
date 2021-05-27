import {reactive} from 'vue'

export const state = reactive({
  dragging: false
})

export const readonly = {}

export const initReadonly = ({operations, incomes, accounts, expenses, tags}) => {
  readonly.operations = operations
  readonly.incomes = incomes
  readonly.accounts = accounts
  readonly.expenses = expenses
  readonly.tags = tags
}
