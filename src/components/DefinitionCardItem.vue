<template>
  <div>
    <q-item v-if="definition.length <= 200">
      <q-item-section>
        <q-item-label>
          {{ definition }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-expansion-item v-else :label="label" @input="onInput" />
  </div>
</template>

<script>
export default {
  name: "DefinitionCardItem",
  props: {
    definition: {
      type: String,
      default:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores laboriosam itaque optio ut voluptatem, sed debitis fugit, illum reprehenderit aliquid fuga? Perferendis illum at dolorum amet voluptas provident soluta odio."
    }
  },

  data() {
    return {
      showFullDefinition: false
    };
  },

  computed: {
    label() {
      let label;
      if (this.definition.length > 200) {
        label = this.definition.substring(0, 200) + "...";
      }
      if (this.showFullDefinition) {
        label = this.definition;
      }
      return label;
    }
  },

  methods: {
    onInput() {
      this.showFullDefinition = !this.showFullDefinition;
    }
  }
};
</script>
