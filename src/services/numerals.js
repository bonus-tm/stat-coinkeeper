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
