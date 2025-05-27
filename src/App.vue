<!-- <template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script> -->

<template>
  <AppNavbar /> <!-- ✅ Nuevo nombre del componente -->
  <router-view />
</template>

<script>
import AppNavbar from './components/AppNavbar.vue'; // ✅ Ruta corregida

export default {
  components: {
    AppNavbar // ✅ Registro correcto
  }
}
</script>