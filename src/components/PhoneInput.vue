<template>
  <q-input
    ref="input"
    type="text"
    :label="label"
    v-model="computedValue"
    @input="onInput"
    @keypress="isNumber"
    :rules="rules"
    :lazy-rules="lazyRules"
    :dense="dense"
    :outlined="outlined"
    :required="required"
  />
</template>

<script>
export default {
  name: "PhoneInput",
  props: {
    label: String,
    value: String,
    rules: Array,
    required: Boolean,
    lazyRules: Boolean,
    dense: Boolean,
    outlined: Boolean,
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
  },
  methods: {
    isNumber(e) {
      e = (e) ? e : window.event;
      const charCode = (e.which) ? e.which : e.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        e.preventDefault();
      } else {
        return true;
      }
    },
    onInput(val) {
      const x = val.replace(/\D/g, '')
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.computedValue = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    },
    validate() {
      return this.$refs.input.validate();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
