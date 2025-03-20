<script lang="ts" setup>
import type {
  ForecastType,
  GetLocationUpdateType,
  MainWeatherType,
} from '~/types/Types'
import { useCityStore } from '../stores/useCityStore'

const cityStore = useCityStore()

const mainWeather = ref<MainWeatherType>({} as MainWeatherType)
const forecast = ref<ForecastType>({} as ForecastType)
const filter = ref<CurrentUserPositionType>({
  lat: 0,
  lon: 0,
})

const pageTitle = computed(() => {
  return mainWeather.value?.label || 'Weather App'
})

useHead({
  title: pageTitle.value,
})

watch(pageTitle, () => {
  useHead({
    title: pageTitle.value,
  })
})

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

function getLocationUpdate({
  weatherData,
  forecastData,
}: GetLocationUpdateType) {
  mainWeather.value = weatherData
  forecast.value = forecastData
}

function getFilterUpdate({ lat, lon }: CurrentUserPositionType) {
  filter.value = {
    lat,
    lon,
  }
}

async function selectPlace(place: any) {
  const { lat, lon } = place.location

  filter.value = {
    lat,
    lon,
  }

  const weatherRequest = $fetch<MainWeatherType>('/api/weather', {
    method: 'GET',
    query: {
      lat,
      lon,
    },
  })

  const forecastRequest = $fetch<ForecastType>('/api/forecast', {
    method: 'GET',
    query: {
      lat,
      lon,
    },
  })

  const [weatherData, forecastData] = await Promise.all([
    weatherRequest,
    forecastRequest,
  ])

  forecast.value = forecastData

  mainWeather.value = weatherData
}
</script>
<template>
  <div class="app-container">
    <SearchForm
      :select-place="selectPlace"
      @updated-location="getLocationUpdate"
      @updatedFilter="getFilterUpdate"
    />
    <CityList :select-place="selectPlace" />
    <WeatherViewer
      :forecast="forecast"
      :main-weather="mainWeather"
      :filter="filter"
    />
  </div>
</template>

<style lang="sass">
.app-container
  width: 90%
  max-width: 900px
  margin: 0 auto

main
  margin-bottom: 80px
</style>
