<template>
  <div class="shopping-list-item-context-menu">
    <div class="icon-container cursor-pointer">
      <i class="far fa-ellipsis-v fa-fw" />
      <q-tooltip>
        View Options
      </q-tooltip>
    </div>
    <q-menu content-class="options-container" anchor="top left" self="bottom right" auto-close>
      <q-item @click="$emit('notes-click', addOrEditNotes)" clickable>
        <q-item-section avatar>
          <i class="fas fa-pencil fa-fw" />
        </q-item-section>
        <q-item-section>{{ addOrEditNotes }} Note</q-item-section>
      </q-item>
      <template v-if="showReAdd">
        <q-separator />
        <q-item @click="$emit('re-add')" clickable>
          <q-item-section avatar>
            <i class="fas fa-repeat fa-fw" />
          </q-item-section>
          <q-item-section>Re-add to Cart</q-item-section>
        </q-item>
      </template>
      <q-separator />
      <q-item @click="$emit('remove')" clickable>
        <q-item-section avatar>
          <i class="fas fa-trash fa-fw" />
        </q-item-section>
        <q-item-section>Remove</q-item-section>
      </q-item>
    </q-menu>
  </div>
</template>

<script>
export default {
  name: "ShoppingListItemContextMenu",
  props: {
    addOrEditNotes: {
      type: String,
      required: true
    },
    showReAdd: Boolean
  }
}
</script>

<style lang="scss" scoped>
body {
  &:not(.body--dark) {
    .shopping-list-item-context-menu {
      .icon-container {
        i {
          color: #666666;
        }
      }
    }
  }
}

.shopping-list-item-context-menu {
  .icon-container {
    i {
      font-size: 20px;
    }
  }
}
</style>
