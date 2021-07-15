<template>
    <main class="home">
        <navigation />

        <article class="home-content">
            <section class="card shadow">
                <h1 class="main-heading">Добро пожаловать</h1>
                <button class="dark-box dark-button" @click='logout()'>Выйти</button>
            </section> 
            <section class="content">
                
                <FullUserData :hidden="JSON.stringify(userHiddenFields)" :independent="true"></FullUserData>

                <article class="card shadow child-form-wrapper" v-if="true">

                  <article class="child-form">

                    <h2 class="child-form_heading">Данные на редактировании</h2>

                    <inputField
                        label="Имя"
                        v-model="onEditData.name"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('name') }} <span class="experemental-popup"><span>?</span></span></p>
                        </template>
                    </inputField>
                    <inputField
                        label="Фамилия"
                        v-model="onEditData.surname"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('surname') }}</p>
                        </template>
                    </inputField>

                    <inputField
                        label="Отчество"
                        v-model="onEditData.lastname"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('lastname') }}</p>
                        </template>
                    </inputField>

                    <inputField
                        label="Электронная почта"
                        v-model="onEditData.email"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('email') }}</p>
                        </template>
                    </inputField>

                    <div class="input-container required">
                      <label class="label">Номер телефона</label><br>
                      <masked-input
                          v-model="masked.phone"
                          mask="\+\7 (111) 111-11-11"
                          @input="onEditData.phone = arguments[1]"
                          type="tel"
                          class="type"
                          tabindex="4"
                          :readonly="true"
                      />
                      <p> {{showDate('phone')}} </p>
                    </div>

                    <div class="input-container child-form_span-2">
                      <h3 class="radio-heading dark">Пол</h3>
                      <ul class="radio-list">
                        <li class="radio-container">
                          <input type="radio" v-model.number="onEditData.sex" value="1" class="radio" tabindex="3" id="1man" disabled>
                          <label class="dark radio" for="1man" tabindex="5">Мужской</label>
                        </li>
                        <li class="radio-container">
                          <input type="radio" v-model.number="onEditData.sex" value="0" class="radio" tabindex="3" id="2woman" disabled>
                          <label class="dark radio" for="2woman" tabindex="6">Женский</label>
                        </li>
                      </ul>
                    </div>

                    <inputField
                        label="Гражданство"
                        v-model="onEditData.state"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('state') }}</p>
                        </template>
                    </inputField>

                    <div>
                    </div>

                    <h2 class="child-form_heading">Адрес регистрации</h2>
                    <inputField
                        label="Город"
                        v-model="onEditData.registration_address.city"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('registration_address.city') }}</p>
                        </template>
                    </inputField>
                    <inputField
                        label="Район"
                        v-model="onEditData.registration_address.district"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('registration_address.district') }}</p>
                        </template>
                    </inputField>
                    <inputField
                        label="Улица"
                        v-model="onEditData.registration_address.street"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('registration_address.street') }}</p>
                        </template>
                    </inputField>
                    <inputField
                        label="Дом"
                        v-model="onEditData.registration_address.house"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('registration_address.house') }}</p>
                        </template>
                    </inputField>
                    <inputField
                        label="Номер квартиры"
                        v-model="onEditData.registration_flat"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('registration_flat') }}</p>
                        </template>
                    </inputField>

                    <h2 class="child-form_heading">Адрес проживания</h2>
                    <inputField
                        label="Город"
                        v-model="onEditData.residence_address.city"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('residence_address.city') }}</p>
                        </template>
                    </inputField>
                    <inputField
                        label="Район"
                        v-model="onEditData.residence_address.district"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('residence_address.district') }}</p>
                        </template>
                    </inputField>
                    <inputField
                        label="Улица"
                        v-model="onEditData.residence_address.street"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('residence_address.street') }}</p>
                        </template>
                    </inputField>
                    <inputField
                        label="Дом"
                        v-model="onEditData.residence_address.house"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('residence_address.house') }}</p>
                        </template>
                    </inputField>
                    <inputField
                        label="Номер квартиры"
                        v-model="onEditData.residence_flat"
                        :readonly="true"
                    >
                        <template v-slot:prompt>
                            <p>{{ showDate('residence_flat') }}</p>
                        </template>
                    </inputField>

                    <br>
                  </article>
                </article>
            </section>

        </article>
    </main>
</template>

<style scoped>
.home-content {
    padding: 30px;
}
.main-heading {
    font-size: 1.5rem;
    color: #142732;
    margin-bottom: 20px;
}
.content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    justify-items: center;
}
.experemental-popup {
    position: relative;
    display: inline-block;
    font-size: 13px;
    height: 13px;
    width: 13px;
    padding: 1px;
    color: #8e8e8e;
    border: 2px solid #8e8e8e;
    border-radius: 50%;
}
.experemental-popup span {
    display: flex;
    justify-content: center;
    align-items: center;
}
.experemental-popup:hover {
    user-select: none;
}
.experemental-popup:hover::after {
    content: 'Дата изменения';
    position: absolute;
    top:  0;
    left: 20px;
    display: block;
    width: 50px;
    white-space: nowrap;
    color: #8e8e8e;
    font-size: 15px;
}
</style>

<script>
  // @ is an alias to /src
  import navigation from '../components/Navigation.vue'
  import FullUserData from '../components/forms/FullUserData'
  import {AccessControl} from '../utils/AccessControl'
  import {User} from '../models/User'
  import {Parser} from '../utils/Parser'
  import AppConfig from '../config/AppConfig'
  import MaskedInput from 'vue-masked-input'
  import InputField from '../components/InputField'


  export default {
    name: 'Home',
    components: {
      navigation, FullUserData, MaskedInput, InputField
    },
    data() {
        return {
            cards: [],
            userHiddenFields: {},
            masked: {
                phone: null,
                birthday: null
            },
            onEditData: {
                name: null,
                surname: null,
                lastname: null,
                email: null,
                phone: null, //mask
                sex: null,

                birthday: null, //mask

                state: null,

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
            onEditDataDate: {
                name: null,
                surname: null,
                lastname: null,
                email: null,
                phone: null, //mask
                sex: null,

                birthday: null, //mask

                state: null,

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
            }
        }
    },
    methods: {
        logout: () => AccessControl.logout(),
        showDate(key) {
            if (this.onEditDataDate[key] !== null) {
                if (key.indexOf('.') !== -1) {
                    const keys = key.split('.');
                    const key1 = keys[0];
                    const key2 = keys[1];
                    console.log(11, this.onEditDataDate[key1])
                    if (this.onEditDataDate[key1][key2] !== null) {
                        return this.onEditDataDate[key1][key2].day + '.' + this.onEditDataDate[key1][key2].month + '.' + this.onEditDataDate[key1][key2].year                        
                    }
                } else {
                    return this.onEditDataDate[key].day + '.' + this.onEditDataDate[key].month + '.' + this.onEditDataDate[key].year
                }
            }
        }
    },
    async created() {
        User.getDataOnEdit().then(data => {
            console.log(13, data)
            data.map(el => {
                this.onEditData[el.field] = el.new_value 
                this.onEditDataDate[el.field] = Parser.timestampToObj(el.timestamp)
                if (el.field = 'phone') {
                    this.masked.phone = el.new_value
                }   
            })
        });
        if (AccessControl.checkRole(AppConfig.parent_role_id)) {
            this.userHiddenFields = {
                relationship: true,
                ovz: true,
                disability: true,
                birthday: true,
                studyPlace: true,
            };
        }
    }
  }
</script>
