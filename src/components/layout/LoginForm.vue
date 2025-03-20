<template>
  <q-form @submit="login">
    <q-input
      v-model="email"
      data-email
      label="Email Address"
      autocomplete="email"
      type="email"
      lazy-rules
      dense
      outlined
    >
      <template v-slot:prepend>
        <q-icon name="email" />
      </template>
    </q-input>

    <q-input
      v-model="password"
      data-password
      :type="isPasswordVisible ? 'text' : 'password'"
      label="Password"
      autocomplete="password"
      outlined
      dense
    >
      <template v-slot:prepend>
        <q-icon name="lock" />
      </template>

      <template v-slot:append>
        <q-icon
          :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
          @click="isPasswordVisible = !isPasswordVisible"
        />
      </template>
    </q-input>

    <button-standard :loading="loading" label="Login" type="submit" />
  </q-form>
</template>

<script>
import ButtonStandard from "../common/ButtonStandard.vue";
import {Notify} from "src/mixins/Notify";

export default {
  name: "LoginForm",

  mixins: [Notify],

  components: {
    ButtonStandard,
  },

  data: () => ({
    email: "",
    password: "",
    isPasswordVisible: false,
    loading: false,
  }),
  methods: {
    async login() {
      this.loading = true;
      const user = await this.$store.dispatch("user/login", {
        email: this.email,
        password: this.password,
        $ld: this.$ld
      });
      this.loading = false;
      if (user.authorization) {
        this.$emit("authenticated");

       if (this.$ld.flags['shopping-list']) {
        const listOrError = await this.$store.dispatch("shoppinglist/getShoppingList");

        if (listOrError === "error") {
          this.notify("Error getting shopping list", "negative");
        }

        const orderHistory = await this.$store.dispatch("shoppinglist/getOrderHistory");

        if (!orderHistory) {
          this.notify("Error getting order history", "negative");
        }

        this.$store.dispatch("company/getCompanyShop");
       }

      }
    },
  },
};
</script>
