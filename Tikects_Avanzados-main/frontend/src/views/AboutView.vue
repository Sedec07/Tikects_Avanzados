<template>
  <div>
    <h1>Hoja de Vida</h1>
    <p>Me presento:</p>
    
    <HojaDeVidaCard :perfil="misDatos" />
  </div>
</template>

<script setup>
import { ref } from 'vue'; 
import HojaDeVidaCard from '../components/HojaDeVidaCard.vue';
import miJson from '../JSON/hojadevida.json';


const misDatos = ref(miJson);
</script>