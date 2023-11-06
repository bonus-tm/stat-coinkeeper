/**
 * Pad start string with zeroes
 * @param {Number|String} value
 * @param {Number} num
 * @return {string}
 */
export const pad = (value, num = 2) => value.toString().padStart(num, '0')

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
 * Date() → '2' — номер квартала в году
 * @param {Date} d
 * @param {Boolean} number
 * @return {string|Number}
 */
export const date2q = (d, number = false) => {
  let m = d.getMonth() + 1
  let q = 1
  if (m > 3) q = 2
  if (m > 6) q = 3
  if (m > 9) q = 4
  return number ? q : q.toString()
}

/**
 * Date() → '2012-2' — год и квартал
 * @param {Date} date
 * @return {string}
 */
export const date2yq = date => `${date2y(date)}-${date2q(date)}`

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
