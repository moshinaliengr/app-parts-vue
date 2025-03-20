<template>
  <div class="row q-my-md">
    <div class="col"><hr /></div>
    <div class="col-1 text-center">{{ text }}</div>
    <div class="col"><hr /></div>
  </div>
</template>

<script>
export default {
  name: "OrDivider",
  props: {
    text: {
      default: "OR",
      type: String,
    },
  },
};
</script>

<style>
</style>