import {IN, OUT, TRANSFER} from '@/constants.js'
import {makeCategoryId, split, fixNum, fixDate} from '@/utils/csv.js'

/**
 * Определить направление операции:
 * 'Расход' — только расходы,
 * 'Перевод' — доходы и переводы между своими счетами
 * @param {{}} operation сама операция
 * @param {[]} incomes категория доходов
 * @param {[]} accounts категория своих счетов
 * @returns {'in'|'out'|'transfer'|''}
 */
const determineDirection = (operation, incomes, accounts) => {
  let dir
  if (operation.type === 'Расход') {
    dir = OUT
  } else {
    let fromIncome = incomes.findIndex((income) => income.title === operation.source) > -1
    let fromAccount = accounts.findIndex((account) => account.title === operation.source) > -1
    let toAccount = accounts.findIndex((account) => account.title === operation.destination) > -1

    if (fromIncome && toAccount) {
      dir = IN
    } else if (fromAccount && toAccount) {
      dir = TRANSFER
    } else {
      dir = ''
    }
  }
  return dir
}

/**
 * Преобразовать список категорий в доходах, расходах или наличии в массив объектов
 * @param {string|string[]} src
 * @param {'income'|'account'|'expense'|'tag'} type
 * @return {undefined|{}[]}
 */
export const parseCategories = (src, type) => {
  if (!src) return
  src = src.split('\n')

  let fields = {
    'Название': {name: 'title'},
    'Бюджет': {name: 'budget', fixMethod: fixNum},
    'Получено': {name: 'total', fixMethod: fixNum},
    'Иконка': {name: 'icon'},
    'Валюта': {name: 'currency'},
    'Текущее значение': {name: 'value', fixMethod: fixNum},
  }
  let titles = split(src.shift()).map(str => fields[str])
  let data = []
  src.forEach((srcCategory) => {
    let category = {type}
    split(srcCategory).forEach((val, i) => {
      let {name, fixMethod} = titles[i]
      category[name] = fixMethod ? fixMethod(val) : val
    })
    category.id = makeCategoryId(category.title)
    data.push(category)
  })
  return data
}

/**
 * Список операций превратить в массив объектов и проставить направление
 * @param {string|string[]} src
 * @param {[]} incomes категория доходов
 * @param {[]} accounts категория своих счетов
 * @returns {undefined|{}[]}
 */
const parseOperations = (src, incomes, accounts) => {
  if (!src) return
  src = src.split('\n')

  if (src[0].startsWith('sep=')) {
    src.shift()
  }

  let fields = {
    'Данные': {field: 'date', fixMethod: fixDate},
    'Тип': {field: 'type'},
    'Из': {field: 'source'},
    'В': {field: 'destination'},
    'Метки': {field: 'tags'},
    'Сумма': {field: 'value', fixMethod: fixNum},
    'Валюта': {field: 'currency'},
    'Сумма в др.валюте': {field: 'value2', fixMethod: fixNum},
    'Др.валюта': {field: 'currency2'},
    'Повторение': {field: false},
    'Заметка': {field: 'comment'},
  }
  let titles = split(src.shift()).map(str => fields[str])
  let operations = []
  let srcOp = ''
  src.forEach((row) => {
    srcOp += row

    // В последнем поле (коммент) могут быть переносы строки,
    // поэтому если строка не оканчивается кавычкой,
    // то добавить следующую строку через пробел
    if (srcOp.at(-1) !== '"') {
      srcOp += ' '
      return
    }

    let op = {}
    split(srcOp).forEach((val, i) => {
      let {field, fixMethod} = titles[i]
      if (field) {
        op[field] = fixMethod ? fixMethod(val) : val
      }
    })
    op.direction = determineDirection(op, incomes, accounts)
    operations.push(op)
    srcOp = ''
  })
  return operations
}

/**
 * Распарсить csv и получить массивы категорий (доходы, расходы, наличие, теги) и операций
 * @param {string} csv
 * @returns {{incomes: ({}[]|undefined), accounts: ({}[]|undefined), expenses: ({}[]|undefined), tags: ({}[]|undefined)}|undefined}
 */
export function parseCsv(csv) {
  if (!csv) return

  let [
    srcOperations,
    srcIncomes,
    srcAccounts,
    srcExpenses,
    srcTags,
  ] = csv.split('\n\n\n')

  let result = {
    incomes: parseCategories(srcIncomes, 'income'),
    accounts: parseCategories(srcAccounts, 'account'),
    expenses: parseCategories(srcExpenses, 'expense'),
    tags: parseCategories(srcTags, 'tag'),
  }

  result.operations = parseOperations(srcOperations, result.incomes, result.accounts)

  console.log('result of csv parsing:', result)
  return result
}
