import { getFavoriteParts, addFavoritePart, removeFavoritePart } from "services/TruckPartsCross";

export default {
  namespaced: true,
  state: {
    items: [],
    loaded: false
  },
  mutations: {
    SET_ITEMS(state, { items }) {
      state.items = items;
    },
    SET_LOADED(state, { loaded }) {
      state.loaded = loaded;
    },
    ADD_ITEM(state, { item }) {
      state.items.push(item);
    },
    REMOVE_ITEM(state, { item }) {
      state.items.splice(state.items.indexOf(item), 1);
    }
  },
  actions: {
    async ensureItems({ state, dispatch }) {
      if (!state.loaded) {
        await dispatch("getItems");
      }
    },
    async getItems({ rootState, commit }) {
      const userID = rootState.user.information.id;
      const items = await getFavoriteParts({ userID });

      if (items) {
        commit("SET_ITEMS", { items });
      }

      commit("SET_LOADED", { loaded: true });
    },
    async addItem({ rootState, commit }, { partID }) {
      const userID = rootState.user.information.id;
      const item = await addFavoritePart({ userID, partID });

      if (item) {
        commit("ADD_ITEM", { item });
      }
    },
    async removeItem({ state, commit }, { partID }) {
      const item = state.items.find((item) => item.part_id === partID);
      const result = await removeFavoritePart({ id: item.id });

      if (result) {
        commit("REMOVE_ITEM", { item });
      }
    }
  }
};
