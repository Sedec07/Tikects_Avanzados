<template>
  <div class="home-container">
    <LoginCard />
  </div>
</template>

<script setup>
import LoginCard from '../components/login.vue';
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* Centrado vertical */
  padding: 20px;
}
</style>