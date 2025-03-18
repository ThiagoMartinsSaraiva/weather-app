import { format } from "date-fns"

type getWeatherDTO = {
  lat: number
  lon: number
}

const weekDayMap = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat'
}

export default defineEventHandler(async (event) => {
  const { apiKey, apiUrl } = useRuntimeConfig()

  const { lat, lon } = getQuery<getWeatherDTO>(event)

  if (!lat || !lon) {
    return {}
  }

  const weatherData = await $fetch<any>(`${apiUrl}/data/2.5/weather`, {
    params: {
      appid: apiKey,
      lat,
      lon,
      units: 'metric'
    }
  })

  const { weather, main, wind, dt, name, sys  } = weatherData

  const today = new Date(dt * 1000)

  const formattedDate = format(today, 'yyyy-MM-dd')

  const formattedWeather: any = {
    label: `${name}, ${sys.country}`,
    temp: {
      min: main.temp_min.toFixed(1),
      max: main.temp_max.toFixed(1),
      current: main.temp.toFixed(0),
    },
    day: weekDayMap[today.getDay()],
    date: formattedDate,
    windSpeed: wind.speed,
    weather: {
      icon: weather[0].icon,
      description: weather[0].description,
      main: weather[0].main,
      humidity: main.humidity,
      pressure: main.pressure,

    }
  }

  return formattedWeather
})
