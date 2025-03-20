<template>
  <div>
    This is an example Vue component
    <example-vue-child-component />
  </div>
</template>

<script>
import ExampleVueChildComponent from "./ExampleVueChildComponent.vue";
export default {
  components: { ExampleVueChildComponent },
  name: "ExampleVueComponent",

  data() {
    return {};
  },
};
</script>
