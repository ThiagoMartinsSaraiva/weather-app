export type CurrentUserPositionType = {
  lat: number
  lon: number
}

export const useLocation = () => {
  function getUserCurrentLocation(): Promise<CurrentUserPositionType> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude: lat, longitude: lon } = coords
          resolve({ lat, lon })
        }, (error) => {
          if (error.code == 1) {
            reject('loc.unshared')
          }
        })
      } else {
        reject('loc.unavailiable')
      }
    })
    
  }

  return {
    getUserCurrentLocation,
  }
}