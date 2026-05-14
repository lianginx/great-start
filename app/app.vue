<script setup lang="ts">
const { config, reset } = useConfig()
</script>

<template>
  <div v-if="config" class="min-h-screen p-8 flex flex-col items-center justify-center space-y-8">
    <DateTime @click="reset" />
    <SearchBox />
    <BookmarkBox />
  </div>
</template>