<template>
  <ContentCard>
    <q-card-section>
      <form @submit.prevent="validateForm">
        <q-card-section class="text-center no-padding">
          <p class="text-subtitle1 no-margin">
            A confirmation code was sent to:
          </p>
          <p class="text-subtitle1 no-margin text-weight-medium">{{ email }}</p>
        </q-card-section>

        <q-input
          label="Reset Code"
          v-model="code"
          class="no-padding"
          lazy-rules
          outlined
          dense
        />

        <q-input
          label="New Password"
          v-model="newPassword"
          class="no-padding"
          outlined
          dense
        />

        <q-input
          label="Verify Password"
          v-model="verifyPassword"
          class="no-padding"
          outlined
          dense
        />

        <ButtonStandard label="Reset Password" type="submit" />
      </form>
    </q-card-section>
  </ContentCard>
</template>
<script>
import ContentCard from "../components/common/ContentCard";
import ButtonStandard from "../components/common/ButtonStandard";
import { Notify } from "../mixins/Notify.js";
import { mapActions } from "vuex";

export default {
  name: "ResetModal",
  components: { ContentCard, ButtonStandard },

  mixins: [Notify],

  props: ["email"],

  data: () => ({
    newPassword: "",
    verifyPassword: "",
    code: "",
    loading: false,
    response: {},
  }),

  computed: {
    formIsComplete() {
      return (
        this.passwordsMatch &&
        this.newPassword !== "" &&
        this.verifyPassword !== "" &&
        this.code !== ""
      );
    },

    success() {
      return this.response.status === "success";
    },

    passwordsMatch() {
      return this.newPassword === this.verifyPassword;
    },

    newPasswordData() {
      return {
        email: this.email,
        password: this.newPassword,
        password_confirmation: this.verifyPassword,
        token: this.code,
      };
    },
  },

  methods: {
    ...mapActions({ userRequest: "user/request" }),

    validateForm() {
      if (!this.formIsComplete)
        return this.notify("Please complete all form fields", "negative");
      return this.reset();
    },

    async reset() {
      this.loading = true;
      this.response = await this.userRequest({
        type: "reset_password",
        payload: this.newPasswordData,
      });
      this.handleResponse();
    },

    handleResponse() {
      if (this.success) {
        this.loading = false;
        this.$router.push("/login");
        return this.notify("Password Reset Successfully ", "positive");
      }
      this.loading = false;
      return this.notify("Password Reset Error", "negative");
    },
  },
};
</script>
