// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    apiKey: process.env.API_KEY,
    apiUrl: process.env.API_URL,
  },
  css: ['~/assets/styles/main.sass'],
})
