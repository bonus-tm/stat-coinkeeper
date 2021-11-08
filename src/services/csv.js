import Translit from 'cyrillic-to-translit-js'
import * as constants from '../constants'

const translit = new Translit()

let csv

export const split = row => {
  return Array.from(row.matchAll(/"([^"]*)"/g), x=>x[1])
}

const fixStr = str => str.charAt(0) === '"' ? str.slice(1, -1) : str
const fixNum = str => Number(str.charAt(0) === '"' ? str.slice(1, -1) : str)
const fixDate = dateStr => {
  dateStr = fixStr(dateStr)
  if (!dateStr) return null

  let month
  let day
  let year
  let sep
  if (/^\d+\.\d+\.\d+$/.test(dateStr)) {
    sep = '.'
  } else {
    sep = '/'
  }
  [month, day, year] = dateStr.split(sep)

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
// Преобразовать список категорий в доходах, расходах или наличии в массив объектов
export const formatCategories = (src, separator, type) => {
  let titles = split(src.shift()).map(fixStr).map(str => FIELDS[str])
  let data = []
  for (let srcCategory of src) {
    let category = {type}
    for (let [i, val] of split(srcCategory).entries()) {
      category[titles[i].name] = titles[i].number ? fixNum(val) : fixStr(val)
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
  for (let entry of srcOperations) {
    if (!entry) break

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
    ] = split(entry)

    operations.push({
      date: fixDate(dateStr),
      direction: determineOperationDirection(fixStr(direction), fixStr(source)),
      source: fixStr(source),
      destination: fixStr(destination),
      value: fixNum(value),
      value2: fixNum(value2),
      currency: fixStr(currency),
      currency2: fixStr(currency2),
      tags: fixStr(tags).split(', '),
      comment: fixStr(comment),
    })
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
