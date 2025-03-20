<template>
  <q-card class="no-scroll max-width-900" style="max-width: 900px">
    <!-- Modal Header -->
    <q-toolbar class="row items-center justify-between q-pl-sm q-pr-none">
      <span class="text-h6 q-ml-sm ellipsis">
        {{ title }}
      </span>

      <button-round
        v-close-popup
        icon="close"
        tooltip="Close Pop-up"
        :flat="true"
        v-if="closeBtnShow"
      />
    </q-toolbar>

    <q-separator />

    <!-- Modal Content -->
    <q-card-section
      class="scroll lightbox-inner no-padding"
      :style="fullHeight ? `height: 91vh` : `height:100%`"
    >
      <slot />

      <!-- Spacer to prevent disappearing content -->
      <q-card-section></q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import ButtonRound from "../common/ButtonRound";

export default {
  name: "ModalContent",

  components: { ButtonRound },

  props: {
    fullHeight: {
      type: Boolean,
      default: true
    },
    closeBtnShow: {
      type: Boolean,
      default: true
    },

    // The Title appearing at the top of the modal
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 600px) {
  .max-width-900 {
    width: 75%;
    max-width: 900px !important;
  }
}
</style>
