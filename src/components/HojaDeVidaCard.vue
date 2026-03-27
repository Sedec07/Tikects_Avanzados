<template>
  <div class="perfil-completo">
    <section class="perfil-header">
      <img :src="perfil.datos_personales.foto" class="foto-perfil" alt="Mi Foto" />
      <div class="info-basica">
        <h2>{{ perfil.datos_personales.nombre }}</h2>
        <p class="rol">{{ perfil.datos_personales.rol }}</p>
        <p>{{ perfil.datos_personales.ubicacion }} | {{ perfil.datos_personales.modalidad }}</p>
      </div>
    </section>

    <section class="perfil-bio">
      <h3>Perfil Profesional</h3>
      <p>{{ perfil.perfil_profesional }}</p>
    </section>

    <section class="perfil-skills">
      <h3>Habilidades Técnicas</h3>
      <div class="habilidades-container">
        <span v-for="(habilidad, index) in perfil.habilidades" :key="index" class="skill-tag">
          {{ habilidad }}
        </span>
      </div>
    </section>

    <section class="perfil-proyectos">
      <h3>Proyectos Recientes</h3>
      <div v-for="(proy, index) in perfil.proyectos_recientes" :key="index" class="proyecto-item">
        <h4>{{ proy.nombre }} <small>({{ proy.tecnologia }})</small></h4>
        <p>{{ proy.descripcion }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
defineProps(['perfil']);
</script>

<style scoped>
.perfil-completo { padding: 20px; border: 1px solid #eee; border-radius: 12px; }
.perfil-header { display: flex; gap: 20px; align-items: center; border-bottom: 2px solid #42b983; padding-bottom: 20px; }
.foto-perfil { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; }
.habilidades-container { display: flex; flex-wrap: wrap; gap: 10px; }
.skill-tag { background: #42b983; color: white; padding: 5px 12px; border-radius: 15px; font-size: 0.9em; }
.proyecto-item { margin-top: 15px; padding: 10px; border-left: 4px solid #42b983; background: #fdfdfd; }
h3 { margin-top: 25px; color: #2c3e50; }
</style>