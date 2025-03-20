<template>
  <div>
    <!-- Manufacturer Search -->
    <q-input
      v-model="query"
      label="Search Manufacturers"
      debounce="500"
      class="q-my-md"
      dense
      outlined
    >
      <template v-slot:append>
        <q-icon
          v-if="query !== ''"
          name="close"
          @click="query = ''"
          class="cursor-pointer"
        />
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Manufacturer Table -->
    <q-table
      dense
      :data="otherManufacturers"
      :columns="tableHeadings"
      style="max-height: 400px; cursor: pointer"
      flat
      hide-pagination
      :pagination.sync="pagination"
      row-key="name"
      table-header-style="display: none"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            @click.native="selectManufacturer(props.row)"
          >
            <q-img
              style="max-height: 24px"
              v-if="col.name === 'Logo' && col.value !== ''"
              :src="col.value"
              class="q-ma-xs"
            />
            {{ col.name !== "Manufacturer" ? "" : col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Manufacturer Table Pagination -->
    <q-card-section v-if="manufacturerPages > 1" class="no-padding">
      <q-pagination
        v-if="isDesktop"
        class="justify-center"
        v-model="manufacturerPage"
        :max="manufacturerPages"
        :max-pages="5"
        :direction-links="true"
        :boundary-links="true"
        :boundary-numbers="true"
        text-color="black"
        icon-first="skip_previous"
        icon-last="skip_next"
        dense
        fit
      />

      <!-- Mobile & Tablet Pagination -->
      <q-pagination
        v-else
        v-model="manufacturerPage"
        :max="5"
        input-class="text-bold text-primary"
        class="flex flex-center q-px-xs"
        icon-first="skip_previous"
        icon-last="skip_next"
        text-color="black"
        color="primary"
        input
        dense
      />
    </q-card-section>

    <q-dialog v-model="contactModal">
      <ModalContent title="Contact Us" :fullHeight="false">
        <q-card class="q-ma-sm">
          <q-card-section class="q-pa-md">
            <p class="no-padding">
              {{ manufacturer }} is currently not supplying us with enough
              information to have an advanced listing. If you are a
              representative of {{ manufacturer }}, please fill out the form
              below so we can get this fixed.
            </p>

            <form action @submit.prevent="submitRequest">
              <q-input
                class="q-mt-lg"
                v-model="companyName"
                autofocus="autofocus"
                label="Company Name"
                dense
                outlined
              />

              <q-input
                class="q-my-sm"
                v-model="firstName"
                label="First Name"
                dense
                outlined
              />

              <q-input
                class="q-my-sm"
                v-model="lastName"
                label="Last Name"
                dense
                outlined
              />

              <q-input
                class="q-my-sm"
                v-model="phoneNumber"
                label="Best Phone Number"
                dense
                outlined
                mask="(###) ### - ####"
              />

              <q-input
                class="q-mt-sm q-mb-lg"
                v-model="message"
                label="Message (Optional)"
                dense
                outlined
              />

              <ButtonStandard label="Submit Upgrade Request" type="submit" />
            </form>
          </q-card-section>
        </q-card>
      </ModalContent>
    </q-dialog>

    <q-dialog v-model="manufacturerInfo" full-height full-width>
      <ModalContent :title="preferredManufacturer.name">
        <q-card class="q-ma-sm">
          <q-card-section class="row justify-between items-center q-pa-md">
            <div class="col-4 column">
              <img
                :src="preferredManufacturer.logo"
                style="max-height: 220px; width: 100%"
              />
            </div>

            <div class="col-7">
              <div v-if="preferredManufacturer.website">
                Website:
                <a
                  class="text-blue"
                  type="link"
                  :href="'https://' + preferredManufacturer.website"
                  target="_blank"
                >
                  {{ preferredManufacturer.website }}
                </a>
              </div>

              <div v-if="preferredManufacturer.phone">
                Phone: {{ preferredManufacturer.phone }}
              </div>

              <div v-if="preferredManufacturer.vmrs">
                VMRS: {{ preferredManufacturer.vmrs }}
              </div>

              <div v-if="preferredManufacturer.year_founded">
                Year Founded: {{ preferredManufacturer.year_founded }}
              </div>

              <div v-if="preferredManufacturer.categories.length > 0">
                Product Categories:
                <div
                  v-for="category in preferredManufacturer.categories"
                  :key="category.id"
                  class="category"
                >
                  {{ category.name }}
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section
            style="white-space: pre-wrap"
            v-if="preferredManufacturer.warranty_policy"
            class="q-py-sm"
          >
            <div class="text-h6">Warranty Policy</div>
            <span v-html="preferredManufacturer.warranty_policy"></span>
          </q-card-section>

          <q-card-section
            style="white-space: pre-wrap"
            v-if="preferredManufacturer.history"
            class="q-py-sm"
          >
            <div class="text-h6">Company History</div>
            <span v-html="preferredManufacturer.history"></span>
          </q-card-section>

          <q-card-section
            style="white-space: pre-wrap"
            v-if="preferredManufacturer.why_buy"
            class="q-py-sm"
          >
            <div class="text-h6">Why Choose Us?</div>
            <span v-html="preferredManufacturer.why_buy"></span>
          </q-card-section>

          <q-card-section
            style="white-space: pre-wrap"
            v-if="preferredManufacturer.training_offerings"
            class="q-py-sm"
          >
            <div class="text-h6">Training Offerings</div>
            <span v-html="preferredManufacturer.training_offerings"></span>
          </q-card-section>

          <q-card-section
            style="white-space: pre-wrap"
            v-if="preferredManufacturer.mission"
            class="q-py-sm"
          >
            <div class="text-h6">Company Mission</div>
            <span v-html="preferredManufacturer.mission"></span>
          </q-card-section>

          <q-card-section
            :class="isMobile ? `` : `q-mx-md`"
            v-if="preferredManufacturer.video_url"
            class="q-py-sm q-px-xs"
          >
            <q-video :ratio="16 / 9" :src="preferredManufacturer.video_url" />
          </q-card-section>

          <q-card-section
            v-if="preferredManufacturer.pdfs.length > 0"
            class="q-py-sm"
          >
            <div class="text-h6">PDFs</div>
            <div v-for="pdf in preferredManufacturer.pdfs" :key="pdf.id">
              <q-icon size="xs" name="fas fa-file-pdf" class="q-mr-xs" />

              <a class="text-blue" type="link" :href="pdf.url" target="_blank">
                {{ pdf.name }}
              </a>
            </div>
          </q-card-section>
        </q-card>
      </ModalContent>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Platform } from "quasar";
import ButtonStandard from "../components/common/ButtonStandard";
import ModalContent from "../components/common/ModalContent";
import { Notify } from "../mixins/Notify.js";

export default {
  name: `Manufacturers`,
  components: {
    ButtonStandard,
    ModalContent,
  },
  mixins: [Notify],
  computed: {
    ...mapGetters(["user"]),

    // Whether or not the user is mobile
    isDesktop() {
      if (this.$q.platform.is.desktop) {
        return true;
      } else return false;
    },

    isMobile() {
      if (Platform.is.mobile) return true;
      else return false;
    },

    user() {
      return this.$store.state.user;
    },
  },

  data: () => ({
    baseURL: process.env.TRUCK_PARTS_CROSS_SERVICE_BASE_URL,
    pageNumber: 1,
    pagination: {
      rowsPerPage: 10,
      // rowsNumber: xx if getting data from a server
    },
    perPage: 100,
    query: "",
    headers: {
      "X-Authorization": process.env.MANUFACTURER_AUTHORIZATION,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    manufacturerPage: 1,
    manufacturerPages: 1,
    otherManufacturers: [],
    manufacturerInfo: false,
    preferredManufacturer: { categories: [], pdfs: [] },
    contactModal: false,
    companyName: "",
    manufacturer: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
    totalManufacturers: 0,

    tableHeadings: [
      {
        name: "Logo",
        label: "logo",
        field: "logo",
        sortable: true,
        align: "center",
      },
      {
        name: "Manufacturer",
        label: "Manufacturer name",
        field: "name",
        sortable: true,
        align: "left",
      },
    ],
  }),

  mounted: async function () {
    // Get first page of otherManufacturers
    this.otherManufacturers = await this.getManufacturerPage(
      `1`,
      "&sort_by=preferred_partner&sort_dir=desc&filter_on=&filter=&search_by=&search=&total=0&found=0&fields[]=name&fields[]=logo&fields[]=message&fields[]=vmrs&fields[]=preferred_partner"
    );
  },

  methods: {
    async selectPreferred(id) {
      this.preferredManufacturer = await this.getPreferred(id);
      this.preferredManufacturer.video_url = this.preferredManufacturer.video_url.replace(
        "watch?v=",
        "embed/"
      );
      this.manufacturerInfo = true;
    },

    async console(thing) {
      console.log(thing);
    },

    // Gets a page of manufacturer data
    async getPreferred(id) {
      const url = `${this.baseURL}/api/manufacturer/${id}`;
      const details = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });

      const manufacturers = await details.json();

      return manufacturers.data;
    },

    getManufacturerPage: async function (pageNumber, querySlug) {
      const url = `${this.baseURL}/api/manufacturer?per_page=10&page=${pageNumber}${querySlug}`;
      const returnedManufacturers = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });

      const manufacturers = await returnedManufacturers.json();
      const total = manufacturers.meta.found;

      // Update page totals
      if (this.totalManufacturers !== total) {
        this.totalManufacturers = total;
        this.manufacturerPages = this.calculatePages(
          10,
          this.totalManufacturers
        );
      }
      return manufacturers.data;
    },

    // Gets total page number by dividing total number of manufacturers found by results per page
    calculatePages(perPage, results) {
      return Math.ceil(results / perPage);
    },

    // Opens contact window to submit a contact request
    async contact(row) {
      this.manufacturer = row.name;
      this.contactModal = true;
      this.companyName = "";
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.phoneNumber = "";
      this.message = "";
    },

    selectManufacturer(manufacturer) {
      if (manufacturer.preferred_partner === true)
        this.selectPreferred(manufacturer.id);
      else this.contact(manufacturer);
    },

    async submitRequest() {
      const requestUrl = `${USER_REPO_BASE_URL}/api/support/parts/manufacturer/request`;

      const payload = {
        email: this.user.information.email,
        first_name: this.firstName,
        last_name: this.lastName,
        company: this.companyName,
        phone: this.phoneNumber,
        manufacturer: this.manufacturer,
        message: this.message,
      };

      const headers = getHeaders(this.user);

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        this.notify(
          "Thank you for the request. A member of our staff will be in touch with you shortly.",
          "positive"
        );
        this.contactModal = false;
      } else {
        this.notify("Please fill out the form completely.", "negative");
      }
    },
  },

  watch: {
    // TODO: explain me
    manufacturerPage: async function () {
      if (this.query.length > 2) {
        this.otherManufacturers = await this.getManufacturerPage(
          this.manufacturerPage,
          `&sort_by=preferred_partner&sort_dir=desc&filter_on=&filter=&search_by=&search=${this.query}&total=0&found=0&fields[]=name&fields[]=logo&fields[]=message&fields[]=vmrs&fields[]=preferred_partner`
        );
      } else {
        this.otherManufacturers = await this.getManufacturerPage(
          this.manufacturerPage,
          `&sort_by=preferred_partner&sort_dir=desc&filter_on=&filter=&search_by=&search=&total=0&found=0&fields[]=name&fields[]=logo&fields[]=message&fields[]=vmrs&fields[]=preferred_partner`
        );
      }
    },

    // search manufacturers based on query
    query: async function () {
      // if query is greater than 3 chars, get matching data
      if (this.query.length > 2) {
        // sets manufacturer page to 1 and searches
        this.otherManufacturers = await this.getManufacturerPage(
          `1`,
          `&sort_by=preferred_partner&sort_dir=desc&filter_on=&filter=&search_by=&search=${this.query}&total=0&found=0&fields[]=name&fields[]=logo&fields[]=message&fields[]=vmrs&fields[]=preferred_partner`
        );
      } else {
        this.otherManufacturers = await this.getManufacturerPage(
          this.manufacturerPage,
          `&sort_by=preferred_partner&sort_dir=desc&filter_on=&filter=&search_by=&search=&total=0&found=0&fields[]=name&fields[]=logo&fields[]=message&fields[]=vmrs&fields[]=preferred_partner`
        );
      }
      // if it less than 3 chars, clear the array
      // if (this.query.length <= 2) this.otherManufacturers = [];
    },
  },
};
</script>

<style lang="scss">
.category {
  display: contents;
}

.category + .category::before {
  display: inline-block;
  white-space: pre;
  content: ", ";
}
td {
  font-size: 14px !important;
}

div.q-img__image.absolute-full {
  background-size: contain;
}

#q-app
  > div
  > div
  > main
  > div
  > section
  > div:nth-child(2)
  > div
  > div.q-table__container.q-table--horizontal-separator.column.no-wrap.q-table__card.q-table--flat.q-table--dense.q-table--no-wrap
  > div
  > table
  > tbody
  > tr:nth-child(1)
  > td.q-td.text-center
  > div
  > div.q-img__image.absolute-full {
  background-size: contain !important;
}
</style>
