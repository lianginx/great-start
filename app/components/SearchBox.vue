<script setup lang="ts">
import type { Search } from '@/composables/useConfig'

const modelValue = defineModel<string>()

const { config } = useConfig()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

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
    console.log(searchUrl);
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
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative w-full lg:w-5/12">
    <!-- 输入框 -->
    <div class="flex items-center border">
      <button class="px-4 pr-0" @click="toggleDropdown">
        {{ currentEngine?.name }}
      </button>
      <input v-model="modelValue" class="flex-1 pl-4 py-2 bg-transparent focus:outline-none" placeholder="搜索..."
        @keypress.enter="search">
    </div>
    <!-- 下拉菜单 -->
    <div v-if="isOpen" class="absolute top-full left-0 w-full border bg-black border-gray-300 z-10">
      <div v-for="engine in config?.search" :key="engine.name" @click="selectEngine(engine)"
        class="flex items-center gap-2 px-3 py-2 cursor-pointer">
        <span class="text-sm">{{ engine.name }}</span>
      </div>
    </div>
  </div>
</template>
