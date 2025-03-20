import axios from "axios";
import { Cookies } from "quasar";

function resetState() {
  return {
    authorization: {},
    information: {},
    loggedIn: false,
    subscriptions: {
      available: [],
      active: [],
    },
    paymentMethods: [],
  };
}
const state = () => ({
  authorization: {},
  information: {},
  loggedIn: false,
  subscriptions: {
    available: [],
    active: [],
  },
  paymentMethods: [],
});

const getters = {
  userInfo: (state) => state.information,
  firstName: (state) => state.information.first_name,
  lastName: (state) => state.information.last_name,
  email: (state) => state.information.email,
  loggedIn: (state) => state.loggedIn,
  user: (state) => ({
    authorization: state.authorization,
    information: state.information,
  }),
  paymentMethods: (state) =>
    state.paymentMethods.map((paymentMethods) => {
      return {
        ...paymentMethods,
        label: paymentMethods.brand + " " + paymentMethods.last4,
      };
    }),
};

const mutations = {
  RESET_STATE(state) {
    const s = resetState();
    Object.keys(s).forEach((key) => {
      state[key] = s[key];
    });
  },

  SET_USER_STATE(state, user) {
    state.authorization = { ...state.authorization, ...user.authorization };
    state.information = { ...state.information, ...user.information };
    state.loggedIn = user?.information?.customer_id ? true : false;
  },

  SET_ACTIVE_USER_SUBSCRIPTIONS(state, { subscriptions }) {
    (state = { ...state }), (state.subscriptions.active = subscriptions);
  },

  SET_AVAILABLE_SUBSCRIPTIONS(state, plans) {
    (state = { ...state }), (state.subscriptions.available = plans);
  },

  SET_PAYMENT_METHODS(state, paymentMethods) {
    state.paymentMethods = paymentMethods;
  },
};

const actions = {
  async registerUserAccount({ commit }, payload) {
    const response = await registerUser(payload);
    const user = response?.data;
    if (user) commit("SET_USER_STATE", user);
    return response;
  },

  async verifyUser({ commit, getters }, payload) {
    const response = await verifyUserEmail(getters.user, payload);
    const user = response?.data;
    if (user) commit("SET_USER_STATE", user);
    return response;
  },

  async logUserIn({ commit }, payload) {
    const response = await authenticateUser(payload);
    const user = response?.data;
    if (user) {
      commit("SET_USER_STATE", user);
      const options = {
        sameSite: "Strict",
        // httpOnly: true,
        // secure: true
      };
      Cookies.set("remember", user.authorization.hash, options);
    }
    return response;
  },

  async loginWithCookie({ commit }, token) {
    const url = `${USER_REPO_BASE_URL}/api/user/authenticate/`;
    const response = await axios({
      url: url + token,
      method: "POST",
    });
    if (response?.data) {
      const user = response.data.data;
      commit("SET_USER_STATE", user);
    }
  },

  async updateUserAccount({ commit, getters }, payload) {
    const response = await updateUserInfo(getters.user, payload);
    const user = response?.data;
    if (user) commit("SET_USER_STATE", user);
    return response;
  },

  async getUserSubscriptions({ commit, getters }) {
    const response = await axios({
      url: `${USER_REPO_BASE_URL}/api/user/subscriptions`,
      method: "GET",
      headers: {
        "Authorization-User": getters.user.authorization.hash,
        "Authorization-Token": getters.user.authorization.token,
      },
    });
    if (response?.data?.data) {
      const activeSubscriptions = response.data.data;
      commit("SET_ACTIVE_USER_SUBSCRIPTIONS", {
        user: getters.user,
        subscriptions: activeSubscriptions,
      });
    }
  },
  async checkUserSubscriptions({ commit, getters }, productId) {
    const response = await axios({
      url: `${USER_REPO_BASE_URL}/api/user/subscription/${productId}`,
      method: "GET",
      headers: {
        "Authorization-User": getters.user.authorization.hash,
        "Authorization-Token": getters.user.authorization.token,
      },
    });
    if (response?.data?.data) {
      const activeSubscriptions = response.data.data;
      // commit("SET_ACTIVE_USER_SUBSCRIPTIONS", {
      //   user: getters.user,
      //   subscriptions: activeSubscriptions
      // });
    }
  },

  async getAvailablePlans({ commit, getters }) {
    // const wiringProductId = "prod_HtTPpAsv0i4reY";
    // const docsProductId = "prod_Hn6iRxXvy2x10J";
    const partsProductId = "prod_I4juEk4RGtkigU";
    const payload = {
      ids: [
        // wiringProductId,
        // docsProductId,
        partsProductId,
      ],
    };
    const response = await axios({
      url: `${USER_REPO_BASE_URL}/api/prices`,
      method: "POST",
      data: payload,
      headers: {
        "Authorization-User": getters.user.authorization.hash,
        "Authorization-Token": getters.user.authorization.token,
      },
    });

    if (response?.data?.data) {
      const plans = response.data.data;
      // const wiring = response.data.data[wiringProductId];
      // const docs = response.data.data[docsProductId];
      commit("SET_AVAILABLE_SUBSCRIPTIONS", plans);
    }
  },

  async getPaymentMethods({ commit, getters }) {
    const response = await axios({
      url: `${USER_REPO_BASE_URL}/api/user/paymentMethods/cards`,
      methods: "get",
      headers: {
        "Authorization-User": getters.user.authorization.hash,
        "Authorization-Token": getters.user.authorization.token,
      },
    });

    if (response?.data?.data) {
      const paymentMethods = response.data.data;
      commit("SET_PAYMENT_METHODS", paymentMethods);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
