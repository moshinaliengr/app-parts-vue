<template>
  <q-dialog ref="dialog" class="cart-item-seller-info-dialog" v-model="computedValue">
    <q-card class="seller-info-card">
      <div class="top">
        <div class="text">
          Seller Information
        </div>
        <div class="icon-container">
          <i class="fas fa-info-circle" />
        </div>
      </div>

      <q-card-section class="content">
        <div class="name">
          <span class="text-bold">Name:</span>
          <div>
            {{ sellerInfo.organizationName }}
            <template v-if="locationName">
              - {{ locationName }}
            </template>
          </div>
        </div>
        <div class="address q-mt-md">
          <span class="text-bold">Address:</span>
          <div class="street-address">
            {{ address.street1 }}<template v-if="address.street2">, ${{ address.street2 }}</template>
          </div>
          <div class="city-state-zip">
            {{ address.city }}, {{ address.state }} {{ address.zip }}
          </div>

        </div>
        <div class="contact q-mt-md" v-if="sellerInfo.contactNo || sellerInfo.email">
          <span class="text-bold">Contact:</span>
          <div class="phone" v-if="sellerInfo.contactNo">
            Phone: {{ sellerInfo.contactNo }}
          </div>
          <div class="email" v-if="sellerInfo.email">
            Email: {{ sellerInfo.email }}
          </div>
        </div>

      </q-card-section>
      <q-card-actions class="actions" align="right">
        <q-btn
          class="primary-button"
          label="Close"
          color="primary"
          text-color="black"
          no-caps
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "CartItemSellerInfoDialog",
  props: {
    value: {
      type: Boolean,
      required: true
    },
      sellerInfo: {
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
    locationName() {
      return this.sellerInfo && this.sellerInfo.locations && this.sellerInfo.locations[0]
        ? this.sellerInfo.locations[0].locationame
        : null;
    },
    address() {
      if (this.sellerInfo) {
        return this.sellerInfo.locations && this.sellerInfo.locations[0]
          ? {
            street1: this.sellerInfo.locations[0].address1,
            street2: this.sellerInfo.locations[0].address2,
            city: this.sellerInfo.locations[0].city,
            state: this.sellerInfo.locations[0].state,
            zip: this.sellerInfo.locations[0].zipcode
          }
          : {
            street1: this.sellerInfo.address1,
            street2: this.sellerInfo.address2,
            city: this.sellerInfo.city,
            state: this.sellerInfo.state,
            zip: this.sellerInfo.zipCode
          }
      }
      return {};
    }
  }
}
</script>

<style lang="scss" scoped>
.seller-info-card {
  @media (max-width: $breakpoint-sm-max) {
    width: 100%;
  }

  @media (min-width: $breakpoint-md-min) {
    min-width: 450px;
  }

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
