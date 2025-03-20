<template>
  <q-card-section>
    <!-- Back button if displaying results -->
    <q-btn
      v-if="showResults"
      @click="SET_SHOW_RESULTS(false)"
      class="back-button self-start q-px-xs"
      color="primary"
      icon="chevron_left"
      label="Back to Search"
      size="sm"
      flat
    />

    <!-- Card Title -->
    <q-card-section class="text-h6 card-title ellipsis q-px-md">
      <!-- Title if showing search -->
      <span v-if="!showResults"> Component Search </span>

      <!-- Title if showing results -->
      <span v-if="showResults">
        {{ `${model.label} - ${category.label}` }}
      </span>
    </q-card-section>

    <!-- Component Property Selector -->
    <q-card-section class="no-padding" v-show="!showResults">
      <q-select
        v-model="make"
        label="Component Group"
        :options="makes"
        class="q-mb-sm"
        outlined
        dense
      />

      <q-select
        v-model="model"
        label="Component Type"
        :options="models"
        class="q-mb-sm"
        outlined
        dense
      />

      <q-select
        v-model="category"
        label="Manufacturer"
        :options="categories"
        class="q-mb-sm"
        outlined
        dense
      />

      <q-select
        v-if="variants.length && variant.name != `Default Sub-Category`"
        v-model="variant"
        label="Model"
        :options="variants"
        class="q-mb-sm"
        outlined
        dense
      />
    </q-card-section>

    <!-- Image and Zoom Button -->
    <q-card-section v-if="moduleImage && showResults">
      <q-img :src="moduleImage" />
      <ButtonRound
        @click.native="imageModal = !imageModal"
        tooltip="Zoom In"
        icon="zoom_in"
        class="absolute-bottom-right"
        color="primary"
      />
    </q-card-section>

    <!-- // Search button -->
    <q-btn
      v-show="!showResults"
      @click="search()"
      color="primary"
      full-width
      text-color="secondary"
      label="Search"
      class="text-bold full-width q-ma-xs"
    />

    <!-- Image Modal -->
    <q-dialog v-model="imageModal" v-if="moduleImage !== noImageURL">
      <ModalContent
        :fullHeight="false"
        :title="`${model.label} - ${category.label}`"
      >
        <img :src="moduleImage" class="q-mx-auto" style="max-height: 75vh" />
      </ModalContent>
    </q-dialog>
  </q-card-section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { Platform } from "quasar";
import ButtonRound from "../common/ButtonRound";
import ModalContent from "../common/ModalContent";

export default {
  name: `ComponentSearch`,
  components: { ButtonRound, ModalContent },

  data: () => ({
    baseURL:
      process.env.TRUCK_PARTS_LOOKUP_SERVICE_BASE_URL ||
      "https://api-truckpartslookup.com",
    make: ``,
    makes: [],
    cleanmakes: [],
    model: ``,
    models: [],
    category: ``,
    categories: [],
    variant: ``,
    variants: [],
    moduleParts: [],
    parts: [],
    dataProps: [],
    metaProps: [],
    full: true,
    moduleImage: "",
    imageModal: false,
  }),

  mounted: async function () {
    // MJ - Move this to Methods
    const rawMakes = await this.getEngineProp(`make`);

    const filteredMakes = rawMakes.filter((engine) =>
      engine.name.includes("Component")
    );

    const cleanUpName = function () {
      for (let make of filteredMakes) {
        make.label = make.label.replace("Component - ", "");
      }
    };

    cleanUpName();

    filteredMakes.sort((a, b) => {
      if (a === b) {
        return 0;
      }
      return a.label < b.label ? -1 : 1;
    });

    this.makes = filteredMakes;

    this.moduleParts = [];

    this.UPDATE_MODULE(this.moduleParts);

    // Ensures results aren't displayed on mount
    this.SET_SHOW_RESULTS(false);
  },

  computed: {
    ...mapGetters("module", ["showResults", "storedMatches"]),

     isMobile() {
      if (Platform.is.mobile) return true;
      else return false;
    },
    
    noImageURL() {
      return `${this.baseURL}/storage/CrJecKUbegPyTmkaIwFYa2uL3YOUVTNUEJ4iY3xW.png`;
    },
  },

  methods: {
    ...mapMutations("module", ["SET_SHOW_RESULTS", "UPDATE_MODULE"]),

    getEngineProp: async function (propName) {
      const headers = {
        "X-Authorization":
          process.env.TRUCK_PARTS_LOOKUP_SERVICE_API_KEY ||
          "Oh1AmZN5vdWAyRl8hjY0uasUol8r3dnr9v3wOVT052Wr3XYJwLjH2u3TpPEE",
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      const url = `${this.baseURL}/api/v1/${propName}`;

      const propResponse = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      const retrievedProps = await propResponse.json();

      const options = retrievedProps.data.map((prop) => {
        return { ...prop, label: prop.name };
      });

      return options;
    },
    getModuleProp: async function (propName) {
      const headers = {
        "X-Authorization":
          process.env.TRUCK_PARTS_LOOKUP_SERVICE_API_KEY ||
          "Oh1AmZN5vdWAyRl8hjY0uasUol8r3dnr9v3wOVT052Wr3XYJwLjH2u3TpPEE",
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      const url = `${this.baseURL}/api/v1/${propName}`;

      const propResponse = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      const retrievedProps = await propResponse.json();
      const dataProps = retrievedProps.data;

      const metaProps = retrievedProps.meta.updates.part.data;

      const mergedArray = [];

      for (let i = 0, len = dataProps.length; i < len; i++) {
        for (let j = 0, len2 = metaProps.length; j < len2; j++) {
          if (dataProps[i].part_id === metaProps[j].id) {
            mergedArray.push({ ...metaProps[j], ...dataProps[i] });
          }
        }
      }

      for (let i = 0, len = mergedArray.length; i < len; i++) {
        const parent = mergedArray[i];
        parent["children"] = [];

        // create prop to show/hide children
        parent["showChildren"] = true;
        for (let j = 0, len2 = mergedArray.length; j < len2; j++) {
          let child = mergedArray[j];
          // if an part's id matches another part's parent_module_id
          if (mergedArray[i].id === mergedArray[j].parent_module_id) {
            // add child to parent part
            parent["children"].push(child);
          }
        }
      }
      return mergedArray;
    },

    async search() {
      this.moduleImage = "";
      if (this.variant.id !== undefined) {
        const allMods = await this.getModuleProp(
          `module?variant_id=${this.variant.id}&auxiliaries[]=part&per_page=100`
        );

        const options = allMods.map((prop) => {
          return { ...prop, label: prop.name };
        });

        this.moduleParts = options
          .filter((m) => m.variant_id == this.variant.id)
          .sort((a, b) => {
            if (a === b) {
              return 0;
            } else if (a.reference_number === null) {
              return 1;
            } else if (b.reference_number === null) {
              return -1;
            }
          });

        if (this.variant.url === "" || null) this.moduleImage = this.noImageURL;
        else this.moduleImage = this.variant.url;

        this.UPDATE_MODULE(this.moduleParts);
        // Show results/hide search specifics
        this.SET_SHOW_RESULTS(true);
      }
    },
  },

  watch: {
    make: async function () {
      this.model = "";
      this.moduleParts = [];
      this.moduleImage = "";
      this.UPDATE_MODULE(this.moduleParts);
      if (this.make.id !== undefined) {
        const allModels = await this.getEngineProp(
          `model?make_id=${this.make.id}&per_page=100`
        );

        this.models = allModels
          .filter((m) => m.make_id === this.make.id)
          .sort((a, b) => {
            if (a === b) {
              return 0;
            }
            return a.label < b.label ? -1 : 1;
          });
        if (this.models.length === 1) this.model = this.models[0];
      }
    },

    model: async function () {
      this.category = "";
      this.moduleImage = "";

      if (this.model.id !== undefined) {
        const allCategories = await this.getEngineProp(
          `module_category?model_id=${this.model.id}&per_page=100`
        );

        this.categories = allCategories
          .filter((c) => c.model_id === this.model.id)
          .sort((a, b) => {
            if (a === b) {
              return 0;
            }
            return a.label < b.label ? -1 : 1;
          });

        if (this.categories.length === 1) this.category = this.categories[0];

        if (this.categories.length === 0 && this.model)
          this.category = `No categories found`;
      }
    },

    category: async function () {
      this.variant = "";
      this.moduleImage = "";

      if (this.category.id !== undefined) {
        if (this.category !== ("No categories found" || "")) {
          this.variant = "";
          const allVars = await this.getEngineProp(
            `variant?category_id=${this.category.id}&per_page=100`
          );

          this.variants = allVars
            .filter((v) => v.module_category_id == this.category.id)
            .sort((a, b) => {
              if (a === b) {
                return 0;
              }
              return a.label < b.label ? -1 : 1;
            });
          if (this.variants.length === 1) this.variant = this.variants[0];
        }
      }
    },
  },
};
</script>
