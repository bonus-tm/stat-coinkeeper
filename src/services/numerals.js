const K = 10 ** 3
const M = 10 ** 6

/**
 * @param {Number} value
 */
export const humanize = value => {
  if (isNaN(value)) return ''

  let sign = value < 0 ? '–' : ''

  let abs = Math.abs(value)
  let exp = ''

  if (abs >= M * 10) {
    abs = (Math.round(abs * 100 / M) / 100).toString()
    exp = 'м'
  } else if (abs >= M) {
    abs = (Math.round(abs * 1000 / M) / 1000).toString()
    exp = 'м'
  } else if (abs >= 100 * K) {
    abs = (Math.round(abs / K)).toString()
    exp = 'к'
  } else if (abs >= K) {
    abs = (Math.round(abs * 10 / K) / 10).toString()
    exp = 'к'
  } else {
    abs = abs.toString()
  }
  return `${sign}${abs.replace('.', ',')}${exp}`
}

/**
 * Convert hex string color to rgba string with optional opacity
 * @param {String} hex color like #12ab4f
 * @param {Number} opacity optional opacity 0-1
 * @return {String}
 */
export const hex2rgba = (hex, opacity = 1) => {
  if (!hex) return `rgba(128,128,128,${opacity})`

  let [, r1, r2, g1, g2, b1, b2] = hex.split('')
  let r = parseInt(`${r1}${r2}`, 16)
  let g = parseInt(`${g1}${g2}`, 16)
  let b = parseInt(`${b1}${b2}`, 16)
  return `rgba(${r},${g},${b},${opacity})`
}
