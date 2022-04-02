<script setup>
import {computed} from 'vue'
import {formatDistanceToNow, lightFormat} from 'date-fns'
import {ru} from 'date-fns/locale'
import {clearData, fillData, hasData, lastOperationDate, ready} from '@/services/store'

import AnalyzeAccounts from '@/components/AnalyzeAccounts.vue'
import AnalyzeExpenses from '@/components/AnalyzeExpenses.vue'
import AnalyzeIncomes from '@/components/AnalyzeIncomes.vue'
import AnalyzeIncomesVsExpenses from '@/components/AnalyzeIncomesVsExpenses.vue'
import UploadFile from '@/components/UploadFile.vue'

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
    <div>
      <div v-if="hasData">
        Последняя операция
        {{ dataExportedAgo }},
        {{ lightFormat(lastOperationDate, 'dd.MM.yyyy') }}
      </div>
    </div>
    <h1>Статистика из Coin Keeper</h1>
    <div>
      <button v-if="hasData" @click="clearData">
        Очистить только данные
      </button>
      &nbsp;
      <button v-if="hasData" @click="reset">
        Удалить всё
      </button>
    </div>
  </header>

  <main>
    <p v-if="!ready">
      Loading...
    </p>
    <template v-if="ready">
      <UploadFile v-if="!hasData" @import="fillData" />

      <template v-if="hasData">
        <AnalyzeIncomesVsExpenses />
        <AnalyzeIncomes />
        <AnalyzeExpenses />
        <AnalyzeAccounts />
      </template>
    </template>
  </main>

  <footer>
    <p>
      Все данные хранятся только в браузере и никуда не передаются.
      Сайт только загружается с сервера и больше с ним не взаимодействует.
    </p>
  </footer>
</template>
