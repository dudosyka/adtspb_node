<template>
    <main class="main-content">
        <router-link class="left-arrow" to="/login" tag="button" />
        <div class="auth">
          <div class="form">
            <div class="input-container required">
              <label class="label" v-bind:class="{'label-up': user.surname}">Фамилия</label><br>
              <input type="text" v-model="user.surname" class="type" tabindex="1" required>
            </div>

            <div class="input-container required">
              <label class="label" v-bind:class="{'label-up': user.name}">Имя</label><br>
              <input type="text" v-model="user.name" class="type" tabindex="2">
            </div>

            <div class="input-container required">
              <label class="label" v-bind:class="{'label-up': user.lastname}">Отчество</label><br>
              <input type="text" v-model="user.lastname" class="type" tabindex="3">
            </div>

            <div class="input-container required">
              <label class="label" v-bind:class="{'label-up': user.phone}">Номер телефона</label><br>
              <masked-input
                v-model="rawPhone"
                mask="\+\7 (111) 111-11-11"
                @input="user.phone = arguments[1]"
                type="tel"
                class="type"
                tabindex="4" />
            </div>

            <div class="input-container required">
              <h3 class="radio-heading dark">Пол</h3>
              <ul class="radio-list">
                <div class="radio-container">
                  <input type="radio" v-model.number="user.sex" value="1" class="radio" tabindex="3" id="man">
                  <label class="dark radio" for="man" tabindex="5">Мужской</label>
                </div>
                <div class="radio-container">
                  <input type="radio" v-model.number="user.sex" value="0" class="radio" tabindex="3" id="woman">
                  <label class="dark radio" for="woman" tabindex="6">Женский</label>
                </div>
              </ul>
            </div>

            <div class="input-container required">
              <label class="label" v-bind:class="{'label-up': user.email}">Email</label><br>
              <input type="email" v-model="user.email" class="type" tabindex="7">
            </div>

            <div class="input-container">
              <div class="password-container">
                <div>
                  <label class="label" v-bind:class="{'label-up': user.password}">Пароль</label><br>
                  <input :type="passwordFieldType" v-model="user.password" class="type" tabindex="8">
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

            <div class="buttons">
              <span class="label-error">{{ error.message }}</span>
              <button class="dark-button" @click="registration" tabindex="9">Зарегистрироваться</button>
            </div>
          </div>
        </div>

        <AuthPlate title="Добро пожаловать в личный кабинет" />
    </main>
</template>

<style scoped>
  .auth {
    padding-top: 150px;
  }
</style>

<script>
  import axios from "axios"
  import MaskedInput from 'vue-masked-input'
  import AuthPlate from '../components/AuthPlate.vue'

  import {User} from '../models/User';

  export default {
    name: 'SignUp',

    data() {
      return {
        rawPhone: null,
        passwordFieldType: "password",
        user: {
          name: null,
          surname: null,
          lastname: null,
          email: null,
          password: null,
          phone: null,
          sex: null
        },
        error: {
          messasge: ''
        }
      }
    },
    components: {
      MaskedInput, AuthPlate
    },
    methods: {
      registration() {
          User.signUp(this.user).catch(err => {
              //Ошибки с клиента
              if (err.msg) {

                  // err.msg это массив, в нём поля, которые не прошли валидацию, примеры ниже:
                  //['phone', 'email'] ...
                  //['phone'] ...
                  //['phone', 'sex', 'name'] ...
                  console.log(err.msg);
              }
              else if (err.response) {
                  const msg = getError(err);
              }
          });
      },
      switchVisibility() {
        this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
      }
    },
  }
</script>
