<template>
  <q-page class="flex justify-center">
    <ShoppingList v-if="usersShoppingList" />
    <ContentCard class="empty-state" v-else>
      <!-- If this user has a open Shopping List display it -->
      <div class="flex flex-center">
        <q-card-section class="text-center" full-width>
          <img
            src="../assets/app-logo.png"
            alt="Diesel Laptops logo"
            style="width: 65%"
          />
          <div class="text-center q-mt-lg">
            There are no parts on your shopping list
          </div>
        </q-card-section>
      </div>
    </ContentCard>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import ShoppingList from "../components/ShoppingList";

export default {
  name: "UserShoppingList",
  components: { ContentCard, ShoppingList },

  computed: {

    // Return number of items in this users Shopping List
    usersShoppingList() {
      let list = this.$store.getters['shoppinglist/shoppingList'];
      return Object.keys(list).length ? list : 0;
    }

  }

};
</script>

<style lang="scss">
.shopping-list,
.empty-state {
  width: 100%;
  margin-right: 14px;
  margin-left: 14px;

  @media (min-width: $breakpoint-sm-min) {
    max-width: 907px !important;
    margin-right: 25px;
    margin-left: 25px;
  }
}
</style>
