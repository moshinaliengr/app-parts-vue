<template>
  <q-btn
    :icon="isBookmarked ? 'bookmark' : 'bookmark_border'"
    @click="$emit('change', !isBookmarked)"
    :class="$q.platform.is.mobile ? `text-black` : ``"
    round
    flat
  >
    <q-tooltip>{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<script>
export default {
  name: "BookmarkButton",

  props: {
    isBookmarked: { type: Boolean, default: false },
    tooltip: { type: String, default: "Bookmark Part" }
  }
};
</script>
