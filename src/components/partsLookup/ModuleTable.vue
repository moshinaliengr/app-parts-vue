<template>
  <q-card-section>
    <q-list bordered separator v-if="showResults" class="q-mt-md">
      <q-item v-for="(part, p) in storedMatches" :key="p">
        <!-- If not a child module -->
        <q-item-section class="q-mt-sm" v-if="part.parent_module_id === 0">
          <KeyValueText
            v-if="part.reference_number"
            keyName="Reference Number"
            :value="String(part.reference_number)"
          />

          <KeyValueText keyName="Part Number" :value="part.part_number" />

          <KeyValueText
            v-if="part.quantity"
            keyName="Quantity"
            :value="String(part.quantity)"
          />

          <KeyValueText keyName="Description" :value="part.name" />

          <KeyValueText v-if="part.notes" keyName="Notes" :value="part.notes" />

          <q-item-label class="row">
            <ButtonStandard
              label="View Part"
              @click.native="showMatchingParts(part.part_number)"
              tooltip="View Part Details"
              :full="false"
              class="q-px-sm q-mb-sm"
            />

            <ButtonStandard
              v-if="part.children.length >= 1"
              :label="part.showChildren ? 'Hide Components' : 'Show Components'"
              @click.native="part.showChildren = !part.showChildren"
              :full="false"
              class="q-px-sm q-mb-sm q-mx-md"
            />
            <ThumbnailImages
              :PartImage="part.image_url"
              size="xs"
              class="q-pt-xs"
            />
          </q-item-label>

          <q-list dense style="max-width: 600px" v-if="part.showChildren">
            <q-item
              dense
              v-for="(child, c) in part.children"
              :key="c"
              class="q-mx-md"
            >
              <q-item-section class="q-mt-sm">
                <KeyValueText
                  v-if="child.reference_number"
                  keyName="Reference Number"
                  :value="child.reference_number"
                />

                <KeyValueText
                  v-if="child.part_number"
                  keyName="Part Number"
                  :value="child.part_number"
                />

                <KeyValueText
                  v-if="child.quantity"
                  keyName="Quantity"
                  :value="child.quantity"
                />

                <KeyValueText
                  v-if="child.name"
                  keyName="Description"
                  :value="child.name"
                />

                <KeyValueText
                  v-if="child.notes"
                  keyName="Notes"
                  :value="child.notes"
                />

                <q-item-label>
                  <ButtonStandard
                    label="View Part Details"
                    @click.native="showMatchingParts(child.part_number)"
                    :full="false"
                    class="q-px-sm"
                  />
                  <ThumbnailImages
                    :PartImage="part - image"
                    size="xs"
                    class="q-pt-xs"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="partModal" full-height full-width>
      <PartSearch :search="partNumber" />
    </q-dialog>
  </q-card-section>
</template>

<script>
// Libraries & Features
import { mapGetters } from "vuex";

// Components
import ButtonStandard from "../common/ButtonStandard";
import KeyValueText from "../common/KeyValueText";
import PartSearch from "../partsLookup/PartSearch";
import ThumbnailImages from "../partsCross/ThumbnailImages.vue";

export default {
  name: `ModuleTable`,

  components: {
    ButtonStandard,
    KeyValueText,
    PartSearch,
    ThumbnailImages,
  },

  computed: {
    ...mapGetters("module", ["showResults", "storedMatches"]),
  },

  data: () => ({
    partNumber: "",
    partModal: false,
  }),

  methods: {
    showMatchingParts(partNum) {
      // Assigns part number for search
      this.partNumber = partNum;

      // Opens modal
      this.partModal = true;

      // Show Part Selector in modal
      // this.partSelector = true;

      // Keeps part details closed
      // this.partDetails = false;
    },

    showPartDetails() {
      // hides PartSearch
      this.partSelector = false;

      // Shows PartInfo
      this.partDetails = true;
    },
  },
};
</script>

<style lang="scss">
.q-table > thead > tr {
  background-color: inherit;
}

.kit-parts > .q-expansion-item__container > .q-item {
  padding: 0px !important;
}
</style>
