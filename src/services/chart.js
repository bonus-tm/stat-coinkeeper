import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const MultiStringAxisLabels = {
  id: 'labels-split',
  beforeInit (chart) {
    // console.log('beforeInit', chart)
    chart.data.xLabels?.forEach((value, i, labels) => {
      if (/\n/.test(value)) {
        labels[i] = value.split(/\n/)
      }
    })
  },
}

Chart.register(
  Legend,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ChartDataLabels,
  BarController,
  BarElement,
  MultiStringAxisLabels,
)
