<template>
  <q-card class="content-card flex flex-center">
    <section
      :class="`content-card-inner ${innerClass ? innerClass : ''}`"
      :style="innerStyle"
    >
      <slot />
    </section>
  </q-card>
</template>

<script>
export default {
  name: "ContentCard",

  props: {
    innerClass: String,
    innerStyle: String,
    title: String
  }
};
</script>

<style lang="scss">
.q-card.content-card {
  margin: 1rem;
  max-width: 768px;
  padding: 0.5rem;
  width: 100%;

  .content-card-inner {
    max-width: 600px;
    // padding: 1rem;
    width: 90%;

    .q-card__section--vert {
      width: 100%;
    }
  }

  .q-card__section--vert {
    padding: 0.5rem;

    .card-title {
      margin: 0;
      text-align: left;
    }
  }
}

// Tablet/Mobile specific
@media only screen and (max-width: 768px) {
  .q-card.content-card {
    margin: 0.5rem;
    // padding: 0.5rem;

    .content-card-inner {
      // padding: 0.5rem;
      width: 100%;
    }
  }
}

// Prevents width limit on modals with content card within
.q-dialog__inner > .q-card.content-card {
  width: 100% !important;
}
</style>
