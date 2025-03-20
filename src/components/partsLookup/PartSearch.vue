<template>
  <ModalContent title="Select A Part">
    <!-- Overlay shown while searching -->
    <LoadingOverlay :loadingProp="searchSpinner" />

    <!-- If there are results -->

    <q-card-section v-if="partsData.length" class="q-px-none q-py-sm">
      <q-list separator>
        <q-item v-for="(part, p) in partsData" :key="p">
          <q-item-section>
            <KeyValueText keyName="Part Number" :value="part.number" />

            <KeyValueText
              keyName="Manufacturer"
              :value="part.manufacturer_name"
            />

            <KeyValueText keyName="Description" :value="part.name" />

            <q-item-label class="row">
              <ButtonStandard
                :full="false"
                @click.native="updateSelectedPart(part)"
                class="q-ma-sm"
                label="View Part Details"
              />
              <ThumbnailImages
                :PartImage="part.image_url"
                contain
                class="q-pt-xl"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- If search is complete and there are no results -->
    <q-card-section v-if="!searchSpinner && !partsData.length">
      Sorry, our parts database does not have enough information on this part.
    </q-card-section>
  </ModalContent>
</template>

<script>
// Libraries & Features
import axios from "axios";

// Components
import ButtonStandard from "../common/ButtonStandard";
import KeyValueText from "../common/KeyValueText";
import LoadingOverlay from "../common/LoadingOverlay";
import ModalContent from "../common/ModalContent";
import PartInfo from "../PartInfo";
import ThumbnailImages from "../partsCross/ThumbnailImages.vue";

export default {
  name: "Part Search",

  components: {
    ButtonStandard,
    KeyValueText,
    LoadingOverlay,
    ModalContent,
    ThumbnailImages,
  },

  props: {
    search: String,
  },

  // Lifecycle
  mounted: async function () {
    this.findParts(this.search);
  },

  // Alphabetical henceforth
  computed: {
    options() {
      return {
        headers: {
          "X-Authorization": this.apiKey,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
    },

    partsData() {
      return this.searchResults;
    },

    url() {
      return `${this.baseURL}/api/v1/part/search?search=${this.search}&page=${this.pageNumber}&per_page=${this.perPage}`;
    },
  },

  data() {
    return {
      baseURL: process.env.TRUCK_PARTS_CROSS_SERVICE_BASE_URL,
      apiKey: process.env.TRUCK_PARTS_CROSS_SERVICE_API_KEY,
      manufacturer: "",
      part: {},
      pageNumber: 1,
      perPage: 100,
      partNumber: "",
      partInfo: false,
      searchSpinner: true,
      searchResults: [],
      totalResultsFound: 0,
    };
  },

  // TODO: Reconsider how this is done.
  watch: {
    search: function () {
      if (this.search !== "") {
        // this.searchSpinner = true;
        this.searchResults = [];
        this.pageNumber = 1;
      }
    },
  },

  methods: {
    // Search for a part
    async findParts() {
      // Show searching spinner
      this.searchSpinner = true;

      // Request part matches from API
      const partSearchResults = await axios.get(this.url, this.options);

      // Set search results
      this.searchResults = partSearchResults.data.data;

      // Hide searching spinner
      this.searchSpinner = false;

      // console.log(this.searchResults);
    },

    updateSelectedPart(partToUpdate) {
      this.$q.dialog({
        component: PartInfo,
        partProp: partToUpdate,
      });
    },
  },
};
</script>
