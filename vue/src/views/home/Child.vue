<template>
  <main class="home">
      <navigation />
      <article class="home-content">

        <section class="children">

          <header class="card child shadow" v-for="(raw, number) in childrenRaw">
            <h2 class="child-name">{{ raw.name + ' ' + raw.surname }}</h2>
            <button
              @click="showData(number)"
              class="dark-box darken child-to-data"
              :class="{'child-from-data': number === show.childData}"
            ></button>
          </header>

          <router-link to="/child/add" class="dark-box dark-button child-add">+ Добавить ребёнка</router-link>

        </section>

        <section class="children-data card shadow">

          <article class="child-data" v-for="(raw, number) in childrenRaw" v-show="show.childData === number">
            <article class="child-data_table">
              <h2 class="form-heading">Основная информация</h2>

              <article class="child-data_table-group">

                <div class="child-data_row">
                  <div>
                    <inputField
                      label="Имя"
                      v-model="raw.name"

                    />
                  </div>
                  <div>
                    <inputField
                      label="Фамилия"
                      v-model="childrenRaw[number].surname"
                    />
                  </div>
                </div>

                <div class="child-data_row">
                  <div>
                    <inputField
                      label="Отчество"
                      v-model="raw.lastname"

                    />
                  </div>

                </div>
              </article>

              <article class="child-data_table-group">
                <div class="child-data_row">
                  <div>
                    <inputField
                      label="Электронная почта"
                      v-model="raw.email"

                    />
                  </div>
                  <div>
                    <div class="input-container required">
                      <label class="label" v-bind:class="{'label-up': raw.phone}">Номер телефона</label><br>
                      <masked-input
                        v-model="raw.masked.phone"
                        mask="\+\7 (111) 111-11-11"
                        @input="raw.phone = arguments[1]"
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
                      <input type="radio" v-model.number="raw.sex" value="1" class="radio" tabindex="3" id="man">
                      <label class="dark radio" for="man" tabindex="5">Мужской</label>
                    </div>
                    <div class="radio-container">
                      <input type="radio" v-model.number="raw.sex" value="0" class="radio" tabindex="3" id="woman">
                      <label class="dark radio" for="woman" tabindex="6">Женский</label>
                    </div>
                  </ul>
                </div>
              </article>

              <div class="buttons">
                <h2 class="form-heading"> {{ edit.message }} </h2>
                <button class="dark-box dark-button" @click="editChild(number)">Отправить на редактирование</button>

                <h2 class="form-heading"> {{ remove.message }} </h2>
                <inputField
                  label="Комментарий к удалению"
                  v-if="remove.hidden"
                  v-model="remove.comment"
                />
                <button class="light-box light-button" v-if="!remove.hidden" @click="remove.hidden = true">Удалить</button>
                <button class="light-box light-button" v-if="remove.hidden" @click="removeChild(number)">Удалить</button>
              </div>

              <hr>

              <h2 class="form-heading">Дополнительная информация</h2>

              <article class="child-data_table-group">
                <div>
                  <inputField
                    label="Номер свидетельства о рождении"
                    v-model="raw.birth_certificate"

                  />
                </div>

                <div>
                  <div class="input-container">
                    <label class="label" v-bind:class="{'label-up': raw.birthday}">Дата рождения</label><br>
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
                      v-model="raw.birthday"
                    >
                  </div>
                </div>
              </article>

              <article class="child-data_table-group">
                <div class="child-data_row">
                  <div>
                    <inputField
                      label="Гражданство"
                      v-model="raw.state"

                    />
                  </div>
                  <div>
                    <inputField
                      label="Степень родства"
                      v-model="raw.relationship"

                    />
                  </div>
                </div>
              </article>

              <article class="child-data_table-group">
                <div class="child-data_row">
                  <div>
                    <h2 class="form-heading child-data_heading">ОВЗ</h2>
                    <select class="dark-box darken" v-model.number="raw.ovz">
                      <option value="0">Нету</option>
                      <option value="1">Есть</option>
                    </select>
                  </div>
                  <div v-if="raw.ovz">
                    <h2 class="form-heading left">Тип ОВЗ</h2>
                    <select class="dark-box darken" v-model="raw.ovz_type.id" >
                      <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
                    </select>
                  </div>
                </div>

                <div class="child-data_row">
                  <div>
                    <h2 class="form-heading child-data_heading">Инвалидность</h2>
                    <select class="dark-box darken" v-model.number="raw.disability" >
                      <option value="0">Нету</option>
                      <option value="1">Есть</option>
                    </select>
                  </div>
                  <div v-if="raw.disability">
                    <h2 class="form-heading left">Группа нвалидности</h2>
                    <select class="dark-box darken" v-model="raw.disability_group.id" >
                      <option v-for="(type, id) in disabilityTypes" :value="id">{{ type }}</option>
                    </select>
                  </div>
                </div>
              </article>

              <article class="child-data_table-group">
                <inputField
                  label="Образовательное учреждение"
                  v-model="raw.studyPlace"
                  type="text"

                />
              </article>

              <article class="child-data_table-group">
                <h2 class="form-heading child-data_heading">Адрес регистрации</h2>
                  <div class="child-data_addres">
                    <inputField
                      label="Город"
                      v-model="raw.registration_address.city"

                    />
                    <inputField
                      label="Район"
                      v-model="raw.registration_address.district"

                    />
                    <inputField
                      label="Улица"
                      v-model="raw.registration_address.street"

                    />
                    <inputField
                      label="Дом"
                      v-model="raw.registration_address.house"

                    />
                    <inputField
                      label="Номер квартиры"
                      v-model="raw.registration_flat"

                    />
                  </div>
              </article>

              <article class="child-data_table-group">
                <h2 class="form-heading child-data_heading">Адрес проживания</h2>
                <div class="child-data_addres">
                  <inputField
                    label="Город"
                    v-model="raw.residence_address.city"

                  />
                  <inputField
                    label="Район"
                    v-model="raw.residence_address.district"

                  />
                  <inputField
                    label="Улица"
                    v-model="raw.residence_address.street"

                  />
                  <inputField
                    label="Дом"
                    v-model="raw.residence_address.house"

                  />
                  <inputField
                    label="Номер квартиры"
                    v-model="raw.residence_flat"

                  />
                </div>
              </article>
            </article>

            <div class="buttons">
              <h2 class="form-heading"> {{ edit.extraMessage }} </h2>
              <button class="dark-box dark-button" @click="editChildExtra(number)">Отправить на редактирование</button>

              <h2 class="form-heading"> {{ remove.message }} </h2>
              <inputField
                label="Комментарий к удалению"
                v-if="remove.hidden"
                v-model="remove.comment"
              />
              <button class="light-box light-button" v-if="!remove.hidden" @click="remove.hidden = true">Удалить</button>
              <button class="light-box light-button" v-if="remove.hidden" @click="removeChild(id)">Удалить</button>
            </div>
          </article>

        </section>

      </article>
  </main>
</template>

<style scoped>
  .home-content {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 10px;
  }
  .children {
    display: flex;
    flex-direction: column;
  }
  .children-data {
    padding: 60px;
  }
  .child {
    display: flex;
    justify-content: space-between
  }
  .child-name {
    margin: 0;
    color: #142732;
    align-self: center;
  }
  .child-to-data {
    margin-left: 10px;
  }
  .child-to-data::after {
    content: '';
    display: inline-block;
    width: 0px;
    height: 0px;
    margin-left: 10px;

    border: 8px solid #fff;
    border-top-color: rgba(0,0,0,0);
    border-bottom-color: rgba(0,0,0,0);
    border-left-style: none;
  }
  .child-from-data::after {
    border-left-style: solid;
    border-right-style: none;
  }
  .child-add {
    align-self: center;
    max-width: 150px;
    margin-top: 20px;
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
    margin-top: 30px;
  }
</style>

<script>
  import navigation from '../../components/Navigation.vue'
  import inputField from '../../components/InputField.vue'
  import MaskedInput from 'vue-masked-input'

  export default {
    name: 'Child',
    components: {
      navigation, inputField, MaskedInput
    },
    data() {
      return {
        childrenRaw: [],
        childrenFormatted: [],

        masked: {
          phone: null,
          birthday: null,
        },


        ovzTypes: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
        disabilityTypes: ['I', 'II', 'III'],
        show: {
          childData: 0,
        },
        remove: {
          comment: null,
          message: '',
          hidden: false
        },
        edit: {
          message: '',
          extraMessage: '',
        }
      }
    },
    created() {
      let req = `
        query {
          getChildren {
              id,
              name,
              surname,
              lastname,
              email,
              phone,
              sex,

              birthday,
              birth_certificate,
              state,
              relationship,
              studyPlace,

              ovz, ovz_type { id },
              disability, disability_group { id },

              registration_address, registration_flat,
              residence_address, residence_flat
          }
        }
      `

      let data = {}

      api.request(req)
        .then(data => {
          console.log(data);

          if (data.getChildren.length > 0) {
            data.getChildren.map(el => {
              const birth = el.birthday;
              const date = new Date(birth);
              const year = date.getFullYear();

              let month = date.getMonth() + 1;
              let day = date.getDate();

              month = (month > 9) ? month : "0" + month;
              day = (day > 9) ? day : "0" + day;

              el.birthday = year + "-" + month + "-" + day;

              if (el.registration_address !== null) {
                const addres = el.registration_address.split(',')

                const city = addres[0]
                const district = addres[1]
                const street = addres[2]
                const house = addres[3]

                el.registration_address = {
                  city: city,
                  district: district,
                  street: street,
                  house: house,
                }
              } else {
                el.registration_address = {
                  city: null,
                  district: null,
                  street: null,
                  house: null,
                }
              }

              if (el.residence_address !== null) {
                const addres = el.residence_address.split(',')

                const city = addres[0]
                const district = addres[1]
                const street = addres[2]
                const house = addres[3]

                el.residence_address = {
                  city: city,
                  district: district,
                  street: street,
                  house: house,
                }
              } else {
                el.residence_address = {
                  city: null,
                  district: null,
                  street: null,
                  house: null,
                }
              }

              el.masked = {}

              let formattingPhone = el.phone.split('')
              formattingPhone.shift()
              el.masked.phone = formattingPhone.join('')

              el.sex = el.sex

              return el;
          })
        }
          this.childrenRaw = data.getChildren
        })
        .catch(err => { console.log(err) })
    },
    methods: {
      showData(id) {
        this.show.childData = id
      },

      editChild(id) {
        let req = `
          mutation ($data: UserInput, $target_id: Int) {
            editMainUserData(newData: $data, target_id: $target_id)
          }
        `

        this.childrenFormatted[id] = {}
        for (let key in this.childrenRaw[id]) {
          this.childrenFormatted[id][key] = this.childrenRaw[id][key]
        }

        if (this.childrenRaw[id].phone != 11) {
            this.childrenFormatted[id].phone = 8 + this.childrenRaw[id].phone
        }

        this.childrenFormatted[id].id = Number(this.childrenFormatted[id].id)

        let data = {
          data: {
            name: this.childrenFormatted[id].name,
            surname: this.childrenFormatted[id].surname,
            lastname: this.childrenFormatted[id].lastname,
            email: this.childrenFormatted[id].email,
            phone: this.childrenFormatted[id].phone,
            sex: this.childrenFormatted[id].sex,
          },
          target_id: this.childrenFormatted[id].id
        }

        api.request(req, data)
          .then(data => {
            this.edit.message = 'Данные отпралены успешно'
          })
          .catch(err => {
            console.error(err)
            this.edit.message = 'Произошла ошибка('
          })

        console.log(data)
      },
      editChildExtra(id) {
        let req = `
          mutation ($data: UserInput, $target_id: Int) {
            editExtraUserData(newData: $data, target_id: $target_id)
          }
        `

        this.childrenFormatted[id] = {}
        for (let key in this.childrenRaw[id]) {
         this.childrenFormatted[id][key] = this.childrenRaw[id][key]
        }

        this.childrenFormatted[id].registration_address = this.childrenRaw[id].registration_address.city + ', ' + this.childrenRaw[id].registration_address.district + ', ' + this.childrenRaw[id].registration_address.street + ', ' + this.childrenRaw[id].registration_address.house
        this.childrenFormatted[id].residence_address = this.childrenRaw[id].residence_address.city + ', ' + this.childrenRaw[id].residence_address.district + ', ' + this.childrenRaw[id].residence_address.street + ', ' + this.childrenRaw[id].residence_address.house

        this.childrenFormatted[id].birthday = (new Date(this.childrenRaw[id].birthday)).getTime()

        this.childrenFormatted[id].id = Number(this.childrenFormatted[id].id)

        let data = {
          data: {
            birthday: this.childrenFormatted[id].birthday,
            birth_certificate: this.childrenFormatted.birth_certificate,

            state: this.childrenFormatted[id].state,
            relationship: this.childrenFormatted[id].relationship,
            studyPlace: this.childrenFormatted[id].studyPlace,
            ovz: this.childrenFormatted[id].ovz,
            ovz_type: { id: this.childrenFormatted[id].ovz_type.id },
            disability: this.childrenFormatted[id].disability,
            disability_group: { id: this.childrenFormatted[id].disability_group.id },

            registration_address: this.childrenFormatted[id].registration_address,
            registration_flat: this.childrenFormatted[id].registration_flat,

            residence_address: this.childrenFormatted[id].residence_address,
            residence_flat: this.childrenFormatted[id].residence_flat,
          },
          target_id: this.childrenFormatted[id].id
        }

        api.request(req, data)
          .then(data => {
            this.edit.extraMessage = 'Данные отпралены успешно'
          })
          .catch(err => {
            console.error(err)
            this.edit.extraMessage = 'Произошла ошибка('
          })
      },

      removeChild(id) {
        let req = `
          mutation ($child_id: Int, $removeAccount: Boolean, $comment: String) {
            removeChild(child_id: $child_id, removeAccount: $removeAccount, comment: $comment)
          }
        `

        this.childrenRaw[id].id = Number(this.childrenRaw[id].id)
        let data = {
          child_id: this.childrenRaw[id].id,
          removeAccount: false,
          comment: this.remove.comment
        }

        api.request(req, data)
          .then(data => {
            this.remove.hidden = false
            this.remove.message = 'Запрос на удаление успешно отправлен'
          })
          .catch(err => {
            console.log(err)
            this.remove.message = 'Произошла ошибка('
          })
      },
    },
    computed: {
    }
  }
</script>
