<template>
  <main class="home">
      <navigation />
      <article class="home-content">

        <section class="children">

          <header class="card child shadow" v-for="(child, id) in children">
            <h2 class="child-name">{{ child.name + ' ' + child.surname }}</h2>
            <button
              @click="showData(id)"
              class="dark-box darken child-to-data"
              :class="{'child-from-data': id === show.childData}"
            ></button>
          </header>

          <router-link to="/child/add" class="dark-box dark-button child-add">+ Добавить ребёнка</router-link>

        </section>

        <section class="children-data card shadow">

          <article class="child-data" v-for="(child, id) in childrenRaw" v-show="show.childData === id">
            <article class="child-data_table">

              <article class="child-data_table-group">

                <div class="child-data_row">
                  <div>
                    <inputField
                      label="Имя"
                      v-model="child.name"
                      :readonly="child.readonly"
                    />
                  </div>
                  <div>
                    <inputField
                      label="Фамилия"
                      v-model="child.surname"
                      :readonly="child.readonly"
                    />
                  </div>
                </div>

                <div class="child-data_row">
                  <div>
                    <inputField
                      label="Отчество"
                      v-model="child.lastname"
                      :readonly="child.readonly"
                    />
                  </div>

                </div>
              </article>

              <article class="child-data_table-group">
                <div>
                  <inputField
                    label="Номер свидетельства о рождении"
                    v-model="child.birth_certificate"
                    :readonly="child.readonly"
                  />
                </div>

                <div>
                  <div class="input-container">
                    <label class="label" v-bind:class="{'label-up': child.birthday}">Дата рождения</label><br>
                    <masked-input
                      class="type"
                      v-model="masked.birthday"
                      mask="11 / 11 / 11"
                      @input="child.birthday = arguments[1]"
                      tabindex="1"
                      :readonly="child.readonly"
                    />
                  </div>
                </div>
              </article>

              <article class="child-data_table-group">
                <div class="child-data_row">
                  <div>
                    <inputField
                      label="Электронная почта"
                      v-model="child.email"
                      :readonly="child.readonly"
                    />
                  </div>
                  <div>
                    <div class="input-container required">
                      <label class="label" v-bind:class="{'label-up': child.phone}">Номер телефона</label><br>
                      <masked-input
                        v-model="masked.phone"
                        mask="\+\7 (111) 111-11-11"
                        @input="child.phone = arguments[1]"
                        type="tel"
                        class="type"
                        tabindex="4"
                        :readonly="child.readonly"
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
                      <input type="radio" v-model.number="child.sex" value="1" class="radio" tabindex="3" id="man" :disabled="child.readonly">
                      <label class="dark radio" for="man" tabindex="5">Мужской</label>
                    </div>
                    <div class="radio-container">
                      <input type="radio" v-model.number="child.sex" value="0" class="radio" tabindex="3" id="woman" :disabled="child.readonly">
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
                      v-model="child.state"
                      :readonly="child.readonly"
                    />
                  </div>
                  <div>
                    <inputField
                      label="Степень родства"
                      v-model="child.relationship"
                      :readonly="child.readonly"
                    />
                  </div>
                </div>
              </article>

              <article class="child-data_table-group">
                <div class="child-data_row">
                  <div>
                    <h2 class="form-heading child-data_heading">ОВЗ</h2>
                    <select class="dark-box darken" v-model.number="child.ovz" :disabled="child.readonly">
                      <option value="0">Нету</option>
                      <option value="1">Есть</option>
                    </select>
                  </div>
                  <div v-if="child.ovz">
                    <h2 class="form-heading left">Тип ОВЗ</h2>
                    <select class="dark-box darken" v-model="child.ovz_type.id" :disabled="child.readonly">
                      <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
                    </select>
                  </div>
                </div>

                <div class="child-data_row">
                  <div>
                    <h2 class="form-heading child-data_heading">Инвалидность</h2>
                    <select class="dark-box darken" v-model.number="child.disability" :disabled="child.readonly">
                      <option value="0">Нету</option>
                      <option value="1">Есть</option>
                    </select>
                  </div>
                  <div v-if="child.disability">
                    <h2 class="form-heading left">Группа нвалидности</h2>
                    <select class="dark-box darken" v-model="child.disability_group.id" :disabled="child.readonly">
                      <option v-for="(type, id) in disabilityTypes" :value="id">{{ type }}</option>
                    </select>
                  </div>
                </div>
              </article>

              <article class="child-data_table-group">
                <inputField
                  label="Образовательное учреждение"
                  v-model="child.studyPlace"
                  type="text"
                  :readonly="child.readonly"
                />
                <div class="child-data_row">
                  <!--
                  <div>
                    <inputField
                      label="Класс \ группа"
                      v-model="child.class"
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
                      v-model="child.registration_address.city"
                      :readonly="child.readonly"
                    />
                    <inputField
                      label="Район"
                      v-model="child.registration_address.district"
                      :readonly="child.readonly"
                    />
                    <inputField
                      label="Улица"
                      v-model="child.registration_address.street"
                      :readonly="child.readonly"
                    />
                    <inputField
                      label="Дом"
                      v-model="child.registration_address.house"
                      :readonly="child.readonly"
                    />
                    <inputField
                      label="Номер квартиры"
                      v-model="child.registration_flat"
                      :readonly="child.readonly"
                    />
                  </div>
              </article>
              <article class="child-data_table-group">
                <h2 class="form-heading child-data_heading">Адрес проживания</h2>
                <div class="child-data_addres">
                  <inputField
                    label="Город"
                    v-model="child.residence_address.city"
                    :readonly="child.readonly"
                  />
                  <inputField
                    label="Район"
                    v-model="child.residence_address.district"
                    :readonly="child.readonly"
                  />
                  <inputField
                    label="Улица"
                    v-model="child.residence_address.street"
                    :readonly="child.readonly"
                  />
                  <inputField
                    label="Дом"
                    v-model="child.residence_address.house"
                    :readonly="child.readonly"
                  />
                  <inputField
                    label="Номер квартиры"
                    v-model="child.residence_flat"
                    :readonly="child.readonly"
                  />
                </div>
              </article>

              <div class="child-data_row">
                <div>
                  <inputField
                    label="Пароль"
                    type="password"
                    v-model="child.password"
                    :readonly="child.readonly"
                  />
                </div>
              </div>
            </article>

            <div class="buttons">
              <button class="dark-box dark-button" @click="editChild(id)">Редактировать</button>

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
        children: [],
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
        }
      }
    },
    created() {
      let req = `
        query {
          getChildren {
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

            if (data.getChildren.length < 1)
                this.children = [];
                data.getChildren.map(el => {
                  const birth = el.birthday;
                  const date = new Date(birth);
                  const year = date.getFullYear();

                  let month = date.getMonth() + 1;
                  let day = date.getDate();

                  month = (month > 9) ? month : "0" + month;
                  day = (day > 9) ? day : "0" + day;

                  el.birthday = year + "-" + month + "-" + day;

                  el.readonly = true

                  return el;
                });
            this.children = data.getChildren;

            for (let child in this.children) {
              this.childrenRaw[child] = {}
              for (let key in this.children[child]) {
                this.childrenRaw[child][key] = this.children[child][key]
              }
            }

            for (let child in this.childrenRaw) {

              this.childrenRaw[child].registration_address = {
                city: null,
                district: null,
                street: null,
                house: null,
              }
              if (this.children[child].registration_address) {
                const addres = this.children[child].registration_address.split(',')

                const city = addres[0]
                const district = addres[1]
                const street = addres[2]
                const house = addres[3]

                this.childrenRaw[child].registration_address = {
                  city: city,
                  district: district,
                  street: street,
                  house: house,
                }
              }

              this.childrenRaw[child].residence_address = {
                city: null,
                district: null,
                street: null,
                house: null,
              }
              if (this.children[child].residence_address) {
                const addres = this.children[child].residence_address.split(',')

                const city = addres[0]
                const district = addres[1]
                const street = addres[2]
                const house = addres[3]

                this.childrenRaw[child].residence_address = {
                  city: city,
                  district: district,
                  street: street,
                  house: house,
                }
              }

              let formattingPhone = this.children[child].phone.split('')
              formattingPhone.shift()
              this.childrenRaw[child].phone = formattingPhone.join()
            }
        })
        .catch(err => { console.log(err) })
    },
    methods: {
      showData(id) {
        this.show.childData = id
      },

      editChild(id) {
        console.log('edit hi')


      },

      removeChild(id) {
        let req = `
          mutation ($child_id: Int, $removeAccount: Boolean, $comment: String) {
            removeChild(child_id: $child_id, removeAccount: $removeAccount, comment: $comment)
          }
        `

        this.children[id].id = Number(this.children[id].id)
        let data = {
          child_id: this.children[id].id,
          removeAccount: false,
          comment: this.remove.comment
        }

        console.log(data)

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
