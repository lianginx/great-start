<script setup lang="ts">
const { config } = useConfig()
const gist = useGistBackup()

const isOpen = ref(false)
const tokenInput = ref('')
const restoring = ref(false)
const restoreError = ref<string | null>(null)

const containerRef = ref<HTMLElement | null>(null)

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    tokenInput.value = gist.settings.value.token
  }
}

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

async function handleSaveToken() {
  await gist.saveToken(tokenInput.value.trim())
  // 有本地 gistId 则直接恢复，否则按文件名搜索已有的 gist
  if (gist.settings.value.gistId) {
    const restored = await gist.restore()
    if (restored)
      config.value = restored
    return
  }
  const existingId = await gist.findGist()
  if (existingId) {
    gist.settings.value.gistId = existingId
    await gist.saveToken(tokenInput.value.trim()) // 持久化 gistId
    const restored = await gist.restore()
    if (restored)
      config.value = restored
  }
  else {
    await gist.sync(config.value!)
  }
}

async function handleSync() {
  restoring.value = true
  restoreError.value = null
  try {
    await gist.sync(config.value!)
  }
  finally {
    restoring.value = false
  }
}

async function handleRestore() {
  restoring.value = true
  restoreError.value = null
  try {
    const restored = await gist.restore()
    if (restored) {
      config.value = restored
    }
    else {
      restoreError.value = gist.syncError.value || '恢复失败'
    }
  }
  finally {
    restoring.value = false
  }
}

async function handleClear() {
  await gist.clear()
  tokenInput.value = ''
}
</script>

<template>
  <div ref="containerRef" class="relative">
    <button
      class="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-xs"
      :class="{
        'text-[var(--green)]': gist.isConnected.value,
      }"
      @click="toggle"
    >
      [~]
    </button>

    <Transition name="popover">
      <div
        v-if="isOpen"
        class="absolute bottom-full right-0 mb-2 w-80 bg-[var(--bg-secondary)] border border-[var(--border)] shadow-lg"
      >
        <div class="px-4 py-3 border-b border-[var(--border)]">
          <div class="flex items-center gap-2">
            <span class="text-[var(--green)] text-xs">$</span>
            <span class="text-sm">gist backup</span>
            <span
              v-if="gist.isConnected.value"
              class="text-[10px] text-[var(--green)]"
            >connected</span>
            <span
              v-else
              class="text-[10px] text-[var(--text-muted)]"
            >disconnected</span>
          </div>
        </div>

        <div class="p-4 space-y-3">
          <!-- Token -->
          <div
            v-if="!gist.isConnected.value"
            class="space-y-1"
          >
            <label class="text-xs text-[var(--text-muted)]">GitHub Token</label>
            <input
              v-model="tokenInput"
              type="password"
              class="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--green)] transition-colors"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            >
          </div>

          <!-- 状态信息 -->
          <div class="text-xs text-[var(--text-muted)] space-y-1">
            <div class="flex justify-between">
              <span>状态</span>
              <span :class="{ 'text-[var(--green)]': gist.isConnected.value }">
                {{ gist.isConnected.value ? '已连接' : '未连接' }}
              </span>
            </div>
            <div
              v-if="gist.lastSyncedText.value"
              class="flex justify-between"
            >
              <span>上次同步</span>
              <span>{{ gist.lastSyncedText.value }}</span>
            </div>
          </div>

          <!-- 错误信息 -->
          <div
            v-if="gist.syncError.value || restoreError"
            class="text-xs text-red-500"
          >
            {{ gist.syncError.value || restoreError }}
          </div>

          <!-- 按钮 -->
          <div
            v-if="!gist.isConnected.value"
            class="flex flex-col gap-2"
          >
            <button
              class="w-full px-3 py-2 text-xs bg-[var(--green)] text-black hover:opacity-80 transition-opacity disabled:opacity-40"
              :disabled="gist.syncing.value"
              @click="handleSaveToken"
            >
              {{ gist.syncing.value ? '保存中...' : '保存 Token' }}
            </button>
          </div>
          <div
            v-else
            class="flex gap-2"
          >
            <button
              class="flex-1 px-3 py-2 text-xs bg-[var(--green)] text-black hover:opacity-80 transition-opacity disabled:opacity-40"
              :disabled="gist.syncing.value"
              @click="handleSync"
            >
              {{ gist.syncing.value ? '同步中...' : '备份' }}
            </button>
            <button
              class="flex-1 px-3 py-2 text-xs border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition-colors disabled:opacity-40"
              :disabled="gist.syncing.value"
              @click="handleRestore"
            >
              {{ gist.syncing.value ? '恢复中...' : '恢复' }}
            </button>
            <button
              class="px-3 py-2 text-xs text-[var(--text-muted)] hover:text-red-500 transition-colors"
              @click="handleClear"
            >
              断开
            </button>
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
