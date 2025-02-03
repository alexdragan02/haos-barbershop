<template>
    <v-container class="content">
        <v-card class="pa-5">
            <v-card-title class="text-h4 text-center">Programarile Mele</v-card-title>

            <v-row class="mb-3">
                <v-col cols="12" md="4">
                    <v-select
                        v-model="selectedFilter"
                        :items="filterOptions"
                        label="Filtrează după"
                        variant="outlined"
                    ></v-select>
                </v-col>
            </v-row>

            <v-card-text>
                <v-row v-if="filteredAppointments.length > 0">
                    <v-col v-for="appointment in filteredAppointments" :key="appointment.id" cols="12" sm="6" md="4">
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
                                    <strong>Frizer:</strong> {{ appointment.barberName || 'N/A' }}
                                </p>
                                <p>
                                    <v-icon class="mr-2">mdi-content-cut</v-icon>
                                    <strong>Serviciu:</strong> {{ appointment.serviceName || appointment.packageName || 'N/A' }}
                                </p>
                                <p>
                                    <v-icon class="mr-2">mdi-cash</v-icon>
                                    <strong>Pret:</strong> {{ appointment.totalPrice || 0 }} RON
                                </p>
                                <p>
                                    <v-icon class="mr-2">mdi-clock-outline</v-icon>
                                    <strong>Durata:</strong> {{ appointment.totalDuration || 0 }} min
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

        <v-dialog v-model="editDialog" max-width="500" :key="editedAppointment?.id">
            <v-card v-if="editDialog && editedAppointment">
                <v-card-title class="text-h5">Editeaza programarea</v-card-title>
                <v-card-text>
                    <v-form ref="editForm">
                        <v-text-field v-model="editedAppointment.date" label="Data" type="date" variant="outlined"
                            @change="fetchAvailableHours"></v-text-field>

                        <v-select label="Frizer" v-model="editedAppointment.barberId" :items="barbers" 
                            item-title="fullName" item-value="id" variant="outlined"></v-select>

                        <v-select label="Ora Disponibilă" v-model="editedAppointment.timeSlot" :items="availableHours"
                            variant="outlined" :disabled="availableHours.length === 0"></v-select>

                        <v-select label="Serviciu/Pachet" v-model="editedAppointment.serviceId" 
                            :items="servicesAndPackages"
                            item-title="name" 
                            item-value="id"
                            variant="outlined">
                        </v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="red" @click="closeEditDialog">Anuleaza</v-btn>
                    <v-btn color="green" @click="updateAppointment">Salveaza</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

export default {
    setup() {
        const store = useStore();
        const editDialog = ref(false);
        const editedAppointment = ref(null);
        const selectedFilter = ref("Recente");
        const filterOptions = ref(["Recente", "Preț crescător", "Preț descrescător"]);

        const appointments = computed(() => store.getters['appointments/getAppointments']);
        const barbers = computed(() => store.getters['auth/getBarbers']);
        const servicesAndPackages = computed(() => [
            ...store.getters['services/getServices'].map(s => ({...s, name: `Serviciu: ${s.name}`})),
            ...store.getters['services/getPackages'].map(p => ({...p, name: `Pachet: ${p.name}`}))
        ]);
        const availableHours = computed(() => store.getters['appointments/getAvailableHours']);

        const fetchData = async () => {
            await store.dispatch('appointments/fetchAppointments');
            await store.dispatch('auth/fetchBarbers');
            await store.dispatch('services/fetchServices');
            await store.dispatch('services/fetchPackages');
        };

        const openEditDialog = (appointment) => {
            editedAppointment.value = { ...appointment };
            fetchAvailableHours();
            editDialog.value = true;
        };

        const closeEditDialog = () => {
            editedAppointment.value = null;
            editDialog.value = false;
        };

        const updateAppointment = async () => {
            try {
                await store.dispatch('appointments/updateAppointment', editedAppointment.value);
                editDialog.value = false;
                alert("Programarea a fost actualizata!!!!");
            } catch (error) {
                alert("eroare la update");
            }
        };

        const deleteAppointment = async (id) => {
            if (confirm("Sunteti sigur de stergere?")) {
                await store.dispatch('appointments/deleteAppointment', id);
            }
        };

        const fetchAvailableHours = async () => {
            if (editedAppointment.value?.date && editedAppointment.value?.barberId) {
                await store.dispatch('appointments/fetchAvailableHours', {
                    barberId: editedAppointment.value.barberId,
                    date: editedAppointment.value.date
                });
            }
        };

        const filteredAppointments = computed(() => {
            const apps = [...appointments.value];
            switch (selectedFilter.value) {
                case 'Pret crescator': return apps.sort((a, b) => a.totalPrice - b.totalPrice);
                case 'Pret descrescator': return apps.sort((a, b) => b.totalPrice - a.totalPrice);
                default: return apps.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        });

        onMounted(fetchData);

        return {
            appointments,
            barbers,
            servicesAndPackages,
            availableHours,
            editDialog,
            editedAppointment,
            selectedFilter,
            filterOptions,
            filteredAppointments,
            openEditDialog,
            closeEditDialog,
            updateAppointment,
            deleteAppointment,
            fetchAvailableHours
        };
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
