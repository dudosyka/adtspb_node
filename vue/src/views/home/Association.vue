<template>
  <main class="home">
    <navigation :new-proposal="messages.proposalCreated" />


    <section class="home-content">
      <div :class="{'association-cards--opened': show.associationsList}" class="association-cards-wrapper">
        <button class="close-associations" @click="show.associationsList = false"><span></span></button>
        <article class="association-cards">
          <article class="card shadow" v-for="(card, id) in associations" v-bind:key="associations[id].id" v-if='!card.already'>
            <h2 class="association-name" v-text="card.name"></h2>
            <p class="association-description" v-text="card.description"></p>
            <div class="association-additional">
                <p class="tak-hochet-marina">от {{ card.min_age + ' до ' + card.max_age}} лет</p>
                <p class="tak-hochet-marina">занятия {{ card.lessons_week + correctLessons(card.lessons_week)}} в неделю</p>
                <p class="tak-hochet-marina">{{ card.hours_week + correctHours(card.hours_week) }} в неделю</p>
                <p class="tak-hochet-marina">{{ card.study_years + correctYears(card.study_years) }} обучения</p>
            </div>

            <section class="association-schedule" v-for="group of card.groups">
              <h3 class="schedule-name">{{ group.name }}</h3>
              <table class="schedule">
                <tr v-for="day in group.timetable.week">
                  <td>{{ day.name }}</td><td>{{ day.time }}</td>
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
            <button v-else-if='!proposalParms.associations[id].already' class="dark-box dark-button" @click="removeAssociation(id)">Отмена</button>
          </article>
        </article>
      </div>

      <section class="child card shadow">
        <h2 class="child-name">{{ child.name }} {{ child.surname }}</h2>
        <section v-if="proposalParms.associations.length !== 0">
          <div class="child-hours">
            <header class="child-hours-header">
              <h3 class="child-hours-heading">Часов в неделю</h3>
              <h3>{{ this.proposalParms.weekHours }}</h3>
            </header>
            <span></span>
            <div class="child-hours_speedometr">
              <span class="child-hours_speedometr-l"></span>
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
            <label class="checkbox">С рассписанием ознакомлен</label>
          </div>

          <div class="buttons">
            <p class="label-error" v-if="errors.needAssoc">Выберите объединения</p>
            <p class="label-normal" v-if="messages.proposalCreated">Заявления составлены</p>
            <p class="label-error" v-if="errors.alreadyCreated">Заявления уже составлены</p>
            <button class="dark-box dark-button" @click="createProposal()">Составить заявления</button>
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
    },
    selected: false,
    }
  },
  created() {
    const child = localStorage.getItem('childInAssociations');

    Association.getAssociations(null, child).then(data => {
        data.map(el => {
            this.associations[el.id] = el;
            this.associations[el.id].already = false;
        });

        console.log(data);

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
                }
            }
        }

        User.getFullData(fields, child).then(data => {
            console.log(data);
            this.child = data.data;
            this.child.proposals.map(el => {
                this.associations[el.association.id].already = true;
                this.proposalParms.associations[el.association.id] = el.association;
                this.proposalParms.associations[el.association.id].already = true;
                this.proposalParms.weekHours += el.association.hours_week;
            });
            console.log(this.child);
            console.log(this.proposalParms);
        });

    });
  },
  methods: {
    //Методы для правильного склонения слов
    correctYears: (years) => Corrector.correctYears(years),
    correctLessons: (lessons) => Corrector.correctLessons(lessons),
    correctHours: (hours) => Corrector.correctHours(hours),

    addAssociation(id) {
        this.proposalParms.associations[id] = this.associations[id];
        this.selected = false;
        this.selected = true;
    },
    removeAssociation(id) {
      delete this.proposalParms.associations[id];
      this.anyAssociationSelected();
    },

    createProposal() {
      if (!this.selected) {
        this.errors.needAssoc = true;
        return;
      }
      if (!this.proposalParms.schedule) {
        this.errors.schedule = true
        return;
      }
      this.errors.needAssoc = false;
      this.errors.schedule = false;

      Proposal.createFromObject(this.proposalParms.associations, this.child.id)
      .then(data => {
          Object.keys(this.proposalParms.associations).map(el => {
                this.associations[el].already = true;
          });

          this.messages.proposalCreated = true;
      })
      .catch(err => {
          this.errors.alreadyCreated = true;
      })

    },
    anyAssociationSelected() {
        this.selected = false;
        Object.keys(this.proposalParms.associations).map(el => {
            if (!this.proposalParms.associations[el].already) {
                console.log(this.proposalParms.associations[el]);
                this.selected = true;
            }
        })
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
.association-additional {
}
.tak-hochet-marina {
    display: inline-block;
    width: fit-content;
    margin: 0;
    margin-bottom: 5px;
    padding: 5px;
    border-radius: 5px;
    color: #0086c9;
    background-color: #eaf4ff;
}
.tak-hochet-marina:last-child {
    margin-bottom: 0;
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
