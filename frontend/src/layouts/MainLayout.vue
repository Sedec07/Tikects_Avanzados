<template>
  <div>

    <!-- 🔵 NAVBAR -->
    <nav class="navbar navbar-dark bg-dark px-4">
      <span class="navbar-brand">Sistema de Tickets</span>

      <div class="d-flex gap-2">
        <router-link to="/tickets" class="btn btn-outline-light btn-sm">
          📋 Ver Tickets
        </router-link>

        <router-link to="/crear-ticket" class="btn btn-success btn-sm">
          ➕ Crear Ticket
        </router-link>
      </div>
    </nav>

    <!-- 🔽 AQUÍ CAMBIAN LAS PANTALLAS -->
    <div class="container mt-4">
      <router-view />
    </div>

  </div>
</template>
<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

.layout-header {
  background-color: #2c3e50;
  padding: 1rem 2rem;
}

.layout-header nav {
  display: flex;
  gap: 1.5rem;
}

.layout-header nav a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

.layout-header nav a.router-link-active {
  color: #42b883;
}

.layout-main {
  flex: 1;
  padding: 2rem;
}

.layout-footer {
  background-color: #2c3e50;
  color: #ccc;
  text-align: center;
  padding: 1rem;
}
</style>
