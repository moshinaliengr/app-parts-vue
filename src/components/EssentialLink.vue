<template>
  <q-item clickable tag="a" :to="to">
    <q-item-section>
      <q-item-label>[ {{ label }} ]</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "EssentialLink",
  props: {
    label: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      default: "#",
    },
  },
};
</script>
