<template>
    <v-container class="content">
        <v-card class="pa-5">
            <v-card-title class="text-h4 text-center">Programarile Mele</v-card-title>

            <v-card-text>
                <v-text-field
                    v-model="selectedDate"
                    label="Selecteaza data"
                    type="date"
                    variant="outlined"
                    @change="fetchAppointments"
                ></v-text-field>

                <!-- 🔥 Buton pentru a vedea toate programările -->
                <v-btn color="primary" block class="mt-3" @click="fetchAllAppointments">
                    Vezi toate programarile
                </v-btn>

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
                                    <strong>Client:</strong> {{ appointment.clientName }}
                                </p>
                                <p>
                                    <v-icon class="mr-2">mdi-content-cut</v-icon>
                                    <strong>Serviciu:</strong> {{ appointment.serviceName || appointment.packageName }}
                                </p>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions class="justify-center">
                                <v-btn color="red" @click="deleteAppointment(appointment.id)">
                                    <v-icon>mdi-delete</v-icon> Sterge
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
        const barberId = ref(localStorage.getItem("userId"));
        const selectedDate = ref(new Date().toISOString().split("T")[0]); 

        const fetchAppointments = async () => {
            if (!selectedDate.value) return;

            try {
                const response = await api.get(`/appointments/getAppointmentsByBarber/${barberId.value}/${selectedDate.value}`);
                appointments.value = response.data.appointments || [];
            } catch (error) {
                console.error("Eroare la preluarea programărilor:", error);
            }
        };

        const fetchAllAppointments = async () => {
            try {
                const response = await api.get(`/appointments/getAllAppointmentsForBarber/${barberId.value}`);
                appointments.value = response.data.appointments || [];
            } catch (error) {
                console.error("Eroare la preluarea tuturor programărilor:", error);
            }
        };

        const deleteAppointment = async (appointmentId) => {
            if (!confirm("Doresti sa stergi programarea?")) return;
            try {
                await api.delete(`/appointments/deleteAppointment/${appointmentId}`);
                appointments.value = appointments.value.filter(a => a.id !== appointmentId);
                alert("Programarea a fost stearsa!");
            } catch (error) {
                alert("Eroare la stergere !");
            }
        };

        onMounted(fetchAppointments);

        return { appointments, selectedDate, fetchAppointments, fetchAllAppointments, deleteAppointment };
    },
};
</script>

<style scoped>
.content {
    max-width: 1000px;
    margin: auto;
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
