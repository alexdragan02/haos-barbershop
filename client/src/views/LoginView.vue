<template>
  <v-container>
    <LoginForm v-if="isLogin" @toggleForm="isLogin = false" />
    <RegisterForm v-else @toggleForm="isLogin = true" />
  </v-container>
</template>

<script>
import { ref } from "vue";
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";

export default {
  components: { LoginForm, RegisterForm },
  setup() {
    const isLogin = ref(true);

    return { isLogin };
  },
};
</script>

<style scoped>
.v-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
