<template>
    <v-container class="fill-height d-flex justify-center align-center">
      <v-card class="pa-5" width="400">
        <v-card-title class="text-center text-h5">
          {{ showRegister ? "Register" : "Login" }}
        </v-card-title>
  
        <v-card-text>
          <v-form ref="form">
            <template v-if="!showRegister">
              <v-text-field v-model="email" label="Email" type="email" variant="outlined" prepend-icon="mdi-email" required></v-text-field>
              <v-text-field v-model="password" label="Parola" type="password" variant="outlined" prepend-icon="mdi-lock" required></v-text-field>
              <v-btn color="primary" block @click="login">Login</v-btn>
            </template>
  
            <template v-else>
              <v-text-field v-model="username" label="Username" variant="outlined" prepend-icon="mdi-account" required></v-text-field>
              <v-text-field v-model="firstName" label="Prenume" variant="outlined" prepend-icon="mdi-account" required></v-text-field>
              <v-text-field v-model="lastName" label="Nume" variant="outlined" prepend-icon="mdi-account" required></v-text-field>
              <v-text-field v-model="email" label="Email" type="email" variant="outlined" prepend-icon="mdi-email" required></v-text-field>
              <v-text-field v-model="password" label="Parola" type="password" variant="outlined" prepend-icon="mdi-lock" required></v-text-field>
              <v-text-field v-model="phoneNumber" label="Telefon" type="tel" variant="outlined" prepend-icon="mdi-phone" required></v-text-field>
              <v-btn color="primary" block @click="register">Creează cont</v-btn>
            </template>
          </v-form>
        </v-card-text>
  
        <v-card-actions class="justify-center">
          <p v-if="!showRegister">
            Nu ai cont? <a href="#" @click.prevent="showRegister = true">Register</a>
          </p>
          <p v-else>
            Ai un cont? <a href="#" @click.prevent="showRegister = false">Login</a>
          </p>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import api from "../api";
  
  export default {
    setup() {
      const showRegister = ref(false);
      const email = ref("");
      const password = ref("");
      const username = ref("");
      const firstName = ref("");
      const lastName = ref("");
      const phoneNumber = ref("");
      const router = useRouter();
  
      const login = async () => {
        try {
          const response = await api.post("/auth/login", { email: email.value, password: password.value });
          const role = response.data.role;
          const userId = response.data.userId;
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
  
          if (role === "client") router.push("/client/appointments");
          else if (role === "barber") router.push("/barber/appointments");
          else {
            alert("Access interzis!");
            localStorage.clear();
          }
        } catch (error) {
          alert("Eroare " + (error.response?.data?.message || "email sau parola gresita"));
        }
      };
  
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
          showRegister.value = false;
          alert("te ai intregistrat cu success!!!");
        } catch (error) {
          alert("Eroare la inregistrare: " + (error.response?.data?.message));
        }
      };
  
      return { email, password, username, firstName, lastName, phoneNumber, login, register, showRegister };
    },
  };
  </script>
  