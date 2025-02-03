import api from "../api";

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
  },
  mutations: {
    SET_USER(state, userData) {
      state.user = userData;
      state.role = userData.role;
      localStorage.setItem("userId", userData.userId);
      localStorage.setItem("role", userData.role);
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.clear();
    },
    SET_BARBERS(state,barbers){
        state.barbers=barbers;
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        console.log("trimit request login", credentials);
        
        const response = await api.post("/auth/login", credentials);
        
        if (response.status === 200 && response.data && response.data.token) {
          console.log("Login reusit:", response.data);

          const userData = {
            userId: response.data.userId,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phoneNumber: response.data.phoneNumber,
            role: response.data.role,
          };

          commit("SET_USER", userData);
          commit("SET_TOKEN", response.data.token);
          
          return response.data;
        } else {
          console.warn("raspuns eronat", response);
          throw new Error("rasp invalid de la server.");
        }
      } catch (error) {
        console.error("eroare la login", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Login failed");
      }
    },
    async register({ commit }, userData) {
        try {
            console.log("🔄 Trimitere request de register...", userData);
            
            const response = await api.post("/auth/register", userData);
            
            console.log("raspuns server:", response);
    
            if (response.status === 201 && response.data) {
                console.log(" Cont creat cu succes:", response.data);
    
                const newUser = {
                    userId: response.data.userId,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phoneNumber: response.data.phoneNumber,
                    role: response.data.role,
                };
    
                commit("SET_USER", newUser);
                commit("SET_TOKEN", response.data.token);
    
                return response.data; 
            } else {
                console.warn("raspuns eronat", response);
                throw new Error("eroare la register");
            }
        } catch (error) {
            console.error("eroare la inregistrare", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "inregistrare esuata");
        }
    },async fetchBarbers({ commit }) {
        try {
            const response = await api.get("/auth/getUsers?role=barber");
            commit('SET_BARBERS', response.data.users.map(b => ({
                id: b.id,
                fullName: `${b.firstName} ${b.lastName}`
            })));
        } catch (error) {
            console.error("Eroare la preluarea frizerilor", error);
        }
    }
    ,

    logout({ commit }) {
      commit("LOGOUT");
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUserRole: (state) => state.role,
    getUserId: (state) => state.user?.userId || localStorage.getItem("userId"), 
     getBarbers: (state) => state.barbers || [] ,
  }
};
