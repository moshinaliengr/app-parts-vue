<template>
  <div>
    <ButtonRound @click.native="drawer = !drawer" :flat="true" icon="menu" />

    <q-drawer
      v-model="drawer"
      :width="250"
      @show="$emit('drawer-shown', true)"
      @hide="$emit('drawer-shown', false)"
      style="overflow: hidden !important"
      bordered
    >
      <q-list class="flex column nav-content no-scroll" dense>
        <div v-for="link in links" :key="link.icon">
          <!-- Standard Navigation Links -->
          <q-item
            v-if="(
              !link.children &&
              ($ld.flags[link.meta.navBarData.key] || !link.meta.navBarData.key) &&
              (link.name !== 'shopping-cart' || usersShoppingCartCount > 0) &&
              (link.name !== 'order-history' || ordersCount > 0)
            )"
            :to="{ name: link.name }"
            class="q-py-sm"
            :disable="!loggedIn"
            :aria-label="'NavDrawer '+link.meta.navBarData.title"
            v-ripple
            exact
            dense
          >
            <!-- Nav Icon -->
            <q-item-section avatar>
              <q-avatar
                v-if="link.meta.navBarData.icon"
                :icon="link.meta.navBarData.icon"
                class="q-mx-xs q-my-none nav-icon"
                :class="{ 'no-border-radius': link.name === 'shopping' }"
              />
              <q-avatar
                v-if="link.meta.navBarData.image"
                class="q-mx-xs q-my-none nav-icon"
                :class="{ 'no-border-radius': link.name === 'shopping-cart' }"
              >
                <img :src="link.meta.navBarData.image" />
              </q-avatar>
            </q-item-section>

            <!-- Nav Title -->
            <q-item-section class="text-subtitle2">
              {{ link.meta.navBarData.title }}
            </q-item-section>
          </q-item>

          <!-- Expandable Panel With Sublinks -->
          <q-expansion-item
            v-if="link.children && $ld.flags[link.meta.navBarData.key]"
            group="truck-parts"
            :disable="!loggedIn"
          >
            <template v-slot:header>
              <q-avatar v-if="link.meta.navBarData.icon" class="no-margin">
                <q-icon :name="link.meta.navBarData.icon" size="28px" />
              </q-avatar>
              <q-avatar v-if="link.meta.navBarData.image" class="no-margin">
                <q-img :src="link.meta.navBarData.image" size="28px" />
              </q-avatar>
              <q-item-section class="text-subtitle2 q-ml-md">
                {{ link.meta.navBarData.name }}
              </q-item-section>
            </template>

            <q-list class="q-pr-none" dense>
              <div v-for="sublink in link.children" :key="sublink.icon">
                <q-item
                  v-if="$ld.flags[sublink.meta.navBarData.key]"
                  :key="sublink.meta.navBarData.name"
                  :to="{ name: sublink.name }"
                  v-ripple
                  dense
                  :disable="!loggedIn"
                >
                  <q-item-section avatar>
                    <q-avatar
                      v-if="sublink.meta.navBarData.icon"
                      :icon="sublink.meta.navBarData.icon"
                    />
                    <q-avatar v-if="sublink.meta.navBarData.image">
                      <img :src="sublink.meta.navBarData.image" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section
                    style="white-space: nowrap"
                    class="text-body2"
                  >
                    {{ sublink.meta.navBarData.name }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-expansion-item>
        </div>

        <q-space />
        <!-- Diesel Branding and link -->
        <q-item class="fixed-bottom" clickable v-ripple group="nav-panels">
          <a href="https://diesellaptops.com" target="_blank" class="q-pa-xs">
            <img
              src="../../assets/dl-logo.png"
              alt="Diesel Laptops logo"
              class="bottom-nav-logo"
            />
          </a>
        </q-item>
      </q-list>
    </q-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ButtonRound from "../common/ButtonRound";
import { Platform } from "quasar";
import { Notify } from "../../mixins/Notify.js";

export default {
  components: {
    ButtonRound,
  },

  mixins: [Notify],

  beforeMount() {
    // pull routes in from routes.js
    this.routes = this.getRoutesFromRouter();
  },

  mounted() {
    // set links
    this.getNavBarLinks();

    // Sets drawer state dependent upon device
    if (Platform.is.mobile === true) this.drawer === false;
    else this.drawer = true;
    // This is causing the 401 when the app first renders on the login page
    if (this.$ld.flags['shopping-list']) {
      this.$store.dispatch("shoppinglist/getOrderHistory");
    }
  },

  watch: {
    // watches flags for changes to update drawer state
    "$ld.flags": function () {
      this.flags = this.$ld.flags;
      this.getNavBarLinks();
      this.checkRoute();
    },
    data: function () {
      this.getNavBarLinks();
      this.checkRoute();
    },
  },

  computed: {
    ...mapState("user", ["data"]),
    // Assists in style adjustments on iOS
    isIos() {
      if (Platform.is.ios) return true;
      else return false;
    },

    // Defines whether or not user has logged in
    loggedIn() {
      return this.$store.state.user.loggedIn;
    },

    ordersCount() {
      const orders = this.$store.getters["shoppinglist/orderHistory"];

      return orders ? orders.length : 0;
    },

    usersShoppingCartCount() {
      const cart = this.$store.getters["shoppinglist/shoppingCart"];
      if (cart && cart.length) {
        return cart.reduce((acc, item) => {
          return acc + item.root_part_quantity;
        }, 0);
      }

      return 0;
    },
  },

  methods: {
    // loop through routes and if navBar is true, add navBarData to links array
    // this is used to determine which links are displayed in the navBar
    getNavBarLinks() {
      this.links = [];

      this.links = this.routes;
      return;
    },

    // check if this user can access lui-gong only routes
    checkLiugongOnly() {
      return this.isLiugongOnly;
    },

    checkIfAdminOrDev() {
      return this.isAdmin || this.isDev ? true : false;
    },

    // check if current route is not in flags, if not push user to home
    checkRoute() {
      if (this.$route.name !== "home") {
        if (!this.$ld.flags[this.$route?.meta?.navBarData?.key]) {
          this.$router.push({ name: "home" });
        }
      }
    },

    findRoute(name) {
      return this.routes.find((route) => route.name === name);
    },

    getRoutesFromRouter() {
      let links = [];
      let routes = this.$router.options.routes;

      for (let i = 0; i < routes.length; i++) {
        // if route has meta information in it, push it to the array
        if (routes[i].meta?.navBarData) {
          // this has dropdown information
          links.push(routes[i]);
        }
        // if this doesn't have dropdown information
        if (!routes[i].meta?.navBarData && routes[i].children) {
          // for each child of the route, push it to the array
          // the first object we are checkinf for in routes here has a bunch of children that we want to push to the array if they have navBarData
          routes[i].children.forEach((child) => {
            // if the child has navBarData, push it to the array
            // this will ignore routes like login, and account that don't have navBarData
            if (child.meta?.navBarData) {
              links.push(child);
            }
          });
        }
      }
      return links;
    },
  },

  data: () => ({
    drawer: false,
    routes: [],
    links: [],
    news: false,
  }),
};
</script>

<style lang="scss">
body {
  &:not(.body--dark),
  &.body--dark {
    .nav-content {
      .q-item {
        &.q-router-link--active {
          .q-focus-helper {
            background-color: $primary;
            opacity: 0.15;
          }
        }
      }
    }
  }

  &:not(.body--dark) {
    .nav-content {
      .q-item {
        &.q-router-link--active {
          color: black;
        }
      }
    }
  }

  &.body--dark {
    .nav-content {
      .q-item {
        &.q-router-link--active {
          color: white;
        }
      }
    }
  }
}

.nav-content {
  overflow-x: hidden;

  .bottom-nav-logo {
    width: 100%;
  }
}

.nav-icon {
  height: 28px !important;
  width: 28px !important;
}
.q-item__section--side .fa-cart-arrow-down:before {
  content: url("../../assets/list-icon-sm.png");
}
</style>
