<script setup>
import {fillData, hasData, ready} from '@/services/store'

import AnalyzeAccounts from '@/components/AnalyzeAccounts.vue'
import AnalyzeExpenses from '@/components/AnalyzeExpenses.vue'
import AnalyzeIncomes from '@/components/AnalyzeIncomes.vue'
import AnalyzeIncomesVsExpenses from '@/components/AnalyzeIncomesVsExpenses.vue'
import AppHeader from '@/components/AppHeader.vue'
import UploadFile from '@/components/UploadFile.vue'
</script>

<template>
  <AppHeader />

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
