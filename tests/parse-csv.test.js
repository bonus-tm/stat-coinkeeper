import {expect, test} from 'vitest'
import {parseCsv, parseCategories} from '@/services/parse-csv.js'

test('Empty file', () => {
  expect(parseCsv('')).toBe(undefined)
})


test('Empty with sep', () => {
  expect(parseCsv('sep=,\n')).toStrictEqual({
    accounts: undefined,
    expenses: undefined,
    incomes: undefined,
    operations: [],
    tags: undefined,
  })
})


const inp1 = `sep=,
"Данные","Тип","Из","В","Метки","Сумма","Валюта","Сумма в др.валюте","Др.валюта","Повторение","Заметка"
"3/1/2019","Расход","Сбер Тош","Кафешки","Грабли","287","RUB","287","RUB","Нет",""
"3/1/2019","Расход","Нал Таня","Кафешки","Якитория","1500","RUB","1500","RUB","Нет",""
"3/1/2019","Перевод","Украшения","Сбер Таня","","2300","RUB","2300","RUB","Нет",""
"3/1/2019","Перевод","Украшения","Сбер Таня","","5900","RUB","5900","RUB","Нет",""`
test('Some ops, date with /', () => {
  let {operations} = parseCsv(inp1)
  expect(operations.length).toBe(4)
})


const inp2 = `sep=,
"Данные","Тип","Из","В","Метки","Сумма","Валюта","Сумма в др.валюте","Др.валюта","Повторение","Заметка"
"03.01.2019","Расход","Сбер Тош","Кафешки","Грабли","287","RUB","287","RUB","Нет",""
"03.01.2019","Расход","Нал Таня","Кафешки","Якитория","1500","RUB","1500","RUB","Нет",""
"03.01.2019","Перевод","Украшения","Сбер Таня","","2300","RUB","2300","RUB","Нет",""
"03.01.2019","Перевод","Украшения","Сбер Таня","","5900","RUB","5900","RUB","Нет",""`
test('Some ops, date with .', () => {
  let {operations} = parseCsv(inp2)
  expect(operations.length).toBe(4)
})

const inp3 = `sep=,
"Данные","Тип","Из","В","Метки","Сумма","Валюта","Сумма в др.валюте","Др.валюта","Повторение","Заметка"
"03.01.2019","Расход","Сбер Тош","Кафешки","Грабли","287","RUB","287","RUB","Нет","Длинный коммент; ага,
с переносом строки"
"03.01.2019","Расход","Нал Таня","Кафешки","Якитория","1500","RUB","1500","RUB","Нет",""
"03.01.2019","Перевод","Украшения","Сбер Таня","","2300","RUB","2300","RUB","Нет",""
"03.01.2019","Перевод","Украшения","Сбер Таня","","5900","RUB","5900","RUB","Нет",""`
test('Comment with newline', () => {
  let {operations} = parseCsv(inp3)
  expect(operations.length).toBe(4)
})

const categories = `"Название","Бюджет","Получено","Иконка","Валюта"
"Украшения","0","5532747,56","Gifts","RUB"
"Барахло","0","42317","Plant","RUB"
"Проценты","0","61702","Investments","RUB"
"Кхмер","0","492264","Pets","RUB"
"МК","0","822005","GradHat","RUB"
"Айпеченье","200000","5122200","Property","RUB"
"Фриланс","0","33250","Business","RUB"`
test('Parse categories', () => {
  let cats = parseCategories(categories, 'income')
  expect(cats.length).toBe(7)
})

const accounts = `"Название","Текущее значение","Иконка","Валюта"
"Сбер Тош","1397","Card","RUB"
"Евры","2679,45","Bonus","EUR"`
test('Parse account values with comma decimals', () => {
  let accs = parseCategories(accounts, 'account')
  expect(accs.length).toBe(2)
  expect(accs[0].value).toBe(1397)
  expect(accs[1].value).toBe(2679.45)
})
