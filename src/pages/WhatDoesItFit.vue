<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="text-h6 card-title q-pb-none">
        What Does It Fit?
      </q-card-section>

      <q-card-section class="q-py-none">
        <q-input
          dense
          outlined
          clearable
          v-model="number"
          clear-icon="close"
          class="number-input"
          label="Enter A Part Number"
          @keyup.enter="searchTPCPartsClick"
          bottom-slots
          :hide-bottom-space="!isHintVisible"
        >
          <template v-slot:hint>
            <div
              v-if="isHintVisible"
              :class="{ 'text-primary': isHintHighlighted }"
            >
              Enter {{ minQuery }} characters to search for a part. Please
              remove any # or % symbols before searching.
            </div>
          </template>
          <template v-slot:append>
            <q-btn
              unelevated
              icon="search"
              color="primary"
              style="height: 100%"
              text-color="secondary"
              :disable="!number || tpcPartsLoading"
              @click="searchTPCPartsClick"
            >
              <q-tooltip>Search by part number</q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </q-card-section>

      <template v-if="!tpcPart">
        <q-card-section v-if="tpcPartsLoading" class="q-pa-sm">
          <div class="relative-position">
            <LoadingOverlay :loadingProp="true" />
            <q-item class="flex flex-center" style="min-height: 356px" />
          </div>
        </q-card-section>

        <q-card-section v-if="tpcParts && !tpcPartsLoading && tpcParts.length">
          <q-list bordered separator>
            <q-item
              v-for="tpcPart in tpcParts"
              :key="tpcPart.id"
              class="q-px-sm"
            >
              <q-item-section>
                <KeyValueText keyName="Part Number" :value="tpcPart.number" />
                <KeyValueText
                  keyName="Manufacturer"
                  :value="tpcPart.manufacturer_name"
                />
                <q-item-label class="q-ml-xs" caption>
                  {{ tpcPart.name }}
                </q-item-label>
                <q-item-label style="margin-top: 8px">
                  <ButtonStandard
                    size="sm"
                    :full="false"
                    label="See What Fits"
                    class="q-px-sm q-mt-md"
                    tooltip="View all parts cross matches for this part to find out what fits."
                    @click.native="searchTPLModulesClick(tpcPart)"
                  />
                  <ThumbnailImages
                    :PartImage="tpcPart.image_url"
                    size="sm"
                    class="absolute-center-end"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section
          v-if="
            tpcParts &&
            !tpcPartsLoading &&
            tpcParts.length &&
            tpcPartsTotal > tpcPartsPerPage
          "
          class="q-pt-none"
        >
          <q-pagination
            v-if="isDesktop"
            dense
            color="primary"
            text-color="black"
            icon-first="skip_previous"
            icon-last="skip_next"
            v-model="tpcPartsPage"
            :max-pages="5"
            :max="tpcPartsPagesNumber"
            :direction-links="true"
            :boundary-links="true"
            :boundary-numbers="true"
            class="flex flex-center q-px-xs"
            @input="searchTPCPartsWrapper"
          />
          <q-pagination
            v-else
            dense
            input
            color="primary"
            text-color="black"
            icon-last="skip_next"
            icon-first="skip_previous"
            v-model="tpcPartsPage"
            :max="tpcPartsPagesNumber"
            input-class="text-bold text-primary"
            class="flex flex-center q-px-xs"
            @input="searchTPCPartsWrapper"
          />
        </q-card-section>
        <q-card-section
          v-if="tpcParts && !tpcPartsLoading && !tpcParts.length"
          class="flex flex-center text-negative"
        >
          <p class="no-margin text-center">
            We're sorry, but no parts matching your search were found.
          </p>
        </q-card-section>
      </template>
      <template v-else>
        <q-card-section v-if="tplModulesLoading" class="q-pa-sm">
          <div class="relative-position">
            <LoadingOverlay :loadingProp="true" />
            <q-item class="flex flex-center" style="min-height: 356px" />
          </div>
        </q-card-section>
        <q-card-section
          v-if="tplModules && !tplModulesLoading && tplModules.length"
        >
          <q-list bordered separator>
            <q-item
              v-for="tplModule in tplModules"
              :key="tplModule.id"
              class="q-px-sm"
            >
              <q-item-section>
                <KeyValueText
                  keyName="Part Number Matched"
                  :value="`${tplModule.part_number} / ${tplModule.name}`"
                />
                <div class="flex items-center">
                  <KeyValueText
                    keyName="Make"
                    :value="
                      makesByID[tplModule.make_id]
                        ? makesByID[tplModule.make_id].name
                        : '-'
                    "
                  />
                  <div class="q-mt-none">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;</div>
                  <KeyValueText
                    keyName="Model"
                    :value="
                      modelsByID[tplModule.model_id]
                        ? modelsByID[tplModule.model_id].name
                        : '-'
                    "
                  />
                </div>
                <div class="flex items-center">
                  <KeyValueText
                    keyName="Category"
                    :value="
                      categoriesByID[tplModule.module_category_id]
                        ? categoriesByID[tplModule.module_category_id].name
                        : '-'
                    "
                  />
                  <div class="q-mt-none">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;</div>
                  <KeyValueText
                    keyName="Sub-Category"
                    :value="
                      variantsByID[tplModule.variant_id]
                        ? variantsByID[tplModule.variant_id].name
                        : '-'
                    "
                  />
                </div>
                <q-item-label style="margin-top: 8px">
                  <ButtonStandard
                    size="sm"
                    :full="false"
                    label="View Part"
                    class="q-px-sm q-mt-md"
                    tooltip="View Part Details"
                    @click.native="gotoTPLModuleClick(tplModule)"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section
          v-if="
            tplModules &&
            !tplModulesLoading &&
            tplModules.length &&
            tplModulesTotal > tplModulesPerPage
          "
          class="q-pt-none"
        >
          <q-pagination
            v-if="isDesktop"
            dense
            color="primary"
            text-color="black"
            icon-first="skip_previous"
            icon-last="skip_next"
            v-model="tplModulesPage"
            :max-pages="5"
            :max="tplModulesPagesNumber"
            :direction-links="true"
            :boundary-links="true"
            :boundary-numbers="true"
            class="flex flex-center q-px-xs"
            @input="searchTPLModulesWrapper"
          />
          <q-pagination
            v-else
            dense
            input
            color="primary"
            text-color="black"
            icon-last="skip_next"
            icon-first="skip_previous"
            v-model="tplModulesPage"
            :max="tplModulesPagesNumber"
            input-class="text-bold text-primary"
            class="flex flex-center q-px-xs"
            @input="searchTPLModulesWrapper"
          />
        </q-card-section>
        <q-card-section
          v-if="tplModules && !tplModulesLoading && !tplModules.length"
          class="flex flex-center text-negative"
        >
          <p class="no-margin text-center">
            We're sorry, but no modules matching your search were found.
          </p>
        </q-card-section>
      </template>
    </ContentCard>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import KeyValueText from "../components/common/KeyValueText";
import ButtonStandard from "../components/common/ButtonStandard";
import LoadingOverlay from "../components/common/LoadingOverlay";
import {
  searchParts as searchTPCParts,
  getPart as getTPCPart,
} from "../services/TruckPartsCross";
import { searchModules as searchTPLModules } from "../services/TruckPartsLookup";
import { Notify } from "../mixins/Notify.js";
import ThumbnailImages from "src/components/partsCross/ThumbnailImages.vue";

export default {
  name: "WhatDoesItFit",
  components: {
    ContentCard,
    KeyValueText,
    ButtonStandard,
    LoadingOverlay,
    ThumbnailImages,
  },
  mixins: [Notify],
  data() {
    return {
      number: "",
      tpcPart: null,
      tpcParts: null,
      tpcPartsPage: 1,
      tpcPartsTotal: 0,
      tpcPartsPerPage: 10,
      tpcPartsLoading: false,
      tplModule: null,
      tplModules: null,
      tplModulesPage: 1,
      tplModulesTotal: 0,
      tplModulesPerPage: 10,
      tplModulesLoading: false,
      makes: [],
      models: [],
      categories: [],
      variants: [],
      minQuery: 3,
      isHintVisible: true,
      isHintHighlighted: false,
    };
  },
  computed: {
    isDesktop() {
      return !!this.$q.platform.is.desktop;
    },
    tpcPartsPagesNumber() {
      return Math.ceil(this.tpcPartsTotal / this.tpcPartsPerPage);
    },
    tplModulesPagesNumber() {
      return Math.ceil(this.tplModulesTotal / this.tplModulesPerPage);
    },
    makesByID() {
      return this.makes.reduce((acc, make) => {
        acc[make.id] = make;
        return acc;
      }, {});
    },
    modelsByID() {
      return this.models.reduce((acc, model) => {
        acc[model.id] = model;
        return acc;
      }, {});
    },
    categoriesByID() {
      return this.categories.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {});
    },
    variantsByID() {
      return this.variants.reduce((acc, variant) => {
        acc[variant.id] = variant;
        return acc;
      }, {});
    },
  },
  methods: {
    searchTPCPartsClick() {
      if (!this.isValidInput()) {
        this.notify(
          "You must provide a part number at least 3 characters long",
          "negative"
        );
        return;
      }

      if (this.hasSpecialCharacters()) {
        this.notify(
          "Sorry, we can't search with # or % in the part number. Just remove that character and try again.",
          "negative"
        );
        return;
      }
      this.tpcPart = null;
      this.tpcPartsPage = 1;
      this.searchTPCPartsWrapper();
    },
    async searchTPCPartsWrapper() {
      this.tpcPartsLoading = true;

      this.tpcParts = [];
      this.tpcPartsTotal = 0;

      const resp = await searchTPCParts({
        search: this.number,
        page: this.tpcPartsPage,
        perPage: this.tpcPartsPerPage,
      });

      if (resp?.data) {
        this.tpcParts = resp.data;
        this.tpcPartsTotal = resp.meta.found;
      }

      this.tpcPartsLoading = false;
    },
    searchTPLModulesClick(tpcPart) {
      this.tpcPart = tpcPart;
      this.tplModulesPage = 1;
      this.searchTPLModulesWrapper();
    },
    async searchTPLModulesWrapper() {
      this.tplModulesLoading = true;

      this.tplModules = [];
      this.tplModulesTotal = 0;

      const resp = await getTPCPart({
        id: this.tpcPart.id,
      });

      const equivalences = resp.data?.equivalences || [];

      const resp2 = await searchTPLModules({
        search_target: "part_number",
        search: [this.tpcPart]
          .concat(equivalences)
          .map((part) => part.number)
          .join("|"),
        fields: [
          "name",
          "part_number",
          "make_id",
          "model_id",
          "module_category_id",
          "variant_id",
        ],
        auxiliaries: ["make", "model", "module_category", "variant"],
        page: this.tplModulesPage,
        perPage: this.tplModulesPerPage,
      });

      if (resp2?.data) {
        this.tplModules = resp2.data;
        this.tplModulesTotal = resp2.meta.found;
        this.makes = resp2.meta.updates.make.data;
        this.models = resp2.meta.updates.model.data;
        this.categories = resp2.meta.updates.module_category.data;
        this.variants = resp2.meta.updates.variant.data;
      }

      this.tplModulesLoading = false;
    },
    gotoTPLModuleClick(tplModule) {
      this.$router.push(
        `exploded-views?make_id=${tplModule.make_id}&model_id=${tplModule.model_id}&module_category_id=${tplModule.module_category_id}&variant_id=${tplModule.variant_id}`
      );
    },
    isValidInput() {
      return this.number.length >= this.minQuery;
    },
    hasSpecialCharacters() {
      const specialChars = /[%#]/;
      return specialChars.test(this.number);
    },
  },
};
</script>

<style lang="scss">
.number-input {
  .q-field__control {
    padding-right: 0;
  }

  .q-field__append {
    order: 2;

    &:last-child {
      order: 1;
    }
  }
}
</style>
