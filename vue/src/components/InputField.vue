<template>
  <div class="input-container">
    <div class="password-container">
      <div>
        <label class="label" v-bind:class="{'label-up': pass}">Пароль</label><br>
        <input :type="passwordFieldType" v-model="pass" class="type" tabindex="1">
      </div>
      <button
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

</style>

<script>
  export default {
    name: 'type-password',
    data() {
      return {
        passwordFieldType: 'password',
        pass: null,
      }
    },
    methods: {

    },
    computed: {
      switchVisibility() {
        this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
      }
    }
  }
</script>
