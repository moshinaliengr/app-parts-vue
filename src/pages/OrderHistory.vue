<template>
  <q-page class="order-history">
    <div class="order-history-content">
      <div class="top">
        <div class="title">
          Order History
        </div>
        <div class="sort-container">
          <q-select
            :options="sortOptions"
            :bg-color="$q.dark.isActive ? 'dark' : 'white'"
            v-model="selectedSort"
            outlined
            dense
          />
        </div>
      </div>
      <div class="orders-container" v-if="!isGettingOrders">
        <div
          class="order"
          @click="openOrder(order)"
          :key="`order_${order.id}`"
          v-for="order in sortedOrders"
        >
          <div class="order-number">
            Order #DL{{ order.id }}
          </div>
          <div class="date">
            {{ order.order_date }}
          </div>
        </div>
      </div>
      <div class="loading-state" v-else>
        <q-spinner-gears color="primary" size="4rem" />
      </div>
    </div>
  </q-page>
</template>

<script>
import moment from "moment";

export default {
  name: "OrderHistory",
  data: () => ({
    selectedSort: "Newest to Oldest",
    sortOptions: [
      "Newest to Oldest",
      "Oldest to Newest"
    ]
  }),
  computed: {
    orders() {
      return this.$store.getters["shoppinglist/orderHistory"];
    },
    sortedOrders() {
      const ordersClone = this.orders.slice();
      return ordersClone.sort((a, b) => {
        if (this.selectedSort === "Newest to Oldest") {
          return moment(b.succeeded_at).diff(moment(a.succeeded_at));
        } else {
          return moment(a.succeeded_at).diff(moment(b.succeeded_at));
        }
      });
    },
    isGettingOrders() {
      return this.$store.getters["shoppinglist/isGettingOrderHistory"];
    }
  },
  mounted() {
    if (this.$ld.flags['shopping-cart']) {
      this.$store.dispatch("shoppinglist/getOrderHistory");
    }
  },
  methods: {
    openOrder(order) {
      this.$router.push(`/order/${order.id}`);
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  &:not(.body--dark) {
    .order-history {
      .order-history-content {
        .orders-container {
          .order {
            background-color: white;
          }
        }
      }
    }
  }

  &.body--dark {
    .order-history {
      .order-history-content {
        .orders-container {
          .order {
            background-color: var(--q-color-dark);
            color: #222222;
          }
        }
      }
    }
  }
}
.order-history {
  display: flex;
  justify-content: center;

  padding-top: 15px;

  @media (min-width: $breakpoint-md-min) {
    padding-top: 25px;
    padding-bottom: 105px;
  }

  .order-history-content {
    display: flex;
    flex-direction: column;

    width: 100%;
    margin-right: 14px;
    margin-left: 14px;

    @media (min-width: $breakpoint-sm-min) {
      max-width: 907px !important;

      margin-right: 25px;
      margin-left: 25px;
    }

    .top {
      flex-shrink: 0;

      display: flex;
      flex-direction: column;

      @media (min-width: $breakpoint-md-min) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .title {
        font-size: 16px;
        line-height: 36px;
        font-weight: 700;

        @media (min-width: $breakpoint-md-min) {
          font-size: 24px;
        }
      }

      .sort-container {
        align-self: flex-end;

        @media (min-width: $breakpoint-md-min) {
          align-self: auto;
        }
      }
    }

    .orders-container,
    .loading-state {
      margin-top: 22px;

      @media (min-width: $breakpoint-md-min) {
        margin-top: 18px;
      }
    }

    .orders-container {
      .order {
        border-radius: 4px;

        padding: 22px 14px;

        background-color: white;

        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);

        cursor: pointer;

        @media (min-width: $breakpoint-md-min) {
          display: flex;
          justify-content: space-between;
        }

        &:not(:first-child) {
          margin-top: 12px;
        }

        &:hover {
          .order-number {
            color: $primary;
          }
        }

        .order-number {
          font-size: 20px;
          line-height: 20px;
          font-weight: 500;
        }

        .date {
          margin-top: 4px;
          font-size: 16px;
          line-height: 20px;

          @media (min-width: $breakpoint-md-min) {
            margin-top: 0;
          }
        }
      }
    }

    .loading-state {
      flex-grow: 1;

      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
