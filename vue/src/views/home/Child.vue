<template>
    <main class="home">
        <navigation />
        <article class="home-content">

            <section class="children">
                <section class="card child shadow" v-for="(raw, number) in childrenRaw" @click="showData(number)">
                    <div class="child_heading">
                        <h2 class="child-name">{{ raw.data.name + ' ' + raw.data.surname }}</h2>
                        <button class="dark-box dark-button to-associations" @click="toAssociations(raw.data.id)" >Запись</button>
                    </div>
                    <span class="child-to-data"
                    :class="{'child-from-data': number === show.childData}"
                    ></span>
                </section>

                <router-link to="/child/add" class="dark-box dark-button child-add"><span class="child-add_plus">&#43; </span>Добавить ребёнка</router-link>
            </section>

            <section class="child-form-wrapper card shadow" v-show="childrenRaw.length > 0">
                <article class="child-data" v-for="(raw, number) in childrenRaw" v-show="show.childData === number">

                    <FullUserData :input='JSON.stringify(raw)' ></FullUserData>

                    <h2 class="form-heading"> {{ edit.message }} </h2>
                    <p class="label-error"> {{ edit.error }} </p>

                    <article >
                        <h2 class="form-heading"> {{ remove.message }} </h2>
                        <template v-if="remove.hidden">
                            <inputField
                                label="Комментарий к удалению"
                                v-model="remove.comment"
                            />

                            <ul class="radio-list">
                                <li class="radio-container">
                                    <input type="radio" v-model="remove.onlyUnLink" :value="true" class="radio" id="removeDelet">
                                    <label class="dark radio" for="removeDelet">Удалить</label>
                                </li>
                                <li class="radio-container">
                                    <input type="radio" v-model="remove.onlyUnLink" :value="false" class="radio" id="removeOnlyUnLink">
                                    <label class="dark radio" for="removeOnlyUnLink">Отвязать, но не удалять</label>
                                </li>
                                <!-- TODO: добавить тултип !-->
                            </ul>
                        </template>
                    </article>

                    <div class="buttons">
                        <button class="light-box light-button" v-if="!remove.hidden" @click="remove.hidden = true">Удалить</button>
                        <button class="light-box light-button" v-if="remove.hidden" @click="removeChild(Number(raw.data.id))">Удалить</button>
                    </div>
                </article>

            </section>

        </article>
    </main>
</template>

<style scoped>
.home-content {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 10px;
    padding: 30px 30px;
}
.children {
    display: flex;
    flex-direction: column;
}
.children-data {
    padding: 60px;
}
.child {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 15px;
}
.child:hover {
    cursor: pointer;
}
.child_heading {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.child-name {
    margin: 0;
    color: #142732;
    align-self: center;
}

.to-associations {
    margin: 20px;
    color: #3e91b1;
    background-color: #fff;
    transition: 0.3s;
}
.child:hover .to-associations {
    opacity: 100%;
    color: #fff;
    background-color: #0086c9;
}

.child-to-data {
    margin-left: 10px;
    transition: 0.3s;
    align-self: center;
}
.child-to-data::after {
    content: '';
    display: block;
    width: 0px;
    height: 0px;

    border: 10px solid #0086c9;
    border-top-color: rgba(0,0,0,0);
    border-bottom-color: rgba(0,0,0,0);
    border-left-style: none;
    opacity: 20%;
    transition: transform 0.3s ease-out;
}
.child:hover .child-to-data::after {
    transform: translateX(10px);
}
.child-from-data::after {
    border: 10px solid #0086c9;
    border-top-color: rgba(0,0,0,0);
    border-bottom-color: rgba(0,0,0,0);

    border-left-style: solid;
    border-right-style: none;

    opacity: 100%;
}
.child-add {
    align-self: center;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.child-add_plus {
    font-size: 25px;
    margin: 0 10px 0 0;
}


.buttons {
    margin-top: 30px;
}
</style>

<script>
  import navigation from '../../components/Navigation.vue'
  import inputField from '../../components/InputField.vue'
  import MaskedInput from 'vue-masked-input'
  import FullUserData from '../../components/forms/FullUserData'

  import {User} from '../../models/User';

  export default {
    name: 'Child',
    components: {
      navigation, inputField, MaskedInput, FullUserData
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
          onlyUnLink: null,
          message: '',
          hidden: false,
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
      console.log(this.childrenRaw);
    },
    methods: {
      showData(id) {
        this.show.childData = id
      },
      removeChild(id) {
          if (this.remove.comment == null || this.remove.comment == "") {
              this.remove.message = "Укажите причину удаления!";
              return;
          }
          if (this.remove.onlyUnLink == null) {
              this.remove.onlyUnLink = false;
          }
          User.removeChild(id, this.remove.comment, this.remove.onlyUnLink)
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
      toAssociations(id) {
        localStorage.setItem('childInAssociations', id);
        window.location = 'child/association';
        console.log(localStorage.getItem('childInAssociations'))
      }

    },
    computed: {
    }
  }
</script>
