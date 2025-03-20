<template>
  <q-card-section class="scroll flex flex-center">
    <!-- News content -->

    <div v-for="post in posts" :key="post.id">
      <q-card class="my-card q-mb-md" style="box-shadow: 0" flat>
        <!-- Article Image -->
        <q-img
          :src="`${baseURL}/${post.CoverImage.url}`"
          basic
        >
          <div class="absolute-bottom row items-center">
            <span class="text-h6">{{ post.Title }}</span>
            <q-badge
              v-if="post.isNew"
              class="q-ml-sm"
              color="red"
              label="NEW"
            />
          </div>
        </q-img>

        <q-card-section class="q-pa-xs">
          <VueShowdown
            class="vueshowdownoverrides"
            :markdown="post.ContentFull"
            flavor="github"
            :options="{ emoji: true }"
          />

          <p class="text-caption" style="margin-bottom: 0">
            Written by: {{ post.created_by.firstname }}
          </p>

          <p v-if="post.Date" class="text-caption">
            Posted: {{ getDate(post) }}
          </p>
        </q-card-section>
      </q-card>

      <!-- Separator shown if > 1 article -->
      <q-separator v-if="posts.length > 1" />
    </div>
  </q-card-section>
</template>

<script>
import { date } from "quasar";

export default {
  name: "DieselNews",

  props: { posts: { type: Array } },

  data: () => ({
    readMore: false,
    readMoreData: {},
    baseURL:process.env.NEWS_SERVICE_BASE_URL,
  }),

  methods: {
    getDate: function (newsDate) {
      const fixDate = newsDate.Date.toString();
      const longMonthDayYear = date.formatDate(
        fixDate.toString(),
        "MMMM D, YYYY"
      );
      const time = date.formatDate(fixDate.toString(), "h:mma");
      return `${longMonthDayYear} at ${time}`;
    },
  },
};
</script>

<style lang="scss">
.vueshowdownoverrides {
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial,
    sans-serif;

  h1 {
    font-weight: 400;
    line-height: 140% !important;
    font-size: 2em;
  }
  h2 {
    font-size: 1.8em;
    line-height: 1.8em;
    margin: 0px !important;
  }

  h3 {
    font-size: 1.6em;
    line-height: 1.6em;
  }

  h4 {
    font-size: 1.4em;
    line-height: 1.4em;
  }

  h5 {
    font-size: 1.2em;
    line-height: 1.2em;
  }

  ul,
  ol {
    padding-left: 25px;
  }
}
</style>
