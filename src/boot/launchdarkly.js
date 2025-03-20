import * as LDClient from "launchdarkly-js-client-sdk";
import Vue from "vue";

  const getUserAgent = () => {
    return { userAgent: navigator.userAgent, vendor: navigator.vendor };
  };

  const user = {
    key: "notsignedin",
    custom: { ...getUserAgent() }
  };

  const client = LDClient.initialize(
    process.env.LAUNCH_DARKLEY_CLIENT_SIDE_ID,
    user,
  );

  client.flags = {};

  client.waitForInitialization().then(() => {
    client.flags = client.allFlags();
    client.on("change", () => {
      client.flags = client.allFlags();
    });
  });

  const $ld = Vue.observable(client);
   
  Vue.prototype.$ld = $ld;

  export const identifyLaunchDarklyUser = async function (user) {
    try {
      await $ld.identify({
      email: user.information.email,
      firstName: user.information.first_name,
      lastName: user.information.last_name,
      key: user.information.id
      });
    } catch(error) {
      console.log('Failed to identify LD user', error)
    }
  }

  export const anonymizeLaunchDarklyUser = async function () {
    try {
      await $ld.identify({
        key: "notsignedin",
        custom: { ...getUserAgent() }
      });
    } catch(error) {
      console.log('Failed to anonymize LD user', error)
    }
  }

  export default $ld



