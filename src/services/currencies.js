import localForage from 'localforage'
import {merge} from 'lodash'
import fetchUrl from './fetch'
import {date2ymd, lastDayOfMonth} from './dates'

const SAVE_KEY = 'currencies'
const API_BASE_URL = 'https://api.exchangerate.host'

/**
 * Достать сохранённые локально данные.
 * Проверить наличие данных и их свежесть.
 *
 * 1. Базовая валюта (base) должна совпадать.
 *  Если не совпадает, тогда загрузить всё заново:
 *  — текущий курс для всех валют с выбранной базовой
 *  — историю по всем валютам с выбранной базовой с января 2019 до предыдущего месяца
 *
 * 2. Список валют (symbols) должен содержать нужные.
 *  Для отсутствующих валют всё загрузить:
 *  — текущий курс с выбранной базовой
 *  — историю с выбранной базовой с января 2019 до предыдущего месяца
 *
 * 3. Текущий курс всех валют должен быть не древнее вчерашнего.
 *  Иначе загрузить текущий курс для всех валют
 *
 * 4. История всех валют должна доходить до прошлого месяца.
 *  Иначе загрузить историю по всем валютам с последнего месяца до предыдущего
 *
 *  Структура данных о валютах:
 *  _base: 'RUB'
 *  _currencies: {
 *    USD: {
 *      latest: 0.01521,
 *      updatedAt: <timestamp>,
 *      history: {
 *        '2019-01': 0.015286,
 *        '2019-02': 0.01521,
 *      }
 *    },
 *    EUR: { ... },
 *    ...,
 *  }
 */


/**
 *
 * @param {Date} date
 * @return {string}
 */
const makeLastMonth = date => {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  if (m === 1) {
    y--
    m = 12
  } else {
    m--
  }
  y = y.toString()
  m = m.toString().padStart(2, '0')
  return `${y}-${m}`
}

export default {
  _base: '',
  _currencies: {},

  async init (base = 'RUB', symbols = ['USD', 'EUR']) {
    await this._restore()

    // 1. Базовая валюта не совпадает
    if (this._base !== base) {
      this._base = base
      this._currencies = await this._loadRemote(base, symbols)
    }

    let localSymbols = Object.keys(this._currencies)
    let omittedSymbols = symbols.filter(s => !localSymbols.includes(s))
    // 2. Список валют содержит не все нужные валюты
    if (omittedSymbols.length) {
      let currencies = await this._loadRemote(base, omittedSymbols)
      merge(this._currencies, currencies)
    }

    let now = new Date()
    let today = date2ymd(now)
    let lastMonth = makeLastMonth(now)

    for (let [symbol, {
      updatedAt,
      history = {}
    }] of Object.entries(this._currencies)) {
      // 3. Текущий курс древнее вчерашнего
      if (date2ymd(new Date(updatedAt)) !== today) {
        let rate = await this._loadLatest(base, [symbol])
        merge(this._currencies, rate)
      }

      // 4. История курса валюты не доходит до прошлого месяца
      let latestMonth = Object.keys(history).sort().reverse()[0]
      if (latestMonth !== lastMonth) {
        let history = await this._loadHistory(base, [symbol], lastMonth, latestMonth)
        merge(this._currencies, history)
      }
    }

    console.log('currencies init', this._currencies)
    await this._save()
  },

  rate (symbol, month) {
    return this._currencies[symbol]?.history[month]
  },

  _save () {
    return localForage.setItem(SAVE_KEY, {
      base: this._base,
      currencies: this._currencies,
    })
  },

  async _restore () {
    let {
      base = '',
      currencies = {}
    } = (await localForage.getItem(SAVE_KEY)) || {}
    this._base = base
    this._currencies = currencies
  },

  /**
   * Загрузка всех данных выбранных валют — текущего курса и всей истории
   * @param {string} base
   * @param {string[]} symbols
   * @return {Promise<*>}
   * @private
   */
  async _loadRemote (base, symbols) {
    console.log('load remove last month', makeLastMonth(new Date()))
    let rates = await this._loadLatest(base, symbols)
    let histories = await this._loadHistory(base, symbols, makeLastMonth(new Date()))
    return merge({}, rates, histories)
  },

  /**
   * Текущий курс
   * @param {string} base
   * @param {string[]} symbols
   * @return {Promise<{}>}
   * @private
   */
  async _loadLatest (base, symbols) {
    let result = {}
    let response = await fetchUrl(API_BASE_URL + '/latest', {base, symbols})
    if (!response.success) {
      console.warn('load latest problem:', response)
    } else {
      symbols.filter(symbol => response.rates[symbol])
        .forEach(symbol => {
          result[symbol] = {
            latest: response.rates[symbol],
            updatedAt: Date.now()
          }
        })
    }
    return result
  },

  /**
   * История курсов валют по месяцам, на последний день каждого месяца
   * @param {string} base
   * @param {string[]} symbols
   * @param {string} lastMonth предыдущий месяц для сегодняшнего дня
   * @param {string} latestMonth последний месяц в сохранённых данных
   * @return {Promise<{}>}
   * @private
   */
  async _loadHistory (base, symbols, lastMonth, latestMonth = '2019-01') {
    let result = {}
    for (let symbol of symbols) {
      result[symbol] = {
        history: {}
      }
    }

    let [startYear, startMonth] = latestMonth.split('-')
    startYear = Number(startYear)

    let [endYear, endMonth] = lastMonth.split('-')
    endYear = Number(endYear)
    endMonth = Number(endMonth).toString().padStart(2, '0')

    for (let year = startYear; year <= endYear; year++) {
      let start_date = `${year}-${year === startYear ? startMonth : '01'}-28`
      let endDay = year === endYear ? lastDayOfMonth(year, endMonth) : '31'
      let end_date = `${year}-${year === endYear ? endMonth : '12'}-${endDay}`

      let response = await fetchUrl(API_BASE_URL + '/timeseries', {
        base,
        symbols,
        start_date,
        end_date,
      })
      if (!response.success) {
        console.warn('load history problem:', response)
      } else {
        // Достать значения только для последнего дня каждого месяца
        let dates = Object.keys(response.rates).sort()
        let prev
        for (let date of dates) {
          let [y, m, d] = date.split('-')
          let lastDay = lastDayOfMonth(y, m - 1).toString()
          if (d === lastDay && prev) {
            for (let symbol of symbols) {
              result[symbol].history[prev[0]] = prev[1][symbol]
            }
          }
          prev = [`${y}-${m}`, response.rates[date]]
        }
      }
    }
    return result
  },
}
