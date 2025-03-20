export default defineEventHandler(async (event) => {
  const { apiKey, apiUrl } = useRuntimeConfig()

  const { search } = getQuery<{ search?: string }>(event)

  if (!search) {
    return []
  }

  const placeData = await $fetch<any[]>(`${apiUrl}/geo/1.0/direct`, {
    params: {
      q: search,
      limit: 5,
      appid: apiKey,
    },
  })

  const formattedPlaces = placeData.map(
    ({ name, state, country, lat, lon }: any) => {
      const label = `${name}, ${state ? state + ' - ' : ''}${country}`

      return {
        label,
        location: {
          lat,
          lon,
        },
      }
    },
  )

  return formattedPlaces
})
