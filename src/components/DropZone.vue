<template>
  <div
    class="heap-title"
    :style="{color: titleColor, backgroundColor: bgColor}"
  >
    <h3>{{ heap.title }}</h3>
    <div v-editor>
      <!-- TODO: prevent default, make icon component maybe? -->
      <a href="#">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-pencil-square"
          viewBox="0 0 16 16"
        >
          <path
            d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
          />
          <path
            fill-rule="evenodd"
            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
          />
        </svg>
      </a>
      <div>
        <div>
          <input type="text" v-model="heap.title">
        </div>
        <div class="palette-grid">
          <div
            v-for="(color, i) in palette"
            :key="`c-${i}`"
            :style="{backgroundColor: color}"
            class="palette-color"
            @click="setColor(color)"
          />
        </div>
        <div style="margin-top: 1rem;text-align: right">
          <button @click="$emit('remove')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
            Удалить кучу
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="dropzone" :style="{borderColor: bgColor}">
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
import {computed, ref} from 'vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling
import {palette, state} from '../services/store'
import CkCategory from './CkCategory.vue'

export default {
  name: 'DropZone',
  components: {CkCategory},
  directives: {
    editor: {
      mounted (el) {
        tippy(el.querySelector('a'), {
          allowHTML: true,
          content: el.querySelector('div'),
          hideOnClick: true,
          interactive: true,
          placement: 'right-start',
          trigger: 'click',
          onShown (instance) {
            instance.popper.querySelector('.tippy-content input').focus()
          },
        })
      }
    },
  },
  props: {
    titleColor: {type: String, default: 'black'},
    modelValue: {type: Object, default () {return {}}},
  },
  emits: ['update:modelValue', 'remove'],
  setup (props, {emit}) {
    let dragging = computed(() => state.dragging)
    let dragover = ref(false)
    let heap = computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value),
    })

    let bgColor = computed(() => props.modelValue?.color?.border || palette[0])

    let onDragEnter = () => {
      dragover.value = true
    }
    let onDragLeave = () => {
      dragover.value = false
    }
    let onDrop = e => {
      e.preventDefault()
      dragover.value = false
      let category = JSON.parse(e.dataTransfer.getData('text'))

      let inHeap = props.modelValue.categories.find(cat => cat.id === category.id)
      let isAcceptedType =
        (props.modelValue.type === 'accounts' && category.type === 'account') ||
        (props.modelValue.type === 'operations' && ['income', 'expense'].includes(category.type))

      if (isAcceptedType && !inHeap) {
        props.modelValue.categories.push(category)
      }
    }
    let remove = categoryId => {
      let i = props.modelValue.categories.findIndex(cat => cat.id === categoryId)
      if (i !== -1) props.modelValue.categories.splice(i, 1)
    }
    let setColor = color => {
      props.modelValue.titleBg = color
    }

    return {
      bgColor,
      palette,
      dragging,
      dragover,
      heap,
      onDragEnter,
      onDragLeave,
      onDrop,
      remove,
      setColor,
    }
  },
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

  .heap-title {
    display: grid;
    grid-template-columns: auto 1.5rem;
    align-items: center;
    margin-top: 1rem;
    width: calc(4 * var(--category-container-width) + 2px);
  }
  .heap-title a {
    color: #000;
    padding: 0.2rem;
  }
  h3 {
    font-weight: 400;
    margin: 0;
    padding: 0.2rem;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }

  .palette-grid {
    display: grid;
    grid-template-columns: repeat(3, 2rem);
    margin-top: 1rem;
    gap: 2px;
  }
  .palette-color {
    height: 2rem;
  }
</style>
