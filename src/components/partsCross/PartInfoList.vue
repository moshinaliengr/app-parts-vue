<template>
  <q-list bordered separator>
    <q-item v-for="part in parts" :key="part.id" class="q-px-sm">
      <PartInfoItem :part="part" />
    </q-item>
  </q-list>
</template>

<script>
import PartInfoItem from "./PartInfoItem.vue";

export default {
  name: "PartInfoList",

  components: { PartInfoItem },

  props: {
    parts: {
      type: Array,
      required: true,
    },
  },
};
</script>
