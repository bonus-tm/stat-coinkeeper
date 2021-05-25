<template>
  <div
    class="dropzone"
    @dragover.prevent="dragover = true"
    @dragleave="dragover = false"
    @drop.stop.prevent="onDrop"
    @click="openChooseFile"
  >
    <p>Сюда надо бросить файл *.csv, эскспортированный из CoinKeeper'а</p>
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
        let allData = loadData(reader.result)
        console.log(allData)
        this.$emit('load', allData)
      }
      reader.readAsText(file)
    },
    openChooseFile () {
      this.$refs.fileInput.click()
    },
  }
}
</script>

<style>
  .dropzone {
    border: 4px dashed mediumslateblue;
    border-radius: 0.5rem;
    margin: 5rem;
    padding: 2rem;
    min-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  input {
    display: none;
  }
</style>
