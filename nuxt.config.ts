// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  app: {
    head: {
      style: [
        { innerHTML: 'body { background-color: #0a0a0a; }' },
      ],
    },
  },
})
