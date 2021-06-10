<template>
  <div>
    <vue-chart
      :data="chartData"
      :options="chartOptions"
      style="width: 900px;height: 600px;"
      type="line"
    />
  </div>
</template>

<script>
import {sumByMonths, createMonthAxis} from '../services/calculator'
import {readonly} from '../services/store'
import VueChart from '@seregpie/vue-chart'

const months = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
]

export default {
  name: 'AnalyzeIncomes',
  components: {VueChart},
  setup () {
    let chartOptions = {
      color: ['red', 'blue', 'green'],
      scales: {
        xAxes: [{
          type: 'category',
          gridLines: {
            borderDash: [1, 3],
            color: 'rgba(128,128,128,0.2)',
            zeroLineColor: 'rgba(128,128,128,0.5)',
            tickMarkLength: 5,
          },
        }],
        yAxes: [{
          type: 'linear',
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
          gridLines: {
            borderDash: [1, 2],
            color: 'rgba(128,128,128,0.2)',
            zeroLineColor: 'rgba(128,128,128,0.5)',
          },
        }]
      }
    }
    let monthAxis = createMonthAxis(readonly.operations)
    let data = sumByMonths(['Украшения', 'Материалы'], readonly.operations)
    let data2 = sumByMonths(['Айпеченье', 'Кхмер'], readonly.operations)
    for (let key of Object.keys(data)) {
      if (data[key] < 0) {
        data2[key] += data[key]
        data[key] = 0
      }

    }
    console.log(data)
    console.log(data2)
    let chartData = {
      labels: monthAxis.map((ym, i) => {
        let [y, m] = ym.split('-')
        return m === '0' || i === 0 ? `${months[m]} ${y}` : months[m]
      }),
      datasets: [
        {
          label: 'ай',
          data: monthAxis.map(ym => data2[ym]),
          borderColor: 'red',
          backgroundColor: 'rgba(250,50,20,0.5)',
        },
        {
          label: 'укр',
          data: monthAxis.map(ym => data[ym]),
          borderColor: 'orange',
          backgroundColor: 'rgba(250,150,20,0.5)',
        }
      ]
    }
    return {
      chartOptions,
      chartData,
    }
  }
}
</script>
