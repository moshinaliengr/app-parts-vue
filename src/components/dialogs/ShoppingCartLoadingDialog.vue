<template>
  <q-dialog v-model="isUpdating">
    <q-card class="shopping-cart-loading-dialog">
      <q-card-section class="content">
        <p class="h5">Hang tight.</p>
        <p class="text">Our vendors are finding the parts you need.</p>
        <p class="text">This could take a few minutes</p>
      </q-card-section>
      <q-card-section class="loader">
        <q-linear-progress
          stripe
          rounded
          size="15px"
          indeterminate
          color="warning"
          class="q-mt-sm"
        />
        <div class="percentage">
          <span>{{ percentage }}% Complete</span>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data: () => {
    return {
      percentage: 0,
    };
  },
  computed: {
    isUpdating() {
      const isPollingShoppingCart = this.$store.getters[
        "shoppinglist/isPollingShoppingCart"
      ];
      const isGettingShoppingList = this.$store.getters[
        "shoppinglist/isGettingShoppingList"
      ];
      const isUpdatingShippingAddress = this.$store.getters[
        "shoppinglist/isUpdatingShippingAddress"
      ];

      const isUpdatingShoppingCartPart = this.$store.getters[
        "shoppinglist/isUpdatingShoppingCartPart"
      ];
      const hasTriggeredOpticatRequestsForListItems = this.$store.getters[
        "shoppinglist/hasTriggeredOpticatRequestsForListItems"
      ];

      return (
        isPollingShoppingCart ||
        isGettingShoppingList ||
        isUpdatingShippingAddress ||
        isUpdatingShoppingCartPart ||
        hasTriggeredOpticatRequestsForListItems
      );
    },
  },
  created() {
    this.percentage = 0;
    let count = setInterval(() => {
      if (this.percentage < 96) {
        return (this.percentage += 6);
      }
    }, 800);
  },
  watch: {
    isUpdating: function (val) {
      const updating = val;
      this.percentage = 0;
      if (updating) {
        let count = setInterval(() => {
          if (this.percentage < 96) {
            return (this.percentage += 6);
          }
        }, 800);
      }
    },
  },
};
</script>

<style lang="scss">
.shopping-cart-loading-dialog {
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 30px;
  padding-left: 160px;
  padding-right: 160px;
  .content {
    display: flex;
    align-items: center;
    flex-direction: column;
    .h5 {
      font-size: 30px;
      font-weight: bolder;
      margin-bottom: 20px;
    }
    .text {
      display: flex;
      justify-content: center;
      width: 500px;
      font-size: 14px;
      line-height: 10px;
    }
  }
  .loader {
    margin-top: -35px;
  }
  .percentage {
    font-size: 15px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
