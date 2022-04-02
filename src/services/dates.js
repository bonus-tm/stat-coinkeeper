import {MONTHS_LABELS_RUS} from '../constants'

/**
 * Pad start string with zeroes
 * @param {Number|String} value
 * @param {Number} num
 * @return {string}
 */
const pad = (value, num = 2) => value.toString().padStart(num, '0')

/**
 * Date() → '2019'
 * @param {Date} d
 * @param {Boolean} asNumber
 * @return {string|Number}
 */
export const date2y = (d, asNumber = false) => {
  let y = d.getFullYear()
  return asNumber ? y : y.toString()
}

/**
 * Date() → '03'
 * @param {Date} d
 * @param {Boolean} number
 * @return {string|Number}
 */
export const date2m = (d, number = false) => {
  let m = d.getMonth() + 1
  return number ? m : pad(m)
}

/**
 * Date() → '2021-08'
 * @param {Date} date
 * @return {string}
 */
export const date2ym = date => `${date2y(date)}-${date2m(date)}`

/**
 * Date() → '2021-08-31'
 * @param {Date} date
 * @return {string}
 */
export const date2ymd = date => {
  let y = date2y(date)
  let m = date2m(date)
  let d = pad(date.getDate())
  return `${y}-${m}-${d}`
}

/**
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @return {string[]}
 */
export const createMonthsAxis = (startDate, endDate) => {
  let months = []

  let firstYear = date2y(startDate, true)
  let firstMonth = date2m(startDate, true)
  let lastYear = date2y(endDate, true)
  let lastMonth = date2m(endDate, true)

  for (let y = firstYear; y <= lastYear; y++) {
    let startMonth = y === firstYear ? firstMonth : 1
    let endMonth = y === lastYear ? lastMonth : 12
    for (let m = startMonth; m <= endMonth; m++) {
      months.push(`${y}-${pad(m)}`)
    }
  }
  return months
}

/**
 *
 * @param {string[]} axis
 * @param {Object} monthsLabels
 */
export const monthsAxisLabels = (axis, monthsLabels = MONTHS_LABELS_RUS) => {
  return axis.map((ym, i) => {
    let [y, m] = ym.split('-')
    return m === '01' || i === 0 ? `${monthsLabels[m]}\n${y}` : monthsLabels[m]
  })
}
