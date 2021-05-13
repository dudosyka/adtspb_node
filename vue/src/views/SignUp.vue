<template>
    <main class="main-content">
        <div class="auth">
            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': user.secondName}">Фамилия</label><br>
              <input type="text" v-model="user.secondName" class="type" tabindex="1">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': user.name}">Имя</label><br>
              <input type="text" v-model="user.name" class="type" tabindex="1">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': user.oldName}">Отчество</label><br>
              <input type="text" v-model="user.oldName" class="type" tabindex="1">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': user.email}">Email</label><br>
              <input type="text" v-model="user.email" class="type" tabindex="1">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': user.phone}">Номер телефона</label><br>
              <input type="text" v-model="user.phone" class="type" tabindex="1">
            </div>

            <div class="input-container" v-on:click="user.sex = !user.sex">
              <label class="air-dark-button">Пол</label>
              <div class="checkbox-container">
                <div>
                  <input type="checkbox" v-model="user.sex" class="checkbox" tabindex="3">
                  <label class="air-dark-button checkbox">Мужской</label>
                </div>
                <div>
                  <input type="checkbox" v-model="user.sex" class="checkbox" tabindex="3">
                  <label class="air-dark-button checkbox">Женский</label>
                </div>
              </div>
            </div>

            <button class="dark-button" @click="registration" tabindex="2">Зарегистрироваться</button>
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
        user: {
          name: null,
          surname: null,
          lastname: null,
          email: null,
          phone: null,
          sex: null
        }
      }
    },
    components: {

    },
    methods: {
      registration() {
        let request = `
          mutation($user: UserInput) {
            createUser(user: $user)
          }
        `;
        endoor.request(request, { user: this.user }).then(res => { console.log(res); } ).catch(err => { console.error(err); } );
      }
    },
  }
</script>
