<template>
    <main class="main-content">
        <div class="auth">
          <router-link class="left-arrow" to="/login" tag="button" />
          <div class="form">

            <section v-show="step === 1">
              <h2 class="label-normal choose-heading">Кто вы?</h2>
              <div class="buttons">
                <button @click="isParent(true)" class="dark-button wp100">Родитель</button>
                <button @click="isParent(false)" class="dark-button wp100">Поступающий</button>
              </div>
            </section>

            <section v-show="step === 2">
              <div class="input-container required">
                <label class="label" v-bind:class="{'label-up': user.surname, 'label-error': errors.surname}">Фамилия</label><br>
                <input type="text" v-model="user.surname" class="type" :class="{'input-error': errors.surname}" tabindex="1" required>
                <div class="fatal-container" v-if="errors.surname">
                    <p class="padding5-container">Пожалуйста, укажите фамилию</p>
                </div>
              </div>
              <div class="input-container required">
                <label class="label" v-bind:class="{'label-up': user.name, 'label-error': errors.name}">Имя</label><br>
                <input type="text" v-model="user.name" class="type" :class="{'input-error': errors.name}" tabindex="2">
                <div class="fatal-container" v-if="errors.name">
                    <p class="padding5-container">Пожалуйста, укажите имя</p>
                </div>
              </div>
              <div class="input-container required">
                <label class="label" v-bind:class="{'label-up': user.lastname, 'label-error': errors.lastname}">Отчество</label><br>
                <input type="text" v-model="user.lastname" class="type" :class="{'input-error': errors.lastname}" tabindex="3">
                <div class="fatal-container" v-if="errors.lastname">
                    <p class="padding5-container">Пожалуйста, укажите отчество</p>
                </div>
              </div>
              <div class="input-container required">
                <label class="label" v-bind:class="{'label-up': user.phone, 'label-error': errors.phone}">Номер телефона</label><br>
                <masked-input
                    v-model="rawPhone"
                    mask="\+\7 (111) 111-11-11"
                    @input="user.phone = arguments[1]"
                    type="tel"
                    class="type"
                    :class="{'input-error': errors.phone}"
                    tabindex="4" />
                <div class="fatal-container" v-if="errors.phone">
                    <p class="padding5-container">{{ errors.msg.phone }}</p>
                </div>
              </div>

              <div class="input-container required">
                <h3 class="radio-heading dark" :class="{'label-error': errors.sex}">Пол</h3>
                <ul class="radio-list" :class="{'input-error': errors.sex}">
                  <div class="radio-container">
                    <input type="radio" v-model.number="user.sex" value="1" class="radio" tabindex="3" id="man">
                    <label class="dark radio" for="man" tabindex="5">Мужской</label>
                  </div>
                  <div class="radio-container">
                    <input type="radio" v-model.number="user.sex" value="0" class="radio" tabindex="3" id="woman">
                    <label class="dark radio" for="woman" tabindex="6">Женский</label>
                  </div>
                </ul>
                <div class="fatal-container" v-if="errors.sex">
                    <p class="padding5-container">Пожалуйста, укажите пол</p>
                </div>
              </div>
              <div class="input-container required">
                <label class="label" v-bind:class="{'label-up': user.email, 'label-error': errors.email}">Email</label><br>
                <input type="email" v-model="user.email" class="type" :class="{'input-error': errors.email}" tabindex="7">
                <div class="fatal-container" v-if="errors.email">
                    <p class="padding5-container">{{ errors.msg.email }}</p>
                </div>
              </div>

              <div class="input-container">
                <div class="password-container">
                  <div>
                    <label class="label" v-bind:class="{'label-up': user.password, 'label-error': errors.password}">Пароль</label><br>
                    <input :type="passwordFieldType" v-model="user.password" class="type" :class="{'input-error': errors.password}" tabindex="8">
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
                <button class="dark-button" @click="registration()" tabindex="9">Зарегистрироваться</button>
              </div>
            </section>
          </div>
        </div>

        <AuthPlate title="Добро пожаловать в Личный кабинет" />
    </main>
</template>

<style scoped>
  .form > section {
    width: 100%;
    padding-bottom: 50px;
  }
  .auth {
    display: grid;
    grid-template-columns: 70px minmax(300px, 1fr) 70px;
    grid-template-rows: auto 1fr auto 1fr;
    padding: 0;
  }
  .left-arrow {
    grid-row: 1;
    grid-column: 1;
  }
  .form {
    grid-row: 3;
    grid-column: 2;
  }
  .choose-heading {
    margin-bottom: 20px;
  }
</style>

<script>
  import axios from "axios"
  import MaskedInput from 'vue-masked-input'
  import AuthPlate from '../components/AuthPlate.vue'
  import clone from 'clone'

  import {User} from '../models/User';

  export default {
    name: 'SignUp',

    data() {
      return {
        rawPhone: null,
        additionalData: {
          isParent: null,
        },
        passwordFieldType: "password",
        step: 1,
        user: {
          name: null,
          surname: null,
          lastname: null,
          email: null,
          password: null,
          phone: null,
          sex: null
        },
        errors: {
          name: false,
          surname: false,
          lastname: false,
          email: false,
          password: false,
          phone: false,
          sex: false
        },
        errors_prot: {
            name: false,
            surname: false,
            lastname: false,
            email: false,
            password: false,
            phone: false,
            sex: false,
            msg: {
              email: 'Неверный формат, почта должна содержать символы @ .',
              phone: 'Неверный формат, пример: +7 111 111 11 11'
            }
        },
        msg: null,
      }
    },
    components: {
      MaskedInput, AuthPlate
    },
    methods: {
      isParent(boolean) {
        this.additionalData.isParent = !!(boolean);
        console.log(this.additionalData.isParent)
        this.step = 2
      },
      registration() {
          this.errors = clone(this.errors_prot);
          User.signUp(this.user, this.additionalData.isParent).catch(err => {
              this.msg = err;
              if (err.msg) {
                  console.log(err);
                  for (let msg of err.msg)
                    if (msg)
                      this.errors[msg] = true;
              }
              else if (err.response) {
                  const msg = getError(err);
                  console.log(msg);
                  if (msg === 'Email must be unique') {
                      this.errors['email'] = true;
                      this.errors.msg.email = 'Почта должна быть уникальной'
                  }
                  else if (msg === 'Phone must be unique') {
                      this.errors['phone'] = true;
                      this.errors.msg.phone = 'Номер телефона должен быть уникальным'
                  }
              }
          });
      },
      switchVisibility() {
        this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
      },
    },
  }
</script>
