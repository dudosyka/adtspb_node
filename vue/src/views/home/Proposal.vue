<template>
  <main class="home">
      <navigation />

      <section class="home-content">

        <article class="card shadow" v-for="child in children">
          <h2 class="child-name">{{ child.name + ' ' + child.surname }}</h2>

          <article class="proposals">

            <section class="proposal" v-for="proposal in child.proposals">
              <div class="child-stat">
                <h3 class="proposal_heading">{{ proposal.name }}</h3>
                <figcaption class="child-stat_heading">Статус: {{ proposal.status }}</figcaption>
              </div>
              <div class="buttons">
                <button class="dark-button dark-box">Скачать</button>
                <button class="dark-button dark-box">Печатать</button>
              </div>
            </section>

          </article>
        </article>

      </section>
  </main>
</template>

<style scoped>
  .proposals {
    display: grid;
    grid-gap: 20xp;
  }
  .proposal {
    display: grid;
    grid-template-columns: 1fr 220px;
    padding: 20px;
  }
  .proposal_heading {
    font-size: 22px;
  }
  .child-stat {
    align-self: center;
    display: grid;
    grid-gap: 20px;
  }
  .child-stat_heading {
    font-size: 20px;
  }
</style>

<script>
  import navigation from '../../components/Navigation.vue'

  export default {
    name: '',
    components: {
      navigation,
    },
    data() {
      return {
        children: [
          {
            name: 'Гобан',
            surname: 'Мохонов',
            proposals: [
              {
                name: 'Мехатроника',
                status: 'Курьер уже в пути',
                download: '',
                print: '',
              },
              {
                name: '4D театр',
                status: 'В печи',
                download: '',
                print: '',
              }
            ]
          },

        ]
      }
    },
    computed: {
      staus(stroke) {

      }
    }
  }
</script>
