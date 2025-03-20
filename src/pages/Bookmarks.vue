<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="text-h6 card-title q-pb-none">
        My Bookmarks
      </q-card-section>

      <!-- Bookmarks -->
      <q-card-section>
        <q-list :bordered="parts.length ? true : false" separator>
          <!-- Loading Spinner -->
          <LoadingOverlay :loadingProp="!favoritePartsLoaded" />

          <!-- If no bookmarks -->
          <q-item
            v-if="parts.length === 0"
            class="flex flex-center"
            style="min-height: 356px"
          >
            You currently have 0 bookmarks saved.
          </q-item>

          <q-item v-for="part in parts" :key="part.id">
            <q-item-section class="q-mt-sm">
              <KeyValueText keyName="Part Number" :value="part.number" />

              <KeyValueText
                keyName="Manufacturer"
                :value="part.manufacturer_name"
              />

              <KeyValueText keyName="Description" :value="part.name" />

              <q-item-label>
                <ButtonStandard
                  label="View Part"
                  @click.native="viewPart(part)"
                  tooltip="View Part Details"
                  class="q-px-sm q-mb-sm"
                  :full="false"
                />
              </q-item-label>
              <ThumbnailImages
                :PartImage="PartImage"
                size="sm"
                class="q-pt-xl"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </ContentCard>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ButtonStandard from "../components/common/ButtonStandard";
import ContentCard from "../components/common/ContentCard";
import KeyValueText from "../components/common/KeyValueText";
import LoadingOverlay from "../components/common/LoadingOverlay";
import PartInfo from "../components/PartInfo";
import ThumbnailImages from "src/components/partsCross/ThumbnailImages.vue";

export default {
  name: "PartsCross",

  components: {
    ButtonStandard,
    ContentCard,
    KeyValueText,
    LoadingOverlay,
    ThumbnailImages,
  },

  computed: {
    ...mapState("favoriteparts", {
      favoritePartsLoaded: "loaded",
      favoriteParts: "items",
    }),
    parts() {
      return this.favoriteParts.map((favoritePart) => favoritePart.part);
    },
  },

  mounted() {
    this.ensureFavoriteParts();
  },

  methods: {
    ...mapActions("favoriteparts", {
      ensureFavoriteParts: "ensureItems",
    }),
    viewPart(part) {
      this.$q.dialog({
        component: PartInfo,
        partProp: part,
      });
    },
  },
};
</script>
