<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="q-mx-auto" style="width: 90%">
        <q-card-section class="text-h6 card-title">Account</q-card-section>

        <q-form @submit.prevent="updateAccountDetails">
          <div class="row justify-between">
            <q-input
              label="First Name"
              v-model="user.first_name"
              class="col no-margin q-pr-sm"
              outlined
              dense
            />

            <q-input
              label="Last Name"
              v-model="user.last_name"
              class="col no-margin"
              outlined
              dense
            />
          </div>

          <div class="row justify-between q-mt-sm">
            <q-input
              label="Customer ID"
              v-model="user.customer_id"
              class="col no-margin q-pr-sm"
              disable
              outlined
              dense
            />

            <q-input
              label="Email"
              v-model="user.email"
              class="col no-margin"
              outlined
              dense
            />
          </div>

          <q-input label="Company" v-model="user.company" outlined dense />

          <q-input label="Role" v-model="user.role" outlined dense />

          <q-input
            label="Address Line 1"
            v-model="address.line1"
            outlined
            dense
          />

          <q-input
            label="Address Line 2"
            v-model="address.line2"
            outlined
            dense
          />

          <div class="row justify-between">
            <q-input
              label="City"
              v-model="address.city"
              class="col no-margin q-pr-sm"
              outlined
              dense
            />

            <q-input
              label="State"
              v-model="address.state"
              class="col no-margin"
              outlined
              dense
            />
          </div>

          <div class="row justify-between q-pt-sm">
            <q-input
              label="Postal Code"
              v-model="address.postal_code"
              class="col no-margin q-pr-sm"
              outlined
              dense
            />

            <q-input
              label="Country"
              v-model="address.country"
              class="col no-margin"
              outlined
              dense
            />
          </div>

          <q-input label="Phone" v-model="phone.number" outlined dense />

          <div class="row">
            <ButtonStandard
              label="Update Account"
              :full="false"
              :classExtend="`q-mt-md col`"
              type="submit"
            />

            <ButtonStandard
              :full="false"
              :classExtend="`q-mt-md col`"
              label="Delete Account"
              @click.native="showDeleteConfirmation = true"
            />
          </div>
        </q-form>
      </q-card-section>
    </ContentCard>
    <q-dialog v-model="showDeleteConfirmation">
      <q-card class="q-pa-xl">
        <q-card-section
          class="row items-center justify-between q-pl-sm q-pr-none"
        >
          <p class="text-h6 col-12">
            Are you sure you want to delete your acccount?
          </p>
          <p class="col-12 text-center">
            Deleting your
            <a href="https://repair.diesellaptops.com/" target="_blank"
              >Diesel Parts</a
            >
            account will also delete your Diesel Repair account and
            subscription.
          </p>
        </q-card-section>

        <q-separator />
        <q-card-section class="row">
          <ButtonStandard
            label="Cancel"
            :full="false"
            :classExtend="`q-mt-md col`"
            @click.native="showDeleteConfirmation = false"
          />
          <ButtonStandard
            label="Continue"
            :full="false"
            :loading="isDeletingUser"
            :classExtend="`q-mt-md col`"
            @click.native="deleteUserAccount"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import ButtonStandard from "../components/common/ButtonStandard";
import { Notify } from "../mixins/Notify.js";
import { mapActions } from "vuex";

export default {
  name: "Account",
  components: { ContentCard, ButtonStandard },
  mixins: [Notify],

  mounted() {
    if (this.loggedIn) {
      this.setAccountDetails();
    }
  },

  data: () => ({
    loading: false,
    response: {},
    user: {
      first_name: "",
      last_name: "",
      customer_id: "",
      email: "",
      company: "",
      role: "",
    },
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
    phone: {
      number: "",
    },
    paymentMethod: "",
    showDeleteConfirmation: false,
    isDeletingUser: false,
    showPaymentMethods: false,
  }),

  computed: {
    loggedIn() {
      return this.$store.state.user.loggedIn;
    },
    payload() {
      return {
        ...this.user,
        address: {
          ...this.address,
          original: { ...this.existingAddress },
        },
        phone: {
          ...this.phone,
          original: { ...this.existingPhone },
        },
      };
    },

    existingUserInfo() {
      return this.$store.state.user.information;
    },

    existingAddress() {
      return this.existingUserInfo?.addresses[0] || {};
    },

    existingPhone() {
      return this.existingUserInfo?.phones[0] || {};
    },

    updatedSuccessfully() {
      return this.response?.data?.information;
    },

    errorFound() {
      return this.response?.error;
    },
  },

  methods: {
    ...mapActions({ userRequest: "user/request" }),

    async deleteUserAccount() {
      try {
        this.isDeletingUser = true;
        const response = await this.userRequest({
          type: "deleteUserAccount",
        });
        if (response.status === 200) {
          this.notify("Account Deleted Successfully", "positive");
          this.$q.localStorage.remove("token");
          this.$store.commit("user/RESET_USER_STATE");
          this.$store.dispatch("shoppinglist/resetOnLogout");
          this.$store.dispatch("company/resetOnLogout");
          return this.$router.push({
            name: "login",
          });
        } else {
          this.notify("Error Deleting User Account", "negative");
        }
      } catch (e) {
        this.notify("Error Deleting User Account", "negative");
      } finally {
        this.isDeletingUser = false;
      }
    },

    setAccountDetails() {
      for (const property in this.user) {
        this.user[property] = this.existingUserInfo[property];
      }
      for (const property in this.address) {
        this.address[property] = this.existingAddress[property];
      }
      for (const property in this.phone) {
        this.phone[property] = this.existingPhone[property];
      }
    },

    checkForChanges() {
      let changed = false;
      for (const property in this.user) {
        if (this.user[property] !== this.existingUserInfo[property]) {
          changed = true;
        }
      }
      for (const property in this.address) {
        if (this.address[property] !== this.existingAddress[property]) {
          changed = true;
        }
      }
      for (const property in this.phone) {
        if (this.phone[property] !== this.existingPhone[property]) {
          changed = true;
        }
        return changed;
      }
    },

    async updateAccountDetails() {
      this.loading = true;

      if (this.checkForChanges() === false) {
        this.loading = false;
        return this.notify("You haven't made any changes.", "negative");
      }

      this.response = await this.userRequest({
        type: "update",
        payload: this.payload,
      });

      this.handleResponse();
    },

    handleResponse() {
      if (this.errorFound) {
        this.loading = false;
        return this.notify("Update Failed, Check Console", "negative");
      }
      if (this.updatedSuccessfully) {
        this.loading = false;
        return this.notify(
          "Update Success",
          "positive",
          "check_circle_outlined"
        );
      }
      this.loading = false;
    },
  },

  watch: {
    loggedIn: function () {
      if (this.loggedIn) {
        this.setAccountDetails();
      }
    },
  },
};
</script>

<style lang="scss">
.details-panel {
  color: $primary;
}
</style>
