import { defineStore } from 'pinia'

export const useCityStore = defineStore('cities', {
  state: () => ({
    storedCities: [],
  }),
  getters: {
    getStoredCities: (state: any) => state.storedCities,
  },
  actions: {
    storeCity(city: any) {
      const foundCity = this.storedCities.find((cityItem: any) => {
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
    removeCity(city: any) {
      this.storedCities = this.storedCities.filter((cityItem: any) => {
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
