import JSZip from 'jszip'
import localForage from 'localforage'

const ECB_URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.zip'
const ECB_FILE = 'eurofxref-hist.csv'

const CORS_PROXY = 'http://localhost:8080/'

const SAVE_KEY = 'ecb-currencies'

export default {
  _currencies: {},
  baseCurrency: '',
  loading: false,
  loaded: false,

  async init (
    base = 'RUB',
    symbols = ['RUB', 'USD', 'EUR'],
    startDate = new Date(2019, 0, 1)
  ) {
    this.loading = true



    this.loading = false
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
      base: this.baseCurrency,
      currencies: this._currencies,
    })
  },

  async _restore () {
    let {
      base = '',
      currencies = {}
    } = (await localForage.getItem(SAVE_KEY)) || {}
    this.baseCurrency = base
    this._currencies = currencies
  },

  async _load () {
    let response = {}
    try {
      response = await fetch(CORS_PROXY + ECB_URL)
    } catch (e) {
      console.warn('Fetch currencies history failed')
      console.log({e})
    }

    if (response.ok) {
      let buffer = await response.arrayBuffer()
      console.log({buffer})

      let zipper = new JSZip
      let zip = await zipper.loadAsync(buffer)
      let csv = await zip.file(ECB_FILE).async('string')

      console.log({csv})
    }
  },

  _parse_csv (csv, symbols, startDate) {
    let rows = csv.split('\n')
    let titlesRow = rows.shift().split(',')

    let currencies = {}
    let indexes = {date: 0}
    for (let symbol of symbols) {
      currencies[symbol] = {
        latest: null,
        updatedAt: null,
        history: {},
      }
      let i = titlesRow.indexOf(symbol)
      if (i !== -1) {
        indexes[symbol] = i
      }
    }
    console.log(indexes)



    for (let row of rows) {
      row = row.split(',')
      let ymd = row[indexes.date]
      let date = new Date(ymd)
      if (date < startDate) break

      for (let symbol of symbols) {
        let value = row[indexes[symbol]]
        currencies[symbol].latest ??= value
        currencies[symbol].updatedAt ??= Date.now()
        currencies[symbol].history[ymd] = value
      }
    }
    console.log(currencies)
    return currencies
  }
}
