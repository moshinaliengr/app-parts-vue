<template>
  <q-page class="shopping-cart">
    <div
      class="opticat-failure-warning"
      v-if="!singleCartId && hasOpticatFailed"
    >
      <div>
        There has been a problem retrieving part availability for your shopping
        cart.
      </div>
      <div class="list" v-if="incompleteItems && incompleteItems.length > 0">
        The following items' availability requests were not completed:
        <ul>
          <li
            :key="`incomplete_item_${item.id}`"
            v-for="item in incompleteItems"
          >
            {{ item.root_manufacturer_name }} - {{ item.root_part_number }}
          </li>
        </ul>
      </div>
    </div>

    <div class="shopping-cart-content">
      <div class="cart-list-container">
        <div class="heading">
          <div class="left">
            <div class="text-h5 text-weight-bold">
              <template v-if="!singleCartId">Shopping Cart</template>
              <template v-else-if="isOrderCompleted">Order Complete!</template>
              <template v-else>
                <span class="order-label">Order </span>#DL{{ singleCartId }}
              </template>
            </div>
            <div
              class="sub-heading"
              :class="{ 'has-order-date': !isOrderCompleted }"
              v-if="singleCartId"
            >
              <template v-if="isOrderCompleted">
                Your order #DL{{ singleCartId }} has been placed.
              </template>
              <template v-else> Ordered {{ singleCart.order_date }} </template>
            </div>
          </div>
          <div class="right" v-if="isOrderView && !isOrderCompleted">
            <q-btn
              icon="fas fa-download"
              @click.native="downloadOrder"
              flat
              round
            />
          </div>
        </div>

        <div class="order-sub-heading" v-if="isOrderView && !isOrderCompleted">
          <q-select
            :options="sortOptions"
            :bg-color="$q.dark.isActive ? 'dark' : 'white'"
            v-model="selectedSort"
            outlined
            dense
          />
          <q-input
            label="Filter"
            type="search"
            :bg-color="$q.dark.isActive ? 'dark' : 'white'"
            v-model="itemsFilter"
            outlined
            dense
          >
            <template v-slot:append>
              <i class="far fa-search" />
            </template>
          </q-input>
        </div>

        <div class="cart-list">
          <shopping-cart-item
            :item="item"
            :order="isOrderView"
            :loading="isUpdating"
            :key="`item_${item.id}`"
            v-for="item in sortedFilteredCartItems"
          />
        </div>

        <div
          class="unavailable-container"
          v-if="!isOrderView && unavailableItems && unavailableItems.length"
        >
          <div class="heading">
            <div class="text-h5 text-weight-bold">Unavailable</div>
          </div>

          <div class="unavailable-list">
            <shopping-list-item
              v-for="item in unavailableItems"
              :item="item"
              :key="`unavailable_item_${item.root_part_uuid}`"
              @view="viewSelectedPart({ selectedPart: item })"
              unavailable
            />
          </div>
        </div>
      </div>

      <div class="summary-container">
        <div class="heading">
          <div
            class="text-h5 text-weight-bold"
            :class="{ 'text-right': singleCart && !isOrderCompleted }"
          >
            <template v-if="!singleCart || isOrderCompleted">
              Order Summary
            </template>
            <template v-else>
              {{ singleCart.order_date }}
            </template>
          </div>
          <div class="sub-heading" v-if="singleCart && isOrderCompleted">
            Ordered {{ singleCart.order_date }}
          </div>
        </div>

        <div class="order-sub-heading" v-if="isOrderView && !isOrderCompleted">
          <ButtonStandard
            label="Download"
            tooltip="Download Order Info"
            icon-right="fas fa-download"
            :color="$q.dark.isActive ? 'white' : 'black'"
            @click.native="downloadOrder"
            :full="false"
            flat
          />
        </div>

        <div class="summary">
          <div class="powered-by-opticat" v-if="shouldShowOrderSummary">
            <img src="../assets/pb-opticat.png" />
          </div>

          <div class="main-content" v-if="shouldShowOrderSummary">
            <div class="itemized-list">
              <table>
                <thead>
                  <tr>
                    <th>Seller</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    :key="`summary_item_${item.id}`"
                    v-for="item in Object.values(cartItemsBySellerAndLocation)"
                  >
                    <td>
                      <div class="seller-name">
                        {{ item.seller_name }}
                      </div>
                      <div class="seller-city-state">
                        {{ item.location }}
                      </div>
                    </td>
                    <td>{{ item.quantity }}</td>
                    <td>
                      {{
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.total)
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="shipping-address">
              <div class="heading">Shipping Address</div>
              <div class="company-name">
                {{ companyName }}
              </div>
              <div class="address">
                {{ streetAddress1 }},
                <template v-if="streetAddress2">
                  {{ streetAddress2 }},
                </template>
                {{ city }}, {{ state }} {{ zip }}
              </div>
              <div class="link" v-if="!isOrderView">
                <a @click="openAddressFormDialog">Edit</a>
              </div>
            </div>

            <div class="purchase-order">
              <div class="heading">Purchase Order</div>
              <div
                class="content"
                v-if="isOrderView || purchaseOrderDescription"
              >
                <template v-if="!isOrderView || purchaseOrderDescription">
                  {{ purchaseOrderDescription }}
                </template>
                <template v-else> &mdash; </template>
              </div>
              <div class="link" v-if="!isOrderView">
                <a @click="shouldShowPurchaseOrderDialog = true">
                  {{ purchaseOrderDescription ? "Edit" : "Add" }}
                </a>
              </div>
            </div>

            <div class="order-note">
              <div class="heading">Order Note</div>
              <div class="content" v-if="isOrderView || note">
                <template v-if="!isOrderView || note">
                  {{ note }}
                </template>
                <template v-else> &mdash; </template>
              </div>
              <div class="link" v-if="!isOrderView">
                <a @click="shouldShowNoteDialog = true">
                  {{ note ? "Edit" : "Add" }}
                </a>
              </div>
            </div>
          </div>

          <div class="total-confirm">
            <div class="total">
              <div class="label">Total</div>
              <div class="value">
                <span class="symbol">$</span>
                <span class="whole">{{ totalWhole }}</span>
                <span class="decimal">{{ totalDecimal }}</span>
              </div>
              <div
                class="icon-container"
                @click="shouldShowOrderSummary = !shouldShowOrderSummary"
              >
                <i
                  class="far"
                  :class="{
                    'fa-chevron-down': shouldShowOrderSummary,
                    'fa-chevron-up': !shouldShowOrderSummary,
                  }"
                />
              </div>
            </div>

            <div class="confirm" :class="{ 'has-order-number': isOrderView }">
              <ButtonStandard
                class="q-px-lg"
                label="Place Order"
                tooltip="Confirm & place order"
                size="sm"
                style-extend="padding-top: 4px; padding-bottom: 4px;"
                @click.native="checkout"
                :loading="isCheckingOut || isPlacingOrder"
                v-if="!isOrderView"
              />
              <div class="order-number" v-else-if="singleCartId">
                #DL{{ singleCartId }}
              </div>
            </div>
          </div>
        </div>

        <div class="order-numbers" v-if="singleCartId">
          <div class="top">Order Reference Numbers</div>
          <div class="numbers-container">
            <div class="number-container">
              <div class="seller-name">Diesel Order No.</div>
              <div class="reference-numbers">
                <div class="number">DL{{ singleCartId }}</div>
              </div>
            </div>
            <div
              class="number-container"
              :key="`order_number_${i}`"
              v-for="(numbersData, i) in orderNumbers"
            >
              <div class="seller-name">
                {{ numbersData.sellerName }} Order No.
              </div>
              <div class="reference-numbers">
                <div
                  class="number"
                  :key="`number_${j}`"
                  v-for="(number, j) in numbersData.numbers"
                >
                  {{ number }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Order Dialog -->
    <shopping-cart-purchase-order-dialog
      :description="purchaseOrderDescription"
      v-model="shouldShowPurchaseOrderDialog"
    />

    <!-- Order Note Dialog -->
    <shopping-cart-note-dialog :note="note" v-model="shouldShowNoteDialog" />

    <!-- Address Update Dialog -->
    <shopping-cart-address-form-dialog
      :form-data="addressFormData"
      :is-invalid="isAddressInvalid"
      @submit="openAddressConfirmDialog"
      v-model="shouldShowAddressFormDialog"
    />

    <!-- New Address Confirmation Dialog -->
    <shopping-cart-address-confirmation-dialog
      :current-address="currentAddress"
      :new-address="newAddress"
      @verification-failed="backToAddressEntry"
      v-model="shouldShowAddressConfirmationDialog"
    />

    <!-- Issues When Placing Order Dialog -->
    <q-dialog v-model="shouldShowOrderIssuesDialog">
      <q-card class="order-issues-dialog">
        <div class="top">
          <div class="text">Item Availability Changes</div>
          <div class="icon-container">
            <i class="far fa-exclamation-triangle" />
          </div>
        </div>

        <q-card-section class="content">
          <div class="text">
            <i class="fas fa-exclamation-triangle fa-fw" />
            The following issues have occurred while processing your order
            submission:
            <ul>
              <li :key="`issue_${i}`" v-for="(issue, i) in orderIssues">
                {{ issue }}
              </li>
            </ul>
            Would you like to place your order anyway?
          </div>
        </q-card-section>

        <q-card-actions class="actions" align="right">
          <q-btn
            class="q-mr-sm"
            label="No, Cancel"
            style="border: 2px solid black; color: black"
            flat
            no-caps
            v-close-popup
          />
          <q-btn
            class="primary-button q-ml-md"
            label="Yes, Place Order"
            @click="placeOrder"
            :loading="isPlacingOrder"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <ShoppingCartLoadingDialog />
  </q-page>
</template>

<script>
// Libraries & Features
import axios from "axios";

import ShoppingCartItem from "components/shopping-cart-item/ShoppingCartItem";
import ButtonStandard from "components/common/ButtonStandard";
import ShoppingListItem from "components/ShoppingListItem";
import ShoppingCartAddressFormDialog from "components/dialogs/shopping-cart-address/ShoppingCartAddressFormDialog";
import ShoppingCartAddressConfirmationDialog from "components/dialogs/shopping-cart-address/ShoppingCartAddressConfirmationDialog";
import PartInfo from "../components/PartInfo.vue";
import { Notify } from "src/mixins/Notify";
import { getPart } from "../services/TruckPartsCross";
import ShoppingCartPurchaseOrderDialog from "components/dialogs/ShoppingCartPurchaseOrderDialog";
import ShoppingCartNoteDialog from "components/dialogs/ShoppingCartNoteDialog";
import ShoppingCartLoadingDialog from "src/components/dialogs/ShoppingCartLoadingDialog.vue";
export default {
  name: "ShoppingCart",
  components: {
    ShoppingCartNoteDialog,
    ShoppingCartPurchaseOrderDialog,
    ShoppingCartAddressConfirmationDialog,
    ShoppingCartAddressFormDialog,
    ShoppingListItem,
    ButtonStandard,
    ShoppingCartItem,
    ShoppingCartLoadingDialog,
  },
  mixins: [Notify],
  data: () => ({
    addressFormData: {
      name: null,
      street1: null,
      street2: null,
      city: null,
      state: null,
      zip: null,
    },
    currentAddress: {
      name: null,
      street1: null,
      street2: null,
      city: null,
      state: null,
      zip: null,
    },
    newAddress: {
      name: null,
      street1: null,
      street2: null,
      city: null,
      state: null,
      zip: null,
    },
    orderIssues: null,
    singleCartId: null,
    singleCart: null,
    itemsFilter: null,
    selectedSort: "Seller A-Z",
    sortOptions: [
      "Part Number",
      "Manufacturer A-Z",
      "Seller A-Z",
      "Price Low to High",
      "Price High to Low",
    ],
    numberOfOrderPolls: 0,
    shouldShowOrderSummary: false,
    shouldShowPurchaseOrderDialog: false,
    shouldShowNoteDialog: false,
    shouldShowAddressFormDialog: false,
    shouldShowAddressConfirmationDialog: false,
    shouldShowOrderIssuesDialog: false,
    isAddressInvalid: false,
  }),
  computed: {
    isOrderView() {
      return !!this.singleCartId;
    },
    isOrderCompleted() {
      return (
        this.isOrderView && typeof this.$route.query.completed !== "undefined"
      );
    },
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

      return (
        isPollingShoppingCart ||
        isGettingShoppingList ||
        isUpdatingShippingAddress
      );
    },
    userToken() {
      return this.$store.state.user.authorization.token;
    },
    cartId() {
      return this.$store.getters["shoppinglist/shoppingCartId"];
    },
    cartItems() {
      if (this.isOrderView) {
        return this.singleCart ? this.singleCart.formatted_cart_items : [];
      }
      return this.$store.getters["shoppinglist/shoppingCart"];
    },
    sortedFilteredCartItems() {
      const itemsClone = this.cartItems.slice();
      return itemsClone
        .filter((item) => {
          if (this.itemsFilter) {
            const search = this.itemsFilter.toLowerCase();
            return (
              item.part_id.toLowerCase().indexOf(search) > -1 ||
              item.manufacturer_name.toLowerCase().indexOf(search) > -1 ||
              item.seller_name.toLowerCase().indexOf(search) > -1 ||
              item.price.toLowerCase().indexOf(search) > -1 ||
              (item.root_part &&
                item.root_part.notes &&
                item.root_part.notes.toLowerCase().indexOf(search) > -1)
            );
          }
          return true;
        })
        .sort((a, b) => {
          switch (this.selectedSort) {
            case "Part Number":
              return a.part_id.localeCompare(b.part_id);
            case "Seller A-Z":
              return a.seller_name.localeCompare(b.seller_name);
            case "Manufacturer A-Z":
              return a.manufacturer_name.localeCompare(b.manufacturer_name);
            case "Price Low to High":
              return parseFloat(a.price) - parseFloat(b.price);
            case "Price High to Low":
              return parseFloat(b.price) - parseFloat(a.price);
          }
        });
    },
    unavailableItems() {
      return this.$store.getters["shoppinglist/unavailableItems"];
    },
    cartItemsBySellerAndLocation() {
      return this.cartItems
        ? this.cartItems.reduce((acc, item) => {
            const key = `${item.seller_id}_${item.zip_code}`;
            if (!acc[key]) {
              acc[key] = {
                id: key,
                seller_name: item.seller_name,
                city_state: item.city_state,
                location: item.location,
                quantity: item.root_part_quantity,
                total: item.total_price * item.root_part_quantity,
              };
            } else {
              acc[key].quantity += item.root_part_quantity;
              acc[key].total =
                parseFloat(acc[key].total) +
                parseFloat(item.total_price * item.root_part_quantity);
            }

            return acc;
          }, {})
        : {};
    },
    orderNumbers() {
      return this.singleCart
        ? Object.values(
            this.singleCart.formatted_cart_items.reduce((acc, item) => {
              if (item.order_number && item.seller_name) {
                if (!acc[item.seller_name]) {
                  acc[item.seller_name] = {
                    sellerName: item.seller_name,
                    numbers: [item.order_number],
                  };
                } else if (
                  acc[item.seller_name].numbers.indexOf(item.order_number) ===
                  -1
                ) {
                  acc[item.seller_name].numbers.push(item.order_number);
                }
              }
              return acc;
            }, {})
          ).sort((a, b) => a.sellerName.localeCompare(b.sellerName))
        : {};
    },
    atLeastOneItemDoesntHaveOrderNumber() {
      return this.isOrderCompleted && !!this.cartItems
        ? typeof this.cartItems.find((i) => i.order_number === null) !==
            "undefined"
        : false;
    },
    shouldRefreshOrderData() {
      return this.isOrderCompleted
        ? !!this.cartItems &&
            this.cartItems.length > 0 &&
            this.atLeastOneItemDoesntHaveOrderNumber
        : false;
    },
    companyShop() {
      return this.$store.getters["company/companyShop"];
    },
    purchaseOrderDescription() {
      if (this.isOrderView) {
        return this.singleCart ? this.singleCart.po_description : null;
      }

      return this.$store.getters["shoppinglist/purchaseOrderDescription"];
    },
    note() {
      if (this.isOrderView) {
        return this.singleCart ? this.singleCart.note : null;
      }

      return this.$store.getters["shoppinglist/note"];
    },
    shippingAddress() {
      if (this.isOrderView) {
        return this.singleCart
          ? this.singleCart.formatted_shipping_address
          : {};
      }

      return this.$store.getters["shoppinglist/shippingAddress"];
    },
    companyName() {
      if (this.shippingAddress !== null) {
        return this.shippingAddress.name;
      }

      return this.companyShop &&
        this.companyShop[0] &&
        this.companyShop[0].company
        ? this.companyShop[0].company.name
        : null;
    },
    streetAddress1() {
      if (this.shippingAddress !== null) {
        return this.shippingAddress.street_1;
      }

      return this.companyShop &&
        this.companyShop[0] &&
        this.companyShop[0].address
        ? this.companyShop[0].address.street
        : null;
    },
    streetAddress2() {
      if (this.shippingAddress !== null) {
        return this.shippingAddress.street_2;
      }

      return this.companyShop &&
        this.companyShop[0] &&
        this.companyShop[0].address
        ? this.companyShop[0].address.apt
        : null;
    },
    city() {
      if (this.shippingAddress !== null) {
        return this.shippingAddress.city;
      }

      return this.companyShop &&
        this.companyShop[0] &&
        this.companyShop[0].address
        ? this.companyShop[0].address.city
        : null;
    },
    state() {
      if (this.shippingAddress !== null) {
        return this.shippingAddress.state;
      }

      return this.companyShop &&
        this.companyShop[0] &&
        this.companyShop[0].address
        ? this.companyShop[0].address.region
        : null;
    },
    zip() {
      if (this.shippingAddress !== null) {
        return this.shippingAddress.zip;
      }

      return this.companyShop &&
        this.companyShop[0] &&
        this.companyShop[0].address
        ? this.companyShop[0].address.postcode
        : null;
    },
    total() {
      return Object.values(this.cartItemsBySellerAndLocation).reduce(
        (acc, item) => {
          return parseFloat(acc) + parseFloat(item.total);
        },
        0
      );
    },
    totalWhole() {
      return Math.floor(this.total);
    },
    totalDecimal() {
      return String(Math.floor((this.total % 1).toFixed(4) * 100)).padStart(
        2,
        "0"
      );
    },
    isCheckingOut() {
      return this.$store.getters["shoppinglist/isCheckingOut"];
    },
    isPlacingOrder() {
      return this.$store.getters["shoppinglist/isPlacingOrder"];
    },
    hasOpticatFailed() {
      return this.$store.getters["shoppinglist/hasOpticatFailed"];
    },
    incompleteItems() {
      return this.$store.getters["shoppinglist/incompleteItems"];
    },
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initSingleCartData();
      }
    },
  },
  mounted() {
    this.initSingleCartData();
    this.shouldShowOrderSummary = this.$q.screen.gt.sm;
  },
  methods: {
    initSingleCartData(isPolling = false) {
      this.singleCartId = parseInt(this.$route.params.cartId, 10);
      if (this.singleCartId) {
        this.$store
          .dispatch("shoppinglist/getSingleCart", this.singleCartId)
          .then((cart) => {
            if (cart && cart.constructor === Object) {
              this.singleCart = cart;

              this.numberOfOrderPolls = isPolling
                ? this.numberOfOrderPolls + 1
                : this.numberOfOrderPolls;
              this.pollCompletedOrder();
            } else if (cart && cart === 404) {
              this.$router.push({ name: "404" });
            } else {
              this.notify(
                "An error occurred when attempting to retrieve order",
                "negative"
              );
            }
          });
      } else {
        this.singleCart = null;
      }
    },
    pollCompletedOrder() {
      if (this.shouldRefreshOrderData && this.numberOfOrderPolls < 10) {
        this.initSingleCartData(true);
      }
    },
    openAddressFormDialog() {
      this.addressFormData = {
        name: this.companyName,
        street1: this.streetAddress1,
        street2: this.streetAddress2,
        city: this.city,
        state: this.state,
        zip: this.zip,
      };

      this.currentAddress = Object.assign({}, this.addressFormData);

      this.shouldShowAddressFormDialog = true;
    },
    openAddressConfirmDialog(newAddress) {
      this.newAddress = newAddress;
      this.isAddressInvalid = false;
      this.shouldShowAddressConfirmationDialog = true;
    },
    backToAddressEntry() {
      this.shouldShowAddressConfirmationDialog = false;
      this.isAddressInvalid = true;
      this.shouldShowAddressFormDialog = true;
    },
    checkout() {
      this.$store
        .dispatch("shoppinglist/checkout", { cart_id: this.cartId })
        .then((issues) => {
          if (issues.length === 0) {
            this.placeOrder();
          } else {
            if (issues.indexOf("An Opticat error has occurred") > -1) {
              this.notify(
                "An error occurred when attempting to place this order",
                "negative"
              );
            } else {
              this.orderIssues = issues;
              this.shouldShowOrderIssuesDialog = true;
            }
          }
        });
    },
    placeOrder() {
      const cartId = this.cartId;
      this.$store
        .dispatch("shoppinglist/placeOrder", { cart_id: cartId })
        .then((res) => {
          if (res === "success") {
            this.notify(
              "Order placed successfully",
              "positive",
              "check_circle_outline"
            );

            this.$router.push(`/order/${cartId}?completed`);
          } else {
            this.notify(
              "An error occurred when attempting to place this order",
              "negative"
            );
          }
        });
    },
    // Download Order History
    async downloadOrder() {
      // Turn on modal
      this.loadingResults = true;
      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/order-history/pdf/download/${this.singleCartId}`;
      await axios
        .get(url, {
          responseType: "blob",
          headers: {
            "DL-Authorization": this.userToken,
          },
        })
        .then((response) => {
          //Create a Blob from the PDF Stream
          const file = new Blob([response.data], { type: "application/pdf" });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          window.open(fileURL);
        })
        .catch((err) => {
          this.notify("Error Downloading Order History", "negative");
        });
      // Turn off modal
      this.loadingResults = false;
    },

    async viewSelectedPart({ selectedPart }) {
      const partsCrossPart = await getPart({ id: selectedPart.root_part_uuid });

      this.$q.dialog({
        component: PartInfo,
        partProp: partsCrossPart.data,
      });
    },
  },
};
</script>

<style lang="scss">
.q-dialog {
  .q-dialog__backdrop {
    background: rgba(0, 0, 0, 0.75);
  }

  .q-dialog__inner--minimized {
    padding: 13px;
  }
}
</style>

<style lang="scss" scoped>
body {
  &:not(.body--dark) {
    .summary-container {
      .summary,
      .order-numbers {
        background-color: white;
      }

      .order-numbers {
        .numbers-container {
          .number-container {
            &:not(:first-child) {
              border-top-color: #f0f0f0;
            }
          }
        }
      }
    }
  }

  &.body--dark {
    .summary-container {
      .summary,
      .order-numbers {
        background-color: var(--q-color-dark);
      }

      .order-numbers {
        .numbers-container {
          .number-container {
            &:not(:first-child) {
              border-top-color: var(--q-color-accent);
            }
          }
        }
      }
    }
  }
}

.shopping-cart {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  padding-top: 7px;
  padding-bottom: 75px;

  @media (min-width: $breakpoint-md-min) {
    padding-top: 20px;
    padding-bottom: 105px;
  }

  .opticat-failure-warning,
  .shopping-cart-content {
    width: 100%;
    margin-right: 14px;
    margin-left: 14px;

    @media (min-width: $breakpoint-sm-min) {
      max-width: 907px !important;

      margin-right: 25px;
      margin-left: 25px;
    }
  }

  .opticat-failure-warning {
    align-self: center;

    margin-bottom: 24px;

    border-radius: 4px;

    padding: 20px;

    background-color: white;

    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12);

    .list {
      margin-top: 10px;

      ul {
        margin: 0;
      }
    }
  }

  .shopping-cart-content {
    @media (min-width: $breakpoint-sm-min) {
      display: flex;
      align-items: flex-start;
    }

    .cart-list-container,
    .summary-container,
    .unavailable-container {
      & > .heading {
        @media (min-width: $breakpoint-md-min) {
          margin-bottom: 20px;
        }

        & > .text-h5 {
          @media (max-width: $breakpoint-sm-max) {
            font-size: 16px;
            line-height: 36px;
          }
        }
      }
    }

    .cart-list-container,
    .summary-container {
      .order-sub-heading {
        margin-top: 14px;
        margin-bottom: 18px;

        @media (min-width: $breakpoint-md-min) {
          display: flex;
        }
      }
    }

    .cart-list-container {
      @media (min-width: $breakpoint-md-min) {
        width: calc(65% - 7px);
        margin-right: 14px;
      }

      & > .heading {
        @media (max-width: $breakpoint-sm-max) {
          display: flex;
          justify-content: space-between;
        }

        .left {
          .text-h5 {
            .order-label {
              @media (max-width: $breakpoint-sm-max) {
                display: none;
              }
            }
          }

          .sub-heading {
            &.has-order-date {
              @media (min-width: $breakpoint-md-min) {
                display: none;
              }
            }
          }
        }

        .right {
          @media (min-width: $breakpoint-md-min) {
            display: none;
          }
        }
      }

      .order-sub-heading {
        @media (max-width: $breakpoint-sm-max) {
          display: flex;
          flex-direction: column-reverse;
        }

        .q-select {
          margin-top: 12px;

          @media (min-width: $breakpoint-md-min) {
            min-width: 170px;
            margin-top: 0;
            margin-right: 14px;
          }
        }

        .q-input {
          @media (min-width: $breakpoint-md-min) {
            min-width: 250px;
          }

          i {
            font-size: 14px;
          }
        }
      }

      .cart-list {
        .shopping-cart-item {
          &:not(:first-child) {
            margin-top: 12px;
          }
        }
      }

      .unavailable-container {
        margin-top: 12px;

        @media (min-width: $breakpoint-md-min) {
          margin-top: 24px;
        }

        & > .heading {
          & > .text-h5 {
            @media (max-width: $breakpoint-sm-max) {
              font-size: 16px;
              line-height: 36px;
            }
          }
        }

        .unavailable-list {
          display: flex;
          flex-wrap: wrap;

          .shopping-list-item {
            width: 100%;

            @media (min-width: $breakpoint-md-min) {
              width: calc(50% - 6px);
            }

            &:not(:first-child) {
              margin-top: 12px;

              @media (min-width: $breakpoint-md-min) {
                margin-top: 0;
              }
            }

            &:not(:nth-child(2n)) {
              @media (min-width: $breakpoint-md-min) {
                margin-right: 12px;
              }
            }

            &:nth-child(n + 3) {
              @media (min-width: $breakpoint-md-min) {
                margin-top: 12px;
              }
            }
          }
        }
      }
    }

    .summary-container {
      @media (min-width: $breakpoint-md-min) {
        width: calc(35% - 7px);
      }

      & > .heading {
        @media (max-width: $breakpoint-sm-max) {
          display: none;
        }
      }

      & > .order-sub-heading {
        flex-direction: row-reverse;

        @media (max-width: $breakpoint-sm-max) {
          display: none;
        }
      }

      .summary,
      .order-numbers {
        @media (min-width: $breakpoint-md-min) {
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2),
            0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
        }
      }

      .summary {
        @media (max-width: $breakpoint-sm-max) {
          position: fixed;
          right: 0;
          bottom: 28px;
          left: 0;
          z-index: 99;
        }

        @media (min-width: $breakpoint-md-min) {
          border-radius: 4px;
          overflow: hidden;
        }

        .powered-by-opticat {
          display: flex;
          justify-content: center;

          padding: 8px;

          background-color: $primary;

          @media (max-width: $breakpoint-sm-max) {
            box-shadow: 0 -2px 8px 0 rgba(0, 0, 0, 0.26);
          }

          img {
            height: 12px;
          }
        }

        .main-content {
          padding: 12px 10px 26px 13px;

          @media (min-width: $breakpoint-md-min) {
            padding: 28px 20px 30px;
          }

          .itemized-list {
            table {
              width: 100%;
              border-collapse: collapse;

              thead tr th,
              tbody tr td {
                @media (max-width: $breakpoint-sm-max) {
                  font-size: 12px;
                  line-height: normal;
                }
              }

              thead {
                tr {
                  th {
                    @media (max-width: $breakpoint-sm-max) {
                      padding-bottom: 5px;
                    }

                    &:first-child {
                      text-align: left;
                    }
                  }
                }
              }

              tbody {
                tr {
                  background-color: transparent;

                  td {
                    border: solid 1px $primary;
                    padding: 7px;

                    &:first-child {
                      .seller-name {
                        font-weight: 700;
                      }
                    }

                    &:nth-child(2) {
                      min-width: 40px;
                      text-align: center;
                    }

                    &:last-child {
                      text-align: right;
                    }
                  }
                }
              }
            }
          }

          .shipping-address,
          .purchase-order,
          .order-note {
            .heading,
            .link {
              font-size: 12px;
              line-height: 1.2;

              @media (min-width: $breakpoint-md-min) {
                font-size: 13px;
              }
            }

            .heading {
              margin-bottom: 4px;
              font-weight: 700;
            }

            .link {
              margin-top: 6px;
              color: $primary;
              text-decoration: underline;
            }
          }

          .shipping-address {
            margin-top: 18px;

            @media (min-width: $breakpoint-md-min) {
              margin-top: 34px;
            }

            .company-name,
            .address {
              font-size: 12px;

              @media (min-width: $breakpoint-md-min) {
                font-size: 13px;
              }
            }

            .company-name,
            .address {
              line-height: 18px;
            }
          }

          .purchase-order,
          .order-note {
            margin-top: 22px;
          }
        }

        .total-confirm {
          padding: 8px 16px 8px 14px;

          background-color: black;
          color: white;

          @media (max-width: $breakpoint-sm-max) {
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
            align-items: center;
          }

          @media (min-width: $breakpoint-md-min) {
            padding: 20px 20px 24px;
          }

          .total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-right: 4px;

            .value {
              margin-left: 20px;
              font-weight: 700;

              .symbol,
              .decimal {
                position: relative;
                top: -0.5em;
                font-size: 12px;
              }

              .whole {
                font-size: 20px;
                line-height: 20px;
              }
            }

            .icon-container {
              margin-right: -7px;
              margin-left: 19px;

              padding: 0 7px;

              @media (min-width: $breakpoint-md-min) {
                display: none;
              }

              i {
                font-size: 16px;
              }
            }
          }

          .confirm {
            @media (min-width: $breakpoint-md-min) {
              margin-top: 18px;
            }

            &.has-order-number {
              @media (min-width: $breakpoint-md-min) {
                display: none;
              }
            }

            .order-number {
              font-weight: 700;
            }
          }
        }
      }

      .order-numbers {
        margin-top: 16px;
        border-radius: 4px;
        overflow: hidden;

        @media (max-width: $breakpoint-sm-max) {
          display: none;
        }

        .top {
          padding: 4px 20px;

          background-color: $primary;
          color: black;

          font-weight: 700;
        }

        .numbers-container {
          padding-right: 20px;
          padding-left: 20px;

          .number-container {
            padding-top: 20px;
            padding-bottom: 20px;

            font-size: 13px;

            &:not(:first-child) {
              border-top-style: solid;
              border-top-width: 1px;
            }

            .seller-name {
              font-weight: 700;
            }
          }
        }
      }
    }
  }
}

.order-issues-dialog {
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

  .content {
    .text {
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
