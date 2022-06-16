<script setup>
import {computed} from 'vue'
import {formatDistanceToNow, lightFormat} from 'date-fns'
import {ru} from 'date-fns/locale'
import {lastOperationDate, hasData, clearData} from '@/services/store.js'
import SlidePanel from '@/components/SlidePanel.vue'

let dataExportedAgo = computed(() => {
  if (!lastOperationDate.value) return ''
  return formatDistanceToNow(
    lastOperationDate.value,
    {addSuffix: true, locale: ru}
  )
})

const reset = () => {
  return confirm(
    'Удалить всю инфу и настройки?\n' +
    'Будут удалены все данные, кучи и их настройки цвета, названия прочее.'
  )
}

</script>

<template>
  <header>
    <SlidePanel title="WTF">
      <template #activator="{on}">
        <button class="hamburger" v-on="on"><div /></button>
      </template>
      <template #content>
        <p>WTF yo!</p>
      </template>
    </SlidePanel>
    <div>
      <div v-if="hasData">
        Последняя операция
        {{ dataExportedAgo }},
        {{ lightFormat(lastOperationDate, 'dd.MM.yyyy') }}
      </div>
    </div>
    <h1>Статистика из Coin Keeper</h1>
    <div>
      <button v-if="hasData" class="btn" @click="clearData">
        Очистить только данные
      </button>
      &nbsp;
      <button v-if="hasData" class="btn" @click="reset">
        Удалить всё
      </button>
    </div>
  </header>
</template>

<style scoped>
header {
  background:
    linear-gradient(90deg, var(--nav-bg) 20%, transparent 40% 55%, var(--nav-bg) 75%),
    repeating-linear-gradient(-50deg, var(--ornament) 1px 1px, transparent 2px 10px, var(--ornament) 11px),
    repeating-linear-gradient(50deg, var(--ornament) 1px 1px, transparent 2px 10px, var(--ornament) 11px);
  color: var(--nav-color);
  padding: 0 1rem;
  display: grid;
  grid-template-columns: max-content max-content auto max-content;
  align-items: center;
}
</style>
