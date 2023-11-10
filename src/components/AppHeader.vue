<script setup>
import {computed} from 'vue'
import {formatDistanceToNow, lightFormat} from 'date-fns'
import {ru} from 'date-fns/locale'

import {appSettings, clearData, currencyRates, hasData, lastOperationDate} from '@/services/store'
import {TIME_STEPS} from '@/constants'

import ProgressBar from '@/components/ProgressBar.vue'
import SlidePanel from '@/components/SlidePanel.vue'

let dataExportedAgo = computed(() => {
  if (!lastOperationDate.value) return ''
  return formatDistanceToNow(
    lastOperationDate.value,
    {addSuffix: true, locale: ru},
  )
})

const reset = () => {
  return confirm(
    'Удалить всю инфу и настройки?\n' +
    'Будут удалены все данные, кучи и их настройки цвета, названия прочее.',
  )
}

</script>

<template>
  <header>
    <SlidePanel title="Настройки">
      <template #activator="{on}">
        <button class="hamburger" v-on="on">
          <div />
        </button>
      </template>
      <template #content>
        <h4>Шаг графиков</h4>
        <label v-for="step in TIME_STEPS" :key="step.value" class="radio">
          <input v-model="appSettings.timeStep" :value="step.value" type="radio">
          <span>{{ step.title }}</span>
        </label>

        <h4>Дополнять графики до целого года</h4>
        <label class="radio">
          <input v-model="appSettings.roundToWholeYear" :value="true" type="radio">
          <span>Дополнять пустым</span>
        </label>
        <label class="radio">
          <input v-model="appSettings.roundToWholeYear" :value="false" type="radio">
          <span>Начинать и заканчивать по заполненным месяцам/кварталам</span>
        </label>
      </template>
    </SlidePanel>
    <div>
      <transition name="fade" mode="out-in">
        <div v-if="currencyRates.status === 'loading'" class="currency-message">
          <div>Обновление курсов валют...</div>
          <ProgressBar :current="currencyRates.progress" />
        </div>
        <div v-else-if="hasData">
          Последняя операция
          {{ dataExportedAgo }},
          {{ lightFormat(lastOperationDate, 'dd.MM.yyyy') }}
        </div>
      </transition>
    </div>
    <h1>Статистика из Coin Keeper</h1>
    <div class="data-buttons">
      <button v-if="hasData" class="btn" @click="clearData">
        Очистить только данные
      </button>
      <button v-if="hasData" class="btn" @click="reset">
        Удалить всё
      </button>
    </div>
  </header>
</template>

<style scoped>
header {
  --gap: 1rem;
  background:
    linear-gradient(90deg, var(--nav-bg) 20%, transparent 40% 55%, var(--nav-bg) 75%),
    repeating-linear-gradient(-50deg, var(--ornament) 1px 1px, transparent 2px 10px, var(--ornament) 11px),
    repeating-linear-gradient(50deg, var(--ornament) 1px 1px, transparent 2px 10px, var(--ornament) 11px);
  color: var(--nav-color);
  padding: 0 1rem;
  display: grid;
  grid-template-columns: max-content 1fr max-content 1fr;
  align-items: center;
  gap: var(--gap);
}
h4 {
  margin: 1.5em 0 0.5em;
}
.data-buttons {
  justify-self: end;
  display: flex;
  gap: var(--gap);
}

label.radio {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
}
.currency-message {
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.25rem;
}
</style>
