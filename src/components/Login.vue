<template>
  <div class="info-card">
    <div class="info-card__image-container">
      <img src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png" alt="Login Logo" class="info-card__image" />
    </div>
    
    <h3 class="info-card__title">Iniciar Sesión</h3>
    
    <form @submit.prevent="handleLogin" class="info-card__form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          v-model="email" 
          type="email" 
          id="email" 
          placeholder="admin1@tickets.com" 
          required 
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input 
          v-model="password" 
          type="password" 
          id="password" 
          placeholder="********" 
          required 
        />
      </div>

      <button type="submit" class="btn-login">Ingresar</button>
    </form>

    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    errorMessage.value = ""; // Limpiar errores previos
    const res = await axios.post('http://localhost:3000/api/login', {
      email: email.value,
      password: password.value
    });
    
    // Guardamos el token (JWT)
    localStorage.setItem('token', res.data.token);
    alert('¡Login exitoso!');
    
  } catch (err) {
    // Si el servidor responde con error o no está prendido
    errorMessage.value = err.response?.data?.message || "Error al conectar con el servidor";
  }
};
</script>

<style scoped>
.info-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 25px;
  width: 320px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  background-color: white;
}

.info-card__image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 15px;
  object-fit: cover;
}

.form-group {
  text-align: left;
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.btn-login {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  transition: 0.3s;
}

.btn-login:hover {
  background-color: #34495e;
}

.error-msg {
  color: red;
  font-size: 0.8rem;
  margin-top: 10px;
  font-weight: bold;
}
</style>