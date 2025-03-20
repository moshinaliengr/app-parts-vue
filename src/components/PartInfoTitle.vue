<template>
  <q-card-section class="flex row q-px-sm q-pb-none items-start full-width">
    <q-card-section
      class="bg-white flex flex-center q-ma-sm q-py-sm overflow-hidden"
      :style="isMobile ? `width: 100%;` : `width: 20%;`"
    >
      <q-img
        v-if="part.image_url"
        :src="part.image_url"
        style="height: 80%; width: 80%"
        :ratio="1"
        contain
      >
        <q-btn
          round
          size="sm"
          tooltip="Zoom In"
          icon="zoom_in"
          class="absolute-bottom-right"
          color="primary"
          @click.native="imageModal = !imageModal"
        />
      </q-img>

      <q-img
        v-else
        :src="'/no-image.png'"
        style="height: 80%; width: 80%"
        :ratio="1"
        contain
      >
      </q-img>
    </q-card-section>

    <q-card-section
      :style="isMobile ? `width: 100%;` : `width: 75%;`"
      class="no-padding q-ma-sm column items-start justify-start"
    >
      <KeyValueText
        v-if="part.manufacturer_name"
        keyName="Manufacturer"
        :value="part.manufacturer_name"
      >
        <q-icon
          @click.native="manufacturerDetails = true"
          name="fas fa-info-circle"
          :class="
            isPreferred ? `q-pl-sm text-primary` : `q-pl-sm text-secondary`
          "
        >
          <q-tooltip> View Manufacturer Details </q-tooltip>
        </q-icon>
      </KeyValueText>

      <KeyValueText v-if="part.name" keyName="Description" :value="part.name" />

      <KeyValueText
        v-if="part.category_name"
        keyName="Category"
        :value="`${part.category_name}/${part.sub_category_name}`"
      />

      <KeyValueText
        v-if="part.vmrs"
        keyName="VMRS Code"
        :value="`${part.vmrs}`"
      />

      <p v-if="part.notes" class="q-mb-md">{{ part.notes }}</p>

      <p v-if="part.obsolete" class="text-red">
        This part is obsolete and no longer manufactured.
      </p>

      <div
        class="flex row q-my-sm no-wrap"
        :style="
          isMobile
            ? `width: 100%; justify-content:space-between;`
            : `width: 100%; justify-content:flex-start;`
        "
      >
        <!-- 
       <q-btn
          v-if="part.amazon_url"
          icon="fab fa-amazon"
          padding="sm"
          size="sm"
          type="a"
          color="primary"
          text-color="black"
          :class="isMobile ? `` : `q-mr-sm `"
          label="Buy Now"
          target="_blank"
          :href="part.amazon_url"
        >
          <q-tooltip> Buy on Amazon </q-tooltip>
        </q-btn>

        <q-btn
          v-if="part.google_url"
          icon="fab fa-google"
          padding="sm"
          size="sm"
          type="a"
          color="primary"
          text-color="black"
          :class="isMobile ? `` : `q-mr-sm `"
          label="Buy Now"
          target="_blank"
          :href="part.google_url"
        >
          <q-tooltip> Buy on Google </q-tooltip>
        </q-btn>

        <q-btn
          v-if="part.ebay_url"
          icon="fab fa-ebay"
          padding="sm"
          size="sm"
          type="a"
          color="primary"
          text-color="black"
          :class="isMobile ? `` : `q-mr-sm `"
          label="Buy Now"
          target="_blank"
          :href="part.ebay_url"
        >
          <q-tooltip> Buy on Ebay </q-tooltip>
        </q-btn> -->

        <q-btn
          v-if="$ld.flags['shopping-list']"
          padding="sm"
          size=".8em"
          color="primary"
          text-color="black"
          :class="isMobile ? `q-ml-md` : `q-mr-sm`"
          label="Add to Shopping List"
          @click.native="addPartToShoppingList({ part })"
          no-caps
          :loading="shoppingListLoading"
        >
          <q-tooltip> Add this item to Shopping List </q-tooltip>
        </q-btn>

        <q-btn
          v-if="$ld.flags['dayton-button']"
          color="primary"
          align="right"
          padding="sm"
          size=".8em"
          text-color="black"
          label="Buy from Dayton"
          no-caps
          href="https://www.dormanhdsolutions.com/"
          class="btn-fixed-width q-pl-lg"
          target="_blank"
        >
          <div class="absolute-left q-pa-sm q-gutter-sm">
            <q-icon size="16px">
              <img
                src="../../src/assets/Dayton Logos-PNGs-Dayton-Icon-1 copy.png"
              />
            </q-icon>
          </div>
          <q-tooltip>Buy On Dayton</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>

    <bookmark-button
      v-if="favoritePartsLoaded"
      :isBookmarked="isBookmarked"
      class="absolute-top-right q-mt-lg q-mr-md"
      @change="setIsBookmarked"
    />

    <q-dialog v-model="imageModal">
      <ModalContent
        class="part-info-content"
        :fullHeight="false"
        :title="partTitle"
      >
        <q-card-section class="q-px-md q-pt-md q-pb-none text-center">
          <img :src="part.image_url" style="max-height: 75vh" />
        </q-card-section>
      </ModalContent>
    </q-dialog>

    <q-dialog v-model="manufacturerDetails">
      <ModalContent class="part-info-content" :title="part.manufacturer_name">
        <ManufacturerInfo :manufacturerId="part.manufacturer_id" />
      </ModalContent>
    </q-dialog>
  </q-card-section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Platform } from "quasar";

import BookmarkButton from "./partsCross/BookmarkButton.vue";
import KeyValueText from "./common/KeyValueText.vue";
import ModalContent from "./common/ModalContent.vue";
import ManufacturerInfo from "./ManufacturerInfo.vue";

export default {
  name: "PartInfoTitle",

  components: {
    BookmarkButton,
    KeyValueText,
    ModalContent,
    ManufacturerInfo,
  },

  data() {
    return {
      isBookmarked: false,
      imageModal: false,
      manufacturerDetails: false,
      shoppingListLoading: false,
    };
  },

  props: {
    part: {
      type: Object,
      required: true,
    },

    isPreferred: {
      type: Boolean,
      default: false,
    },
  },

  mounted: async function () {
    await this.loadFavoriteParts();
  },

  computed: {
    ...mapState("favoriteparts", {
      favoritePartsLoaded: "loaded",
      favoriteParts: "items",
    }),

    isMobile() {
      if (Platform.is.mobile) return true;
      else return false;
    },

    partTitle() {
      return `${this.part.manufacturer_name} ${this.part.number}`;
    },
  },

  methods: {
    ...mapActions("favoriteparts", {
      addFavoritePart: "addItem",
      removeFavoritePart: "removeItem",
      loadFavoriteParts: "ensureItems",
    }),

    setIsBookmarked(isBookmarked) {
      this.isBookmarked = isBookmarked;

      if (isBookmarked) {
        this.addFavoritePart({ partID: this.part.id });
      } else {
        this.removeFavoritePart({ partID: this.part.id });
      }
    },

    async addPartToShoppingList({ part }) {
      this.shoppingListLoading = true;
      try {
        const opticat_brand_code = part?.opticat_part?.brand_code || null;
        const formData = {
          root_part_number: part.number,
          root_manufacturer_name: part.manufacturer_name,
          root_manufacturer_code: part.manufacturer_id,
          root_part_uuid: part.id,
          notes: part.notes,
          description: part.name,
          order: "12345string",
          opticat_brand_code: opticat_brand_code,
          image_url: part.image_url,
        };

        const listOrError = await this.$store.dispatch(
          "shoppinglist/addPartToShoppingList",
          formData
        );

        if (listOrError !== "error") {
          this.$q.notify({
            message: "Added to Shopping List",
            type: "positive",
            position: "top",
          });
        } else {
          this.$q.notify({
            message: "Error adding part to Shopping List",
            type: "negative",
            position: "top",
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.shoppingListLoading = false;
      }
    },
  },

  watch: {
    part: function () {
      let favoritePart = this.favoriteParts.find((item) => {
        return item.part_id === this.part.id;
      });

      if (favoritePart) {
        this.isBookmarked = true;
      } else {
        this.isBookmarked = false;
      }
    },
  },
};
</script>
