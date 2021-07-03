<template>
  <div class="container">

    <div class="input-container" v-if="type === 'text'">
      <label class="label" v-bind:class="{'label-error': error}">{{ label }}</label><br>
      <input
        :type="type"
        :value="value"
        v-on="listeners"
        class="type"
        :class="{'input-error': error}"
        tabindex="1"
        :required="required"
        :readonly="readonly">
    </div>

    <div class="password-container input-container" v-if="type === 'password'">
      <div>
        <label class="label" v-bind:class="{'label-up': value}">{{label}}</label><br>
        <input :type="passwordFieldType" :value="value" v-on="listeners" class="type" tabindex="1" :readonly="readonly">
      </div>
      <button
        @click="switchVisibility()"
        :class="{
          'hidden-pass': this.passwordFieldType === 'password',
          'show-pass': this.passwordFieldType !== 'password'
        }">
      </button>
    </div>
  </div>
</template>

<style scoped>
  .container {
    width: 100%;
  }
</style>

<script>
  import MaskedInput from 'vue-masked-input'

  export default {
    props: {
      label: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      required: {
        type: Boolean,
        default: true
      },
      readonly: {
        type: Boolean,
        default: false
      },
      error: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        passwordFieldType: 'password'
      }
    },
    components: {
      MaskedInput
    },
    methods: {
      switchVisibility() {
        this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
      },
    },
    computed: {
      listeners () {
        return {
          // Pass all component listeners directly to input
          ...this.$listeners,
          // Override input listener to work with v-model
          input: event => this.$emit('input', event.target.value),
        }
      }
    }
  }
</script>
