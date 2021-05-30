<template>
  <div class="pie-container">
    <div class="pie-legend">
      <template v-for="(sector, i) in sectors" :key="`legend-${i}`">
        <div
          :style="{backgroundColor: palette[i]}"
          class="pie-legend-color"
        />
        <div>{{ sector.title }}</div>
        <div class="pie-legend-value">
          {{ round(100 * sector.value / totalValue, 1) }}%
        </div>
        <div class="pie-legend-value">
          {{ round(sector.value, 0) }}<span style="margin-left: 1.5px;">₽</span>
        </div>
      </template>
    </div>
    <svg viewBox="0 0 64 64" class="pie">
      <circle
        v-for="(slice, i) in sectors"
        :key="`circle-${i}`"
        r="25%"
        cx="50%"
        cy="50%"
        :stroke="palette[i]"
        :stroke-dasharray="`${round(slice.percent, 2)} 100`"
        :stroke-dashoffset="`${-round(slice.offset, 2)}`"
      ></circle>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'ChartPie',
  props: {
    data: {type: Array, required: true},
    fieldTitle: {type: String, default: 'title'},
    fieldValue: {type: String, default: 'value'},
  },
  data () {
    return {
      palette: [
        '#d70206',
        '#f05b4f',
        '#f4c63d',
        '#d17905',
        '#453d3f',
        '#59922b',
        '#0544d3',
        '#6b0392',
        '#f05b4f',
        '#dda458',
        '#eacf7d',
        '#86797d',
        '#b2c326',
        '#6188e2',
        '#a748ca',
      ]
    }
  },
  computed: {
    totalValue () {
      return this.data.reduce((total, sector) => {
        total += sector[this.fieldValue]
        return total
      }, 0)
    },
    sectors () {
      let offset = 0
      return this.data.map(piece => {
        let percent = this.round(100 * piece[this.fieldValue] / this.totalValue, 2)
        let sector = {
          offset,
          percent,
          value: piece[this.fieldValue],
          title: piece[this.fieldTitle]
        }
        offset += sector.percent
        if (offset === 100 && percent > 0) {
          sector.percent += 1
        }
        return sector
      })
    },
  },
  methods: {
    round (value, precision = 0) {
      if (Number.isNaN(value)) return 0
      return Math.round(value * 10 ** precision) / 10 ** precision
    },
  }
}
</script>

<style>
  .pie-container {
    display: flex;
  }
  .pie-legend {
    margin-right: 1rem;
    display: grid;
    grid-template-columns: 30px repeat(3, auto);
    column-gap: 0.5rem;
  }
  .pie-legend-value {
    text-align: right;
  }
  .pie-legend-color {
    width: 30px;
    height: 1rem;
    border-radius: 3px;
  }
  .pie {
    width: 150px;
    transform: rotate(-90deg);
  }

  .pie circle {
    fill: none;
    stroke-width: 32;
  }
</style>
