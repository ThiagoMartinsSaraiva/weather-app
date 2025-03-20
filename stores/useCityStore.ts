import { defineStore } from 'pinia'
import type { SearchPlaceType } from '~/types/Types'

export const useCityStore = defineStore('cities', {
  state: () => ({
    storedCities: [] as SearchPlaceType[],
  }),
  getters: {
    getStoredCities: (state: any): SearchPlaceType[] => state.storedCities,
  },
  actions: {
    storeCity(city: SearchPlaceType) {
      const foundCity = this.storedCities.find((cityItem: SearchPlaceType) => {
        return (
          cityItem.location.lat == city.location.lat &&
          cityItem.location.lon == city.location.lon
        )
      })

      if (foundCity) {
        return
      }

      this.storedCities.push(city)
      localStorage.setItem(
        'tms-weather-app/cities',
        JSON.stringify(this.storedCities),
      )
    },
    removeCity(city: SearchPlaceType) {
      this.storedCities = this.storedCities.filter((cityItem: SearchPlaceType) => {
        return (
          cityItem.location.lat != city.location.lat &&
          cityItem.location.lon != city.location.lon
        )
      })
      localStorage.setItem(
        'tms-weather-app/cities',
        JSON.stringify(this.storedCities),
      )
    },
  },
})
