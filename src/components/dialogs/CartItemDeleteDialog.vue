<template>
  <q-dialog ref="dialog" class="cart-item-delete-dialog" v-model="computedValue">
    <q-card class="cart-item-delete-card">
      <div class="top">
        <div class="text">
          Are you sure?
        </div>
        <div class="icon-container">
          <i class="fas fa-trash" />
        </div>
      </div>
      <q-card-section class="content">
        <div class="text">
          Are you sure you want to remove {{ item.manufacturer_name }} {{ item.part_id }} from your cart?
        </div>
        <div class="checkbox-container" v-if="item.root_part">
          <q-checkbox
            label="Also remove from shopping list"
            v-model="shouldRemoveFromShoppingList"
          />
        </div>
      </q-card-section>
      <q-card-actions class="actions" align="right">
        <q-btn
          label="Cancel"
          style="font-size: 12px;"
          v-close-popup
          no-caps
          outline
        />
        <q-btn
          label="Delete Item"
          color="primary"
          text-color="black"
          style="font-size: 12px;"
          @click="remove"
          :loading="isDeleting"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {Notify} from "src/mixins/Notify";

export default {
  name: "CartItemDeleteDialog",
  mixins: [Notify],
  props: {
    value: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    isDeleting() {
      return this.$store.getters["shoppinglist/isPartBeingRemovedFromCart"](this.item.id);
    }
  },
  data: () => ({
    shouldRemoveFromShoppingList: false
  }),
  methods: {
    close() {
      this.$refs.dialog.hide();
    },
    remove() {
      const removeFromList = this.shouldRemoveFromShoppingList ? 1 : 0;
      this.$store.dispatch(
        "shoppinglist/removePartFromCart",
        { cartItemId: this.item.id,  removeFromList }
      )
        .then((res) => {
          if (res) {
            this.notify(
              "Part deleted successfully",
              "positive",
              "check_circle_outline"
            );
            this.close();
          } else {
            this.notify(
              "An error occurred when attempting to remove part",
              "negative"
            );
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.q-dialog {
  .cart-item-delete-card {
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 16px 12px 12px 15px;

      background-color: $primary;

      .text {
        margin-right: 20px;
        font-size: 16px;
        line-height: 20px;
        font-weight: 700;
      }
    }

    .actions {
      .q-btn {
        min-width: 120px;
      }
    }
  }
}
</style>
