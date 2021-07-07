<template>
  <div
    class="heap-title"
    :style="{color: titleColor, backgroundColor: bgColor}"
  >
    <h3>{{ heap.title }}</h3>
    <div v-if="editable" v-editor>
      <a href="#" @click.prevent>
        <Icon icon="edit" />
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
            <Icon icon="remove" />
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
    <Coin
      v-for="coin of heap.coins"
      :key="`money-acc-${coin.id}`"
      :coin="coin"
      @click="remove(coin.id)"
    />
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling
import {palette, state} from '../services/store'
import Coin from './Coin.vue'
import Icon from './Icon.vue'

export default {
  name: 'HeapOfCoins',
  components: {Icon, Coin},
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
    editable: {type: Boolean, default: false},
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
      let coin = JSON.parse(e.dataTransfer.getData('text'))

      let inHeap = props.modelValue.coins.find(cat => cat.id === coin.id)
      let isAcceptedType =
        (props.modelValue.type === 'accounts' && coin.type === 'account') ||
        (props.modelValue.type === 'operations' && ['income', 'expense'].includes(coin.type))

      if (isAcceptedType && !inHeap) {
        props.modelValue.coins.push(coin)
      }
    }
    let remove = coinId => {
      let i = props.modelValue.coins.findIndex(cat => cat.id === coinId)
      if (i !== -1) props.modelValue.coins.splice(i, 1)
    }
    let setColor = color => {
      props.modelValue.color.border = color
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
    grid-template-columns: repeat(4, var(--coin-container-width));
    width: calc(4 * var(--coin-container-width));
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
    width: calc(4 * var(--coin-container-width) + 2px);
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
