<template>
  <main class="main-content">
      <div class="auth">
        <router-link class="left-arrow" to="/login" tag="button" />
        <div class="form" v-if="step === 0">
          <div class="input-container">
            <label class="label" :class="{'label-up': email}">Электронная почта</label><br>
            <input type="email" v-model="email" class="type" tabindex="1">
          </div>

          <div class="buttons">
            <button class="dark-button" @click="sendEmail" tabindex="2">Отправить код</button>
          </div>
        </div>

        <div class="form" v-if="step === 1">
          <h1 class="form-heading">Вам на почту {{email}} был отправлен код, введите его</h1>
          <div class="input-container">
            <label class="label" :class="{'label-up': code}">Код</label><br>
            <input type="numeric" v-model.number="code" class="type" :class="{invalid: isCodeInvalid}" tabindex="1" invalid>
          </div>

          <div class="buttons">
            <button class="dark-button" @click="sendCode" tabindex="2">Подтвердить</button>
          </div>
        </div>


        <div class="form" v-if="step === 2">
          <div class="input-container">
            <label class="label" v-bind:class="{'label-up': password}">Новый пароль</label><br>
            <input type="text" v-model="password" class="type" tabindex="1">
          </div>

          <div class="buttons">
            <button class="dark-button" @click="newPassword" tabindex="2">Задать</button>
          </div>
        </div>
      </div>

      <AuthPlate title="Восстановление пароля"/>
  </main>
</template>

<style scoped>
.auth {
  display: grid;
  grid-template-rows: 60px 1fr auto 1fr;
  grid-template-columns: 1fr;

}
.form {
  grid-row: 3;
}
@media (max-width: 479px) {
  .main-content {
    height: 100vh;
  }
  .auth {
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr;
    width: 100%;
    box-sizing: border-box;
    align-content: center;
  }
  .form {
    grid-row: 2;
  }
}
</style>

<script>
  import axios from "axios"
  import AuthPlate from '../components/AuthPlate.vue'

  export default {
    name: 'PassReset',
    data() {
      return {
        isCodeInvalid: null,
        step: 0,
        email: null,
        code: null,
        password: null
      }
    },
    components: {
      AuthPlate
    },
    methods: {
      sendEmail() {
        let req = `
          query($email: String) {
            restorePasswordRequest(email: $email)
          }
        `
        let data = {
          email: this.email
        }

        _request("endoor", req, data)
          .then(data => { this.step = 1 })
          .catch(err => { console.error('catch') })
      },
      sendCode() {
        let req = `
          query($email: String, $code: Int) {
            checkRestoreCode(email: $email, code: $code)
          }
        `

        let data = {
          email: this.email,
          code: this.code
        };

        _request("endoor", req, data)
          .then(data => {
            if (data.checkRestoreCode) {
              this.step = 2
            } else {
              this.isCodeInvalid = true
            }
          })
          .catch(err => {
            console.error('err')
          })
      },
      newPassword() {
        let req = `
          mutation($email: String, $code: Int, $password: String) {
            restorePassword(email: $email, code: $code, password: $password)
          }
        `

        let data = {
          email: this.email,
          code: this.code,
          password: this.password
        }

        _request("endoor", req, data)
          .then(data => {
            window.location = '/login'
          })
          .catch(err => console.error(err))
      }
    },
  }
</script>
