<template>

<article v-if='data_loaded' class="card shadow">

  <article class="child-form">

    <h2 class="child-form_heading">Личные данные</h2>

    <div class="input-container">
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

    <div class="input-container child-form_span-2">
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
        label="Гражданство"
        v-model="data.state"
        :error="errors.state"
        :data_id="{name: 'state', group: 'extra'}"
        @change="_onedit"
    />
    <inputField
        label="Степень родства"
        v-model="data.relationship"
        :error="errors.relationship"
        :data_id="{name: 'relationship', group: 'extra'}"
        @change="_onedit"
    />

    <div class="child-form_span-2 child-form_select">
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

    <div class="child-form_span-2 child-form_select">
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
        label="Улица"
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

    <h2 class="child-form_heading">Адрес проживания</h2>
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
        label="Улица"
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
  </article>
  <div class="buttons wp100">
    <button class="dark-box dark-button register-button" @click="saveEditedData()">Сохранить</button>
  </div>
</article>

</template>

<script>
import {User} from '../../models/User'
import clone from 'clone'
import InputField from '../InputField.vue'
import MaskedInput from 'vue-masked-input'

export default {
  name: "UserExtraData",
  props: {
      user_id: {
          type: Number,
          default: 0,
      }
  },
  components: {
    InputField, MaskedInput
  },
  data() {
      return {
          ovzTypes: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
          disabilityTypes: ['I', 'II', 'III'],
          cards: [],
          clearData: {
          },
          data: {
          },
          dataOnEdit: {
              extra: {

              }
          },
          errors: {
          },
          errors_proto: {
          },
          data_loaded: false,
      }
  },
  methods: {
      setDataOnEdit(name, group, parent, value) {
          console.log(name, group, parent, value);
          if (parent) {
              this.dataOnEdit[group] = { [parent]: this.data[parent] };
              this.dataOnEdit[group][parent][name] = value;
          }
          else
              this.dataOnEdit[group][name] = value;
      },
      _onedit(event) {
          console.log(event);
          const input = event.path[0];
          const value = input.value;

          const data_id = JSON.parse(input.attributes.data_id.nodeValue);
          const name = data_id.name;
          const group = data_id.group;
          const parent = data_id.parent ?? false;

          if (this.clearData[name] === value)
              this.setDataOnEdit(name, group, parent, false);
          else
              this.setDataOnEdit(name, group, parent, value);
      },
      saveEditedData() {

          if (Object.keys(this.dataOnEdit.extra).length)
              User.editExtraData(this.dataOnEdit.extra);
      }
  },
  async created()
  {
      await User.getFullData().then(data => {
          this.data_loaded = true;
          this.data = clone(data.data);
          this.clearData = clone(data.data);
          this.errors_proto = clone(data.errors);
          this.errors = clone(data.errors);
      });
  }
}
</script>

<style scoped>

</style>
