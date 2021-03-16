<template>
  <div class="login">

    <a class="main-link">
      <div class="row-left"></div>
      <span>Академия цифровых технологий</span>
    </a>

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
            <button class="light-button" tabindex="5">Регистрация</button>
          </div>
      </div>

      <div class="plate">
        <h1 class="title">Добро<br> пожаловать<br> в личный кабинет</h1>
        <!--
        <aside class="social-media">
          <a href="#" class="link-icon link-tl"></a>
          <a href="#" class="link-icon link-vk"></a>
          <a href="#" class="link-icon link-fb"></a>
          <a href="#" class="link-icon link-in"></a>
        </aside>
        !-->
      </div>
    </main>
    <!--
    <input type="text" v-model="login" placeholder="Email or phone">
    <input type="pass" v-model="pass" placeholder="pass">
    <button @click="auth()">Token</button>
    !-->
  </div>
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
