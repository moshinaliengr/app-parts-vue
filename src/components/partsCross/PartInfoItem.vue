<template>
  <q-item-section class="row">
    <div>
      <KeyValueText keyName="Part Number" :value="part.number" />

      <KeyValueText keyName="Manufacturer" :value="part.manufacturer_name" />

      <q-item-label caption class="q-ml-xs">
        {{ part.name }}
      </q-item-label>

      <q-item-label style="margin-top: 8px">
        <ButtonStandard
          label="View Part"
          @click.native="showPartInfo"
          tooltip="View Part Details"
          :full="false"
          size="sm"
          class="q-px-sm q-mt-md"
        />
      </q-item-label>
    </div>
    <ThumbnailImages
      :PartImage="part.image_url"
      size="sm"
      class="absolute-center-end"
    />
  </q-item-section>
</template>

<script>
import ButtonStandard from "../common/ButtonStandard";
import KeyValueText from "../common/KeyValueText.vue";
import PartInfo from "../PartInfo.vue";
import ThumbnailImages from "./ThumbnailImages.vue";

export default {
  name: "PartInfoItem",

  components: {
    ButtonStandard,
    KeyValueText,
    ThumbnailImages,
  },

  props: {
    part: {
      type: Object,
      required: true,
    },
  },

  methods: {
    showPartInfo() {
      console.log(this.part);
      this.$q.dialog({
        component: PartInfo,
        partProp: this.part,
      });
    },
  },
};
</script>
