<script setup>
import CoinsAccounts from './CoinsAccounts.vue'
import CoinsOperations from './CoinsOperations.vue'

defineProps({
  accounts: {type: Boolean},
  operations: {type: Boolean},
  show: {type: Boolean},
  title: {type: String, default: ''},
})
const emit = defineEmits(['update:show'])
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="show"
        class="cover"
        @click="emit('update:show', false)"
      />
    </transition>
    <div class="panel" :class="{show}">
      <h2>{{ title }}</h2>
      <div class="panel-coins">
        <CoinsAccounts v-if="accounts" />
        <CoinsOperations v-if="operations" />
      </div>
      <div class="panel-heaps">
        <slot />
      </div>
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
  --width: calc(2 * var(--coins-container-width) + 4rem);
  --extra-shift: 100px;
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
  display: grid;
  align-content: start;
  grid-template-columns: repeat(2, var(--coins-container-width));
  grid-template-areas: 'title title' 'coins heaps';
  column-gap: 1rem;
}
.panel.show {
  transform: translateX(calc(var(--width) + var(--extra-shift)));
}

h2 {
  grid-area: title;
}
.panel-coins {
  grid-area: coins;
  overflow-y: scroll;
}
.panel-heaps {
  grid-area: heaps;
  overflow-y: scroll;
}
</style>
