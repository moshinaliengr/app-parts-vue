<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section>
        <p class="text-h6 card-title">Reset Password</p>

        <form action @submit.prevent="verifyForm">
          <q-input
            label="Email Address"
            v-model="email"
            autocomplete="email-address"
            class="no-padding"
            lazy-rules
            outlined
            dense
          />

          <q-input
            label="Confirm Email Address"
            v-model="emailConfirm"
            autocomplete="email-address"
            class="no-padding"
            lazy-rules
            outlined
            dense
          />

          <ButtonStandard
            type="submit"
            label="Submit"
            :loading="loading"
            class="q-mb-md"
          />
        </form>
        <q-dialog
          full-width
          v-model="showResetModal"
          transition-show="slide-up"
          transition-hide="slide-down"
          class="q-px-none flex flex-center"
        >
          <ResetModal :email="emailConfirm" />
        </q-dialog>
      </q-card-section>
    </ContentCard>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import ButtonStandard from "../components/common/ButtonStandard";
import { Notify } from "../mixins/Notify.js";
import ResetModal from "../components/ResetModal";
import { mapActions } from "vuex";

export default {
  name: "ResetPassword",
  components: { ContentCard, ButtonStandard, ResetModal },
  mixins: [Notify],

  data: () => ({
    email: "",
    emailConfirm: "",
    showResetModal: false,
    loading: false,
    response: {},
    authURL:
      process.env.USER_AUTH_REPO_BASE_URL || "https://api.users.diesellaptops.com",
  }),

  computed: {
    formIsIncomplete() {
      return this.email.length === 0 || this.emailConfirm.length === 0;
    },

    emailsMatch() {
      return this.email === this.emailConfirm;
    },

    sent() {
      return this.response.data.status === "sent";
    },

    errorFound() {
      return this.response.error;
    },

    accountThrottled() {
      return this.response.status === "throttled";
    },
  },

  methods: {
    ...mapActions({ userRequest: "user/request" }),

    verifyForm() {
      if (this.formIsIncomplete)
        return this.notify(
          "Please enter & confirm your email",
          "negative",
          "check_circle_outline"
        );

      if (!this.emailsMatch)
        return this.notify(
          "Emails do not match",
          "negative",
          "check_circle_outline"
        );

      this.sendResetRequest();
    },

    async sendResetRequest() {
      try {
        this.loading = true;
        let uri = this.authURL + "/api/legacy/password/reset";
        //no reason to error handle, because currently all user auth requests return 200
        this.response = await this.$axios.post(uri, {
          email: this.email,
        });
        this.handleResponse();
      } catch (err) {
        this.notify(
          //err.response.data.error.failed_data_validation.email[0],
          "Email not sent: check that email exists and is verified.",
          "negative",
          "check_circle_outline"
        );

      }
      finally {
        this.loading = false;
      }
    },

    handleResponse() {
      if (this.sent) {
        this.loading = false;
        this.showResetModal = true;
        return this.notify(
          "Please check your email",
          "positive",
          "check_circle_outline"
        );
      }

      if (this.errorFound) {
        this.loading = false;
        this.notify(
          "Something went wrong, check the console",
          "negative",
          "check_circle_outline"
        );
      }

      if (this.accountThrottled) {
        this.loading = false;
        this.notify(
          "Account throttled, try again later",
          "negative",
          "check_circle_outline"
        );
      }
    },
  },
};
</script>
