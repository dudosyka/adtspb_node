<template>
  <main class="main-content">
      <div class="auth">
        <form class="form">
          <div class="input-container">
            <label class="label" v-bind:class="{'label-up': login}">Номер телефона/Электронная почта</label><br>
            <input type="text" v-model="login" class="type" tabindex="1">
          </div>

          <router-link class="air-button dark pass-rest" to="/passreset">Забыли пароль ?</router-link>

          <div class="input-container">
            <label class="label" v-bind:class="{'label-up': pass}">Пароль</label><br>
            <input type="text" v-model="pass" class="type" tabindex="2">
          </div>

          <div class="checkbox-container" v-on:click="remember = !remember">
            <input type="checkbox" v-model="remember" class="checkbox" tabindex="3">
            <label class="checkbox">Запомнить меня</label>
          </div>

          <div class="buttons">
            <button class="dark-button" @click="auth()" tabindex="4">Войти</button>
            <router-link to="/signup" tabindex="5" class="light-button">Регистрация</router-link>
          </div>
        </form>
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
  import * as AppConfig from '../config/AppConfig'

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
            let req = `
                mutation($login: String, $password: String) {
                    login(login: $login, password: $password)
                }
            `;
            let data = {
                login: this.login,
                password: this.pass
            }
            endoor.request(req, data).then(data => {
                console.log(data);
            }).
            catch(err => {
                console.error(err);
            })
      },
    },
  }
</script>
