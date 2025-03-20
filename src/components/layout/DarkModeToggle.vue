<template>
  <q-item v-ripple>
    <q-item-section avatar class="q-pr-sm" style="white-space: nowrap">
      <q-icon name="fad fa-adjust" />
    </q-item-section>

    <q-toggle
      v-model="darkMode"
      color="#fcbe18"
      label="Dark Mode"
      toggle-order="tf"
      left-label
      dense
    />
  </q-item>
</template>

<script>
export default {
  name: "DarkModeToggle",

  mounted() {
    const darkEnabled = this.$q.localStorage.getItem("darkMode");
    if (darkEnabled) this.darkMode = true;
    else this.darkMode = false;
  },

  data: () => ({ darkMode: Boolean }),

  watch: {
    darkMode: function () {
      if (this.darkMode) {
        this.$q.dark.set(true);
        this.$q.localStorage.set("darkMode", true);
      } else {
        this.$q.dark.set(false);
        this.$q.localStorage.set("darkMode", false);
      }
    }
  }
};
</script>

<style lang="scss">
.inverse {
  --fa-primary-color: black;
  --fa-secondary-color: #fcbe18;
}
</style>
