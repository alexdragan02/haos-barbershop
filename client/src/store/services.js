import api from "../api";

export default {
  namespaced: true,
  state: {
    services: [],
    packages: []
  },
  mutations: {
    SET_SERVICES(state, services) {
      state.services = services;
    },
    SET_PACKAGES(state, packages) {
      state.packages = packages;
    }
  },
  actions: {
    async fetchServices({ commit }) {
      try {
        const response = await api.get("/services");
        commit("SET_SERVICES", response.data);
      } catch (error) {
        console.error("Eroare la incarcarea serviciilor", error);
      }
    },
    async fetchPackages({ commit }) {
      try {
        const response = await api.get("/package/getPackages");
        commit("SET_PACKAGES", response.data);
      } catch (error) {
        console.error("Eroare incarcarea pachetelor", error);
      }
    }
  },
  getters: {
    getServices: (state) => state.services,
    getPackages: (state) => state.packages,
  }
};
