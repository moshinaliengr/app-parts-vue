<template>
  <shopping-cart-address-template
    ref="dialog"
    top-text="Are you sure?"
    top-icon-classes="fas fa-clipboard-check"
    v-model="computedValue"
  >
    <template #main>
      <div class="text-bold">
        Current Address
      </div>
      <div class="current-address">
        <div class="name">
          {{ currentAddress.name }}
        </div>
        <div class="address">
          {{ currentAddress.street1 }},
          <template v-if="currentAddress.street2">
            {{ currentAddress.street2 }},
          </template>
          {{ currentAddress.city }}, {{ currentAddress.state }} {{ currentAddress.zip }}
        </div>
      </div>

      <div class="text-bold">
        New Address
      </div>
      <div class="new-address">
        <div class="name">
          {{ newAddress.name }}
        </div>
        <div class="address">
          {{ newAddress.street1 }},
          <template v-if="newAddress.street2">
            {{ newAddress.street2 }},
          </template>
          {{ newAddress.city }}, {{ newAddress.state }} {{ newAddress.zip }}
        </div>
      </div>
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
        label="Confirm"
        color="primary"
        text-color="black"
        @click="confirm"
        :loading="isSubmitting"
        no-caps
      />
    </template>
  </shopping-cart-address-template>
</template>

<script>
import ShoppingCartAddressTemplate
  from "components/dialogs/shopping-cart-address/ShoppingCartAddressTemplate";
import axios from "axios";
import {Notify} from "src/mixins/Notify";
export default {
  name: "ShoppingCartAddressConfirmationDialog",
  components: {ShoppingCartAddressTemplate},
  mixins: [Notify],
  props: {
    value: {
      type: Boolean,
      required: true
    },
    currentAddress: {
      type: Object,
      required: true
    },
    newAddress: {
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
    userToken() {
      return this.$store.state.user.authorization.token;
    },
    cartId() {
      return this.$store.getters["shoppinglist/shoppingCartId"];
    },
    isSubmitting() {
      return this.$store.getters["shoppinglist/isUpdatingShippingAddress"];
    }
  },
  methods: {
    confirm() {
      if (this.cartId) {
        const formData = {
          cart_id: this.cartId,
          shipping_name: this.newAddress.name,
          shipping_address_street_1: this.newAddress.street1,
          shipping_address_street_2: this.newAddress.street2,
          shipping_address_city: this.newAddress.city,
          shipping_address_state: this.newAddress.state,
          shipping_address_zip: this.newAddress.zip
        };

        this.$store.dispatch("shoppinglist/updateShippingAddress", formData)
          .then(res => {
            if (!!res) {
              if (!!res && res.constructor === Object) {
                this.$refs.dialog.hide();
                this.notify(
                  "Shipping address updated successfully",
                  "positive",
                  "check_circle_outline"
                );
              } else {
                this.notify("Address is invalid", "negative");
                this.$emit("verification-failed");
              }
            } else {
              this.notify("Error updating address", "negative");
            }
          });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-bold {
  &:not(:first-child) {
    margin-top: 20px;
  }
}
</style>
