import localForage from 'localforage'
import {merge} from 'lodash'
import {
  eachMonthOfInterval,
  eachYearOfInterval,
  format,
  isThisMonth,
  isThisYear,
  isToday,
  lastDayOfMonth,
  lastDayOfYear
} from 'date-fns'
import fetchUrl from './fetch'

const SAVE_KEY = 'currencies'
const API_BASE_URL = 'https://api.exchangerate.host'
const HISTORY_START_DATE = new Date(2019, 0, 1)

const YMD = 'yyyy-MM-dd'
const YM = 'yyyy-MM'

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
 * 4. История всех валют должна доходить до текущего месяца.
 *  Иначе загрузить историю по всем валютам с последнего месяца до текущего
 *  (если сегодня не последний день месяца, то для последнего месяца
 *  использовать сегодняшний курс)
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

export default {
  _base: '',
  _currencies: {},
  loaded: false,

  async init (base = 'RUB', symbols = ['USD', 'EUR']) {
    await this._restore()

    // 1. Базовая валюта не совпадает
    if (this._base !== base) {
      this._base = base
      merge(
        this._currencies,
        await this._loadLatest(base, symbols),
        await this._loadHistory(base, symbols)
      )
    }

    let localSymbols = Object.keys(this._currencies)
    let omittedSymbols = symbols.filter(s => !localSymbols.includes(s))
    // 2. Список валют содержит не все нужные валюты
    if (omittedSymbols.length) {
      merge(
        this._currencies,
        await this._loadLatest(base, omittedSymbols),
        await this._loadHistory(base, omittedSymbols)
      )
    }

    for (let [symbol, {
      updatedAt,
      history = {}
    }] of Object.entries(this._currencies)) {
      // 3. Текущий курс древнее вчерашнего
      if (!isToday(new Date(updatedAt))) {
        merge(
          this._currencies,
          await this._loadLatest(base, [symbol])
        )
      }

      // 4. История курса валюты не доходит до текущего месяца
      let latestMonth = new Date(Object.keys(history).sort().reverse()[0])
      if (!isThisMonth(latestMonth)) {
        merge(
          this._currencies,
          await this._loadHistory(base, [symbol], latestMonth)
        )
      }

      // если сегодня не последний день месяца,
      // то курс у последнего месяца будет undefined,
      // в этом случае подставить сегодняшний курс
      this._currencies[symbol].history[format(new Date, YM)] ??=
        this._currencies[symbol].latest
    }

    console.log('currencies init', this._currencies)
    await this._save()
    this.loaded = true
  },

  rate (symbol, month) {
    if (month) {
      return this._currencies[symbol]?.history[month]
    } else {
      return this._currencies[symbol].latest
    }
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
   * @param {Date} start с какой даты начинать
   * @return {Promise<{}>}
   * @private
   */
  async _loadHistory (base, symbols, start = HISTORY_START_DATE) {
    let result = {}
    for (let symbol of symbols) {
      result[symbol] = {
        history: {}
      }
    }

    let end = new Date()

    for (let year of eachYearOfInterval({start, end})) {
      let startDate = year
      let endDate = isThisYear(year) ? end : lastDayOfYear(year)

      let response = await fetchUrl(API_BASE_URL + '/timeseries', {
        base,
        symbols,
        start_date: format(startDate, YMD),
        end_date: format(endDate, YMD),
      })
      if (!response.success) {
        console.warn('load history problem:', response)
      } else {
        // Достать значения только для последнего дня каждого месяца
        let months = eachMonthOfInterval({start: startDate, end: endDate})
        for (let month of months) {
          let rates = response.rates[format(lastDayOfMonth(month), YMD)] || {}

          for (let symbol of symbols) {
            result[symbol].history[format(month, YM)] = rates[symbol]
          }
        }
      }
    }
    return result
  },
}
