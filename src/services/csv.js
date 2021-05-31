import Translit from 'cyrillic-to-translit-js'
import * as constants from '../constants'

const translit = new Translit()

let csv

const fixStr = str => str?.slice(1, -1)
const fixNum = str => Number(str?.slice(1, -1))
const fixDate = dateStr => {
  let [month, day, year] = fixStr(dateStr)?.split('/')
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
const formatCategories = (src, separator, type) => {
  let titles = src.shift().split(separator).map(fixStr).map(str => FIELDS[str])
  let data = []
  for (let srcCategory of src) {
    let category = {type}
    for (let [i, val] of srcCategory.split(separator).entries()) {
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

  srcIncomes = srcIncomes.split('\n')
  let incomes = formatCategories(srcIncomes, separator, 'income')
  // console.log(incomes)

  srcAccounts = srcAccounts.split('\n')
  let accounts = formatCategories(srcAccounts, separator, 'account')

  srcExpenses = srcExpenses.split('\n')
  let expenses = formatCategories(srcExpenses, separator, 'expense')

  srcTags = srcTags.split('\n')
  let tags = formatCategories(srcTags, separator, 'tag')

  // 'Расход' — только расходы
  // 'Перевод' — доходы и переводы между своими счетами
  const determineOperationDirection = (type, source) => {
    if (type === 'Расход') return constants.OUT
    if (incomes.find(income => income.title === source)) return constants.IN
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
    ] = entry.split(separator)
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
