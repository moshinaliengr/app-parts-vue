<template>
  <div class="address-form">
    <div class="form">
      <div class="field required">
        <q-input
          ref="name"
          label="Name"
          type="text"
          v-model="formData.name"
          :rules="[required]"
          lazy-rules
          dense
          outlined
        />
      </div>
      <div class="field required">
        <q-input
          ref="street1"
          label="Street 1"
          type="text"
          v-model="formData.street1"
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
          v-model="formData.street2"
          dense
          outlined
        />
      </div>
      <div class="fields city-state-zip">
        <div class="field required city">
          <q-input
            ref="city"
            label="City"
            type="text"
            v-model="formData.city"
            :rules="[required]"
            lazy-rules
            dense
            outlined
          />
        </div>
        <div class="field required state">
          <q-input
            ref="state"
            label="State"
            type="text"
            v-model="formData.state"
            :rules="[required]"
            lazy-rules
            dense
            outlined
          />
        </div>
        <div class="field required zip">
          <q-input
            ref="zip"
            label="Zip Code"
            type="text"
            v-model="formData.zip"
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
export default {
  name: "AddressForm",
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    requiredRefs: [
      "name",
      "street1",
      "city",
      "state",
      "zip",
    ]
  }),
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
.address-form {
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
