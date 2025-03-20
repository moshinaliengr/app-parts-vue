<template>
  <shopping-cart-dialog-template
    ref="dialog"
    top-text="Purchase Order"
    top-icon-classes="fas fa-file"
    v-model="computedValue"
  >
    <template #main>
      <q-input
        type="textarea"
        label="Enter Purchase Order"
        v-model="poDescription"
        outlined
      />
    </template>
    <template #actions>
      <q-btn
        class="q-mr-sm"
        label="Cancel"
        v-close-popup
        no-caps
        outline
      />
      <q-btn
        class="q-ml-md"
        label="Save"
        color="primary"
        text-color="black"
        @click="submit"
        no-caps
      />
    </template>
  </shopping-cart-dialog-template>
</template>

<script>
import ShoppingCartDialogTemplate from "components/dialogs/ShoppingCartDialogTemplate";
import {Notify} from "src/mixins/Notify";
export default {
  name: "ShoppingCartPurchaseOrderDialog",
  mixins: [Notify],
  components: {
    ShoppingCartDialogTemplate
  },
  props: {
    description: String,
    value: Boolean
  },
  data() {
    return {
      poDescription: this.description
    };
  },
  computed: {
    cartId() {
      return this.$store.getters["shoppinglist/shoppingCartId"];
    },
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {
    description(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.poDescription = newVal;
      }
    }
  },
  methods: {
    submit() {
      const formData = { cart_id: this.cartId, po_description: this.poDescription };

      this.$store.dispatch("shoppinglist/updatePurchaseOrderDescription", formData)
        .then(res => {
          if (!!res) {
            this.$refs.dialog.hide();
            this.notify(
              "Purchase Order description updated successfully",
              "positive",
              "check_circle_outline"
            );
          } else {
            this.notify("Error updating Purchase Order description", "negative");
          }
        });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
