import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import ClientDashboard from "../views/ClientDashboard.vue";
import ClientAppointments from "../views/ClientAppointments.vue";
import ClientSchedule from "../views/ClientSchedule.vue";

import BarberDashboard from "../views/BarberDashboard.vue";
import BarberAppointments from "../views/BarberAppointments.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },

  {
    path: "/client",
    component: ClientDashboard,
    children: [
      { path: "appointments", component: ClientAppointments },
      { path: "book", component: ClientSchedule },
    ],
  },

  {
    path: "/barber",
    component: BarberDashboard,
    children: [
      { path: "appointments", component: BarberAppointments },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
