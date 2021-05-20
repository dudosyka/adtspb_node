<template>
  <main class="main-content">
      <div class="auth">
        <div class="form">
          <h1 class="heading-form dark">Вам на почту был отправлен код подтверждения</h1>
          <div class="input-container">
            <label class="label" :class="{'label-up': code}">Код с почты</label><br>
            <input type="text" v-model="code" class="type" tabindex="1">
          </div>

          <div class="buttons">
            <button class="dark-button" @click="sendCode" tabindex="2">Отправить код</button>
          </div>
        </div>
      </div>

      <div class="plate">
        <h1 class="title">Подтверждение<br> регистрации</h1>
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
    name: 'Confirmation',
    data() {
      return {
        code: null
      }
    },
    methods: {
      sendCode() {
        let req = `
          mutation($code: String) {
              confirmUser(code: $code) {
                  isConfirmed
              }
          }
        `

        let data = {
          code: this.code
        }

        api.request(req, data)
          .then(data => {
            console.log(data.confirmUser.isConfirmed)

            /*
            if (data.confirmUser) {
              window.location = '/'
            } else {
              console.log('invalid code')
            }
            */

          })
          .catch(err => { console.error(err) })
      }
    }
  }

</script>
