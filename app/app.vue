<script setup lang="ts">
const { config, reset } = useConfig()
</script>

<template>
  <div v-if="config" class="min-h-screen p-8 flex flex-col items-center justify-center">
    <!-- 顶部装饰线 -->
    <div class="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--green)] to-transparent opacity-20" />

    <!-- 主要内容 -->
    <div class="w-full max-w-4xl space-y-12">
      <!-- 头部：时钟 -->
      <header>
        <DateTime @click="reset" />
      </header>

      <!-- 搜索框 -->
      <section>
        <SearchBox />
      </section>

      <!-- 书签 -->
      <section>
        <BookmarkBox />
      </section>

      <!-- 底部装饰 -->
      <footer class="text-center animate-fade-in" style="animation-delay: 0.5s">
        <div class="flex items-center justify-center gap-2 text-[var(--text-muted)] text-xs">
          <span class="text-[var(--green)]">$</span>
          <span>home</span>
          <span class="text-[var(--green)]">--</span>
          <span>v1.0</span>
        </div>
      </footer>
    </div>

    <!-- 底部装饰线 -->
    <div class="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--green)] to-transparent opacity-20" />
  </div>
</template>
