<template>
  <shopping-cart-dialog-template
    ref="dialog"
    :top-text="topText"
    :top-icon-classes="topIconClasses"
    @input="$emit('input', $event)"
    v-model="computedValue"
  >
    <template #main>
      <div class="text">
        <i class="fas fa-exclamation-triangle fa-fw" />
        Updating your shipping address will require a cart update and may change an item's price, distributor, delivery estimate, and equivalent part selection.
      </div>
      <slot name="main" />
    </template>
    <template #actions>
      <slot name="actions" />
    </template>
  </shopping-cart-dialog-template>
</template>

<script>
import ShoppingCartDialogTemplate
  from "components/dialogs/ShoppingCartDialogTemplate";

export default {
  name: "ShoppingCartAddressTemplate",
  components: {
    ShoppingCartDialogTemplate
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    topText: {
      type: String,
      required: true
    },
    topIconClasses: {
      type: String,
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
    }
  },
  methods: {
    hide() {
      this.$refs.dialog.hide();
    }
  }
}
</script>

<style lang="scss">
.address-dialog {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 16px 12px 12px 15px;

    background-color: $primary;
    color: black;

    .text {
      margin-right: 20px;
      font-size: 16px;
      line-height: 20px;
      font-weight: 700;
    }
  }

  .content {
    .text {
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 20px;

      i {
        color: $primary;
      }
    }
  }

  .actions {
    .q-btn {
      min-width: 125px;
      font-size: 12px;
      line-height: 21px;

      &.primary-button {
        background-color: $primary;
      }
    }
  }
}
</style>
