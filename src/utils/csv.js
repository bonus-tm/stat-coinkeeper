import Translit from 'cyrillic-to-translit-js'

const translit = new Translit()

/**
 * Сформировать id категории — транслит и пробелы заменить на "_"
 */
export const makeCategoryId = (title) => {
  return translit.transform(title, '_').toLowerCase()
}

/**
 * Splits a row from csv to array of strings and numbers
 * @param {string} row '"Барахло","0","42317","Plant","RUB"'
 * @return {*[]} ['Барахло',0,42317,'Plant','RUB']
 */
export const split = (row) => {
  return Array.from(row.matchAll(/"([^"]*)"/g), x => x[1])
}

/**
 * Привести дату к виду YYYY-MM-DD
 */
export const fixDate = (dateStr) => {
  if (!dateStr) {
    return ''
  }

  if (/^\d+\.\d+\.\d+$/.test(dateStr)) {
    let [day, month, year] = dateStr.split('.')
    return `${year}-${month}-${day}`
  } else if (/^\d+\/\d+\/\d+$/.test(dateStr)) {
    let [month, day, year] = dateStr.split('/')
    return `${year}-${month}-${day}`
  } else {
    return dateStr
  }
}

/**
 * Преобразовать число из строки в Number
 */
export const fixNum = (str) => {
  return Number(str.replace(',', '.'))
}
