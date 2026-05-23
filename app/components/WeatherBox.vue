<script setup lang="ts">
import type { WeatherLive } from '@/composables/useWeather'

const { loadWeather, getCache } = useWeather()

const weather = ref<WeatherLive | null>(null)
const refreshing = ref(false)
const showTooltip = ref(false)
let hoverTimeout: ReturnType<typeof setTimeout>

function onEnter() {
  clearTimeout(hoverTimeout)
  showTooltip.value = true
}

function onLeave() {
  hoverTimeout = setTimeout(() => {
    showTooltip.value = false
  }, 150)
}

async function refresh() {
  if (refreshing.value)
    return
  refreshing.value = true
  try {
    weather.value = await loadWeather(undefined, true)
  }
  catch {
    // ignore
  }
  finally {
    refreshing.value = false
  }
}

onMounted(() => {
  const cached = getCache()
  if (cached) {
    weather.value = cached
    return
  }
  loadWeather().then((w) => {
    weather.value = w
  }).catch(() => {
    // ignore
  })
})

onUnmounted(() => {
  clearTimeout(hoverTimeout)
})
</script>

<template>
  <div
    class="relative text-xs text-[var(--text-muted)]"
  >
    <span>[</span>
    <span class="mr-1">weather:</span>
    <span
      v-if="weather" class="text-[var(--green-dim)] hover:text-[var(--green)]"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
    >
      {{ weather.city }} {{ weather.temperature }}℃ {{ weather.weather }}
    </span>
    <span v-else class="opacity-40">
      no data
    </span>
    <span>]</span>

    <Transition name="popover">
      <div
        v-if="showTooltip && weather"
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-[var(--bg-secondary)] border border-[var(--border)] shadow-lg z-10"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
      >
        <div class="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
          <span class="text-[var(--green)] text-xs">Weather</span>
          <button
            class="px-2 py-1 -mr-1 text-[var(--text-muted)] hover:text-[var(--green)] transition-colors"
            :class="{ 'animate-spin': refreshing }"
            :disabled="refreshing"
            @click.stop="refresh"
          >
            ↻
          </button>
        </div>
        <div class="p-3 space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">温度</span>
            <span>{{ weather.temperature }}℃</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">湿度</span>
            <span>{{ weather.humidity }}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">风向</span>
            <span>{{ weather.winddirection }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">风力</span>
            <span>{{ weather.windpower }}级</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">时间</span>
            <span class="tabular-nums">{{ weather.reporttime }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.popover-enter-active,
.popover-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
