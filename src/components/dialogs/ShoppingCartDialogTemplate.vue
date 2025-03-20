<template>
  <q-dialog ref="dialog" @input="$emit('input', $event)" v-model="value">
    <q-card class="shopping-cart-dialog">
      <div class="top">
        <div class="text">
          {{ topText }}
        </div>
        <div class="icon-container">
          <i :class="topIconClasses" />
        </div>
      </div>
      <q-card-section class="content">
        <slot name="main" />
      </q-card-section>
      <q-card-actions class="actions" align="right">
        <slot name="actions" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "ShoppingCartDialogTemplate",
  props: {
    topText: {
      type: String,
      required: true
    },
    topIconClasses: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
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
.shopping-cart-dialog {
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
