import localForage from 'localforage'
import {format, isThisMonth, isToday, subDays} from 'date-fns'

import {date2ym, lastDaysOfMonth} from '@/services/dates'
import fetchUrl from '@/services/fetch'
import {currencyRates} from '@/services/store'

const SAVE_KEY = 'currencies'
const API_BASE_URL = 'https://www.cbr-xml-daily.ru'
const DEFAULT_HISTORY_START_DATE = new Date(2019, 0, 1)

/**
 * Достать сохранённые локально данные.
 * Проверить наличие данных и их свежесть.
 *
 * 1. Базовая валюта (base) должна совпадать — вычеркнуть этот пункт
 *
 * 2. Список валют (symbols) должен содержать нужные.
 *  Если не хватает, то загрузить всё заново:
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
 *  baseCurrency: 'RUB'
 *  updatedAt: <timestamp>,
 *  _rates: {
 *    '2019-01': {USD: 0.015286, EUR: 0.0102365, ...},
 *    '2019-02': {USD: 0.015286, EUR: 0.0102365, ...},
 *    ...
 *  }
 */

/**
 * Запрос курсов для списка валют. Если дата не указана, то запрашивать текущие курсы.
 * @param symbols {string[]} список валют
 * @param [date] {Date} опциональная дата, на которую запрашивать курсы
 * @return {{}|false}
 */
const fetchRates = async (symbols, date) => {
  let url = API_BASE_URL
  if (date && !isThisMonth(date)) {
    url += `/archive/${format(date, 'yyyy/MM/dd')}`
  }
  url += '/daily_json.js'
  console.log(`fetch rates from '${url}'`)
  let response = await fetchUrl(url)
  if (response.Valute) {
    let rates = {}
    for (let symbol of symbols) {
      rates[symbol] = response.Valute[symbol].Value
    }
    return rates
  } else {
    console.warn('Fetch rates problem:', response)
    return false
  }
}

export default {
  _rates: {},
  updatedAt: null,

  async init (symbols = ['USD', 'EUR'], startDate = DEFAULT_HISTORY_START_DATE) {
    currencyRates.value.status = 'loading'
    await this._restore()

    let months = lastDaysOfMonth(startDate, new Date())

    if (this._isUpdateRequired(symbols, months)) {
      await this._updateRates(symbols, months)
      await this._save()
    }

    console.log('Currency rates initialized', this._rates)
    currencyRates.value.status = 'ready'
  },

  rate (symbol, month) {
    return this._rates[month ?? date2ym(new Date())]?.[symbol]
  },

  _save () {
    return localForage.setItem(SAVE_KEY, {
      base: this.baseCurrency,
      rates: this._rates,
      updatedAt: Date.now(),
    })
  },

  async _restore () {
    let {
      base = '',
      rates = {},
      updatedAt = null,
    } = (await localForage.getItem(SAVE_KEY)) || {}
    this.baseCurrency = base
    this.updatedAt = updatedAt
    this._rates = rates
  },

  _isUpdateRequired (symbols, months) {
    if (!isToday(new Date(this.updatedAt))) {
      return true
    }
    for (let month of Object.keys(months)) {
      if (!this._rates[month]) {
        return true
      }
      if (!symbols.every(s => !!this._rates[month][s])) {
        return true
      }
    }
  },

  /**
   * Обновить курсы с сервера
   * @param symbols {string[]} список валют
   * @param months {{}} объект со списком последних дней месяцев {'2019-01': Date, ...}
   * @return {Promise<void>}
   * @private
   */
  async _updateRates (symbols, months) {
    let totalRequests = 0
    let curMonth = 0
    let totalMonths = Object.keys(months).length
    for (let [month, lastDayOfMonth] of Object.entries(months)) {
      if (
        !this._rates[month] ||
        !symbols.every(s => !!this._rates[month][s]) ||
        isThisMonth(lastDayOfMonth)
      ) {
        let dayRates = await fetchRates(symbols, lastDayOfMonth)
        totalRequests++
        let shiftDays = 1
        while (!dayRates && shiftDays <= 3) {
          dayRates = await fetchRates(symbols, subDays(lastDayOfMonth, shiftDays))
          shiftDays++
          totalRequests++
        }
        this._rates[month] = dayRates
      }
      curMonth++
      currencyRates.value.progress = curMonth / totalMonths
    }
    console.log('update rates completed', {totalMonths, totalRequests})
  },
}
