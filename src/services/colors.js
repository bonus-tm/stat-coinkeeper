import {computed, ref} from 'vue'

// тёмный режим включён или нет
const isDark = ref(
  window.matchMedia('(prefers-color-scheme: dark)').matches
)

export const startDarkModeWatch = () => {
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', e => {
      isDark.value = e.matches
    })
}

const lights = {
  chartGridColor: 'rgba(142,142,147,0.1)',
  chartBorderColor: 'rgba(142,142,147,0.5)',
  chartTickColor: 'rgba(142,142,147,0.5)',
  chartLabelBgColor: 'rgba(255,255,255,0.6)',
  gray: 'rgb(142,142,147)',
  red: 'rgb(255,59,48)',
  orange: 'rgb(255,149,0)',
  yellow: 'rgb(255,204,0)',
  green: 'rgb(40,205,65)',
  cyan: 'rgb(85,190,240)',
  blue: 'rgb(0,122,255)',
  indigo: 'rgb(88,86,214)',
  purple: 'rgb(175,82,222)',
  pink: 'rgb(255,45,85)',
  brown: 'rgb(162,132,94)',
}
const darks = {
  chartGridColor: 'rgba(152,152,157,0.1)',
  chartBorderColor: 'rgba(152,152,157,0.5)',
  chartTickColor: 'rgba(152,152,157,0.5)',
  chartLabelBgColor: 'rgba(0,0,0,0.4)',
  gray: 'rgb(152,152,157)',
  red: 'rgb(255,69,58)',
  orange: 'rgb(255,159,10)',
  yellow: 'rgb(255,214,10)',
  green: 'rgb(50,215,75)',
  cyan: 'rgb(90,200,245)',
  blue: 'rgb(10,132,255)',
  indigo: 'rgb(94,92,230)',
  purple: 'rgb(191,90,242)',
  pink: 'rgb(255,55,95)',
  brown: 'rgb(172,142,104)',
}

export const colors = computed(() => isDark.value ? darks : lights)

export const palette = computed(() => ({
  gray: colors.value.gray,
  red: colors.value.red,
  orange: colors.value.orange,
  yellow: colors.value.yellow,
  green: colors.value.green,
  cyan: colors.value.cyan,
  blue: colors.value.blue,
  indigo: colors.value.indigo,
  purple: colors.value.purple,
  pink: colors.value.pink,
  brown: colors.value.brown,
}))

/**
 * Change opacity of some color
 * @param {String} color #aabbcc, rgb(), rgba(), or color name in palette
 * @param {Number} opacity
 * @return {string}
 */
export const changeOpacity = (color, opacity = 1) => {
  if (!color) return ''
  if (Object.keys(palette.value).includes(color)) {
    color = palette.value[color]
  }
  if (color.startsWith('#')) {
    return hex2rgba(color, opacity)
  }
  if (color.startsWith('rgba')) {
    return rgba(color, {a: opacity})
  }
  if (color.startsWith('rgb')) {
    return rgb2rgba(color, opacity)
  }

  return `rgba(128,128,128,${opacity})`
}

/**
 * Convert hex string color to rgba string with optional opacity
 * @param {String} hex color like #12ab4f
 * @param {Number} opacity optional opacity 0-1
 * @return {String}
 */
const hex2rgba = (hex, opacity = 1) => {
  if (!hex) return `rgba(128,128,128,${opacity})`

  let [, r1, r2, g1, g2, b1, b2] = hex.split('')
  let r = parseInt(`${r1}${r2}`, 16)
  let g = parseInt(`${g1}${g2}`, 16)
  let b = parseInt(`${b1}${b2}`, 16)
  return `rgba(${r},${g},${b},${opacity})`
}

/**
 * Convert rgb() to rgba() with given opacity
 * @param {String} rgb
 * @param {Number} opacity
 * @return {`rgba(${String},${String},${String},${String})`}
 */
const rgb2rgba = (rgb, opacity = 1) => {
  let [, r, g, b] = rgb.match(/rgb\((\d+),\s?(\d+),\s?(\d+)\)/)
  return `rgba(${r},${g},${b},${opacity})`
}

/**
 * Update values in rgba
 * @param {String} srcColor
 * @param {String} r
 * @param {String} g
 * @param {String} b
 * @param {String} a
 * @return {`rgba(${String},${String},${String},${String})`}
 */
const rgba = (srcColor, {r = '', g = '', b = '', a = ''}) => {
  let [, _r, _g, _b, _a] = srcColor.match(
    /rgba\((\d+),\s?(\d+),\s?(\d+),\s?([\d.]+)\)/
  )
  return `rgba(${r || _r},${g || _g},${b || _b},${a || _a})`
}
