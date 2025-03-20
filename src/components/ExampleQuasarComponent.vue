<template>
  <q-card
    >This is an example Quasar component
    <example-quasar-child-component />
  </q-card>
</template>

<script>
import ExampleQuasarChildComponent from "./ExampleQuasarChildComponent.vue";
export default {
  name: "ExampleQuasarComponent",
  components: {
    ExampleQuasarChildComponent,
  },

  data() {
    return {};
  },
};
</script>
