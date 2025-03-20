<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="no-padding">
        <EngineSearch />

        <ModuleTable />
      </q-card-section>
    </ContentCard>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import EngineSearch from "../components/partsLookup/EngineSearch";
import ModuleTable from "../components/partsLookup/ModuleTable";

export default {
  name: "ExplodedViews",

  components: {
    ContentCard,
    EngineSearch,
    ModuleTable,
  },

  data: () => ({
    details: [],
    headers: {
      "X-Authorization":
        process.env.TRUCK_PARTS_LOOKUP_SERVICE_API_KEY ||
        "Oh1AmZN5vdWAyRl8hjY0uasUol8r3dnr9v3wOVT052Wr3XYJwLjH2u3TpPEE",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    id: "",
    module: ``,
    modules: [],
    noResults: false,
    searching: false,
  }),
};
</script>
