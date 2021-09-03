const K = 10 ** 3
const M = 10 ** 6

/**
 * @param {Number} value
 */
export const humanize = value => {
  if (value >= M) {
    value = Math.round(value * 10 / M) / 10
    return `${value.toString()}M`
  }
  if (value >= K) {
    value = Math.round(value * 10 / K) / 10
    return `${value.toString()}K`
  }
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
