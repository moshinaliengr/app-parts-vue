// Libraries & Features
import axios from "axios";
import moment from 'moment';

const state = {
  shoppingList: [],
  shoppingCart: [],
  orderHistory: [],
  partsBeingAddedToShoppingList: [],
  partsBeingRemovedFromCart: [],
  shoppingCartPurchaseOrderDescription: null,
  shoppingCartNote: null,
  shoppingCartShippingAddress: null,
  listItemsWithQuantityBeingUpdated: [],
  cartItemsWithQuantityBeingUpdated: [],
  itemsNotInListBeingAddedToCart: [],
  shouldPollShoppingCart: false,
  isPollingShoppingCart: false,
  isGettingShoppingList: false,
  isUpdatingShoppingCartPart: false,
  isUpdatingPartNote: false,
  isUpdatingPurchaseOrderDescription: false,
  isUpdatingOrderNote: false,
  isUpdatingShippingAddress: false,
  isCheckingOut: false,
  isPlacingOrder: false,
  isGettingSingleCart: false,
  isGettingSellerInfo: false,
  isGettingOrderHistory: false,
  hasTriggeredOpticatRequestsForListItems: false,
  hasOpticatFailed: false,
  incompleteItems: [],
};

const getters = {
  shoppingList: (state) => state.shoppingList,
  shoppingCart: state => state.shoppingCart,
  shoppingCartId: (state) => {
    return state.shoppingCart && state.shoppingCart.length && state.shoppingCart[0]
      ? state.shoppingCart[0].cart_id : null
  },
  purchaseOrderDescription: state => state.shoppingCartPurchaseOrderDescription,
  note: state => state.shoppingCartNote,
  shippingAddress: state => state.shoppingCartShippingAddress,
  unavailableItems: state => {
    const shoppingCartRootIds = state.shoppingCart.map(cartItem => cartItem.root_part_id);
    return state.shoppingList.filter(listItem => {
      return (
        shoppingCartRootIds.indexOf(listItem.root_part_id) === -1 &&
        !listItem.available
      );
    });
  },
  orderHistory: state => state.orderHistory,
  isPollingShoppingCart: (state) => state.isPollingShoppingCart,
  isGettingShoppingList: (state) => state.isGettingShoppingList,
  isUpdatingShoppingCartPart: (state) => state.isUpdatingShoppingCartPart,
  isUpdatingPartNote: (state) => state.isUpdatingPartNote,
  isUpdatingPurchaseOrderDescription: (state) => state.isUpdatingPurchaseOrderDescription,
  isUpdatingOrderNote: (state) => state.isUpdatingOrderNote,
  isUpdatingShippingAddress: (state) => state.isUpdatingShippingAddress,
  isListItemQuantityBeingUpdated: (state) => (rootPartId) => {
    return state.listItemsWithQuantityBeingUpdated.indexOf(rootPartId) > -1;
  },
  isCartItemQuantityBeingUpdated: (state) => (cartItemId) => {
    return state.cartItemsWithQuantityBeingUpdated.indexOf(cartItemId) > -1;
  },
  isCheckingOut: (state) => state.isCheckingOut,
  isPlacingOrder: (state) => state.isPlacingOrder,
  isAddingPartToShoppingList: (state) => (rootPartUuid) => {
    return state.partsBeingAddedToShoppingList.indexOf(rootPartUuid) > -1
  },
  isGettingSellerInfo: (state) => state.isGettingSellerInfo,
  isPartBeingRemovedFromCart: (state) => (cartItemId) => {
    return state.partsBeingRemovedFromCart.indexOf(cartItemId) > -1;
  },
  isGettingOrderHistory: (state) => state.isGettingOrderHistory,
  isAddingCartItemNotInList: (state) => (cartItemId) => {
    return state.itemsNotInListBeingAddedToCart.indexOf(cartItemId) > -1;
  },
  hasTriggeredOpticatRequestsForListItems: (state) => state.hasTriggeredOpticatRequestsForListItems,
  incompleteItems: (state) => state.incompleteItems
};

const mutations = {
  UPDATE_SHOPPING_LIST(state, shoppingList) {
    state.shoppingList = shoppingList;
  },
  UPDATE_SHOPPING_CART(state, shoppingCart) {
    state.shoppingCart = shoppingCart;
  },
  setOrderHistory(state, orderHistory) {
    state.orderHistory = orderHistory;
  },
  addPartBeingAddedToShoppingList(state, rootPartUuid) {
    state.partsBeingAddedToShoppingList.push(rootPartUuid);
  },
  removePartBeingAddedToShoppingList(state, rootPartUuid) {
    const index = state.partsBeingAddedToShoppingList.indexOf(rootPartUuid);
    state.partsBeingAddedToShoppingList.splice(index, 1);
  },
  resetPartsBeingAddedToShoppingList(state) {
    state.partsBeingAddedToShoppingList = [];
  },
  addPartBeingRemovedFromCart(state, cartItemId) {
    state.partsBeingRemovedFromCart.push(cartItemId);
  },
  removePartBeingRemovedFromCart(state, cartItemId) {
    const index = state.partsBeingRemovedFromCart.indexOf(cartItemId);
    state.partsBeingRemovedFromCart.splice(index, 1);
  },
  resetPartsBeingRemovedFromCart(state) {
    state.partsBeingRemovedFromCart = [];
  },
  setIsPollingShoppingCart(state, bool) {
    state.isPollingShoppingCart = bool;
  },
  setShouldPollShoppingCart(state, bool) {
    state.shouldPollShoppingCart = bool;
  },
  RESET_SHOPPING_CART_POLLING(state) {
    state.shouldPollShoppingCart = false;
    state.isPollingShoppingCart = false;
  },
  addCartItemWithQuantityBeingUpdated(state, cartItemId) {
    state.cartItemsWithQuantityBeingUpdated.push(cartItemId);
  },
  removeCartItemWithQuantityBeingUpdated(state, cartItemId) {
    const index = state.cartItemsWithQuantityBeingUpdated.indexOf(cartItemId);
    state.cartItemsWithQuantityBeingUpdated.splice(index, 1);
  },
  resetCartItemsWithQuantityBeingUpdated(state) {
    state.cartItemsWithQuantityBeingUpdated = [];
  },
  addListItemWithQuantityBeingUpdated(state, rootPartId) {
    state.listItemsWithQuantityBeingUpdated.push(rootPartId);
  },
  removeListItemWithQuantityBeingUpdated(state, rootPartId) {
    const index = state.listItemsWithQuantityBeingUpdated.indexOf(rootPartId);
    state.listItemsWithQuantityBeingUpdated.splice(index, 1);
  },
  resetListItemsWithQuantityBeingUpdated(state) {
    state.listItemsWithQuantityBeingUpdated = [];
  },
  addItemNotInListBeingAddedToCart(state, cartItemId) {
    state.itemsNotInListBeingAddedToCart.push(cartItemId);
  },
  removeItemNotInListBeingAddedToCart(state, cartItemId) {
    const index = state.itemsNotInListBeingAddedToCart.indexOf(cartItemId);
    state.itemsNotInListBeingAddedToCart.splice(index, 1);
  },
  resetItemsNotInListBeingAddedToCart(state) {
    state.itemsNotInListBeingAddedToCart = [];
  },
  setIsGettingShoppingList(state, bool) {
    state.isGettingShoppingList = bool;
  },
  setShoppingCartPurchaseOrderDescription(state, description) {
    state.shoppingCartPurchaseOrderDescription = description;
  },
  setShoppingCartNote(state, note) {
    state.shoppingCartNote = note;
  },
  setShoppingCartShippingAddress(state, address) {
    state.shoppingCartShippingAddress = address;
  },
  setIsUpdatingShoppingCartPart(state, bool) {
    state.isUpdatingShoppingCartPart = bool;
  },
  setIsUpdatingPartNote(state, bool) {
    state.isUpdatingPartNote = bool;
  },
  setIsUpdatingPurchaseOrderDescription(state, bool) {
    state.isUpdatingPurchaseOrderDescription = bool;
  },
  setIsUpdatingOrderNote(state, bool) {
    state.isUpdatingOrderNote = bool;
  },
  setIsUpdatingShippingAddress(state, bool) {
    state.isUpdatingShippingAddress = bool;
  },
  setIsCheckingOut(state, bool) {
    state.isCheckingOut = bool;
  },
  setIsPlacingOrder(state, bool) {
    state.isPlacingOrder = bool;
  },
  setIsGettingSingleCart(state, bool) {
    state.isGettingSingleCart = bool;
  },
  setIsGettingSellerInfo(state, bool) {
    state.isGettingSellerInfo = bool;
  },
  setIsGettingOrderHistory(state, bool) {
    state.isGettingOrderHistory = bool;
  },
  setHasTriggeredOpticatRequestsForListItems(state, bool) {
    state.hasTriggeredOpticatRequestsForListItems = bool;
  },
  setHasOpticatFailed(state, bool) {
    state.hasOpticatFailed = bool;
  },
  setIncompleteItems(state, items) {
    state.incompleteItems = items;
  }
};


const actions = {
  resetOnLogout({ commit }) {
    commit('UPDATE_SHOPPING_LIST', []);
    commit('UPDATE_SHOPPING_CART', []);
    commit("setOrderHistory", []);
    commit("resetPartsBeingAddedToShoppingList");
    commit("resetPartsBeingRemovedFromCart");
    commit("setShoppingCartShippingAddress", null);
    commit("resetCartItemsWithQuantityBeingUpdated");
    commit("resetItemsNotInListBeingAddedToCart");
    commit("RESET_SHOPPING_CART_POLLING");
  },
  processShoppingListResponse({ commit, dispatch, rootGetters }, responseData) {
    if (responseData.list) {
      commit("UPDATE_SHOPPING_LIST", responseData.list);
    }

    if (responseData.cart) {
      commit("UPDATE_SHOPPING_CART", responseData.cart);
    }

    if (responseData.cart_po_description) {
      commit("setShoppingCartPurchaseOrderDescription", responseData.cart_po_description);
    }

    if (responseData.cart_note) {
      commit("setShoppingCartNote", responseData.cart_note);
    }

    if (responseData.cart_shipping_address) {
      commit("setShoppingCartShippingAddress", responseData.cart_shipping_address);
    }

    if (responseData.incomplete_items) {
      commit("setIncompleteItems", responseData.incomplete_items);
    }

    if (
      !responseData.suppressTriggerOpticatRequests &&
      responseData.list &&
      responseData.list.length > 0 &&
      rootGetters["company/companyShop"] &&
      rootGetters["company/opticatLocationName"] &&
      !state.isPollingShoppingCart &&
      (
        !responseData.last_responded ||
        moment.utc(
          responseData.last_responded,
          "YYYY-MM-DD HH:mm:ss"
        ).isBefore(moment().subtract(5, "minutes"))
      )
    ) {
      dispatch("triggerOpticatRequestsForListItems");
    } else if (
      (!responseData.incomplete_items || responseData.incomplete_items.length > 0) &&
      moment.utc(
        responseData.last_queried,
        "YYYY-MM-DD HH:mm:ss"
      ).isBefore(moment().subtract(1, "minutes"))
    ) {
      commit("setHasOpticatFailed", true);
    }
  },
  async addPartToShoppingList({ state, getters, commit, dispatch }, formData) {
    let shoppingList = state.shoppingList;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!getters.isAddingPartToShoppingList(formData.root_part_uuid) && config.constructor === Object) {
      commit("addPartBeingAddedToShoppingList", formData.root_part_uuid);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}parts`;

      await axios.post(url, formData, config)
        .then((res) => {
          if (res && res.data) {
            if (res.data.list) {
              shoppingList = res.data.list;
            }

            dispatch("processShoppingListResponse", res.data);
          } else {
            shoppingList = "error";
          }

        })
        .catch(() => {
          shoppingList = "error";
        });

      commit("removePartBeingAddedToShoppingList", formData.root_part_uuid);
    }
    return shoppingList;
  },
  async asyncGetPartsData({ state, getters, commit, dispatch }, data) {
    let addToShoppingListResponse = data.addToShoppingListResponse;
    let config = data.config;
    let formData = data.formData;

    if (addToShoppingListResponse && addToShoppingListResponse.data) {
      const url = `${process.env.SHOPPING_LIST_API_ROOT}request-parts-data`;
      formData.current_part_id = addToShoppingListResponse.data.current_part_id;
      formData.cart_id = addToShoppingListResponse.data.cart_id;
      await axios.post(url, formData, config)
        .then((addToShoppingListResponse) => {
          if (addToShoppingListResponse && addToShoppingListResponse.data) {
            commit("setShouldPollShoppingCart", true);
            dispatch("POLL_SHOPPING_CART");
          }
        });
    }
  },
  async getShoppingList({ state, commit, dispatch }) {
    let shoppingList = state.shoppingList;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isGettingShoppingList && config.constructor === Object) {
      commit("setIsGettingShoppingList", true);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}`;

      if (config.constructor === Object) {
        await axios.get(url, config)
          .then(res => {
            if (res && res.data) {
              dispatch("processShoppingListResponse", res.data);
            }
          })
          .catch(err => {
            shoppingList = "error";
          })
      }

      commit("setIsGettingShoppingList", false);
    }
    return shoppingList;
  },
  async POLL_SHOPPING_CART({ state, commit, dispatch, rootGetters }) {
    if (
      state.shouldPollShoppingCart &&
      !state.isPollingShoppingCart &&
      rootGetters["company/companyShop"] &&
      rootGetters["company/opticatLocationName"]
    ) {
      commit("setIsPollingShoppingCart", true);

      if (state.hasOpticatFailed) {
        commit("setHasOpticatFailed", false);
      }

      const config = await dispatch("getAuthConfig", null, { root: true });

      if (config.constructor === Object) {
        let hasBeen30SecondsSinceLastQueried = false;
        let hasBeen15SecondsSinceLastQueried = false;

        while (state.isPollingShoppingCart) {
          await axios.get(
            process.env.SHOPPING_LIST_API_ROOT,
            config
          ).then((res) => {
            if (res && res.data) {
              dispatch("processShoppingListResponse", res.data);
              let hasBeenAMinuteSinceLastQueried = moment.utc(
                res.data.last_queried,
                "YYYY-MM-DD HH:mm:ss"
              ).isBefore(moment().subtract(1, "minutes"));

              // If we got updated information or we've waited long enough
              if (
                (res.data.incomplete_items && res.data.incomplete_items.length === 0) ||
                hasBeenAMinuteSinceLastQueried
              ) {
                commit("RESET_SHOPPING_CART_POLLING");
              } else {
                hasBeen30SecondsSinceLastQueried = moment.utc(
                  res.data.last_queried,
                  "YYYY-MM-DD HH:mm:ss"
                ).isBefore(moment().subtract(30, "seconds"));

                hasBeen15SecondsSinceLastQueried = moment.utc(
                  res.data.last_queried,
                  "YYYY-MM-DD HH:mm:ss"
                ).isBefore(moment().subtract(15, "seconds"));
              }
            }
          }).catch(err => {
            if (
              err &&
              err.response &&
              err.response.status === 429
            ) {
              commit("RESET_SHOPPING_CART_POLLING");
            }
          });

          if (hasBeen30SecondsSinceLastQueried) {
            await new Promise(resolve => setTimeout(resolve, 10000));
          } else if (hasBeen15SecondsSinceLastQueried) {
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      }
    }
  },
  async updateShoppingCartPart({ state, commit, dispatch }, partId) {
    let shoppingCart = state.shoppingCart;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isUpdatingShoppingCartPart && config.constructor === Object) {
      commit("setIsUpdatingShoppingCartPart", true);

      const formData = {
        cart_item_id: partId
      };
      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/parts/selected`;

      await axios.put(url, formData, config)
        .then(res => {
          if (res && res.data) {
            dispatch("processShoppingListResponse", res.data);
            if (res.data.cart) {
              shoppingCart = res.data.cart;
            }
          }
        })
        .catch(() => {
          shoppingCart = "error";
        })

      commit("setIsUpdatingShoppingCartPart", false);
    }
    return shoppingCart;
  },
  async updatePartNote({ state, rootState, commit, dispatch }, formData) {
    let response = "error";
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isUpdatingPartNote && config.constructor === Object) {
      commit("setIsUpdatingPartNote", true);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}parts/notes`;

      await axios.put(url, formData, config)
        .then(res => {
          if (res && res.data) {
            dispatch("processShoppingListResponse", res.data);
            response = "success";
          }
        })
        .catch(() => {})

      commit("setIsUpdatingPartNote", false);
    }
    return response;
  },
  async updatePurchaseOrderDescription({ state, rootState, commit, dispatch }, formData) {
    let purchaseOrderDescription;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isUpdatingPurchaseOrderDescription && config.constructor === Object) {
      commit("setIsUpdatingPurchaseOrderDescription", true);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/po-description`;

      await axios.put(url, formData, config)
        .then((res) => {
          if (res && res.data.cart_po_description) {
            commit("setShoppingCartPurchaseOrderDescription", res.data.cart_po_description);
            purchaseOrderDescription = res.data.cart_po_description;
          }
        })
        .catch(() => {});

      commit("setIsUpdatingPurchaseOrderDescription", false);
    }
    return purchaseOrderDescription;
  },
  async updateOrderNote({ state, rootState, commit, dispatch }, formData) {
    let purchaseOrderDescription;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isUpdatingOrderNote && config.constructor === Object) {
      commit("setIsUpdatingOrderNote", true);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/note`;

      await axios.put(url, formData, config)
        .then((res) => {
          if (res && res.data.cart_note) {
            commit("setShoppingCartNote", res.data.cart_note);
            purchaseOrderDescription = res.data.cart_note;
          }
        })
        .catch(() => {});

      commit("setIsUpdatingOrderNote", false);
    }
    return purchaseOrderDescription;
  },
  async updateShippingAddress({ state, rootState, commit, dispatch }, formData) {
    let shippingAddress;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isUpdatingShippingAddress && config.constructor === Object) {
      commit("setIsUpdatingShippingAddress", true);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/shipping_address`;

      await axios.put(url, formData, config)
        .then((res) => {
          if (res && res.data.cart_shipping_address) {
            commit("setShoppingCartShippingAddress", res.data.cart_shipping_address);
            shippingAddress = res.data.cart_shipping_address;

            // Updating the address triggers OptiCat requests for the whole shopping list
            // so we need to poll the shopping cart to make sure any updates are reflected
            commit("setShouldPollShoppingCart", true);
            dispatch("POLL_SHOPPING_CART");
          }
        })
        .catch((err) => {
          if (
            err &&
            err.response &&
            err.response.status === 400 &&
            err.response.data &&
            err.response.data.error &&
            err.response.data.error === "This is not a valid address"
          ) {
            shippingAddress = "invalid";
          }
        });

      commit("setIsUpdatingShippingAddress", false);
    }
    return shippingAddress;
  },
  async updateListItemQuantity({ state, getters, commit, dispatch }, formData) {
    let response = "error";
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!getters.isListItemQuantityBeingUpdated(formData.root_part_id) && config.constructor === Object) {
      commit("addListItemWithQuantityBeingUpdated", formData.root_part_id);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}parts/quantity`;

      await axios.put(url, formData, config)
        .then((res) => {
          if (res && res.data) {
            dispatch("processShoppingListResponse", res.data);
            dispatch("asyncGetPartsData", {formData: formData, addToShoppingListResponse: res, config: config});
            response = "success";
          }
        });

      commit("removeListItemWithQuantityBeingUpdated", formData.root_part_id);
    } else {
      response = "repeat";
    }
    return response;
  },
  async updateCartItemQuantity({ state, commit, dispatch }, formData) {
    // Need cart_item_id and quantity
    let response = "error";
    const isCartItemQuantityBeingUpdated = state.cartItemsWithQuantityBeingUpdated.indexOf(formData.cart_item_id) > -1;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!isCartItemQuantityBeingUpdated && config.constructor === Object) {
      commit("addCartItemWithQuantityBeingUpdated", formData.cart_item_id);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/quantity`;

      await axios.put(url, formData, config)
        .then((res) => {
          if (res && res.data) {
            dispatch("processShoppingListResponse", res.data);
            dispatch("asyncGetPartsData", {formData: formData, addToShoppingListResponse: res, config: config});
            response = "success";
          }
        });

      commit("removeCartItemWithQuantityBeingUpdated", formData.cart_item_id);
    } else {
      response = "repeat";
    }
    return response;
  },
  async checkout({ state, commit, dispatch, getters }, formData) {
    let issues = [];
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isCheckingOut && config.constructor === Object) {
      commit("setIsCheckingOut", true);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/checkout`;
      const oldUnavailableItemIds = getters.unavailableItems.map(i => i.root_part_id);

      await axios.post(url, formData, config)
        .then(res => {
          if (res && res.data) {
            res.data.suppressTriggerOpticatRequests = true;
            dispatch("processShoppingListResponse", res.data);
            getters.unavailableItems.forEach(i => {
              if (oldUnavailableItemIds.indexOf(i.root_part_id) === -1) {
                issues.push(`${i.root_manufacturer_name} part with part number ${i.root_part_number} is no longer available`);
              }
            });
          }
        })
        .catch(() => {
          issues.push("An Opticat error has occurred");
        })

      commit("setIsCheckingOut", false);
    }
    return issues;
  },
  async placeOrder({ state, commit, dispatch }, formData) {
    let response = "error";
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isPlacingOrder && config.constructor === Object) {
      commit("setIsPlacingOrder", true);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/place-order`;

      await axios.post(url, formData, config)
        .then(res => {
          if (res && res.data) {
            dispatch("processShoppingListResponse", res.data);

            if (!state.orderHistory || state.orderHistory.length === 0) {
              dispatch("getOrderHistory");
            }

            response = "success";
          }
        })
        .catch(() => {})

      commit("setIsPlacingOrder", false);
    }
    return response;
  },
  async getSingleCart({ state, commit, dispatch }, cartId) {
    let cart;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isGettingSingleCart && config.constructor === Object) {
      commit("setIsGettingSingleCart", true);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/${cartId}`;

      await axios.get(url, config)
        .then(res => {
          if (res && res.data && res.data.cart) {
            cart = res.data.cart;
          }
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
          if (err.response.status === 404) {
            cart = 404;
          }
        })

      commit("setIsGettingSingleCart", false);
    }
    return cart;
  },
  async getSellerInfo({ state, commit, dispatch }, data) {
    let sellerInfo;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isGettingSellerInfo && config.constructor === Object) {
      commit("setIsGettingSellerInfo", true);

      let url = `${process.env.SHOPPING_LIST_API_ROOT}carts/get-seller-details/${data.sellerId}`;
      url += data.locationName ? `?location_name=${data.locationName}` : "";

      await axios.get(url, config)
        .then((res) => {
          if (res && res.data && res.data.seller_info) {
            sellerInfo = res.data.seller_info;
          } else {
            sellerInfo = "error";
          }
        })
        .catch(() => {
          sellerInfo = "error";
        })

      commit("setIsGettingSellerInfo", false);
    }
    return sellerInfo;
  },
  async removePartFromCart({ state, getters, commit, dispatch }, data) {
    let removedSuccessfully = false;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!getters.isPartBeingRemovedFromCart(data.cartItemId) && config.constructor === Object) {
      commit("addPartBeingRemovedFromCart", data.cartItemId);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/${data.cartItemId}/${data.removeFromList}`;

      await axios.delete(url, config)
        .then((res) => {
          if (res && res.data) {
            dispatch("processShoppingListResponse", res.data);
            removedSuccessfully = true;
          }
        });

      commit("removePartBeingRemovedFromCart", data.cartItemId);
    }
    return removedSuccessfully;
  },
  async getOrderHistory({ state, commit, dispatch }) {
    let orderHistory = state.orderHistory;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.isGettingOrderHistory && config.constructor === Object) {
      commit("setIsGettingOrderHistory", true);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts?status=success`;

      await axios.get(url, config)
        .then((res) => {
          if (res && res.data && res.data.carts) {
            commit("setOrderHistory", res.data.carts);
            orderHistory = res.data.carts;
          }
        })
        .catch(() => {
          orderHistory = undefined;
        })

      commit("setIsGettingOrderHistory", false);
    }
    return orderHistory;
  },
  async addCartItemNotInList({ state, getters, commit, dispatch}, cartItemId) {
    let addedSuccessfully = false;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!getters.isAddingCartItemNotInList(cartItemId) && config.constructor === Object) {
      commit("addItemNotInListBeingAddedToCart", cartItemId);

      const url = `${process.env.SHOPPING_LIST_API_ROOT}carts/add-cart-item`;

      await axios.post(url, { cart_item_id: cartItemId }, config)
        .then((res) => {
          if (res && res.data) {
            dispatch("processShoppingListResponse", res.data);
            addedSuccessfully = true;
          }
        });

      commit("removeItemNotInListBeingAddedToCart", cartItemId);
    }
    return addedSuccessfully;
  },
  async triggerOpticatRequestsForListItems({ state, getters, rootGetters, commit, dispatch }, shouldNotPoll) {
    let triggeredSuccessfully = false;
    const config = await dispatch("getAuthConfig", null, { root: true });

    if (!state.hasTriggeredOpticatRequestsForListItems && config.constructor === Object) {
      const opticatLocationName = rootGetters["company/opticatLocationName"];

      if (opticatLocationName) {
        commit("setHasTriggeredOpticatRequestsForListItems", true);

        const endpointUrl = `carts/trigger-opticat-requests?opticat_location_name=${opticatLocationName}`;
        const url = process.env.SHOPPING_LIST_API_ROOT + endpointUrl;

        await axios.get(url, config)
          .then((res) => {
            if (res && res.data && res.data.success) {
              triggeredSuccessfully = true;

              if (!shouldNotPoll) {
                commit("setShouldPollShoppingCart", true);
                dispatch("POLL_SHOPPING_CART");
              }
            }
          })
          .catch(() => {});

        commit("setHasTriggeredOpticatRequestsForListItems", false);
      }
    }
    return triggeredSuccessfully;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
