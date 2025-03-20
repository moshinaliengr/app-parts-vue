<template>
  <q-btn
    class="q-ma-xs"
    :color="color"
    :icon="icon"
    :type="type"
    :flat="flat"
    :padding="padding"
    :size="size"
    :text-color="textColor"
    v-ripple
    round
    dark
  >
    <q-tooltip v-if="tooltip.length">
      {{ tooltip }}
    </q-tooltip>
  </q-btn>
</template>

<script>
export default {
  name: "ButtonRound",
  props: {
    color: { type: String },
    flat: Boolean,
    icon: String,
    padding: String,
    size: String,
    textColor: { type: String },
    tooltip: { type: String, default: "" },
    type: String
  }
};
</script>
