<template>
  <div class="shopping-cart-item">
    <shopping-cart-item-main
      :item="item"
      :display-only="displayOnly"
      :order="order"
      :loading="loading"
      @open-matrix="shouldShowEquivalentPartsMatrix = true"
    />

    <!-- Equivalent Parts Matrix Dialog -->
    <equivalent-parts-matrix
      :current="currentItem"
      v-model="shouldShowEquivalentPartsMatrix"
      v-if="!displayOnly"
    />
  </div>
</template>

<script>
import ShoppingCartItemMain
  from "components/shopping-cart-item/ShoppingCartItemMain";
import EquivalentPartsMatrix
  from "components/shopping-cart-item/EquivalentPartsMatrix";

export default {
  name: "ShoppingCartItem",
  components: { ShoppingCartItemMain, EquivalentPartsMatrix },
  props: {
    item: {
      type: Object,
      required: true
    },
    displayOnly: Boolean,
    order: Boolean,
    loading: Boolean
  },
  data: () => ({
    currentItem: {},
    shouldShowEquivalentPartsMatrix: false
  }),
  mounted() {
    this.currentItem = JSON.parse(JSON.stringify(this.item));
  }
}
</script>
