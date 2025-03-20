<template>
  <div>
    <div class="search-container">
      <div class="search-field-container">
        <div>
          <Icon name="mdi:search" />
        </div>
        <input
          v-model="searchText"
          @input="handleSearchText"
          type="text"
          placeholder="Search for a city..."
        />
        <button @click="getCurrentLocation">
          <Icon name="mage:location-fill" />
        </button>
      </div>
      <div v-if="searchText && searchedPlaces.length" class="search-list">
        <div
          v-for="place in searchedPlaces"
          class="search-item"
          @click="handleSelectPlace(place)"
        >
          <p>{{ place.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ForecastType, MainWeatherType, SearchPlaceType } from '~/types/Types';

type Props = {
  selectPlace: Function
}

const props = defineProps<Props>()

const $emit = defineEmits<{
  updatedLocation: any
  updatedFilter: any
}>()

const userCurrentLocation = ref<CurrentUserPositionType>({
  lat: 0,
  lon: 0,
})

const searchText = ref('')

const debounceSearchTextTimer = ref<any>(null)

const searchedPlaces = ref<SearchPlaceType[]>([])

function handleSearchText(event: any): void {
  clearTimeout(debounceSearchTextTimer.value)
  debounceSearchTextTimer.value = setTimeout(async () => {
    if (event.target.value) {
      const placesData = await $fetch<SearchPlaceType[]>('/api/place', {
        method: 'GET',
        query: {
          search: event.target.value,
        },
      })

      searchedPlaces.value = placesData
    }
  }, 500)
}

function handleSelectPlace(place: SearchPlaceType): void {
  searchedPlaces.value = []
  props.selectPlace(place)
}

const { getUserCurrentLocation } = useLocation()

async function getCurrentLocation(): Promise<void> {
  try {
    const { lat, lon } = await getUserCurrentLocation()
    userCurrentLocation.value = {
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

    $emit('updatedLocation', { forecastData, weatherData })
    $emit('updatedFilter', { lat, lon })
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

@media screen and (max-width: 600px)
  .search-field-container
    margin: 40px auto 0
</style>
