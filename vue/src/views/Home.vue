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
                <template v-if='onEditLoaded'>
                    <FullUserDataReadOnly :input="JSON.stringify(dataOnEdit)" :hidden="JSON.stringify(userHiddenFields)" :independent="true"></FullUserDataReadOnly>
                </template>
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
  import FullUserDataReadOnly from '../components/forms/FullUserDataReadOnly'
  import {AccessControl} from '../utils/AccessControl'
  import {User} from '../models/User'
  import {Parser} from '../utils/Parser'
  import AppConfig from '../config/AppConfig'
  import MaskedInput from 'vue-masked-input'
  import InputField from '../components/InputField'
  import clone from 'clone'

  export default {
    name: 'Home',
    components: {
      navigation, FullUserData, MaskedInput, InputField, FullUserDataReadOnly
    },
    data() {
        return {
            cards: [],
            userHiddenFields: {},
            dataOnEdit: {
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

                ovz: null,
                ovz_type: {
                    id: null
                },
                disability: null,
                disability_group: {
                    id: null,
                },

            },
            onEditLoaded: false,
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
            data.map(el => {
                this.dataOnEdit[el.field] = (typeof el.new_value === 'Object') ? clone(el.new_value) : el.new_value;
            });
            this.dataOnEdit.masked = {
                phone: this.dataOnEdit.phone ?? "",
                birthday: this.dataOnEdit.phone ?? "",
            }
            console.log(this.dataOnEdit);
            this.onEditLoaded = true;
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
