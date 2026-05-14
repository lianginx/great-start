<script setup lang="ts">
import type { Search } from '@/composables/useConfig'

const modelValue = defineModel<string>()

const { config } = useConfig()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const currentEngine = computed(() => {
  return config.value?.search[0]
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectEngine(engine: Search) {
  if (config.value) {
    const index = config.value.search.indexOf(engine)
    if (index > -1) {
      config.value.search.splice(index, 1)
      config.value.search.unshift(engine)
    }
  }
  isOpen.value = false
}

function search() {
  if (modelValue.value) {
    const searchUrl = config.value?.search.at(0)?.url.replaceAll('{keyword}', modelValue.value)
    window.open(searchUrl)
  }
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  inputRef.value?.focus()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative w-full lg:w-5/12 animate-fade-in" style="animation-delay: 0.1s">
    <!-- 输入框 -->
    <div class="flex items-center border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--text-muted)] transition-colors">
      <button
        class="px-4 py-3 text-[var(--green)] text-sm hover:text-[var(--green-dim)] transition-colors active:scale-[0.96]"
        @click="toggleDropdown"
      >
        {{ currentEngine?.name }}
      </button>
      <span class="text-[var(--text-muted)]">></span>
      <input
        ref="inputRef"
        v-model="modelValue"
        class="flex-1 px-3 py-3 bg-transparent focus:outline-none text-sm placeholder:text-[var(--text-muted)]"
        placeholder="search..."
        @keypress.enter="search"
      >
    </div>

    <!-- 下拉菜单 -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute top-full left-0 w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border)] shadow-lg shadow-[var(--shadow)] z-10"
      >
        <div
          v-for="engine in config?.search"
          :key="engine.name"
          class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[var(--border)] transition-colors"
          @click="selectEngine(engine)"
        >
          <span class="text-[var(--green)] text-xs">></span>
          <span class="text-sm">{{ engine.name }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
