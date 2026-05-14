export interface Config {
  search: Search[]
  bookmark: BookmarkGroup[]
}

export interface Search {
  name: string
  url: string
}

export interface BookmarkGroup {
  name: string
  items: Bookmark[]
}

export interface Bookmark {
  name: string
  url: string
}

const key = 'config'

const defaultConfig: Config = {
  search: [
    {
      name: 'Google',
      url: 'https://www.google.com/search?q={keyword}',
    },
    {
      name: 'Bing',
      url: 'https://cn.bing.com/search?q={keyword}',
    },
  ],
  bookmark: [
    {
      name: 'Common',
      items: [
        { name: 'Bilibili', url: 'https://bilibili.com' },
        { name: 'Zhihu', url: 'https://zhihu.com' },
        { name: 'X/Twitter', url: 'https://x.com' },
        { name: 'Douyin', url: 'https://douyin.com' },
        { name: 'V2EX', url: 'https://v2ex.com' },
      ],
    },
    {
      name: 'AGI',
      items: [
        { name: 'DeepSeek', url: 'https://chat.deepseek.com' },
        { name: 'ChatGPT', url: 'https://chat.openai.com' },
        { name: 'Grok', url: 'https://grok.com' },
      ],
    },
    {
      name: 'Tech',
      items: [
        { name: 'GitHub', url: 'https://github.com/' },
        { name: 'Nuxt', url: 'https://nuxt.com/' },
      ],
    },
    {
      name: 'Game',
      items: [
        { name: 'Steam', url: 'https://store.steampowered.com' },
        { name: 'Epic', url: 'https://www.epicgames.com' },
      ],
    },
  ],
}

const config = ref<Config | null>(null)

watch(
  config,
  value => localStorage.setItem(key, JSON.stringify(value)),
  { deep: true },
)

export function useConfig() {
  function load() {
    // 服务端跳过
    if (!import.meta.client)
      return

    const localConfig = localStorage.getItem(key)

    if (localConfig) {
      config.value = JSON.parse(localConfig)
    }
    else {
      config.value = defaultConfig
    }
  }

  function reset() {
    // 服务端跳过
    if (!import.meta.client)
      return

    localStorage.removeItem(key)
    load()
  }

  if (!config.value) {
    load()
  }

  return { config, reset }
}
