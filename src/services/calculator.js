import * as constants from '@/constants'
import {createAxis} from '@/services/chart'
import {date2y, date2ym, date2yq} from '@/services/dates'

const periodIndexGetters = {
  month: date2ym,
  quarter: date2yq,
  year: date2y,
}

/**
 * Суммирование доходов и расходов выбранных категорий по заданному масштабу
 * @param {'month'|'quarter'|'year'} timescale
 * @param {[]} coins выбранные категории расходов и источников доходов
 * @param {[]} operations
 * @return {{}} {'2019-01': 12345, '2019-02': 45678, ...}
 */
export const sumPeriods = (timescale, coins, operations) => {
  let periods = {}
  for (let op of operations) {
    let isExpense = op.direction === 'out' &&
      coins.some(coin => coin.type === 'expense' && coin.title === op.destination)
    let isIncome = op.direction === 'in' &&
      coins.some(coin => coin.type === 'income' && coin.title === op.source)

    if (isExpense || isIncome) {
      let index = periodIndexGetters[timescale](op.date.date)
      if (typeof periods[index] === 'undefined') {
        periods[index] = 0
      }
      if (op.direction === constants.IN) {
        periods[index] += op.value
      }
      if (op.direction === constants.OUT) {
        periods[index] -= op.value
      }
    }
  }
  return periods
}

/**
 * Расчёт начальной суммы наличия — провести все операции в обратном порядке,
 * вычитая из конечной суммы доходы и прибавляя расходы
 * @param {Object} account
 * @param {Array} operations
 * @return {Number}
 */
export const calcAccountInitialValue = (account, operations) => {
  let value = account.value
  for (let i = operations.length - 1; i >= 0; i--) {
    let op = operations[i]
    if (op.source === account.title) {
      value += op.currency === account.currency ? op.value : op.value2
    }
    if (op.destination === account.title) {
      value -= op.currency === account.currency ? op.value : op.value2
    }

    if (Number.isNaN(value)) {
      console.log(op)
      break
    }
  }
  return value
}

export const accountHistoryByMonths = (account, operations) => {
  let value = account.value
  let {axis: months} = createAxis({
    startDate: operations[0].date.date,
    endDate: operations[operations.length - 1].date.date,
    step: 'month',
    wholeYear: true,
  })

  let currentIndex = months.length
  let currentYM = ''

  for (let i = operations.length - 1; i >= 0; i--) {
    let op = operations[i]

    // если сменился месяц, то перейти на следующий и вписать значение
    if (date2ym(op.date.date) !== currentYM) {
      while (currentIndex > 0 && date2ym(op.date.date) !== currentYM) {
        currentIndex--
        currentYM = months[currentIndex]
        months[currentIndex] = [months[currentIndex], value]
      }
    }

    if (op.source === account.title) {
      value += op.currency === account.currency ? op.value : op.value2
    }
    if (op.destination === account.title) {
      value -= op.currency === account.currency ? op.value : op.value2
    }

    if (Number.isNaN(value)) {
      console.error('accountHistoryByMonths: value is NaN', {op, account})
      console.log(op)
      break
    }
  }
  return Object.fromEntries(months)
}
