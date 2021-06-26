<template>
  <main class="home">
      <navigation />

      <section class="home-content">

        <article class="card shadow" v-for="child in children">
          <h2 class="child-name">{{ child.name + ' ' + child.surname }}</h2>

          <article class="proposals">

            <section class="proposal" v-for="(proposal, index) in child.proposals">
              <div class="child-stat">
                <h3 class="proposal_heading">{{ proposal.name }}</h3>
                <figcaption class="child-stat_heading">Статус: {{ proposal.status }}</figcaption>
              </div>
              <div class="buttons">
                <button class="dark-button wp100" @click="downloadPdf(proposal.id, child, index)">Скачать</button>
                <button class="dark-button wp100" @click="downloadPdf(proposal.id, child, index)">Печатать</button>
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
  import {User} from '../../models/User';
  import {Proposal} from '../../models/Proposal';
  import {Parser} from '../../utils/Parser';

  export default {
    name: '',
    components: {
      navigation,
    },
    data() {
      return {
        children: []
      }
    },
    async created() {
      console.log(111, User, Proposal);
      const children = await User.getChildren({
        id: null,
        name: null,
        surname: null,
        proposals: {
          id: null,
          association: {
            name: null
          },
          status: {
            text: null
          }
        }
      }, false).then( data => data );

      children.map((child) => {
        const proposals = child.proposals.map(el => {
          return {
            id: el.id,
            name: el.association.name,
            //status: el.status[0].text,
            download: "",
            print: ""
          }
        });

        if (proposals.length > 0)
          this.children.push({
            name: child.name,
            surname: child.surname,
            proposals: proposals
          });
      });
    },
    methods: {
      downloadPdf(proposal_id, child, proposal_index) {
        const name = child.surname + "_" + child.name + "_" + child.proposals[proposal_index].name;
        Proposal.renderPdf(proposal_id, name);
      }
    },
    computed: {
      staus(stroke) {

      }
    }

  }
</script>
