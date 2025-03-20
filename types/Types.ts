export type WeatherInfoType = {
  temp: {
    min: string
    max: string
    current: string
  }
  windSpeed: number
}

export type MainWeatherType = {
  date: string
  day: string
  label: string
  weather: {
    icon: string
    description: string
    humidity: number
    main: string
    pressure: number
  }
} & WeatherInfoType

export type ForecastDayType = {
  date: string
  day: string
  icon: string
  rain: number
} & WeatherInfoType

export type ForecastType = {
  todayForecast?: any
  day1?: ForecastDayType
  next3Days: ForecastDayType[]
}

export type GetLocationUpdateType = {
  weatherData: MainWeatherType
  forecastData: ForecastType
}

export type SearchPlaceType = {
  label: string
  location: CurrentUserPositionType
}