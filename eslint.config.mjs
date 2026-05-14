import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default antfu({
  stylistic: true,
  typescript: true,
  vue: true,
}).append(nuxt())
