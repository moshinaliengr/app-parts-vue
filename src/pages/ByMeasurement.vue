<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="text-h6 card-title">By Measurement</q-card-section>

      <q-carousel
        swipeable
        animated
        v-model="slide"
        ref="carousel"
        control-type="regular"
        control-color="primary"
        class="q-mb-md"
        :thumbnails="baseComponent.images.length > 1"
        v-if="baseComponent.images.length"
        infinite
      >
        <q-carousel-slide
          v-for="(img, i) in baseComponent.images"
          :key="i"
          :name="i"
          :img-src="img.url"
          class="no-padding"
        />

        <template v-slot:control>
          <q-carousel-control position="bottom-right">
            <ButtonRound
              color="primary"
              icon="zoom_in"
              textColor="#424242"
              tooltip="Zoom In"
              @click.native="imageModal = !imageModal"
            />
          </q-carousel-control>
        </template>
      </q-carousel>

      <q-card-section class="no-padding">
        <q-select
          label="Component"
          v-model="baseComponent"
          :options="componentList"
          class="q-mb-sm"
          outlined
          dense
        />

        <div v-for="param in componentParams" :key="param.id">
          <q-select
            :label="param.name"
            :options="param.filteredOptions.sort((a, b) => (a > b ? 1 : -1))"
            v-model="param.model"
            class="q-mb-sm"
            outlined
            dense
          />
        </div>

        <div v-if="filteredParts.length" class="row items-center no-wrap">
          <ButtonStandard
            label="Reset"
            @click.native="resetSearch()"
            iconLeft="refresh"
            :full="false"
            tooltip="Reset Options"
            class="q-px-sm"
            size="sm"
          />

          <q-space />

          <span class="text-weight-medium text-right q-my-xs q-mx-sm">
            {{ `${filteredParts.length} result(s) found` }}
          </span>
        </div>
      </q-card-section>

      <q-card-section class="no-padding">
        <q-list v-if="filteredParts.length" bordered class="q-mt-sm">
          <q-item v-for="(part, p) in filteredParts" :key="p" class="q-pa-sm">
            <q-item-section>
              <KeyValueText keyName="Part Number" :value="part.number" />
              <KeyValueText keyName="Description" :value="part.name" />

              <KeyValueText
                v-if="part.notes"
                keyName="Notes"
                :value="part.notes"
              />

              <KeyValueText
                v-if="part.accessory"
                keyName="Accessory Part"
                :value="part.accessory.number"
              />
              <ThumbnailImages
                :PartImage="part.image_url"
                size="sm"
                class="absolute-center-end"
              />

              <q-item-label class="">
                <ButtonStandard
                  label="View Part Details"
                  @click.native="updateSelectedPart(part.id)"
                  :full="false"
                  class="q-px-sm"
                />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </ContentCard>

    <q-dialog v-model="imageModal">
      <ModalContent :title="baseComponent.name" :fullHeight="false">
        <q-carousel
          swipeable
          animated
          v-model="slide"
          padding
          class="text-center q-mb-md"
          :controls="baseComponent.images"
          control-type="unelevated"
          control-color="primary"
          height="auto"
        >
          <q-carousel-slide
            class="no-padding"
            v-for="(img, i) in baseComponent.images"
            color="white"
            :key="i"
            :name="i"
          >
            <img :src="img.url" class="q-mx-auto" style="max-height: 75vh" />
          </q-carousel-slide>
        </q-carousel>
      </ModalContent>
    </q-dialog>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import ButtonRound from "../components/common/ButtonRound";
import ButtonStandard from "../components/common/ButtonStandard";
import KeyValueText from "../components/common/KeyValueText";
import ModalContent from "../components/common/ModalContent";
import PartInfo from "../components/PartInfo";
import ThumbnailImages from "src/components/partsCross/ThumbnailImages.vue";

export default {
  name: "ByMeasurement",

  components: {
    ContentCard,
    ButtonRound,
    ButtonStandard,
    KeyValueText,
    ModalContent,
    ThumbnailImages,
  },

  mounted: async function () {
    // Get initail component list
    const components = await this.getComponentData(`component`);

    // Sort alphabetically
    this.componentList = components.sort((a, b) => (a.name > b.name ? 1 : -1));
  },

  computed: {
    // All params of the selected component
    componentParams() {
      return this.selectedComponent.params;
    },

    // All parts of the selected component
    componentParts() {
      return this.selectedComponent.parts;
    },

    // Current Value of all selected params
    selectedParams() {
      // Get value of all param selects
      const allParams = this.selectedComponent.params.map((part) => {
        return { slug: part.slug, value: part.model };
      });

      // Filter out all undefined options
      return allParams.filter((p) => !!p.value);
    },
  },

  data: () => ({
    baseURL: process.env.TRUCK_PARTS_CROSS_SERVICE_BASE_URL,
    baseComponent: { name: "", label: "", images: [] },
    componentList: [],
    fullscreen: false,
    filteredParts: [],
    headers: {
      "X-Authorization":
        "vR9de51iv3OQAO2gD1z03h0Ac7dQW0RoyX3LDrW2yLBw4L9761FrChOO25qk",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    imageModal: false,
    parts: [],
    selectedComponent: { id: ``, params: [], parts: [] },
    slide: 0,
  }),

  methods: {
    // Get component data from API
    getComponentData: async function (urlSlug) {
      const url = `${this.baseURL}/api/${urlSlug}`;

      const propResponse = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });

      const retrievedProps = await propResponse.json();

      // If getting initial components, add label prop to data object for select labels
      if (urlSlug === "component") {
        return retrievedProps.data.map((prop) => {
          return { ...prop, label: prop.name };
        });

        // Else return standard data
      } else {
        return retrievedProps;
      }
    },

    filterDropdownValues() {
      // Go through all selected parameters
      for (let param of this.componentParams) {
        let newArr = [];

        // look at each part in the filtered parts
        for (let part of this.filteredParts) {
          for (const [key, value] of Object.entries(part.params)) {
            if (key === param.slug) newArr.push(value);
          }

          // TODO: Test if this is used (looks unused) - Delete if not
          const partParamValue = part.params[`${param.slug}`];
        }

        param.filteredOptions = [...new Set(newArr)];

        // If only one option is available for selection
        const singleOption =
          param.filteredOptions.length === 1 &&
          param.model !== param.filteredOptions[0];

        // select single option
        if (singleOption) param.model = param.filteredOptions[0];
      }
    },

    // Filters parts when a dropdown is changed
    filterPartsBySelection() {
      // if not params selected, do nothing
      if (!this.selectedParams.length) return;

      //
      const isMatchingPart = (part) => {
        let matchFound = true;
        let requirement = {};

        // Find matching parts
        for (let param in this.selectedParams) {
          requirement = this.selectedParams[param];

          // Determines whether or not a match is found
          matchFound = part.params[requirement.slug] === requirement.value;

          // End loop if a requirement is not met
          if (!matchFound) break;
        }

        return matchFound;
      };

      // Set Filtered results
      this.filteredParts = this.componentParts.filter(isMatchingPart);
    },

    // gets part details and sets selected part
    async updateSelectedPart(id) {
      // Get part info from api
      const part = await this.getComponentData(`v1/part/${id}`);

      this.$q.dialog({
        component: PartInfo,
        partProp: part.data,
      });
    },

    // Resets dropdown options after being filtered
    resetSearch() {
      for (let param of this.componentParams) {
        // Delete model value to not effect filtering
        delete param.model;

        // reset options to their initial state
        param.filteredOptions = [...param.options];
      }

      // Clears filtered parts
      this.filteredParts = [];
    },
  },

  watch: {
    baseComponent: async function () {
      // Get data for selected component from API
      const requestedComponent = await this.getComponentData(
        `component/${this.baseComponent.id}?all_manufacturers=true`
      );

      // Set equal to retrieved data
      this.selectedComponent = requestedComponent.data;
    },

    // Update dropdowns when selected component changes
    selectedComponent: function () {
      for (let param of this.componentParams) {
        const options = [];

        for (let part of this.componentParts) {
          for (const [key, value] of Object.entries(part.params)) {
            if (key === param.slug) options.push(value);
          }
        }

        // Add array of potential options, removing duplicates
        param.options = [...new Set(options)];

        // Create duplicate array for filtering
        param.filteredOptions = [...param.options];
      }

      // Clear FilteredParts
      this.filteredParts = [];
      this.slide = 0;
    },

    componentParams: function () {
      // If only 1 option, auto-select it
      for (let param of this.componentParams) {
        if (param.filteredOptions.length === 1) {
          param.model = param.filteredOptions[0];
        }
      }
    },

    // When selected parameters change
    selectedParams: function () {
      // Filter parts by selected parameters
      this.filterPartsBySelection();

      // Do nothing if no parameters selected
      if (!this.selectedParams.length) return;

      // Filter dropdown options
      this.filterDropdownValues();
    },
  },
};
</script>

<style lang="scss">
.q-carousel__slide {
  background-size: contain;
  background-repeat: no-repeat;
}

.q-carousel__navigation-inner {
  // background-color: pink;
  justify-content: flex-start;
  img {
    background-color: white;
    // border-color: initial;
    border: 2px solid;

    .q-carousel__thumbnail {
      background-color: white;
    }

    &.q-carousel__thumbnail--active {
      border-color: $primary;
    }
  }
}

// .q-carousel__control.q-carousel__navigation.no-wrap.absolute.flex.q-carousel__navigation--thumbnails.q-carousel__navigation--bottom
</style>
