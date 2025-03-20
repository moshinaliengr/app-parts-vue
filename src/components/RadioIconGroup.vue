<template>
  <div class="radio-icon-group">
    <div
      class="radio-icon"
      :class="{ selected: computedValue === option.value }"
      @click="computedValue = option.value"
      :key="`option_${i}`"
      v-for="(option, i) in options"
    >
      <i :class="`${option.iconClasses} fa-fw`" />
    </div>
  </div>
</template>

<script>
export default {
  name: "RadioIconGroup",
  props: {
    value: String,
    options: {
      type: Array,
      required: true
    }
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  &:not(.body--dark) {
    .radio-icon-group {
      .radio-icon {
        &:not(.selected) {
          background-color: white;

          i {
            color: #cccccc;
          }
        }
      }
    }
  }

  &.body--dark {
    .radio-icon-group {
      .radio-icon {
        &:not(.selected) {
          background-color: black;

          i {
            color: #666666;
          }
        }
      }
    }
  }
}

.radio-icon-group {
  display: flex;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;

  &, * {
    box-sizing: border-box;
  }

  .radio-icon {
    padding: 7px 5px;
    line-height: 1;

    &.selected {
      background-color: #FFB81C;

      i {
        color: #222222;
      }
    }

    i {
      font-size: 22px;
      line-height: 1;
    }
  }
}
</style>
