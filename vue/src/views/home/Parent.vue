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
                <h2>Заполните недостающие данные:</h2>
                <article class="child-data_table">
                    <article class="child-data_table-group">
                        <div>
                            <div class="input-container">
                            <label class="label" v-bind:class="{'label-up': child.birthday}">Дата рождения</label><br>
                            <input
                              class="type"
                              type="date"
                              v-model="child.birthday"
                              :class="{'input-error': errors['birthday']}"
                            >
                            </div>
                        </div>
                    </article>

                  <article class="child-data_table-group">
                    <div class="child-data_row">
                      <div>
                        <inputField
                          label="Гражданство"
                          v-model="child.state"
                          :error="errors['state']"
                        />
                      </div>
                        <div>
                            <inputField
                              label="Степень родства"
                              v-model="child.relationship"
                              :error="errors['relationship']"
                            />
                            <div class="input-prompt">
                                <span @click="child.relationship = 'Родитель'">Родитель</span>
                                <span @click="child.relationship = 'Законный представитель'">Законный представитель</span>
                            </div>
                        </div>
                    </div>
                  </article>

                  <article class="child-data_table-group">
                    <div class="child-data_row">
                      <div :class="{'input-error': errors['ovz']}">
                        <h2 class="form-heading child-data_heading" :class="{'label-error': errors['ovz']}">ОВЗ</h2>
                        <select class="dark-box darken" v-model.number="child.ovz">
                          <option value="0">Нет</option>
                          <option value="1">Есть</option>
                        </select>
                      </div>
                      <div v-if="child.ovz" :class="{'input-error': errors['ovz_type']['id']}">
                        <h2 class="form-heading child-data_heading" :class="{'label-error': errors['ovz_type']['id']}">Тип ОВЗ</h2>
                        <select class="dark-box darken" v-model="child.ovz_type.id" >
                          <option v-for="(type, id) in ovzTypes" :value="id">{{ type }}</option>
                        </select>
                      </div>
                    </div>

                    <div class="child-data_row">
                      <div :class="{'input-error': errors['disability']}">
                        <h2 class="form-heading child-data_heading" :class="{'label-error': errors['disability']}">Инвалидность</h2>
                        <select class="dark-box darken" v-model.number="child.disability" >
                          <option value="0">Нет</option>
                          <option value="1">Есть</option>
                        </select>
                      </div>
                      <div v-if="child.disability" :class="{'input-error': errors['disability_group']['id']}">
                        <h2 class="form-heading child-data_heading" :class="{'label-error': errors['disability_group']['id']}">Группа нвалидности</h2>
                        <select class="dark-box darken" v-model="child.disability_group.id" >
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
                      :error="errors['studyPlace']"
                    />
                  </article>

                  <article class="child-data_table-group">
                    <h2 class="form-heading child-data_heading">Адрес регистрации</h2>
                      <div class="child-data_addres">
                        <inputField
                          label="Город"
                          v-model="child.registration_address.city"
                          :error="errors['registration_address']['city']"
                        />
                        <inputField
                          label="Район"
                          v-model="child.registration_address.district"
                          :error="errors['registration_address']['district']"
                        />
                        <inputField
                          label="Улица"
                          v-model="child.registration_address.street"
                          :error="errors['registration_address']['street']"
                        />
                        <inputField
                          label="Дом"
                          v-model="child.registration_address.house"
                          :error="errors['registration_address']['house']"
                        />
                        <inputField
                          label="Номер квартиры"
                          v-model="child.registration_flat"
                          :error="errors['registration_flat']"
                        />
                      </div>
                  </article>

                  <article class="child-data_table-group">
                    <h2 class="form-heading child-data_heading">Адрес проживания</h2>
                      <div class="input-prompt">
                          <span @click="cloneAddress()">По адресу регистрации</span>
                      </div>
                      <br>
                    <div class="child-data_addres">
                      <inputField
                        label="Город"
                        v-model="child.residence_address.city"
                        :error="errors['residence_address']['city']"
                      />
                      <inputField
                        label="Район"
                        v-model="child.residence_address.district"
                        :error="errors['residence_address']['district']"
                      />
                      <inputField
                        label="Улица"
                        v-model="child.residence_address.street"
                        :error="errors['residence_address']['street']"
                      />
                      <inputField
                        label="Дом"
                        v-model="child.residence_address.house"
                        :error="errors['residence_address']['house']"
                      />
                      <inputField
                        label="Номер квартиры"
                        v-model="child.residence_flat"
                        :error="errors['residence_flat']"
                      />
                    </div>
                  </article>
                </article>
            </section>
            <button v-if="!show.needData" class="dark-box dark-button" @click="showNeedData">Принять</button>

            <button v-if="show.needData" class="dark-box dark-button" @click="accept(id)">Принять</button>

            <div v-if='show.success'>
                Запрос успешно подтвержден!
            </div>

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
</style>

<script>
  import navigation from '../../components/Navigation.vue'
  import {User} from '../../models/User';
  import {Corrector} from '../../utils/Corrector'
  import {Parser} from '../../utils/Parser'
  import inputField from '../../components/InputField.vue'
  import MaskedInput from 'vue-masked-input'
  import clone from 'clone'

  export default {
    name: 'Child',
    components: {
      navigation, inputField, MaskedInput
    },
    data() {
      return {
        parentRequests: [],
        child: {

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
            needData: false,
            success: false,
        },
        errors: {

        },
        errors_proto: {

        }
      }
    },
    async created() {
      const requests = await User.getParentRequests().then(data => data).catch(err => console.error(err));
      this.parentRequests = requests;
    },
    methods: {
      correctUserField: field => Corrector.userField(field),
      showNeedData() {
        User.getFullData(
            {
               birthday: null,
               state: null,
               relationship: null,
               studyPlace: null,
               ovz: null,
               ovz_type: {
                   id: null
               },
               disability: null,
               disability_group: {
                   id: null,
               },
               registration_address: null,
               registration_flat: null,
               residence_address: null,
               residence_flat: null
            },
            false
        ).then(data => {
            this.child = clone(data.data);
            this.errors = clone(data.errors);
            this.errors_proto = clone(data.errors);
            this.show.needData = true;
        });
      },
      cloneAddress() {
          this.child.residence_address = clone(this.child.registration_address);
          this.child.residence_flat = this.child.registration_flat;
      },
      accept(id) {
          this.errors = clone(this.errors_proto);
          const parent_id = this.parentRequests[id].id;
          
          User.agreeParentRequest(parent_id, clone(this.child)).then(data => {
              this.show.needData = false;
              this.show.success = true;
          }).catch(err => {
              if (err.msg) {
                  console.log(err.msg);

                  err.msg.map(el => {
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
              }

              if (err.response) {
                  const msg = err.response.errors[0].message;
                  console.log(msg);
                  if (msg === 'Email must be unique') {
                      this.childRawErrors.email = true;
                  }
                  else if (msg == 'Phone must be unique') {
                      this.childRawErrors.phone = true;
                  }
                  else if (JSON.parse(msg)) {
                      const parsed = JSON.parse(msg);
                      // debugger;
                      Object.keys(parsed).map(el => {
                          this.errors[el] = true;
                      });
                  }
              }
          });
      },
      cancell(id) {

      }
    }
  }
</script>
