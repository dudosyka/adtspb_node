<template>
    <main class="main-content">
        <div class="auth">
            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': login}">Фамилия</label><br>
              <input type="text" v-model="secondName" class="type" tabindex="1">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': login}">Имя</label><br>
              <input type="text" v-model="name" class="type" tabindex="1">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': login}">Отчество</label><br>
              <input type="text" v-model="oldName" class="type" tabindex="1">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': login}">Email</label><br>
              <input type="text" v-model="email" class="type" tabindex="1">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': login}">Номер телефона</label><br>
              <input type="text" v-model="phone" class="type" tabindex="1">
            </div>

            <div class="input-container" v-on:click="remember = !remember">
              <label class="air-dark-button">Пол</label>
              <div class="checkbox-container">
                <div>
                  <input type="checkbox" v-model="sex" class="checkbox" tabindex="3">
                  <label class="air-dark-button checkbox">Мужской</label>
                </div>
                <div>
                  <input type="checkbox" v-model="sex" class="checkbox" tabindex="3">
                  <label class="air-dark-button checkbox">Женский</label>
                </div>
              </div>
            </div>

            <button class="dark-button" @click="" tabindex="2">Зарегистрироваться</button>
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
    name: 'SignUp',

    data() {
      return {
        name: null,
        secondName: null,
        oldName: null,
        email: null,
        phone: null,
        sex: null
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
