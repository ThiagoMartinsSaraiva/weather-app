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
        <div v-for="place in searchedPlaces" class="search-item" @click="(handleSelectPlace(place))">
          <p>{{ place.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type Props = {
  selectPlace: Function
}

const props = defineProps<Props>()

const $emit = defineEmits<{
  'updatedLocation': any,
}>()

const userCurrentLocation = ref<CurrentUserPositionType>({
  lat: 0,
  lon: 0,
})

const searchText = ref('')

const debounceSearchTextTimer = ref<any>(null)

const searchedPlaces = ref<any[]>([])

function handleSearchText(event) {
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

function handleSelectPlace(place: any) {
  searchedPlaces.value = []
  props.selectPlace(place)
}


const { getUserCurrentLocation } = useLocation()

async function getCurrentLocation() {
  try {
    const { lat, lon } = await getUserCurrentLocation()
    userCurrentLocation.value = {
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

    $emit('updatedLocation', { forecastData, weatherData })

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