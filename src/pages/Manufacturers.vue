<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="text-h6 card-title">Manufacturers</q-card-section>

      <q-card-section>
        <Manufacturers />
      </q-card-section>
    </ContentCard>
  </q-page>
</template>

<script>
import Manufacturers from "../components/Manufacturers";
import ContentCard from "../components/common/ContentCard";

export default {
  name: "PageIndex",
  components: { Manufacturers, ContentCard },
};
</script>
