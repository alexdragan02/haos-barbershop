<template>
    <v-container class="content">
      <v-card class="pa-5">
        <v-card-title class="text-h4 text-center">Programarile Mele</v-card-title>
        <v-card-text>
          <v-row v-if="appointments.length > 0">
            <v-col v-for="appointment in appointments" :key="appointment.id" cols="12" sm="6" md="4">
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
                    <strong>Frizer:</strong> {{ appointment.barberName }}
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
                  <v-btn color="blue" @click="openEditDialog(appointment)">
                    <v-icon>mdi-pencil</v-icon> Editeaza
                  </v-btn>
                  <v-btn color="red" @click="deleteAppointment(appointment.id)">
                    <v-icon>mdi-delete</v-icon> Sterge
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
  
          <p v-else class="text-center text-h6 mt-3">Nu ai programari!</p>
        </v-card-text>
      </v-card>
  
      <v-dialog v-model="editDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">Editează programarea</v-card-title>
          <v-card-text>
            <v-form ref="editForm">
              <v-text-field v-model="editedAppointment.date" label="Data" type="date" variant="outlined" @change="fetchAvailableHours"></v-text-field>
  
              <v-select label="Frizer" v-model="editedAppointment.barberId" :items="barbers" item-title="firstName" item-value="id" variant="outlined" @update:modelValue="fetchAvailableHours"></v-select>
  
              <v-select label="Ora Disponibilă" v-model="editedAppointment.timeSlot" :items="availableHours" variant="outlined" :disabled="availableHours.length === 0"></v-select>
  
              <v-select label="Serviciu" v-model="editedAppointment.serviceId" :items="services" item-title="name" item-value="id" variant="outlined"></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="red" @click="editDialog = false">Anuleaza</v-btn>
            <v-btn color="green" @click="updateAppointment">Salveaza </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import api from "../api";
  
  export default {
    setup() {
      const appointments = ref([]);
      const barbers = ref([]);
      const services = ref([]);
      const availableHours = ref([]);
      const editDialog = ref(false);
      const editedAppointment = ref({});
  
      const clientId = localStorage.getItem("userId");
  
      const fetchAppointments = async () => {
        try {
          const response = await api.get(`/appointments/getAppointmentsByClient/${clientId}`);
          appointments.value = response.data.appointments || [];
        } catch (error) {
          console.error("Eroare la preluarea programărilor", error);
        }
      };
  
      const fetchBarbers = async () => {
        try {
          const response = await api.get("/auth/getUsers?role=barber");
          barbers.value = response.data.users || [];
        } catch (error) {
          console.error("Eroare la preluarea frizerilor", error);
        }
      };
  
      const fetchServices = async () => {
        try {
          const response = await api.get("/services");
          services.value = response.data || [];
        } catch (error) {
          console.error("Eroare la preluarea serviciilor", error);
        }
      };
  
      const openEditDialog = (appointment) => {
        editedAppointment.value = { ...appointment };
        fetchAvailableHours();
        editDialog.value = true;
      };
  
      const fetchAvailableHours = async () => {
        if (!editedAppointment.value.date || !editedAppointment.value.barberId) return;
  
        try {
          const response = await api.get(`/appointments/getAppointmentsByBarber/${editedAppointment.value.barberId}/${editedAppointment.value.date}`);
          const bookedTimes = response.data.appointments.map(a => a.timeSlot);
          generateAvailableHours(bookedTimes);
        } catch (error) {
          console.error("Eroare la verificarea disponibilitatii", error);
        }
      };
  
      const generateAvailableHours = (bookedTimes) => {
        const startHour = 10;
        const endHour = 18;
        const available = [];
  
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute of [0, 30]) {
            const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
            if (!bookedTimes.includes(time)) {
              available.push(time);
            }
          }
        }
        availableHours.value = available;
      };
  
      const updateAppointment = async () => {
        try {
          await api.put(`/appointments/updateAppointment/${editedAppointment.value.id}`, editedAppointment.value);
          alert("Programarea a fost actualizata cu succes!");
          editDialog.value = false;
          fetchAppointments();
        } catch (error) {
          alert("Eroare la actualizarea programarii!!!");
        }
      };
  
      const deleteAppointment = async (appointmentId) => {
        if (!confirm("Vrei sa stergi programarea programare?")) return;
        try {
          await api.delete(`/appointments/deleteAppointment/${appointmentId}`);
          appointments.value = appointments.value.filter(a => a.id !== appointmentId);
          alert("Programarea a fost stearsa!");
        } catch (error) {
          alert("Eroare la stergerea dorita!");
        }
      };
  
      onMounted(() => {
        fetchAppointments();
        fetchBarbers();
        fetchServices();
      });
  
      return { appointments, barbers, services, availableHours, editDialog, editedAppointment, openEditDialog, fetchAvailableHours, updateAppointment, deleteAppointment };
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
  