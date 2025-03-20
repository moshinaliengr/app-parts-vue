import { LocalStorage } from "quasar";
import { loginWithToken } from "src/boot/authAPI";
import { identifyLaunchDarklyUser } from "src/boot/launchdarkly";
import { Loading, QSpinnerGears } from "quasar";

export default async (to, from, next, store) => {
  // If the user is logged in
  if (store.state.user.loggedIn) {
    // Continue navigation
    return next();
  }

  // If the user is not logged in & route being navigated to requires authentication
  if (to.meta.requiresAuth) {
    // Attempt to authenticate the user with a stored token
    try {
      Loading.show({
        spinner: QSpinnerGears,
        delay: 400,
      });
      const token = LocalStorage.getItem("token");
      const user = await loginWithToken(token);
      // If the user was authenticated successfully
      if (user.authorization) {
        // Set the user store state
        store.commit("user/SET_USER_STATE", user);
        await identifyLaunchDarklyUser(user);
        analytics.identify(user.information.id, {
          name: user.information.first_name + " " + user.information.last_name,
          email: user.information.email,
        });

        return next();
      } else {
        return next({ name: "login" });
      }
    } catch (error) {
      // If something goes wrong, navigate to the login page
      return next({ name: "login" });
    } finally {
      Loading.hide();
    }
  }

  // If the route being navigated to is the login page
  if (to.name === "login") {
    // If there's a token in local storage
    if (LocalStorage.has("token")) {
      // Attempt to authenticate the user with a stored token
      try {
        Loading.show({
          spinner: QSpinnerGears,
          delay: 400,
        });
        const token = LocalStorage.getItem("token");
        const user = await loginWithToken(token);
        // If the user was authenticated successfully
        if (user.authorization) {
          // Set the user store state
          store.commit("user/SET_USER_STATE", user);
          await identifyLaunchDarklyUser(user);
          analytics.identify(user.information.id, {
            name:
              user.information.first_name + " " + user.information.last_name,
            email: user.information.email,
          });

          next({ name: "home" });
        } else {
          next();
        }
      } catch (error) {
        // If something goes wrong, continue navigating to the login page
        return next();
      } finally {
        Loading.hide();
      }
    }
    // Else, if there's no token, keep navigating to login page
    next();
  }

  // Else, if the user is not authenticated...
  // and the next route does not require authentication...
  // and the next route is not the login page...
  // continue navigation
  return next();
};
