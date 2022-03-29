<script setup>
import {computed, toRefs} from 'vue'
import {format} from '@/services/numerals'

const props = defineProps({
  data: {type: Array, required: true},
  fieldColor: {type: String, default: 'color'},
  fieldTitle: {type: String, default: 'title'},
  fieldValue: {type: String, default: 'value'},
})

let {data, fieldColor, fieldTitle, fieldValue} = toRefs(props)

let totalValue = computed(() => {
  return data.value.reduce((total, sector) => {
    total += sector[fieldValue.value]
    return total
  }, 0)
})

const round = (value, precision = 0) => {
  if (Number.isNaN(value)) return 0
  return Math.round(value * 10 ** precision) / 10 ** precision
}

let sectors = computed(() => {
  let offset = 0
  return data.value
    .sort((a, b) => b.value - a.value)
    .map(piece => {
      let percent = round(100 * piece[fieldValue.value] / totalValue.value, 2)
      let sector = {
        offset,
        percent,
        value: piece[fieldValue.value],
        title: piece[fieldTitle.value],
        color: piece[fieldColor.value],
      }
      offset += sector.percent
      if (offset === 100 && percent > 0) {
        sector.percent += 1
      }
      return sector
    })
})
</script>

<template>
  <div class="pie-container">
    <svg viewBox="0 0 64 64" class="pie">
      <circle
        v-for="(slice, i) in sectors"
        :key="`circle-${i}`"
        r="25%"
        cx="50%"
        cy="50%"
        :stroke="slice.color"
        :stroke-dasharray="`${round(slice.percent, 2)} 100`"
        :stroke-dashoffset="`${-round(slice.offset, 2)}`"
      ></circle>
    </svg>
    <div class="pie-legend">
      <template v-for="(sector, i) in sectors" :key="`legend-${i}`">
        <div
          :style="{backgroundColor: sector.color}"
          class="pie-legend-color"
        />
        <div>{{ sector.title }}</div>
        <div class="pie-legend-value">
          {{ round(100 * sector.value / totalValue, 1) }}%
        </div>
        <div class="pie-legend-value">
          {{ format(round(sector.value, 0)) }}<span style="margin-left: 1.5px;">₽</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.pie-container {
  display: flex;
}
.pie-legend {
  margin-left: 1rem;
  display: grid;
  grid-template-columns: 30px repeat(3, auto);
  gap: 0.5rem 1rem;
  align-content: center;
}
.pie-legend-value {
  text-align: right;
}
.pie-legend-color {
  width: 30px;
  height: 1rem;
  border-radius: 1px;
}
.pie {
  width: 150px;
  transform: rotate(-90deg);
  background-color: rgba(40, 40, 40, 0.1);
  border-radius: 50%;
}
@media (prefers-color-scheme: dark) {
  .pie {
    background-color: rgba(230, 230, 230, 0.1);
  }
}

.pie circle {
  fill: none;
  stroke-width: 32;
}
</style>
