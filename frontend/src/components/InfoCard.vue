<template>
  <div class="info-card">
    <div class="info-card__image-container">
      <img :src="image" alt="Imagen del card" class="info-card__image" />
    </div>
    <h3 class="info-card__title">{{ title }}</h3>
    <p class="info-card__name"><strong>Nombre:</strong> {{ name }}</p>
    <p class="info-card__desc">{{ description }}</p>
    <p class="info-card__body">{{ body }}</p>
  </div>
</template>
<script setup>
defineProps({
  image: String,
  title: String,
  name: String,
  description: String,
  body: String
});
</script>

<style scoped>
.info-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  width: 280px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.info-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}

.info-card__title {
  color: #2c3e50;
  margin: 10px 0;
}
</style>