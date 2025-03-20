<template>
  <q-page class="flex flex-center row">
    <q-card class="col-xs-10 col-sm-8 col-md-6 col-lg-4 q-pa-lg">
      <q-btn
        v-if="showingSearchResults"
        @click="showingSearchResults = !showingSearchResults"
        class="back-button self-start q-px-xs q-mb-md"
        color="primary"
        icon="chevron_left"
        label="Back to Search"
        size="sm"
        flat
      />
      <q-card-section v-if="!showingSearchResults">
        <find-my-filter-form @search-results="onResultsFound" />
      </q-card-section>

      <search-results-card
        v-if="showingSearchResults"
        :vehicle="vehicle"
        :searchResults="searchResults"
        @part-selected="onPartSelected"
      />
    </q-card>
  </q-page>
</template>

<script>
import PartInfo from "../components/PartInfo.vue";
import SearchResultsCard from "src/components/SearchResultsCard.vue";
import FindMyFilterForm from "src/components/FindMyFilterForm.vue";

export default {
  name: "FindMyFilter",
  components: {
    SearchResultsCard,
    FindMyFilterForm,
  },
  computed: {
    title() {
      return (
        `${this.selectedPart?.manufacturer_name} ${this.selectedPart?.number}` ||
        ""
      );
    },
  },
  data: () => {
    return {
      showingSearchResults: false,
      searchResults: [],
      vehicle: {},
      selectedPart: null,
      showingTruckPartsCrossModal: false,
    };
  },
  methods: {
    onResultsFound({ vehicle, searchResults }) {
      this.vehicle = vehicle;
      this.searchResults = searchResults;
      this.showingSearchResults = true;
    },
    onPartSelected(part) {
      this.selectedPart = part;
      this.$q.dialog({
        component: PartInfo,
        partProp: part,
      });
    },
  },
};
</script>
