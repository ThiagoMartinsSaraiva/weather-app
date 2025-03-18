<template>
  <section v-if="storedCities.length" class="cities-section">
    <h2 class="section-title">Saved cities</h2>
    <div class="stored-cities-container">
      <div v-for="city in storedCities" :key="city.location.lat.toString()+city.label+city.location.lon.toString()" class="stored-cities-card">
        <span @click="selectPlace(city)">{{ city.label }}</span> <span><Icon @click="removeCity(city)" name="material-symbols:close" /></span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useCityStore } from '../stores/useCityStore';

type Props = {
  selectPlace: Function
}

defineProps<Props>()

const cityStore = useCityStore()

const storedCities = computed(() => cityStore.getStoredCities);

function removeCity(city: any) {
  cityStore.removeCity(city)
}
</script>

<style lang="sass">
.section-title
  font-size: 24px
  line-height: 180%
  font-weight: bold
  
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
</style>