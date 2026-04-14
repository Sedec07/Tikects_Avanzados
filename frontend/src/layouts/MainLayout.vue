<template>
  <div class="layout">
    <header class="layout-header">
      <nav>
        <RouterLink to="/">Log in</RouterLink>
      </nav>
    </header>

    <main class="layout-main">
      <RouterView />
    </main>

    <footer class="layout-footer">
      <p>© 2026 Vue 3 Ejemplo</p>
    </footer>
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
