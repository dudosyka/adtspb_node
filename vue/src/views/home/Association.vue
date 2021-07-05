<template>
  <main class="home">
    <navigation :new-proposal="messages.proposalCreated" />


    <section class="home-content">
      <div :class="{'association-cards--opened': show.associationsList}" class="association-cards-wrapper">
        <button class="close-association" @click="show.associationsList = false"><span></span></button>
        <article class="association-cards">
          <article class="card shadow" v-for="(card, id) in associations" v-bind:key="associations[id].id">
            <h2 class="association-name" v-text="card.name"></h2>
            <p class="association-description" v-text="card.description"></p>
            <p class="association-description">от {{ card.min_age + ' до ' + card.max_age}} лет</p>
            <p class="association-description">занятия {{ card.lessons_week + correctLessons(card.lessons_week)}} в неделю</p>
            <p class="association-description">{{ card.hours_week + correctHours(card.hours_week) }} в неделю</p>
            <p class="association-description">{{ card.study_years + correctYears(card.study_years) }} обучения</p>

            <section class="association-schedule" v-for="group of card.groups">
              <h3 class="schedule-name">{{ group.group.name }}</h3>
              <table class="schedule">
                <tr v-for="(time, day) in group.timetable">
                  <td>{{ day }}</td><td>{{ time }}</td>
                </tr>
              </table>
            </section>

            <!--
            <div class="association-test warning-container" v-if="card.test.is">
              <h3 class="assoc-test-heading" v-text="card.test.name"></h3>
              <p class="assoc-test-description" v-text="card.test.description"></p>
            </div>
            !-->
            <div v-if="!card.isRecruiment" class="association-reserve fatal-container">
              <p class="assoc-reserve-description">Идёт набор в резерв</p>
            </div>
            <div v-else class="association-reserve accept-container">
              <p class="assoc-reserve-description">Идёт набор</p>
            </div>

            <button v-if="!proposalParms.associations[id]" class="dark-box dark-button" @click="addAssociation(id)">Записать</button>
            <button v-else class="dark-box dark-button" @click="removeAssociation(id)">Отмена</button>
          </article>
        </article>
      </div>

      <section class="child card shadow">
        <h2 class="child-name">{{ child.name }} {{ child.surname }}</h2>
        <section v-if="proposalParms.associations.length !== 0">
          <div class="child-hours">
            <header class="child-hours-header">
              <h3 class="child-hours-heading">Часов в неделю</h3>
              <h3>{{ weekHours }}</h3>
            </header>
            <span></span>
            <div class="child-hours_speedometr">
              <span class="child-hours_speedometr-l"></span>
            </div>
          </div>
        </section>

        <ul class="child-association">
          <!-- Using computed for correct arr rendering !-->
          <li v-for="association of assocsUser" class="child-association-item">{{ association.name }}</li>
        </ul>

        <div class="buttons add-association">
          <button class="dark-button" @click="show.associationsList = true">Добавить объединение</button>
        </div>

        <div v-if="assocsUser.length > 0">
          <p class="label-error" v-show="errors.schedule">Ознакомтесь с расписанием</p>
          <div class="checkbox-container" @click="proposalParms.schedule = !proposalParms.schedule">
            <input type="checkbox" v-model="proposalParms.schedule" class="checkbox" tabindex="3">
            <label class="checkbox">С рассписанием ознакомлен</label>
          </div>

          <div class="buttons">
            <p class="label-error" v-if="errors.needAssoc">Выберите объединения</p>
            <p class="label-normal" v-if="messages.proposalCreated">Заявления составлены</p>
            <p class="label-error" v-if="errors.alreadyCreated">Заявления уже составлены</p>
            <button class="dark-box dark-button" @click="createProposal">Составить заявления</button>
          </div>
        </div>

      </section>
    </section>
  </main>
</template>

<script>
import navigation from '../../components/Navigation.vue';
import {Proposal} from '../../models/Proposal.js';
import {Association} from "../../models/Association.js";
import {Corrector} from "../../utils/Corrector.js";

export default {
  name: "Association",
  components: {
    navigation,
  },
  data() {
    return {
      associations: [],
      child: {},
      proposalParms: {
        associations: [],
        schedule: false,
        weekHours: 0
      },
      errors: {
        schedule: false,
        needAssoc: false,
        alreadyCreated: false
      },
      messages: {
        proposalCreated: false
      },
      show: {
        associationsList: true
      }
    }
  },
  created() {

    //TODO: Вынести логику в модель!
    const child = localStorage.getItem('childInAssociations');

    {
      const req = `
        query {
          getAssociations {
            id,
            name,
            description,
            min_age, max_age,
            study_years,
            hours_week, lessons_week,
            study_form,
            hours_count,
            study_period,
            isRecruiment,
            timetable {
              group { id, name }
              monday, tuesday, wednesday, thursday, friday, saturday, sunday
            },
          }
        }
      `;

      _request("api", req)
        .then(data => {
          /*
          * reconstruction arr with timetable
          * for more simply render it

            timetable: [
              {
                group:  {
                    id: '',
                    name: '',
                }
                monday: '',
                ...
                sunday: ''
              }
            ]

            * to <=>

            groups: [
              {
                group: {}
                timetable: {}
              }
            ]
          */

          const associations = data.getAssociations

          //1. create new arr for timetable
          //2. create new obj with keys: group, timetable
          //3. sort data to new obj
          //4. create new obj with constructor and push to arr
          //5. delete old key timetable
          for (let id in associations) {
            associations[id].groups = [];

            for (let timetables of associations[id].timetable) {
              let group = {};
              let timetable = {};

              for (let el in timetables) {
                if (el === 'group') {
                  group = timetables[el];
                } else {
                  timetable[el] = timetables[el];
                }
              }

              associations[id].groups.push(new Group(group, timetable));
              delete associations[id].timetable
            }
          }

          function Group(group, timetable) {
            return {
              group: {
                name: group.name,
                id: group.id,
              },
              timetable: MakeTimetable(timetable)
            }
          }

          function MakeTimetable(week) {
            let timetable = {}

            for (let day in week) {
              if (week[day] !== '-') {
                const dayRusName = Corrector.translateWeekDay(day)
                timetable[dayRusName] = week[day]
              }
            }
            return timetable
          }

          this.associations = associations;

        })
        .catch(err => {
          console.error(err);
        })
    }

    {
      const req = `
        query($id: ID) {
          user(id: $id) {
            name, surname, id
          }
        }
      `;

      const data = {
        id: child
      }

      _request("api", req, data)
        .then( data => {
          this.child = data.user
        })
        .catch( err => {
          console.log(err)
        })
    }
  },
  methods: {
    //Методы для правильного склонения слов
    correctYears: (years) => Corrector.correctYears(years),
    correctLessons: (lessons) => Corrector.correctLessons(lessons),
    correctHours: (hours) => Corrector.correctHours(hours),

    addAssociation(id) {
      const assocsUser = this.proposalParms.associations
      const assocsList = this.associations
      /*
        Have arr[id]?
        if haven't, then
        copy arr[id] link to arr with SAME id
      */

      let isUnique = true;
      for (let el of assocsUser) {
        if (assocsList[id] === el) {
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        assocsUser[id] = assocsList[id] //for correct splice work
        assocsUser.splice(id, 1, assocsList[id]) //for correct reactive work
      }
    },
    removeAssociation(id) {
      this.proposalParms.associations.splice(id, 1)
    },

    createProposal() {
        //TODO: Вынести логику в модель!
      if (this.proposalParms.associations.length > 0) {
        this.errors.needAssoc = false;
        if (this.proposalParms.schedule) {
          this.errors.schedule = false;
          this.proposalParms.associations.map( assoc => {
            const childId = Number(this.child.id);
            const assocId = Number(assoc.id)
            console.log(assocId)

            Proposal.create(assocId, childId)
              .then(data => {
                this.messages.proposalCreated = true;
              })
              .catch(err => {
                console.error(err);
                this.errors.alreadyCreated = true;
              })
          })
        } else {
          this.errors.schedule = true
        }
      } else {
        this.errors.needAssoc = true
      }
    }
  },
  computed: {
    assocsUser() {
      let arr = [];
      //TODO: Использовать Array.filter()
      this.proposalParms.associations.map( el => { if (el) arr.push(el) })
      console.log(arr);
      return arr
    },
    weekHours() {
      let hours = 0
      this.proposalParms.associations.map( el => {
        hours += el.hours_week
      })
      this.proposalParms.weekHours = hours;
      return hours;
      return 5;
    },
    weekHoursSpeedometr() {

    }
  }
}
</script>

<style scoped>
  .home-content {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  article.card.shadow {
    margin: 0;
  }
  .child {
    padding: 20px;
    margin: 0;
    min-width: 300px;
  }
  .child-name {
    text-align: center;
    color: #142732;
    margin-bottom: 15px;
  }
  .child-association {
    padding: 20px 0;
    margin: 0;

    list-style: none;
  }
  .child-association-item {
    color: #142732;

    border-left: 3px solid #142732;
    padding: 5px 0px 5px 10px;
  }
  .child-hours {
    margin: 30px 0;

    color: #142732;
  }
  .child-hours-header {
    display: flex;
    justify-content: space-between;
  }
  .child-hours_speedometr {
    display: block;
    position: relative;
    width: 100%;
    height: 5px;
    margin-top: 10px;
    background-color: #aeaeae;
  }
  .child-hours_speedometr-l {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #0086c9;
  }

  .association-cards {
    box-sizing: border-box;
    height: 100vh;
    padding: 30px;
    color: #142732;
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(auto-fill, 260px);
    overflow-y: scroll;
  }
  .association-name {
    word-wrap: break-word;
  }
  .association-test, .association-reserve, .association-schedule {
    padding: 10px;
    margin-bottom: 15px;
  }
  .assoc-test-description {
    margin: 0;
    margin-top: 10px;
  }
  .assoc-reserve-description {
    margin: 0;
  }

  .association-schedule {
    position: relative;
    display: grid;
    grid-template-rows: repeat(auto-fill, 30px);
    padding: 0;
    margin: 20px 0;
  }
  .schedule-name {
    text-align: left;
  }

  .add-association {
    display: none;
  }
  .close-association {
    display: none;
  }
  .close-association:hover {
    cursor: pointer;
  }

  @media (max-width: 1000px) {
    .home-content {
      grid-template-columns: 1fr;
    }
    .child {
      min-width: auto;
    }
    .association-cards {
      height: auto;
      overflow-y: hidden;
      padding: 0;
    }
    .add-association {
      display: grid;
    }
    .close-association {
      position: fixed;
      top: 5px;
      right: 5px;
      display: block;
      width: 30px;
      height: 30px;
      padding: 0;
      border: none;
      background-color: initial;
    }
    .close-association span, .close-association span::after {
      display: block;
      background-color: #fff;
      height: 3px;
      width: 30px;
    }
    .close-association span {
      transform: rotate(45deg);
    }
    .close-association span::after {
      content: '';
      transform: rotate(90deg);
    }
    .association-cards--opened {
      display: block !important;
    }
    .association-cards-wrapper {
      display: none;
      z-index: 10;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      box-sizing: border-box;
      overflow-y: auto;
      padding: 20px 35px 20px 20px;
      background-color: rgba(70, 70, 70, 0.54);
    }
  }
</style>
