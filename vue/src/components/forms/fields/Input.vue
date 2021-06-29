<template>
  <div class="input-container" v-if="type === 'text'">
    <label
        class="label"
        :class="{'label--invalid': invalid}"
    >{{ label }}</label><br>
    <input
        :type="type"
        :value="value"
        v-on="listeners"
        class="type"
        :class="{
          'input--invalid': invalid,
          'input--required': required,
          'input--readonly': readonly,
        }"
        :required="required"
        :readonly="readonly">
  </div>
</template>

<script>
export default {
  name: "Input",
  props: {
    label: {},
    type: {
      default: 'text'
    },
    value: {},
    invalid: {
      default: false
    },
    required: {
      default: false
    },
    readonly: {
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: event => this.$emit('input', event.target.value),
      }
    }
  }
}
</script>

<style scoped>
  .input--invalid {

  }
  .input--required {

  }
  .input--readonly {

  }
</style>