<template>
    <v-container class="content">
      <v-card class="pa-5">
        <v-card-title class="text-h4 text-center">Programarile Mele</v-card-title>
        <v-card-text>
          <v-row v-if="appointments.length > 0">
            <v-col 
              v-for="appointment in appointments" 
              :key="appointment.id" 
              cols="12" sm="6" md="4"
            >
              <v-card class="appointment-card">
                <v-card-title class="text-center text-h5 font-weight-bold">
                  {{ appointment.date }}
                </v-card-title>
                
                <v-card-subtitle class="text-center">
                  <v-icon color="primary" class="mr-2">mdi-clock</v-icon>
                  {{ appointment.timeSlot }} - {{ appointment.finishTime }}
                </v-card-subtitle>
  
                <v-divider class="my-2"></v-divider>
  
                <v-card-text>
                  <p>
                    <v-icon class="mr-2">mdi-account</v-icon>
                    <strong>Barber:</strong> {{ appointment.barberName }}
                  </p>
                  <p>
                    <v-icon class="mr-2">mdi-content-cut</v-icon>
                    <strong>Serviciu:</strong> {{ appointment.serviceName || appointment.packageName }}
                  </p>
                  <p>
                    <v-icon class="mr-2">mdi-cash</v-icon>
                    <strong>Pret:</strong> {{ appointment.totalPrice }} RON
                  </p>
                  <p>
                    <v-icon class="mr-2">mdi-clock-outline</v-icon>
                    <strong>Durata:</strong> {{ appointment.totalDuration }} min
                  </p>
                </v-card-text>
  
                <v-divider></v-divider>
  
                <v-card-actions class="justify-center">
                  <v-btn color="red" @click="deleteAppointment(appointment.id)">
                    <v-icon>mdi-delete</v-icon> Sterge Programarea
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
  
          <p v-else class="text-center text-h6 mt-3">Nu ai programari.</p>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import api from "../api";
  
  export default {
    setup() {
      const appointments = ref([]);
      const clientId = ref(localStorage.getItem("userId"));
  
      const fetchAppointments = async () => {
        if (!clientId.value) {
          alert("Nu esti autentificat!");
          return;
        }
        try {
          const response = await api.get(`/appointments/getAppointmentsByClient/${clientId.value}`);
          appointments.value = response.data.appointments || [];
        } catch (error) {
          console.error("Eroare la preluarea programarilor", error);
        }
      };
  
      const deleteAppointment = async (appointmentId) => {
        if (!confirm("Doresti sa stergi programarea?")) return;
        try {
          await api.delete(`/appointments/deleteAppointment/${appointmentId}`);
          appointments.value = appointments.value.filter(a => a.id !== appointmentId);
          alert("Programarea a fost stearsa cu succes!");
        } catch (error) {
          alert("Eroare la stergerea programarii!");
        }
      };
  
      onMounted(fetchAppointments);
  
      return { appointments, deleteAppointment };
    },
  };
  </script>
  
  <style scoped>
  .content {
    max-width: 1200px;
    margin: auto;
    transition: margin-left 0.3s ease-in-out;
  }
  
  .appointment-card {
    background: #f5f5f5;
    border-radius: 10px;
    padding: 15px;
    transition: 0.3s ease-in-out;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .appointment-card:hover {
    transform: scale(1.02);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  }
  </style>
  