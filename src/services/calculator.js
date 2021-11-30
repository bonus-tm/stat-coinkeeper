import * as constants from '../constants'
import {createMonthsAxis, date2ym} from './dates'

/**
 * Делает массив со всеми месяцами подряд с первого до последнего,
 * когда были операции
 * @param {Array} operations
 * @return {string[]} ['2019-01', '2019-02', ..., '2020-12', '2021-01']
 */
export const createMonthAxis = operations => {
  return createMonthsAxis(
    operations[0].date.date,
    operations[operations.length - 1].date.date
  )
}

/**
 * Помесячное суммирование доходов и расходов выбранных категорий
 * @param {[String]} coinTitles названия категорий расходов и источников доходов
 * @param {Array} operations
 * @return {{}} {'2019-01': 12345, '2019-02': 45678, ...}
 */
export const sumByMonths = (coinTitles, operations) => {
  let months = {}
  for (let op of operations) {
    if (
      coinTitles.includes(op.source) ||
      coinTitles.includes(op.destination)
    ) {
      let ym = date2ym(op.date.date)
      if (typeof months[ym] === 'undefined') {
        months[ym] = 0
      }
      if (op.direction === constants.IN) {
        months[ym] += op.value
      }
      if (op.direction === constants.OUT) {
        months[ym] -= op.value
      }
    }
  }
  return months
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
  let months = createMonthsAxis(
    operations[0].date.date,
    operations[operations.length - 1].date.date
  )

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
