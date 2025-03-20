<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="text-h6 card-title q-pb-none">
        VIN Decoder
      </q-card-section>
      <!-- Search Input -->
      <q-card-section class="q-py-none">
        <q-input
          v-model="query"
          v-on:keyup.enter="decodeVIN"
          label="Enter A VIN"
          class="search-input"
          outlined
          dense
        >
          <template v-slot:append>
            <!-- Clears input text -->
            <q-icon
              v-if="query !== ''"
              name="close"
              @click="query = ''"
              class="cursor-pointer"
            />

            <!-- Search Button -->
            <q-btn
              @click="decodeVIN"
              color="primary"
              :disable="query === '' ? true : false"
              text-color="secondary"
              unelevated
              icon="search"
              style="height: 100%"
            >
              <q-tooltip> Search by part number </q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </q-card-section>
      <!-- Search Results -->
      <q-card-section class="q-py-none">
        <q-card-section class="no-padding" style="min-height: 356px">
          <LoadingOverlay :loadingProp="loading" />

          <!-- If Results -->
          <div v-if="details.length > 0">
            <q-list v-if="!loading" separator>
              <q-item v-for="detail in details" :key="detail[0]">
                <q-item-section>
                  <q-item-label>
                    {{ detail[0] }}
                  </q-item-label>
                  <q-item-label v-if="detail[3]" caption>{{
                    detail[3]
                  }}</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-right">
                    <span class="q-mr-md desktop-only">{{ detail[1] }}</span>
                    <div class="q-mb-xs mobile-only">{{ detail[1] }}</div>
                    <ButtonStandard
                      @click.native="viewPart(detail[2])"
                      class="q-px-sm"
                      label="View Part"
                      size="sm"
                      :full="false"
                      v-if="detail[2]"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- If No Results -->
          <div
            v-if="noResults"
            class="flex flex-center text-negative"
            style="height: 100%"
          >
            <p class="no-margin text-center">
              {{ errorMessage }}. Please double check your VIN.
            </p>
          </div>
        </q-card-section>
      </q-card-section>
    </ContentCard>
  </q-page>
</template>

<script>
import ButtonStandard from "../components/common/ButtonStandard.vue";
import ContentCard from "../components/common/ContentCard";
import LoadingOverlay from "../components/common/LoadingOverlay";
import PartInfo from "../components/PartInfo.vue";

export default {
  name: "VinDecoder",
  components: {
    ButtonStandard,
    ContentCard,
    LoadingOverlay,
  },

  data: () => ({
    // 1HTBANDA9MH123456
    // 2HSCNAPR16C233306
    // 3AKJHHDR0NSMT0425
    associatePartsKey: process.env.ASSOCIATE_PARTS_API_KEY,
    vinKey: process.env.VIN_DECODER_API_KEY,
    baseURL: process.env.TRUCK_PARTS_CROSS_SERVICE_BASE_URL,
    vinBaseURL: process.env.VIN_SERVICE_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    tpcHeaders: {
      "X-Authorization": process.env.TRUCK_PARTS_CROSS_SERVICE_API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    associatePartList: [],
    details: [],
    errorMessage: "",
    loading: false,
    noResults: false,
    query: "",
    searching: false,
  }),

  methods: {
    async viewPart(id) {
      const url = `${this.baseURL}/api/v1/part/${id}`;
      let response = await fetch(url, {
        method: "GET",
        headers: this.tpcHeaders,
      });
      let partselected = await response.json();

      this.$q.dialog({
        component: PartInfo,
        partProp: partselected.data,
      });
    },

    // Finds associate parts and links to tpc
    async getAssociateParts() {
      let url = `${this.vinBaseURL}/api/wmi/AssociatePartList?vin=${this.query}&api_key=${this.associatePartsKey}`;
      let response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });
      // Gets associate parts from API response
      let associatePartResponse = await response.json();

      // If no error, go through with process of finding & matching parts
      let querySuccess = () => {
        this.associatePartList = associatePartResponse.data;
        console.log(this.associatePartList);
        // Gets which category (part type) we are looking for from list of associate parts, ex: "Filter - Fuel"
        let partsToSearch = this.associatePartList.map((part) => part.category);
        // Finds the part & part number in the list of details from vin decoder response
        partsToSearch.forEach((category) => this.matchPart(category));
      };

      if (!associatePartResponse.error) {
        querySuccess();
      }
    },

    // Looks through VIN details to find matching category we got from the associate parts lidt
    matchPart(partType) {
      const foundPart = this.details.find(
        (category) => category[0] === partType
      );
      console.log(foundPart);
      // Gets part id & notes and adds them to respective array, ex: ["Filter - Fuel", "CS1000", 2535891, "Extended life filter"]
      foundPart.push(...this.getIdAndNotes(foundPart));
      console.log(foundPart);
    },

    // Compares part number from VIN details to Associated Parts List to get TPC part id & notes
    getIdAndNotes(part) {
      let filteredPart = this.associatePartList.filter(
        (p) => p.part_no === part[1]
      );
      // Part id for TPC search & notes from Associated Parts List
      return [filteredPart[0].ref_part_id, filteredPart[0].notes];
    },

    async decodeVIN() {
      this.loading = true;
      this.noResults = false;
      this.errorMessage = "";
      this.details = [];

      let url =
        this.vinBaseURL +
        `/api/wmi/decode` +
        `?vin=${this.query.trim()}` +
        `&api_key=${this.vinKey}` +
        `&version=2`;

      let response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });

      let apiResponse = await response.json();

      let querySuccess = () => {
        let cleanOtherInfo = () => {
          let engineFilters = apiResponse["Other Info"]["Engine Filters"];
          let engineFiltersExtra =
            apiResponse["Other Info"]["Engine Filters Extra"];

          // If "engine filters" is in the data
          if (engineFilters) {
            Object.entries(engineFilters).forEach((entry) => {
              if (entry[1] === null) entry[1] = "-";
              this.details.push(entry);
            });
          }

          // If "engine filters extra" is in the data
          if (engineFiltersExtra) {
            Object.entries(engineFiltersExtra).forEach((entry) => {
              if (entry[1] === null) entry[1] = "-";
              this.details.push(entry);
            });
          }
        };

        Object.entries(apiResponse).forEach((entry) => {
          if (entry[1] === null) {
            entry[1] = "-";
            this.details.push(entry);
          } else if (
            typeof entry[1] !== "object" &&
            entry[0] !== "status" &&
            entry[0] !== "VIN"
          ) {
            this.details.push(entry);
          } else if (typeof entry[1] === "object") {
            cleanOtherInfo();
          }
        });

        // Gets Associate Part information
        this.getAssociateParts();
      };

      apiResponse.error ? (this.noResults = true) : querySuccess();

      if (apiResponse.error == "") {
        this.details = [];
        this.noResults = true;
        this.errorMessage = "Something went wrong";
      } else {
        this.errorMessage = apiResponse.error;
      }

      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
label.q-field.search-input > div.q-field__inner > div.q-field__control {
  padding: 0 0 0 12px;
}
</style>
