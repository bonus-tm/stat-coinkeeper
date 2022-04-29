const K = 10 ** 3
const M = 10 ** 6

/**
 * @param {Number} value
 * @return {string}
 */
export const humanize = (value) => {
  if (isNaN(value)) return ''

  let sign = value < 0 ? '–' : ''

  let abs = Math.abs(value)
  let exp = ''

  if (abs >= M * 10) {
    abs = (Math.round(abs * 100 / M) / 100).toString()
    // exp = 'м'
  } else if (abs >= M) {
    abs = (Math.round(abs * 1000 / M) / 1000).toString()
    // exp = 'м'
  } else if (abs >= 100 * K) {
    abs = (Math.round(abs / K)).toString()
    // exp = 'к'
  } else if (abs >= K) {
    abs = (Math.round(abs * 10 / K) / 10).toString()
    // exp = 'к'
  } else {
    abs = abs.toString()
  }
  return `${sign}${abs.replace('.', ',')}${exp}`
}

/**
 *
 * @param {Number} value
 * @param {string} delimiter
 * @return {string}
 */
export const format = (value, delimiter = ' ') => {
  if (isNaN(value)) return ''

  let sign = value < 0 ? '–' : ''
  let abs = Math.abs(value)

  let ml = ''
  let th = ''
  let un = ''

  if (abs >= M) {
    ml = Math.floor(abs / M)
  }
  if (abs >= K) {
    th = Math.floor((abs - (ml * M)) / K)
  }

  if (abs >= M) {
    th = th.toString().padStart(3, '0')
  }
  un = abs - (ml * M) - (th * K)
  if (abs >= K) {
    un = un.toString().padStart(3, '0')
  }

  return `${sign}${ml}${ml ? delimiter : ''}${th}${th ? delimiter : ''}${un}`
}
