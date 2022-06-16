<script setup>
import {ref} from 'vue'

defineProps({
  title: {type: String, default: ''},
})

const show = ref(false)
const on = {
  click() {
    show.value = true
  },
}
</script>

<template>
  <slot name="activator" :on="on">
    <button class="btn" v-on="on">
      Open slider
    </button>
  </slot>

  <teleport to="body">
    <transition name="fade">
      <div v-if="show" class="cover" @click="show = false" />
    </transition>
    <div class="panel" :class="{show}">
      <h2>
        <span>{{ title }}</span>
        <button class="close" @click="show = false">×</button>
      </h2>
      <slot name="content" />
    </div>
  </teleport>
</template>

<style scoped>
.cover {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: var(--panel-cover);
}
.panel {
  --width: 300px;
  --extra-shift: 50px;
  position: fixed;
  overflow: hidden;
  top: 0;
  bottom: 0;
  left: calc(-1 * var(--width) - var(--extra-shift));
  width: var(--width);
  transition: transform 0.2s ease-out;
  background: var(--bg-color);
  z-index: 10;
  padding: 1rem 1rem 0;
  box-shadow: var(--panel-shadow);
}
.panel.show {
  transform: translateX(calc(var(--width) + var(--extra-shift)));
}

h2 {
  margin-block-start: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
