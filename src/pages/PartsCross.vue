<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="text-h6">
        Parts Cross Reference
      </q-card-section>

      <q-card-section class="no-padding no-margin">
        <PartSearchBar
          :manufacturers="manufacturers"
          @findParts="findParts"
          @clearResults="clearResults"
          @clearStateForNewSearch="clearStateForNewSearch"
        />
      </q-card-section>

      <q-card
        flat
        :style="`min-height: 500px`"
      >
        <div v-if="noResults">No results found. Please try another search.</div>

        <q-card v-if="searchResults.length > 0">
          <q-card-section class="q-pt-none">
            <PartInfoList :parts="searchResults" />
          </q-card-section>

          <q-card-section
            v-if="searchResults.length > 0 && totalResultsFound > partsPerPage"
            class="q-pt-none"
          >
            <q-pagination
              v-if="isDesktop"
              v-model="pageNumber"
              :max-pages="5"
              :max="numberOfPages"
              :direction-links="true"
              :boundary-links="true"
              :boundary-numbers="true"
              icon-first="skip_previous"
              icon-last="skip_next"
              class="flex flex-center q-px-xs"
              text-color="black"
              color="primary"
              dense
            />

            <q-pagination
              v-else
              v-model="pageNumber"
              :max="numberOfPages"
              input-class="text-bold text-primary"
              class="flex flex-center q-px-xs"
              icon-first="skip_previous"
              icon-last="skip_next"
              text-color="black"
              color="primary"
              input
              dense
            />
          </q-card-section>
        </q-card>
        <q-inner-loading :showing="loadingResults">
          <q-spinner-gears
            size="50px"
            color="primary"
          />
        </q-inner-loading>
      </q-card>
    </ContentCard>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import PartSearchBar from "../components/partsCross/PartSearchBar.vue";
import PartInfoList from "../components/partsCross/PartInfoList.vue";
import { searchParts } from "../services/TruckPartsCross";

export default {
  name: "PartsCross",

  components: {
    ContentCard,
    PartSearchBar,
    PartInfoList,
  },

  computed: {
    isDesktop() {
      if (this.$q.platform.is.desktop) return true;
      else return false;
    },

    numberOfPages() {
      return Math.ceil(this.totalResultsFound / this.partsPerPage);
    },
  },

  data() {
    return {
      loadingResults: false,
      noResults: false,
      manufacturers: [],
      pageNumber: 1,
      partsPerPage: 10,
      searchResults: [],
      totalResultsFound: 0,
      cachedLatestQuery: {
        queryText: "",
        manufacturer: { name: "", id: null },
      },
    };
  },

  methods: {
    /**
     * Search the Truck Parts Cross API for a part. Makes a new search if the manufacturer, part number
     * input text, or page number changes.
     *
     * @param {string} partNumber
     * @param {object} manufacturer
     * @param {boolean|null} resetPageNumber - (optional) if page number should be reset to 1
     */
    async findParts({ partNumber, manufacturer, resetPageNumber = null }) {
      if (resetPageNumber) this.pageNumber = 1;

      let shouldUpdateManufacturers = false;
      if (this.cachedLatestQuery.queryText !== partNumber) {
        shouldUpdateManufacturers = true;
      }

      this.cachedLatestQuery = { queryText: partNumber, manufacturer };
      this.clearResults();
      this.loadingResults = true;

      let params = {
        search: partNumber,
        page: this.pageNumber,
        per_page: this.partsPerPage,
        manufacturer_id: manufacturer.id,
      };

      const partsFound = await searchParts(params);
      this.processResults({ partsFound, shouldUpdateManufacturers });
    },

    clearResults() {
      this.searchResults = [];
      this.noResults = false;
    },

    clearStateForNewSearch() {
      this.clearResults();
      this.manufacturers = [];
      this.cachedLatestQuery = {
        queryText: "",
        manufacturer: { name: "", id: null },
      };
    },

    /**
     * Process the results from the Truck Parts Cross API.
     *
     * @param {object} partsFound - the parts returned from the API
     * @param {boolean} shouldUpdateManufacturers - if searching for the same part number, don't update the manufacturers
     */
    processResults({ partsFound, shouldUpdateManufacturers }) {
      if (shouldUpdateManufacturers) {
        this.manufacturers = partsFound.meta.updates.manufacturer;
      }

      if (partsFound?.data) {
        const results = partsFound.data;
        const found = partsFound.meta.found;

        this.totalResultsFound = found;

        this.searchResults = results;

        this.loadingResults = false;
        if (this.searchResults.length < 1) {
          this.noResults = true;
        }
      }
    },
  },

  watch: {
    pageNumber(newPageNumber, oldPageNumber) {
      if (newPageNumber !== oldPageNumber) {
        this.findParts({
          partNumber: this.cachedLatestQuery.queryText,
          manufacturer: this.cachedLatestQuery.manufacturer,
          resetPageNumber: false,
        });
      }
    },
  },
};
</script>
