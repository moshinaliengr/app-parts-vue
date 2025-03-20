<template>
  <q-page class="flex justify-center">
    <div class="opticat-request-tracking">
      <div class="content">
        <LoadingOverlay
          :loading-prop="isLoading"
          bgOpacity="5"
        />

        <div
          class="heading row items-center justify-between"
          :class="{'q-mb-lg': !canFilter}"
        >
          <div class="title">
            <h5 class="q-my-none text-h5 text-weight-bold">
              OptiCat Request Tracking
            </h5>
          </div>

          <div class="download">
            <ButtonStandard
              class="q-px-xl"
              label="Download"
              tooltip="Download tracking data as CSV"
              size="md"
              style-extend="padding-top: 2px; padding-bottom: 2px;"
              @click.native="download"
              :loading="isDownloadingCsv"
            />
          </div>
        </div>

        <ButtonStandard
          class="q-my-sm q-px-md q-py-xs"
          label="Filter"
          tooltip="Open filter modal"
          size="md"
          icon-right="fas fa-filter"
          :color="isDark ? 'white' : 'black'"
          :full="false"
          @click.native="shouldShowFilterModal = true"
          v-if="canFilter"
          flat
        />

        <q-table
          class="hide-scrollbar modal-toolbar"
          :columns="columns"
          :data="filteredData"
          :pagination="{ rowsPerPage: 100 }"
          @row-click="selectRequest"
          bordered
          dark
          flat
          square
          wrap-cells
        />
      </div>

      <div class="help q-mt-lg">
        <h5 class="q-mt-none q-mb-sm text-weight-bold">Request Status Flows</h5>
        <h6 class="q-mt-none q-mb-sm">Type: Pricing</h6>
        <ol class="q-mt-none q-mb-md">
          <li>Created</li>
          <li>Token Generation Attempted -> Token Generated</li>
          <li>Connection Initiated -> Connected</li>
          <li>Request Submitted -> Submission Response Received</li>
          <li>Response Received</li>
          <li>Completed</li>
        </ol>

        <h6 class="q-mt-none q-mb-sm">Type: Order</h6>
        <ol class="q-my-none">
          <li>Created</li>
          <li>Connection Initiated -> Connected</li>
          <li>Request Submitted -> Submission Response Received</li>
          <li>Response Received</li>
          <li>Completed</li>
        </ol>
      </div>
    </div>

    <q-dialog v-model="shouldShowFilterModal">
      <q-card class="filter-modal full-width q-pa-lg">
        <h5 class="q-mt-none q-mb-md">Filters</h5>

        <q-option-group
          class="q-mb-md"
          :options="personalFilterOptions"
          v-model="selectedPersonalFilter"
          v-if="personalFilterOptions.length > 1"
          inline
        />

        <template v-if="typeFilterOptions.length > 1">
          <div class="flex items-center q-mb-sm">
            <h6 class="q-my-none">Type</h6>
            <a class="q-ml-md" @click="selectedTypeFilters = []">Reset</a>
          </div>
          <q-option-group
            class="q-mb-md"
            type="checkbox"
            :options="typeFilterOptions"
            v-model="selectedTypeFilters"
            inline
          />
        </template>

        <template v-if="statusFilterOptions.length > 1">
          <div class="flex items-center q-mb-sm">
            <h6 class="q-my-none">Status</h6>
            <a class="q-ml-md" @click="selectedStatusFilters = []">Reset</a>
          </div>
          <q-option-group
            class="q-mb-md"
            type="checkbox"
            :options="statusFilterOptions"
            v-model="selectedStatusFilters"
            inline
          />
        </template>

        <q-card-actions class="actions-container q-mt-md" align="right">
          <q-btn
            label="Cancel"
            style="min-width: 125px; border: 2px solid black; color: black"
            :style="isDark ? { borderColor: 'white', color: 'white'} : {}"
            flat
            no-caps
            v-close-popup
          />
          <q-btn
            class="q-ml-md"
            label="Apply"
            @click="applyFilters"
            style="min-width: 125px; background-color: #FFB81C; color: black;"
            :loading="isFiltering"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="shouldShowDetailModal">
      <q-card
        class="request-detail q-pa-lg"
        style="width: 800px; max-width: 80vw;"
        v-if="selectedRequest"
      >
        <h4 class="q-my-none text-weight-bold">
          {{ selectedRequest.request_id }}
        </h4>

        <h6 class="q-mt-md q-mb-sm">Basic Info</h6>
        <div
          class="type-status row q-mb-sm"
          v-if="selectedRequest.type_label || selectedRequest.status_label"
        >
          <div class="type col">
            <span class="text-weight-medium">Type:</span>
            {{ selectedRequest.type_label }}
          </div>
          <div class="status col q-ml-md" v-if="selectedRequest.status_label">
            <span class="text-weight-medium">Status:</span>
            {{ selectedRequest.status_label }}
          </div>
        </div>

        <div class="customer-user row q-mb-sm" v-if="selectedRequest.customer_id || selectedRequest.user_id">
          <div class="customer col" v-if="selectedRequest.customer_id">
            <span class="text-weight-medium">Customer ID:</span>
            {{ selectedRequest.customer_id }}
          </div>
          <div
            class="user col q-ml-md"
            :class="{ 'q-ml-md': selectedRequest.customer_id}"
            v-if="selectedRequest.user_id"
          >
            <span class="text-weight-medium">User ID:</span>
            {{ selectedRequest.user_id }}
          </div>
        </div>

        <div
          class="location-qty row q-mb-sm"
          v-if="selectedRequest.location_name || selectedRequest.qty"
        >
          <div class="type col">
            <span class="text-weight-medium">OptiCat Location Name:</span>
            {{ selectedRequest.location_name }}
          </div>
          <div class="qty col q-ml-md" v-if="selectedRequest.qty">
            <span class="text-weight-medium">Quantity:</span>
            {{ selectedRequest.qty }}
          </div>
        </div>

        <h6 class="q-mt-md q-mb-sm">Events</h6>
        <div
          class="created-updated row q-mb-sm"
          v-if="selectedRequest.created_at_string || selectedRequest.updated_at_string"
        >
          <div class="created col">
            <span class="text-weight-medium">Created:</span>
            {{ selectedRequest.created_at_string }}
          </div>
          <div class="updated col q-ml-md" v-if="selectedRequest.updated_at_string">
            <span class="text-weight-medium">Updated:</span>
            {{ selectedRequest.updated_at_string }}
          </div>
        </div>

        <div
          class="token-attempted-generated row q-mb-sm"
          v-if="(
            selectedRequest.token_generation_attempted_at_string ||
            selectedRequest.token_generated_at_string
          )"
        >
          <div class="attempted col">
            <span class="text-weight-medium">Token Generation Attempted:</span>
            {{ selectedRequest.token_generation_attempted_at_string }}
          </div>
          <div class="generated col q-ml-md" v-if="selectedRequest.token_generated_at_string">
            <span class="text-weight-medium">Token Generated:</span>
            {{ selectedRequest.token_generated_at_string }}
          </div>
        </div>

        <div
          class="connection-initiated-connection row q-mb-sm"
          v-if="(
            selectedRequest.connection_initiated_at_string ||
            selectedRequest.token_generated_at_string
          )"
        >
          <div class="initiated col">
            <span class="text-weight-medium">Connection Initiated:</span>
            {{ selectedRequest.connection_initiated_at_string }}
          </div>
          <div class="connected col q-ml-md" v-if="selectedRequest.connected_at_string">
            <span class="text-weight-medium">Connected:</span>
            {{ selectedRequest.connected_at_string }}
          </div>
        </div>

        <div
          class="submitted-received row q-mb-sm"
          v-if="(
            selectedRequest.submitted_at_string ||
            selectedRequest.submission_response_received_at_string
          )"
        >
          <div class="submitted col">
            <span class="text-weight-medium">Request Submitted:</span>
            {{ selectedRequest.submitted_at_string }}
          </div>
          <div class="received col q-ml-md" v-if="selectedRequest.submission_response_received_at_string">
            <span class="text-weight-medium">Submission Response Received:</span>
            {{ selectedRequest.submission_response_received_at_string }}
          </div>
        </div>

        <div
          class="last-response-completed row q-mb-sm"
          v-if="(
            selectedRequest.last_responded_at_string ||
            selectedRequest.completed_at_string
          )"
        >
          <div class="last-responded col">
            <span class="text-weight-medium">Last Responded:</span>
            {{ selectedRequest.last_responded_at_string }}
          </div>
          <div class="completed col q-ml-md" v-if="selectedRequest.completed_at_string">
            <span class="text-weight-medium">Completed:</span>
            {{ selectedRequest.completed_at_string }}
          </div>
        </div>

        <div class="last-response-data q-mt-md full-width" v-if="selectedRequest.last_response_data">
          <h6 class="q-mt-none q-mb-sm">
            Last Response Data
          </h6>

          <a @click="showLastResponseData = !showLastResponseData">
            {{ showLastResponseData ? "Hide" : "Show" }}
            <i
              class="far"
              :class="{
                  'fa-chevron-down': !showLastResponseData,
                  'fa-chevron-up': showLastResponseData
                }"
            />
          </a>
          <a class="q-ml-md" @click="copyJSON">
            <i class="far fa-copy" />
          </a>

          <pre v-if="showLastResponseData">{{ selectedRequest.last_response_data | pretty }}</pre>
        </div>

        <q-card-actions class="actions-container" align="right">
          <q-btn
            label="Close"
            style="min-width: 125px; border: 2px solid black; color: black"
            :style="isDark ? { borderColor: 'white', color: 'white'} : {}"
            flat
            no-caps
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import ButtonStandard from "components/common/ButtonStandard";
import LoadingOverlay from "components/common/LoadingOverlay";
import {Notify} from "src/mixins/Notify";
import {Dark} from "quasar";

export default {
  name: "OpticatRequestTracking",
  mixins: [Notify],
  filters: {
    pretty: val => {
      return JSON.stringify(val, null, 2);
    }
  },
  components: {
    ButtonStandard,
    LoadingOverlay
  },
  data() {
    return {
      authConfig: false,
      columns: [
        {
          align: "left",
          field: "request_id",
          label: "Channel",
          name: "channel",
          sortable: true
        },
        {
          align: "left",
          field: "type_label",
          label: "Type",
          name: "type",
          sortable: true
        },
        {
          align: "left",
          field: "status_label",
          label: "Status",
          name: "status",
          sortable: true
        },
        {
          align: "left",
          field: "qty",
          label: "Qty",
          name: "qty",
          sortable: true
        },
        {
          align: "left",
          field: "time_to_complete",
          label: "Time",
          name: "time_to_complete",
          sortable: false
        },
        {
          align: "left",
          field: "submitted_at_string",
          label: "Submitted",
          name: "submitted_at",
          sortable: true
        },
        {
          align: "left",
          field: "submission_response_received_at_string",
          label: "Received",
          name: "submission_response_received_at",
          sortable: true
        },
        {
          align: "left",
          field: "last_responded_at_string",
          label: "Last Responded",
          name: "last_responded_at",
          sortable: true
        },
        {
          align: "left",
          field: "completed_at_string",
          label: "Completed",
          name: "completed_at",
          sortable: true
        }
      ],
      filteredData: [],
      isDownloadingCsv: false,
      isFiltering: false,
      isLoading: false,
      selectedPersonalFilter: "all",
      selectedRequest: null,
      selectedStatusFilters: [],
      selectedTypeFilters: [],
      shouldShowFilterModal: false,
      showLastResponseData: false,
      trackingData: []
    }
  },
  computed: {
    canFilter() {
      return (
        this.personalFilterOptions.length > 1 ||
        this.statusFilterOptions.length > 1 ||
        this.typeFilterOptions.length > 1
      )
    },
    currentUserId() {
      const userInfo = this.$store.state.user.information;
      return userInfo ? userInfo.id : null;
    },
    isDark() {
      return Dark.isActive;
    },
    personalFilterOptions() {
      let filters = [
        {
          label: "All",
          value: "all"
        }
      ];

      if (this.trackingData.some(t => t.user_id === this.currentUserId)) {
        filters.push({
          label: "Mine",
          value: "mine"
        });
      }

      if (
        this.shoppingListRootPartIds.length > 0 &&
        this.trackingData.some(t => {
          const ids = t.ids ? t.ids.split(",") : [];
          return ids.some(id => this.shoppingListRootPartIds.indexOf(parseInt(id, 10)) > -1);
        })
      ) {
        filters.push({
          label: "Current",
          value: "current"
        });
      }

      return filters;
    },
    shoppingListRootPartIds() {
      const shoppingListItems = this.$store.getters["shoppinglist/shoppingList"];

      return shoppingListItems && shoppingListItems.length > 0
        ? shoppingListItems.map(i => i.root_part_id)
        : [];
    },
    shouldShowDetailModal: {
      get() {
        return !!this.selectedRequest;
      },
      set(bool) {
        if (!bool) {
          this.selectedRequest = null;
          this.showLastResponseData = false;
        }
      }
    },
    statusFilterOptions() {
      const allPossibleStatuses = [
        "completed", "connected", "connection_initiated",
        "created", "response_received", "submitted",
        "token_generated", "token_generation_attempted",
      ];

      return this.trackingData && this.trackingData.length > 0
        ? allPossibleStatuses.reduce((acc, status) => {
          const trackingDatumWithStatus = this.trackingData.find(t => t.status === status);

          if (trackingDatumWithStatus) {
            acc.push({
              label: trackingDatumWithStatus.status_label,
              value: status
            });
          }

          return acc;
        }, [])
        : [];
    },
    typeFilterOptions() {
      const allPossibleTypes = ["order", "pricing"];
      return this.trackingData && this.trackingData.length > 0
        ? allPossibleTypes.reduce((acc, type) => {
          const trackingDatumWithType = this.trackingData.find(t => t.type === type);

          if (trackingDatumWithType) {
            acc.push({
              label: trackingDatumWithType.type_label,
              value: type
            });
          }

          return acc;
        }, [])
        : [];
    }
  },
  mounted() {
    this.$store.dispatch("getAuthConfig").then(config => {
      this.authConfig = config;
      this.initData();
    });
  },
  methods: {
    applyFilters() {
      let filteredData = this.trackingData;
      this.isFiltering = true;

      if (this.selectedPersonalFilter === "mine") {
        filteredData = filteredData.filter(t => t.user_id === this.currentUserId);
      } else if (this.selectedPersonalFilter === "current") {
        filteredData = filteredData.filter(t => {
          const ids = t.ids
            ? t.ids.split(",").map(id => parseInt(id, 10))
            : [];
          return ids.some(id => this.shoppingListRootPartIds.indexOf(id) > -1);
        });
      }

      if (this.selectedTypeFilters.length > 0) {
        filteredData = filteredData.filter(t => this.selectedTypeFilters.indexOf(t.type) > -1);
      }

      if (this.selectedStatusFilters.length > 0) {
        filteredData = filteredData.filter(t => this.selectedStatusFilters.indexOf(t.status) > -1);
      }

      this.filteredData = filteredData;
      this.isFiltering = false;
      this.shouldShowFilterModal = false;
    },
    copyJSON() {
      if (this.selectedRequest && this.selectedRequest.last_response_data) {
        navigator.clipboard.writeText(JSON.stringify(this.selectedRequest.last_response_data));
      }
    },
    download() {
      this.isDownloadingCsv = true;

      let queryParams = "";

      if (this.selectedPersonalFilter !== "all") {
        queryParams += `?personal=${this.selectedPersonalFilter}`;
      }

      this.selectedTypeFilters.forEach(type => {
        queryParams += queryParams.length > 0 ? "&" : "?";
        queryParams += `type[]=${type}`;
      });

      this.selectedStatusFilters.forEach(status => {
        queryParams += queryParams.length > 0 ? "&" : "?";
        queryParams += `status[]=${status}`;
      });

      const url = `${process.env.SHOPPING_LIST_API_ROOT}opticat-request-tracking/download${queryParams}`;
      axios.get(url, { ...this.authConfig, responseType: "blob" })
        .then(res => {
          const url = window.URL.createObjectURL(res.data);
          const link = document.createElement("a");

          link.href = url;
          link.setAttribute("download", "opticat-request-tracking.csv");
          document.body.appendChild(link);
          link.click();
          this.isDownloadingCsv = false;
        })
        .catch(err => {
          console.log(err);
          this.isDownloadingCsv = false;
          this.notify("Error downloading CSV", "negative");
        });
    },
    initData() {
      if (this.authConfig) {
        this.isLoading = true;

        const url = `${process.env.SHOPPING_LIST_API_ROOT}opticat-request-tracking`;
        axios.get(url, this.authConfig)
          .then(res => {
            this.isLoading = false;
            if (res && res.data && res.data.opticat_request_tracking) {
              this.trackingData = res.data.opticat_request_tracking;
              this.filteredData = this.trackingData;
            }
          })
          .catch(err => {
            this.isLoading = false;
            this.notify("Error retrieving tracking data", "negative");
          });
      }
    },
    selectRequest(evt, row) {
      this.selectedRequest = row;
    }
  }
}
</script>

<style lang="scss" scoped>
.opticat-request-tracking {
  width: 100%;

  margin-right: 14px;
  margin-left: 14px;

  padding-top: 16px;
  padding-bottom: 100px;

  @media (min-width: $breakpoint-sm-min) {
    max-width: 907px !important;
    margin-right: 25px;
    margin-left: 25px;
  }

  @media (min-width: $breakpoint-md-min) {
    padding-top: 43px;
  }

  .heading {
    .title {
      @media (min-width: $breakpoint-md-min) {
        display: flex;
        align-items: center;
      }
    }
  }
}

.body--light {
  .opticat-request-tracking {
    &::v-deep {
      table.q-table {
        tbody {
          tr:nth-child(odd) {
            background: inherit;
          }
        }
      }
    }
  }
}
</style>
