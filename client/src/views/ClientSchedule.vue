<template>
    <v-container class="content">
      <v-card class="pa-4 custom-card">
        <v-card-title class="text-center text-h4 font-weight-bold">
          Programeaza-te
        </v-card-title>
  
        <v-row>
          <v-col cols="12">
            <v-card class="pa-3 service-container">
              <v-card-title class="text-center text-h6 font-weight-bold">
                Alege un serviciu sau pachet
              </v-card-title>
              <v-row class="mt-2" justify="center">
                <v-col v-for="service in services" :key="service.id" cols="12" sm="4" md="4">
                  <v-card
                    class="selectable-card"
                    :class="{ selected: selectedService === service.id }"
                    @click="selectService(service)"
                  >
                    <v-card-title class="text-center font-weight-bold small-text">
                      {{ service.name }}
                    </v-card-title>
                    <v-card-text class="package-content">
                      ⏳ {{ service.duration }} MIN | 💰 {{ service.price }} RON
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col v-for="pack in packages" :key="pack.id" cols="12" sm="4" md="4">
                  <v-card
                    class="selectable-card"
                    :class="{ selected: selectedPackage === pack.id }"
                    @click="selectPackage(pack)"
                  >
                    <v-card-title class="text-center font-weight-bold small-text">
                      {{ pack.name }}
                    </v-card-title>
                    <v-card-text class="package-content">
                      💰 {{ pack.finalPrice }} RON | ⏳ {{ pack.totalDuration }} MIN
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
  
        
  
        <v-row>
          <v-col cols="12">
            <v-card class="pa-3 service-container">
              <v-card-title class="text-center text-h6 font-weight-bold">
                Alege un frizer
              </v-card-title>
              <v-select
                label="Frizer"
                v-model="selectedBarber"
                :items="barbers"
                item-title="firstName"
                item-value="id"
                variant="outlined"
                @update:modelValue="fetchAvailableHours"
              ></v-select>
            </v-card>
          </v-col>
        </v-row>
  
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="date"
              label="Data"
              type="date"
              variant="outlined"
              @change="fetchAvailableHours"
            ></v-text-field>
          </v-col>
  
          <v-col cols="12" md="6">
            <v-select
              label="Ora Disponibilă"
              v-model="timeSlot"
              :items="availableHours"
              variant="outlined"
              :disabled="availableHours.length === 0"
            ></v-select>
          </v-col>
        </v-row>
  
        <v-btn color="primary" block class="mt-3" @click="confirmAppointment">
          CONFIRMA PROGRAMAREA
        </v-btn>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import api from "../api";
  
  export default {
    setup() {
      const selectedService = ref(null);
      const selectedPackage = ref(null);
      const selectedBarber = ref(null);
      const selectedDuration = ref(30);
      const services = ref([]);
      const packages = ref([]);
      const barbers = ref([]);
      const date = ref("");
      const timeSlot = ref("");
      const availableHours = ref([]);
      const clientId = localStorage.getItem("userId");
  
      const fetchServices = async () => {
        try {
          const response = await api.get("/services");
          services.value = response.data || [];
        } catch (error) {
          console.error("Eroare la încărcarea serviciilor", error);
        }
      };
  
      const fetchPackages = async () => {
        try {
          const response = await api.get("/package/getPackages");
          packages.value = response.data || [];
        } catch (error) {
          console.error("Eroare la încărcarea pachetelor", error);
        }
      };
  
      const fetchBarbers = async () => {
        try {
          const response = await api.get("/auth/getUsers?role=barber");
          barbers.value = response.data.users || [];
        } catch (error) {
          console.error("Eroare la încărcarea frizerilor", error);
        }
      };
  
      const selectService = (service) => {
        selectedService.value = service.id;
        selectedPackage.value = null;
        selectedDuration.value = service.duration;
        fetchAvailableHours();
      };
  
      const selectPackage = (pack) => {
        selectedPackage.value = pack.id;
        selectedService.value = null;
        selectedDuration.value = pack.totalDuration;
        fetchAvailableHours();
      };
  
      const fetchAvailableHours = async () => {
        if (!date.value || !selectedBarber.value) return;
  
        try {
          const response = await api.get(`/appointments/getAppointmentsByBarber/${selectedBarber.value}/${date.value}`);
          const bookedTimes = response.data.appointments.map(a => a.timeSlot);
          generateAvailableHours(bookedTimes);
        } catch (error) {
          console.error("Eroare la verificarea disponibilității", error);
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
  
      const confirmAppointment = async () => {
        try {
          await api.post("appointments/addAppointments", {
            clientId,
            barberId: selectedBarber.value,
            serviceId: selectedService.value || null,
            packageId: selectedPackage.value || null,
            date: date.value,
            timeSlot: timeSlot.value,
          });
  
          alert("Programare conrfirmata!");
  
          resetForm();
        } catch (error) {
          alert("Eroare la confirmarea programarii!");
        }
      };
  
      const resetForm = () => {
        selectedService.value = null;
        selectedPackage.value = null;
        selectedBarber.value = null;
        selectedDuration.value = 30;
        date.value = "";
        timeSlot.value = "";
        availableHours.value = [];
      };
  
      onMounted(() => {
        fetchServices();
        fetchPackages();
        fetchBarbers();
      });
  
      return { services, packages, barbers, selectedService, selectedPackage, selectedBarber, date, timeSlot, availableHours, confirmAppointment, selectService, selectPackage, fetchAvailableHours, resetForm };
    },
  };
  </script>
  
  


  
  
  <style scoped>
  .content {
    max-width: 1000px;
    margin: auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  
  .custom-card {
    width: 100%;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
  }
  
  .service-container {
    background: #f9f9f9;
    border-radius: 12px;
    padding: 12px;
  }
  
  .selectable-card {
    background: #f5f5f5;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .selected {
    background: #1976d2 !important;
    color: white !important;
    transform: scale(1.05);
  }
  
  .selected-card {
    background: #e3f2fd;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    transition: 0.3s ease-in-out;
  }
  </style>
  