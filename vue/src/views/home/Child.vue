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

          <article class="child-data" v-for="(child, id) in children" v-show="show.childData === id">
            <table class="child-data_table">
              <tbody class="child-data_table-group">
                <tr>
                  <td>
                    <inputField
                      label="Имя"
                      v-model="child.name"
                      :readonly="show.readonly"
                    />
                  </td>
                  <td>
                    <inputField
                      label="Фамилия"
                      v-model="child.surname"
                      :readonly="show.readonly"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <inputField
                      label="Отчество"
                      v-model="child.lastname"
                      :readonly="show.readonly"
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
                        :readonly="show.readonly"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <inputField
                      label="Номер свидетельства о рождении"
                      v-model="child.birth_certificate"
                      :readonly="show.readonly"
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
                      :readonly="show.readonly"
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
                        tabindex="4"
                        :readonly="show.readonly"
                        />
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
                          <input type="radio" v-model.number="child.sex" value="1" class="radio" tabindex="3" id="man" :disabled="readonly">
                          <label class="dark radio" for="man" tabindex="5">Мужской</label>
                        </div>
                        <div class="radio-container">
                          <input type="radio" v-model.number="child.sex" value="0" class="radio" tabindex="3" id="woman" :disabled="readonly">
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
                      :readonly="show.readonly"
                    />
                  </td>
                  <td>
                    <inputField
                      label="Степень родства"
                      v-model="child.relationship"
                      :readonly="show.readonly"
                    />
                  </td>
                </tr>
              </tbody>
              <tbody class="child-data_table-group">
                <tr>
                  <td>
                    <h2 class="form-heading left">ОВЗ</h2>
                    <select class="dark-box darken" v-model.number="child.ovz" :disabled="show.readonly">
                      <option value="0">Нету</option>
                      <option value="1">Есть</option>
                    </select>
                  </td>
                  <td v-if="child.ovz">
                    <h2 class="form-heading left">Тип ОВЗ</h2>
                    <select class="dark-box darken" v-model="child.ovz_type.id" :disabled="show.readonly">
                      <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h2 class="form-heading left">Инвалидность</h2>
                    <select class="dark-box darken" v-model.number="child.disability" :disabled="show.readonly">
                      <option value="0">Нету</option>
                      <option value="1">Есть</option>
                    </select>
                  </td>
                  <td v-if="child.disability">
                    <h2 class="form-heading left">Группа нвалидности</h2>
                    <select class="dark-box darken" v-model="child.disability_group.id" :disabled="show.readonly">
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
                      :readonly="show.readonly"
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
                        :readonly="show.readonly"
                      />
                      <inputField
                        label="Район"
                        v-model="childRaw.registration_address.district"
                        :readonly="show.readonly"
                      />
                      <inputField
                        label="Улица"
                        v-model="childRaw.registration_address.street"
                        :readonly="show.readonly"
                      />
                      <inputField
                        label="Дом"
                        v-model="childRaw.registration_address.house"
                        :readonly="show.readonly"
                      />
                      <inputField
                        label="Номер кваритиры"
                        v-model="child.registration_flat"
                        :readonly="show.readonly"
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
                        :readonly="show.readonly"
                      />
                      <inputField
                        label="Район"
                        v-model="childRaw.residence_address.district"
                        :readonly="show.readonly"
                      />
                      <inputField
                        label="Улица"
                        v-model="childRaw.residence_address.street"
                        :readonly="show.readonly"
                      />
                      <inputField
                        label="Дом"
                        v-model="childRaw.residence_address.house"
                        :readonly="show.readonly"
                      />
                      <inputField
                        label="Номер кваритиры"
                        v-model="child.residence_flat"
                        :readonly="show.readonly"
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
                    :readonly="show.readonly"
                  />
                </td>
              </tr>
            </table>
            <div class="buttons">
              <button class="dark-box dark-button" @="editChild(id)">Редактировать</button>
              <button class="light-box light-button" @="removeChild(id)">Удалить</button>
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
  }
  .child-data_table td {
    padding-right: 20px;
  }
  .child-data_table td:last-child {
    padding-right: 0;
  }
  .child-data_table-group {
    margin: 5px 0;
  }
  .child-data_input-row {
    display: grid;
    grid-template-columns: repeat(5, auto);
    grid-gap: 10px;
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

        childRaw: {
          phone: null,
          birthday: null,
          registration_address: {
            city: null,
            district: null,
            street: null,
            house: null,
          },
          residence_address: {
            city: null,
            district: null,
            street: null,
            house: null
          }
        },
        ovzTypes: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
        disabilityTypes: ['I', 'II', 'III'],
        show: {
          childData: 0,
          readonly: true
        },
      }
    },
    created() {
      let req = `
        query {
          getChildren {
            id, name, surname, phone, birthday, ovz
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

                  return el;
                });
            this.children = data.getChildren;
        })
        .catch(err => { console.log(err) })
    },
    methods: {
      addChild() {
        this.addChildShow = true

        let req = `
          mutation($child_id: Int) {
            addChild(child_id: $child_id)
          }
        `

        let data = {

        }
      },
      showData(id) {
        this.show.childData = id
      },
      eiditChild(id) {
        console.log('edit hi')
      },
      removeChild(id) {
        console.log('remove hi')
      }
    },
    computed: {

    }
  }
</script>
