<template>
  <div class="row items-center">
    <q-btn class="q-ma-xs" size="medium" round flat dense>
      <q-tooltip> View Settings </q-tooltip>
      <!-- If user's first and last name are defined, show initials -->
      <q-avatar
        v-if="loggedIn && nameIsDefined"
        class="text-weight-medium"
        color="primary"
        text-color="black"
        size="md"
      >
        {{ initials }}
      </q-avatar>

      <!-- Otherwise, show user icon -->
      <q-avatar v-else icon="fad fa-user-circle" />

      <q-menu anchor="bottom right" self="top right" :offset="[3, 7]">
        <q-list dense>
          <!-- User Account -->
          <q-item
            v-if="loggedIn"
            clickable
            v-ripple
            class="q-my-xs"
            to="/account"
          >
            <q-item-section avatar>
              <q-icon name="fad fa-user-circle" />
            </q-item-section>
            <!-- User Name -->
            <q-item-section>
              <q-item-label>
                {{ `${userInfo.first_name} ${userInfo.last_name}` }}
              </q-item-label>

              <q-item-label class="text-blue" caption>
                Manage Account
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple href="https://airtable.com/shralekANSSL8Asih" target="_blank">
            <q-item-section avatar class="q-pr-sm" style="white-space: nowrap">
              <q-icon name="fad fa-concierge-bell" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Report Issues</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/bookmarks">
            <q-item-section avatar class="q-pr-sm" style="white-space: nowrap">
              <q-icon name="fad fa-bookmark" />
            </q-item-section>

            <q-item-section>
              <q-item-label>My Bookmarks</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/faq">
            <q-item-section avatar class="q-pr-sm" style="white-space: nowrap">
              <q-icon name="fad fa-question-square" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Support</q-item-label>
            </q-item-section>
          </q-item>

          <DarkModeToggle />
          <q-separator />

          <q-item clickable v-ripple>
            <q-item-section avatar class="q-pr-sm">
              <q-icon name="fad fa-sign-out-alt" color="rotate-180" />
            </q-item-section>

            <q-item-section clickable v-ripple @click="logout">
              <q-item-label>Log Out</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import DarkModeToggle from "../layout/DarkModeToggle";
import { anonymizeLaunchDarklyUser } from "src/boot/launchdarkly";

export default {
  name: "UserMenu",
  components: { DarkModeToggle },
  computed: {
    // User's initials
    initials() {
      return `${this.userInfo.first_name[0]}${this.userInfo.last_name[0]}`;
    },

    // Whether or not the user is logged in
    loggedIn() {
      return this.$store.state.user.loggedIn;
    },
    // Whether or not the user has defined their name
    nameIsDefined() {
      return (
        this.userInfo.first_name !== undefined &&
        this.userInfo.last_name !== undefined
      );
    },

    user() {
      return this.$store.state.user;
    },

    userInfo() {
      return this.user.information;
    },
  },

  data: () => ({
    news: false,
  }),

  methods: {
    logout() {
        this.$q.localStorage.remove("token");
        this.$router.push({ name: "login" });
        this.$store.commit("user/RESET_USER_STATE");
        this.$store.dispatch("shoppinglist/resetOnLogout");
        this.$store.dispatch("company/resetOnLogout");
        anonymizeLaunchDarklyUser();

    },
  },
};
</script>

<style lang="scss">
.q-item__section--avatar {
  min-width: unset;
}
</style>
