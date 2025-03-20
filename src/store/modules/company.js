// Libraries & Features
import axios from "axios"

const state = {
  companyShop: null,
  opticatLocationName: null,
  isGettingCompanyShop: false,
  isGettingOpticatLocationName: false,
  isUpdatingOpticatLocationName: false
};

const getters = {
  companyShop: state => state.companyShop,
  opticatLocationName: state => state.opticatLocationName
};

const mutations = {
  setIsGettingCompanyShop(state, bool) {
    state.isGettingCompanyShop = bool;
  },
  setCompanyShop(state, companyShop) {
    state.companyShop = companyShop;
  },
  setIsGettingOpticatLocationName(state, bool) {
    state.isGettingOpticatLocationName = bool;
  },
  setOpticatLocationName(state, opticatLocationName) {
    state.opticatLocationName = opticatLocationName;
  }
};

const actions = {
  resetOnLogout({ commit }) {
    commit("setIsGettingCompanyShop", false);
    commit("setCompanyShop", null);
    commit("setIsGettingOpticatLocationName", false);
    commit("setOpticatLocationName", null);
  },
  async getCompanyEmployee({ dispatch }) {
    const url = `${process.env.COMPANY_API_ROOT}employments`;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (config.constructor === Object) {
      await axios
        .get(url, config)
        .then((res) => {

          if (
            res && res.data && res.data.data && res.data.data.length
          ) {
            dispatch("getCompanyShop");
          }

        })
        .catch(() => {});
    }
  },
  async getCompanyShop({ state, commit, dispatch }) {
    let companyShop = state.companyShop;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isGettingCompanyShop && config.constructor === Object) {
      commit("setIsGettingCompanyShop", true);

      const url = `${process.env.COMPANY_API_ROOT}shops`;

      await axios.get(url, config)
        .then(res => {
          if (
            res && res.data && res.data[0] &&
            res.data[0].shops && res.data[0].shops.data &&
            res.data[0].shops.data.length > 0
          ) {
            companyShop = res.data[0].shops.data

            dispatch("getOpticatLocationName", companyShop[0].id);
          } else {
            companyShop = [];
          }
        })
        .catch(() => {});

      commit("setCompanyShop", companyShop);
      commit("setIsGettingCompanyShop", false);
    }
    return companyShop;
  },
  async getOpticatLocationName({ state, commit, dispatch }, shopId) {
    let opticatLocationName = state.opticatLocationName;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isGettingOpticatLocationName && config.constructor === Object) {
      commit("setIsGettingOpticatLocationName", true);

      const url = `${process.env.COMPANY_API_ROOT}shops/${shopId}/metas`;

      await axios.get(url, config)
        .then(res => {
          if (res && res.data && Array.isArray(res.data)) {
            const sortedMetas = res.data.sort((a, b) => {
              return new Date(b.updated_at) - new Date(a.updated_at);
            });

            if (sortedMetas[0] && sortedMetas[0].value) {
              opticatLocationName = sortedMetas[0].value
            }
          }
        })
        .catch(() => {});

      commit("setOpticatLocationName", opticatLocationName);

      if (opticatLocationName) {
          dispatch("shoppinglist/getShoppingList", null, { root: true });
      }

      commit("setIsGettingOpticatLocationName", false);
    }
    return opticatLocationName;
  },
  async updateOpticatLocationName({ state, commit, dispatch }, formData) {
    let opticatLocationName;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isUpdatingOpticatLocationName && config.constructor === Object) {
      commit("setIsUpdatingOpticatLocationName", true);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}opticat-location-name`;

      await axios.put(url, formData, config)
        .then(res => {
          if (res && res.data && res.data.opticat_location_name) {
            opticatLocationName = res.data.opticat_location_name;
          }
        })
        .catch(() => {});

      if (opticatLocationName) {
        commit("setOpticatLocationName", opticatLocationName);
      }
      commit("setIsUpdatingOpticatLocationName", false);
    }

    return opticatLocationName;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
