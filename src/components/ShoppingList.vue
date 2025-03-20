<template>
  <div class="shopping-list">
    <!-- If partInfo show Part Detail, else Shopping List  -->
    <div
      id="shop-list-content"
      class="content"
    >
      <LoadingOverlay
        :loadingProp="loadingResults"
        bgOpacity="5"
      />

      <!-- Heading -->
      <div class="heading row items-center justify-between">
        <div class="title">
          <div class="text-h5 text-weight-bold">Shopping List</div>
          <div class="opticat-location" v-if="opticatLocationName">
            <i class="fas fa-globe" />
            Connected to
            <strong>{{ opticatLocationName }}</strong>
          </div>
        </div>
        <div class="cart-options">
          <template v-if="$ld.flags['shopping-cart']">
            <div
              class="opti-cat-trigger"
              v-if="
                !hasOpticatAccount ||
                !companyShop ||
                (companyShop && companyShop.length === 0)
              "
            >
              <div class="purchase-parts text q-mr-md text-weight-bold">
                Want to purchase parts directly from your shopping list?
              </div>
              <!-- Find Out How Button -->
              <div class="find-out-how">
                <ButtonStandard
                  class="q-px-lg"
                  label="Find out how"
                  tooltip="Find out how"
                  size="sm"
                  style-extend="padding-top: 2px; padding-bottom: 2px;"
                  @click.native="findOutHow"
                />
              </div>
            </div>

            <!-- View Shopping Cart Button -->
            <div
              class="view-cart"
              v-else-if="shouldShowCartSpinner || shouldShowCartButton"
            >
              <ButtonStandard
                class="q-px-xl"
                label="View Cart"
                tooltip="View Shopping Cart"
                size="md"
                style-extend="padding-top: 2px; padding-bottom: 2px;"
                @click.native="goToShoppingCart"
                :loading="shouldShowCartSpinner"
              />
            </div>
          </template>
        </div>
      </div>
      <div class="heading row items-center justify-between">
        <!-- DESKTOP: Email, Download, and Options Buttons -->
        <div class="desktop row q-mr-md q-mt-lg">
          <div class="button-container">
            <ButtonStandard
              class="q-pr-sm q-mt-md"
              label="Email"
              tooltip="Email Shopping List"
              size="sm"
              icon-right="fas fa-paper-plane"
              :color="isDark ? 'white' : 'black'"
              @click.native="emailShoppingList()"
              :full="false"
              style-extend="margin-left: -3px;"
              flat
            />
          </div>

          <div class="button-container q-ml-md">
            <ButtonStandard
              class="q-px-sm q-mt-md"
              label="Download"
              tooltip="Download Shopping List"
              size="sm"
              icon-right="fas fa-download"
              :color="isDark ? 'white' : 'black'"
              @click.native="downloadShoppingList()"
              :full="false"
              flat
            />
          </div>

          <div class="button-container q-ml-md">
            <ButtonStandard
              class="q-px-sm q-mt-md"
              label="Options"
              tooltip="Show Shopping List Options"
              size="sm"
              icon-right="fas fa-ellipsis-v"
              :color="isDark ? 'white' : 'black'"
              :full="false"
              flat
            />
            <q-menu
              content-class="options-container"
              anchor="top left"
              self="bottom right"
              auto-close
            >
              <q-item
                @click="shouldShowOpticatLocationNameModal = true"
                v-if="opticatLocationName"
                clickable
              >
                <q-item-section avatar>
                  <i class="fas fa-globe fa-fw" />
                </q-item-section>
                <q-item-section>
                  Edit Location
                </q-item-section>
              </q-item>
              <q-separator v-if="opticatLocationName" />
              <q-item
                @click="deleteConfirmation()"
                clickable
              >
                <q-item-section avatar>
                  <i class="fas fa-trash-alt fa-fw" />
                </q-item-section>
                <q-item-section>Clear List</q-item-section>
              </q-item>
            </q-menu>
          </div>
        </div>
                <!-- MOBILE: Email, Download, and Options Buttons -->
                <div class="mobile row q-mr-md q-mt-md">
          <div class="button-container">
            <ButtonStandard
              class="q-pr-sm q-mt-md"
              label="Email"
              tooltip="Email Shopping List"
              size="sm"
              icon-right="fas fa-paper-plane"
              :color="isDark ? 'white' : 'black'"
              @click.native="emailShoppingList()"
              :full="false"
              style-extend="margin-left: -3px;"
              flat
            />
          </div>

          <div class="button-container q-ml-md">
            <ButtonStandard
              class="q-px-sm q-mt-md"
              label="Download"
              tooltip="Download Shopping List"
              size="sm"
              icon-right="fas fa-download"
              :color="isDark ? 'white' : 'black'"
              @click.native="downloadShoppingList()"
              :full="false"
              flat
            />
          </div>

          <div class="button-container q-ml-md">
            <ButtonStandard
              class="q-px-sm q-mt-md"
              label="Options"
              tooltip="Show Shopping List Options"
              size="sm"
              icon-right="fas fa-ellipsis-v"
              :color="isDark ? 'white' : 'black'"
              :full="false"
              flat
            />
            <q-menu
              content-class="options-container"
              anchor="top left"
              self="bottom right"
              auto-close
            >
              <q-item
                @click="shouldShowOpticatLocationNameModal = true"
                v-if="opticatLocationName"
                clickable
              >
                <q-item-section avatar>
                  <i class="fas fa-globe fa-fw" />
                </q-item-section>
                <q-item-section>
                  Edit Location
                </q-item-section>
              </q-item>
              <q-separator v-if="opticatLocationName" />
              <q-item
                @click="deleteConfirmation()"
                clickable
              >
                <q-item-section avatar>
                  <i class="fas fa-trash-alt fa-fw" />
                </q-item-section>
                <q-item-section>Clear List</q-item-section>
              </q-item>
            </q-menu>
          </div>
        </div>
        <radio-icon-group
          :options="displayOptions"
          v-model="selectedDisplayOption"
          class="q-mt-lg"
        />
      </div>

      <!-- Shopping List Items Grid -->
      <div
        class="cards-container row"
        v-if="selectedDisplayOption === 'grid'"
      >
        <shopping-list-item
          :item="item"
          @view="viewSelectedPart(item)"
          @change-quantity="onQuantityChange($event, item)"
          @notes-click="viewNotes(item, $event)"
          @remove="deleteConfirmation(item)"
          :key="`item_${i}`"
          v-for="(item, i) in items"
        />
      </div>

      <ContentCard
        class="list-container"
        v-else-if="selectedDisplayOption === 'list'"
      >
        <q-card-section class="q-px-none full-width">
          <q-table
            :data="items"
            :columns="tableHeadings"
            flat
            :pagination.sync="pagination"
            hide-pagination
            row-key="name"
            class="hide-scrollbar modal-toobar"
            style="border-radius: 0"
            bordered
            wrap-cells
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  class="wrapping"
                >
                  <!-- Parts column -->
                  <div v-if="col.name === 'part'">
                    <div class="row">
                      <div class="col">
                        <span
                          class="partCell list-hover"
                          @click="viewSelectedPart(props.row)"
                        >
                          {{ col.value }}
                        </span>
                        <span style="display: block">
                          {{ props.row.root_manufacturer_name }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="col.name === 'notes'"
                    class="text-field-control notes"
                  >
                    <!-- Notes column -->
                    <!-- Separate icons/dialog msg for empty/filled notes -->
                    <div
                      class="row"
                      v-if="col.value"
                      style="max-width: 330px"
                    >
                      <div class="col-11 small-spacing">
                        <span class="patrick-hand-font">
                          {{ col.value }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- Quantity column -->
                  <div
                    v-if="col.name === 'quantity'"
                    style="max-width: 76px"
                  >
                    <q-select
                      :options="quantityOptions(props.row)"
                      :value="col.value"
                      :loading="props.row.isQuantityUpdateLoading"
                      @input="(val) => onQuantityChange(val, props.row)"
                      outlined
                    />
                  </div>
                  <!-- Description column -->
                  <div
                    v-if="col.name === 'description'"
                    class="text-field-control"
                  >
                    {{ col.value }}
                  </div>
                  <!-- Options column -->
                  <div
                    class="row"
                    v-if="col.name === 'options'"
                  >
                    <div
                      class="icon-container q-mr-sm"
                      v-if="!props.row.available"
                    >
                      <i
                        class="fas fa-exclamation-triangle fa-fw"
                        style="color: #be1e2d; font-size: 20px; line-height: 1"
                      />
                      <q-tooltip>
                        {{ props.row.unavailable_reason }}
                      </q-tooltip>
                    </div>

                    <shopping-list-item-context-menu
                      :add-or-edit-notes="getAddOrEditNotesForItem(props.row)"
                      @notes-click="
                        viewNotes(
                          props.row,
                          getAddOrEditNotesForItem(props.row)
                        )
                      "
                      @remove="deleteConfirmation(props.row)"
                    />
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </ContentCard>

      <!-- Footer of the Shopping List -->
      <div class="footer">
        <!-- MOBILE: Options -->
        <!--Commented out for mobile menu options-->
        <!-- <div class="mobile options">
          <div class="icon-container">
            <i class="fas fa-ellipsis-v fa-fw" />
          </div>
          <q-menu
            content-class="options-container"
            anchor="top left"
            self="bottom right"
            auto-close
          >
            <q-item
              @click="emailShoppingList"
              clickable
            >
              <q-item-section avatar>
                <i class="fas fa-paper-plane fa-fw" />
              </q-item-section>
              <q-item-section>Email Shopping List</q-item-section>
            </q-item>
            <q-separator />
            <q-item
              @click="downloadShoppingList"
              clickable
            >
              <q-item-section avatar>
                <i class="fas fa-download fa-fw" />
              </q-item-section>
              <q-item-section>Download Shopping List</q-item-section>
            </q-item>
          </q-menu>
        </div>
      </div> -->

      <div class="desktop">
        <!-- Desktop version Notes and Delete dialogs -->

        <!-- Notes -->
        <q-dialog v-model="editNotes">
          <q-card style="width: 500px; min-height: 223px; padding: 12px">
            <q-card-section class="dialog-msg">
              <!-- noteAction is just logic to display Add or Edit -->
              {{ noteAction }} note for {{ localSelectedPart.root_part_number }}
            </q-card-section>
            <q-card-section class="q-pt-none">
              <textarea
                borderless
                v-model="notes"
                autofocus
                @keydown.enter="saveNotes()"
                maxlength="256"
                class="dialog-input"
              />
            </q-card-section>
            <q-card-actions
              align="right"
              class="text-primary"
            >
              <q-btn
                flat
                label="Cancel"
                v-close-popup
                no-caps
                class="q-mr-md clear_list_btn"
                style="border: 2px solid black; color: black; font-size: 12px"
              />
              <q-btn
                flat
                v-close-popup
                :label="noteAction == 'Add' ? 'Add Note' : 'Save'"
                class="save-btn q-mr-sm"
                style="font-size: 12px"
                @click.native="saveNotes()"
                no-caps
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Delete/Clear -->
        <q-dialog v-model="confirmDelete">
          <q-card
            class="shopping-list-dialog"
            style="
              width: 500px;
              height: 252px;
              padding: 14px;
              text-align: center;
            "
          >
            <span class="icon">
              <i
                class="fa fa-exclamation-triangle fa-2x q-mt-lg"
                aria-hidden="true"
              >
              </i>
            </span>
            <q-card-section class="dialog-msg">
              <!-- deleteMsg is just logic to display clear list or remove item -->
              {{ deleteMsg }}
            </q-card-section>
            <q-card-actions
              align="center"
              class="q-mt-sm"
            >
              <q-btn
                flat
                label="Cancel"
                v-close-popup
                no-caps
                class="clear_list_btn q-mr-md"
                style="border: 2px solid black; color: black"
              />
              <q-btn
                label="Remove"
                v-close-popup
                class="save-btn q-ml-md"
                no-caps
                @click.native="clearShoppingList ? clearList() : deletePart()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- OptiCat Account -->
        <q-dialog v-model="shouldShowOptiCatModal">
          <q-card class="opti-cat-dialog">
            <div class="icon-text">
              <div class="icon-container">
                <i class="fas fa-exclamation-triangle fa-fw text-primary" />
              </div>
              <div class="text">
                You will need to have an account with OptiCat in order to
                proceed with your purchase.
              </div>
            </div>
            <q-card-section class="opti-cat-dialog-msg">
              <div class="step step-1">
                <div class="text">
                  1. Click Get Started and fill out the account creation form.
                </div>
                <div class="image-container">
                  <img src="..//assets/opticat-log-in.png" />
                </div>
              </div>
              <div class="step step-2">
                <div class="text">
                  2. Someone will be in touch with you via phone or email to
                  help you get set up.
                </div>
                <div class="image-container">
                  <img src="..//assets/phone.png" />
                </div>
              </div>
              <div class="step step-3">
                <div class="text">
                  3. Once you have an account, return to your Shopping List and
                  purchase your items.
                </div>
                <div class="image-container">
                  <img src="..//assets/truck-list.png" />
                </div>
              </div>
            </q-card-section>
            <q-card-actions
              align="center"
              class="q-mt-sm"
            >
              <q-btn
                class="clear_list_btn q-mr-md"
                label="Back to Shopping List"
                style="border: 2px solid black; color: black"
                flat
                no-caps
                v-close-popup
              />
              <q-btn
                class="save-btn q-ml-md"
                label="Get Started"
                @click="registerWithOptiCat"
                v-close-popup
                no-caps
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Company Account -->
        <q-dialog v-model="shouldShowCompanyModal">
          <q-card class="company-dialog">
            <div class="top">
              <div class="text">Create a Company Account</div>
              <div class="icon-container">
                <i class="fas fa-warehouse" />
              </div>
            </div>
            <q-card-section>
              <company-form
                ref="companyForm"
                :form-data="companyFormData"
              />
            </q-card-section>
            <q-card-actions
              align="right"
              class="flex no-wrap q-mt-sm"
            >
              <q-btn
                class="clear_list_btn q-mr-sm"
                label="Cancel"
                style="min-width: 125px; border: 2px solid black; color: black"
                flat
                no-caps
                v-close-popup
              />
              <q-btn
                class="save-btn q-ml-md"
                label="Save"
                @click="submitCompanyForm"
                style="min-width: 125px"
                :loading="isCreatingCompanyAndShop"
                no-caps
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Opticat Location Name Update -->
        <opticat-location-name-dialog
          :opticat-location-name="opticatLocationName"
          v-model="shouldShowOpticatLocationNameModal"
        />
      </div>
    </div>
  </div>
  </div>
</template>

<script>
// Libraries & Features
import axios from "axios";
import { Notify } from "../mixins/Notify.js";
import { Platform, Dark } from "quasar";

// Components
import ButtonStandard from "../components/common/ButtonStandard";
import LoadingOverlay from "../components/common/LoadingOverlay";
import PartInfo from "./PartInfo";
import RadioIconGroup from "components/RadioIconGroup";
import ContentCard from "components/common/ContentCard";
import ShoppingListItem from "components/ShoppingListItem";
import ShoppingListItemContextMenu from "components/ShoppingListItemContextMenu";
import CompanyForm from "components/CompanyForm";
import { getPart } from "../services/TruckPartsCross";
import OpticatLocationNameDialog
  from "components/dialogs/OpticatLocationNameDialog";

export default {
  name: `ShoppingList`,
  mixins: [Notify],
  components: {
    OpticatLocationNameDialog,
    CompanyForm,
    ShoppingListItemContextMenu,
    ShoppingListItem,
    ContentCard,
    RadioIconGroup,
    ButtonStandard,
    LoadingOverlay,
  },
  data: () => ({
    confirmDelete: false, // modal
    deleteMsg: "", // Delete part or clear list msg
    editNotes: false, // modal
    clearShoppingList: false, // Delete part or clear list
    loadingResults: false,
    noteAction: "Edit", // Edit if there are already notes
    notes: "", // Notes field input
    part: {
      // To hold response data
      equivalences: [],
      recommended_parts: [],
      preferredManufacturer: false,
    },
    selectQty: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // # user can select as qty
    localSelectedPart: {}, // Set when needing to access it's properties
    shoppingListPage: 1, // Start page of pagination
    pagination: {
      rowsPerPage: 90,
    },
    items: [],
    perPage: 90, // Simple pagination var
    tableHeadings: [
      // Set up Quasar table component
      {
        name: "part",
        label: "Part",
        field: "root_part_number",
        sortable: false,
        align: "left",
      },
      {
        name: "description",
        label: "Description",
        field: "description",
        sortable: false,
        align: "left",
      },
      {
        name: "notes",
        label: "Notes",
        field: "notes",
        sortable: false,
        align: "left",
      },
      {
        name: "quantity",
        label: "Quantity",
        field: "quantity",
        sortable: false,
        align: "left",
      },
      {
        name: "options",
        label: "",
        field: "root_part_id",
        sortable: false,
        align: "center",
      },
    ],
    selectedDisplayOption: "grid",
    displayOptions: [
      { value: "grid", iconClasses: "fas fa-th" },
      { value: "list", iconClasses: "fas fa-bars" },
    ],
    quantityUpdateTimeouts: {},
    companyFormData: {
      opticatSuperUserId: null,
      companyName: null,
      companyPhone: null,
      billingStreet1: null,
      billingStreet2: null,
      billingCity: null,
      billingState: null,
      billingZip: null,
      shippingStreet1: null,
      shippingStreet2: null,
      shippingCity: null,
      shippingState: null,
      shippingZip: null,
    },
    shouldShowOptiCatModal: false,
    shouldShowCompanyModal: false,
    isCreatingCompanyAndShop: false,
    shouldShowOpticatLocationNameModal: false
  }),
  computed: {
    apiKey() {
      return process.env.TRUCK_PARTS_CROSS_SERVICE_API_KEY;
    },

    // Whether or not the user is on desktop
    isDesktop() {
      if (this.$q.platform.is.desktop) return true;
      else return false;
    },

    isMobile() {
      if (Platform.is.mobile) return true;
      else return false;
    },

    // Is the part available from Opticat?
    isPartAvailable() {
      return true;
    },

    // This will come from the Company API eventually,
    // hardcoded for now and can be changed via the
    // .env variable CART_ENABLED
    // isFeatureEnabled() {
    //   return process.env.CART_ENABLED === "true";
    //   if (this.user.isFeatureEnabled) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },

    // This will be set using information from the
    // company api and opticat, for now is simplified
    // as we are not receiving all the data we need,
    // can be changed via the .env variable OPTICAT_ENABLED
    hasOpticatAccount() {
      return process.env.OPTICAT_ENABLED === "true";
    },

    options() {
      return {
        headers: {
          "X-Authorization": this.apiKey,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
    },

    // This tells pagination which Shopping List items should be displayed based on
    // how many items are in the list and what perPage is set to.  It then slices
    // the list and returns what should be displaying.
    paginatedItems() {
      let offset = (this.shoppingListPage - 1) * this.perPage;
      let endOfPage = offset + this.perPage;
      let end =
        endOfPage > this.shoppingListItemCount
          ? this.shoppingListItemCount
          : endOfPage;
      return this.usersShoppingList.slice(offset, end);
    },

    // Link to download the Shopping List as pdf
    pdfLink() {
      return (
        process.env.SHOPPING_LIST_API_ROOT +
        "pdf/download/" +
        this.user_uuid +
        "/" +
        this.user_email +
        "/Diesel%20Parts"
      );
    },

    // Return url of backend app
    shoppingListApiRoot() {
      return process.env.SHOPPING_LIST_API_ROOT;
    },

    // Return the count of items since an empty array can be truthy
    shoppingListItemCount() {
      return Object.keys(this.$store.getters["shoppinglist/shoppingList"])
        .length;
    },

    // Used for calculating pagination
    shoppingListPages() {
      return Math.ceil(this.shoppingListItemCount / this.perPage);
    },

    // Get the Shopping List from the store
    usersShoppingList() {
      return this.$store.getters["shoppinglist/shoppingList"];
    },

    // Return users email
    user_email() {
      return this.$store.state.user.information.email;
    },

    // Return users first name
    user_first_name() {
      return this.$store.state.user.information.first_name;
    },

    // Return users token
    user_token() {
      return this.$store.state.user.authorization.token;
    },

    // Return users user_uuid/customer_id
    user_uuid() {
      return this.$store.state.user.information.customer_id;
    },

    isDark() {
      return Dark.isActive;
    },

    companyShop() {
      return this.$store.getters["company/companyShop"];
    },

    hasAvailableItems() {
      return this.usersShoppingList.some((item) => item.available);
    },

    usersShoppingCartCount() {
      const cart = this.$store.getters["shoppinglist/shoppingCart"];
      if (cart && cart.length) {
        return cart.reduce((acc, item) => {
          return acc + item.root_part_quantity;
        }, 0);
      }

      return 0;
    },

    hasTriggeredOpticatRequestsForListItems() {
      return this.$store.getters[
        "shoppinglist/hasTriggeredOpticatRequestsForListItems"
      ];
    },

    isPollingShoppingCart() {
      return this.$store.getters["shoppinglist/isPollingShoppingCart"];
    },

    shouldShowCartSpinner() {
      return (
        this.hasTriggeredOpticatRequestsForListItems ||
        this.isPollingShoppingCart
      );
    },

    shouldShowCartButton() {
      return (
        this.companyShop &&
        this.companyShop.length > 0 &&
        this.usersShoppingCartCount > 0
      );
    },

    opticatLocationName() {
      return this.$store.getters["company/opticatLocationName"];
    }
  },
  watch: {
    usersShoppingList() {
      this.initializeItems();
    },
  },
  mounted() {
    this.initializeItems();
  },
  methods: {
    initializeItems() {
      this.items = this.usersShoppingList.map((i) => {
        return {
          ...i,
          isQuantityUpdateLoading: false,
        };
      });
    },

    submitCompanyForm() {
      if (
        this.$refs.companyForm &&
        this.$refs.companyForm.validateRequiredRefs()
      ) {
        this.createCompanyAndShop();
      }
    },

    // Create a company, shop and Opticat location name
    async createCompanyAndShop() {
      this.isCreatingCompanyAndShop = true;
      // If there's Opticat data get brand_code
      const url = `${process.env.SHOPPING_LIST_API_ROOT}companies`;

      await axios
        .post(
          url,
          {
            company_name: this.companyFormData.companyName,
            company_description: `${this.companyFormData.companyName} Description`,
            shop_name: this.companyFormData.companyName,
            shop_description: `${this.companyFormData.companyName} Description`,
            address_name: this.companyFormData.companyName,
            address_description: `${this.companyFormData.companyName} Address Description`,
            address_phone: this.companyFormData.companyPhone,
            address_street: this.companyFormData.shippingStreet1,
            address_apt: this.companyFormData.shippingStreet2,
            address_city: this.companyFormData.shippingCity,
            address_region: this.companyFormData.shippingState,
            address_postcode: this.companyFormData.shippingZip,
            opticat_location_name: this.companyFormData.opticatLocationName,
          },
          {
            headers: {
              "DL-Authorization": this.user_token,
            },
          }
        )
        .then((response) => {
          this.shouldShowCompanyModal = false;
          if (
            response &&
            response.data &&
            response.data[0] &&
            response.data[0].address &&
            response.data[0].company
          ) {
            this.$store.commit("company/setCompanyShop", response.data);

            if (response.data[0].opticatLocationName) {
              this.$store.commit(
                "company/setOpticatLocationName",
                response.data[0].opticatLocationName
              );
            }

            this.$store.dispatch(
              "shoppinglist/triggerOpticatRequestsForListItems"
            );
          }
        })
        .catch((err) => {
          this.notify("Error creating company", "negative");
        });

      this.isCreatingCompanyAndShop = false;
    },

    onQuantityChange(newQuantity, part) {
      part.isQuantityUpdateLoading = true;
      this.items = this.items.slice();

      if (this.quantityUpdateTimeouts[part.root_part_id]) {
        window.clearTimeout(this.quantityUpdateTimeouts[part.root_part_id]);
        delete this.quantityUpdateTimeouts[part.root_part_id];
      }

      this.quantityUpdateTimeouts[part.root_part_id] = window.setTimeout(() => {
        this.changeQuantity(newQuantity, part);
      }, 2000);
    },

    // Adjust quantity
    async changeQuantity(qty, part) {
      this.localSelectedPart = part;

      const formData = {
        root_part_id: part.root_part_id,
        quantity: qty,
      };

      this.$store
        .dispatch("shoppinglist/updateListItemQuantity", formData)
        .then((res) => {
          part.isQuantityUpdateLoading = false;
          this.items = this.items.slice();

          if (res === "success") {
            this.notify(
              "Quantity updated successfully",
              "positive",
              "check_circle_outline"
            );
          } else if (res === "repeat") {
            this.notify("Quantity is already being updated", "negative");
          } else {
            this.notify(
              "An error occurred when attempting to update quantity",
              "negative"
            );
          }
        });
    },

    // Delete everything from the current list
    async clearList() {
      const url = `${process.env.SHOPPING_LIST_API_ROOT}`;
      await axios
        .delete(url, {
          headers: {
            "DL-Authorization": this.user_token,
          },
        })
        .then((response) => {
          this.$store.commit("shoppinglist/UPDATE_SHOPPING_LIST", []);
          this.$store.commit("shoppinglist/UPDATE_SHOPPING_CART", []);
          this.$store.commit("shoppinglist/resetNumberOfShoppingCartPolls");
          this.$store.commit("shoppinglist/CLEAR_SHOPPING_CART_POLL_INTERVAL");
          this.notify("Parts Removed Successfully", "positive");
          this.clearShoppingList = false;
        })
        .catch((err) => {
          this.notify("Error removing parts", "negative");
        });
    },

    // Tell dialog if we are deleting a part or clearing the list
    // If we don't pass in a part that means we're clearing the list
    deleteConfirmation(part = null) {
      if (part) {
        this.localSelectedPart = part;
        this.deleteMsg = `Are you sure you want to remove ${part.root_part_number}
            from your Shopping List?`;
        this.clearShoppingList = false;
      } else {
        this.deleteMsg =
          "Are you sure you want to clear all parts from your Shopping List?";
        this.clearShoppingList = true;
      }
      this.confirmDelete = true;
    },

    // Delete a part from the Shopping List
    async deletePart() {
      const url = `${process.env.SHOPPING_LIST_API_ROOT}parts/${this.localSelectedPart.root_part_id}`;
      await axios
        .delete(url, {
          headers: {
            "DL-Authorization": this.user_token,
          },
        })
        .then((response) => {
          this.$store.commit(
            "shoppinglist/UPDATE_SHOPPING_LIST",
            response.data.list
          );
          this.$store.commit(
            "shoppinglist/UPDATE_SHOPPING_CART",
            response.data.cart
          );
          this.notify("Part Deleted Successfully", "positive");
        })
        .catch((err) => {
          this.notify("Error deleting part", "negative");
        });
    },

    // Download Shopping List
    async downloadShoppingList() {
      // Turn on modal
      this.loadingResults = true;
      const url = `${process.env.SHOPPING_LIST_API_ROOT}pdf/download`;
      await axios
        .get(url, {
          responseType: "blob",
          headers: {
            "DL-Authorization": this.user_token,
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
          this.notify("Error Downloading List", "negative");
        });
      // Turn off modal
      this.loadingResults = false;
    },

    // Email Shopping List to the logged in user
    async emailShoppingList() {
      // Turn on modal
      this.loadingResults = true;
      const url = `${process.env.SHOPPING_LIST_API_ROOT}pdf/email`;
      await axios
        .get(url, {
          headers: {
            "DL-Authorization": this.user_token,
          },
        })
        .then((response) => {
          this.notify(`Email Sent To ${this.user_email}`, "positive");
        })
        .catch((err) => {
          this.notify("Error sending email", "negative");
        });
      // Turn off modal
      this.loadingResults = false;
    },

    // Tells the pagination what page we are on
    pageNumber(pageNum) {
      this.shoppingListPage = pageNum;
    },

    quantityOptions(item) {
      if (item.quantity_available) {
        return [...Array(item.quantity_available + 1).keys()].slice(1);
      }
      return [1];
    },

    // Save notes from dialog
    async saveNotes() {
      this.editNotes = false;
      const url = `${process.env.SHOPPING_LIST_API_ROOT}parts/notes`;
      await axios
        .put(
          url,
          {
            root_part_id: this.localSelectedPart.root_part_id,
            notes: this.notes,
          },
          {
            headers: {
              "DL-Authorization": this.user_token,
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
          this.notify("Note Saved Successfully", "positive");
        })
        .catch((err) => {
          this.notify("Error saving note", "negative");
        });
    },

    async viewSelectedPart(partClicked) {
      this.localSelectedPart = partClicked;

      const partsCrossPart = await getPart({ id: partClicked.root_part_uuid });

      this.$q.dialog({
        component: PartInfo,
        partProp: partsCrossPart.data,
      });
    },

    // removes duplicate manufacturers
    removeDuplicatesManufacturers() {
      this.manufacturers = [
        ...new Set(
          this.part.equivalences.map((part) => part.manufacturer_name)
        ),
      ].sort();
      //sets manufacturer to empty string
      this.manufacturer = "";
    },

    async verifyPreferred() {
      const url = `https://api-truckpartscross.com/api/manufacturer/${this.part.manufacturer_id}`;
      const details = await fetch(url, {
        method: "GET",
        headers: {
          "X-Authorization":process.env.MANUFACTURER_AUTHORIZATION,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const manufacturerData = await details.json();

      this.isPreferred = manufacturerData.data.preferred_partner;
    },

    // This tells the Notes dialog whether we are adding or editing notes
    viewNotes(part, action) {
      this.localSelectedPart = part;
      this.noteAction = action;
      this.notes = part.notes;
      this.editNotes = true;
    },

    getAddOrEditNotesForItem(item) {
      return item && item.notes ? "Edit" : "Add";
    },

    findOutHow() {
      if (!this.hasOpticatAccount) {
        this.shouldShowOptiCatModal = true;
      } else if (
        !this.companyShop ||
        (this.companyShop && this.companyShop.length === 0)
      ) {
        this.shouldShowCompanyModal = true;
      }
    },

    registerWithOptiCat() {
      alert(
        "This will redirect to OptiCat account creation when such a link is provided"
      );
    },

    goToShoppingCart() {
      if (this.shouldShowCartButton) {
        this.$router.push("/cart");
      }
    },
  },
};
</script>

<style lang="scss">
.button-container .block {
  font-size: 14px !important;
  font-weight: normal !important;
}

.cart-options {
  text-align: right;
}

.cart-options .call-to-action {
  display: inline-block;
  margin-left: 14px;
  color: #ffb81c;
  vertical-align: bottom;
  font-size: 23px;
}

.-view-cart {
  width: 105px;
  height: 21px;
  margin-left: 7%;
  font-family: Roboto;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.75;
  letter-spacing: 0.25px;
  text-align: center;
  color: #232323;
}
.view-cart-disabled {
  width: 116px;
  height: 34px;
  margin: 0px 1px 2px 14px;
  padding: 6px 1px 7px 1px;
  border-radius: 3px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
  background-color: #ccc;
  display: inline-block;
  color: #737373;
  text-align: center;
}
.-view-cart-disabled {
  width: 116px;
  height: 21px;
  margin-left: 6%;
  font-family: Roboto;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.75;
  letter-spacing: 0.25px;
  text-align: center;
  color: #737373;
}
.dialog-modal {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 75%;
  padding: 12px;
  font-size: 0.9em;
}
.dialog-msg {
  padding: 18px;
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: 0.42px;
  color: #232323;
}
.body--dark .dialog-msg {
  color: #fff;
}
.body--dark #shop-list-content .cart-options .opti-cat-trigger .purchase-parts {
  color: white;
}
.shopping-list-dialog .icon {
  color: #c20015;
}
.body--dark .shopping-list-dialog .icon {
  color: #ffb81c;
}
.dialog-input {
  border-radius: 4px;
  border: solid 1px #ccc;
  padding-left: 8px;
  padding-right: 8px;
  min-width: 100%;
  max-width: 100%;
  max-height: 450px;
  min-height: 46px;
}
.partAvailable {
  color: #43be00;
}
.partUnAvailable {
  color: #ccc;
}
.save-btn {
  background-color: #ffb81c;
  color: black;
  font-size: 12px;
  padding: 2px;
}
.shopping-list-logo {
  cursor: pointer;
  height: 50px;
}
#shop-list-content .partCell {
  font-weight: bold;
}

#shop-list-content th {
  background-color: #cccccc !important;
  color: #000;
}
#shop-list-content .row .row .q-table--no-wrap td {
  white-space: normal;
}

td {
  .notes {
    font-size: 14px;
    line-height: 20px;
  }
}

.clear_list_btn {
  font-size: 12px;
}
.clear_list_btn_mobile {
  font-size: 14px !important;
}
.body--light .clear_list_btn:hover {
  background: #000;
  color: #fff !important;
}
.body--dark .clear_list_btn {
  //background: #000;
  color: #fff !important;
  border: 2px solid #fff !important;
}
.body--dark .clear_list_btn:hover {
  background: #fff;
  color: #000 !important;
  border: 2px solid #fff !important;
}
.body--light .clear_list_btn_mobile:hover {
  background: #000;
  color: #fff !important;
}
.body--dark .clear_list_btn_mobile {
  //background: #000;
  color: #fff !important;
  border: 2px solid #fff !important;
}
.body--dark .clear_list_btn_mobile:hover {
  background: #fff;
  color: #000 !important;
  border: 2px solid #fff !important;
}
.list-hover:hover {
  color: #ffb81c;
  cursor: pointer;
}
.text-field-control {
  width: 100%;
  min-width: 90px;
}
.text-field-control-mobile {
  width: 100%;
}
.body--dark div.mobile-shopping-list > div:nth-of-type(even) {
  background: #999999;
}
.small-spacing {
  padding-left: 8px;
}
@media only screen and (max-width: 756px) {
  .small-spacing {
    padding: 10px;
  }
}

.shopping-list {
  padding-top: 16px;
  padding-bottom: 100px;

  @media (min-width: $breakpoint-md-min) {
    padding-top: 43px;
  }

  .heading {
    .title {
      @media (min-width: $breakpoint-md-min) {
        display: flex;
        align-items: center;
      }

      .opticat-location {
        margin-left: 20px;

        i {
          color: #43be00;
        }
      }
    }

    .radio-icon-group {
      display: none;

      @media (min-width: $breakpoint-md-min) {
        display: flex;
      }
    }
  }

  .cards-container {
    padding-top: 16px;

    @media (min-width: $breakpoint-md-min) {
      padding-top: 22px;
    }

    .shopping-list-item {
      width: 100%;
    }
  }

  .list-container {
    @media (min-width: $breakpoint-md-min) {
      width: 100%;
      max-width: 907px;
      padding: 10px;
    }
  }

  .footer {
    position: fixed;
    right: 0;
    bottom: 28px;
    left: 0;
    z-index: 99;

    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;

    padding: 14px 8px;

    background-color: black;

    @media (min-width: $breakpoint-md-min) {
      position: static;
      right: auto;
      bottom: auto;
      left: auto;
      z-index: auto;

      flex-direction: row;

      padding: 16px 0;

      background-color: transparent;
    }

    .options {
      .icon-container {
        i {
          color: white;
          font-size: 24px;
          line-height: 1;
        }
      }
    }

    .cart-options {
      .opti-cat-trigger {
        display: flex;
        align-items: center;

        text-align: center;

        @media (min-width: $breakpoint-md-min) {
          display: block;
          text-align: left;
        }

        .text {
          margin-bottom: 5px;
          color: white;

          @media (min-width: $breakpoint-md-min) {
            margin-bottom: 0;
            color: black;
          }
        }

        .find-out-how {
          flex-shrink: 0;
        }
      }
    }
  }
}

.opti-cat-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: calc(100% - 25px);
  max-width: 875px;

  padding: 10px 20px;

  font-weight: 500;

  @media (min-width: $breakpoint-md-min) {
    padding: 50px 80px;

    font-size: 20px;
    line-height: 32px;
  }

  .icon-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;

    @media (min-width: $breakpoint-md-min) {
      flex-direction: row;
      justify-content: center;
    }

    .text {
      margin-top: 8px;
      text-align: center;

      @media (min-width: $breakpoint-md-min) {
        margin-top: 8px;
        text-align: left;
      }
    }

    .icon-container {
      margin-right: 20px;

      i {
        font-size: 3em;

        @media (min-width: $breakpoint-md-min) {
          font-size: 4em;
        }
      }
    }
  }

  .opti-cat-dialog-msg {
    margin-top: 10px;
    border: solid 1px rgba(0, 0, 0, 0.12);
    border-radius: 4px !important;
    padding: 40px;

    @media (min-width: $breakpoint-md-min) {
      margin-top: 40px;
    }

    .step {
      @media (min-width: $breakpoint-md-min) {
        display: flex;
        align-items: center;
      }

      &:not(:first-child) {
        margin-top: 10px;

        @media (min-width: $breakpoint-md-min) {
          margin-top: 0;
        }
      }

      &.step-1 {
        .text {
          @media (min-width: $breakpoint-md-min) {
            width: 60%;
          }
        }

        .image-container {
          @media (min-width: $breakpoint-md-min) {
            width: 40%;
          }
        }
      }

      &.step-2 {
        @media (min-width: $breakpoint-md-min) {
          flex-direction: row-reverse;
        }

        .text {
          @media (min-width: $breakpoint-md-min) {
            width: 80%;
          }
        }

        .image-container {
          @media (min-width: $breakpoint-md-min) {
            width: 20%;
          }

          img {
            width: 30%;

            @media (min-width: $breakpoint-md-min) {
              width: 100%;
            }
          }
        }
      }

      &.step-3 {
        .text {
          @media (min-width: $breakpoint-md-min) {
            width: calc(50% + 20px);
            margin-right: -20px;
          }
        }

        .image-container {
          @media (min-width: $breakpoint-md-min) {
            width: 50%;
          }
        }
      }

      .image-container {
        width: 100%;
        margin-top: 5px;

        @media (min-width: $breakpoint-md-min) {
          width: auto;
          margin-top: 0;
        }

        img {
          display: block;
          width: 50%;
          margin-right: auto;
          margin-left: auto;

          @media (min-width: $breakpoint-md-min) {
            width: 100%;
            margin-right: 0;
            margin-left: 0;
          }
        }
      }
    }
  }
}

.q-dialog__inner--minimized > div.company-dialog {
  @media (min-width: $breakpoint-md-min) {
    width: 600px;
    height: 480px;
  }
}

.company-dialog {
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
}

.mobile {
  &:not(body) {
    @media (min-width: $breakpoint-md-min) {
      display: none;
    }
  }
}

.desktop {
  &:not(body) {
    display: none;
  }

  &:not(.row) {
    @media (min-width: $breakpoint-md-min) {
      display: block;
    }
  }

  &.row {
    @media (min-width: $breakpoint-md-min) {
      display: flex;
    }
  }
}

.q-layout {
  &:not(.sidebar-shown),
  &.sidebar-shown {
    .shopping-list {
      .cards-container {
        .shopping-list-item {
          &:not(:first-child) {
            margin-top: 12px;

            @media (min-width: $breakpoint-md-min) {
              margin-top: 0;
            }
          }
        }
      }
    }
  }

  &:not(.sidebar-shown) {
    .shopping-list {
      .cards-container {
        .shopping-list-item {
          @media (min-width: $breakpoint-md-min) {
            width: calc(33.333333% - 8px);
          }

          &:not(:nth-child(3n)) {
            @media (min-width: $breakpoint-md-min) {
              margin-right: 12px;
            }
          }

          &:nth-child(n + 4) {
            @media (min-width: $breakpoint-md-min) {
              margin-top: 12px;
            }
          }
        }
      }
    }

    .cart-options {
      .opti-cat-trigger {
        @media (min-width: $breakpoint-md-min) {
          display: flex;
          align-items: center;
        }

        .text {
          @media (min-width: $breakpoint-md-min) {
            margin-right: 15px;
          }
        }
      }
    }
  }

  &.sidebar-shown {
    .shopping-list {
      .cards-container {
        .shopping-list-item {
          @media (min-width: $breakpoint-md-min) {
            width: calc(50% - 6px);
          }

          @media (min-width: 1207px) {
            width: calc(33.333333% - 8px);
          }

          &:not(:nth-child(2n)) {
            @media (min-width: $breakpoint-md-min) {
              margin-right: 12px;
            }

            @media (min-width: 1207px) {
              margin-right: 0;
            }
          }

          &:not(:nth-child(3n)) {
            @media (min-width: 1207px) {
              margin-right: 12px;
            }
          }

          &:nth-child(n + 3) {
            @media (min-width: $breakpoint-md-min) {
              margin-top: 12px;
            }

            @media (min-width: 1207px) {
              margin-top: 0;
            }
          }

          &:nth-child(n + 4) {
            @media (min-width: 1207px) {
              margin-top: 12px;
            }
          }
        }
      }
    }

    .cart-options {
      .opti-cat-trigger {
        @media (min-width: 1207px) {
          display: flex;
          align-items: center;
        }

        .text {
          @media (min-width: 1207px) {
            margin-right: 15px;
          }
        }
      }
    }
  }
}

.options-container {
  .q-item {
    i {
      color: #cccccc;
    }
  }
}
</style>
