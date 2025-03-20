<template>
  <q-page padding class="flex flex-center row">
    <search-table
      class="col-xs-12 col-sm-10 col-md-8 col-lg-6"
      :inputOptions="inputOptions"
      :callbacks="callbacks"
    >
      <template #item="{item}">
        <definition-card style="min-height: 200px" :entry="item" />
      </template>
    </search-table>
  </q-page>
</template>

<script>
import DefinitionCard from "src/components/DefinitionCard.vue";
import SearchTable from "src/components/SearchTable.vue";
import { index, search } from "src/services/DieselDictionary";

export default {
  name: "DieselDictionary",

  components: {
    DefinitionCard,
    SearchTable
  },

  data() {
    return {
      showImgModal: false
    };
  },

  computed: {
    callbacks() {
      return {
        index,
        search
      };
    },
    inputOptions() {
      return {
        label: "Search for a term or acronym",
        dense: true,
        outlined: true,
        class: "full-width",
        debounce: 1000
      };
    }
  }
};
</script>
