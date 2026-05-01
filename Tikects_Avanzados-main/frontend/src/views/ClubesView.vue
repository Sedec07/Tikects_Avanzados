<template>
  <div class="clubes-page">
    <h1>Clubes del Mundo</h1>
    <p>Listado de equipos desde archivo local JSON</p>

    <div class="grid-container">
      <InfoCard 
        v-for="(club, index) in listaClubes" 
        :key="index"
        :image="club.imagen"
        :title="club.nombre"
        :name="club.pais"
        :description="'Ciudad: ' + club.ciudad + ' | Estadio: ' + club.estadio"
        :body="'Fundación: ' + club.fundacion"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import InfoCard from '../components/InfoCard.vue';
import datos from '../JSON/clubes.json';

const listaClubes = ref(datos);
</script>

<style scoped>
.clubes-page {
  text-align: center;
  padding: 20px;
}
.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}
</style>