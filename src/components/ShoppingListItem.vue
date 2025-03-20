<template>
  <div class="shopping-list-item">
    <div class="unavailable-container" v-if="!item.available">
      <i class="fas fa-exclamation-triangle" />
      <q-tooltip>
        {{ item.unavailable_reason || "This part is not available" }}
      </q-tooltip>
    </div>
    <!-- Top Section with Manufacturer, Part #, Quantity, and Image -->
    <div class="top row no-wrap justify-between">
      <div class="info">
        <div class="manufacturer">
          {{ item.root_manufacturer_name }}
        </div>

        <div class="part-number text-h6 text-weight-medium" @click="$emit('view')">
          {{ item.root_part_number }}
        </div>

        <div class="quantity q-mt-md" v-if="!unavailable">
          <q-select
            :options="quantityOptions"
            :value="item.quantity"
            :loading="item.isQuantityUpdateLoading"
            @input="$emit('change-quantity', $event)"
            outlined
          />
        </div>
        <div class="description q-mt-sm" v-else>
          {{ item.description }}
        </div>
      </div>
      <div class="image-container q-ml-md">
        <div class="image" :style="`background-image: url('${item.image_url}')`" v-if="item.image_url" />
        <div class="placeholder" v-else>
          <i class="far fa-image fa-fw fa-2x" />
        </div>
      </div>
    </div>

    <!-- Bottom Section with Description, Notes, and Options -->
    <div class="bottom row no-wrap justify-between items-end q-mt-md" v-if="!unavailable">
      <div class="description-notes">
        <div class="description">
          {{ item.description }}
        </div>
        <div class="notes patrick-hand-font">
          {{ item.notes }}
        </div>
      </div>
      <shopping-list-item-context-menu
        :add-or-edit-notes="addOrEditNotes"
        :show-re-add="item.has_been_removed_from_cart"
        @notes-click="$emit('notes-click', addOrEditNotes)"
        @re-add="reAddToCart"
        @remove="$emit('remove')"
        v-if="!unavailable"
      />
    </div>
  </div>
</template>

<script>
import ShoppingListItemContextMenu
  from "components/ShoppingListItemContextMenu";
import axios from "axios";
import {Notify} from "src/mixins/Notify";
export default {
  name: "ShoppingListItem",
  mixins: [Notify],
  components: {ShoppingListItemContextMenu},
  props: {
    item: {
      type: Object,
      required: true
    },
    unavailable: Boolean
  },
  data: () => ({
    shouldShowOptions: false
  }),
  computed: {
    quantityOptions() {
      if (this.item && this.item.quantity_available) {
        return [...Array(this.item.quantity_available + 1).keys()].slice(1)
      }

      return [1];
    },
    addOrEditNotes() {
      return this.item && this.item.notes ? "Edit" : "Add";
    },
    userToken() {
      return this.$store.state.user.authorization.token;
    },
  },
  methods: {
    reAddToCart() {
      const url = `${process.env.SHOPPING_LIST_API_ROOT}parts/re-add-to-cart`;
      axios
        .put(
          url,
          {
            root_part_id: this.item.root_part_id
          },
          {
            headers: {
              "DL-Authorization": this.userToken,
            },
          }
        )
        .then((response) => {
          this.$store.commit(
            "shoppinglist/UPDATE_SHOPPING_LIST",
            response.data.list
          );
          this.$store.commit(
            "shoppinglist/UPDATE_SHOPPING_CART",
            response.data.cart
          );
          this.$store.dispatch("shoppinglist/triggerOpticatRequestsForListItems");
          this.notify("Item re-added to cart successfully", "positive");
        })
        .catch(() => {
          this.notify("Error re-adding item to cart", "negative");
        });
    }
  }
}
</script>

<style lang="scss">
body {
  &:not(.body--dark) {
    .shopping-list-item {
      background-color: white;

      .top {
        .image-container {
          .image,
          .placeholder {
            background-color: #eaeaea;
          }

          .placeholder {
            color: white
          }
        }
      }
    }
  }

  &.body--dark {
    .shopping-list-item {
      background-color: var(--q-color-dark);

      .top {
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
.shopping-list-item {
  position: relative;

  border-radius: 4px;

  padding: 32px 16px 16px 16px;

  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);

  overflow: hidden;

  .unavailable-container {
    position: absolute;
    top: 0;
    left: 0;

    padding: 4px 30px 30px 8px;

    background-color: #be1e2d;
    color: white;

    z-index: 1;

    clip-path: polygon(0 0, 0 84%, 100% 0);

    i {
      font-size: 12px;
      line-height: 1;
    }
  }

  .top {
    .info {
      position: relative;

      display: flex;
      flex-direction: column;
      align-items: flex-start;

      z-index: 2;

      .manufacturer,
      .part-number {
        line-height: 20px;
      }

      .part-number {
        &:hover {
          color: $primary;
        }
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

  .bottom {
    .description-notes {
      .notes {
        min-height: 20px;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}

/* Styling is separate since this element is inserted at bottom of body */
.options-container {
  margin-left: -35px;
  border-right: solid 7px $primary;
}
</style>
