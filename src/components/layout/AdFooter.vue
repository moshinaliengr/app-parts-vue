<template>
  <q-footer
    class="flex flex-center"
    style="z-index: 1000"
    @click.native="sendAdData('open')"
  >
    <a :href="link" target="_blank" class="ad-footer-img">
      <q-img
        class="ad-footer-img shadow-2"
        alt="Advertisement"
        clickable
        :src="img"
      />
    </a>

    <!-- Spacer for iOS app switcher -->
    <div class="row bg-black full-width capacitor-only platform-ios-only">
      &nbsp;
    </div>
  </q-footer>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    img: "",
    id: null,
    link: "",
    platformID: String,
    baseURL:process.env.ADS_SERVICE_BASE_URL,
  }),

  mounted: function () {
    // this function returns a big dataset of paramters about the advert that is displayed
    // img,link,id, etc,
    axios
      .get(
        `${this.baseURL}/api/ads?appId=${process.env.DIESEL_APP_ID}&appToken=${process.env.DIESEL_APP_TOKEN}`
      )
      .then((response) => {
        this.id = response.data.data.id;
        this.img = response.data.data.url;
        this.link = response.data.data.openLink;
        this.sendAdData("view");
        this.getNewAd();
      });
  },

  methods: {
    async sendAdData(eventType) {
      // this function posts to a url endpoint stating this is the id of the advert that was viewed / clicked
      const response = await this.$axios.post(
        `${this.baseURL}/api/ads/${this.id}/events`,
        {
          appId: 36,
          appToken: `${process.env.DIESEL_APP_TOKEN}`,
          event: eventType,
        }
      );
    },

    async getNewAd() {
      window.setInterval(
        async () =>
          await this.$axios
            .get(
              `${this.baseURL}/api/ads?appId=${process.env.DIESEL_APP_ID}&appToken=${process.env.DIESEL_APP_TOKEN}`
            )
            .then((response) => {
              this.id = response.data.data.id;
              this.img = response.data.data.url;
              this.link = response.data.data.openLink;
              this.sendAdData("view");
            }),
        60000
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.ad-footer-img {
  max-width: 768px;
  width: 100%;
}

// Hides ad when keyboard is shown in mobile
// 567 was selected, as 568 is the iphone 5/SE height
@media only screen and (max-height: 567px) {
  footer {
    img {
      height: 0;
      width: 0;
    }
  }
}
</style>
