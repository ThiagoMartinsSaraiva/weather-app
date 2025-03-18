<script lang="ts" setup>
import { useCityStore } from '../stores/useCityStore';

const cityStore = useCityStore()

const mainWeather = ref<any>({})
const forecast = ref<any>({})
const filter = ref<CurrentUserPositionType>({
  lat: 0,
  lon: 0,
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

function getLocationUpdate({ weatherData, forecastData }: any) {
  mainWeather.value = weatherData
  forecast.value = forecastData
}

function getFilterUpdate({ lat, lon }: any) {
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

  const weatherRequest = $fetch('/api/weather', {
    method: 'GET',
    query: {
      lat,
      lon,
    }
  })

  const forecastRequest = $fetch('/api/forecast', {
    method: 'GET',
    query: {
      lat,
      lon,
    }
  })

  const [weatherData, forecastData] = await Promise.all([weatherRequest, forecastRequest])

  forecast.value = forecastData

  mainWeather.value = weatherData
}


</script>
<template>
  <div class="app-container">
    <SearchForm :select-place="selectPlace" @updated-location="getLocationUpdate" @updatedFilter="getFilterUpdate" />
    <CityList :select-place="selectPlace" />
    <WeatherViewer :forecast="forecast" :main-weather="mainWeather" :filter="filter" />
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