import { requests } from "./UserService.js";
import { authAPI } from "boot/authAPI";
import { Loading, LocalStorage, QSpinnerGears } from "quasar";
import { identifyLaunchDarklyUser } from "src/boot/launchdarkly.js";

export async function login({ state, root, commit, dispatch }, payload) {
  console.log(window.location);
  Loading.show({
    spinner: QSpinnerGears,
    delay: 400,
  });
  // Attempt to authenticate the user
  const user = await authAPI.login(payload);
  Loading.hide();
  // If successfully authenticated
  if (user.authorization) {
    const { $ld } = payload;
    if ($ld.flags["shopping-list"]) {
      dispatch("shoppinglist/getShoppingList", null, { root: true });
    }
    // Set the user state
    commit("SET_USER_STATE", user);
    await identifyLaunchDarklyUser(user);
    analytics.identify(user.information.id, {
      name: user.information.first_name + " " + user.information.last_name,
      email: user.information.email,
    });

    return user;
    // this.$router.push({ name: "home" });
  }
  return false;
}

// Handles any type of user repo requests (excluding login)
export async function request({ state, commit }, payload) {
  // Destructure the user request type from the incoming payload object
  const { type } = payload;
  // Create the user authorization object
  const auth = {
    authorization: state.authorization,
    information: state.information,
  };
  // Add the user authorization to the payload
  payload.auth = auth;
  // Set the request type
  const request = requests[type];
  // Send the request along with the payload data
  const response = await request(payload);

  if (response.subject === 'error') {
    return response;
  }

  if (type === "deleteUserAccount") {
    return response;
  }
  // Attempt to extract the user data from the response
  const user = response?.data?.data || response?.data;
  // If user data was returned
  if (user) {
    // Destructure the authorization and info objects
    const { authorization, information } = user;
    LocalStorage.set("token", authorization.token);
    // If an authorization or information object were found
    if (authorization || information) {
      // Update the user state
      commit("SET_USER_STATE", user);
      // Vue.prototype.$ld.identify({ user: state.user });
    }
  }
  // Return the response
  return response;
}
