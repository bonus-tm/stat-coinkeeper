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

<script>
import {loadData} from '../services/csv'

const MAX_FILE_SIZE = 1024 ** 2

export default {
  name: 'UploadFile',
  data () {
    return {
      dragover: false
    }
  },
  emits: ['import'],
  methods: {
    onDrop (e) {
      this.dragover = false
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
        let data = loadData(reader.result)
        this.$emit('import', {timestamp: file.lastModified, data})
      }
      reader.readAsText(file)
    },
    openChooseFile () {
      this.$refs.fileInput.click()
    },
  }
}
</script>

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
