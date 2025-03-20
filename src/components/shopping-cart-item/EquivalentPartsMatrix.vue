<template>
  <q-dialog
    ref="dialog"
    class="equivalent-parts-matrix"
    @show="onShow"
    v-model="computedValue"
  >
    <div class="equivalent-parts-container">
      <div class="top">
        <div class="heading">
          Current Selection
        </div>
        <a class="close" @click="close">
          Close
          <i class="far fa-times"></i>
        </a>
      </div>
      <q-card class="current-selection">
        <shopping-cart-item-main :item="current" display-only />
      </q-card>
      <div class="heading">
        Other Options
      </div>
      <q-card class="other-options">
        <!-- Mobile Slider View -->
        <div ref="swiper" class="swiper-container">
          <div class="swiper-wrapper">
            <shopping-cart-item-main
              class="swiper-slide"
              :item="part"
              :key="`mobile_eq_part_${part.id}`"
              @select="onCheckboxClicked(part, i)"
              @add-to-cart="addPartToCart(part)"
              v-for="(part, i) in current.equivalent_parts"
              equivalent-part
            />
          </div>
        </div>

        <!-- Desktop Table View -->
        <table>
          <thead>
          <tr :class="{ 'first-body-row-selected': firstRowIsSelected }">
            <th>Select</th>
            <th>Part</th>
            <th>Seller</th>
            <th>Delivery</th>
            <th>Price</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr
            :class="{
              selected: part.selected,
              'next-selected': part.next_is_selected
            }"
            :key="`eq_part_${part.id}`"
            v-for="(part, i) in current.equivalent_parts"
          >
            <td>
              <q-checkbox
                ref="selectBox"
                v-model="part.selected"
                :toggle-indeterminate="false"
                @input="onCheckboxClicked(part, i)"
              />
            </td>
            <td>
              <div>{{ part.manufacturer_name }}</div>
              <div class="text-bold">{{ part.part_id }}</div>
              <div>{{ part.description }}</div>
            </td>
            <td>
              <div class="text-bold">{{ part.seller_name }}</div>
              <div>{{ part.location }}</div>
            </td>
            <td class="delivery">
              <span class="time">{{ getDeliveryTime(part) }}</span>
              <span class="more-or-less" v-if="!getIsSameDeliveryTime(part)">
                <i
                  class="far fa-fw"
                  :class="{
                    'fa-arrow-down': getIsBetterDeliveryTime(part),
                    'fa-arrow-up': !getIsBetterDeliveryTime(part)
                  }"
                />
              </span>
            </td>
            <td class="price">
              <span class="number">
                {{ new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format( part.price) }}
              </span>
              <span class="more-or-less" v-if="!getIsSamePrice(part)">
                <i
                  class="far fa-fw"
                  :class="{
                    'fa-arrow-down': getIsBetterPrice(part),
                    'fa-arrow-up': !getIsBetterPrice(part)
                  }"
                />
              </span>
            </td>
            <td>
              <equivalent-part-context-menu
                :part="part"
                @select="selectCheckbox(part, i)"
                @add-to-cart="addPartToCart(part)"
              />
            </td>
          </tr>
          </tbody>
        </table>
      </q-card>
      <div class="actions">
        <q-btn
          class="text-bold"
          label="Cancel"
          color="white"
          style="font-size: 12px;"
          v-close-popup
          no-caps
          outline
          dense
        />
        <q-btn
          class="text-bold"
          label="Update"
          color="primary"
          text-color="black"
          @click="update"
          style="font-size: 12px;"
          :loading="isUpdatingShoppingCartPart"
          :disabled="!selectedPartId"
          no-caps
          dense
        />
      </div>
    </div>
  </q-dialog>
</template>

<script>
import Swiper from "swiper";
import ShoppingCartItemMain
  from "components/shopping-cart-item/ShoppingCartItemMain";
import {Notify} from "src/mixins/Notify";
import EquivalentPartContextMenu
  from "components/shopping-cart-item/EquivalentPartContextMenu";

export default {
  name: "EquivalentPartsMatrix",
  components: {EquivalentPartContextMenu, ShoppingCartItemMain },
  mixins: [Notify],
  props: {
    current: {
      type: Object,
      required: true
    },
    value: Boolean
  },
  data: () => ({
    currentSliderItem: 0,
    selectedPartId: null,
    isLoadingUpdate: false
  }),
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    firstRowIsSelected() {
      return (
        this.current &&
        this.current.equivalent_parts &&
        this.current.equivalent_parts[0] &&
        this.current.equivalent_parts[0].selected
      );
    },
    isUpdatingShoppingCartPart() {
      return this.$store.getters["shoppinglist/isUpdatingShoppingCartPart"];
    }
  },
  methods: {
    onShow() {
      if (this.$refs.swiper && this.$q.screen.lt.md) {
        new Swiper(this.$refs.swiper, {
          slidesPerView: 1.15,
          spaceBetween: 10
        });
      }
    },
    selectCheckbox(part, index) {
      if (
        !part.selected &&
        this.$refs.selectBox &&
        this.$refs.selectBox.length &&
        this.$refs.selectBox[index]
      ) {
        this.$refs.selectBox[index].toggle();
      }
    },
    onCheckboxClicked(part, index) {
      if (part.selected) {
        this.selectedPartId = part.id;
        this.current.equivalent_parts.forEach((p, i) => {
          if (p.id !== this.selectedPartId) {
            p.selected = false;
          }

          p.next_is_selected = i === index - 1;
        });
      } else {
        this.current.equivalent_parts.forEach(p => {
          p.next_is_selected = false;
        });
        this.selectedPartId = null;
      }
    },
    getDeliveryTime(part) {
      return part.availability > 24
        ? (Math.round(part.availability / 24) === 1
          ? `${Math.round(part.availability / 24)} Day`
          : `${Math.round(part.availability / 24)} Days`)
        : (parseInt(part.availability, 10) === 1
          ? `${part.availability} Hr`
          : `${part.availability} Hrs`);
    },
    getIsSameDeliveryTime(part) {
      return part.availability === this.current.availability;
    },
    getIsBetterDeliveryTime(part) {
      return part.availability < this.current.availability;
    },
    getIsSamePrice(part) {
      return part.price === this.current.price;
    },
    getIsBetterPrice(part) {
      return parseFloat(part.price) < parseFloat(this.current.price);
    },
    close() {
      this.$refs.dialog.hide();
    },
    addPartToCart(part) {
      this.$store.dispatch("shoppinglist/addCartItemNotInList", part.id)
        .then((isSuccess) => {
          if (isSuccess) {
            this.notify(
              "Part successfully added to cart",
              "positive",
              "check_circle_outline"
            );
          } else {
            this.notify(
              "An error occurred when attempting to add part to cart",
              "negative"
            );
          }
        });
    },
    update() {
      this.$store.dispatch("shoppinglist/updateShoppingCartPart", this.selectedPartId)
        .then(cartOrError => {
          if (cartOrError === "error") {
            this.notify(
              "An error occurred when attempting to select part",
              "negative"
            );
          } else {
            this.notify(
              "Part selected successfully",
              "positive",
              "check_circle_outline"
            );
            this.close();
          }
        });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~swiper/swiper.scss";
.q-dialog {
  .equivalent-parts-container {
    box-shadow: none;

    @media (max-width: $breakpoint-sm-max) {
      width: 100%;
    }

    @media (min-width: $breakpoint-md-min) {
      min-width: 615px;
    }

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;

      .close {
        display: flex;
        align-items: center;
        cursor: pointer;

        i {
          margin-left: 8px;
          font-size: 20px;
        }
      }
    }

    .heading {
      font-size: 16px;
      line-height: 36px;
      font-weight: 700;
      color: white;

      &:not(:first-child) {
        margin-top: 14px;
      }
    }

    .other-options {
      @media (max-width: $breakpoint-sm-max) {
        border-radius: 0;
        background-color: transparent;
        box-shadow: none;
      }

      @media (min-width: $breakpoint-md-min) {
        padding: 13px;
      }

      .swiper-container {
        overflow: hidden;

        @media (min-width: $breakpoint-md-min) {
          display: none;
        }
      }

      table {
        width: 100%;
        border: solid 1px #D5D5D5;
        border-collapse: collapse;

        @media (max-width: $breakpoint-sm-max) {
          display: none;
        }

        thead tr th,
        tbody tr td {
          border: solid 1px #D5D5D5;
          font-size: 13px;
          line-height: 16px;
        }

        thead {
          tr {
            &.first-body-row-selected {
              th {
                border-bottom: solid 1px $primary;
              }
            }

            th {
              padding: 4px 9px 3px 9px;
              text-align: left;
            }
          }
        }

        tbody {
          tr {
            &.selected {
              td {
                border-color: $primary;
              }
            }

            &.next-selected {
              td {
                border-bottom: solid 1px $primary;
              }
            }

            &:nth-child(odd),
            &:nth-child(even) {
              background-color: transparent;
            }

            td {
              padding: 11px 9px;

              &.delivery,
              &.price {
                white-space: nowrap;

                .more-or-less {
                  margin-left: 12px;

                  .fa-arrow-down {
                    color: #43BE00;
                  }

                  .fa-arrow-up {
                    color: #be1e2d;
                  }
                }
              }

              &.price {
                color: #be1e2d;
                font-weight: 700;
              }
            }
          }
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;

      .q-btn {
        min-width: 130px;

        @media (max-width: $breakpoint-sm-max) {
          width: calc(50% - 6px);
        }

        &:not(:first-child) {
          margin-left: 12px;

          @media (min-width: $breakpoint-md-min) {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
