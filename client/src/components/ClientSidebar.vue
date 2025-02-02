<template>
  <v-navigation-drawer :model-value="drawer" @update:model-value="toggleSidebar" app width="260" color="#1E1E1E">
    <v-list>
      <v-divider></v-divider>


      <v-list-item to="/client/appointments" class="sidebar-item">
        <v-icon class="mr-2" color="yellow">mdi-calendar</v-icon>
        <span class="sidebar-text">Programarile Mele</span>
      </v-list-item>

      <v-list-item to="/client/book" class="sidebar-item">
        <v-icon class="mr-2" color="yellow">mdi-clock</v-icon>
        <span class="sidebar-text">Programeaza-te</span>
      </v-list-item>

      <v-spacer></v-spacer>

      <v-list-item @click="logout" class="sidebar-item">
        <v-icon class="mr-2" color="yellow">mdi-logout</v-icon>
        <span class="sidebar-text">Logout</span>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  props: { drawer: Boolean },
  emits: ["update:drawer"],
  setup(_, { emit }) {
    const router = useRouter();

    const toggleSidebar = (value) => emit("update:drawer", value);
    const logout = () => {
      localStorage.clear();
      emit("update:drawer", false);
      router.push("/login");
    };

    return { toggleSidebar, logout };
  },
};
</script>

<style scoped>
.sidebar-item {
  color: yellow !important;
  font-weight: bold;
}
.sidebar-text {
  font-size: 16px;
  color: yellow;
}
</style>
