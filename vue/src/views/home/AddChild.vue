<template>
  <main class="home">
    <article class="home-content">
      <!-- Question !-->
      <section  v-if="show.question" class="card_wrapper horizontal-center">
        <router-link tag="button" class="left-arrow" to="/child"></router-link>
        <article class="card shadow" v-if="show.question">
          <h2 class="form-heading">Как вы хотите добавить ребёнка?</h2>
          <div class="buttons">
            <button class="dark-box dark-button" @click="show.question = false; show.registration = true">Зарегистрировать новый аккаунт</button>
            <button class="light-box light-button" @click="show.question = false; show.add = true">Привязать существующий аккаунт</button>
          </div>
        </article>
      </section>

      <!-- Back successful answer !-->
      <section v-if="show.childReg" class="card_wrapper horizontal-center without-arrow">
        <section class="card shadow ">
          <h2 class="form-heading">{{ message }}</h2>
          <div class="buttons">
            <router-link class="dark-button dark-box" to="/child">Вернуться в "Мои дети"</router-link>
          </div>
        </section>
      </section>

      <!-- Add by phone/email !-->
      <section v-if="show.add" class="card_wrapper horizontal-center" >
        <button class="left-arrow" @click="show.add = false; show.question = true"></button>
        <article class="card shadow">
          <h2 class="form-heading">Введите номер телефона или почту ребёнка</h2>
          <p class="form-error">{{ show.error }}</p>
          <inputField
              label="Номер телефона / почта"
              v-model="childPhoneOrEmail"
          />
          <button class="dark-box dark-button" @click="addChild">Добавить</button>
        </article>
      </section>

      <!-- Add new child !-->
      <section v-if="show.registration" class="wp100 horizontal-center" >
        <button class="left-arrow" @click="show.registration = false; show.question = true"></button>
        <article class="card shadow child-form-wrapper">

          <article class="child-form">

            <h2 class="child-form_heading">Регистрация ребёнка</h2>

            <inputField
                label="Имя"
                v-model="childRaw.name"
                :error="childRawErrors.name"
            />
            <inputField
                label="Фамилия"
                v-model="childRaw.surname"
                :error="childRawErrors.surname"
            />

            <inputField
                label="Отчество"
                v-model="childRaw.lastname"
                :error="childRawErrors.lastname"
            />

            <div class="input-container">
              <label class="label" :class="{'label-error': childRawErrors.birthday}">Дата рождения</label><br>
              <input
                  class="type"
                  :class="{'input-error': childRawErrors.birthday}"
                  type="date"
                  v-model="childRaw.birthday"
                  tabindex="1"
              >
            </div>

            <inputField
                label="Электронная почта"
                v-model="childRaw.email"
                :error="childRawErrors.email"
            />

            <div class="input-container required">
              <label class="label" v-bind:class="{'label-error': childRawErrors.phone}">Номер телефона</label><br>
              <masked-input
                  v-model="masked.phone"
                  mask="\+\7 (111) 111-11-11"
                  @input="childRaw.phone = arguments[1]"
                  type="tel"
                  class="type"
                  :class="{'input-error': childRawErrors.phone}"
                  tabindex="4"
              />
            </div>

            <div class="input-container child-form_span-2">
              <h3 class="radio-heading dark" :class="{'label-error': childRawErrors.sex}">Пол</h3>
              <ul class="radio-list" :class="{'input-error': childRawErrors.sex}">
                <li class="radio-container">
                  <input type="radio" v-model.number="childRaw.sex" value="1" class="radio" tabindex="3" id="man">
                  <label class="dark radio" for="man" tabindex="5">Мужской</label>
                </li>
                <li class="radio-container">
                  <input type="radio" v-model.number="childRaw.sex" value="0" class="radio" tabindex="3" id="woman">
                  <label class="dark radio" for="woman" tabindex="6">Женский</label>
                </li>
              </ul>
            </div>

            <inputField
                label="Гражданство"
                v-model="childRaw.state"
                :error="childRawErrors.state"
            />

            <div>
                <inputField
                    label="Степень родства"
                    v-model="childRaw.relationship"
                    :error="childRawErrors.relationship"
                    style="{margin: 0}"
                >
                    <template v-slot:prompt>
                        <div class="input-prompt">
                            <span @click="childRaw.relationship = 'Родитель'">Родитель</span>
                            <span @click="childRaw.relationship = 'Законный представитель'">Законный представитель</span>
                        </div>
                    </template>
                </inputField>
            </div>

            <div class="child-form_span-2 child-form_select">
              <div>
                <h2 class="child-form_select-heading" :class="{'label-error': childRawErrors.ovz}">ОВЗ</h2>
                <select class="dark-box darken" v-model.number="childRaw.ovz"  >
                  <option value="0">Нет</option>
                  <option value="1">Есть</option>
                </select>
              </div>
              <div v-if="childRaw.ovz">
                <h2 class="child-form_select-heading" :class="{'label-error': childRawErrors.ovz_type}">Тип ОВЗ</h2>
                <select class="dark-box darken" v-model="childRaw.ovz_type.id"  >
                  <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
                </select>
              </div>
            </div>

            <div class="child-form_span-2 child-form_select">
              <div>
                <h2 class="child-form_select-heading" :class="{'label-error': childRawErrors.disability}">Инвалидность</h2>
                <select class="dark-box darken" v-model.number="childRaw.disability"  >
                  <option value="0">Нет</option>
                  <option value="1">Есть</option>
                </select>
              </div>

              <div v-show="childRaw.disability">
                <h2 class="child-form_select-heading" :class="{'label-error': childRawErrors.disability_group}">Группа нвалидности</h2>
                <select class="dark-box darken" v-model="childRaw.disability_group.id"  >
                  <option v-for="(type, id) in disabilityTypes" :value="id">{{ type }}</option>
                </select>
              </div>
            </div>

            <inputField
                label="Образовательное учреждение (наименование)"
                v-model="childRaw.studyPlace"
                type="text"
                :error="childRawErrors.studyPlace"
                class="child-form_span-2"
            />
            <div class="child-data_row">
              <!--
              <div>
                <inputField
                  label="Класс \ группа"
                  v-model="childRaw.class"
                  type="text"
                />
              </div>
              !-->
            </div>

            <h2 class="child-form_heading">Адрес регистрации</h2>
            <inputField
                label="Город"
                v-model="childRaw.registration_address.city"
                :error="childRawErrors.registration_address.city"
            />
            <inputField
                label="Район"
                v-model="childRaw.registration_address.district"
                :error="childRawErrors.registration_address.district"
            />
            <inputField
                label="Улица"
                v-model="childRaw.registration_address.street"
                :error="childRawErrors.registration_address.street"
            />
            <inputField
                label="Дом"
                v-model="childRaw.registration_address.house"
                :error="childRawErrors.registration_address.house"
            />
            <inputField
                label="Номер квартиры"
                v-model="childRaw.registration_flat"
                :error="childRawErrors.registration_flat"
            />

            <h2 class="child-form_heading">Адрес проживания</h2>
              <div class="input-prompt">
                  <span @click="autoResidenceAddress()">По адресу регистрации</span>
              </div>
              <br>
            <inputField
                label="Город"
                v-model="childRaw.residence_address.city"
                :error="childRawErrors.residence_address.city"
            />
            <inputField
                label="Район"
                v-model="childRaw.residence_address.district"
                :error="childRawErrors.residence_address.district"
            />
            <inputField
                label="Улица"
                v-model="childRaw.residence_address.street"
                :error="childRawErrors.residence_address.street"
            />
            <inputField
                label="Дом"
                v-model="childRaw.residence_address.house"
                :error="childRawErrors.residence_address.house"
            />
            <inputField
                label="Номер квартиры"
                v-model="childRaw.residence_flat"
                :error="childRawErrors.residence_flat"
            />

            <br>

            <inputField
                label="Пароль"
                type="password"
                v-model="childRaw.password"
                :error="childRawErrors.password"
            />
          </article>
          <div class="buttons wp100">
            <button class="dark-box dark-button register-button" @click="childRegistration">Зарегистрировать ребёнка</button>
          </div>
        </article>
      </section>
    </article>
  </main>
</template>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .home-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .buttons {
    margin-top: 25px;
  }
  .register-button {
    margin-top: 20px;
  }

  .without-arrow {
      margin-top: 30px;
  }
</style>

<script>
  import InputField from '../../components/InputField.vue'
  import MaskedInput from 'vue-masked-input'
  import {User} from '../../models/User'
  import clone from 'clone'

  export default {
    name: '',
    components: {
      InputField, MaskedInput
    },
    data() {
      return {
        masked: {
          phone: null,
          birthday: null
        },
        childRaw: {
          name: null,
          surname: null,
          lastname: null,
          email: null,
          phone: null, //mask
          sex: null,
          password: null,

          birthday: null, //mask
          birth_certificate: 'ABC123456',

          state: null,
          relationship: null,
          studyPlace: null,
          ovz: null,
          ovz_type: { id: null },
          disability: null,
          disability_group: { id: null },

          registration_address: {
            city: null,
            district: null,
            street: null,
            house: null,
          },
          registration_flat: null,

          residence_address: {
            city: null,
            district: null,
            street: null,
            house: null
          },
          residence_flat: null,
        },
        childRawErrors: {
          name: false,
          surname: false,
          lastname: false,
          email: false,
          phone: false,
          sex: false,
          password: false,

          birthday: false,
          birth_certificate: false,

          state: false,
          relationship: false,
          studyPlace: false,
          ovz: false,
          ovz_type: { id: false },
          disability: false,
          disability_group: { id: false },

          registration_address: {
            city: false,
            district: false,
            street: false,
            house: false,
          },
          registration_flat: false,

          residence_address: {
            city: false,
            district: false,
            street: false,
            house: false
          },
          residence_flat: false,
        },
        childRawErrors_proto: {
          name: false,
          surname: false,
          lastname: false,
          email: false,
          phone: false,
          sex: false,
          password: false,

          birthday: false,
          birth_certificate: false,

          state: false,
          relationship: false,
          studyPlace: false,
          ovz: false,
          ovz_type: { id: false },
          disability: false,
          disability_group: { id: false },

          registration_address: {
            city: false,
            district: false,
            street: false,
            house: false,
          },
          registration_flat: false,

          residence_address: {
            city: false,
            district: false,
            street: false,
            house: false
          },
          residence_flat: false,
        },
        childFormated: {},

        ovzTypes: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
        disabilityTypes: ['I', 'II', 'III'],
        childPhoneOrEmail: null,
        show: {
          question: true,
          registration: false,
          add: false,
          childReg: false,
          childNotReg: false,
          error: '',
        },
        message: ''
      }
    },
    methods: {
        autoResidenceAddress() {
            this.childRaw.residence_address = clone(this.childRaw.registration_address);
            this.childRaw.residence_flat = this.childRaw.registration_flat;
        },
      childRegistration() {
          this.childRawErrors = clone(this.childRawErrors_proto);
          User.addChild({...this.childRaw}).then(res => {
              if (res) {
                  this.message = 'Ребёнок успешно добавлен';
                  this.show.registration = false;
                  this.show.childReg = true;
              }
          }).catch(err => {
            //TODO: Обработка ошибок с бэка и фронта.
            if (err.msg)
              err.msg.map(el => {
                if (typeof el === 'object') {
                  Object.keys(el ?? {}).map(field => {
                    el[field].map(subfield => {
                      this.childRawErrors[field][subfield] = true;
                    });
                  });
                }
                else {
                  this.childRawErrors[el] = true;
                }
              });

            if (err.response) {
                const msg = err.response.errors[0].message;
                console.log(msg);
                if (msg === 'Email must be unique') {
                    this.childRawErrors.email = true;
                }
                else if (msg == 'Phone must be unique') {
                    this.childRawErrors.phone = true;
                }
                else if (JSON.parse(msg)) {
                    const parsed = JSON.parse(msg);
                    Object.keys(parsed).map(el => {
                        this.childRawErrors[el] = true;
                    });
                }
            }
          });
      },
      addChild() {
          console.log(this.childPhoneOrEmail)
          User.sendParentRequest(this.childPhoneOrEmail).then(res => {
              console.log(res);
              if (res) {
                  this.message = 'Запрос на подтверждение родства ребёнку успешно отправлен';
                  this.show.add = false;
                  this.show.childReg = true;
              }
          }).catch(err => {
              console.log(err);
              console.log(err.msg);

              this.show.error = 'не удалось найти ребёнка';
          });
      }
    }
  }
</script>
