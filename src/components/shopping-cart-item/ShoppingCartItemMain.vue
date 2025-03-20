<template>
  <div class="shopping-cart-item-main">
    <LoadingOverlay
      :loadingProp="
        isAddingPartToShoppingList || isGettingSellerInfo
      "
      bgOpacity="5"
    />

    <div
      :class="{
        'swapped-container': isSwappedPart && item.root_part,
        'completed-container': isOrderCompleted,
        'failed-container':
          order && !item.order_number && item.is_order_processed,
      }"
      v-if="
        (isSwappedPart && item.root_part) ||
        isOrderCompleted ||
        (order && !item.order_number && item.is_order_processed)
      "
    >
      <i :class="{
          'far fa-exchange': isSwappedPart && item.root_part,
          'far fa-check': isOrderCompleted,
          'fas fa-exclamation-triangle':
            order && !item.order_number && item.is_order_processed,
        }" />
      <q-tooltip v-if="isSwappedPart && item.root_part">
        This item has been swapped
      </q-tooltip>
      <q-tooltip v-else-if="order && !item.order_number && item.is_order_processed">
        This item could not be ordered
      </q-tooltip>
    </div>

    <div
      class="item-content"
      :class="{ loading: isLoading }"
    >
      <div class="left">
        <div class="info-quantity-image">
          <div class="info-quantity">
            <div class="manufacturer">
              {{ item.manufacturer_name }}
            </div>

            <div class="part-number">
              {{ item.part_id }}
            </div>

            <div
              class="quantity"
              v-if="!displayOnly && !equivalentPart"
            >
              <q-select
                :options="quantityOptions"
                :value="item.quantity"
                @input="onQuantityChange"
                :loading="isQuantityUpdateLoading"
                :disable="isOrderCompleted"
                outlined
              />
            </div>

            <div
              class="description-notes"
              v-else-if="item.root_part"
            >
              <div class="description">
                {{ item.root_part.description }}
              </div>
              <div class="notes patrick-hand-font">
                {{ item.root_part.notes }}
              </div>
            </div>
          </div>

          <div class="image-container">
            <div
              class="image"
              :style="`background-image: url('${item.root_part.image_url}')`"
              v-if="
                !isSwappedPart && item.root_part && item.root_part.image_url
              "
            />
            <div
              class="placeholder"
              v-else
            >
              <i class="far fa-image fa-fw fa-2x" />
            </div>
          </div>
        </div>

        <div
          class="description-notes"
          v-if="!displayOnly && !equivalentPart && item.root_part"
        >
          <div class="description">
            {{ item.root_part.description }}
          </div>
          <div class="notes patrick-hand-font">
            {{ item.root_part.notes }}
          </div>
        </div>
      </div>
      <div class="right">
        <div class="seller-info">
          <div class="name">
            {{ item.seller_name }}
          </div>
          <div class="city-state">
            {{ item.location }}
          </div>
          <div class="price-delivery-time">
            <div class="price">
              <span class="symbol">$</span>
              <span class="whole">{{ priceWhole }}</span>
              <span class="decimal">{{ priceDecimal }}</span>
            </div>
            <div class="delivery-time">
              <span class="symbol">
                <i class="far fa-clock" />
              </span>
              <span class="time">
                {{ deliveryTime }}
              </span>
            </div>
          </div>
          <div class="core-price" v-if="priceCore">
            + Core {{ priceCore }}
          </div>
        </div>

        <div
          class="other-options"
          v-if="shouldShowOtherOptions"
        >
          <div class="button-container">
            <ButtonStandard
              class="q-px-sm"
              :label="otherOptionsObject.buttonText"
              :tooltip="otherOptionsObject.buttonTooltip"
              size="sm"
              style-extend="padding-top: 2px; padding-bottom: 2px;"
              @click.native="otherOptionsObject.buttonAction"
              v-if="otherOptionsObject.buttonConditional"
            />
          </div>

          <div class="context-menu">
            <div class="icon-container cursor-pointer">
              <i class="far fa-ellipsis-v" />
              <q-tooltip>View Options</q-tooltip>
            </div>
            <q-menu
              content-class="options-container"
              anchor="top left"
              self="bottom right"
              auto-close
            >
              <template v-for="(item, i) in otherOptionsObject.contextMenuItems">
                <q-separator
                  :key="`separator_${i}`"
                  v-if="i !== 0"
                />
                <q-item
                  @click="item.action"
                  :key="`context_menu_item_${i}`"
                  clickable
                >
                  <q-item-section avatar>
                    <i :class="item.iconClasses" />
                  </q-item-section>
                  <q-item-section>{{ item.label }}</q-item-section>
                </q-item>
              </template>
            </q-menu>
          </div>
        </div>

        <div
          class="equivalent-parts-options"
          v-if="equivalentPart"
        >
          <div class="checkbox-container">
            <q-checkbox
              ref="selectBox"
              v-model="item.selected"
              :toggle-indeterminate="false"
              @input="$emit('select')"
            />
          </div>

          <equivalent-part-context-menu
            :part="item"
            @select="$refs.selectBox.toggle()"
            @add-to-cart="$emit('add-to-cart')"
          />
        </div>

        <div
          class="loading-state"
          v-if="isLoading"
        >
          <div class="icon-container">
            <i class="fas fa-cog fa-spin" />
          </div>
          <div class="text">Getting updates...</div>
        </div>
      </div>
    </div>

    <div
      :class="{
        'swapped-footer': isSwappedPart && item.root_part,
        'order-footer': order,
      }"
      v-if="(isSwappedPart && item.root_part) || order"
    >
      <template v-if="isSwappedPart && item.root_part && !order">
        <i class="far fa-exchange fa-fw" />
        Swapped for shopping list part
        <span class="root-part-manufacturer-name">
          {{ item.root_part.root_manufacturer_name }}
        </span>
        <span class="root-part-number">{{
          item.root_part.root_part_number
        }}</span>
      </template>
      <template v-else-if="item.order_number">
        Item Order #{{ item.order_number }}
      </template>
      <template v-else-if="item.is_order_processed">
        <i class="fas fa-exclamation-triangle" />
        There was an error in ordering this item
      </template>
      <template v-else>
        <q-spinner
          color="white"
          size="1em"
        />
      </template>
    </div>

    <shopping-cart-item-note
      :part="item"
      v-model="shouldShowNoteDialog"
    />

    <cart-item-seller-info-dialog
      :seller-info="sellerInfo"
      v-model="shouldShowSellerInfoDialog"
    />

    <cart-item-delete-dialog
      :item="item"
      v-model="shouldShowDeleteDialog"
    />
  </div>
</template>

<script>
import ButtonStandard from "components/common/ButtonStandard";
import ShoppingCartItemNote from "components/shopping-cart-item/ShoppingCartItemNote";
import EquivalentPartContextMenu from "components/shopping-cart-item/EquivalentPartContextMenu";
import { Notify } from "src/mixins/Notify";
import CartItemSellerInfoDialog from "components/dialogs/CartItemSellerInfoDialog";
import PartInfo from "components/PartInfo";
import LoadingOverlay from "components/common/LoadingOverlay";
import CartItemDeleteDialog from "components/dialogs/CartItemDeleteDialog";
import { getPart } from "src/services/TruckPartsCross";

export default {
  name: "ShoppingCartItemMain",
  components: {
    CartItemDeleteDialog,
    CartItemSellerInfoDialog,
    EquivalentPartContextMenu,
    ShoppingCartItemNote,
    ButtonStandard,
    LoadingOverlay,
  },
  mixins: [Notify],
  props: {
    item: {
      type: Object,
      required: true,
    },
    loading: Boolean,
    displayOnly: Boolean,
    equivalentPart: Boolean,
    order: Boolean,
  },
  data: () => ({
    quantityUpdateTimeout: null,
    sellerInfo: {},
    isQuantityUpdateLoading: false,
    shouldShowNoteDialog: false,
    shouldShowSellerInfoDialog: false,
    isGettingSellerInfo: false,
    shouldShowDeleteDialog: false,
  }),
  computed: {
    isSwappedPart() {
      return !this.equivalentPart && !this.item.is_root_part;
    },
    isOrderCompleted() {
      return typeof this.$route.query.completed !== "undefined";
    },
    quantityOptions() {
      if (this.item && this.item.root_part && this.item.root_part.quantity_available) {
        return [...Array(this.item.root_part.quantity_available + 1).keys()].slice(1);
      }

      return [1];
    },
    deliveryTime() {
      return this.item.availability > 24
        ? (Math.round(this.item.availability / 24) === 1
          ? `${Math.round(this.item.availability / 24)} Day`
          : `${Math.round(this.item.availability / 24)} Days`)
        : (parseInt(this.item.availability, 10) === 1
          ? `${this.item.availability} Hr`
          : `${this.item.availability} Hrs`);
    },
    priceCore() {
      if (this.item.core_price && !!parseFloat(this.item.core_price)) {
        const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        });

        return formatter.format(this.item.core_price);
      }

      return null;
    },
    priceWhole() {
      return Math.floor(this.item.price);
    },
    priceDecimal() {
      return String(
        Math.floor((this.item.price % 1).toFixed(4) * 100)
      ).padStart(2, "0");
    },
    shouldShowOtherOptions() {
      return (!this.displayOnly && !this.equivalentPart) || this.order;
    },
    otherOptionsObject() {
      let shoppingCartContextMenuItems = [
        {
          iconClasses: "fas fa-pencil fa-fw",
          label: "Note",
          action: () => (this.shouldShowNoteDialog = true),
        },
        {
          iconClasses: "fas fa-trash-alt fa-fw",
          label: "Delete",
          action: () => (this.shouldShowDeleteDialog = true),
        },
      ];

      const shouldShowEquivalentParts =
        this.item.equivalent_parts && this.item.equivalent_parts.length > 0;

      if (shouldShowEquivalentParts) {
        shoppingCartContextMenuItems.splice(1, 0, {
          iconClasses: "fas fa-ballot fa-fw",
          label: "Other Options",
          action: () => this.$emit("open-matrix"),
        });
      }

      return {
        buttonText: !this.order ? "Other options" : "Order assistance",
        buttonTooltip: !this.order
          ? "View other options"
          : "Get assistance from seller",
        buttonAction: !this.order
          ? () => this.$emit("open-matrix")
          : () => this.getSellerInfo(),
        buttonConditional: !this.order ? shouldShowEquivalentParts : true,
        contextMenuItems: !this.order
          ? shoppingCartContextMenuItems
          : [
              {
                iconClasses: "fas fa-question fa-fw",
                label: "Order Assistance",
                action: () => this.getSellerInfo(),
              },
              {
                iconClasses: "far fa-search fa-fw",
                label: "View Part",
                action: async () => {
                  const part = await getPart({
                    id: this.item.diesel_root_part_id,
                  });

                  this.$q.dialog({
                    component: PartInfo,
                    partProp: part.data,
                  });
                },
              },
              {
                iconClasses: "far fa-list-alt fa-fw",
                label: "Add to Shopping List",
                action: () => this.addPartToShoppingList(),
              },
            ],
      };
    },
    hasTriggeredOpticatRequestsForListItems() {
      return this.$store.getters[
        "shoppinglist/hasTriggeredOpticatRequestsForListItems"
      ];
    },
    isPollingShoppingCart() {
      return this.$store.getters["shoppinglist/isPollingShoppingCart"];
    },
    isCartItemQuantityBeingUpdated() {
      return this.$store.getters["shoppinglist/isCartItemQuantityBeingUpdated"](
        this.item.id
      );
    },
    isLoading() {
      return (
        !this.isOrderCompleted &&
        (this.loading ||
          this.isCartItemQuantityBeingUpdated ||
          this.hasTriggeredOpticatRequestsForListItems ||
          this.isPollingShoppingCart)
      );
    },
    isAddingPartToShoppingList() {
      return this.$store.getters["shoppinglist/isAddingPartToShoppingList"](
        this.item.diesel_root_part_id
      );
    },
  },
  methods: {
    onQuantityChange(newQuantity) {
      this.isQuantityUpdateLoading = true;

      if (this.quantityUpdateTimeout) {
        window.clearTimeout(this.quantityUpdateTimeout);
        this.quantityUpdateTimeout = null;
      }

      this.quantityUpdateTimeout = window.setTimeout(() => {
        this.updateQuantity(newQuantity);
      }, 2000);
    },
    updateQuantity(newQuantity) {
      const formData = {
        cart_item_id: this.item.id,
        quantity: newQuantity,
      };

      this.$store
        .dispatch("shoppinglist/updateCartItemQuantity", formData)
        .then((res) => {
          this.isQuantityUpdateLoading = false;

          if (res === "success") {
            this.notify(
              "Part quantity updated successfully",
              "positive",
              "check_circle_outline"
            );
          } else if (res === "repeat") {
            this.notify("Part quantity is already being updated", "negative");
          } else {
            this.notify(
              "An error occurred when attempting to update part quantity",
              "negative"
            );
          }
        });
    },
    addPartToShoppingList() {
      const formData = {
        root_part_number: this.item.root_part.root_part_number,
        root_manufacturer_name: this.item.root_part.root_manufacturer_name,
        root_manufacturer_code: this.item.root_part.root_manufacturer_code,
        root_part_uuid: this.item.diesel_root_part_id,
        notes: this.item.root_part.notes,
        description: this.item.root_part.description,
        order: "0",
        opticat_brand_code: this.item.root_part.opticat_brand_code,
        image_url: this.item.root_part.image_url,
      };

      this.$store
        .dispatch("shoppinglist/addPartToShoppingList", formData)
        .then((res) => {
          if (res === "error") {
            this.notify(
              "An error occurred when attempting to add item to shopping list",
              "negative"
            );
          } else {
            this.notify(
              "Part successfully added to shopping list",
              "positive",
              "check_circle_outline"
            );
          }
        });
    },
    getSellerInfo() {
      this.isGettingSellerInfo = true;
      this.$store
        .dispatch("shoppinglist/getSellerInfo", {
          sellerId: this.item.seller_id,
          locationName: this.item.location,
        })
        .then((res) => {
          this.isGettingSellerInfo = false;
          if (res !== "error") {
            this.sellerInfo = res;
            this.shouldShowSellerInfoDialog = true;
          } else {
            this.notify(
              "An error occurred when attempting to get seller information",
              "negative"
            );
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  &:not(.body--dark) {
    .shopping-cart-item-main {
      background-color: white;

      .item-content {
        .left {
          .info-quantity-image {
            .image-container {
              .image,
              .placeholder {
                background-color: #eaeaea;
              }

              .placeholder {
                color: white;
              }
            }
          }
        }
      }
    }
  }

  &.body--dark {
    .shopping-cart-item-main {
      background-color: var(--q-color-dark);

      .item-content {
        .left {
          .info-quantity-image {
            .image-container {
              .image,
              .placeholder {
                background-color: #444444;
              }

              .placeholder {
                color: #666666;
              }
            }
          }
        }
      }
    }
  }
}

.shopping-cart-item-main {
  position: relative;

  border-radius: 4px;

  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);

  box-sizing: border-box;

  overflow: auto;

  .swapped-container,
  .completed-container,
  .failed-container {
    position: absolute;
    top: 0;
    left: 0;

    padding: 4px 30px 30px 8px;

    z-index: 1;

    clip-path: polygon(0 0, 0 84%, 100% 0);

    i {
      font-size: 12px;
      line-height: 1;
    }
  }

  .swapped-container {
    background-color: $primary;
    color: black;
  }

  .completed-container {
    background-color: #43be00;
    color: white;
  }

  .failed-container {
    background-color: #be1e2d;
    color: white;
  }

  .item-content {
    margin-bottom: 30px;

    @media (min-width: $breakpoint-md-min) {
      display: flex;
      margin-bottom: 17px;
    }

    &.loading {
      @media (max-width: $breakpoint-sm-max) {
        display: flex;
        flex-direction: column-reverse;
      }

      .right {
        @media (max-width: $breakpoint-sm-max) {
          max-height: 70px;
          margin-top: 0;
        }

        .other-options {
          @media (max-width: $breakpoint-sm-max) {
            display: none;
          }
        }
      }
    }

    .left {
      padding: 40px 16px 0;

      @media (min-width: $breakpoint-md-min) {
        width: calc(60% - 12px);
        margin-right: 24px;
        padding-right: 0;
        padding-left: 14px;
      }

      .info-quantity-image {
        display: flex;
        justify-content: space-between;

        .info-quantity {
          margin-right: 14px;

          .manufacturer {
            line-height: 20px;
          }

          .part-number {
            font-size: 20px;
            line-height: 20px;
            font-weight: 500;
          }

          .quantity {
            display: flex;
            margin-top: 20px;
          }
        }

        .image-container {
          flex-shrink: 0;

          height: 80px;
          width: 80px;

          .image {
            height: 100%;
            width: 100%;
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
          }

          .placeholder {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            height: 100%;
            width: 100%;
          }
        }
      }

      .description-notes {
        margin-top: 16px;
      }
    }

    .right {
      position: relative;
      margin-top: 30px;
      padding: 0 16px 0 16px;

      @media (min-width: $breakpoint-md-min) {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        width: calc(40% - 12px);

        margin-top: 0;

        padding-top: 40px;
        padding-right: 14px;
        padding-left: 0;
      }

      .seller-info {
        border: 1px solid $primary;
        padding: 8px 16px 10px;

        .name {
          font-size: 16px;
          line-height: 16px;
          font-weight: 700;
        }

        .city-state {
          margin-top: 2px;
          font-size: 14px;
          line-height: 16px;
        }

        .price-delivery-time {
          display: flex;
          margin-top: 8px;

          .price .symbol,
          .price .decimal,
          .delivery-time .symbol {
            position: relative;
            top: -0.5em;
            font-size: 12px;
          }

          .price {
            margin-right: 20px;
            color: #be1e2d;
            font-weight: 700;

            .whole {
              font-size: 20px;
              line-height: 20px;
            }
          }

          .delivery-time {
            .time {
              font-size: 16px;
              line-height: 16px;
              font-weight: 700;
            }
          }
        }

        .core-price {
          font-size: 12px;
          line-height: 14px;
        }
      }

      .other-options {
        display: flex;
        justify-content: space-between;
        align-items: center;

        margin-top: 20px;

        .context-menu {
          .icon-container {
            margin-right: -10px;
            padding: 0 10px;

            i {
              font-size: 20px;
            }
          }
        }
      }

      .equivalent-parts-options {
        display: flex;
        justify-content: space-between;
        align-items: center;

        margin-top: 20px;
      }

      .loading-state {
        position: absolute;
        top: 0;
        right: 0;
        bottom: -30px;
        left: 0;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: $primary;
        color: black;

        @media (min-width: $breakpoint-md-min) {
          bottom: -17px;
          left: -1px;
        }

        .icon-container {
          i {
            font-size: 24px;
          }
        }

        .text {
          font-size: 14px;
          line-height: 1.43;
          font-weight: 700;
        }
      }
    }
  }

  .swapped-footer,
  .order-footer {
    padding: 10px 13px;

    background-color: black;
  }

  .swapped-footer {
    color: $primary;

    .root-part-manufacturer-name,
    .root-part-number {
      color: white;
    }

    .root-part-number {
      font-weight: 500;
    }
  }

  .order-footer {
    font-size: 13px;
    color: white;

    @media (max-width: $breakpoint-sm-max) {
      text-align: center;
    }
  }
}

.options-container {
  margin-left: -35px;
  border-right: solid 7px $primary;

  .q-item {
    i {
      color: #cccccc;
    }
  }
}
</style>
