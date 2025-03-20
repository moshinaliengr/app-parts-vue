<template>
  <div>
    <q-dialog ref="dialog" @hide="onDialogHide">
      <ModalContent :title="partTitle">
        <LoadingOverlay :loadingProp="loadingResults" bgOpacity="5" />
        <!-- Part Information -->
        <q-card v-show="partDetails" v-if="!indirectDirect" flat>
          <PartInfoTitle :part="part" :isPreferred="isPreferred" />
          <!-- Tabs -->
          <q-card-section class="flex justify-center items-start full-width">
            <div class="full-width">
              <q-tabs
                v-if="part"
                v-model="tab"
                class="text-grey full-width"
                active-color="primary"
                indicator-color="primary"
                align="left"
                narrow-indicator
                dense
              >
                <q-tab
                  name="equivalence"
                  label="Equivalent Parts"
                  :class="$q.platform.is.desktop ? `q-pl-md` : `q-pl-none`"
                  style="white-space: pre-wrap; max-width: 250px"
                  align="left"
                >
                  <q-tooltip> View Equivalent Parts </q-tooltip>
                </q-tab>
                <q-tab
                  name="attributes"
                  label="Attributes"
                  :class="$q.platform.is.desktop ? `q-pl-md` : `q-pl-none`"
                  style="white-space: pre-wrap; max-width: 250px"
                  align="left"
                >
                  <q-tooltip> View Attributes </q-tooltip>
                </q-tab>
                <q-tab
                  v-if="part.recommended_parts.length > 0"
                  name="recommended"
                  style="white-space: pre-wrap; max-width: 250px"
                  :label="`Recommended Parts (${part.recommended_parts.length})`"
                  align="left"
                >
                  <q-tooltip> View Recommended Parts </q-tooltip>
                </q-tab>

                <q-tab
                  name="opticat_ymm"
                  label="Y/M/M"
                  :class="$q.platform.is.desktop ? `q-pl-md` : `q-pl-none`"
                  style="white-space: pre-wrap; max-width: 250px"
                  align="left"
                >
                  <q-tooltip> View Year Make and Model </q-tooltip>
                </q-tab>

                <q-tab
                  name="opticat"
                  style="white-space: pre-wrap; max-width: 250px"
                  label="OptiCat Data"
                  align="left"
                >
                  <q-tooltip> View Opticat Data </q-tooltip>
                </q-tab>
              </q-tabs>

              <q-separator inset />

              <q-tab-panels v-model="tab" animated>
                <q-tab-panel
                  name="equivalence"
                  class="no-padding full-width q-mb-lg"
                >
                  <q-card v-if="part.equivalences.length >= 1" flat>
                    <q-card-section>
                      <q-select
                        v-model="manufacturer"
                        :options="manufacturers"
                        option-label="name"
                        label="Filter by Manufacturer"
                        class="q-my-sm full-width"
                        outlined
                        dense
                      >
                        <template v-slot:append>
                          <q-icon
                            v-if="manufacturer.id !== -1"
                            name="close"
                            @click.stop="manufacturer = { name: '', id: null }"
                            class="cursor-pointer"
                          />
                        </template>
                        <q-tooltip> Filter by Manufacturer </q-tooltip>
                      </q-select>

                      <q-list bordered separator dense>
                        <q-item
                          v-for="(part, p) in part.equivalences.map(
                            (part) => part
                          )"
                          :key="p"
                        >
                          <q-item-section class="q-mt-sm">
                            <KeyValueText
                              keyName="Part Number"
                              :value="part.number"
                            />

                            <KeyValueText
                              keyName="Manufacturer"
                              :value="part.manufacturer_name"
                            />

                            <KeyValueText
                              keyName="Description"
                              :value="part.name"
                            />

                            <KeyValueText
                              keyName="Type"
                              :value="
                                part.automatic === true ? `Indirect` : `Direct`
                              "
                            >
                              <ThumbnailImages
                                :PartImage="part.image_url"
                                size="sm"
                                class="absolute-center-end"
                              />
                              <q-btn
                                @click.native="indirectDirect = true"
                                round
                                flat
                                icon="fas fa-question-circle"
                                class="cursor-pointer"
                                size="xs"
                                target="_blank"
                              />
                            </KeyValueText>

                            <q-item-label class="q-mb-sm">
                              <ButtonStandard
                                label="View Part"
                                @click.native="updateToNewPart({ part })"
                                tooltip="View Part Details"
                                :full="false"
                                size="sm"
                                class="q-px-sm q-mt-md"
                              />
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>

                    <q-card-section
                      v-if="
                        part.equivalences.length > 0 &&
                        totalResultsFound > partsPerPage
                      "
                      class="q-pt-none"
                    >
                      <q-pagination
                        v-if="$q.platform.is.desktop"
                        v-model="pageNumber"
                        :max-pages="5"
                        :max="numberOfPages"
                        :direction-links="true"
                        :boundary-links="true"
                        :boundary-numbers="true"
                        icon-first="skip_previous"
                        icon-last="skip_next"
                        class="flex flex-center q-px-xs"
                        text-color="black"
                        color="primary"
                        dense
                      />

                      <q-pagination
                        v-else
                        v-model="pageNumber"
                        :max="numberOfPages"
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
                  </q-card>

                  <!-- If no equivalent parts -->
                  <q-card-section v-else>
                    Sorry, we have researched this part and cannot find any
                    alternatives.
                  </q-card-section>
                </q-tab-panel>
                <q-tab-panel
                  name="attributes"
                  class="no-padding full-width q-mb-lg"
                >
                  <q-card flat>
                    <q-card-section>
                      <KeyValueText
                        keyName="NOTE"
                        value="Please contact the part manufacturer if no attribute data is listed or if you have further questions regarding part specifications."
                        class="q-my-sm"
                      />
                      <q-table
                        title="Attributes"
                        :data="params"
                        :columns="params_columns"
                        row-key="params_key"
                        :rows-per-page-options="[0]"
                      />
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel
                  name="recommended"
                  class="q-px-none q-mb-lg"
                  v-if="part.recommended_parts.length >= 1"
                >
                  <!-- List for recommended parts -->
                  <q-list dense separator>
                    <q-item
                      v-for="(part, p) in part.recommended_parts.map(
                        (part) => part
                      )"
                      :key="p"
                      class="q-px-none"
                    >
                      <q-item-section class="q-mt-sm">
                        <ThumbnailImages
                          :PartImage="part.image_url"
                          size="sm"
                          class="fixed-center, absolute-right"
                        />
                        <KeyValueText
                          keyName="Part Number"
                          :value="String(part.number)"
                        />

                        <KeyValueText
                          keyName="Manufacturer"
                          :value="part.manufacturer_name"
                        />

                        <KeyValueText
                          v-if="part.name"
                          keyName="Description"
                          :value="part.name"
                        />

                        <KeyValueText
                          v-if="part.pivot.notes"
                          keyName="Notes"
                          :value="part.pivot.notes"
                        />

                        <ThumbnailImages
                          :PartImage="part.image_url"
                          size="sm"
                          class="absolute-center-end"
                        />

                        <q-item-label>
                          <ButtonStandard
                            label="View Part Details"
                            @click.native="updateToNewPart({ part })"
                            :full="false"
                            class="q-px-sm"
                          />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-tab-panel>

                <q-tab-panel
                  name="opticat"
                  class="q-px-none q-mb-lg"
                  style="min-height: 60px"
                >
                  <OpticatDetails
                    v-if="part.opticat_part != null"
                    :part="part"
                  />
                  <div v-else>No additional details at this time.</div>
                </q-tab-panel>

                <!-- list for Year Make Model -->
                <q-tab-panel name="opticat_ymm">
                  <div class="ymm-container row">
                    <div
                      class="make col-4"
                      v-for="row_value in object_aces"
                      :key="row_value"
                    >
                      {{ row_value.make_description }}
                      <div
                        v-for="row_model in row_value.models"
                        :key="row_model"
                        class="model"
                      >
                        {{ row_model.model_description }} :
                        <div
                          v-for="row_year in row_model.years"
                          :key="row_year"
                          class="year"
                        >
                          {{ row_year.year_description }}
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </q-card-section>
        </q-card>

        <!-- Details for if a part is indirect or direct -->
        <q-card v-else flat class="q-px-md">
          <q-btn
            @click.native="indirectDirect = false"
            class="back-button self-start q-px-xs"
            color="primary"
            icon="chevron_left"
            :label="returnString"
            size="md"
            flat
          />

          <div class="text-h6">What are Direct vs. Indirect part crosses?</div>

          <p>
            Parts that are directly crossed from manufacturers’ information are
            called (D)irect Crosses. However, not every manufacturer has
            detailed cross reference records. For example. Manufacturer A
            crosses to B, and B crosses to C, but A and C never crossed to each
            other. Our algorithms figured out these crosses, which we call
            (I)ndirect crosses. You should always verify these cross references,
            but they should work!
          </p>
        </q-card>
      </ModalContent>
    </q-dialog>
  </div>
</template>

<script>
import ButtonStandard from "../components/common/ButtonStandard.vue";
import KeyValueText from "../components/common/KeyValueText";
import LoadingOverlay from "../components/common/LoadingOverlay";
import ModalContent from "../components/common/ModalContent";
import OpticatDetails from "./partsCross/OpticatDetails.vue";
import PartInfoTitle from "../components/PartInfoTitle.vue";
import { getEquivalentParts, getPartV2 } from "../services/TruckPartsCross";
import ThumbnailImages from "./partsCross/ThumbnailImages.vue";

export default {
  name: "PartInfo",

  components: {
    ButtonStandard,
    KeyValueText,
    LoadingOverlay,
    ModalContent,
    OpticatDetails,
    PartInfoTitle,
    ThumbnailImages,
  },

  data: () => ({
    baseURL: process.env.TRUCK_PARTS_CROSS_SERVICE_BASE_URL,
    apiKey: process.env.TRUCK_PARTS_CROSS_SERVICE_API_KEY,
    part: {
      equivalences: [],
      recommended_parts: [],
    },
    loadingResults: false,
    manufacturer: { name: "", id: null },
    manufacturers: [],
    tab: "equivalence",
    partDetails: true,
    pageNumber: 1,
    partsPerPage: 10,
    totalResultsFound: 0,
    indirectDirect: false,
    returnString: "",
    isPreferred: false,
    object_aces: [],
    format_aces: {},
    params: [],
    params_columns: [
      {
        name: "param_key",
        field: "param_key",
        required: true,
        label: "Attribute",
        align: "left",
        sortable: true,
      },
      {
        name: "param_value",
        align: "center",
        label: "Value",
        field: "param_value",
        sortable: true,
      },
    ],
  }),

  props: {
    partProp: {
      type: Object,
      required: true,
    },
  },

  mounted: async function () {
    this.part = { ...this.partProp, equivalences: [], recommended_parts: [] };
    await this.getPartAndEquivalences({
      partId: this.part.id,
      manufacturerId: null,
      resetPageNumber: true,
    });
    const url = `${this.baseURL}/api/opticat/${this.part.opticat_part.id}`;
    const details = await fetch(url, {
      method: "GET",
      headers: {
        "X-Authorization":
          "vR9de51iv3OQAO2gD1z03h0Ac7dQW0RoyX3LDrW2yLBw4L9761FrChOO25qk",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const opticatData = await details.json();

    this.optidata = opticatData.data;

    const aces = JSON.stringify(opticatData.aces);
    const object_aces = JSON.parse(aces);
    const format_aces = JSON.parse(object_aces);

    console.log(format_aces.results);
    format_aces.results.forEach((value, index) => {
      const split_data = value.acesApp.baseVehicleName.split(" ");
      let make = { make_description: split_data[1], models: [] };
      let check_make = this.object_aces.filter(
        (data) => data.make_description == split_data[1]
      );
      if (check_make.length == 0) {
        this.object_aces.push(make);
      } else {
        make = check_make[0];
      }
      let row = this.object_aces.indexOf(make);
      let model = { model_description: split_data[2], years: [] };
      let check_model = this.object_aces[row].models.filter(
        (data) => data.model_description == split_data[2]
      );
      if (check_model.length == 0) {
        this.object_aces[row].models.push(model);
      } else {
        model = check_model[0];
      }
      let model_row = this.object_aces[row].models.indexOf(model);
      let year = { year_description: split_data[0] };
      let check_year = this.object_aces[row].models[model_row].years.filter(
        (data) => data.year_description == split_data[0]
      );
      if (check_year.length == 0) {
        this.object_aces[row].models[model_row].years.push(year);
      }
    });
    this.loadingResults = false;
  },
  async function() {
    const url = `${this.baseURL}/api/opticat/${this.part.opticat_part.id}`;
    const details = await fetch(url, {
      method: "GET",
      headers: {
        "X-Authorization":
          "vR9de51iv3OQAO2gD1z03h0Ac7dQW0RoyX3LDrW2yLBw4L9761FrChOO25qk",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const opticatData = await details.json();

    this.optidata = opticatData.data;

    this.loadingResults = false;
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.totalResultsFound / this.partsPerPage);
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

    partTitle() {
      return this.part.manufacturer_name
        ? this.part.manufacturer_name + " " + this.part.number
        : this.partProp.manufacturer_name + " " + this.partProp.number;
    },
  },

  methods: {
    show() {
      this.$refs.dialog.show();
    },

    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      this.$emit("hide");
    },

    onOKClick() {
      this.$emit("ok");
      this.hide();
    },

    onCancelClick() {
      this.hide();
    },

    /**
     * Gets the part and its equivalences from the TruckPartsCross API.
     *
     * @param {string} partId
     * @param {boolean|null} manufacturerId - (optional) the manufacturer id to filter by
     * @param {boolean|null} resetPageNumber - (optional) if page number should be reset to 1
     */
    async getPartAndEquivalences({
      partId,
      manufacturerId = null,
      resetPageNumber = false,
    }) {
      if (resetPageNumber) this.pageNumber = 1;

      this.part.equivalences = [];
      this.part.recommended_parts = [];

      this.loadingResults = true;

      try {
        const partRes = await getPartV2({ id: partId });
        const equivalentPartsRes = await getEquivalentParts({
          partId,
          page: this.pageNumber,
          per_page: this.partsPerPage,
          manufacturer_id: manufacturerId,
        });

        const part = partRes.data;

        this.params = [];
        if (part.params != null) {
          Object.keys(part.params).forEach((key) => {
            if (part.params[key] != "NA") {
              const param = { param_key: key, param_value: part.params[key] };
              this.params.push(param);
            }
          });
        }

        this.setPartAndEquivalences({ part, equivalences: equivalentPartsRes });
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "Error getting part information",
          type: "negative",
          position: "top",
        });
      } finally {
        this.loadingResults = false;
      }
    },

    /**
     * Sets local state using the data we got back from the TruckPartsCross API.
     *
     * @param {object} part
     * @param {object} equivalences
     */
    setPartAndEquivalences({ part, equivalences }) {
      part.equivalences = equivalences.data;
      part.notes = part.notes.replace("<p>", "");

      this.part = part;

      this.totalResultsFound = equivalences.meta.found;
      this.manufacturers = equivalences.meta.updates.manufacturer;

      this.verifyManufacturerPreferred();

      this.returnString = `Back to ${this.part.manufacturer_name} ${this.part.number}`;
    },

    async verifyManufacturerPreferred() {
      try {
        const url = `${this.baseURL}/api/manufacturer/${this.part.manufacturer_id}`;
        const details = await fetch(url, {
          method: "GET",
          headers: {
            "X-Authorization": process.env.MANUFACTURER_AUTHORIZATION,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const manufacturerData = await details.json();

        this.isPreferred = manufacturerData.data.preferred_partner;
      } catch (err) {
        console.log(err);
      }
    },

    updateToNewPart({ part }) {
      this.part = { ...part, equivalences: [], recommended_parts: [] };
      this.pageNumber = 1;
      // Reset Tab as we do not know if the new part contains recommended_parts or not.
      this.tab = "equivalence";
      this.manufacturer = { name: "", id: null };
    },
  },

  watch: {
    manufacturer(newManufacturer) {
      this.getPartAndEquivalences({
        partId: this.part.id,
        manufacturerId: newManufacturer.id,
        resetPageNumber: true,
      });
    },

    pageNumber(newPageNumber, oldPageNumber) {
      if (newPageNumber !== oldPageNumber) {
        this.getPartAndEquivalences({
          partId: this.part.id,
          manufacturerId: this.manufacturer.id,
          resetPageNumber: false,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@media (min-width: 600px) {
  .q-dialog__inner--minimized > div {
    width: 75%;
    max-width: 900px !important;
  }
}
div.q-img__image.absolute-full {
  background-size: contain !important;
}

.ymm-container {
  width: 100%;
  padding: 0px;
}
.make {
  font-weight: bolder;
  padding: 10px;
  font-size: 16px;
}
.model {
  font-weight: bold;
  display: block;
  padding-left: 10px;
  margin-bottom: 10px;
  font-size: 12px;
}
.year {
  font-weight: normal;
  display: inline;
}
</style>
