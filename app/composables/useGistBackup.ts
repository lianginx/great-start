import type { Config } from './useConfig'
import jsYaml from 'js-yaml'

const LS_KEY = 'gist-settings'
const GIST_FILENAME = 'great-start-config.yaml'

interface GistSettings {
  token: string
  gistId?: string
  lastSynced?: number
  lastSyncDump?: string
}

export function useGistBackup() {
  const settings = ref<GistSettings>({ token: '' })
  const syncing = ref(false)
  const syncError = ref<string | null>(null)

  function loadSettings() {
    if (!import.meta.client)
      return
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw)
        settings.value = JSON.parse(raw)
    }
    catch {}
  }

  function persist() {
    if (!import.meta.client)
      return
    localStorage.setItem(LS_KEY, JSON.stringify(settings.value))
  }

  async function saveToken(token: string) {
    settings.value.token = token
    settings.value.lastSynced = undefined
    settings.value.lastSyncDump = undefined
    persist()
  }

  async function getRemoteDump(): Promise<string | null> {
    if (!settings.value.gistId || !settings.value.token)
      return null
    try {
      const res = await fetch(`https://api.github.com/gists/${settings.value.gistId}`, {
        headers: { Authorization: `Bearer ${settings.value.token}` },
      })
      if (!res.ok)
        return null
      const data = await res.json()
      return data.files?.[GIST_FILENAME]?.content ?? null
    }
    catch {
      return null
    }
  }

  async function sync(config: Config) {
    if (!import.meta.client || !settings.value.token)
      return

    const dump = jsYaml.dump(config, { indent: 2 })
    if (dump === settings.value.lastSyncDump)
      return

    if (settings.value.gistId && settings.value.lastSyncDump) {
      const remoteDump = await getRemoteDump()
      if (remoteDump !== null && remoteDump !== settings.value.lastSyncDump) {
        settings.value.lastSyncDump = remoteDump
        persist()
        syncError.value = '远程已有更新，请刷新页面获取最新配置'
        return
      }
    }

    syncing.value = true
    syncError.value = null

    try {
      const body = { files: { [GIST_FILENAME]: { content: dump } } }

      let res: Response
      if (settings.value.gistId) {
        res = await fetch(`https://api.github.com/gists/${settings.value.gistId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${settings.value.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
      }
      else {
        res = await fetch('https://api.github.com/gists', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${settings.value.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...body,
            description: 'great-start config',
            public: false,
          }),
        })
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `HTTP ${res.status}`)
      }

      const data = await res.json()
      settings.value.gistId = data.id
      settings.value.lastSynced = Date.now()
      settings.value.lastSyncDump = dump
      persist()
    }
    catch (e) {
      syncError.value = e instanceof Error ? e.message : '同步失败'
    }
    finally {
      syncing.value = false
    }
  }

  async function restore(): Promise<Config | null> {
    if (!import.meta.client || !settings.value.token || !settings.value.gistId)
      return null

    syncing.value = true
    syncError.value = null

    try {
      const res = await fetch(`https://api.github.com/gists/${settings.value.gistId}`, {
        headers: { Authorization: `Bearer ${settings.value.token}` },
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `HTTP ${res.status}`)
      }

      const data = await res.json()
      const content = data.files?.[GIST_FILENAME]?.content
      if (!content)
        throw new Error(`Gist 中没有找到 ${GIST_FILENAME}`)

      settings.value.lastSynced = Date.now()
      settings.value.lastSyncDump = content
      persist()
      return jsYaml.load(content) as Config
    }
    catch (e) {
      syncError.value = e instanceof Error ? e.message : '恢复失败'
      return null
    }
    finally {
      syncing.value = false
    }
  }

  async function findGist(): Promise<string | null> {
    if (!import.meta.client || !settings.value.token)
      return null

    try {
      const res = await fetch('https://api.github.com/gists?per_page=100', {
        headers: { Authorization: `Bearer ${settings.value.token}` },
      })
      if (!res.ok)
        return null

      const gists = await res.json() as Array<{ id: string, files: Record<string, unknown> }>
      const found = gists.find(g => GIST_FILENAME in g.files)
      return found?.id ?? null
    }
    catch {
      return null
    }
  }

  function clear() {
    settings.value = { token: '', lastSyncDump: undefined }
    localStorage.removeItem(LS_KEY)
  }

  const hasToken = computed(() => !!settings.value.token)
  const isConnected = computed(() => !!settings.value.token && !!settings.value.gistId)
  const lastSyncedText = computed(() => {
    if (!settings.value.lastSynced)
      return '从未同步'
    return new Date(settings.value.lastSynced).toLocaleString('zh-CN')
  })

  loadSettings()

  return { settings, syncing, syncError, saveToken, sync, restore, findGist, clear, hasToken, isConnected, lastSyncedText }
}
