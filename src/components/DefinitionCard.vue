<template>
  <q-card square flat class="row full-width q-mb-md Card">
    <q-card-section class="col" horizontal>
      <q-card-section class="col row">
        <span class="col-12 text-h6 ellipsis ">{{ entry.word }}</span>
        <span class="col-12" v-if="entry.acronyms.length !== 0">
          <div>
            <span class="text-italic ">Acronyms:</span>
            <q-badge
              v-for="acronym in entry.acronyms"
              :key="acronym.id"
              class="q-mx-xs"
              text-color="black"
              align="middle"
              color="orange-5"
            >
              {{ acronym.label }}
            </q-badge>
          </div>
        </span>
        <span
          v-if="entry.definitions.length !== 0"
          class="col-12 q-pt-sm q-pb-md"
        >
          <q-list v-for="definition in entry.definitions" :key="definition.id">
            <definition-card-item :definition="definition.definition" />
          </q-list>
        </span>
      </q-card-section>

      <!-- 
        !!! Uncomment the following when img thumbnails are available
        !!! noImg
        <q-card-section v-if="entry.image !== null" class="col-3">
        <q-card>
          <q-img :src="entry.img.src" @click="showImgModal = true" />
        </q-card>
      </q-card-section> -->
    </q-card-section>
  </q-card>
</template>

<script>
import DefinitionCardItem from "./DefinitionCardItem.vue";
export default {
  components: { DefinitionCardItem },
  name: "DefinitionCard",
  props: {
    entry: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      lines: 2
    };
  },

  computed: {}
};
</script>

<style scoped>
.Card {
  background-color: rgba(255, 216, 111, 0.12);
}
</style>
