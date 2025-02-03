import api from "../api";

export default {
  namespaced: true,
  state: {
    appointments: [],
    availableHours: [],
  },
  mutations: {
    SET_APPOINTMENTS(state, appointments) {
      state.appointments = appointments || [];
    },
    DELETE_APPOINTMENT(state, id) {
      state.appointments = state.appointments.filter((app) => app.id !== id);
    },
    SET_AVAILABLE_HOURS(state, hours) {
      state.availableHours = hours || [];
    },
    UPDATE_APPOINTMENT(state, updatedAppointment) {
      const index = state.appointments.findIndex((a) => a.id === updatedAppointment.id);
      if (index !== -1) {
        state.appointments[index] = updatedAppointment;
      }
    }
  },
  actions: {
    async fetchAppointments({ commit, rootState }) {
      try {
        const clientId = rootState.auth.user?.id || localStorage.getItem("userId");

        if (!clientId) {
          console.error("eroare client id nu exista sau e eronat");
          return;
        }

        const response = await api.get(`/appointments/getAppointmentsByClient/${clientId}`);
        
        if (!response.data || !response.data.appointments) {
          console.warn("nu exista programari");
          commit("SET_APPOINTMENTS", []);
        } else {
          commit("SET_APPOINTMENTS", response.data.appointments);
        }

      } catch (error) {
        console.error("eroare la incarcare erori", error);
      }
    },
    async deleteAppointment({ commit }, id) {
      try {
        await api.delete(`/appointments/deleteAppointment/${id}`);
        commit("DELETE_APPOINTMENT", id);
      } catch (error) {
        console.error("eroare", error);
      }
    },
    async updateAppointment({ commit, dispatch }, appointmentData) {
        try {
            await api.put(`/appointments/updateAppointment/${appointmentData.id}`, appointmentData);
            
            commit("UPDATE_APPOINTMENT", appointmentData);
    
            await dispatch("fetchAppointments");
    
        } catch (error) {
            console.error("eroare update", error);
        }
    }
    ,
async fetchAvailableHours({ commit }, { barberId, date }) {
    try {
        const response = await api.get(`/appointments/getAppointmentsByBarber/${barberId}/${date}`);
        const bookedTimes = response.data.appointments.map(a => a.timeSlot);
        commit("SET_AVAILABLE_HOURS", generateAvailableHours(bookedTimes));
    } catch (error) {
        console.error("eroare verif ore", error);
    }
}
  },
  getters: {
    getAppointments: (state) => state.appointments || [],
    getAvailableHours: (state) => state.availableHours || [],
  }
};

function generateAvailableHours(bookedTimes) {
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
  return available;
}
