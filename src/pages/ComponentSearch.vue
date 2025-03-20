<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="no-padding">
        <ComponentSearch />

        <ModuleTable />
      </q-card-section>
    </ContentCard>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import ComponentSearch from "../components/partsLookup/ComponentSearch";
import ModuleTable from "../components/partsLookup/ModuleTable";

export default {
  name: "ComponentLookup",

  components: {
    ComponentSearch,
    ContentCard,
    ModuleTable,
  },

  data: () => ({
    id: "",
    module: ``,
    modules: [],
    details: [],
    noResults: false,
    headers: {
      "X-Authorization":
        process.env.TRUCK_PARTS_LOOKUP_SERVICE_API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    searching: false,
    showResults: false,
  }),
};
</script>
