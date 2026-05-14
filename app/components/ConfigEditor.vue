<script setup lang="ts">
import type { Config } from '@/composables/useConfig'
import jsYaml from 'js-yaml'

const { config } = useConfig()

const isOpen = ref(false)
const yamlStr = ref('')
const error = ref<string | null>(null)

watch(
  config,
  (val) => {
    if (val) {
      yamlStr.value = jsYaml.dump(val, { indent: 2 })
    }
  },
  { immediate: true },
)

function open() {
  isOpen.value = true
  error.value = null
}

function close() {
  isOpen.value = false
  error.value = null
}

function save() {
  try {
    const parsed = jsYaml.load(yamlStr.value)

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('配置必须是一个对象')
    }

    const cfg = parsed as Record<string, unknown>

    if (!Array.isArray(cfg.search)) {
      throw new TypeError('配置必须包含 search 数组')
    }

    if (!Array.isArray(cfg.bookmark)) {
      throw new TypeError('配置必须包含 bookmark 数组')
    }

    config.value = parsed as Config
    error.value = null
    close()
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'YAML 格式错误'
  }
}
</script>

<template>
  <button
    class="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-xs"
    @click="open"
  >
    [config]
  </button>

  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black/80" @click="close" />

        <!-- 编辑器弹窗 -->
        <div class="relative w-full max-w-3xl max-h-[80vh] flex flex-col bg-[var(--bg-secondary)] border border-[var(--border)]">
          <!-- 头部 -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <div class="flex items-center gap-2">
              <span class="text-[var(--green)] text-xs">></span>
              <span class="text-sm">config.yaml</span>
            </div>
            <button
              class="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              @click="close"
            >
              ✕
            </button>
          </div>

          <!-- 编辑器 -->
          <div class="flex-1 overflow-auto">
            <YamlEditor v-model="yamlStr" />
          </div>

          <!-- 底部 -->
          <div class="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <div class="text-xs text-red-500">
              {{ error }}
            </div>
            <div class="flex gap-2">
              <button
                class="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                @click="close"
              >
                取消
              </button>
              <button
                class="px-4 py-2 text-sm bg-[var(--green)] text-black hover:opacity-80 transition-opacity"
                @click="save"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
