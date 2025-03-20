<template>
  <q-dialog ref="dialog" v-model="computedValue">
    <q-card>
      <div class="top">
        <div class="text">
          Note
        </div>
        <div class="icon-container">
          <i class="fas fa-pencil" />
        </div>
      </div>
      <q-card-section class="part-info">
        <div class="manufacturer">{{ part.manufacturer_name }}</div>
        <div class="part-number">{{ part.part_id }}</div>
        <div class="description">{{ part.description }}</div>
      </q-card-section>
      <q-card-section class="note">
        <q-input
          type="textarea"
          label="Note"
          maxlength="256"
          v-model="formNote"
          outlined
        />
      </q-card-section>
      <q-card-actions class="actions" align="right">
        <q-btn
          class="text-bold"
          label="Cancel"
          style="font-size: 12px;"
          v-close-popup
          no-caps
          outline
        />
        <q-btn
          class="text-bold"
          label="Save"
          color="primary"
          text-color="black"
          @click="save"
          style="font-size: 12px;"
          :loading="isUpdatingPartNote"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {Notify} from "src/mixins/Notify";

export default {
  name: "ShoppingCartItemNote",
  mixins: [Notify],
  props: {
    value: {
      type: Boolean,
      required: true
    },
    part: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    formNote: null
  }),
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    isUpdatingPartNote() {
      return this.$store.getters["shoppinglist/isUpdatingPartNote"];
    }
  },
  created() {
    this.formNote = this.part.root_part.notes;
  },
  methods: {
    save() {
      const formData = {
        root_part_id: this.part.root_part_id,
        notes: this.formNote
      };

      this.$store.dispatch("shoppinglist/updatePartNote", formData)
        .then((res) => {
          if (res === "error") {
            this.notify(
              "An error occurred when attempting to save note",
              "negative"
            );
          } else {
            this.notify(
              "Note saved successfully",
              "positive",
              "check_circle_outline"
            );
            this.$refs.dialog.hide();
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  &:not(.body--dark) {
    .q-dialog {
      .q-card {
        .part-info {
          .part-number {
            color: #222222;
          }
        }
      }
    }
  }
}

.q-dialog {
  .q-card {
    width: 100%;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 16px 12px 12px 15px;

      background-color: $primary;

      .text {
        margin-right: 20px;
        font-size: 16px;
        line-height: 20px;
        font-weight: 700;
      }
    }

    .part-info {
      .part-number {
        font-size: 20px;
        line-height: 1;

        font-weight: 500;
      }
    }

    .actions {
      .q-btn {
        min-width: 130px;

        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
