<template>
  <q-page class="flex flex-center">
    <q-dialog
      v-model="isVerifyModalShowing"
      transition-show="slide-up"
      transition-hide="slide-down"
      class="q-px-none flex flex-center"
      persistent
    >
      <VerifyUserModal @closeVerifyModal="closeVerifyModal" />
    </q-dialog>
    <ContentCard class="text-center">
      <q-card-section class="image-wrapper q-mx-auto">
        <img alt="Diesel Repair Logo" src="~assets/app-logo.png" />
      </q-card-section>

      <q-card-section class="text-h5">
        The Only Truck Parts Platform You’ll Ever Need
      </q-card-section>

      <q-card-section class="text-body2 no-padding">
        <p>
          Diesel Parts is an advanced database that quickly and easily enables
          you to make better buying decisions, save money, and increase margins.
        </p>

        <p>
          What started as an internal project quickly grew into a full-fledged
          heavy- duty toolbox of products used by shops and fleets across the
          country, and now it’s your turn.
        </p>
      </q-card-section>

      <q-card-section>
        <q-list class="flex justify-center items-start q-mx-auto">
          <q-item
            v-for="tool in tools"
            :key="tool.details"
            :to="tool.route"
            class="flex column q-mb-md"
            clickable
            style="max-width: 255px"
            :aria-label="'Home ' + tool.title"
          >
            <q-item-section avatar class="flex flex-center no-padding q-mb-md">
              <q-icon size="xl" class="theme-diesel" :name="tool.icon" />
            </q-item-section>

            <q-item-section class="column">
              <q-item-label class="text-h6 q-mb-sm">
                {{ tool.title }}
              </q-item-label>

              <q-item-label class="text-body2">
                {{ tool.details }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </ContentCard>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import VerifyUserModal from "src/components/layout/VerifyUserModal.vue";

export default {
  name: "Home",

  components: { ContentCard, VerifyUserModal },

  data: () => ({
    isVerifyModalShowing: false,
    tools: [
      {
        icon: "fad fa-code",
        title: "Parts Cross Reference",
        details:
          "Use the industry’s largest HD parts database to cross-reference any OEM or aftermarket part. Over 2 million parts and 100 million crosses available.",
        route: "/parts-cross",
      },
      {
        icon: "fad fa-chart-bar",
        title: "Exploded Views",
        details:
          "Find any part you need even without a VIN! Use our innovative guided search and detailed exploded view diagrams to quickly find any part.",
        route: "/parts-lookup/exploded-views",
      },
      {
        icon: "fad fa-bullseye-arrow",
        title: "Component Search",
        details:
          "Starting with component groups, quickly narrow down your search based on component types and manufacturers.",
        route: "/parts-lookup/component-search",
      },

      {
        icon: "fad fa-ruler-combined",
        title: "By Measurement",
        details:
          "Identify thousands of HD truck components by measurement with our industry leading guided search.",
        route: "/parts-lookup/by-measurement",
      },
      {
        icon: "fad fa-recycle",
        title: "Used Components",
        details:
          "We’ve partnered with TPI to give you the best selection of used engines and transmissions available on the market today.",
        route: "/parts-lookup/used",
      },
      {
        icon: "fad fa-tools",
        title: "Advanced Tools",
        details:
          "Explore our advanced data tools to increase margins, identify duplicate parts, make more sales, and so much more.",
        route: "/advanced-tools",
      },
      {
        icon: "fad fa-truck",
        title: "VIN Decoder",
        details:
          "Does just what it says! Plug in your VIN and get detailed truck information from engine type to brake system, cab type and more.",
        route: "/vin-decoder",
      },
      {
        icon: "fad fa-industry-alt",
        title: "Manufacturers",
        details:
          "Search our extensive manufacturer database to discover product information, contact info, and more.",
        route: "/manufacturers",
      },
    ],
  }),
  methods: {
    closeVerifyModal() {
      this.isVerifyModalShowing = false;
    },
  },
  mounted() {
    if (this.$store.state.user.information.email_verified_at == null) {
      console.log("user is not verified, showing modal");
      this.isVerifyModalShowing = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.dash-icon {
  border-radius: 50%;
  max-height: 100px;
  width: auto;
}
</style>
