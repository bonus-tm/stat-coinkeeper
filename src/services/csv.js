import Translit from 'cyrillic-to-translit-js'
import * as constants from '../constants'

const translit = new Translit()

let csv

/**
 * Splits a row from csv to array of strings and numbers
 * @param {string} row '"Барахло","0","42317","Plant","RUB"'
 * @return {*[]} ['Барахло',0,42317,'Plant','RUB']
 */
export const split = row => {
  return Array.from(row.matchAll(/"([^"]*)"/g), x=>x[1])
}

const fixNum = str => Number(str.replace(',', '.'))

const fixDate = dateStr => {
  if (!dateStr) return null

  let month
  let day
  let year
  if (/^\d+\.\d+\.\d+$/.test(dateStr)) {
    [day, month, year] = dateStr.split('.')
  } else {
    [month, day, year] = dateStr.split('/')
  }

  return {
    year: Number(year),
    month: Number(month) - 1,
    day: Number(day),
    date: new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      3
    )
  }
}
/**
 *
 * @param {string} title
 * @return {string}
 */
const makeCategoryId = title => {
  return translit.transform(title, '_').toLowerCase()
}
const FIELDS = {
  'Название': {name: 'title', number: false},
  'Бюджет': {name: 'budget', number: true},
  'Получено': {name: 'total', number: true},
  'Иконка': {name: 'icon', number: false},
  'Валюта': {name: 'currency', number: false},
  'Текущее значение': {name: 'value', number: true},
}

/**
 * Преобразовать список категорий в доходах, расходах или наличии в массив объектов
 * @param src
 * @param separator
 * @param type
 * @return {*[]}
 */
export const formatCategories = (src, separator, type) => {
  let titles = split(src.shift()).map(str => FIELDS[str])
  let data = []
  for (let srcCategory of src) {
    let category = {type}
    for (let [i, val] of split(srcCategory).entries()) {
      category[titles[i].name] = titles[i].number ? fixNum(val) : val
    }
    category.id = makeCategoryId(category.title)
    data.push(category)
  }
  return data
}

export const loadData = data => {
  csv = data

  let [srcOperations, srcIncomes, srcAccounts, srcExpenses, srcTags] = csv.split('\n\n\n')
  srcOperations = srcOperations.split('\n')

  // get values separator and remove 'sep=,' row
  let separator = srcOperations?.shift()?.split('=')[1]
  if (!separator) {
    console.error('Separator of values not found')
    return false
  }

  let incomes
  if (srcIncomes) {
    srcIncomes = srcIncomes.split('\n')
    incomes = formatCategories(srcIncomes, separator, 'income')
  }

  let accounts
  if (srcAccounts) {
    srcAccounts = srcAccounts.split('\n')
    accounts = formatCategories(srcAccounts, separator, 'account')
  }

  let expenses
  if (srcExpenses) {
    srcExpenses = srcExpenses.split('\n')
    expenses = formatCategories(srcExpenses, separator, 'expense')
  }

  let tags
  if (srcTags) {
    srcTags = srcTags.split('\n')
    tags = formatCategories(srcTags, separator, 'tag')
  }

  // 'Расход' — только расходы
  // 'Перевод' — доходы и переводы между своими счетами
  const determineOperationDirection = (type, source) => {
    if (type === 'Расход') return constants.OUT
    if (incomes?.find(income => income.title === source)) return constants.IN
    return constants.TRANSFER
  }

  // remove row with column titles
  srcOperations.shift()

  let operations = []
  let currentRow = ''
  for (let entry of srcOperations) {
    if (!entry) break

    currentRow += entry

    // В последнем поле (коммент) могут быть переносы строки,
    // поэтому если строка не оканчивается кавычкой,
    // то добавить следующую строку через пробел
    if (currentRow[currentRow.length - 1] !== '"') {
      currentRow += ' '
      continue
    }

    let [
      dateStr,
      direction,
      source,
      destination,
      tags,
      value,
      currency,
      value2,
      currency2,
      repeat,
      comment,
    ] = split(currentRow)

    operations.push({
      date: fixDate(dateStr),
      direction: determineOperationDirection(direction, source),
      source,
      destination,
      value: fixNum(value),
      value2: fixNum(value2),
      currency,
      currency2,
      tags,
      comment,
    })
    currentRow = ''
  }
  // console.log(operations)

  return {
    incomes,
    accounts,
    expenses,
    tags,
    operations
  }
}
