<template>
  <div class="company-form">
    <div class="company">
      <div class="text">
        Please enter your Opticat Location Name and create a company account:
      </div>
      <div class="field required">
        <q-input
          ref="opticatLocationName"
          label="Opticat Location Name"
          type="text"
          v-model="formData.opticatLocationName"
          :rules="[required]"
          lazy-rules
          dense
          outlined
        />
      </div>

      <div class="field required">
        <q-input
          ref="companyName"
          label="Company Name"
          type="text"
          v-model="formData.companyName"
          :rules="[required]"
          lazy-rules
          dense
          outlined
        />
      </div>

      <div class="field required">
        <phone-input
          ref="companyPhone"
          label="Company Phone"
          v-model="formData.companyPhone"
          :rules="[required]"
          lazy-rules
          dense
          outlined
        />
      </div>
    </div>
    <div class="billing">
      <div class="heading">Billing Address</div>
      <div class="field required">
        <q-input
          ref="billingStreet1"
          label="Street 1"
          type="text"
          v-model="formData.billingStreet1"
          :rules="[required]"
          lazy-rules
          dense
          outlined
        />
      </div>
      <div class="field">
        <q-input
          label="Street 2"
          type="text"
          v-model="formData.billingStreet2"
          dense
          outlined
        />
      </div>
      <div class="fields city-state-zip">
        <div class="field required city">
          <q-input
            ref="billingCity"
            label="City"
            type="text"
            v-model="formData.billingCity"
            :rules="[required]"
            lazy-rules
            dense
            outlined
          />
        </div>
        <div class="field required state">
          <q-input
            ref="billingState"
            label="State"
            type="text"
            v-model="formData.billingState"
            :rules="[required]"
            lazy-rules
            dense
            outlined
          />
        </div>
        <div class="field required zip">
          <q-input
            ref="billingZip"
            label="Zip Code"
            type="text"
            v-model="formData.billingZip"
            :rules="[required]"
            lazy-rules
            dense
            outlined
          />
        </div>
      </div>
    </div>
    <div class="shipping">
      <div class="heading">Shipping Address</div>
      <div class="field">
        <q-checkbox
          label="Same as Billing Address"
          v-model="isShippingSameAsBilling"
        />
      </div>
      <div class="field required">
        <q-input
          ref="shippingStreet1"
          label="Street 1"
          type="text"
          v-model="formData.shippingStreet1"
          :rules="[required]"
          lazy-rules
          dense
          outlined
        />
      </div>
      <div class="field">
        <q-input
          label="Street 2"
          type="text"
          v-model="formData.shippingStreet2"
          dense
          outlined
        />
      </div>
      <div class="fields city-state-zip">
        <div class="field required city">
          <q-input
            ref="shippingCity"
            label="City"
            type="text"
            v-model="formData.shippingCity"
            :rules="[required]"
            lazy-rules
            dense
            outlined
          />
        </div>
        <div class="field required state">
          <q-input
            ref="shippingState"
            label="State"
            type="text"
            v-model="formData.shippingState"
            :rules="[required]"
            lazy-rules
            dense
            outlined
          />
        </div>
        <div class="field required zip">
          <q-input
            ref="shippingZip"
            label="Zip Code"
            type="text"
            v-model="formData.shippingZip"
            :rules="[required]"
            lazy-rules
            dense
            outlined
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PhoneInput from "components/PhoneInput";

export default {
  name: "CompanyForm",
  components: { PhoneInput },
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    requiredRefs: [
      "opticatLocationName",
      "companyName",
      "companyPhone",
      "billingStreet1",
      "billingCity",
      "billingState",
      "billingZip",
      "shippingStreet1",
      "shippingCity",
      "shippingState",
      "shippingZip"
    ],
    isShippingSameAsBilling: false
  }),
  watch: {
    isShippingSameAsBilling(newVal) {
      if (newVal) {
        this.formData.shippingStreet1 = this.formData.billingStreet1;
        this.formData.shippingStreet2 = this.formData.billingStreet2;
        this.formData.shippingCity = this.formData.billingCity;
        this.formData.shippingState = this.formData.billingState;
        this.formData.shippingZip = this.formData.billingZip;
      }
    }
  },
  methods: {
    required(val) {
      return (!!val && val.length) || "This field is required";
    },
    validateRequiredRefs() {
      let invalidRefs = [];
      this.requiredRefs.forEach(ref => {
        if (!this.$refs[ref].validate()) {
          invalidRefs.push(ref);
        }
      });

      return invalidRefs.length === 0;
    }
  }
}
</script>

<style lang="scss" scoped>
.company-form {
  .company {
    .text {
      margin-bottom: 18px;
    }
  }

  .billing,
  .shipping {
    margin-top: 25px;

    .heading {
      margin-bottom: 15px;
      font-weight: 700;
    }
  }

  .billing {
    .heading {
      margin-bottom: 15px;
    }
  }

  .shipping {
    .heading {
      margin-bottom: 2px;
    }
  }

  .field {
    &:not(.required) {
      & + .field,
      & + .fields {
        margin-top: 30px;
      }
    }

    &.required {
      & + .field,
      & + .fields {
        margin-top: 10px;
      }
    }
  }

  .fields {
    display: flex;

    &.city-state-zip {
      .field {
        &.city {
          width: calc(50% - 6px);
        }

        &.state {
          width: calc(28% - 6px);
        }

        &.zip {
          width: calc(22% - 6px);
        }
      }
    }

    .field {
      &:not(:first-child) {
        margin-left: 18px;
      }

      &,
      &:not(.required),
      &.required {
        & + .field {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
