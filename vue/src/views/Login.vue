<template>
  <main class="main-content">
      <div class="auth">
        <div class="form">
          <InputField
            label="Номер телефона/Электронная почта"
            v-model="login"
          />

          <router-link class="air-button dark pass-rest" to="/passreset">Забыли пароль ?</router-link>

          <div class="input-container">
            <div class="password-container">
              <div>
                <label class="label" v-bind:class="{'label-up': pass}">Пароль</label><br>
                <input :type="passwordFieldType" v-model="pass" class="type" tabindex="1">
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

          <div class="checkbox-container" v-on:click="remember = !remember">
            <input type="checkbox" v-model="remember" class="checkbox" tabindex="3">
            <label class="checkbox">Запомнить меня</label>
          </div>

          <div class="buttons">
            <button class="dark-button" @click="auth()" tabindex="4">Войти</button>
            <router-link to="/signup" tabindex="5" class="light-button">Регистрация</router-link>
          </div>
        </div>
      </div>

      <AuthPlate title="Добро пожаловать в личный кабинет"/>
  </main>
</template>
<script>
  import axios from "axios"
  import * as AppConfig from '../config/AppConfig'

  import AuthPlate from '../components/AuthPlate.vue'
  import InputField from '../components/InputField.vue'

  export default {
    name: 'Login',

    data() {
      return {
        passwordFieldType: "password",
        login: null,
        pass: null,
        remember: false //not is parm
      }
    },
    components: {
      AuthPlate, InputField
    },
    methods: {
      auth()
      {
            let req = `
                mutation($login: String, $password: String) {
                    login(login: $login, password: $password) {
                        token, id
                    }
                }
            `

            let data = {
                login: null,
                password: this.pass
            }

            if (this.login.indexOf('@') !== -1) {
              data.login = this.login
              
            } else {

              if (this.login.indexOf('+7') !== -1) {
                this.login = this.login.split('')
                this.login.splice(0,2)
                this.login = this.login.join('')
              }

              if (this.login.length < 11) {
                this.login = '8' + this.login
              }

              data.login = this.login
            }

            endoor.request(req, data)
              .then(data => {

                const reqData = {
                    user_id: data.login.id
                };

                let req = `
                  query ($user_id: Int) {
                    checkUserConfirmation (user_id: $user_id) {
                        isConfirmed
                    }
                  }
                `;

                endoor.request(req, reqData)
                  .then(check => {

                    if (check.checkUserConfirmation.isConfirmed) {
                        localStorage.setItem('token', data.login.token)
                        window.location = window.location;
                    } else {
                      window.location = '/confirmation'
                    }

                }).catch(err => { console.error(err) });
            })
            .catch(err => { console.error(err) })
      },
        switchVisibility() {
          this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
        }
    },
  }
</script>
