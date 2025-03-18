<template>
  <main v-if="mainWeather.label">
      <div>
        <h2 class="weather-place">{{ mainWeather.label }} <Icon @click="saveCity(mainWeather.label)" name="icons8:pin-3" /></h2>
        <p class="weather-date">{{displayMainWeatherDate(mainWeather.day, mainWeather.date)}}</p>
      </div>
      <div class="main-weather-container">
        <div class="main-info">
          <div class="weather-icon">
            <img v-if="fullWidth >= 665" :src="`https:\\/\\/openweathermap.org/img\\/wn\\/${mainWeather.weather.icon}@4x.png`" alt="current-weather-icon">
            <img v-else-if="fullWidth >= 530" :src="`https:\\/\\/openweathermap.org/img\\/wn\\/${mainWeather.weather.icon}@2x.png`" alt="current-weather-icon">
          </div>
          <div>
            <p class="current-temperature">{{ mainWeather.temp.current }}°</p>
            <p>{{ mainWeather.weather.description }}</p>
          </div>
        </div>
        <div class="secondary-info">
          <div class="secondary-info-item">
            <div>
              <p>{{ mainWeather.temp.max }}°</p>
              <p class="light-label">High</p>
            </div>
            <div>
              <p>{{ mainWeather.temp.min }}°</p>
              <p class="light-label">Low</p>
            </div>
          </div>
          <div class="secondary-info-item">
            <div>
              <p>{{ mainWeather.windSpeed }}mph</p>
              <p class="light-label">Wind</p>
            </div>
            <div>
              <p>{{ mainWeather.weather.pressure }}in</p>
              <p class="light-label">Pressure</p>
            </div>
          </div>
          <div class="secondary-info-item">
            <div>
              <p>{{ mainWeather.weather.humidity }}%</p>
              <p class="light-label">Humidity</p>
            </div>
            <div>
              <p>0</p>
              <p class="light-label">Precipitation</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p class="weather-label">Today's weather</p>
        <div v-if="forecast.day1" class="today-forecast-container">
          <div class="today-forecast-card" v-for="currentForecast in forecast.todayForecast">
            <p>{{ currentForecast.time }}</p>
            <p><img :src="`https:\\/\\/openweathermap.org/img\\/wn\\/${currentForecast.icon}.png`" alt="current-weather-icon"></p>
            <p>{{ currentForecast.temperature }}°</p>
          </div>
        </div>
      </div>
      <div v-if="!forecast.day1">
        <p class="no-more-forecasts">No more forecasts for today</p>
      </div>
      <div>
        <p class="weather-label">Next 3 days</p>
        <div class="next-days-forecast-container">
          <div class="next-days-forecast-card" v-for="forecastDay in forecast.next3Days">
            <div>
              <p>{{ forecastDay.day }}</p>
              <p class="light-label">{{ displayNext3DaysDate(forecastDay.date) }}</p>
            </div>
            <div>
              <p><img :src="`https:\\/\\/openweathermap.org/img\\/wn\\/${forecastDay.icon}.png`" alt="current-weather-icon"></p>
            </div>
            <div>
              <p>{{ forecastDay.temp.min }}°</p>
              <p class="light-label">Low</p>
            </div>
            <div>
              <p>{{ forecastDay.temp.max }}°</p>
              <p class="light-label">High</p>
            </div>
            <div>
              <p>{{ forecastDay.rain }}%</p>
              <p class="light-label">Rain</p>
            </div>
            <div>
              <p>{{ forecastDay.windSpeed }}mph</p>
              <p class="light-label">Wind</p>
            </div>
          </div>
        </div>
      </div>
    </main>
</template>

<script lang="ts" setup>
import { useCityStore } from '../stores/useCityStore';

const cityStore = useCityStore()

type Props = {
  forecast: any
  mainWeather: any
  filter: any
}

const props = defineProps<Props>()

const dayMapper = {
  'Mon': 'Monday',
  'Tue': 'Tuesday',
  'Wed': 'Wednesday',
  'Thu': 'Thursday',
  'Fri': 'Friday',
  'Sat': 'Saturday',
  'Sun': 'Sunday',
}

const monthMapper = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
}

function displayNext3DaysDate(date: string) {
  const [_, month, day] = date.split('-')
  return `${day}/${month}`
}

function displayMainWeatherDate(day: string, date: string) {
  const [_, month, dateDay] = date.split('-')
  const formattedWeekDay = dayMapper[day]
  const formattedMonth = monthMapper[month]

  return `${formattedWeekDay} ${dateDay} ${formattedMonth}`
}

const fullWidth = computed(() => {
  return window.innerWidth
})

function saveCity(city: any) {
  if (!props.filter.lat || !props.filter.lon || !city) {
    return
  }

  cityStore.storeCity({
    label: city,
    location: {
      ...props.filter,
    }
  })
}
</script>

<style>

</style>