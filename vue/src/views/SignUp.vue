<template>
    <main class="main-content">
        <div class="auth">
          <div class="form">
            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': user.surname}">Фамилия</label><br>
              <input type="text" v-model="user.surname" class="type" tabindex="1">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': user.name}">Имя</label><br>
              <input type="text" v-model="user.name" class="type" tabindex="2">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': user.lastname}">Отчество</label><br>
              <input type="text" v-model="user.lastname" class="type" tabindex="3">
            </div>

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': user.phone}">Номер телефона</label><br>
              <masked-input
                v-model="rawPhone"
                mask="\+\7 (111) 111-11-11"
                @input="user.phone = arguments[1]"
                type="tel"
                class="type"
                tabindex="4" />
            </div>

            <div class="input-container">
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

            <div class="input-container">
              <label class="label" v-bind:class="{'label-up': user.email}">Email</label><br>
              <input type="email" v-model="user.email" class="type" tabindex="7">
            </div>

            <div class="input-container">
              <div class="password-container">
                <div>
                  <label class="label" v-bind:class="{'label-up': user.password}">Пароль</label><br>
                  <input :type="passwordFieldType" v-model="user.password" class="type" tabindex="8">
                </div>
                <button @click="switchVisibility()" class="dark-box darken">0</button>
              </div>
            </div>

            <div class="buttons">
              <button class="dark-button" @click="registration" tabindex="9">Зарегистрироваться</button>
            </div>
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
  import MaskedInput from 'vue-masked-input'

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
        }
      }
    },
    components: {
      MaskedInput
    },
    computed: {

    },
    methods: {
      registration() {
        if (this.user.phone.length != 11) {
            this.user.phone = '8' + this.user.phone
        }
	      console.log(this.user);
        let request = `
          mutation($user: UserInput) {
            createUser(user: $user)
          }
        `;
        endoor.request(request, { user: this.user }).then( res => {
		if (res.createUser != 'failed')
		{
			localStorage.setItem('token', res.createUser);
			window.location = window.location;
		}
		console.log(res);
	}).catch(err => {
		console.error(err);
	});
      },
      switchVisibility() {
        this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
      }
    },
  }
</script>
