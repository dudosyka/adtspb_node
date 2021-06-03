<template>
  <main class="home">
    <article class="home-content">
      <router-link tag="button" class="left-arrow" to="/child"></router-link>

      <!-- Question !-->
      <article class="card shadow" v-if="show.question">
        <h2 class="form-heading">Как вы хотите добавить ребёнка?</h2>
        <div class="buttons">
          <button class="dark-box dark-button" @click="show.question = false; show.registration = true">Зарегистрировать новый аккаунт</button>
          <button class="light-box light-button" @click="show.question = false; show.add = true">Привязать существующий аккаунт</button>
        </div>
      </article>

      <!-- Back succesful answer !-->
      <article class="card_wrapper z" v-if="show.childReg">
        <section class="card shadow">
          <h2 class="form-heading">{{ message }}</h2>
          <div class="buttons">
            <router-link class="dark-button dark-box" to="/child">Вернуться в "Мои дети"</router-link>
          </div>
        </section>
      </article>

      <!-- Add by phone/email !-->
      <div class="card_wrapper" v-if="show.add">
        <article class="card shadow">
          <button class="left-arrow" @click="show.add = false; show.question = true"></button>

          <h2 class="form-heading">Введите номер телефона или почту ребёнка</h2>
          <p class="form-error">{{ show.error }}</p>
          <inputField
            label="Номер телефона / почта"
            v-model="childPhoneOrEmail"
          />
          <button class="dark-box dark-button" @click="addChild">Добавить</button>
        </article>
      </div>

      <!-- Add new profil !-->
      <article class="child-data card shadow" v-if="show.registration">
        <button class="left-arrow" @click="show.registration = false; show.question = true"></button>

        <section class="card_wrapper z" v-show="show.childNotReg">
          <section class="card shadow">
            <h2 class="form-heading">Ошибка регистрации. Пожалуйста проверьте введённые данные</h2>
            <div class="buttons">
              <button class="dark-button dark-box" @click="show.childNotReg = false">Вернуться</button>
            </div>
          </section>
        </section>

        <article class="child-data_table">

          <h2 class="form-heading">Регистрация ребёнка</h2>
          <article class="child-data_table-group">

            <div class="child-data_row">
              <div>
                <inputField
                  label="Имя"
                  v-model="childRaw.name"
                />
              </div>
              <div>
                <inputField
                  label="Фамилия"
                  v-model="childRaw.surname"
                />
              </div>
            </div>

            <div class="child-data_row">
              <div>
                <inputField
                  label="Отчество"
                  v-model="childRaw.lastname"
                />
              </div>

              <div>
                <div class="input-container">
                  <label class="label" v-bind:class="{'label-up': childRaw.birthday}">Дата рождения</label><br>
                  <!--<masked-input
                    class="type"
                    v-model="masked.birthday"
                    mask="11 / 11 / 11"
                    @input="childRaw.birthday = arguments[1]"
                    tabindex="1"
                  />!-->
                  <input
                    class="type"
                    type="date"
                    v-model="childRaw.birthday"
                  >
                </div>
              </div>
            </div>

            <div>
              <inputField
                label="Номер свидетельства о рождении"
                v-model="childRaw.birth_certificate"
              />
            </div>
          </article>

          <article class="child-data_table-group">
            <div class="child-data_row">
              <div>
                <inputField
                  label="Электронная почта"
                  v-model="childRaw.email"

                />
              </div>
              <div>
                <div class="input-container required">
                  <label class="label" v-bind:class="{'label-up': childRaw.phone}">Номер телефона</label><br>
                  <masked-input
                    v-model="masked.phone"
                    mask="\+\7 (111) 111-11-11"
                    @input="childRaw.phone = arguments[1]"
                    type="tel"
                    class="type"
                    tabindex="4"
                    />
                </div>
              </div>
            </div>
          </article>

          <article class="child-data_table-group">
            <div class="input-container required">
              <h3 class="radio-heading dark">Пол</h3>
              <ul class="radio-list">
                <div class="radio-container">
                  <input type="radio" v-model.number="childRaw.sex" value="1" class="radio" tabindex="3" id="man">
                  <label class="dark radio" for="man" tabindex="5">Мужской</label>
                </div>
                <div class="radio-container">
                  <input type="radio" v-model.number="childRaw.sex" value="0" class="radio" tabindex="3" id="woman">
                  <label class="dark radio" for="woman" tabindex="6">Женский</label>
                </div>
              </ul>
            </div>
          </article>

          <article class="child-data_table-group">
            <div class="child-data_row">
              <div>
                <inputField
                  label="Гражданство"
                  v-model="childRaw.state"
                />
              </div>
              <div>
                <inputField
                  label="Степень родства"
                  v-model="childRaw.relationship"
                />
              </div>
            </div>
          </article>

          <article class="child-data_table-group">
            <div class="child-data_row">
              <div>
                <h2 class="form-heading child-data_heading">ОВЗ</h2>
                <select class="dark-box darken" v-model.number="childRaw.ovz"  >
                  <option value="0">Нету</option>
                  <option value="1">Есть</option>
                </select>
              </div>
              <div v-if="childRaw.ovz">
                <h2 class="form-heading left">Тип ОВЗ</h2>
                <select class="dark-box darken" v-model="childRaw.ovz_type.id"  >
                  <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
                </select>
              </div>
            </div>

            <div class="child-data_row">
              <div>
                <h2 class="form-heading child-data_heading">Инвалидность</h2>
                <select class="dark-box darken" v-model.number="childRaw.disability"  >
                  <option value="0">Нету</option>
                  <option value="1">Есть</option>
                </select>
              </div>
              <div v-if="childRaw.disability">
                <h2 class="form-heading left">Группа нвалидности</h2>
                <select class="dark-box darken" v-model="childRaw.disability_group.id"  >
                  <option v-for="(type, id) in disabilityTypes" :value="id">{{ type }}</option>
                </select>
              </div>
            </div>
          </article>

          <article class="child-data_table-group">
            <inputField
              label="Образовательное учреждение"
              v-model="childRaw.studyPlace"
              type="text"

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
          </article>

          <article class="child-data_table-group">
            <h2 class="form-heading child-data_heading">Адрес регистрации</h2>
              <div class="child-data_addres">
                <inputField
                  label="Город"
                  v-model="childRaw.registration_address.city"

                />
                <inputField
                  label="Район"
                  v-model="childRaw.registration_address.district"

                />
                <inputField
                  label="Улица"
                  v-model="childRaw.registration_address.street"

                />
                <inputField
                  label="Дом"
                  v-model="childRaw.registration_address.house"

                />
                <inputField
                  label="Номер квартиры"
                  v-model="childRaw.registration_flat"

                />
              </div>
          </article>

          <article class="child-data_table-group">
            <h2 class="form-heading child-data_heading">Адрес проживания</h2>
            <div class="child-data_addres">
              <inputField
                label="Город"
                v-model="childRaw.residence_address.city"

              />
              <inputField
                label="Район"
                v-model="childRaw.residence_address.district"

              />
              <inputField
                label="Улица"
                v-model="childRaw.residence_address.street"

              />
              <inputField
                label="Дом"
                v-model="childRaw.residence_address.house"

              />
              <inputField
                label="Номер квартиры"
                v-model="childRaw.residence_flat"

              />
            </div>
          </article>

          <div class="child-data_row">
            <div>
              <inputField
                label="Пароль"
                type="password"
                v-model="childRaw.password"

              />
            </div>
          </div>

          <button class="dark-box dark-button register-button" @click="childRegistration">Зарегистрировать ребёнка</button>
        </article>
      </article>
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

  .child-data {
    max-width: 600px;
    min-width: 420px;
  }
  .child-data_table {
    width: 100%;
    display: grid;
    grid-gap: 20px;
  }
  .child-data_heading {
    margin-bottom: 5px;
    margin-top: 20px;
  }
  .child-data_table-group {
    margin: 5px 0;
  }
  .child-data_row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 200px));
    grid-gap: 20px;
  }
  .child-data_addres {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 200px));
    grid-gap: 10px;
  }
  .buttons {
    margin-top: 50px;
  }
  .register-button {
    margin-top: 20px;
  }
</style>

<script>
  import InputField from '../../components/InputField.vue'
  import MaskedInput from 'vue-masked-input'

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
          birth_certificate: null,

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
      childRegistration() {
        const req = `
          mutation ($user: UserInput) {
            createChild(child: $user)
          }
        `

        for (let key in this.childRaw) {
          this.childFormated[key] = this.childRaw[key]
        }
        console.log(this.childFormated)

        this.childFormated.registration_address = this.childRaw.registration_address.city + ', ' + this.childRaw.registration_address.district + ', ' + this.childRaw.registration_address.street + ', ' + this.childRaw.registration_address.house
        this.childFormated.residence_address = this.childRaw.residence_address.city + ', ' + this.childRaw.residence_address.district + ', ' + this.childRaw.residence_address.street + ', ' + this.childRaw.residence_address.house

        if (this.childRaw.phone != 11) {
            this.childFormated.phone = 8 + this.childRaw.phone
        }

        console.log(this.childRaw.birthday)
        this.childFormated.birthday = (new Date(this.childRaw.birthday)).getTime()
        console.log(this.childFormated.birthday)

        this.childFormated.ovz = Number(this.childRaw.ovz)
        this.childFormated.ovz_type.id = Number(this.childRaw.ovz_type.id)
        this.childFormated.disability = Number(this.childRaw.disability)
        this.childFormated.disability_group.id = Number(this.childRaw.disability_group.id)

        let data = {
          user: this.childFormated
        }


        api.request(req, data)
          .then(data => {
            console.log(data)

            this.message = 'Ребёнок успешно добавлен'
            this.show.childReg = true
          })
          .catch(err => {
            console.error(err)
            this.show.childNotReg = true


          })
      },
      addChild() {
        let req = `
          mutation ($child_data: String) {
            addChild(child_data: $child_data)
          }
        `

        let data = {}

        if (this.childPhoneOrEmail.indexOf('@') !== -1) {
          data.child_data = this.childPhoneOrEmail

        } else {

          if (this.childPhoneOrEmail.indexOf('+7') !== -1) {
            this.childPhoneOrEmail = this.childPhoneOrEmail.split('')
            this.childPhoneOrEmail.splice(0,2)
            this.childPhoneOrEmail = this.childPhoneOrEmail.join('')

          }

          if (this.childPhoneOrEmail.length < 11) {
            this.childPhoneOrEmail = '8' + this.childPhoneOrEmail

          }

          data.child_data = this.childPhoneOrEmail
        }

        api.request(req, data)
          .then(data => {
            console.log(data)

            this.message = 'Запрос на подтверждение родства ребёнку успешно отпрвлен'
            this.show.childReg = true
          })
          .catch(err => {
            console.log(err)

            this.show.error = 'не удалось найти ребёнка'
          })
      }
    }
  }
</script>
