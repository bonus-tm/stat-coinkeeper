import * as constants from '../constants'

/**
 * Делает массив со всеми месяцами подряд с первого до последнего,
 * когда были операции
 * @param {Array} operations
 * @return {string[]} ['2019-0', '2019-1', ..., '2020-11', '2021-0']
 */
export const createMonthAxis = operations => {
  let months = []

  let {year: firstYear, month: firstMonth} = operations[0].date
  let {year: lastYear, month: lastMonth} = operations[operations.length - 1].date

  for (let y = firstYear; y <= lastYear; y++) {
    let startMonth = y === firstYear ? firstMonth : 0
    let endMonth = y === lastYear ? lastMonth : 11
    for (let m = startMonth; m <= endMonth; m++) {
      months.push(`${y}-${m}`)
    }
  }
  return months
}

/**
 * Помесячное суммирование доходов и расходов выбранных категорий
 * @param {[String]} categoryTitles названия категорий расходов и источников доходов
 * @param {Array} operations
 * @return {{}} {'2019-0': 12345, '2019-1': 45678, ...}
 */
export const sumByMonths = (categoryTitles, operations) => {
  let months = {}
  for (let op of operations) {
    if (
      categoryTitles.includes(op.source) ||
      categoryTitles.includes(op.destination)
    ) {
      let {year, month} = op.date
      if (typeof months[`${year}-${month}`] === 'undefined') {
        months[`${year}-${month}`] = 0
      }
      if (op.direction === constants.IN) {
        months[`${year}-${month}`] += op.value
      }
      if (op.direction === constants.OUT) {
        months[`${year}-${month}`] -= op.value
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
      value += op.currency === 'RUB' ? op.value : op.value2
    }
    if (op.destination === account.title) {
      value -= op.currency === 'RUB' ? op.value : op.value2
    }

    if (Number.isNaN(value)) {
      console.log(op)
      break
    }
  }
  return value
}
