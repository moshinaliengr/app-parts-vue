<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ vehicle.vin }}</div>
      <div class="text-h6">
        {{ vehicle.year }} {{ vehicle.manufacturer }} {{ vehicle.model }}
      </div>

      <q-list bordered separator>
        <q-item v-for="part in searchResults" :key="part.ref_part_id">
          <q-item-section class="q-mt-sm">
            <KeyValueText keyName="Part Number" :value="part.part_no" />
            <KeyValueText keyName="Category" :value="part.category" />

            <q-item-label class="q-ml-xs" caption v-if="part.notes">
              {{ part.notes }}
            </q-item-label>
            <q-item-label>
              <ButtonStandard
                @click.native="setPart(part.ref_part_id)"
                :full="false"
                label="View Part"
                class="q-px-xs"
              />
              <ThumbnailImages
                :PartImage="part.part_id"
                size="sm"
                class="absolute-center-end"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import KeyValueText from "./common/KeyValueText.vue";
import ButtonStandard from "./common/ButtonStandard.vue";
import { getPart } from "src/services/TruckPartsCross.js";
import ThumbnailImages from "./partsCross/ThumbnailImages.vue";

export default {
  name: "SearchResultsCard",
  components: { ButtonStandard, KeyValueText, ThumbnailImages },
  props: {
    vehicle: {
      type: Object,
      required: true,
    },
    searchResults: {
      type: Array,
      required: true,
    },
  },
  computed: {
    modalTitle() {
      return `${this.selectedPart.manufacturer_name} ${this.selectedPart.number}`;
    },
  },
  methods: {
    async setPart(id) {
      // Uses "ref_part_id" to get part info from TPC api
      // const url = `https://api-truckpartscross.com/api/v1/part/${id}`;
      const response = await getPart({ id });

      // Gets data from TPC response
      let part = response.data;
      // Removes unwanted paragraph tags that are included in response
      part.notes = part.notes.replace("<p>", "").replace("</p>", "");

      this.$emit("part-selected", part);
    },
  },
};
</script>
