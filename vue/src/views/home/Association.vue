<template>
  <main class="home">
    <navigation :new-proposal="messages.proposalCreated" />


    <section class="home-content">
      <div :class="{'association-cards--opened': show.associationsList}" class="association-cards-wrapper">
        <button class="close-associations" @click="show.associationsList = false"><span></span></button>
        <p v-if="show.warn" class="warning-container">Нет объединений доступных для записи.</p>
        <article class="association-cards">
            <h2 v-if='false'><!-- Елси его убрать всё сломается !--></h2>
            <template v-else>
                <article  class="association-card card shadow" v-for="(card, id) in associations" v-bind:key="associations[id].id" v-if='!card.already'>
                    <h2 class="association-card_heading">{{ card.name }}</h2>
                    <p class="association-card_old gray-text">от {{ card.min_age + ' до ' + card.max_age}} лет</p>
                    <p class="gray-text">{{ card.description }}</p>
                    <article class="association-card_time">
                        <section class="association-card_time_item">
                            <p class="black-text">{{ card.lessons_week + correctLessons(card.lessons_week)}} {{ card.hours_week + correctHours(card.hours_week) }}</p>
                            <p class="gray-text">в неделю</p>
                        </section>
                        <section class="association-card_time_item">
                            <p class="black-text">{{ card.study_years + correctYears(card.study_years) }}</p>
                            <p class="gray-text">обучения</p>
                        </section>
                    </article>

                    <button
                        class="association-card_timetable-toggle"
                        :class="{'association-card_timetable-toggle--open': card.showSchendule}"
                        @click="openTimetables(id)"
                    >Расписание</button>
                    <article class="association-card_timetable" v-show="card.showSchendule">
                        <div class="bread-crumbs">
                            <button class="bread-crumb"
                                    :class="{'bread-crumb--active': group.timetable.show}"
                                    v-for="(group, groupId) of card.groups"
                                    @click="openTimetable(id, groupId)"
                            >{{ group.name }}</button>
                        </div>
                        <section class="schedule-wrapper">
                            <table class="schedule" v-for="(group, id) in card.groups" v-show="group.timetable.show">
                                <tr v-for="day of group.timetable.week">
                                    <td>{{ day.name }}</td><td>{{ day.time }}</td>
                                </tr>
                            </table>
                            <hr class="black-line">
                        </section>
                    </article>

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

                    <div class="association-card_buttons buttons">
                        <button v-if="!proposalParms.associations[id]" class="dark-box dark-button" @click="addAssociation(id)">Записать</button>
                        <button v-else-if='!proposalParms.associations[id].already' class="dark-box dark-button" @click="removeAssociation(id)">Отмена</button>
                    </div>
                </article>
            </template>
        </article>
      </div>

      <section class="child card shadow">
        <h2 class="child-name">{{ child.name }} {{ child.surname }}</h2>
        <section v-if="proposalParms.associations.length !== 0">
          <div class="child-hours">
            <header class="child-hours-header">
              <h3 class="child-hours-heading">Часов в неделю</h3>
              <h3>{{ proposalParms.weekHours }} / {{ proposalParms.maxHours }}</h3>
            </header>
            <span></span>
            <div class="child-hours_speedometr">
              <span :style='"width: " + proposalParms.speedometr + "%; background-color: " + proposalParms.overflow' class="child-hours_speedometr-l"></span>
            </div>
          </div>
        </section>

        <ul class="child-association">
          <!-- Using computed for correct arr rendering !-->
          <li v-for="association of this.proposalParms.associations" class="child-association-item">{{ association.name }}</li>
        </ul>

        <div class="buttons add-associations">
          <button class="dark-button" @click="show.associationsList = true">Добавить объединение</button>
        </div>

        <div v-if="selected">
          <p class="label-error" v-show="errors.schedule">Ознакомтесь с расписанием</p>
          <div class="checkbox-container" @click="proposalParms.schedule = !proposalParms.schedule">
            <input type="checkbox" v-model="proposalParms.schedule" class="checkbox" tabindex="3">
            <label class="checkbox">Пожалуйста, подтвердите ознакомление с расписанием</label>
          </div>

          <div class="buttons">
            <p class="label-error" v-if="errors.needAssoc">Выберите объединения</p>
            <p class="label-normal" v-if="messages.proposalCreated">Заявления составлены</p>
            <p class="label-error" v-if="errors.alreadyCreated">Заявления в {{ errors.assoc.name }} уже составлены</p>
            <p class="label-error" v-if="errors.age">Объединение {{ errors.assoc.name }} не подходит по возрасту</p>
            <p class="label-error" v-if="errors.overflow">Вы привысили ограничение по количеству часов в неделю! </p>
            <button class="dark-box dark-button" @click="createProposal()">Сформировать заявления</button>
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
import {User} from "../../models/User.js";
import {Timetable} from "../../models/Timetable.js";
import {Corrector} from "../../utils/Corrector.js";
import {Parser} from '../../utils/Parser';
import * as AppConfig from "../../config/AppConfig.js";
import clone from 'clone';

export default {
  name: "Association",
  components: {
    navigation,
  },
  data() {
    return {
      associations: {},
      child: {},
      proposalParms: {
        associations: {},
        schedule: false,
        weekHours: 0,
        speedometr: 0,
        overflow: "#0086c9",
        maxHours: 0
      },
      errors: {
        schedule: false,
        needAssoc: false,
        alreadyCreated: false,
        age: false,
        overflow: false,
        assoc: {
            name: false
        }
      },
      messages: {
        proposalCreated: false
      },
      show: {
        associationsList: true,
        warn: null
    },
    selected: false,
    }
  },
  created() {
    const child = localStorage.getItem('childInAssociations');
    Association.getAssociations(null, child).then(data => {
        data.map(association => {
            const id = association.id;

            //this properties must be reactive
            this.$set(this.associations, id, association);
            this.$set(this.associations[id], 'already', false);
            this.$set(this.associations[id], 'showSchendule', false);
            if (Object.keys(this.associations[id].groups).length) {
                console.log('hi')
                this.$set(this.associations[id].groups[0].timetable, 'show', true);
            }

        });

        this.show.warn = Object.keys(this.associations).length < 1;

        const fields = {
            id: null,
            name: null,
            surname: null,
            birthday: null,
            proposals: {
                association: {
                    id: null,
                    hours_week: null,
                    name: null
                },
                status: {
                    num: true,
                }
            }
        }

        User.getFullData(fields, child).then(data => {
            this.child = data.data;
            console.log(this.child);
            this.child.proposals.map(el => {
                if (el.status[0].num != 0) {
                    this.associations[el.association.id].already = true;
                    this.proposalParms.associations[el.association.id] = el.association;
                    this.proposalParms.associations[el.association.id].already = true;
                    this.proposalParms.weekHours += el.association.hours_week;
                }
            });
            let old = User.calculateAge(this.child.birthday);
            console.log(old);
            this.proposalParms.maxHours = (old < 14) ? AppConfig.min_hours_week : AppConfig.max_hours_week;
            this.speedometr();
        });
    });
  },
  methods: {
    //Методы для правильного склонения слов
    correctYears: (years) => Corrector.correctYears(years),
    correctLessons: (lessons) => Corrector.correctLessons(lessons),
    correctHours: (hours) => Corrector.correctHours(hours),

    //I will create component, pleas don't change it
    openTimetables(id) {
        this.associations[id].showSchendule = !this.associations[id].showSchendule;
    },
    openTimetable(assocId, groupId) {
        this.associations[assocId].groups.map(group => {
            group.timetable.show = false;
        })
        this.associations[assocId].groups[groupId].timetable.show = true;
    },


    addAssociation(id) {
        this.proposalParms.associations[id] = clone(this.associations[id]);
        console.log(this.proposalParms.associations[id]);
        this.proposalParms.weekHours += this.associations[id].hours_week;
        this.speedometr();
        this.selected = false;
        this.selected = true;
    },
    removeAssociation(id) {
        this.proposalParms.weekHours -= this.proposalParms.associations[id].hours_week;
        this.speedometr();
        delete this.proposalParms.associations[id];
        this.anyAssociationSelected();
        this.removeErrs();
    },
    removeErrs() {
        this.errors.needAssoc = false;
        this.errors.schedule = false;
        this.errors.overflow = false;
    },
    createProposal() {
        this.removeErrs();
        if (!this.selected) {
          this.errors.needAssoc = true;
          return;
        }
        if (!this.proposalParms.schedule) {
          this.errors.schedule = true
          return;
        }
        if (this.proposalParms.overflow == 'red') {
          this.errors.overflow = true;
          return;
        }

        console.log(this.associations);
        console.log(this.proposalParms.associations);

        Proposal.createFromObject(this.proposalParms.associations, this.child.id)
          .then(data => {
              Object.keys(this.proposalParms.associations).map(el => {
                    this.proposalParms.associations[el].already = true;
                    this.associations[el].already = true;
              });

              this.messages.proposalCreated = true;
          })
          .catch(err => {
              this.errors.assoc = err.assoc;
              if (err.msg == 'Age doesn`t pass') {
                  this.errors.age = true;
              }
              else if (err.msg == 'Too many hours') {
                  this.errors.overflow = true;
              }
              else if (err.msg == 'Proposal had already created') {
                  this.errors.alreadyCreated = true;
              }
              else {
                  console.log(err.msg);
              }
      });
    },
    anyAssociationSelected() {
        this.selected = false;
        Object.keys(this.proposalParms.associations).map(el => {
            if (!this.proposalParms.associations[el].already) {
                this.selected = true;
            }
        })
    },
    speedometr() {
        let maxHours = this.proposalParms.maxHours

        this.proposalParms.speedometr = this.proposalParms.weekHours / maxHours;
        this.proposalParms.overflow = "#0086c9";
        if (this.proposalParms.speedometr > 1) {
            this.proposalParms.overflow = "red";
            this.proposalParms.speedometr = 1;
        }
        this.proposalParms.speedometr = Math.floor(this.proposalParms.speedometr * 100);
    }
  },
  computed: {
    maxHours() {
        let old = User.calculateAge(this.child.birthday);
        this.proposalParms.maxHours = (old < 14) ? AppConfig.min_hours_week : AppConfig.max_hours_week;
    },
  }
}

</script>

<style scoped>
.home-content {
    display: grid;
    grid-template-columns: 1fr auto;
    overflow-y: hidden;
}
.warning-container {
    padding: 10px;
    margin: 30px;
}

article.card.shadow {
    margin: 0;
}
.child {
    padding: 20px;
    margin: 0;
    width: 350px;
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
    height: 5px;
}

.association-cards {
    box-sizing: border-box;
    height: 100vh;
    padding: 30px;

    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(auto-fill, 260px);
    overflow-y: scroll;
}

.association-card {

}
.association-card_old {
    margin: 0;
    margin-top: 5px;
}
.association-card_time {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 5px 0 15px;
}
.association-card_time_item .black-text {
    font-size: 17px;
    margin: 0;
}
.association-card_time_item .gray-text {
    font-size: 15px;
    margin: 0;
}

.association-card_timetable-toggle {
    position: relative;
    width: 100%;
    padding: 10px;
    padding-right: 30px;
    margin-bottom: 10px;
    background-color: #fff;
    border: none;
    font-size: 17px;
    color: #142732;
}
.association-card_timetable-toggle::after {
    content: '';
    position: absolute;
    top: 50%; transform: translateY(-50%);
    width: 0;
    height: 0;
    margin-left: 10px;
    border: 7px solid #464646;
    border-left-color: rgba(0,0,0,0);
    border-right-color: rgba(0,0,0,0);
    border-top-style: none;
}
.association-card_timetable-toggle--open::after {
    border: 7px solid #142732;
    border-left-color: rgba(0,0,0,0);
    border-right-color: rgba(0,0,0,0);
    border-bottom-style: none;
}
.association-card_timetable-toggle:hover {
    cursor: pointer;
}

.bread-crumbs {
    display: flex;
    flex-wrap: wrap;
}
.bread-crumb {
    padding: 3px;
    color: #525252;
    background-color: #fff;
    border: none;
    font-size: 12px;
}
.bread-crumb--active {
    color: #0086c9;
    background-color: #eaf4ff;
    border-radius: 5px;
}
.bread-crumb:hover {
    cursor: pointer;
}

.association-card_timetable {
    color: #142732;
    margin-bottom: 10px;
}
.schedule-wrapper {
    padding-bottom: 20px;
}
.schedule {
    padding: 10px 0;
    width: 100%;
}

.association-test, .association-reserve {
    padding: 10px;
    margin: 15px 0;
}

.assoc-reserve-description {
    margin: 0;
}

.add-associations {
    display: none;
}
.close-associations {
    display: none;
}
.close-associations:hover {
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
    .add-associations {
        display: grid;
    }
    .close-associations {
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
    .close-associations span, .close-associations span::after {
        display: block;
        background-color: #fff;
        height: 3px;
        width: 30px;
    }
    .close-associations span {
        transform: rotate(45deg);
    }
    .close-associations span::after {
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
