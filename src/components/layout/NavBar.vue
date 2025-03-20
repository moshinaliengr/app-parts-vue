<template>
  <q-header bordered :style="iosAppPadding">
    <q-toolbar class="no-padding" dark>
      <NavDrawer @drawer-shown="$emit('drawer-shown', $event)" />

      <img
        src="../../assets/app-logo.png"
        @click="goHome"
        class="nav-logo"
        alt="Diesel Parts Icon"
      />
      <div class="text-h6 text-bold q-pl-md" v-if="showBanner">STG</div>
      <q-space />

      <!-- Shopping Cart Icon -->
      <!-- TODO: Consider moving this elsewhere -->
      <q-btn
        :class="{
          'cart-and-spinner': shouldShowCartIconWithSpinner,
          'cart-and-warning': shouldShowCartIconWithWarning
        }"
        @click="goToShoppingCartPage"
        v-if="
          (shouldShowCartSpinner || shouldShowCartIcon) &&
          $q.screen.gt.sm &&
          $ld.flags['shopping-cart']
        "
        flat
        round
      >
        <div class="warning-container bg-primary text-black text-center" v-if="shouldShowCartIconWithWarning">
          !
        </div>
        <q-spinner color="primary" size="1em" v-else-if="shouldShowCartSpinner" />
        <template v-if="shouldShowCartIcon">
          <q-img
            src="../../assets/cart-icon.png"
            style="height: 25px; width: 26px"
          >
          </q-img>
          <q-badge
            rounded
            color="#FFB81C"
            text-color="black"
            :label="usersShoppingCartCount"
            floating
            style="right: 1px; top: 0px"
            v-if="!shouldShowCartSpinner && !shouldShowCartIconWithWarning"
          />
        </template>
      </q-btn>

      <!-- Shopping List Icon -->
      <!-- TODO: Consider moving this elsewhere -->
      <q-btn
        v-if="
          usersShoppingList && $q.screen.gt.sm && $ld.flags['shopping-list']
        "
        flat
        round
        @click="goToShoppingPage"
      >
        <q-img
          src="../../assets/list-icon.png"
          class="fa-flip-horizontal"
          style="height: 24px; width: 26px"
        >
        </q-img>
        <q-badge
          rounded
          color="#FFB81C"
          text-color="black"
          :label="usersShoppingList"
          floating
          style="right: 1px; top: 0px"
        />
      </q-btn>

      <!-- Diesel news toggle (disabled)-->

      <!-- <q-btn v-if="$ld.flags['Diesel-News'] && loggedIn" @click="news = !news" round icon="fas fa-bell" dense flat>
        <q-badge
          v-if="unreadArticles > 0"
          rounded
          color="red"
          :label="unreadArticles"
          floating
        />
        <q-tooltip> Read Diesel News</q-tooltip>
      </q-btn> -->

      <UserMenu v-if="loggedIn" />
    </q-toolbar>

    <!-- Diesel News Modal -->
    <q-dialog
      v-model="news"
      transition-show="scale"
      transition-hide="scale"
      style="max-width: 768px"
    >
      <ModalContent title="Diesel Laptops News">
        <DieselNews :posts="articles" />
      </ModalContent>
    </q-dialog>
  </q-header>
</template>

<script>
import { date, Platform } from "quasar";
import DieselNews from "../layout/DieselNews";
import ModalContent from "../common/ModalContent";
import NavDrawer from "../layout/NavDrawer";
import { Notify } from "../../mixins/Notify.js";
import UserMenu from "../layout/UserMenu";

export default {
  mixins: [Notify],

  components: { DieselNews, ModalContent, NavDrawer, UserMenu },

  created() {
    console.log("component createds");
  },

  mounted() {
    console.log(this.showBanner);
    this.checkReadNews();
    this.checkDarkMode();
    // this.getNews();  //disable news

    if (this.$ld.flags["shopping-list"]) {
      if (!this.usersShoppingList && this.user_token) {
        this.getShoppingList();
      }

      if (!this.usersCompanyShop && this.user_token) {
        this.$store.dispatch("company/getCompanyShop");
      }
    }
  },

  computed: {
    // Adds top padding if device is iOSand a mobile app
    iosAppPadding() {
      const platform = this.$q.platform.is;
      if (platform.ios && platform.capacitor) return "padding-top:8px";
      else return "";
    },

    isMobile() {
      if (Platform.is.mobile) return true;
      else return false;
    },

    // Determins wheter or not user is logged in
    loggedIn() {
      return this.$store.state.user.loggedIn;
    },

    // Determines the date the news was last read
    readDate() {
      return this.$q.localStorage.getItem("readDate");
    },

    // Gets a formatted version of the days date
    today() {
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      return today.toISOString().substring(0, 10);
    },

    // Check for users company and shop
    usersCompanyShop() {
      const shop = this.$store.getters["company/companyShop"];
      if (shop && shop.length > 0) {
        return true;
      }
      return false;
    },

    // Return users token
    user_token() {
      return this.$store.state.user.authorization.token;
    },

    // Return total number of items in Shopping List
    // Used as boolean and to display count in icon/badge
    usersShoppingList() {
      let list = this.$store.getters["shoppinglist/shoppingList"];
      let totalCartItems = Object.keys(list).length ? list : 0;
      if (totalCartItems) {
        let cartTotal = list.reduce(function (prev, cur) {
          return prev + cur.quantity;
        }, 0);
        return cartTotal;
      }
      return totalCartItems;
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

    companyShop() {
      return this.$store.getters["company/companyShop"];
    },

    hasTriggeredOpticatRequestsForListItems() {
      return this.$store.getters[
        "shoppinglist/hasTriggeredOpticatRequestsForListItems"
      ];
    },

    isPollingShoppingCart() {
      return this.$store.getters["shoppinglist/isPollingShoppingCart"];
    },

    shouldShowCartSpinner() {
      return (
        this.hasTriggeredOpticatRequestsForListItems ||
        this.isPollingShoppingCart
      );
    },

    shouldShowCartIcon() {
      return (
        this.companyShop &&
        this.companyShop.length > 0 &&
        this.usersShoppingCartCount > 0
      );
    },

    shouldShowCartIconWithSpinner() {
      return this.shouldShowCartIcon && this.shouldShowCartSpinner;
    },

    hasOpticatFailed() {
      return this.$store.getters["shoppinglist/hasOpticatFailed"]
    },

    shouldShowCartIconWithWarning() {
      return this.shouldShowCartIcon && this.hasOpticatFailed;
    },
  },

  data: () => ({
    baseURL:
      process.env.NEWS_SERVICE_BASE_URL,
    articles: [],
    lastRead: "",
    news: false,
    unreadArticles: 0,
    showBanner: process.env.IS_STAGING_ENV,
  }),

  methods: {
    // TODO: Consider moving this elsewhere
    checkDarkMode() {
      const darkEnabled = this.$q.localStorage.getItem("darkMode");
      if (darkEnabled) this.$q.dark.set(true);
      else this.$q.dark.set(false);
    },

    // Check last time Diesel News was viewed
    checkReadNews() {
      if (this.readDate) this.lastRead = this.readDate;
      else this.lastRead = "2020-10-01";
    },

    // Get shopping list
    getShoppingList() {
      if (this.user_token) {
        const listOrError = this.$store.dispatch(
          "shoppinglist/getShoppingList"
        );

        if (listOrError === "error") {
          this.notify("Error getting shopping list", "negative");
        }
      }
    },

    // Don't route to shopping list if already there
    goToShoppingPage() {
      if (this.$router.currentRoute.path !== "/shopping") {
        this.$router.push("/shopping");
      }
    },

    // Don't route to shopping cart if already there
    goToShoppingCartPage() {
      if (
        this.shouldShowCartIcon &&
        this.$router.currentRoute.path !== "/cart"
      ) {
        this.$router.push("/cart");
      }
    },

    // Reformats date to be more readable in posts
    reformatDate: function (newsDate) {
      const fixDate = newsDate.Date.toString();

      const longMonthDayYear = date.formatDate(
        fixDate.toString(),
        "MMMM D, YYYY"
      );

      const time = date.formatDate(fixDate.toString(), "h:mma");

      return `${longMonthDayYear} at ${time}`;
    },

    // Get Diesel News articles
    getNews: async function () {
      const newsURL = `${this.baseURL}/diesel-news?_sort=created_at:DESC&Product_contains=general&Product_contains=dieselrepair`;

      const newsArticles = await fetch(newsURL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      this.articles = await newsArticles.json();
    },

    // Navigate to home page, avoids duplicate navigation
    goHome() {
      if (!this.loggedIn) this.$router.push({ name: "login" });
      else this.$router.push({ name: "home" });
    },
  },
  watch: {
    articles() {
      // Do nothing if there are no articles
      if (this.articles.length === 0) return;

      for (let article of this.articles) {
        // Add formatted date value on each article for display purposes
        const postDate = article.Date.substring(0, 10);

        // If date of post is newer than last read date
        if (postDate > this.lastRead) {
          // Increase unread count
          this.unreadArticles++;

          // Add isNew prop to post to ID it as 'new'
          article.isNew = true;
        }
      }
    },

    // Update local storage when last read date is updated
    lastRead() {
      this.$q.localStorage.set("readDate", this.lastRead);
    },

    news() {
      // When news modal is closed
      if (this.news === false) {
        // Update read date
        this.$q.localStorage.set("readDate", this.today);

        // Clear unread count
        this.unreadArticles = 0;
      }
    },

    hasOpticatFailed(newBool, oldBool) {
      if (newBool && !oldBool) {
        this.notify("Opticat failed to retrieve cart items' data");
      }
    }
  },
};
</script>

<style lang="scss">
.nav-logo {
  cursor: pointer;
  height: 30px;
}

.q-btn {
  &.cart-and-spinner,
  &.cart-and-warning {
    position: relative;

    svg.q-spinner,
    .warning-container {
      position: absolute;
      top: 0;
      right: 1px;
      z-index: 2;

      height: 16px;
      width: 16px;
    }
  }

  &.cart-and-warning {
    .warning-container {
      border-radius: 50%;
      font-size: 12px;
      line-height: 16px;
      font-weight: 900;
      overflow: hidden;
    }
  }
}
</style>
