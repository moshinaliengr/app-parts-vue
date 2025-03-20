<template>
  <shopping-cart-dialog-template
    ref="dialog"
    top-text="Order Note"
    top-icon-classes="fas fa-pencil"
    v-model="computedValue"
  >
    <template #main>
      <q-input
        type="textarea"
        label="Note"
        v-model="cartNote"
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
  name: "ShoppingCartNoteDialog",
  mixins: [Notify],
  components: {
    ShoppingCartDialogTemplate
  },
  props: {
    note: String,
    value: Boolean
  },
  data() {
    return {
      cartNote: this.note
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
    note(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.cartNote = newVal;
      }
    }
  },
  methods: {
    submit() {
      const formData = { cart_id: this.cartId, note: this.cartNote };

      this.$store.dispatch("shoppinglist/updateOrderNote", formData)
        .then(res => {
          if (!!res) {
            this.$refs.dialog.hide();
            this.notify(
              "Order note updated successfully",
              "positive",
              "check_circle_outline"
            );
          } else {
            this.notify("Error updating order note", "negative");
          }
        });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
