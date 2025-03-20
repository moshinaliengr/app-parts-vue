<template>
  <q-item-label class="q-ml-xs">
    <span class="text-weight-medium">{{ keyName }}: </span>
    <span class="text-weight-light">{{ value }}</span>
    <slot />
  </q-item-label>
</template>

<script>
export default {
  name: "KeyValueText",
  props: {
    keyName: [String, Number],
    value: [String, Number],
  },
};
</script>
