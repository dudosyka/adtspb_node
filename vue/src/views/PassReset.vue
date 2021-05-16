<template>
  <main class="main-content">
      <div class="auth">
          <div class="input-container">
            <label class="label" v-bind:class="{'label-up': login}">Номер телефона/Электронная почта</label><br>
            <input type="text" v-model="login" class="type" tabindex="1">
          </div>

          <button class="dark-button" @click="" tabindex="2">Отправить</button>

      </div>

      <div class="plate">
        <h1 class="title">Добро<br> пожаловать<br> в личный кабинет</h1>
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

  export default {
    name: 'PassReset',
    data() {
      return {
        login: null,
      }
    },
    components: {

    },
    methods: {

    },
  }
</script>
