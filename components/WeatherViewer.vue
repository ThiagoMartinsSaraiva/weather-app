<template>
  <main v-if="mainWeather.label">
    <div>
      <h2 class="weather-place">
        {{ mainWeather.label }}
        <Icon @click="saveCity(mainWeather.label)" name="icons8:pin-3" />
      </h2>
      <p class="weather-date">
        {{ displayMainWeatherDate(mainWeather.day, mainWeather.date) }}
      </p>
    </div>
    <div class="main-weather-container">
      <div class="main-info">
        <div class="weather-icon">
          <img
            v-if="fullWidth >= 665"
            :src="`https:\\/\\/openweathermap.org/img\\/wn\\/${mainWeather.weather.icon}@4x.png`"
            alt="current-weather-icon"
          />
          <img
            v-else-if="fullWidth >= 530"
            :src="`https:\\/\\/openweathermap.org/img\\/wn\\/${mainWeather.weather.icon}@2x.png`"
            alt="current-weather-icon"
          />
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
        <div
          class="today-forecast-card"
          v-for="currentForecast in forecast.todayForecast"
        >
          <p>{{ formatTodayForecastTime(currentForecast.time) }}</p>
          <p>
            <img
              :src="`https:\\/\\/openweathermap.org/img\\/wn\\/${currentForecast.icon}.png`"
              alt="current-weather-icon"
            />
          </p>
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
        <div
          class="next-days-forecast-card"
          v-for="forecastDay in forecast.next3Days"
        >
          <div>
            <p>{{ forecastDay.day }}</p>
            <p class="light-label">
              {{ displayNext3DaysDate(forecastDay.date) }}
            </p>
          </div>
          <div>
            <p>
              <img
                :src="`https:\\/\\/openweathermap.org/img\\/wn\\/${forecastDay.icon}.png`"
                alt="current-weather-icon"
              />
            </p>
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
import { dayMapper, monthMapper } from '~/types/Mappers'
import { useCityStore } from '../stores/useCityStore'
import type { ForecastType, MainWeatherType } from '~/types/Types'

const cityStore = useCityStore()

type Props = {
  forecast: ForecastType
  mainWeather: MainWeatherType
  filter: CurrentUserPositionType
}

const props = defineProps<Props>()

function displayNext3DaysDate(date: string): string {
  const [_, month, day] = date.split('-')
  return `${day}/${month}`
}

function formatTodayForecastTime(time: string): string {
  const [hours, minutes] = time.split(':')

  let newHour = Number(hours)

  if (newHour > 12) {
    newHour -= 12
  }

  const meridian = Number(hours) >= 12 ? 'pm' : 'am'

  const finalFormat = `${newHour}:${minutes}${meridian}`

  return finalFormat
}

function displayMainWeatherDate(day: string, date: string): string {
  const [_, month, dateDay] = date.split('-')
  const formattedWeekDay = dayMapper[day]
  const formattedMonth = monthMapper[month]

  return `${formattedWeekDay} ${dateDay} ${formattedMonth}`
}

const fullWidth = computed(() => {
  return window.innerWidth
})

function saveCity(city: string): void {
  if (!props.filter.lat || !props.filter.lon || !city) {
    return
  }

  cityStore.storeCity({
    label: city,
    location: {
      ...props.filter,
    },
  })
}
</script>

<style lang="sass">
.weather-place
  font-size: 24px
  line-height: 180%
  font-weight: bold
  display: flex
  align-items: center
  gap: 8px

  .iconify
    font-weight: 800
    font-size: 32px
    background: #e0e0e0
    transition: .4s
    cursor: pointer

    &:hover
      background: #fff
      transform: scale(1.2)

.weather-date
  font-size: 14px
  opacity: 70%

.main-weather-container
  display: grid
  grid-template-columns: 1fr 1fr

  .current-temperature
    font-size: 72px
    line-height: 130%

  .main-info
    display: flex
    text-align: center
    text-transform: capitalize
    align-items: center
    justify-content: center

    &::after
      position: relative;
      display: block;
      content: ''
      width: .1px
      height: 90%
      background: #fff5
      margin: 0 16px

    .weather-icon
      flex: 1

  .secondary-info
    display: flex
    gap: 32px
    line-height: 160%
    align-items: center

    &-item
      display: flex
      flex-direction: column
      gap: 16px


.weather-label
  line-height: 130%
  opacity: 60%
  margin: 16px 0

.today-forecast-container
  display: flex;
  gap: 8px
  overflow-x: auto

  .today-forecast-card
    background: purple
    background: #0003
    display: flex
    flex-direction: column
    gap: 16px
    padding: 8px
    border-radius: 4px
    text-align: center

.next-days-forecast-container
  display: flex
  flex-direction: column
  gap: 8px

  .next-days-forecast-card
    background: #0003
    display: flex
    text-align: center
    align-items: center
    justify-content: space-evenly
    border-radius: 4px
    padding: 12px

    p
      line-height: 150%

.no-more-forecasts
  margin-left: 24px
  opacity: 80%

.light-label
  opacity: 60%

@media screen and (max-width: 600px)

  .light-label
    font-size: 80%
</style>
