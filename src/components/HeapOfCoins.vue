<script setup>
import {computed, ref, toRefs} from 'vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling
import {colors, dragging} from '@/services/store'
import Coin from '@/components/Coin.vue'
import Icon from '@/components/Icon.vue'

const vEditor = {
  mounted (el) {
    tippy(el.querySelector('a.show-editor'), {
      allowHTML: true,
      content: el.querySelector('div'),
      hideOnClick: true,
      interactive: true,
      placement: 'right-start',
      trigger: 'click',
      onShown (instance) {
        instance.popper.querySelector('.tippy-content input')?.focus()
      },
    })
  }
}
const props = defineProps({
  changeableColor: {type: Boolean, default: false},
  editable: {type: Boolean, default: false},
  modelValue: {type: Object, default () {return {}}},
  movable: {type: Boolean, default: false},
  removable: {type: Boolean, default: false},
  renameable: {type: Boolean, default: false},
  titleColor: {type: String, default: 'black'},
})
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown'])

let dragover = ref(false)
let heap = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

let bgColor = computed(() => {
  return props.modelValue?.color?.border || colors.value.palette[0]
})

let showEditor = computed(() => {
  return props.editable ||
    props.renameable ||
    props.removable ||
    props.changeableColor
})

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
</script>

<template>
  <div class="heap" :style="{borderColor: bgColor}">
    <div
      class="heap-title"
      :style="{color: titleColor, backgroundColor: bgColor}"
    >
      <h3>{{ heap.title }}</h3>

      <div v-if="movable">
        <a href="#" @click.prevent="$emit('moveUp')">
          <Icon icon="arrow-up" />
        </a>
      </div>
      <div v-else />
      <div v-if="movable">
        <a href="#" @click.prevent="$emit('moveDown')">
          <Icon icon="arrow-down" />
        </a>
      </div>
      <div v-else />

      <div v-if="showEditor" v-editor>
        <a href="#" class="show-editor" @click.prevent>
          <Icon icon="edit" />
        </a>
        <div>
          <div v-if="editable || renameable">
            <input type="text" v-model="heap.title">
          </div>
          <div v-if="editable || changeableColor" class="palette-grid">
            <div
              v-for="(color, i) in colors.palette"
              :key="`c-${i}`"
              :style="{backgroundColor: color}"
              class="palette-color"
              @click="setColor(color)"
            />
          </div>
          <div v-if="editable || removable" style="margin-top: 1rem;text-align: right">
            <button @click="$emit('remove')">
              <Icon icon="remove" />
              Удалить кучу
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="dropzone ck-coins-container">
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
  </div>
</template>

<style scoped>
.heap {
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
  margin-bottom: 1rem;
}
.heap-title {
  display: grid;
  grid-template-columns: auto repeat(3, 1.5rem);
  align-items: center;
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

.dropzone {
  position: relative;
  min-height: 4rem;
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
</style>
