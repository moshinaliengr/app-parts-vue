<template>
  <shopping-cart-address-template
    ref="dialog"
    top-text="Shipping Address"
    top-icon-classes="fas fa-map-pin"
    v-model="computedValue"
  >
    <template #main>
      <div class="q-mb-md text-body2 text-red-6" v-if="isInvalid">
        Some or all of the address fields provided are invalid. Please correct and try again.
      </div>
      <address-form ref="addressForm" :form-data="formData" />
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
  </shopping-cart-address-template>
</template>

<script>
import ShoppingCartAddressTemplate
  from "components/dialogs/shopping-cart-address/ShoppingCartAddressTemplate";
import AddressForm from "components/AddressForm";
import axios from "axios";
import {Notify} from "src/mixins/Notify";
export default {
  name: "ShoppingCartAddressFormDialog",
  components: {AddressForm, ShoppingCartAddressTemplate},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    formData: {
      type: Object,
      required: true
    },
    isInvalid: Boolean
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
    submit() {
      if (this.$refs.addressForm && this.$refs.addressForm.validateRequiredRefs()) {
        this.$emit("submit", this.formData);
        this.$refs.dialog.hide();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.invalid-text {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 20px;
}
</style>
