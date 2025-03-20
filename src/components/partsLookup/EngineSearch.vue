<template>
  <article class="column">
    <!-- Back button if displaying results -->
    <div v-if="showResults">
      <q-btn
        @click="SET_SHOW_RESULTS(false)"
        class="back-button"
        color="primary"
        icon="chevron_left"
        label="Back to Search"
        size="sm"
        flat
      />
    </div>

    <!-- Card Title -->
    <q-card-section class="text-h6 card-title ellipsis">
      <!-- Title if showing search -->
      <span v-if="!showResults"> Exploded Views </span>

      <!-- Title if showing results -->
      <span v-if="showResults">
        {{ `${model.label} - ${category.label}` }}
      </span>
    </q-card-section>

    <!-- Component Property Selector -->
    <q-card-section class="no-padding" v-show="!showResults">
      <q-select
        v-model="make"
        label="Make"
        :options="makes"
        class="q-mb-sm"
        outlined
        dense
      />

      <q-select
        v-model="model"
        label="Model"
        :options="models"
        class="q-mb-sm"
        outlined
        dense
      />

      <q-select
        v-model="category"
        label="Category"
        :options="categories"
        class="q-mb-sm"
        outlined
        dense
      />

      <q-select
        v-if="variants.length && variant.name != `Default Sub-Category`"
        v-model="variant"
        label="Variant"
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

    <!-- Image Modal -->
    <q-dialog v-model="imageModal" v-if="moduleImage !== noImageURL">
      <ModalContent
        :fullHeight="false"
        :title="`${model.label} - ${category.label}`"
      >
        <img :src="moduleImage" class="q-mx-auto" style="max-height: 75vh" />
      </ModalContent>
    </q-dialog>
  </article>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ButtonRound from "../common/ButtonRound";
import ModalContent from "../common/ModalContent";

export default {
  name: `EngineSearch`,
  components: { ButtonRound, ModalContent },

  data: () => ({
    baseURL:process.env.TRUCK_PARTS_LOOKUP_SERVICE_BASE_URL,
    make: ``,
    makes: [],
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
    moduleImage: "",
    imageModal: false,
  }),

  mounted: async function () {
    const rawMakes = await this.getEngineProp(`make`);

    this.makes = rawMakes
      .filter((engine) => !engine.name.includes("Component"))
      .sort((a, b) => {
        if (a === b) return 0;
        return a.label < b.label ? -1 : 1;
      });

    this.moduleParts = [];
    this.UPDATE_MODULE(this.moduleParts);

    // Ensures results aren't displayed on mount
    this.SET_SHOW_RESULTS(false);

    if (this.$route.query.make_id) {
      const make_id = +this.$route.query.make_id;
      this.make = this.makes.find((make) => make.id === make_id) || this.make;
    }
  },

  computed: {
    ...mapGetters("module", ["showResults", "storedMatches"]),
    noImageURL() {
      return `${process.env.NO_IMAGE_FOUND_URL}`;
    },
  },

  methods: {
    ...mapMutations("module", ["SET_SHOW_RESULTS", "UPDATE_MODULE"]),
    getEngineProp: async function (propName) {
      const headers = {
        "X-Authorization":
          process.env.TRUCK_PARTS_LOOKUP_SERVICE_API_KEY,
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
          process.env.TRUCK_PARTS_LOOKUP_SERVICE_API_KEY,
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
          // if an part's id matches another part's parent_module_id
          if (mergedArray[i].id === mergedArray[j].parent_module_id) {
            // add child to parent part
            parent["children"].push(mergedArray[j]);
          }
        }
      }

      // Return new array with children nested within parents
      return mergedArray.filter((m) => m.parent_module_id === 0);
    },
  },

  watch: {
    make: async function () {
      this.moduleImage = "";
      this.model = "";
      this.moduleParts = [];
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

        if (this.$route.query.model_id) {
          const model_id = +this.$route.query.model_id;
          this.model =
            this.models.find((model) => model.id === model_id) || this.model;
        }

        if (this.models.length === 1) {
          return (this.model = this.models[0]);
        }
      }
    },

    model: async function () {
      this.moduleImage = "";
      this.category = "";

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

        if (this.$route.query.module_category_id) {
          const module_category_id = +this.$route.query.module_category_id;
          this.category =
            this.categories.find(
              (category) => category.id === module_category_id
            ) || this.category;
        }

        if (this.categories.length === 1) {
          return (this.category = this.categories[0]);
        }

        if (this.categories.length === 0 && this.model) {
          this.category = `No categories found`;
        }
      }
    },

    category: async function () {
      this.moduleImage = "";
      this.variant = "";
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

          if (this.$route.query.variant_id) {
            const variant_id = +this.$route.query.variant_id;
            this.variant =
              this.variants.find((variant) => variant.id === variant_id) ||
              this.variant;
          }

          if (this.variants.length === 1) {
            return (this.variant = this.variants[0]);
          }
        }
      }
    },
    variant: async function () {
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
              return -1;
            } else if (b.reference_number === null) {
              return 1;
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
};
</script>
