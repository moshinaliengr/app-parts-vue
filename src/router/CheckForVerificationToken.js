import { verifyEmail } from "src/services/UserAuth.js";
import { Notify, Loading, QSpinnerGears } from "quasar";

export default async function CheckForVerificationToken(to, from, next, store) {
  if (to?.query?.token) {
    Loading.show({
      spinner: QSpinnerGears,
      delay: 400,
    });
    try {
      const response = await verifyEmail({
        auth: store.state.user.authorization,
        payload: {
          token: to.query.token,
        },
      });
      if (response.status === "success") {
        return this.$router.push({ name: "home" });
      }
    } catch (error) {
      return next();
    } finally {
      Loading.hide();
    }
  }
  return next();
}
