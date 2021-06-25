<template>
  <main class="home">
    <navigation />

    <section class="content">
      <article class="association-cards">
        <article class="card shadow" v-for="(card, id) in associations">
          <h2 class="association-name" v-text="card.name"></h2>
          <p class="association-description" v-text="card.description"></p>
          <p class="association-description">от {{ card.min_age + ' до ' + card.max_age}} лет</p>
          <p class="association-description">{{ card.lessons_week }} раза в неделю</p>
          <p class="association-description">по {{ card.lessons_week }} часов в неделю</p>
          <p class="association-description">{{ card.study_years }} года обучения</p>

          <table class="association-schedule">
            <tr>
              <td>This is schedule </td>
            </tr>
          </table>
          <!--
          <div class="association-test warning-container" v-if="card.test.is">
            <h3 class="assoc-test-heading" v-text="card.test.name"></h3>
            <p class="assoc-test-description" v-text="card.test.description"></p>
          </div>
          !-->
          <div class="association-reserve fatal-container" v-if="!card.isRecruiment">
            <p class="assoc-reserve-description">Идёт набор в резерв</p>
          </div>
          <div class="association-reserve accept-container" v-else>
            <p class="assoc-reserve-description">Идёт набор</p>
          </div>

          <button class="dark-box dark-button" @click="addAssociation(id)">Записать</button>
        </article>
      </article>

      <section class="child shadow">
        <h2 class="child-name">{{ child.name }} {{ child.surname }}</h2>
        <ul class="child-association">
          <li v-for="id of proposalParms.associations" class="child-association-item">{{ associations[id].name }}</li>
        </ul>

        <div class="checkbox-container" @click="proposalParms.schedule = !proposalParms.schedule">
          <input type="checkbox" v-model="proposalParms.schedule" class="checkbox" tabindex="3">
          <label class="checkbox">С рассписанием ознакомлен</label>
        </div>
        <div class="buttons">
          <button class="dark-box dark-button">Составить заявления</button>
        </div>


      </section>
    </section>
  </main>
</template>

<script>
import navigation from '../../components/Navigation.vue'

export default {
  name: "Association.vue",
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
      }
    }
  },
  created() {
    const child = localStorage.getItem('childInAssociations');
    console.log(child);

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
            timetable { id },
          }
        }
      `; //timetable, proposals

      api.request(req)
          .then(data => {
            console.log(data);
            this.associations = data.getAssociations;
          })
          .catch(err => {
            console.error(err);
          })
    }
    {
      const req = `
        query($id: ID) {
          user(id: $id) {
            name, surname
          }
        }
      `;

      const data = {
        id: child
      }

      api.request(req, data)
        .then( data => {
          console.log(data)
          this.child = data.user
        })
        .catch( err => {
          console.log(err)
        })
    }
  },
  methods: {
    addAssociation(id) {
      let isUnique = true;
      for (let el in this.proposalParms.associations) {
        if (id == el) {
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        this.proposalParms.associations.push(id);
      }
    }
  },
  computed: {
    validWeekText() {

    }
  }
}
</script>

<style scoped>
  .content {
    display: grid;
    grid-template-columns: auto 300px;
  }

  article.card.shadow {
    margin: 0;
  }
  .child {
    padding: 20px;
  }
  .child-name {
    text-align: center;
    color: #142732;
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

</style>