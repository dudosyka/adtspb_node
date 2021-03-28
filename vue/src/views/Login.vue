<template>
  <main class="main-content">
      <div class="auth">
          <div class="input-container">
            <label class="label" v-bind:class="{'label-up': login}">номер телефона/электронная почта</label><br>
            <input type="text" v-model="login" class="type" tabindex="1">
          </div>

          <button class="air-dark-button pass-rest">Забыли пароль ?</button>

          <div class="input-container">
            <label class="label" v-bind:class="{'label-up': pass}">Пароль</label><br>
            <input type="text" v-model="pass" class="type" tabindex="2">
          </div>

          <div class="checkbox-container" v-on:click="remember = !remember">
            <input type="checkbox" v-model="remember" class="checkbox" tabindex="3">
            <label class="air-dark-button">Запомнить меня</label>
          </div>

          <div class="buttons">
            <button class="dark-button" @click="auth()" tabindex="4">Войти</button>
            <router-link to="/signup" tabindex="5" class="light-button">Регистрация</router-link>
          </div>
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
    name: 'Login',
    data() {
      return {
        login: null,
        pass: null,
        remember: false //not is parm
      }
    },
    components: {

    },
    methods: {
      auth()
      {
        axios.post("http://localhost:8080/auth", {
          user: this.login,
          pass: this.pass
        }).then(res => {
          localStorage.setItem('token', res.data);
          window.location = window.location;
          this.$router.push({path: "/"});
        }).catch(err => {
          console.log(err);
        });
      },
    },
  }
</script>
