<template>
    <v-app>
      <v-app-bar app color="black" dark>
        <v-app-bar-nav-icon color="yellow" @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="navbar-title">Haos Barbershop</v-toolbar-title>
      </v-app-bar>
  
      <ClientSidebar v-model:drawer="drawer" />
  
      <v-main :class="{ 'main-expanded': drawer }">
        <router-view></router-view>
      </v-main>
    </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";  
import ClientSidebar from "../components/ClientSidebar.vue";

export default {
  components: { ClientSidebar },
  setup() {
    const drawer = ref(true);
    const router = useRouter();

    onMounted(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); 
      }
    });

    return { drawer };
  },
};
</script>

<style scoped>
.v-main {
  transition: margin-left 0.3s ease-in-out;
  padding: 16px;
}

.main-expanded {
  margin-left: 260px; 
}

.navbar-title {
  color: yellow; 
  font-weight: bold;
}
</style>
