<template>
  <main class="home">
      <navigation />

      <div class="home-content">
        <section v-if="parentRequests.length > 0">

          <article class="card shadow" v-for="(req, id) in parentRequests">
            <h1 class="form-heading">{{req.surname}} {{req.name}}</h1>
            <p>{{ req.phone }}</p>
            <p>Хочет стать вашим родителем</p>
            <section v-if="show.needData">
              <article class="child-data_table-group">
                <div>
                  <inputField
                      label="Номер свидетельства о рождении"
                      v-model="childRaw.birth_certificate"
                  />
                </div>
              </article>

              <article class="child-data_table-group">
                <div class="child-data_row">
                  <div>
                    <inputField
                        label="Гражданство"
                        v-model="childRaw.state"
                    />
                  </div>
                  <div>
                    <inputField
                        label="Степень родства"
                        v-model="childRaw.relationship"
                    />
                  </div>
                </div>
              </article>

              <article class="child-data_table-group">
                <div class="child-data_row">
                  <div :class="{'input-error': false}">
                    <h2 class="form-heading child-data_heading" :class="{'label-error': false}">ОВЗ</h2>
                    <select class="dark-box darken" v-model.number="childRaw.ovz">
                      <option value="0">Нет</option>
                      <option value="1">Есть</option>
                    </select>
                  </div>
                  <div v-if="childRaw.ovz" :class="{'input-error': false}">
                    <h2 class="form-heading child-data_heading" :class="{'label-error': false}">Тип ОВЗ</h2>
                    <select class="dark-box darken" v-model="childRaw.ovz_type.id" >
                      <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
                    </select>
                  </div>
                </div>

                <div class="child-data_row">
                  <div :class="{'input-error': false}">
                    <h2 class="form-heading child-data_heading" :class="{'label-error': false}">Инвалидность</h2>
                    <select class="dark-box darken" v-model.number="childRaw.disability" >
                      <option value="0">Нет</option>
                      <option value="1">Есть</option>
                    </select>
                  </div>
                  <div v-if="childRaw.disability" :class="{'input-error': false}">
                    <h2 class="form-heading child-data_heading" :class="{'label-error': false}">Группа нвалидности</h2>
                    <select class="dark-box darken" v-model="childRaw.disability_group.id" >
                      <option v-for="(type, id) in disabilityTypes" :value="id">{{ type }}</option>
                    </select>
                  </div>
                </div>
              </article>

              <article class="child-data_table-group">
                <inputField
                    label="Образовательное учреждение"
                    v-model="childRaw.studyPlace"
                    type="text"
                />
              </article>

              <article class="child-data_table-group">
                <h2 class="form-heading child-data_heading">Адрес регистрации</h2>
                <div class="child-data_addres">
                  <inputField
                      label="Город"
                      v-model="childRaw.registration_address.city"
                  />
                  <inputField
                      label="Район"
                      v-model="childRaw.registration_address.district"
                  />
                  <inputField
                      label="Улица"
                      v-model="childRaw.registration_address.street"
                  />
                  <inputField
                      label="Дом"
                      v-model="childRaw.registration_address.house"
                  />
                  <inputField
                      label="Номер квартиры"
                      v-model="childRaw.registration_flat"
                  />
                </div>
              </article>

              <article class="child-data_table-group">
                <h2 class="form-heading child-data_heading">Адрес проживания</h2>
                <div class="child-data_addres">
                  <inputField
                      label="Город"
                      v-model="childRaw.residence_address.city"
                  />
                  <inputField
                      label="Район"
                      v-model="childRaw.residence_address.district"
                  />
                  <inputField
                      label="Улица"
                      v-model="childRaw.residence_address.street"
                  />
                  <inputField
                      label="Дом"
                      v-model="childRaw.residence_address.house"
                  />
                  <inputField
                      label="Номер квартиры"
                      v-model="childRaw .residence_flat"
                  />
                </div>
              </article>

            </section>
            <button v-if="!show.needData" class="dark-box dark-button" @click="showNeedData">Принять</button>

            <button v-if="show.needData" class="dark-box dark-button" @click="accept(id)">Принять</button>
            <button class="light-box light-button" @click="cancell(id)">Отклонить</button>
          </article>
        </section>
      </div>
  </main>
</template>

<style scoped>
  .home-content {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 10px;
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
</style>

<script>
  import navigation from '../../components/Navigation.vue'
  import {User} from '../../models/User';
  import InputField from "../../components/InputField";

  export default {
    name: 'Child',
    components: {
      navigation, InputField
    },
    data() {
      return {
        parentRequests: [],
        needData: {

        },
        childRaw: {
          name: null,
          surname: null,
          lastname: null,
          email: null,
          phone: null, //mask
          sex: null,
          password: null,

          birthday: null, //mask
          birth_certificate: null,

          state: null,
          relationship: null,
          studyPlace: null,
          ovz: null,
          ovz_type: { id: null },
          disability: null,
          disability_group: { id: null },

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
        ovzTypes: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
        disabilityTypes: ['I', 'II', 'III'],
        show: {
          needData: false
        }
      }
    },
    async created() {
      const requests = await User.getParentRequests().then(data => data).catch(err => console.error(err));

      this.parentRequests = requests;
    },
    methods: {
      showNeedData() {
        this.show.needData = true
      },
      accept(id) {
          console.log(this.parentRequest[id])
          User.agreeParentRequest(id).then(data => {
              console.log(data);
          }).catch(err => {
              if (err.msg) {
                  console.log(err.msg);
              }
              else if (err.response) {
                  const msg = getError(err);
              }
          });
      },
      cancell(id) {

      }
    }
  }
</script>
