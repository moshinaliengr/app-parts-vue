import Vue from "vue";
import Vuex from "vuex";
import user from "./user";
import favoriteparts from "./modules/favoriteparts";
import module from "./modules/module";
import shoppinglist from "./modules/shoppingList";
import company from "src/store/modules/company";
// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */


const Store =  new Vuex.Store({
  actions: {
    getAuthConfig({ state }) {
      if (! state.user.authorization.token) {
        return false;
      }

      return {
        headers: {
          "DL-Authorization": state.user.authorization.token
        }
      };
    }
  },
  modules: {
    user,
    favoriteparts,
    module,
    shoppinglist,
    company
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
    strict: process.env.DEV,
});

export default Store;
