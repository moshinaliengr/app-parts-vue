<template>
  <div class="equivalent-part-context-menu">
    <div class="icon-container cursor-pointer">
      <i class="far fa-ellipsis-v fa-fw" />
      <q-tooltip>
        View Options
      </q-tooltip>
    </div>
    <q-menu content-class="options-container" anchor="top left" self="bottom right">
      <q-item
        @click="$emit('select')"
        :clickable="!part.selected"
        v-close-popup="!part.selected"
        :disable="part.selected"
      >
        <q-item-section>
          <template v-if="!part.selected">
            Select Part
          </template>
          <template v-else>
            Part is Selected
          </template>
        </q-item-section>
      </q-item>
      <!-- TODO: Add stuff to indicate when part is in cart -->
      <q-item @click="onAddClick" clickable>
        <q-item-section v-if="isAddingPartToCart" avatar>
          <i class="far fa-spinner-third fa-spin fa-fw" />
        </q-item-section>
        <q-item-section>
          <template v-if="!part.is_in_cart_not_in_list">
            Add Part to Cart
          </template>
          <template v-else>
            Part Has Been Added to Cart
          </template>
        </q-item-section>
      </q-item>
    </q-menu>
  </div>
</template>

<script>
export default {
  name: "EquivalentPartContextMenu",
  props: {
    part: {
      type: Object,
      required: true
    }
  },
  computed: {
    isAddingPartToCart() {
      return this.$store.getters["shoppinglist/isAddingCartItemNotInList"](this.part.id);
    }
  },
  methods: {
    onAddClick() {
      if (!this.part.is_in_cart_not_in_list) {
        this.$emit("add-to-cart");
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
