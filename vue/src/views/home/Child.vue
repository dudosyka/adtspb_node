<template>
  <main class="home">
      <navigation />
      <article class="home-content">

        <section class="children">

          <header class="card child shadow" v-for="(raw, number) in childrenRaw" @click="showData(number)">
            <h2 class="child-name">{{ raw.name + ' ' + raw.surname }}</h2>
            <span
              class="child-to-data"
              :class="{'child-from-data': number === show.childData}"
            ></span>
          </header>

          <router-link to="/child/add" class="dark-box dark-button child-add">+ Добавить ребёнка</router-link>

        </section>

        <section class="children-data card shadow">

          <article class="child-data" v-for="(raw, number) in childrenRaw" v-show="show.childData === number">
            <article class="child-data_table">
              <article class="child-data_table-group">
                <p class="label-error" v-if="edit.error"> {{ edit.error }} </p>

                <div class="child-data_row">
                  <div>
                    <inputField
                      label="Имя"
                      v-model="raw.name"
                      :error="errors[number]['name']"
                    />
                  </div>
                  <div>
                    <inputField
                      label="Фамилия"
                      v-model="raw.surname"
                      :error="errors[number]['surname']"
                    />
                  </div>
                </div>

                <div class="child-data_row">
                  <div>
                    <inputField
                      label="Отчество"
                      v-model="raw.lastname"
                      :error="errors[number]['lastname']"
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
                      :error="errors[number]['email']"
                    />
                  </div>
                  <div>
                    <div class="input-container required">
                      <label class="label" v-bind:class="{'label-up': raw.phone, 'error-label': errors[number]['phone']}">Номер телефона</label><br>
                      <masked-input
                        v-model="raw.masked.phone"
                        mask="\+\7 (111) 111-11-11"
                        @input="raw.phone = arguments[1]"
                        type="tel"
                        class="type"
                        :class="{'input-error': errors[number]['phone']}"
                        tabindex="4"

                        />
                    </div>
                  </div>
                </div>
              </article>

              <article class="child-data_table-group">
                <div class="input-container required">
                  <h3 class="radio-heading dark" :class="{'label-error': errors[number]['sex']}">Пол</h3>
                  <ul class="radio-list" :class="{'input-error': errors[number]['sex']}">
                    <div class="radio-container">
                      <input type="radio" v-model.number="raw.sex" value="1" class="radio" tabindex="3" :id="number + 'man'">
                      <label class="dark radio" :for="number + 'man'" tabindex="5">Мужской</label>
                    </div>
                    <div class="radio-container">
                      <input type="radio" v-model.number="raw.sex" value="0" class="radio" tabindex="3" :id="number + 'woman'">
                      <label class="dark radio" :for="number + 'woman'" tabindex="6">Женский</label>
                    </div>
                  </ul>
                </div>
              </article>

              <article class="child-data_table-group">
                <div>
                  <inputField
                    label="Номер свидетельства о рождении"
                    v-model="raw.birth_certificate"
                    :error="errors[number]['birth_certificate']"
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
                      :error="errors[number]['birthday']"
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
                      :error="errors[number]['state']"
                    />
                  </div>
                  <div>
                    <inputField
                      label="Степень родства"
                      v-model="raw.relationship"
                      :error="errors[number]['relationship']"
                    />
                  </div>
                </div>
              </article>

              <article class="child-data_table-group">
                <div class="child-data_row">
                  <div :class="{'input-error': errors[number]['ovz']['id']}">
                    <h2 class="form-heading child-data_heading" :class="{'label-error': errors[number]['ovz']['id']}">ОВЗ</h2>
                    <select class="dark-box darken" v-model.number="raw.ovz">
                      <option value="0">Нету</option>
                      <option value="1">Есть</option>
                    </select>
                  </div>
                  <div v-if="raw.ovz" :class="{'input-error': errors[number]['ovz_type']['id']}">
                    <h2 class="form-heading left" :class="{'label-error': errors[number]['ovz_type']['id']}">Тип ОВЗ</h2>
                    <select class="dark-box darken" v-model="raw.ovz_type.id" >
                      <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
                    </select>
                  </div>
                </div>

                <div class="child-data_row">
                  <div :class="{'input-error': errors[number]['disability']['id']}">
                    <h2 class="form-heading child-data_heading" :class="{'label-error': errors[number]['disability']['id']}">Инвалидность</h2>
                    <select class="dark-box darken" v-model.number="raw.disability" >
                      <option value="0">Нету</option>
                      <option value="1">Есть</option>
                    </select>
                  </div>
                  <div v-if="raw.disability" :class="{'input-error': errors[number]['disability_group']['id']}">
                    <h2 class="form-heading left" :class="{'label-error': errors[number]['disability_group']['id']}">Группа нвалидности</h2>
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
                  :error="errors[number]['studyPlace']"
                />
              </article>

              <article class="child-data_table-group">
                <h2 class="form-heading child-data_heading">Адрес регистрации</h2>
                  <div class="child-data_addres">
                    <inputField
                      label="Город"
                      v-model="raw.registration_address.city"
                      :error="errors[number]['registration_address']['city']"
                    />
                    <inputField
                      label="Район"
                      v-model="raw.registration_address.district"
                      :error="errors[number]['registration_address']['district']"
                    />
                    <inputField
                      label="Улица"
                      v-model="raw.registration_address.street"
                      :error="errors[number]['registration_address']['street']"
                    />
                    <inputField
                      label="Дом"
                      v-model="raw.registration_address.house"
                      :error="errors[number]['registration_address']['house']"
                    />
                    <inputField
                      label="Номер квартиры"
                      v-model="raw.registration_flat"
                      :error="errors[number]['registration_flat']"
                    />
                  </div>
              </article>

              <article class="child-data_table-group">
                <h2 class="form-heading child-data_heading">Адрес проживания</h2>
                <div class="child-data_addres">
                  <inputField
                    label="Город"
                    v-model="raw.residence_address.city"
                    :error="errors[number]['residence_address']['city']"
                  />
                  <inputField
                    label="Район"
                    v-model="raw.residence_address.district"
                    :error="errors[number]['residence_address']['district']"
                  />
                  <inputField
                    label="Улица"
                    v-model="raw.residence_address.street"
                    :error="errors[number]['residence_address']['street']"
                  />
                  <inputField
                    label="Дом"
                    v-model="raw.residence_address.house"
                    :error="errors[number]['residence_address']['house']"
                  />
                  <inputField
                    label="Номер квартиры"
                    v-model="raw.residence_flat"
                    :error="errors[number]['residence_flat']"
                  />
                </div>
              </article>
            </article>

            <div class="buttons">
              <h2 class="form-heading"> {{ edit.message }} </h2>
              <p class="label-error"> {{ edit.error }} </p>
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
  .child:hover {
    cursor: pointer;
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

    border: 8px solid #0086c9;
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

  import {User} from '../../models/User';

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

        ovzTypes: ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
        disabilityTypes: ['', 'I', 'II', 'III'],
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
          error: ''
        },
        errors: []
      }
    },
    async created() {
      this.childrenRaw = await User.getChildren();

      //Создание массива, для отображения ошибок

      this.childrenRaw.map(child => {
          let raw = {};
          Object.keys(child).map(field => {
             const fieldValue = child[field];
             if (typeof fieldValue === 'object') {
                 Object.keys(fieldValue ?? {}).map(subfield => {
                     if (raw[field])
                        raw[field][subfield] = false;
                     else
                        raw[field] = { [subfield]: false };
                 });
             }
             else {
                 raw[field] = false;
             }
          });
          this.errors.push(raw);
      });
    },
    methods: {
      showData(id) {
        this.show.childData = id
      },

      editChild(id) {
          User.editMainData({...this.childrenRaw[id]}, id)
          .then(data => {
              this.edit.message = 'Данные отправлены успешно'
          })
          .catch(err => {
              if (err.msg)
                err.msg.map(el => {
                    // Если поймали ошибку для составного поля обрабатываем каждое
                    if (typeof el === 'object') {
                        Object.keys(el ?? {}).map(field => {
                            el[field].map(subfield => {
                                this.errors[id][field][subfield] = true;
                            });
                        });
                    }
                    else {
                        this.errors[id][el] = true;
                    }
                });
              this.edit.error = 'Ошибка заполнения формы';
          });
      },
      removeChild(id) {
          User.removeChild(id, this.remove.comment, false)
          .then(data => {
            this.remove.hidden = false
            this.remove.message = 'Запрос на удаление успешно отправлен'
          })
          .catch(err => {
            console.log(err)
            if (err.msg) {
              console.log('hi')
            }

            this.remove.message = 'Произошла ошибка('
          })
      },
    },
    computed: {
    }
  }
</script>
