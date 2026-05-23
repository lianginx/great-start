interface APIStatus {
  status: string
  info: string
  infocode: string
  count: string
}

interface GeoResult extends APIStatus {
  geocodes: {
    formatted_address: string
    location: string
    province: string
    city: string
    adcode: string
    level: string
  }[]
}

interface RegeoResult extends APIStatus {
  regeocode: {
    addressComponent: {
      adcode: string
    }
  }
}

export interface WeatherLive {
  province: string
  city: string
  adcode: string
  weather: string
  temperature: string
  winddirection: string
  windpower: string
  humidity: string
  reporttime: string
  temperature_float: string
  humidity_float: string
}

interface WeatherResult extends APIStatus {
  lives: WeatherLive[]
}

interface WeatherCache {
  data: WeatherLive
  timestamp: number
}

const CACHE_KEY = 'weather_cache'
const CACHE_TTL = 30 * 60 * 1000

export function useWeather() {
  const { config } = useConfig()

  const BASE_URL = 'https://restapi.amap.com/v3'

  function getKey(): string {
    const key = config.value?.weather?.amapKey
    if (!key)
      throw new Error('请配置高德地图 API Key')
    return key
  }

  function getCache(): WeatherLive | null {
    if (!import.meta.client)
      return null
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw)
        return null
      const cache: WeatherCache = JSON.parse(raw)
      if (Date.now() - cache.timestamp < CACHE_TTL)
        return cache.data
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    catch {
      return null
    }
  }

  function setCache(data: WeatherLive) {
    if (!import.meta.client)
      return
    try {
      const cache: WeatherCache = { data, timestamp: Date.now() }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    }
    catch {
      // ignore
    }
  }

  function getLocation(): Promise<{ lat: number, lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持定位'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => reject(new Error(`定位失败: ${err.message}`)),
        { timeout: 5000, enableHighAccuracy: false },
      )
    })
  }

  async function getAdcodeFromCoords(lat: number, lng: number) {
    const key = getKey()
    const url = `${BASE_URL}/geocode/regeo`
    const { status, info, regeocode } = await $fetch<RegeoResult>(url, {
      query: { output: 'json', key, location: `${lng},${lat}` },
    })
    if (status !== '1')
      throw new Error(info)
    return regeocode.addressComponent.adcode
  }

  async function getAdcode(address: string) {
    const key = getKey()
    const url = `${BASE_URL}/geocode/geo`
    const { status, info, geocodes } = await $fetch<GeoResult>(url, {
      query: { output: 'json', key, address },
    })
    if (status !== '1')
      throw new Error(info)
    if (!geocodes[0])
      throw new Error('未找到该地址')
    return geocodes[0].adcode
  }

  async function getWeather(adcode: string) {
    const key = getKey()
    const url = `${BASE_URL}/weather/weatherInfo`
    const { status, info, lives } = await $fetch<WeatherResult>(url, {
      query: { output: 'json', extensions: 'base', key, city: adcode },
    })
    if (status !== '1')
      throw new Error(info)
    if (!lives[0])
      throw new Error('未找到该地址')
    return lives[0]
  }

  async function loadWeather(address?: string, forceRefresh = false): Promise<WeatherLive> {
    if (!forceRefresh) {
      const cached = getCache()
      if (cached)
        return cached
    }

    let adcode: string
    if (address) {
      adcode = await getAdcode(address)
    }
    else {
      try {
        const { lat, lng } = await getLocation()
        adcode = await getAdcodeFromCoords(lat, lng)
      }
      catch {
        adcode = await getAdcode('鹤壁')
      }
    }

    const weather = await getWeather(adcode)
    setCache(weather)
    return weather
  }

  return { loadWeather, getCache }
}
