<template>
  <q-card-section
    v-if="loadingProp"
    :class="`loading-overlay flex flex-center z-top ${isFull} ${classExtend}`"
    :style="`background: rgba(0, 0, 0, 0.${bgOpacity}) !important; ${styleExtend}`"
    transition-show="fade-in"
    transition-hide="fade-out"
  >
    <q-spinner-gears :color="spinnerColor" :size="spinnerSize" />
  </q-card-section>
</template>

<script>
export default {
  name: "LoadingOverlay",

  // adds class `absolute-full` to overlay if true
  computed: {
    isFull() {
      if (this.full) return `absolute-full`;
      else return ``;
    },
  },

  props: {
    // How  opaque scrim is
    bgOpacity: {
      type: String,
      default: `4`,
    },

    // Add more classes
    classExtend: {
      type: String,
      default: ``,
    },

    // Add more styles
    styleExtend: {
      type: String,
      default: ``,
    },

    //   Whether or not overlay is absolute 0 on every side
    full: {
      type: Boolean,
      default: true,
    },

    // Data property to bind to in other components/pages
    loadingProp: {
      type: Boolean,
      required: true,
    },

    // Color of spinner
    spinnerColor: {
      type: String,
      default: `primary`,
    },

    // Size of spinner
    spinnerSize: {
      type: String,
      default: "3rem",
    },
  },
};
</script>
