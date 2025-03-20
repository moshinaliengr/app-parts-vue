<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="text-center">
        <img
          src="../assets/app-logo.png"
          alt="Diesel Laptops logo"
          style="width: 65%"
        />
        <p class="text-h5">Advanced Tools Suite</p>
      </q-card-section>

      <q-list>
        <q-item v-for="tool in advanced" :key="tool.name" class="q-pb-md">
          <q-item-section class="no-padding">
            <div class="row items-center q-mb-sm">
              <q-icon size="sm" :name="tool.icon" />
              <div class="text-h6 q-ml-md">{{ tool.title }}</div>
            </div>

            <div class="text-caption q-mb-sm">{{ tool.desc }}</div>

            <q-expansion-item
              label="Read More"
              icon="zoom_in"
              class="details-panel no-padding"
              header-class="text-body2 q-px-sm"
              dense
            >
              <q-card class="text-center">
                <q-card-section class="q-pa-sm text-left">
                  <q-video
                    class="full-width q-my-md"
                    :ratio="16 / 9"
                    :src="tool.video"
                  />

                  <q-list class="q-px-md">
                    <q-item
                      v-for="detail in tool.details"
                      :key="detail.title"
                      class="q-px-none q-pb-md"
                    >
                      <q-item-section avatar
                        ><q-icon size="md" :name="detail.icon"
                      /></q-item-section>
                      <q-item-section class="no-padding">
                        <div class="row items-center">
                          <div class="text-bold">{{ detail.title }}</div>
                        </div>

                        <div class="text-caption q-mb-sm">
                          {{ detail.text }}
                        </div>
                      </q-item-section></q-item
                    ></q-list
                  >
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-item-section>
        </q-item>
      </q-list>

      <div outlined class="row q-mt-lg">
        <div>
          <div class="text-h4">It's Time to Move Ahead...</div>
          <div class="q-py-md q-px-none">
            Truck Parts Premium combines several powerful pieces of software so
            you can elevate your services, win more clients, and save time and
            money with our modern, advanced data services. Schedule your demo
            today to learn how we can help your business fly past the
            competition.
          </div>
        </div>

        <div class="row full-width flex justify-start">
          <!-- TODO Placeholder button until email thing is set up  -->
          <ButtonStandard
            label="Schedule a Demo"
            type="a"
            href="https://www.diesellaptops.com/pages/contact-us"
            target="__blank"
            class="q-pa-xs"
            :full="false"
          />
        </div>
      </div>
    </ContentCard>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import ButtonStandard from "../components/common/ButtonStandard";

import { Platform } from "quasar";

export default {
  name: "AdvancedTools",
  components: {
    ContentCard,
    ButtonStandard,
  },

  computed: {
    isDesktop() {
      if (Platform.is.desktop) {
        return true;
      } else {
        return false;
      }
    },
  },
  data: () => ({
    slide: "masscross",
    advanced: [
      {
        title: "Mass Cross",
        name: "masscross",
        icon: "fad fa-random",
        desc:
          "Whether you’re bidding on a new client or seeking out competitive part alternatives, doing a mass cross can take hours or even days of time to complete – and you’re potentially missing out on thousands of parts. Simply upload your spreadsheet to us and we’ll generate a list of crosses in as little as a few hours – freeing up your employees (and you) for more important tasks.",
        video: "https://www.youtube.com/embed/ljGnXJ0MFMc",
        details: [
          {
            icon: "fas fa-random",
            title: "Master the Bid",
            text:
              "Take on more client bids without spending hours or days manually crossing parts. Our parts database does all the heavy lifting for you.",
          },
          {
            icon: "fas fa-plus-hexagon",
            title: "Better, Faster Results",
            text:
              "Speaking of databases, ours is updated daily with parts information, allowing you to find more parts options faster than even the most seasoned parts professional!",
          },
          {
            icon: "fas fa-rabbit-fast",
            title: "Faster Client Service",
            text:
              "Surprise new and current clients with your new, streamlined process that saves them precious time and money…step up your service game today!",
          },
        ],
      },
      {
        title: "Inventory Analysis",
        name: "inventoryanalysis",
        icon: "fad fa-inventory",
        desc:
          "Between bosses that demand more margins, constant interruptions from coworkers, and thousands of manufacturer websites to sift through for good deals, it can be a nightmare to manage your inventory – much less find the best parts for your clients. Watch this short video to learn how our Inventory Analysis tool can save you time and money…and make your boss happy too.",
        video: "https://www.youtube.com/embed/CF0hEj6ELq0",
        details: [
          {
            icon: "fas fa-warehouse-alt",
            title: "Free Up Cash Fast",
            text:
              "Run your complete inventory analysis without sacrificing sales or downtime (and without any extra work on your end). Just upload your inventory file and done!",
          },
          {
            icon: "fas fa-traffic-light-go",
            title: "No Downtime",
            text:
              "Speaking of databases, ours is updated daily with parts information, allowing you to find more parts options faster than even the most seasoned parts professional!",
          },
          {
            icon: "fas fa-clone",
            title: "Identify Non-Moving Parts",
            text:
              "Harness the power of our cross database to identify not only OEM => aftermarket crosses but also aftermarket => aftermarket crosses.",
          },
        ],
      },
      {
        title: "Compare Manufacturers",
        name: "comparemanufacturers",
        icon: "fad fa-server",
        desc:
          "It’s no surprise that truck manufacturers use some of the same parts. What is surprising is how many of those same parts end up on your shelves! Quickly compare any manufacturer against another to gain a competitive advantage, raise prices, and clear inventory for other items to stock.",
        video: "https://www.youtube.com/embed/mY3153rBWDE",
        details: [
          {
            icon: "fas fa-truck-moving",
            title: "Mixed Fleet? No Problem",
            text:
              "For clients with mixed fleets, easily locate parts from one brand to another – like magic!",
          },
          {
            icon: "fas fa-tractor",
            title: "Off-Highway, Too!",
            text:
              "Our advanced software can even identify crosses to off-highway equipment, allowing your clients to save even more time and money.",
          },
          {
            icon: "fas fa-server",
            title: "Parts Matching",
            text:
              "Our powerful database cuts through the noise to match parts between OEMs (we match these parts with aftermarket too) – even if the part numbers have prefixes or suffixes.",
          },
        ],
      },
      {
        title: "Part Number Cleanup",
        name: "pnc",
        icon: "fad fa-pencil",
        desc:
          "The parts world is a confusing place. Everyone has their own naming conventions, so it’s a challenge knowing exactly what’s on your shelves. Luckily, our automated parts cleanup tool makes it easy. Upload your inventory, and we’ll send back the clean database you can use to search your inventory, spot duplicates, and standardize your warehouse.",
        video: "https://www.youtube.com/embed/6ztjO97FUys",
        details: [
          {
            icon: "dns",
            title: "One Part, One Entry",
            text:
              "Save time and money tracking parts – we constantly strive to keep our database clean, which means a standardized, reliable parts list for you and your inventory.",
          },
          {
            icon: "update",
            title: "Constant Updates",
            text:
              "Our team works around the clock to make sure part numbers are current and updated. On top of that, we’re constantly adding parts as fast as the manufacturers can make them!",
          },
          {
            icon: "sports",
            title: "Clean as a Whistle",
            text:
              "A standardized, clean parts list means less trouble wrangling parts, less duplicates clogging your shelves, and more money in your pocket today.",
          },
        ],
      },

      {
        title: "Mass VMRS",
        name: "massvmrs",
        icon: "fad fa-database",
        desc:
          "A fleet without a standardized process can quickly become a nightmare to manage. Get back on the right foot with our standard VMRS coding solution. Simply upload your parts data and we’ll provide a spreadsheet with standard VMRS data.",
        video: "https://www.youtube.com/embed/LPkECi1vnL4",
        details: [
          {
            icon: "fas fa-star-of-life",
            title: "Universal Standards",
            text:
              "VMRS is used across several industries and is a common language that you and your clients can immediately use to realize a number of benefits.",
          },
          {
            icon: "fas fa-hand-holding-box",
            title: "Enhance Your Services",
            text:
              "Use Truck Parts Premium to offer complete VMRS coding as part of your standard service offering to stand out to prospective clients and easily win more bids.",
          },
        ],
      },

      {
        title: "What Does It Fit?",
        name: "wdif",
        icon: "fad fa-file-search",
        desc:
          "It happens all the time - somehow you end up with a random truck part on your shelf. You're not sure what it fits, but you need it gone! What if you could put that part number into a website that would tell you exactly what makes and models that part fits? Now you can do exactly that within seconds with the new What Does it Fit? tool from Diesel Parts!",
        video: "https://www.youtube.com/embed/wOG99NaY4Po",
        details: [
          {
            icon: "fas fa-barcode-alt",
            title: "Works With Any Part!",
            text:
              "Works great with both OEM and aftermarket part numbers! Just plug in the part number and we'll give you a list of all the makes and models that part fits. Once you identify that part you can sell it to customers with those trucks in their fleet.",
          },
          {
            icon: "fas fa-sack-dollar",
            title: "An Efficient Shop = More Cash in Your Pocket",
            text:
              "Easily sell off unneeded parts, clean up your inventory, and make more efficient use of your space with this innovative new tool from Diesel Parts.",
          },
        ],
      },
    ],
  }),
};
</script>

<style lang="scss">
// Adjusts spacing & color on prepended icon in expansion panels
.details-panel .q-item__section--avatar {
  color: $primary;
  min-width: 35px !important;
}
</style>
