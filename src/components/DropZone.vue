<template>
  <h3 :style="{color: titleColor, backgroundColor: titleBg}">
    <slot name="title">
      Dropzone
    </slot>
  </h3>
  <div class="dropzone" :style="{borderColor: titleBg}">
    <div
      v-show="dragging"
      class="dz-cover"
      :class="{dragover}"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="$event.preventDefault()"
      @drop="onDrop"
    />
    <ck-category
      v-for="category of heap.categories"
      :key="`money-acc-${category.id}`"
      :category="category"
      @click="remove(category.id)"
    />
  </div>
</template>

<script>
import {state} from '../services/store'
import CkCategory from './CkCategory.vue'

export default {
  name: 'DropZone',
  components: {CkCategory},
  props: {
    titleColor: {type: String, default: 'black'},
    titleBg: {type: String, default: 'darkgray'},
    heap: {type: Object, required: true},
  },
  data () {
    return {
      dragover: false
    }
  },
  computed: {
    dragging () {
      return state.dragging
    }
  },
  methods: {
    onDragEnter () {
      this.dragover = true
    },
    onDragLeave () {
      this.dragover = false
    },
    onDrop (e) {
      e.preventDefault()
      this.dragover = false
      let category = JSON.parse(e.dataTransfer.getData('text'))

      let inHeap = this.heap.categories.find(cat => cat.id === category.id)
      let isAcceptedType =
        (this.heap.type === 'accounts' && category.type === 'account') ||
        (this.heap.type === 'operations' && ['income', 'expense'].includes(category.type))

      if (isAcceptedType && !inHeap) {
        this.heap.categories.push(category)
      }
    },
    remove (categoryId) {
      let i = this.heap.categories.findIndex(cat => cat.id === categoryId)
      if (i !== -1) this.heap.categories.splice(i, 1)
    },
  }
}
</script>

<style scoped>
  .dropzone {
    position: relative;
    border: 1px solid red;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    min-height: 4rem;
    display: grid;
    grid-template-columns: repeat(4, var(--category-container-width));
    width: calc(4 * var(--category-container-width));
  }
  .dz-cover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--dropzone-hover-bg-color);
    opacity: 0.2;
    z-index: 10;
  }
  .dragover {
    background-color: var(--dropzone-hover-bg-color);
    opacity: 0.5;
  }

  h3 {
    font-weight: 400;
    text-align: center;
    width: calc(4 * var(--category-container-width) + 2px);
    margin: 1rem 0 0;
    padding: 0.2rem 0;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }
</style>
