<script setup>
import {computed} from 'vue'

const props = defineProps({
  current: {type: Number, default: 0},
  total: {type: Number, default: 1},
})
const fill = computed(() => {
  return (100 * props.current / props.total).toString() + '%'
})
</script>

<template>
  <div class="progress-bar-container">
    <div class="progress-bar" />
  </div>
</template>

<style scoped>
.progress-bar-container {
  position: relative;
}
.progress-bar {
  height: var(--progress-bar-height);
  border-radius: var(--progress-bar-height);
  position: relative;
  overflow: hidden;
  background-image: repeating-linear-gradient(
    -45deg,
    var(--progress-bar-bg1),
    var(--progress-bar-bg1) calc(2 * 1.414214 * var(--progress-bar-height)),
    var(--progress-bar-bg2) calc(2 * 1.414214 * var(--progress-bar-height)),
    var(--progress-bar-bg2) calc(4 * 1.414214 * var(--progress-bar-height))
  );
  background-size: calc(500 * var(--progress-bar-height)) 100%;
  animation: stripes 1s linear infinite;
}
.progress-bar:before {
  position: absolute;
  content: '';
  height: 100%;
  background-color: var(--progress-bar-fill);
  width: v-bind(fill);
}

@keyframes stripes {
  100% {
    background-position: calc(-8 * var(--progress-bar-height)) 0;
  }
}
</style>
