<script setup lang="ts">
const { config } = useConfig()
</script>

<template>
  <div v-if="config?.bookmark" class="w-full lg:w-10/12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <div v-for="group in config.bookmark" class="border p-4 sm:p-6">
      <div class="text-gray-500 mb-2 sm:mb-4">
        [ {{ group.name }} ]
      </div>
      <div class="grid grid-cols-2 xl:grid-cols-3 gap-2">
        <div v-for="site in group.items" class="line-clamp-1">
          <a class="hover:underline" :href="site.url" target="_blank">
            {{ site.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
