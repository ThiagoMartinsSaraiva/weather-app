<template>
  <div>
    <div class="search-container">
       <div class="search-field-container">
        <div>
          <Icon name="mdi:search" />
        </div>
        <input v-model="searchText" @input="handleSearchText" type="text" placeholder="Search for a city...">
        <button @click="getCurrentLocation"><Icon name="mage:location-fill" /></button>
       </div>
      <div v-if="searchText && searchedPlaces.length" class="search-list">
        <div v-for="place in searchedPlaces" class="search-item" @click="(selectPlace(place))">
          <p>{{ place.label }}</p>
        </div>
      </div>
    </div>
    <section v-if="storedCities.length" class="cities-section">
      <h2 class="section-title">Saved cities</h2>
      <div class="stored-cities-container">
        <div v-for="city in storedCities" class="stored-cities-card">
          <span @click="selectPlace(city)">{{ city.label }}</span> <span><Icon @click="removeCity(city)" name="material-symbols:close" /></span>
        </div>
      </div>
    </section>
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
  </div>
</template>

<script lang="ts" setup>
import { useCityStore } from '../stores/useCityStore';

const cityStore = useCityStore()

const userCurrentLocation = ref<CurrentUserPositionType>({
  lat: 0,
  lon: 0,
})

const filter = ref<CurrentUserPositionType>({
  lat: 0,
  lon: 0,
})

function saveCity(city: any) {
  if (!filter.value.lat || !filter.value.lon || !city) {
    return
  }

  cityStore.storeCity({
    label: city,
    location: {
      ...filter.value,
    }
  })
}

onMounted(() => {
  let localStoragedCities: any = localStorage.getItem('tms-weather-app/cities')

  if (!localStoragedCities) {
    return
  }

  localStoragedCities = JSON.parse(localStoragedCities)
  localStoragedCities?.forEach((localStoragedCity: any) => {
    cityStore.storeCity(localStoragedCity)
  })
}) 

function removeCity(city: any) {
  cityStore.removeCity(city)
}

const storedCities = computed(() => cityStore.getStoredCities);

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

const mainWeather = ref<any>({})
const forecast = ref<any>({})

const searchText = ref('')

const debounceSearchTextTimer = ref<any>(null)

const searchedPlaces = ref<any[]>([])

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

function handleSearchText(event) {
  filter.value = {
    lat: 0,
    lon: 0,
  }
  clearTimeout(debounceSearchTextTimer.value)
  debounceSearchTextTimer.value = setTimeout(async () => {
    if (event.target.value) {
      const placesData = await $fetch('/api/place', {
        method: "GET",
        query: {
          search: event.target.value,
        },
      })

      searchedPlaces.value = placesData
    }
  }, 500);
}

async function selectPlace(place: any) {
  searchedPlaces.value = []

  const { lat, lon } = place.location

  filter.value = {
      lat,
      lon,
    }

  const weatherData = await $fetch('/api/weather', {
      method: 'GET',
      query: {
        lat,
        lon,
      }
    })

    const forecastData = await $fetch('/api/forecast', {
      method: 'GET',
      query: {
        lat,
        lon,
      }
    })

    forecast.value = forecastData

    mainWeather.value = weatherData
}

const { getUserCurrentLocation } = useLocation()

async function getCurrentLocation() {
  try {
    const { lat, lon } = await getUserCurrentLocation()
    userCurrentLocation.value = {
      lat,
      lon,
    }

    filter.value = {
      ...userCurrentLocation.value,
    }

    const weatherData = await $fetch('/api/weather', {
      method: 'GET',
      query: {
        lat,
        lon,
      }
    })

    const forecastData = await $fetch('/api/forecast', {
      method: 'GET',
      query: {
        lat,
        lon,
      }
    })

    forecast.value = forecastData

    mainWeather.value = weatherData

  } catch (e) {
    console.log(e)
  }
}

</script>

<style lang="sass">
.search-container
  position: relative
  margin-bottom: 32px

.search-list
  position: absolute
  z-index: 100
  width: 100%

  .search-item
    background: white
    color: #333
    padding: 8px
    font-size: 16px
    line-height: 130%
    cursor: pointer

.search-field-container
  display: flex
  align-items: center
  justify-content: center
  background: white
  padding: 8px
  border-radius: 4px
  margin: 100px auto 0
  gap: 8px

  input
    border-right: 1px solid #e0e0e0
    font-size: 16px
    flex: 1
    &::placeholder
      font-size: 14px

  button 
    background: transparent

  .iconify 
    font-size: 24px
    color: #333

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

.section-title
  font-size: 24px
  line-height: 180%
  font-weight: bold

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

.light-label
  opacity: 60%

.no-more-forecasts
  margin-left: 24px
  opacity: 80%

@media screen and (max-width: 600px)
  .search-field-container
    margin: 40px auto 0

  .light-label
    font-size: 80%


.cities-section
  margin-bottom: 32px

.stored-cities-container
  display: flex
  gap: 8px
  flex-wrap: wrap

  .stored-cities-card
    background: red
    padding: 8px 16px
    background: #0004
    border-radius: 4px
    display: flex
    align-items: center
    justify-content: space-between
    gap: 16px
    
    span
      cursor: pointer

    .iconify
      font-size: 20px

main
  margin-bottom: 80px
</style>