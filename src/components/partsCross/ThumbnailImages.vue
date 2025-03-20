<template>
  <q-img
    v-if="PartImage"
    :src="PartImage"
    style="max-height: 300px; max-width: 150px"
    img-class="PartImage"
    class="fixed-center, absolute-right"
    contain
  />

  <div v-else>
    <q-img
      img-class="no-image"
      :src="'/no-image.png'"
      class="fixed-center, absolute-right"
      style="max-height: 300px; max-width: 150px"
      contain
    />
  </div>
</template>

<script>
export default {
  name: "ThumbnailImages",
  props: {
    PartImage: {
      required: true,
    },
  },
};
</script>
