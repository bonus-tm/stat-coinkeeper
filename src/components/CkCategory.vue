<template>
  <div
    :class="`ck-category_${type}`"
    class="ck-category"
    draggable="true"
    @ondragstart="onDragStart"
  >
    <div class="ck-category__icon-wrapper">
      <div class="ck-category__fill" style="height: 100%;" />
      <div class="ck-category__icon" :class="`ck-category__icon_${icon.toLowerCase()}`" />
    </div>
    <div class="ck-category__title">
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CkCategory',
  props: {
    type: {
      type: String,
      required: true,
      validator (value) {
        return ['income', 'account', 'expense'].includes(value)
      }
    },
    icon: {type: String, required: true},
    title: {type: String, required: true},
  },
  methods: {
    onDragStart (e) {
      e.dataTransfer.setData('text/plain', null)
    },
  }
}
</script>
