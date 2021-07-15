<template>

    <section v-if='data_loaded' class='child-form-wrapper card' :class='{shadow: independent}'>

        <article class="child-form">

            <h2 class="child-form_heading">Данные на редактировании</h2>

            <inputField
                v-if='!hiddenFields.name'
                label="Имя"
                v-model="data.name"
                :readonly="true"
            />
            <inputField
                v-if='!hiddenFields.surname'
                label="Фамилия"
                v-model="data.surname"
                :readonly="true"
            />

            <inputField
                v-if='!hiddenFields.lastname'
                label="Отчество"
                v-model="data.lastname"
                :readonly="true"
            />

            <div class="input-container" v-if='!hiddenFields.birthday'>
                <label class="label">Дата рождения</label><br>
                <input
                    class="type"
                    type="date"
                    v-model="data.birthday"
                    tabindex="1"
                    :readonly="true"
                >
            </div>

            <inputField
                v-if='!hiddenFields.email'
                label="Электронная почта"
                v-model="data.email"
                :readonly="true"
            />

            <div
                class="input-container required"
                v-if='!hiddenFields.phone'
                >
                <label class="label">Номер телефона</label><br>
                <masked-input
                    v-model="data.masked.phone"
                    mask="\+\7 (111) 111-11-11"
                    @input="data.phone = arguments[1]"
                    type="tel"
                    class="type"
                    tabindex="4"
                    :readonly="true"
                />
            </div>

            <div class="input-container child-form_span-2"
                v-if='!hiddenFields.sex'
                >
                <h3 class="radio-heading dark">Пол</h3>
                <ul class="radio-list">
                    <li class="radio-container">
                        <input type="radio"
                        :readonly="true" v-model.number="data.sex" value="1" class="radio" tabindex="3" id="man">
                        <label class="dark radio" for="man" tabindex="5">Мужской</label>
                    </li>
                        <li class="radio-container">
                        <input type="radio"
                        :readonly="true" v-model.number="data.sex" value="0" class="radio" tabindex="3" id="woman">
                        <label class="dark radio" for="woman" tabindex="6">Женский</label>
                    </li>
                </ul>
            </div>

            <inputField
                v-if='!hiddenFields.state'
                label="Гражданство"
                v-model="data.state"
                :readonly="true"
            />
            <div
                v-if='!hiddenFields.relationship'
                >
                <inputField
                    label="Степень родства"
                    v-model="data.relationship"
                    :readonly="true"
                    style="{margin: 0}"
                >
                    <template v-slot:prompt>
                        <div class="input-prompt">
                            <span @click="data.relationship = 'Родитель'">Родитель</span>
                            <span @click="data.relationship = 'Законный представитель'">Законный представитель</span>
                        </div>
                    </template>
                </inputField>
            </div>

          <div class="child-form_span-2 child-form_select"
              v-if='!hiddenFields.ovz'
              >
            <div>
              <h2 class="child-form_select-heading">ОВЗ</h2>
              <select class="dark-box darken"
              :readonly="true" v-model.number="data.ovz" >
                <option value="0">Нет</option>
                <option value="1">Есть</option>
              </select>
            </div>
            <div v-if="data.ovz">
              <h2 class="child-form_select-heading">Тип ОВЗ</h2>
              <select class="dark-box darken"
              :readonly="true" v-model="data.ovz_type.id">
                <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
              </select>
            </div>
          </div>

          <div class="child-form_span-2 child-form_select"
              v-if='!hiddenFields.disability'
              >
            <div>
              <h2 class="child-form_select-heading">Инвалидность</h2>
              <select class="dark-box darken"
              :readonly="true" v-model.number="data.disability">
                <option value="0">Нет</option>
                <option value="1">Есть</option>
              </select>
            </div>

            <div v-show="data.disability">
              <h2 class="child-form_select-heading">Группа нвалидности</h2>
              <select class="dark-box darken"
              :readonly="true" v-model="data.disability_group.id">
                <option v-for="(type, id) in disabilityTypes" :value="id">{{ type }}</option>
              </select>
            </div>
          </div>

          <inputField
              v-if='!hiddenFields.studyPlace'
              label="Образовательное учреждение (наименование)"
              v-model="data.studyPlace"
              type="text"
              class="child-form_span-2"
              :readonly="true"
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
                  :readonly="true"
              />
              <inputField
                  label="Район"
                  v-model="data.registration_address.district"
                  :readonly="true"
              />
              <inputField
                  label="Улица / Проспект"
                  v-model="data.registration_address.street"
                  :readonly="true"
              />
              <inputField
                  label="Дом"
                  v-model="data.registration_address.house"
                  :readonly="true"
              />
              <inputField
                  label="Номер квартиры"
                  v-model="data.registration_flat"
                  :readonly="true"
              />
          </template>

          <template
              v-if='!hiddenFields.residence'
              >
              <h2 class="child-form_heading">Адрес проживания</h2>
              <inputField
                  label="Город"
                  v-model="data.residence_address.city"
                  :readonly="true"
              />
              <inputField
                  label="Район"
                  v-model="data.residence_address.district"
                  :readonly="true"
              />
              <inputField
                  label="Улица / Проспект"
                  v-model="data.residence_address.street"
                  :readonly="true"
              />
              <inputField
                  label="Дом"
                  v-model="data.residence_address.house"
                  :readonly="true"
              />
              <inputField
                  label="Номер квартиры"
                  v-model="data.residence_flat"
                  :readonly="true"
              />
          </template>
        </article>
    </section>


</template>

<script>
import {User} from '../../models/User'
import clone from 'clone'
import InputField from '../InputField.vue'
import MaskedInput from 'vue-masked-input'

export default {
  name: "FullUserDataReadOnly",
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
          data: {
          },
          data_loaded: false,
          hiddenFields: {

          }
      }
  },
  methods: {
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
          });

      }
      else {
          const input = JSON.parse(this.input);
          console.log(input);

          if (input.data)
              this.data = clone(input.data);
          else
              this.data = clone(input);

          this.data_loaded = true;

      }
  }
}
</script>

<style scoped>

</style>
