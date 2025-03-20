import axios from "axios";
import { LocalStorage, Notify } from "quasar";
import { setAuthHeaders as setUsersReportingAuthHeaders } from "src/services/UsersReporting";

const client = axios.create({
  baseURL: `${process.env.USER_AUTH_REPO_BASE_URL}/`,
  validateStatus: function (status) {
    return status <= 500;
  },
});

function handleSuccess(response) {
  const user = response?.data || response;
  setAuthHeaders(user.authorization);
  return user;
}

function handleErrors(errors) {
  return Notify.create({
    type: "negative",
    message: `${errors}`,
    position: "top",
    timeout: 1500,
  });
}

function setAuthHeaders(auth) {
  client.defaults.headers.common[`Authorization-Token`] = auth.token;
  client.defaults.headers.common[`Authorization-User`] = auth.hash;
  setUsersReportingAuthHeaders(auth);
}

export async function login(payload) {
  /* 
    NOTE: This is nasty, but unfortunately, we gotta work with it for now...
    This code is working with the legacy version of the auth API,
    we all still had (and still do) much to learn...yes, even Trevor XD
    - Fabian
  */

  // return client.post("/authenticate", payload).then(response => {
  //   console.log('hold up', response)
  // }).catch(error => {
  //   console.log('wait')
  // });

  // console.log("here we are :)");
  return await authenticateUser(payload)
    .then((response) => {
      /*
      The '.then' method is intended to handle successful http responses
      In contrast, the '.catch' method is for any failed http responses 
      In theory, you should never be handling errors in the '.then' method...
      Unfortunately we didn't know what we were doing at the time, and error messages
      ended up being communicated via 200 level responses
      i.e. You succesfully communicated with the server, but you did have errors
      */

      // console.log(response)

      if (response?.subject == "error") {
        response.data.forEach((message) =>
          Notify.create({
            message: message,
            type: "negative",
            position: "top",
            icon: "warning",
          })
        );
      }
      // If an error occurred...
      // if (response.subject == 'error') {
      // Attempt to destructure a failed_data_validation object
      // const { failed_data_validation } = response?.data;
      // If multiple errors were found, a "failed_data_validation" object would exist
      // if (failed_data_validation) {
      // Each type of error was a property found on the failed data validation object
      // for (const type in failed_data_validation) {
      // Each type (property's) value mapped to an array of possible errors (strings) for each type
      // failed_data_validation[type].forEach((error) => {
      // Display a notification message for each error
      //     Notify.create({
      //       message: `${error}`,
      //       type: "negative",
      //       position: "top",
      //       icon: "warning",
      //     });
      //   });
      // }
      // Stop execution and return false (false === failure to authenticate)
      //   return false;
      // }
      // If only one error was found, the fdv object would not be created,
      // Instead response.error is a String (error) value
      // else {
      //   Notify.create({
      //     message: `${response.error}` ,
      //     type: "negative",
      //     position: "top",
      //     icon: "warning",
      //   });
      // Stop execution and return false (failed to authenticate)
      //     return false;
      //   }
      // }
      // A locked account status was nested twice, don't ask... it just was
      // Check if the account has been locked
      if (response?.status?.status === "locked") {
        Notify.create({
          message: "Account locked, please try again later.",
          type: "negative",
          position: "top",
          icon: "warning",
        });
        // Stop execution and return false (failed to authenticate)
        return false;
      }

      /*
      Sometimes data was nested twice...this is because... by default,
      axios wraps all response bodys in a "data" property
      and our API's also return a response body with a data property
      */
      const user = response?.data?.data || response?.data;
      // If none of the above occured, we should have successfully authenticated
      if (user.authorization) {
        // Store the authorization hash as 'token' in local storage (used for persisting login status)
        LocalStorage.set("token", user.authorization.hash);
        // Welcome the user
        Notify.create({
          message: `Welcome ${user.information.first_name}`,
          type: "positive",
          position: "top",
          icon: "check_circle_outline",
        });
        // Set any default API auth headers
        setAuthHeaders(user.authorization);
        // Return the user object for storage in Vuex or w/e you may need it for
        return user;
      }
      // But, in case else anything goes wrong that I haven't thought of...just in case...
      // Notify.create({
      //   message: `Login Error`,
      //   type: "negative",
      //   position: "top",
      //   icon: "warning",
      // });
      return false;
    })
    .catch((errors) => handleErrors(errors));
}

export async function loginWithToken(token) {
  return await client
    .post(`api/user/authenticate/${token}`, substantiate({}))
    .then((response) => {
      if (response.status === 200) {
        const user = response?.data?.data || response?.data;
        LocalStorage.set("token", user.authorization.hash);
        setAuthHeaders(user.authorization);
        return user;
      }
      return false;
    })
    .catch((errors) => {
      handleErrors(errors);
      return false;
    });
}

const authAPI = {
  login,
  loginWithToken,
};

export { authAPI };

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ Vue }) => {
  Vue.prototype.$authAPI = authAPI;
};
