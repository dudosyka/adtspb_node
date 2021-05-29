<template>
  <main class="home">
    <article class="home-content">
      <router-link tag="button" class="left-arrow" to="/child"></router-link>
      <article class="card" v-if="show.question">
        <h2 class="form-heading">Как вы хотите добавить ребёнка?</h2>
        <div class="buttons">
          <button class="dark-box dark-button" @click="show.question = false; show.registration = true">Зарегистрировать новый аккаунт</button>
          <button class="light-box light-button" @click="show.question = false; show.add = true">Привязать существующий аккаунт</button>
        </div>
      </article>

      <article class="card" v-if="show.add">
        <button class="left-arrow" @click="show.add = false; show.question = true"></button>
      </article>

      <article class="child-data card" v-if="show.registration">
        <button class="left-arrow" @click="show.registration = false; show.question = true"></button>

        <section class="card_wrapper">
          <h2 class="form-heading"></h2>
        </section>

        <table class="child-data_table">
          <caption class="form-heading">Регистрация ребёнка</caption>
          <tbody class="child-data_table-group">
            <tr>
              <td>
                <inputField
                  label="Имя"
                  v-model="child.name"

                />
              </td>
              <td>
                <inputField
                  label="Фамилия"
                  v-model="child.surname"

                />
              </td>
            </tr>
            <tr>
              <td>
                <inputField
                  label="Отчество"
                  v-model="child.lastname"

                />
              </td>
              <td>
                <div class="input-container">
                  <label class="label" v-bind:class="{'label-up': childRaw.birthday}">Дата рождения</label><br>
                  <masked-input
                    class="type"
                    v-model="childRaw.birthday"
                    mask="11 / 11 / 11"
                    @input="child.birthday = arguments[1]"
                    tabindex="1"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <inputField
                  label="Номер свидетельства о рождении"
                  v-model="child.birth_certificate"
                />
              </td>
            </tr>
          </tbody>
          <tbody class="child-data_table-group">
            <tr>
              <td>
                <inputField
                  label="Электронная почта"
                  v-model="child.email"

                />
              </td>
              <td>
                <div class="input-container required">
                  <label class="label" v-bind:class="{'label-up': child.phone}">Номер телефона</label><br>
                  <masked-input
                    v-model="childRaw.phone"
                    mask="\+\7 (111) 111-11-11"
                    @input="child.phone = arguments[1]"
                    type="tel"
                    class="type"
                    tabindex="4" />
                </div>
              </td>
            </tr>
          </tbody>
          <tbody class="child-data_table-group">
            <tr>
              <td colspan="2">
                <div class="input-container required">
                  <h3 class="radio-heading dark">Пол</h3>
                  <ul class="radio-list">
                    <div class="radio-container">
                      <input type="radio" v-model.number="child.sex" value="1" class="radio" tabindex="3" id="man">
                      <label class="dark radio" for="man" tabindex="5">Мужской</label>
                    </div>
                    <div class="radio-container">
                      <input type="radio" v-model.number="child.sex" value="0" class="radio" tabindex="3" id="woman">
                      <label class="dark radio" for="woman" tabindex="6">Женский</label>
                    </div>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody class="child-data_table-group">
            <tr>
              <td>
                <inputField
                  label="Гражданство"
                  v-model="child.state"

                />
              </td>
              <td>
                <inputField
                  label="Степень родства"
                  v-model="child.relationship"

                />
              </td>
            </tr>
          </tbody>
          <tbody class="child-data_table-group">
            <tr>
              <td>
                <h2 class="form-heading left">ОВЗ</h2>
                <select class="dark-box darken" v-model.number="child.ovz">
                  <option value="0">Нету</option>
                  <option value="1">Есть</option>
                </select>
              </td>
              <td v-if="child.ovz">
                <h2 class="form-heading left">Тип ОВЗ</h2>
                <select class="dark-box darken" v-model="child.ovz_type.id">
                  <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <h2 class="form-heading left">Инвалидность</h2>
                <select class="dark-box darken" v-model.number="child.disability">
                  <option value="0">Нету</option>
                  <option value="1">Есть</option>
                </select>
              </td>
              <td v-if="child.disability">
                <h2 class="form-heading left">Группа нвалидности</h2>
                <select class="dark-box darken" v-model="child.disability_group.id">
                  <option v-for="(type, id) in disabilityTypes" :value="id">{{ type }}</option>
                </select>
              </td>
            </tr>
          </tbody>
          <tbody class="child-data_table-group">
            <tr>
              <td colspan="2">
                <inputField
                  label="Образовательное учреждение"
                  v-model="child.studyPlace"
                  type="text"
                />
              </td>
            </tr>
            <tr>
              <!--
              <td>
                <inputField
                  label="Класс \ группа"
                  v-model="child.class"
                  type="text"
                />
              </td>
              !-->
            </tr>
          </tbody>
          <tbody class="child-data_table-group">
            <tr>
              <td colspan="2">
                <h2 class="form-heading">Адрес регистрации</h2>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="child-data_input-row">
                  <inputField
                    label="Город"
                    v-model="childRaw.registration_address.city"
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
                    label="Номер кваритиры"
                    v-model="child.registration_flat"
                  />
                </div>
              </td>
            </tr>
          </tbody>
          <tbody class="child-data_table-group">
            <tr>
              <td colspan="2">
                <h2 class="form-heading">Адрес проживания</h2>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="child-data_input-row">
                  <inputField
                    label="Город"
                    v-model="childRaw.residence_address.city"
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
                    label="Номер кваритиры"
                    v-model="child.residence_flat"
                  />
                </div>
              </td>
            </tr>
          </tbody>
          <tr>
            <td>
              <inputField
                label="Пароль"
                type="password"
                v-model="child.password"
              />
            </td>
          </tr>
        </table>
        <button class="dark-box dark-button register-button" @click="childRegistration">Зарегистрировать ребёнка</button>
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
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .child-data_table {
    width: 100%;
  }
  .child-data_table td {
    padding-right: 20px;
  }
  .child-data_table td:last-child {
    padding-right: 0;
  }
  .child-data_input-row {
    display: grid;
    grid-template-columns: repeat(4, auto);
    grid-gap: 10px;
  }
  .form-heading {
    text-align: center;
    margin-top: 50px;
  }
  .form-heading.left {
    text-align: left;
    margin: 0;
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
        child: {
          name: null,
          surname: null,
          lastname: null,
          birthday: null,
          birth_certificate: null,

          email: null,
          phone: null,
          sex: null,
          password: null,

          state: null,
          relationship: null,
          studyPlace: null,
          ovz: 0,
          ovz_type: { id: null },
          disability: 0,
          disability_group: { id: null },
          registration_address: null,
          registration_flat: null,
          residence_address: null,
          residence_flat: null
        },
        childRaw: {
          phone: null,
          birthday: null,
          registration_address: {
            city: null,
            street: null,
            house: null,
          },
          residence_address: {
            city: null,
            street: null,
            house: null
          }
        },
        ovzTypes: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
        disabilityTypes: ['I', 'II', 'III'],
        show: {
          question: true,
          registration: false,
          add: false,

          childReg: false,
          childNotReg: false
        }
      }
    },
    methods: {
      childRegistration() {
        let req = `
          mutation ($user: UserInput) {
            createChild(child: $user)
          }
        `

        this.child.registration_address = this.childRaw.registration_address.city + ' ' + this.childRaw.registration_address.street + ' ' + this.childRaw.registration_address.house
        this.child.residence_address = this.childRaw.residence_address.city + ' ' + this.childRaw.residence_address.street + ' ' + this.childRaw.residence_address.house

        if (this.child.phone != 11) {
            this.child.phone = 8 + this.child.phone
        }

        this.child.birthday = Number(this.child.birthday)

        this.child.ovz = Number(this.child.ovz)
        this.child.ovz_type.id = Number(this.child.ovz_type.id)
        this.child.disability = Number(this.child.disability)
        this.child.disability_group.id = Number(this.child.disability_group.id)

        let data = {
          user: this.child
        }
        console.log(this.child)

        api.request(req, data)
          .then(data => {
            console.log(data)
            this.show.childReg = true


          })
          .catch(err => {
            console.error(err)
            this.show.childReg = true


          })
      }
    }
  }
</script>
