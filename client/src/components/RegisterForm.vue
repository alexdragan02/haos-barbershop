<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-5" width="400">
      <v-card-title class="text-center text-h5">Register</v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="username" label="Username" variant="outlined" prepend-icon="mdi-account" required></v-text-field>
          <v-text-field v-model="firstName" label="Prenume" variant="outlined" prepend-icon="mdi-account" required></v-text-field>
          <v-text-field v-model="lastName" label="Nume" variant="outlined" prepend-icon="mdi-account" required></v-text-field>
          <v-text-field v-model="email" label="Email" type="email" variant="outlined" prepend-icon="mdi-email" required></v-text-field>
          <v-text-field v-model="password" label="Parola" type="password" variant="outlined" prepend-icon="mdi-lock" required></v-text-field>
          <v-text-field v-model="phoneNumber" label="Telefon" type="tel" variant="outlined" prepend-icon="mdi-phone" required></v-text-field>

          <v-btn color="primary" block @click="register">
            Creeaza cont
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center">
        <p>Ai un cont deja?
          <a href="#" @click.prevent="emit('toggleForm')">Login</a>
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
    const username = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const password = ref("");
    const phoneNumber = ref("");

    const register = async () => {
      try {
        await api.post("/auth/register", { 
          username: username.value,
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
          phoneNumber: phoneNumber.value,
        });

        alert("Înregistrare reusita! Poti sa te autentifici.");
        emit("toggleForm"); 

      } catch (error) {
        alert("Eroare la inregistrare: " + (error.response?.data?.message ));
      }
    };

    return { username, firstName, lastName, email, password, phoneNumber, register, emit };
  },
};
</script>
