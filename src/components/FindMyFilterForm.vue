<template>
  <q-form @submit="getParts">
    <q-input
      v-model="vin"
      @input="resetCategories({ name: 'vin' })"
      label="Search by VIN"
      outlined
      clearable
      dense
      :rules="rules"
    />
    <or-divider />
    <q-select
      v-model="year"
      :options="years"
      @input="resetCategories({ name: 'year' })"
      label="Select Year"
      outlined
      clearable
      dense
    />
    <q-select
      v-model="manufacturer"
      :options="manufacturers"
      @input="resetCategories({ name: 'manufacturer' })"
      label="Select Manufacturer"
      outlined
      :disable="!year"
      clearable
      dense
    />
    <q-select
      v-if="showSelectModel"
      v-model="model"
      :options="models"
      label="Select Model"
      outlined
      :disable="!manufacturer"
      clearable
      dense
    />
    <ButtonStandard
      :disabled="isDisabled"
      :loading="loading"
      class="q-mt-lg"
      label="View Filters"
      type="submit"
    />
  </q-form>
</template>

<script>
import ButtonStandard from "./common/ButtonStandard.vue";
import OrDivider from "./common/OrDivider.vue";
import VinDecoderService from "src/services/VinDecoder.js";
export default {
  components: { ButtonStandard, OrDivider },
  name: "FindMyFilterForm",
  data() {
    return {
      vin: "",
      year: null,
      years: [],
      manufacturer: null,
      manufacturers: [],
      model: null,
      models: [],
      showSelectModel: false,
      loading: false,
      vinTooShortErrMsg:
        "Pro Tip: VIN numbers need to be 17 characters long. Check your entry and try again, please.",
      noModelsFoundErrMsg:
        "Darn it, we couldn’t find a model for that Year or Manufacturer. Please try again.",
      noResultsFoundErrMsg:
        "Darn it, we couldn’t find a filter for that Year, Manufacturer, or Model. Please try again.",
      noResultsFoundVIN:
        "Bummer. We couldn’t find a filter for that VIN. Check the characters and try again, please.",
    };
  },
  // Gets and set years and manufacturers when the component is mounted
  async mounted() {
    const years = await VinDecoderService.getYears();
    this.years = years.data.data;
    const manufacturers = await VinDecoderService.getManufacturers();
    this.manufacturers = manufacturers.data.data;
  },
  computed: {
    isDisabled() {
      return this.vin === "" && this.model === null;
    },
    //rule governing vin length error message logic
    vinRule() {
      return this.vin.length === 17 || this.vin.length === 0;
    },
    rules() {
      return [(vin) => this.vinRule || this.vinTooShortErrMsg];
    },
  },
  methods: {
    resetCategories(category) {
      if (category.name === "vin") {
        this.year = null;
        this.manufacturer = null;
        this.model = null;
        this.showSelectModel = false;
      }
      if (category.name === "year") {
        this.vin = "";
        this.manufacturer = null;
        this.model = null;
        this.showSelectModel = false;
      }
      if (category.name === "manufacturer") {
        this.model = null;
      }
    },
    async getParts() {
      /* 
        The only currently known combination of Year, Manufacturer, and Model successfully returning parts:
        Year = 2022
        Manufacturer = "PACCAR"
        Model = MX13
      */
      try {
        this.loading = true;
        const vehicle = {
          vin: this.vin,
          manufacturer: this.manufacturer,
          model: this.model,
          year: this.year,
        };
        const response = await VinDecoderService.getParts(vehicle);
        const searchResults = response.data.data;
        if (searchResults.length !== 0) {
          this.$emit("search-results", { vehicle, searchResults });
        } else {
          let message =
            this.vin !== ""
              ? this.noResultsFoundVIN
              : this.noResultsFoundErrMsg;
          this.$q.notify({
            message,
            color: "negative",
            position: "top",
          });
        }
      } catch (error) {
        // Notify the user if an error occured
        console.log("error", error);
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    async manufacturer(current, previous) {
      if (this.manufacturer !== null) {
        const response = await VinDecoderService.getModels({
          manufacturer: this.manufacturer,
          year: this.year,
        });
        this.models = response.data.data;
        if (this.models.length !== 0) {
          return (this.showSelectModel = true);
        }
        return this.$q.notify({
          message: this.noModelsFoundErrMsg,
          color: "negative",
          position: "top",
        });
      }
    },
  },
};
</script>
