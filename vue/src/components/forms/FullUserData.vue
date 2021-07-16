<template>

    <section v-if='data_loaded' class='child-form-wrapper card' :class='{shadow: independent}'>

        <article class="child-form">

            <h2 class="child-form_heading">Личные данные</h2>

            <inputField
                v-if='!hiddenFields.name'
                label="Имя"
                v-model="data.name"
                :error="errors.name"
                :data_id="{name: 'name', group: 'main'}"
                @change="_onedit"

            />
            <inputField
                v-if='!hiddenFields.surname'
                label="Фамилия"
                v-model="data.surname"
                :error="errors.surname"
                :data_id="{name: 'surname', group: 'main'}"
                @change="_onedit"

            />

            <inputField
                v-if='!hiddenFields.lastname'
                label="Отчество"
                v-model="data.lastname"
                :error="errors.lastname"
                :data_id="{name: 'lastname', group: 'main'}"
                @change="_onedit"

            />

            <div class="input-container" v-if='!hiddenFields.birthday'>
                <label class="label" :class="{'label-error': errors.birthday}">Дата рождения</label><br>
                <input
                    class="type"
                    :class="{'input-error': errors.birthday}"
                    type="date"
                    v-model="data.birthday"
                    :data_id="JSON.stringify({name: 'birthday', group: 'extra'})"
                    tabindex="1"
                    @change="_onedit"

                >
            </div>

            <inputField
                v-if='!hiddenFields.email'
                label="Электронная почта"
                v-model="data.email"
                :error="errors.email"
                :data_id="{name: 'email', group: 'main'}"
                @change="_onedit"

            />

            <div
                class="input-container required"
                v-if='!hiddenFields.phone'
                >
                <label class="label" v-bind:class="{'label-error': errors.phone}">Номер телефона</label><br>
                <masked-input
                    v-model="data.masked.phone"
                    mask="\+\7 (111) 111-11-11"
                    @input="data.phone = arguments[1]"
                    type="tel"
                    class="type"
                    :class="{'input-error': errors.phone}"
                    :data_id="JSON.stringify({name: 'phone', group: 'main'})"
                    tabindex="4"

                />
            </div>

            <div class="input-container child-form_span-2"
                v-if='!hiddenFields.sex'
                >
                <h3 class="radio-heading dark" :class="{'label-error': errors.sex}">Пол</h3>
                <ul class="radio-list" :class="{'input-error': errors.sex}">
                    <li class="radio-container">
                        <input type="radio"

                        @change="_onedit" v-model.number="data.sex" :data_id="JSON.stringify({name: 'sex', group: 'main'})" value="1" class="radio" tabindex="3" id="man">
                        <label class="dark radio" for="man" tabindex="5">Мужской</label>
                    </li>
                        <li class="radio-container">
                        <input type="radio"

                        @change="_onedit" v-model.number="data.sex" :data_id="JSON.stringify({name: 'sex', group: 'main'})" value="0" class="radio" tabindex="3" id="woman">
                        <label class="dark radio" for="woman" tabindex="6">Женский</label>
                    </li>
                </ul>
            </div>

            <inputField
                v-if='!hiddenFields.state'
                label="Гражданство"
                v-model="data.state"
                :error="errors.state"
                :data_id="{name: 'state', group: 'extra'}"
                @change="_onedit"

            />
            <div
                v-if='!hiddenFields.relationship'
                >
                <inputField
                    label="Степень родства"
                    v-model="data.relationship"
                    :error="errors.relationship"
                    :data_id="{name: 'relationship', group: 'extra'}"
                    @change="_onedit"
                    style="{margin: 0}"

                >
                    <template v-slot:prompt>
                        <div class="input-prompt">
                            <span @click="autoRelationship('Родитель')">Родитель</span>
                            <span @click="autoRelationship('Законный представитель')">Законный представитель</span>
                        </div>
                    </template>
                </inputField>
            </div>

          <div class="child-form_span-2 child-form_select"
              v-if='!hiddenFields.ovz'
              >
            <div>
              <h2 class="child-form_select-heading" :class="{'label-error': errors.ovz}">ОВЗ</h2>
              <select class="dark-box darken"

              @change="_onedit" v-model.number="data.ovz" :data_id="JSON.stringify({name: 'ovz', group: 'extra'})" >
                <option value="0">Нет</option>
                <option value="1">Есть</option>
              </select>
            </div>
            <div v-if="data.ovz">
              <h2 class="child-form_select-heading" :class="{'label-error': errors.ovz_type}">Тип ОВЗ</h2>
              <select class="dark-box darken"

              @change="_onedit" v-model="data.ovz_type.id" :data_id="JSON.stringify({name: 'ovz_type', group: 'extra'})" >
                <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
              </select>
            </div>
          </div>

          <div class="child-form_span-2 child-form_select"
              v-if='!hiddenFields.disability'
              >
            <div>
              <h2 class="child-form_select-heading" :class="{'label-error': errors.disability}">Инвалидность</h2>
              <select class="dark-box darken"

              @change="_onedit" v-model.number="data.disability" :data_id="JSON.stringify({name: 'disability', group: 'extra'})">
                <option value="0">Нет</option>
                <option value="1">Есть</option>
              </select>
            </div>

            <div v-show="data.disability">
              <h2 class="child-form_select-heading" :class="{'label-error': errors.disability_group}">Группа нвалидности</h2>
              <select class="dark-box darken"

              @change="_onedit" v-model="data.disability_group.id" :data_id="JSON.stringify({name: 'disability_group', group: 'extra'})">
                <option v-for="(type, id) in disabilityTypes" :value="id">{{ type }}</option>
              </select>
            </div>
          </div>

          <inputField
              v-if='!hiddenFields.studyPlace'
              label="Образовательное учреждение (наименование)"
              v-model="data.studyPlace"
              type="text"
              :error="errors.studyPlace"
              class="child-form_span-2"
              :data_id="{name: 'studyPlace', group: 'extra'}"
              @change.native="_onedit"

          />
          <div class="child-data_row">
            <!--
            <div>
              <inputField
                label="Класс \ группа"
                v-model="data.class"
                type="text"
              />
            </div>
            !-->
          </div>
          <template
              v-if='!hiddenFields.registration'
              >
              <h2 class="child-form_heading">Адрес регистрации</h2>
              <inputField
                  label="Город"
                  v-model="data.registration_address.city"
                  :error="errors.registration_address.city"
                  :data_id="{name: 'city', group: 'extra', parent: 'registration_address'}"
                  @change="_onedit"

              />
              <inputField
                  label="Район"
                  v-model="data.registration_address.district"
                  :error="errors.registration_address.district"
                  :data_id="{name: 'district', group: 'extra', parent: 'registration_address'}"
                  @change="_onedit"

              />
              <inputField
                  label="Улица / Проспект"
                  v-model="data.registration_address.street"
                  :error="errors.registration_address.street"
                  :data_id="{name: 'street', group: 'extra', parent: 'registration_address'}"
                  @change="_onedit"

              />
              <inputField
                  label="Дом"
                  v-model="data.registration_address.house"
                  :error="errors.registration_address.house"
                  :data_id="{name: 'house', group: 'extra', parent: 'registration_address'}"
                  @change="_onedit"

              />
              <inputField
                  label="Номер квартиры"
                  v-model="data.registration_flat"
                  :error="errors.registration_flat"
                  :data_id="{name: 'registration_flat', group: 'extra'}"
                  @change="_onedit"

              />
          </template>

          <template
              v-if='!hiddenFields.residence'
              >
              <h2 class="child-form_heading">Адрес проживания</h2>
                <div class="input-prompt">
                    <span @click="autoResidenceAddress()">По адресу регистрации</span>
                </div>
                <br>
              <inputField
                  label="Город"
                  v-model="data.residence_address.city"
                  :error="errors.residence_address.city"
                  :data_id="{name: 'city', group: 'extra', parent: 'residence_address'}"
                  @change="_onedit"
              />
              <inputField
                  label="Район"
                  v-model="data.residence_address.district"
                  :error="errors.residence_address.district"
                  :data_id="{name: 'district', group: 'extra', parent: 'residence_address'}"
                  @change="_onedit"
              />
              <inputField
                  label="Улица / Проспект"
                  v-model="data.residence_address.street"
                  :error="errors.residence_address.street"
                  :data_id="{name: 'street', group: 'extra', parent: 'residence_address'}"
                  @change="_onedit"
              />
              <inputField
                  label="Дом"
                  v-model="data.residence_address.house"
                  :error="errors.residence_address.house"
                  :data_id="{name: 'house', group: 'extra', parent: 'residence_address'}"
                  @change="_onedit"
              />
              <inputField
                  label="Номер квартиры"
                  v-model="data.residence_flat"
                  :error="errors.residence_flat"
                  :data_id="{name: 'residence_flat', group: 'extra'}"
                  @change="_onedit"
              />
          </template>
        </article>

        <h2 class="form-heading"> {{ message }} </h2>

        <br v-if='message.length' />

        <div class="buttons wp100">
          <button class="dark-box dark-button register-button" @click="saveEditedData()">Сохранить</button>
        </div>
    </section>


</template>

<script>
import {User} from '../../models/User'
import clone from 'clone'
import InputField from '../InputField.vue'
import MaskedInput from 'vue-masked-input'

export default {
  name: "FullUserData",
  props: {
      input: {
          type: String,
          default: '',
      },
      independent: {
          type: Boolean,
          default: false
      },
      hidden: {
          type: String,
          default: '',
      },
      readonly: {
          type: Boolean,
          default: false,
      }
  },
  components: {
    InputField, MaskedInput
  },
  data() {
      return {
          ovzTypes: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
          disabilityTypes: ['I', 'II', 'III'],
          masked: {
            phone: null,
            birthday: null,
          },
          cards: [],
          clearData: {
          },
          data: {
          },
          dataOnEdit: {
              main: {

              },
              extra: {

              }
          },
          errors: {
          },
          errors_proto: {
          },
          data_loaded: false,
          message: "",
          target_id: 0,
          hiddenFields: {

          }
      }
  },
  methods: {
      setDataOnEdit(name, group, parent, value) {
          console.log(name, group, parent, value);
          if (parent) {
              this.dataOnEdit[group] = { ...this.dataOnEdit[group], [parent]: this.data[parent] };
              this.dataOnEdit[group][parent][name] = value;
          }
          else
              this.dataOnEdit[group][name] = value;
      },
      autoRelationship(str) {
          if (this.data.relationship == str)
            return;
          this.data.relationship = str;
          this.setDataOnEdit('relationship', 'extra', false, str);
      },
      autoResidenceAddress() {
          Object.keys(this.data.residence_address).map(key => {
              const newValue = this.data.registration_address[key];
              if (this.data.residence_address[key] !== newValue) {
                  this.data.residence_address[key] = newValue;
                  this.setDataOnEdit(key, "extra", "residence_address", newValue);
              }
          });

          if (this.data.residence_flat !== this.data.registration_flat) {
              this.data.residence_flat = this.data.registration_flat;
              this.setDataOnEdit("residence_flat", "extra", false, this.data.registration_flat);
          }
      },
      formErrorParser(err) {
          this.errors = clone(this.errors_proto);
          console.log(err);
          if (err.length)
            err.map(el => {
                // Если поймали ошибку для составного поля обрабатываем каждое
                if (typeof el === 'object') {
                    Object.keys(el ?? {}).map(field => {
                        el[field].map(subfield => {
                            this.errors[field][subfield] = true;
                        });
                    });
                }
                else {
                    this.errors[el] = true;
                }
            });
      },
      _onedit(event) {
          console.log(11, event);
          let input;
          if (event.path)
            input = event.path[0];
          else
            input = event.originalTarget;
          const value = input.value;

          const data_id = JSON.parse(input.attributes.data_id.nodeValue);
          const name = data_id.name;
          const group = data_id.group;
          const parent = data_id.parent ?? false;

          console.log(name);
          console.log(this.clearData);

          if (this.clearData[name] === value)
              this.setDataOnEdit(name, group, parent, false);
          else
              this.setDataOnEdit(name, group, parent, value);

          console.log(this.dataOnEdit);
      },
      saveEditedData() {
          if (this.data.phone !== this.clearData.phone) {
              this.setDataOnEdit('phone', 'main', false, this.data.phone);
          }

          if (Object.keys(this.dataOnEdit.main).length)
              User.editMainData(this.dataOnEdit.main, this.target_id)
              .then(data => { this.message = "Изменения успешно отправлены в обработку!"; })
              .catch(err => this.formErrorParser(err));
          if (Object.keys(this.dataOnEdit.extra).length)
              User.editExtraData(this.dataOnEdit.extra, this.target_id)
              .then(data => { this.message = "Изменения успешно отправлены в обработку!"; })
              .catch(err => this.formErrorParser(err));
      },
  },
  async created()
  {
      if (this.hidden.length != 0) {
            this.hiddenFields = JSON.parse(this.hidden);
      }

      if (this.input.length == 0) {

          await User.getFullData().then(data => {
              this.data_loaded = true;
              this.data = clone(data.data);
              this.clearData = clone(data.data);
              this.errors_proto = clone(data.errors);
              this.errors = clone(data.errors);
          });

      }
      else {
          const input = JSON.parse(this.input);
          console.log(input);
          if (input.data) {
              this.target_id = Number(input.data.id);
              this.data_loaded = true;
              this.data = clone(input.data);
              this.clearData = clone(input.data);
              this.errors_proto = clone(input.errors);
              this.errors = clone(input.errors);
          }
          else {
              this.data_loaded = true;
              this.data = clone(input);
          }

      }
  }
}
</script>

<style scoped>

</style>
