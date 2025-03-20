<template>
  <div>
    <q-card
      flat
      v-if="manufacturerData.preferred_partner"
    >
      <q-card-section class="row justify-between items-center q-pa-md">
        <div class="col-4 column">
          <img
            :src="manufacturerData.logo"
            style="max-height: 220px; width: 100%"
          />
        </div>
        <div class="col-7">
          <div v-if="manufacturerData.website">
            Website:
            <a
              class="text-blue"
              type="link"
              :href="'https://' + manufacturerData.website"
              target="_blank"
            >{{ manufacturerData.website }}</a>
          </div>

          <div v-if="manufacturerData.phone">
            Phone: {{ manufacturerData.phone }}
          </div>

          <div v-if="manufacturerData.vmrs">
            VMRS: {{ manufacturerData.vmrs }}
          </div>

          <div v-if="manufacturerData.year_founded">
            Year Founded: {{ manufacturerData.year_founded }}
          </div>

          <div v-if="manufacturerData.categories.length > 0">
            Product Categories:
            <div
              v-for="category in manufacturerData.categories"
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
        v-if="manufacturerData.mission"
      >
        <div class="text-h6">Company Mission</div>
        {{ manufacturerData.mission }}
      </q-card-section>
      <q-card-section
        style="white-space: pre-wrap"
        v-if="manufacturerData.history"
      >
        <div class="text-h6">Company History</div>
        {{ manufacturerData.history }}
      </q-card-section>
      <q-card-section
        style="white-space: pre-wrap"
        v-if="manufacturerData.warranty_policy"
      >
        <div class="text-h6">Warranty Policy</div>
        {{ manufacturerData.warranty_policy }}
      </q-card-section>
      <q-card-section
        style="white-space: pre-wrap"
        v-if="manufacturerData.training_offerings"
      >
        <div class="text-h6">Training Offerings</div>
        {{ manufacturerData.training_offerings }}
      </q-card-section>
      <q-card-section
        style="white-space: pre-wrap"
        v-if="manufacturerData.why_buy"
      >
        <div class="text-h6">Why Choose Us?</div>
        {{ manufacturerData.why_buy }}
      </q-card-section>
      <q-card-section
        :class="isMobile ? `` : `q-mx-md`"
        v-if="manufacturerData.video_url"
      >
        <q-video
          :ratio="16 / 9"
          :src="manufacturerData.video_url"
        />
      </q-card-section>

      <q-card-section v-if="manufacturerData.pdfs.length > 0">
        <div class="text-h6">PDFs</div>
        <div
          v-for="pdf in manufacturerData.pdfs"
          :key="pdf.id"
        >
          <q-icon
            size="xs"
            name="fas fa-file-pdf"
            class="q-mr-xs"
          />

          <a
            class="text-blue"
            type="link"
            :href="pdf.url"
            target="_blank"
          >
            {{ pdf.name }}
          </a>
        </div>
      </q-card-section>
    </q-card>
    <q-card
      flat
      v-else
    >
      <q-card-section class="q-pa-md">
        <p class="no-padding">
          {{ manufacturerData.name }} is currently not supplying us with enough
          information to have an advanced listing. If you are a representative
          of {{ manufacturerData.name }}, please fill out the form below so we
          can get this fixed.
        </p>

        <form
          action
          @submit.prevent="submitRequest"
        >
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
          <ButtonStandard
            label="Submit Upgrade Request"
            type="submit"
            v-close-popup="submitted"
          />
        </form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { Platform } from "quasar";
import { Notify } from "../mixins/Notify.js";

import ButtonStandard from "../components/common/ButtonStandard";

export default {
  name: "ManufacturerInfo",

  data: () => ({
    baseURL:process.env.TRUCK_PARTS_CROSS_SERVICE_BASE_URL,
    manufacturerData: { categories: [], pdfs: [] },
    contactModal: false,
    submitted: false,
    companyName: "",
    manufacturer: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
    headers: {
      "X-Authorization":process.env.MANUFACTURER_AUTHORIZATION,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }),

  props: {
    manufacturerId: {
      type: Number,
      required: false,
    },
  },

  components: { ButtonStandard },
  mixins: [Notify],
  mounted: async function () {
    if (this.manufacturerId) await this.getPreferred();
  },

  computed: {
    isMobile() {
      if (Platform.is.mobile) return true;
      else return false;
    },

    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    async getPreferred() {
      const url = `${this.baseURL}/api/manufacturer/${this.manufacturerId}`;
      const details = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });

      const manufacturerData = await details.json();

      this.manufacturerData = manufacturerData.data;
      this.manufacturerData.video_url = this.manufacturerData.video_url.replace(
        "watch?v=",
        "embed/"
      );
      return manufacturerData.data;
    },

    async submitRequest() {
      const requestUrl = `${USER_REPO_BASE_URL}/api/support/parts/manufacturer/request`;

      const payload = {
        email: this.user.information.email,
        first_name: this.firstName,
        last_name: this.lastName,
        company: this.companyName,
        phone: this.phoneNumber,
        manufacturer: this.manufacturerData.name,
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
        this.submitted = true;
      } else {
        this.notify("Please fill out the form completely.", "negative");
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
