<template>
  <q-card>
    <q-card-section class="q-pb-none row justify-end">
      <q-input
              @input="onRequest({ newInput: true })"
              v-model="searchTerm"
              debounce="700"
              class="col-12"
              dense
              outlined
              bottom-slots
              label="Search for a term or acronym"
      >
        <template v-slot:hint>
          <div class="row full-width justify-end">
            {{ total + " results" }}
          </div>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section style="height: 60vh;">
      <q-virtual-scroll
              v-if="!loading && resultsWereFound"
              style="height: 100%;"
              :items="searchResults"
              separator
      >
        <template v-slot="{ item }">
          <slot name="item" v-bind:item="item"></slot>
        </template>
      </q-virtual-scroll>

      <q-card
              v-else-if="!loading && !resultsWereFound"
              flat
              style="height: 100%"
              class="flex flex-center"
      >
        <q-icon size="2em" name="sentiment_dissatisfied" />
        <span>
          Well this is sad...no results found for "{{ searchTerm }}"".
        </span>
        <q-icon size="2em" />
      </q-card>

      <q-inner-loading :showing="loading">
        <q-spinner-gears size="xl" color="primary" />
      </q-inner-loading>
    </q-card-section>
    <q-card-section class="row justify-center">
      <q-pagination
              v-if="isDesktop"
              v-model="page"
              :max="last_page"
              :max-pages="5"
              :direction-links="true"
              :boundary-links="true"
              :boundary-numbers="true"
              icon-first="skip_previous"
              icon-last="skip_next"
              color="primary"
              dense
              @input="onRequest"
      />
      <q-pagination
              v-else
              v-model="page"
              :max="last_page"
              input-class="text-bold text-primary"
              class="flex flex-center q-px-xs"
              icon-first="skip_previous"
              icon-last="skip_next"
              color="primary"
              :ellipses="true"
              input
              dense
              @input="onRequest"
      /></q-card-section>
  </q-card>
</template>

<script>
  export default {
    name: "SearchTable",
    props: {
      inputOptions: {
        type: Object,
        required: true
      },
      callbacks: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        loading: false,
        searchTerm: "",
        searchResults: [],
        page: 1,
        max: 5,
        last_page: 100,
        max_pages: null,
        total: null
      };
    },

    async mounted() {
      if (this.callbacks.index !== undefined) {
        this.onRequest({
          pagination: this.pagination,
          type: "index"
        });
      }
    },

    computed: {
      resultsWereFound() {
        return this.searchResults.length !== 0;
      },
      isDesktop() {
        if (this.$q.platform.is.desktop) return true;
        else return false;
      },
    },

    methods: {
      async onRequest({ newInput }) {
        const { index, search } = this.callbacks;
        if (newInput) {
          this.page = 1;
        }
        this.loading = true;
        const results =
                this.searchTerm === ""
                        ? await index(this.page)
                        : await search(this.searchTerm, this.page);
        this.loading = false;
        this.total = results.data.total;
        this.last_page = results.data.last_page;
        // this.searchResults = results.data.data;

        // This if else to be removed in near future. Currently used since code is sending varying
        // data structures from backend.

        typeof results.data.data === "object" ? this.searchResults = Object.values(results.data.data) : this.searchResults = results.data.data;
      }
    }
  };
</script>

<style>
  .q-table__top {
    padding: 0;
  }
</style>
