import { createStore } from 'vuex';
import auth from './auth';
import appointments from './appointments';
import services from './services';

export default createStore({
  modules: {
    auth,
    appointments,
    services,
  }
});
