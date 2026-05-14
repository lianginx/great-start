<script setup lang="ts">
const now = ref(new Date())

const date = computed(() => {
  return now.value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long'
  })
})

const time = computed(() => {
  return now.value.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
})

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(
    () => { now.value = new Date() },
    1000
  )
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="text-center">
    <div class="text-6xl font-bold font-mono">{{ time }}</div>
    <div class="text-lg text-gray-500 mt-2">{{ date }}</div>
  </div>
</template>
