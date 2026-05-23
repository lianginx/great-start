<script setup lang="ts">
const { config } = useConfig()
</script>

<template>
  <div v-if="config?.bookmark" class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <div
      v-for="group in config.bookmark" :key="group.name"
      class="border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--text-muted)] p-4 sm:p-6 animate-fade-in"
    >
      <!-- 分组标题 -->
      <div class="flex justify-between items-center gap-2 mb-4 pb-2 border-b border-[var(--border)] text-xs">
        <div class="text-[var(--green)] tracking-wider uppercase">
          [ {{ group.name }} ]
        </div>
        <div class="text-[var(--text-muted)]">
          {{ '</>' }}
        </div>
      </div>

      <!-- 链接列表 -->
      <div class="grid grid-cols-2 xl:grid-cols-3 gap-1">
        <a
          v-for="site in group.items" :key="site.name" :href="site.url"
          class="group relative flex items-center gap-1 py-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <span
            class="absolute -left-3 text-[var(--green)] opacity-0 group-hover:opacity-100 transition-opacity text-xs"
          >
            >
          </span>
          <span class="line-clamp-1">{{ site.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
