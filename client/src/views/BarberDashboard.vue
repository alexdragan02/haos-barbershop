<template>
    <v-app>
      <v-app-bar app color="black" dark>
        <v-app-bar-nav-icon color="yellow" @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="navbar-title">Barber Dashboard</v-toolbar-title>
      </v-app-bar>
  
      <BarberSidebar v-model:drawer="drawer" />
  
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import BarberSidebar from "../components/BarberSidebar.vue";

export default {
  components: { BarberSidebar },
  setup() {
    const drawer = ref(true);
    const router = useRouter();

    onMounted(() => {
      const role = localStorage.getItem("role");
      if (role !== "barber") {
        router.push("/login"); 
      }
    });

    return { drawer };
  },
};
</script>

<style scoped>
.navbar-title {
  color: yellow;
  font-weight: bold;
}
</style>
