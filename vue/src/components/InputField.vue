<template>
  <div class="container">
    <div class="input-container" v-if="type === 'text'">
      <label class="label" v-bind:class="{'label-up': value}">{{ label }}</label><br>
      <input
        :type="type"
        :value="value"
        v-on="listeners"
        class="type"
        tabindex="1"
        :required="required"
        :readonly="readonly">
    </div>

    <div class="input-container required" v-if="type === 'sex'">
      <h3 class="radio-heading dark">Пол</h3>
      <ul class="radio-list">
        <div class="radio-container">
          <input type="radio" :value="value" value="1" class="radio" v-on="listeners" tabindex="3" id="man" readonly="readonly">
          <label class="dark radio" for="man" tabindex="5">Мужской</label>
        </div>
        <div class="radio-container">
          <input type="radio" :value="value" value="0" class="radio" v-on="listeners" tabindex="3" id="woman" readonly="readonly">
          <label class="dark radio" for="woman" tabindex="6">Женский</label>
        </div>
      </ul>
    </div>

    <div class="password-container" v-if="type === 'password'">
      <div>
        <label class="label" v-bind:class="{'label-up': pass}">{{label}}</label><br>
        <input :type="type" :value="value" v-on="listeners" class="type" tabindex="1">
      </div>
      <button
        v-if="type !== 'password'"
        @click="switchVisibility()"
        class="dark-box darken"
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
      }
    },
    data() {
      return {
        passwordFieldType: 'text'
      }
    },
    computed: {
      switchVisibility() {
        this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
      },
      listeners () {
        return {
          // Pass all component listeners directly to input
          ...this.$listeners,
          // Override input listener to work with v-model
          input: event => this.$emit('input', event.target.value)
        }
      }
    }
  }
</script>
