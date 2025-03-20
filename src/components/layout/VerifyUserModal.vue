<template>
  <ModalContent :fullHeight="false" :closeBtnShow="false">
    <q-card-section class="image-wrapper">
      <img
        alt="Diesel Repair Logo"
        src="~assets/app-logo.png"
        class="q-py-md"
      />
    </q-card-section>

    <q-card-section class="text-center no-padding text-h6">
      <p class="no-margin">A verification link has been sent to: &nbsp;</p>
      <p class="no-margin">{{ $store.state.user.information.email }}</p>
    </q-card-section>

    <q-card-section> </q-card-section>
    <q-card-section class="text-center">
      <p class="no-margin">Didn't receive an email?</p>
      <ButtonStandard
        @click.native="resendVerification"
        :flat="true"
        label="Resend it"
      >
        Resend it
      </ButtonStandard>
    </q-card-section>
  </ModalContent>
</template>

<script>
import ModalContent from "../common/ModalContent";
import ButtonStandard from "../common/ButtonStandard";
import { mapActions } from "vuex";
import { verifyEmail, newVerification } from "src/services/UserAuth.js";

export default {
  name: "VerifyUserModal",
  components: { ModalContent, ButtonStandard },

  data: () => ({
    code: "",
    loading: false,
  }),

  methods: {
    ...mapActions({ userRequest: "user/request" }),

    async resendVerification() {
      try {
        const { user } = this.$store.state;
        const response = await newVerification({
          auth: user.authorization,
          payload: {
            email: user.information.email,
          },
        });
        if (response.data.status === "sent") {
          this.$q.notify({
            message: "Request Sent Succesfully",
            type: "positive",
            position: "top",
            icon: "check_circle_outline",
          });
        } else {
          this.$q.notify({
            message: "New verification request error",
            type: "negative",
            position: "top",
          });
        }
      } catch (error) {
        this.$q.notify({
          message: "New verification request error",
          type: "negative",
          position: "top",
        });
      }
    },
  },
  mounted() {
    this.resendVerification();
  },
};
</script>

<style lang="scss" scoped>
img {
  width: 85%;
}
</style>
