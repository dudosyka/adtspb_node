<template>
  <main class="home">
    <navigation />

    <section class="content">
      <article class="association-cards">
        <article class="card shadow" v-for="card in associations">
          <h2 class="association-name" v-text="card.name"></h2>
          <p class="association-description" v-text="card.description"></p>
          <p class="association-description">{{ card.old }} лет</p>
          <p class="association-description">{{ card.lessonsCount }} раза в неделю</p>
          <p class="association-description">{{ card.yearsCount }} года обучения</p>

          <table class="association-schedule">
            <tr>
              <td>This is schedule </td>
            </tr>
          </table>

          <div class="association-test warning-container" v-if="card.test.is">
            <h3 class="assoc-test-heading" v-text="card.test.name"></h3>
            <p class="assoc-test-description" v-text="card.test.description"></p>
          </div>

          <div class="association-reserve fatal-container" v-if="card.set.toReserve">
            <p class="assoc-reserve-description" v-text="card.set.description"></p>
          </div>

          <button class="dark-box dark-button">Записать</button>
        </article>
      </article>

      <section class="child shadow">
        <h2 class="child-name">{{ child.name }} {{ child.surname }}</h2>
        <ul class="child-association">
          <li class="child-association-item" v-for="assoc in proposalParms.associations">{{ assoc }}</li>
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
      associations: [
        {
          name: 'Шитьё',
          description: 'Научим шить',
          test: {
            is: true,
            name: 'Тест на котика',
            description: 'Lorem ipsum',
          },
          lessonsCount: 3,
          yearsCount: 2,
          old: '12-13',
          schedule: '',
          set: {
            toReserve: true,
            description: 'Набор в резерв!'
          },
        },
        {
          name: 'Проверка заголовка на переполнение',
          description: 'Научим шить',
          test: {
            is: false,
            name: 'Тест на котика',
            description: 'Lorem ipsum',
          },
          lessonsCount: 3,
          yearsCount: 2,
          old: '12-13',
          schedule: '',
          set: {
            toReserve: true,
            description: 'Набор в резерв!'
          },
        },
        {
          name: 'ОченьДлинноеСловоВЗаголовке',
          description: 'Научим шить',
          test: {
            is: true,
            name: 'Тест на котика',
            description: 'Описание на переполнение описания текс гобана для татуйкиной проверки',
          },
          lessonsCount: 3,
          yearsCount: 2,
          old: '12-13',
          schedule: '',
          set: {
            toReserve: false,
            description: 'Набор в резерв!'
          },
        },
        {
          name: 'Шитьё',
          description: 'Описание на переполнение описания текс гобана для татуйкиной проверки',
          test: {
            is: false,
            name: 'Тест на котика',
            description: '',
          },
          lessonsCount: 3,
          yearsCount: 2,
          old: '12-13',
          schedule: '',
          set: {
            toReserve: false,
            description: 'Набор в резерв!'
          },
        },
      ],
      child: {
        name: 'Lorem',
        surname: 'Ipsum',
      },
      proposalParms: {
        associations: ['Шитьё', 'Мехатроника'],
        schedule: false,
      }
    }
  },
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