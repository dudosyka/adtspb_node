<template>
  <main class="main-content">
      <div class="auth">
        <div class="form">
          <h1 class="heading-form dark">Вам на почту был отправлен {{ this.new }} код подтверждения</h1>
          <div class="input-container">
            <label class="label" :class="{'label-up': code}">Код с почты</label><br>
            <input type="text" v-model="code" class="type" :class="{invalid: isInvalid}" tabindex="1">
          </div>

          <div class="buttons">
            <button class="dark-button" @click="sendCode" tabindex="2">Отправить код</button>
            <button class="light-button" @click="getNewCode" tabindex="3">Получить новый код</button>
          </div>
        </div>
      </div>

      <div class="plate">
        <h1 class="title">Подтверждение<br> регистрации</h1>
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
  import {User} from "../models/User"

  export default {
    name: 'Confirmation',
    data() {
        return {
            code: null,
            isInvalid: false,
            new: ''
          }
    },
    methods: {
      sendCode() {
          User.confirmUser(this.code).then(data => {
              this.isInvalid = !data;
          });
      },

      getNewCode() {
          User.sendNewConfirmationCode().then(data => {
              this.new = "новый";
          })
      }
    }
  }

</script>
