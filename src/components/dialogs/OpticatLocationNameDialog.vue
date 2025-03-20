<template>
  <q-dialog ref="dialog" v-model="computedValue">
    <q-card class="opticat-location-name-dialog">
      <div class="top">
        <div class="text">Location</div>
        <div class="icon-container">
          <i class="fas fa-globe" />
        </div>
      </div>
      <q-card-section class="content">
        <q-input
          ref="opticatLocationName"
          label="Opticat Location Name"
          type="text"
          v-model="locationName"
          :rules="[required]"
          lazy-rules
          dense
          outlined
        />
      </q-card-section>
      <q-card-actions class="actions" align="right">
        <q-btn class="q-mr-sm" label="Cancel" v-close-popup no-caps outline />
        <q-btn
          class="q-ml-md"
          label="Save"
          color="primary"
          text-color="black"
          @click="submit"
          :loading="isUpdatingOpticatLocationName"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { Notify } from "src/mixins/Notify";

export default {
  name: "OpticatLocationNameDialog",
  mixins: [Notify],
  props: {
    opticatLocationName: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      locationName: this.opticatLocationName,
    };
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    isUpdatingOpticatLocationName() {
      return this.$store.getters["company/isUpdatingOpticatLocationName"];
    },
    shopId() {
      const companyShop = this.$store.getters["company/companyShop"];

      if (companyShop && Array.isArray(companyShop) && companyShop.length > 0) {
        return companyShop[0].id;
      }

      return null;
    },
  },
  watch: {
    opticatLocationName(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.locationName = newVal;
      }
    },
  },
  methods: {
    required(val) {
      return (!!val && val.length) || "This field is required";
    },
    submit() {
      if (this.shopId) {
        this.$store
          .dispatch("company/updateOpticatLocationName", {
            shop_id: this.shopId,
            opticat_location_name: this.locationName,
          })
          .then((res) => {
            if (res) {
              this.$refs.dialog.hide();
              this.notify(
                "Opticat location name updated successfully",
                "positive",
                "check_circle_outline"
              );
              this.$store.dispatch(
                "shoppinglist/triggerOpticatRequestsForListItems"
              );
            } else {
              this.notify("Error updating Opticat location name", "negative");
            }
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.opticat-location-name-dialog {
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
