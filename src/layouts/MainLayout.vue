<template>
  <q-layout :class="{ 'sidebar-shown': isSidebarShown }" view="hHh LpR lFf">
    <NavBar @drawer-shown="onDrawerShown" />

    <q-page-container>
      <transition
        appear
        enter-active-class="animated slideInRight slow overflow-hidden"
        leave-active-class="animated slideOutLeft slow overflow-hidden"
      >
        <router-view />
      </transition>
    </q-page-container>

    <AdFooter v-model="adFooter" />
  </q-layout>
</template>

<script>
import AdFooter from "components/layout/AdFooter";
import NavBar from "components/layout/NavBar";

export default {
  name: "MainLayout",
  data: () => ({
    adFooter: true,
    layout: Number,
    isSidebarShown: false
  }),

  components: {
    AdFooter,
    NavBar,
  },

  methods: {
    onDrawerShown(val) {
      this.isSidebarShown = val;
    },
    onResize(size) {
      this.layout = size;
    },
  },
};
</script>
