<template>
  <main class="main-content">
      <div class="auth">
        <div class="form">
          <InputField
            label="Номер телефона / Электронная почта"
            v-model="login"
            :error="errors.login"
          />

          <router-link class="air-button dark pass-rest" to="/passreset">Забыли пароль ?</router-link>

          <div class="input-container">
            <div class="password-container">
              <div>
                <label
                    class="label"
                    :class="{'label-up': pass, 'label-error': errors.password}"
                >Пароль</label><br>
                <input
                    :type="passwordFieldType"
                    v-model="pass"
                    v-on:keyup.enter="auth"
                    class="type"
                    :class="{'input-error': errors.password}"
                    tabindex="1"
                >
              </div>
              <button
                @click="switchVisibility()"
                :class="{
                  'hidden-pass': this.passwordFieldType === 'password',
                  'show-pass': this.passwordFieldType !== 'password'
                }">
              </button>
            </div>
          </div>
          <div class="buttons">
            <button class="dark-button" @click="auth" tabindex="4">Войти</button>
            <router-link to="/signup" tabindex="5" class="light-button">Регистрация</router-link>
          </div>
        </div>
      </div>

      <AuthPlate title="Добро пожаловать в Личный кабинет"/>
  </main>
</template>
<script>
  import axios from "axios"
  import * as AppConfig from '../config/AppConfig'

  import AuthPlate from '../components/AuthPlate.vue'
  import InputField from '../components/InputField.vue'
  import {User} from '../models/User';

  export default {
    name: 'Login',

    data() {
      return {
        passwordFieldType: "password",
        login: null,
        pass: null,
        remember: false, //не используется
        errors: {
          login: false,
          password: false
        }
      }
    },
    components: {
      AuthPlate, InputField
    },
    methods: {
      auth()
      {
          User.login(this).catch(err => {
              //Ошибка с сервера
              if (err.response) {
                  const msg = err.response.errors[0].message;
                  if (msg === 'login incorrect') {
                      this.errors.login = true;
                  }
                  else if (msg == 'password incorrect') {
                      this.errors.password = true;
                  }
                  //.....
              }
              //Ошибка с клиента
              if (err.msg) {
                for (let msg of err.msg)
                  if (msg)
                    this.errors[msg] = true

                  // err.msg это массив, в нём поля, которые не прошли валидацию, примеры ниже:
                  //['password'] ...
                  //['password', 'login'] ...
                  //['login'] ...
              }
          });
      },
        switchVisibility() {
          this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
        }
    },
  }
</script>
