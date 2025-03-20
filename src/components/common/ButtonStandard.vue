<template>
  <q-btn
    :color="color == null ? `primary` : color"
    :disable="disable"
    :elevated="elevated"
    :flat="flat"
    :full-width="full"
    :icon="iconLeft"
    :icon-right="iconRight"
    :label="label"
    :loading="loading"
    :no-caps="caps"
    :outline="outline"
    :size="size"
    :text-color="textColor == null && !flat ? `secondary` : textColor"
    :to="to"
    :type="type"
    :class="
      full
        ? `text-bold full-width ${classExtend}`
        : `text-bold q-ma-xs ${classExtend}`
    "
    :style="
      size == 'sm'
        ? `font-size:12px !important; margin: 0;${styleExtend}`
        : `font-size:inherit;${styleExtend}`
    "
    :dense="dense"
  >
    <q-tooltip v-if="tooltip.length">
      {{ tooltip }}
    </q-tooltip>
  </q-btn>
</template>

<script>
export default {
  name: "ButtonStandard",

  props: {
    // Capitalize letters?
    caps: { type: Boolean, default: true },
    // Additional classes?
    classExtend: { type: String, default: `` },
    // Background color (text/outline color if flat or outlined) - Defaults to primary
    color: String,
    // Dense? - reduces size
    dense: { type: Boolean, default: true },
    // Disabled? - makes unclickable
    disable: Boolean,
    // Elevate button? - adds box shadow
    elevated: Boolean,
    // Flat?
    flat: Boolean,
    // Full width?
    full: { type: Boolean, default: true },
    // Left icon
    iconLeft: String,
    // Right icon
    iconRight: String,
    // Button text
    label: String,
    // Loading spinner
    loading: Boolean,
    // Outlined?
    outline: Boolean,
    // Button size, see quasar q-btn docs
    size: String,
    // Additional styles
    styleExtend: { type: String, default: `` },
    // Text color - Defaults to black
    textColor: String,
    // Router link
    to: String,
    // Tooltip text
    tooltip: { type: String, default: "" },
    // Type of button (submit, etc)
    type: String,
  },
};
</script>
