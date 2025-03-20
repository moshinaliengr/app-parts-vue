<template>
  <q-page class="flex flex-center row">
    <q-card class="col-xs-`1 col-sm-10 col-md-7 col-lg-5 q-px-xl q-py-lg">
      <q-card-section class="row justify-center">
        <q-img
          class="col-xs-10 col-9"
          contain
          alt="Diesel Repair Logo"
          src="~assets/app-logo.png"
        />
      </q-card-section>
      <q-card-section>
        <login-form @authenticated="onAuthenticated" />
      </q-card-section>
      <q-card-section class="row justify-center items-center q-py-none">
        <span>Don't have an account?</span
        ><q-btn label="Sign Up" no-caps flat to="register" />
      </q-card-section>

      <div class="flex row justify-center items-center">
        <div class="column q-mx-sm">
          <div class="row items-center">
            [
            <span>
              <ButtonStandard
                label="Reset Password"
                to="resetPassword"
                :flat="true"
              />
            </span>
            ]
          </div>
        </div>

        <div class="column q-mx-sm">
          <div class="row items-center">
            [
            <div>
              <ButtonStandard
                label="Tech Support"
                type="a"
                href="https://www.diesellaptops.com/pages/support"
                target="__blank"
                :flat="true"
              />
            </div>
            ]
          </div>
        </div>

        <PrivacyPolicy />
      </div>
    </q-card>
  </q-page>
</template>

<script>
import LoginForm from "../components/layout/LoginForm";
import ButtonStandard from "src/components/common/ButtonStandard.vue";
import PrivacyPolicy from "src/components/layout/PrivacyPolicy.vue";
import { sendUserLoginAction } from "src/services/UsersReporting";

export default {
  name: "Login",

  components: { LoginForm, ButtonStandard, PrivacyPolicy },

  data() {
    return {
      essentialLinks: [
        {
          label: "[ Reset Password ]",
          to: "resetPassword",
        },
        {
          label: "[ Tech Support ]",
          to: "https://www.diesellaptops.com/pages/support",
        },
        {
          label: "[ Privacy Policy ]",
        },
      ],
    };
  },

  methods: {
    onAuthenticated() {
      sendUserLoginAction({
        user: this.$store.state.user,
      }).then(() => {
        this.$store.dispatch("shoppinglist/getShoppingList").then((listOrError) => {
          if (listOrError === "error") {
            this.notify("Error getting shopping list", "negative");
          }
        });

        this.$store.dispatch("shoppinglist/getOrderHistory").then((orderHistory) => {
          if (!orderHistory) {
            this.notify("Error getting order history", "negative");
          }
        });

        this.$store.dispatch("company/getCompanyShop");
      });
      this.$router.push({ name: "home" });
    },

    goToRegister() {
      this.$router.push(`register`);
    },
  },
};
</script>
