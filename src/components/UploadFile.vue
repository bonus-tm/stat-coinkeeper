<script setup>
import {ref} from 'vue'
import {loadData} from '@/services/csv'

const emit = defineEmits(['import'])

const MAX_FILE_SIZE = 5 * (1024 ** 2)

const dragover = ref(false)
const fileInput = ref(null)

const onDrop = e => {
  dragover.value = false
  let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]
  // console.log(file)

  if (file.type !== 'text/csv') {
    alert('Годятся только CSV-файлы')
    return
  }
  if (file.size > MAX_FILE_SIZE) {
    alert(`Файл великоват — ${file.size} байт,\nа можно максимум ${MAX_FILE_SIZE} байт`)
    return
  }

  let reader = new FileReader()
  reader.onload = () => {
    try {
      emit('import', loadData(reader.result))
    } catch (error) {
      alert(
        'Какая-то ошибка при импорте данных.\n' +
        'Надо копаться в консоли и разбираться.\n' +
        'csv.loadData failed'
      )
      console.log('csv.loadData failed', {error})
    }
  }
  reader.readAsText(file)
}

const openChooseFile = () => {
  fileInput.value.click()
}
</script>

<template>
  <p>
    Инструкция по экспорту данных:
    <a
      href="https://ruhelp.coinkeeper.me/4e4288b6e3ad4b349aab0e7b55d12d99"
      target="_blank"
    >
      ruhelp.coinkeeper.me/4e4288b6e3ad4b349aab0e7b55d12d99
    </a>
  </p>
  <div
    class="dropzone"
    :class="{dragover}"
    @dragover.prevent="dragover = true"
    @dragleave="dragover = false"
    @drop.stop.prevent="onDrop"
    @click="openChooseFile"
  >
    <p>Сюда надо бросить csv-файл, эскспортированный из CoinKeeper'а.</p>
    <input
      ref="fileInput"
      name="csv"
      type="file"
      @change="onDrop"
    >
  </div>
</template>

<style scoped>
p {
  text-align: center;
}
.dropzone {
  position: absolute;
  top: 3rem;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  border: 4px dashed mediumslateblue;
  border-radius: 0.5rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dragover {
  background-color: var(--dropzone-hover-bg-color);
  opacity: 0.5;
}
input {
  display: none;
}
</style>
