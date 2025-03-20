<template>
  <q-card-section class="no-padding">
    <form @submit.prevent="searchNewPartNumber">
      <q-input
        v-model="currentInputText"
        :hide-bottom-space="!isHintVisible"
        label="Enter A Part Number"
        class="search-input"
        bottom-slots
        outlined
        dense
      >
        <template v-slot:hint>
          <div
            v-if="isHintVisible"
            :class="{ 'text-primary': isHintHighlighted }"
          >
            Enter {{ minQueryLength }} characters to search for a part. Please remove any # or % symbols before searching.
          </div>
        </template>

        <template v-slot:append>
          <q-icon
            v-if="currentInputText !== ''"
            name="close"
            @click="clearInputsAndResults"
            class="cursor-pointer"
          />

          <q-btn
            type="submit"
            @click="searchNewPartNumber"
            color="primary"
            :disable="!currentInputText || currentInputText.length < minQueryLength"
            text-color="secondary"
            unelevated
            icon="search"
            style="height: 100%"
          >
            <q-tooltip> Search by part number </q-tooltip>
          </q-btn>
        </template>
      </q-input>

      <q-select
        v-if="manufacturers.length > 0"
        v-model="selectedManufacturer"
        :options="manufacturers"
        option-label="name"
        label="Filter by Manufacturer"
        class="q-my-sm full-width"
        outlined
        dense
      >
        <template v-slot:append>
          <q-icon
            v-if="selectedManufacturer.id"
            name="close"
            @click.stop="clearSelectedManufacturer"
            class="cursor-pointer"
          />
        </template>

        <q-tooltip> Filter by Manufacturer </q-tooltip>
      </q-select>
    </form>
  </q-card-section>
</template>

<script>
export default {
  name: "PartSearchBar",

  data() {
    return {
      currentInputText: "",
      queryText: "",
      minQueryLength: 3,
      isHintVisible: true,
      isHintHighlighted: false,
      hintHighlightTimeout: null,
      selectedManufacturer: { name: "", id: null },
      validQueryLengthErrorMsg:
        "You must provide a part number at least 3 characters long",
      queryContainsSpecialCharactersErrorMsg:
        "Sorry, we can't search with # or % in the part number. Just remove that character and try again.",
    };
  },

  props: {
    manufacturers: {
      type: Array,
      required: true,
    },
  },

  computed: {
    queryContainsSpecialCharacters() {
      const specialChars = /[%#]/;
      return specialChars.test(this.currentInputText);
    },
  },

  methods: {
    clearSelectedManufacturer() {
      this.selectedManufacturer = { name: "", id: null };
    },

    clearInputsAndResults() {
      this.queryText = "";
      this.currentInputText = "";
      this.clearSelectedManufacturer();
      this.$emit("clearStateForNewSearch");
    },

    searchNewPartNumber() {
      if (this.queryContainsSpecialCharacters) {
        this.$q.notify({
          message: this.queryContainsSpecialCharactersErrorMsg,
          color: "negative",
          position: "top",
        });
        return;
      }

      this.queryText = this.currentInputText;
      this.clearSelectedManufacturer();

      let searchOptions = {
        partNumber: this.queryText,
        manufacturer: this.selectedManufacturer,
        resetPageNumber: true,
      };

      this.$emit("findParts", searchOptions);
    },
  },

  watch: {
    currentInputText() {
      // highlights the text under the part number input field if the user types characters
      // but doesn't match the minQuery length requirement after waiting 3 seconds
      clearTimeout(this.hintHighlightTimeout);

      if (
        this.currentInputText.length > 0 &&
        this.currentInputText.length < this.minQueryLength
      ) {
        this.hintHighlightTimeout = setTimeout(() => {
          if (
            this.currentInputText.length > 0 &&
            this.currentInputText.length < this.minQueryLength
          ) {
            this.isHintHighlighted = true;
          }
        }, 3000);
      }

      if (this.currentInputText.length >= this.minQueryLength) {
        this.isHintHighlighted = false;
      }
    },

    selectedManufacturer(newManufacturer) {
      let searchOptions = {
        partNumber: this.queryText,
        manufacturer: newManufacturer,
        resetPageNumber: true,
      };

      if (this.queryText !== "") {
        this.$emit("findParts", searchOptions);
      }
    },
  },
};
</script>

<style lang="scss">
// Adjusts padding on button within text input
label.q-field.search-input > div.q-field__inner > div.q-field__control {
  padding: 0 0 0 12px;
}
</style>
