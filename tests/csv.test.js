import {describe, expect, it} from 'vitest'
import {split} from '@/utils/csv.js'

describe('Split', () => {
  it('Should return zero when empty string', () => {
    let result = split('')
    expect(result.length).toBe(0)
  })
  it('Should split titles', () => {
    const row1 = '"Данные","Тип","Из","В","Метки","Сумма","Валюта","Сумма в др.валюте","Др.валюта","Повторение","Заметка"'
    let result = split(row1)
    expect(result.length).toBe(11)
  })
  it('Should split with commas inside', () => {
    const row2 = '"Украшения","0","5532747,56","Gifts","RUB"'
    let result = split(row2)
    expect(result).toMatchObject(['Украшения', '0', '5532747,56', 'Gifts', 'RUB'])
  })
  it('Should split single val, no separator', () => {
    const row3 = '"wtf"'
    let result = split(row3)
    expect(result).toMatchObject(['wtf'])
  })
  it('Should split single val, with extra separator', () => {
    const row4 = '"wtf,6854,85"'
    let result = split(row4)
    expect(result).toMatchObject(['wtf,6854,85'])
  })
  it('Should split with some empty values', () => {
    const row5 = '"Украшения","0","55327","Gifts","RUB",""'
    let result = split(row5)
    expect(result).toMatchObject(['Украшения', '0', '55327', 'Gifts', 'RUB', ''])
  })
})
