<script setup>
import {dragging} from '@/services/store'

const props = defineProps({
  coin: {type: Object, required: true},
})
const onDragStart = e => {
  dragging.value = true
  e.dataTransfer.setData('text', JSON.stringify(props.coin))
}
const onDragEnd = () => {
  dragging.value = false
}
</script>

<template>
  <div
    :class="`ck-coin_${coin.type}`"
    class="ck-coin"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="ck-coin__icon-wrapper">
      <div class="ck-coin__fill" style="height: 100%;" />
      <div
        :class="`ck-coin__icon_${coin.icon.toLowerCase()}`"
        class="ck-coin__icon"
      />
    </div>
    <div class="ck-coin__title">
      {{ coin.title }}
    </div>
  </div>
</template>
