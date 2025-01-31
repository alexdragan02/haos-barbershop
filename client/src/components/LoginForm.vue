<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-5" width="400">
      <v-card-title class="text-center text-h5">Login</v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="email" label="Email" type="email" variant="outlined" prepend-icon="mdi-email" required></v-text-field>
          <v-text-field v-model="password" label="Parola" type="password" variant="outlined" prepend-icon="mdi-lock" required></v-text-field>

          <v-btn color="primary" block @click="login">
            Login
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center">
        <p>Nu ai cont? 
          <a href="#" @click.prevent="emit('toggleForm')">Register</a>
        </p>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from "vue";
import api from "../api";

export default {
  setup(props, { emit }) {
    const email = ref("");
    const password = ref("");

    const login = async () => {
      try {
        const response = await api.post("/auth/login", { 
          email: email.value,
          password: password.value,
        });

        const role = response.data.role;

        alert(`A mers auth+ role: ${role}`);
      } catch (error) {
        alert("Eroare " + (error.response?.data?.message || "email sau parola gresita"));
      }
    };

    return { email, password, login, emit };
  },
};
</script>

