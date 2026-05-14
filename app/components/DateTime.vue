<script setup lang="ts">
const now = ref(new Date())

const date = computed(() => {
  return now.value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
  })
})

const time = computed(() => {
  return now.value.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
})

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="text-center animate-fade-in">
    <div class="flex items-center justify-center gap-2 mb-2">
      <span class="text-[var(--green)] text-sm">></span>
      <span class="text-[var(--text-muted)] text-sm">date</span>
    </div>
    <div class="text-6xl font-bold font-mono tabular-nums tracking-wider">
      {{ time }}
    </div>
    <div class="text-[var(--green-dim)] mt-3 text-sm tracking-wide">
      {{ date }}
    </div>
    <div class="flex items-center justify-center gap-1 mt-4">
      <span class="text-[var(--green)] animate-blink">_</span>
    </div>
  </div>
</template>
