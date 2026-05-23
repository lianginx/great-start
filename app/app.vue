<script setup lang="ts">
const { config } = useConfig()
const { settings, restore } = useGistBackup()

onMounted(async () => {
  if (!settings.value.token || !settings.value.gistId)
    return

  const restored = await restore()
  if (restored)
    config.value = restored
})
</script>

<template>
  <div v-if="config" class="min-h-screen p-8 flex flex-col items-center justify-center">
    <div class="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--green)] to-transparent opacity-20" />

    <div class="w-full max-w-6xl space-y-12">
      <header>
        <DateTime />
      </header>

      <section class="flex justify-center">
        <SearchBox />
      </section>

      <section class="flex justify-center">
        <BookmarkBox />
      </section>

      <footer class="text-center animate-fade-in">
        <div class="flex items-center justify-center gap-2 text-[var(--text-muted)] text-xs">
          <span>
            <span class="text-[var(--green)] mr-1">$</span>
            <span>></span>
          </span>
          <WeatherBox />
          <GistBackup />
          <ConfigEditor />
        </div>
      </footer>
    </div>

    <div class="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--green)] to-transparent opacity-20" />
  </div>
</template>
