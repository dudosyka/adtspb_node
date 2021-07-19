<template>
  <div class="container">

    <div class="input-container" v-if="type === 'text'">
      <label class="label" v-bind:class="{'label-error': error}">{{ label }}</label><br>
      <input
        :type="type"
        :value="value"
        v-on="listeners"
        class="type"
        :data_id="JSON.stringify(data_id)"
        :class="{'input-error': error}"
        :required="required"
        :readonly="readonly">
        <slot name="prompt"></slot>
        <slot name="error" class="fatal-container"></slot>
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
      },
      data_id: {
          type: Object,
          default() {
              return {
                  name: "",
                  parent: "",
                  group: null
              }
          }
      },

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
