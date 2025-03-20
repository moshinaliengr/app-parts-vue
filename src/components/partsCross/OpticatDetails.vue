<template>
  <div>
    <LoadingOverlay :loadingProp="loadingResults" bgOpacity="0" />
    <template v-if="optidata">
      <q-item class="q-py-none" dense v-if="!loadingResults">
        <!-- Filler to right align OptiCat Logo -->
        <q-item-section />

        <q-item-section thumbnail class="">
          <span>
            Powered by

            <img
              src="../..//assets/opticat-logo.png"
              style="height: 20px; width: 150px"
            />
          </span>
        </q-item-section>
      </q-item>

      <q-list v-if="!loadingResults" class="q-pt-none">
        <!-- OptiCat General -->
        <q-expansion-item
          class="q-pb-sm"
          label="OptiCat General"
          header-class="text-subtitle1 q-px-sm"
        >
          <q-card class="q-px-md">
            <!--<KeyValueText keyName="Part Number" :value="optidata.partNumber" />-->

            <KeyValueText
              keyName="Brand Code"
              :value="optidata.brandCode"
              v-if="optidata.hasOwnProperty('brandCode')"
            />

            <KeyValueText
              keyName="Brand Name"
              :value="optidata.brandName"
              v-if="optidata.hasOwnProperty('brandName')"
            />

            <KeyValueText
              keyName="Brand Label"
              :value="optidata.brandLabel"
              v-if="optidata.hasOwnProperty('brandLabel')"
            />
            <q-item-label
              class="q-ml-xs"
              v-if="optidata.hasOwnProperty('brandAdditionalInfo')"
            >
              <span class="text-weight-medium">
                Brand is a part of AASA 'Know Your Parts' program:
              </span>

              <q-icon
                size="xs"
                :name="
                  optidata.brandAdditionalInfo.isKnowYourParts
                    ? 'fas fa-check-circle'
                    : 'fas fa-times-circle'
                "
                v-if="
                  optidata.brandAdditionalInfo.hasOwnProperty('isKnowYourParts')
                "
              />
            </q-item-label>

            <KeyValueText
              keyName="Category ID"
              :value="optidata.categoryId"
              v-if="optidata.hasOwnProperty('categoryId')"
            />

            <KeyValueText
              keyName="Category"
              :value="optidata.categoryName"
              v-if="optidata.hasOwnProperty('categoryName')"
            />

            <KeyValueText
              keyName="Subcategory ID"
              :value="optidata.subCategoryId"
              v-if="optidata.hasOwnProperty('subCategoryId')"
            />

            <KeyValueText
              keyName="Subcategory Name"
              :value="optidata.subCategoryName"
              v-if="optidata.hasOwnProperty('subCategoryName')"
            />

            <KeyValueText
              keyName="Part Type ID"
              :value="optidata.partTypeId"
              v-if="optidata.hasOwnProperty('partTypeId')"
            />

            <KeyValueText
              keyName="Part Type Name"
              :value="optidata.partTypeName"
              v-if="optidata.hasOwnProperty('partTypeName')"
            />
          </q-card>
        </q-expansion-item>

        <!-- OptiCat Info -->
        <q-expansion-item
          class="q-pb-sm"
          label="OptiCat Info"
          header-class="text-subtitle1 q-px-sm"
        >
          <q-card class="q-px-md">
            <q-item-label
              class="q-ml-xs"
              v-if="optidata.hasOwnProperty('brandAdditionalInfo')"
            >
              <span class="text-weight-medium">Website: </span>
              <span
                class="text-weight-light"
                v-if="optidata.brandAdditionalInfo.hasOwnProperty('websiteURL')"
              >
                <a
                  class="text-blue"
                  type="link"
                  :href="optidata.brandAdditionalInfo.websiteURL"
                  target="_blank"
                >
                  {{ optidata.brandAdditionalInfo.websiteURL }}
                </a>
              </span>
            </q-item-label>

            <q-item-label class="q-ml-xs">
              <span class="text-weight-medium">
                Contains Hazardous Material:
              </span>

              <q-icon
                size="xs"
                :name="
                  optidata.hazardousMaterialCode
                    ? 'fas fa-check-circle'
                    : 'fas fa-times-circle'
                "
                v-if="optidata.hasOwnProperty('hazardousMaterialCode')"
              />
            </q-item-label>

            <div v-if="optidata.hasOwnProperty('itemLevelGTIN')">
              <KeyValueText
                v-if="optidata.itemLevelGTIN.hasOwnProperty('gtin')"
                keyName="Global Trade Identification Number (GTIN)"
                :value="optidata.itemLevelGTIN.gtin"
              />

              <KeyValueText
                v-if="optidata.itemLevelGTIN.hasOwnProperty('qualifierCode')"
                keyName="GTIN Qualifier Code"
                :value="optidata.itemLevelGTIN.qualifierCode"
              />

              <KeyValueText
                v-if="optidata.itemLevelGTIN.hasOwnProperty('qualifierName')"
                keyName="GTIN Qualifier Name"
                :value="optidata.itemLevelGTIN.qualifierName"
              />
            </div>
          </q-card>
        </q-expansion-item>

        <!-- OptiCat Description -->
        <q-expansion-item
          class="q-pb-sm"
          label="OptiCat Description"
          header-class="text-subtitle1 q-px-sm"
        >
          <q-card
            class="q-px-md"
            v-if="optidata.hasOwnProperty('descriptions')"
          >
            <KeyValueText
              v-for="(description, d) in optidata.descriptions"
              :key="d"
              :keyName="description.descriptionTypeName"
              :value="description.value"
            />
          </q-card>
        </q-expansion-item>

        <!-- Product Attributes -->
        <template v-if="optidata.hasOwnProperty('productAttributes')">
          <q-expansion-item
            class="q-pb-sm"
            v-if="optidata.productAttributes.length"
            label="OptiCat Product Attributes"
            header-class="text-subtitle1 q-px-sm"
          >
            <q-card class="q-px-md">
              <q-item-label
                class="q-ml-xs"
                v-for="(attribute, a) in optidata.productAttributes"
                :key="a"
              >
                <span
                  class="text-weight-medium"
                  v-if="attribute.isPAdbAttribute === true"
                  >{{ attribute.padbAttributeName }}: </span
                ><span class="text-weight-medium" v-else
                  >{{ attribute.customAttributeName }}:
                </span>
                <span class="text-weight-light">{{ attribute.value }}</span>
                <slot />
              </q-item-label>
            </q-card>
          </q-expansion-item>
        </template>
        <!-- Extended Information -->

        <template v-if="optidata.hasOwnProperty('extendedInformation')">
          <q-expansion-item
            v-if="optidata.extendedInformation.length"
            class="q-pb-sm"
            label="OptiCat Extended Product Information"
            header-class="text-subtitle1 q-px-sm"
          >
            <q-card class="q-px-md">
              <KeyValueText
                v-for="(extended, e) in optidata.extendedInformation"
                :key="e"
                :keyName="extended.expiName"
                :value="extended.value"
              />
            </q-card>
          </q-expansion-item>
        </template>
        <!-- Packages -->

        <template v-if="optidata.hasOwnProperty('packages')">
          <q-expansion-item
            class="q-pb-sm"
            v-if="optidata.packages.length"
            label="Packages"
            header-class="text-subtitle1 q-px-sm"
          >
            <q-card class="q-px-md">
              <q-card-section v-for="(pack, p) in optidata.packages" :key="p">
                <div
                  class="text-subtitle1"
                  v-if="pack.hasOwnProperty('packageUOMName')"
                >
                  {{ pack.packageUOMName }}:
                </div>

                <KeyValueText
                  keyName="Quantity"
                  :value="pack.quantityOfEaches"
                  v-if="pack.hasOwnProperty('quantityOfEaches')"
                />
                <!-- TODO: Stop concatenating strings like this! -->
                <KeyValueText
                  keyName="Dimensions"
                  v-if="pack.hasOwnProperty('dimensions')"
                  :value="`${pack.dimensions.length} x ${pack.dimensions.width} x ${pack.dimensions.height} ${pack.dimensions.uomCode}`"
                />

                <KeyValueText
                  v-if="pack.hasOwnProperty('weights')"
                  keyName="Weight"
                  :value="`${pack.weights.weight}  ${pack.weights.uomCode}`"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </template>
        <!-- Images -->

        <template v-if="optidata.hasOwnProperty('digitalAssets')">
          <q-expansion-item
            class="q-pb-sm"
            v-if="optidata.digitalAssets.length"
            label="Images"
            header-class="text-subtitle1 q-px-sm"
          >
            <q-carousel
              swipeable
              animated
              v-model="slide"
              ref="carousel"
              control-type="regular"
              control-color="primary"
              class="q-mb-md"
              :thumbnails="optidata.digitalAssets.length > 1"
              v-if="optidata.digitalAssets.length"
              infinite
            >
              <q-carousel-slide
                v-for="(img, i) in filteringImages()"
                :key="i"
                :name="i"
                :img-src="img.imageURL1600 || noImageUrl"
                class="no-padding"
                style="background-repeat: no-repeat"
              >
                <ButtonRound
                  color="primary"
                  icon="zoom_in"
                  tooltip="Zoom In"
                  style="position: absolute; bottom: 6rem; right: 0"
                  @click.native="imageModal = !imageModal"
                />
              </q-carousel-slide>

              <template v-slot:control>
                <q-carousel-control position="bottom-right">
                </q-carousel-control>
              </template>
            </q-carousel>
          </q-expansion-item>
        </template>
      </q-list>

      <q-dialog v-model="imageModal">
        <ModalContent :title="part.name" :fullHeight="false">
          <q-carousel
            swipeable
            animated
            v-model="slide"
            padding
            class="text-center q-mb-md"
            :controls="optidata.digitalAssets"
            control-type="unelevated"
            control-color="primary"
            height="auto"
          >
            <q-carousel-slide
              class="no-padding"
              v-for="(img, i) in filteringImages()"
              color="white"
              :key="i"
              :name="i"
            >
              <img
                :src="img.imageURL1600"
                class="q-mx-auto"
                style="max-height: 75vh"
              />
            </q-carousel-slide>
          </q-carousel>
        </ModalContent>
      </q-dialog>
    </template>
  </div>
</template>

<script>
import ButtonRound from "../common/ButtonRound";
import KeyValueText from "../common/KeyValueText";
import LoadingOverlay from "../common/LoadingOverlay";
import ModalContent from "../common/ModalContent";

export default {
  name: "OptiCatDetails",
  components: { ButtonRound, KeyValueText, LoadingOverlay, ModalContent },
  data: () => ({
    baseURL: process.env.TRUCK_PARTS_CROSS_SERVICE_BASE_URL,
    optidata: { brandAdditionalInfo: {} },
    loadingResults: true,
    slide: 0,
    imageModal: false,
    noImageUrl: process.env.NO_IMAGE_FOUND_URL,
    filteredImages: [],
  }),

  props: {
    part: {
      type: Object,
      required: true,
    },
  },

  methods: {
    filteringImages() {
      const images = this.optidata.digitalAssets;
      const goodImages = [];
      const badImages = [];
      for (var index = 0; index < images.length; index++) {
        if (images[index].hasOwnProperty("imageURL50") || images.length === 1) {
          goodImages.push(images[index]);
        } else {
          badImages.push(images[index]);
        }
      }

      return (this.filteredImages = goodImages);
    },
  },

  mounted: async function () {
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
};
</script>

<style scoped>
.q-carousel__slide {
  background-size: contain !important;
}
</style>
