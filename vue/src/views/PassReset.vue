<template>
  <main class="main-content">
      <div class="auth">
        <router-link class="left-arrow" to="/login" tag="button" />

        <form class="form" v-if="step === 0">
          <div class="input-container">
            <label class="label" v-bind:class="{'label-up': email}">Электронная почта</label><br>
            <input type="email" v-model="email" class="type" tabindex="1">
          </div>

          <div class="buttons">
            <button class="dark-button" @click="sendEmail" tabindex="2" type="button">Отправить код</button>
          </div>
        </form>

        <form class="form" v-if="step === 1">
          <h1 class="form-heading">Вам на почту {{email}} был отправлен код, введите его</h1>
          <div class="input-container">
            <label class="label" v-bind:class="{'label-up': code}">Код</label><br>
            <input type="text" v-model="code" class="type" tabindex="1">
          </div>

          <div class="buttons">
            <button class="dark-button" @click="sendCode" tabindex="2" type="button">Подтвердить</button>
          </div>
        </form>


        <form class="form" v-if="step === 2">
          <div class="input-container">
            <label class="label" v-bind:class="{'label-up': password}">Новый пароль</label><br>
            <input type="text" v-model="password" class="type" tabindex="1">
          </div>

          <div class="buttons">
            <button class="dark-button" @click="newPassword" tabindex="2" type="button">Задать</button>
          </div>
        </form>
      </div>

      <div class="plate">
        <h1 class="title">Востановление<br> пароля</h1>
        <aside class="social-media-list container">
          <ul class="social-media-list ul">
              <li class="social-media-list li">
                <a href="https://t.me/adtspb" class="fab fa-telegram-plane social-media-link" target="_blank"></a>
              </li>
              <li class="social-media-list li">
                <a href="https://vk.com/adtspb" class="fab fa-vk social-media-link" target="_blank"></a>
              </li>
              <li class="social-media-list li">
                <a href="https://www.facebook.com/adtspb" class="fab fa-facebook-square social-media-link" target="_blank"></a>
              </li>
              <li class="social-media-list li">
                <a href="https://www.instagram.com/adtspb" class="fab fa-instagram social-media-link" target="_blank"></a>
              </li>
          </ul>
        </aside>

      </div>
  </main>
</template>

<script>
  import axios from "axios"
  import { GoodWizard } from "vue-good-wizard"

  export default {
    name: 'PassReset',
    data() {
      return {
        step: 0,
        email: null,
        code: null,
        password: null
      }
    },
    components: {
      'vue-good-wizard': GoodWizard,
    },
    methods: {
      sendEmail() {
        let req = `
          query($email: String) {
            restorePasswordRequest(email: $email)
          }
        `
        endoor.request(req, this.email)
          .then(data => console.log(this.email))
          .catch(console.error('catch'))
      },
      sendCode() {
        let req = `
          query($email: String, $code: String) {
            checkRestoreCode(email: $email, code: $code)
          }
        `

        endoor.request(req, this.email, this.code)
          .then(data => console.log(this.email, ' ', this.code))
          .catch(err => console.error(err))
      },
      newPassword() {
        let req = `
          mutation($email: String, $code: String, $password: String) {
            restorePassword(email: $email, $code: code, $password: password)
          }
        `

        endoor.request(req, this.email, this.code, this.password)
          .then(data => console.log(this.email, ' ', this.code, ' ', this.password))
          .catch(err => console.error(err))
      }
    },
  }
</script>
