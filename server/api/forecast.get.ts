import { addDays, format } from 'date-fns'
import { weekDayMapper } from '~/types/Mappers'
import { ForecastDayType } from '~/types/Types'

type getForecastDTO = {
  lat: number
  lon: number
}

function formatDailyForecast(forecasts: any[]) {
  if (!forecasts.length) {
    return null
  }
  const [date] = forecasts[0].dt_txt.split(' ')
  const [year, month, day] = date.split('-')
  const today = new Date()
  const hours = today.getHours()
  const dateToCompare = `${hours.toString().padStart(2, '0')}:00:00`

  let foundForecastIndex = forecasts.findIndex((forecast) => {
    const [_, forecastTimeToCompare] = forecast.dt_txt.split(' ')
    const numberedDateToCompare = Number(dateToCompare.replaceAll(':', ''))
    const numberedForecastTimeToCompare = Number(
      forecastTimeToCompare.replaceAll(':', ''),
    )

    return (
      numberedDateToCompare <= numberedForecastTimeToCompare ||
      forecast.dt_txt.includes('21:00:00')
    )
  })

  if (foundForecastIndex == 0) {
    foundForecastIndex = 1
  }

  return forecasts.reduce(
    (acc, forecast) => {
      return {
        ...acc,
        temp: {
          min:
            acc.temp.min > forecast.main.temp_min || !acc.temp.min
              ? forecast.main.temp_min.toFixed(1)
              : acc.temp.min,
          max:
            acc.temp.max < forecast.main.temp_max || !acc.temp.max
              ? forecast.main.temp_max.toFixed(1)
              : acc.temp.max,
        },
        windSpeed:
          acc.windSpeed < forecast.wind.speed || !acc.windSpeed
            ? forecast.wind.speed
            : acc.windSpeed,
        rain:
          acc.rain < forecast.rain?.['3h'] || !acc.rain
            ? forecast.rain?.['3h'] || 0
            : acc.rain,
      }
    },
    {
      date,
      icon: forecasts?.[foundForecastIndex - 1]?.weather?.[0]?.icon,
      day: weekDayMapper[new Date(year, month - 1, day).getDay()],
      temp: {
        min: null,
        max: null,
      },
      windSpeed: 0,
      rain: 0,
    },
  )
}

function formatForecastList(forecastList: any[]) {
  const today = new Date()
  const daysToFilter = [
    format(today, 'yyyy-MM-dd'),
    format(addDays(today, 1), 'yyyy-MM-dd'),
    format(addDays(today, 2), 'yyyy-MM-dd'),
    format(addDays(today, 3), 'yyyy-MM-dd'),
  ]

  const [day1Forecast, day2Forecast, day3Forecast, day4Forecast] =
    daysToFilter.map((currentDay) => {
      const currentForecast = forecastList.filter((forecastItem) => {
        return forecastItem.dt_txt.includes(currentDay)
      })

      return currentForecast
    })

  const simplifiedTodayForecast = day1Forecast.map((forecast) => {
    const [date, time] = forecast.dt_txt.split(' ')
    return {
      time,
      temperature: forecast.main.temp.toFixed(1),
      date,
      description: forecast.weather[0].description,
      icon: forecast.weather[0].icon,
    }
  })

  const reducedDay1: ForecastDayType = formatDailyForecast(day1Forecast)

  const reducedDay2: ForecastDayType = formatDailyForecast(day2Forecast)

  const reducedDay3: ForecastDayType = formatDailyForecast(day3Forecast)

  const reducedDay4: ForecastDayType = formatDailyForecast(day4Forecast)

  return {
    todayForecast: simplifiedTodayForecast,
    day1: reducedDay1,
    next3Days: [reducedDay2, reducedDay3, reducedDay4],
  }
}

export default defineEventHandler(async (event) => {
  const { apiKey, apiUrl } = useRuntimeConfig()

  const { lat, lon } = getQuery<getForecastDTO>(event)

  if (!lat || !lon) {
    return []
  }

  const forecastData = await $fetch<any>(`${apiUrl}/data/2.5/forecast`, {
    params: {
      appid: apiKey,
      lat,
      lon,
      units: 'metric',
      cnt: 32,
    },
  })

  const formattedForecastList = formatForecastList(forecastData.list)

  return formattedForecastList
})
