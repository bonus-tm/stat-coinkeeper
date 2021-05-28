<template>
  <div
    :class="`ck-category_${category.type}`"
    class="ck-category"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="ck-category__icon-wrapper">
      <div class="ck-category__fill" style="height: 100%;" />
      <div
        :class="`ck-category__icon_${category.icon.toLowerCase()}`"
        class="ck-category__icon"
      />
    </div>
    <div class="ck-category__title">
      {{ category.title }}
    </div>
  </div>
</template>

<script>
import {state} from '../services/store'

export default {
  name: 'CkCategory',
  props: {
    category: {type: Object, required: true},
  },
  methods: {
    onDragStart (e) {
      state.dragging = true
      e.dataTransfer.setData('text', JSON.stringify(this.category))
    },
    onDragEnd () {
      state.dragging = false
    },
  }
}
</script>
