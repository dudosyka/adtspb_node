<template>
  <main class="home">
      <navigation />

      <section class="home-content">

        <article class="card shadow children" v-for="child in children">
          <h2 class="child-name">{{ child.name + ' ' + child.surname }}</h2>

          <article class="proposals wp100">

            <section class="proposal" v-for="(proposal, index) in child.proposals">
              <div class="child-stat">
                <h3 class="proposal_heading">{{ proposal.name }}</h3>
                <figcaption class="child-stat_heading">Статус: {{ proposal.status }}</figcaption>
              </div>
              <div class="buttons">
                <button class="dark-button wp100" @click="downloadPdf(proposal.id, child, index)">Скачать</button>
                <button class="dark-button wp100" @click="printPdf(proposal.id)">Печатать</button>
              </div>
            </section>

          </article>
        </article>

      </section>
  </main>
</template>

<style scoped>
  .home-content {
    padding: 30px;
  }
  .children {
    max-width: 600px;
    min-width: 300px;
  }
  @media (max-width: 400px) {
    .home-content {
      padding: 10px;
    }
  }
  .proposals {

  }
  .buttons {
    max-width: 200px;
  }
  .proposal {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 20px;
  }
  .proposal_heading {
    font-size: 22px;
  }
  .child-stat {
    align-self: center;
    display: grid;
    grid-gap: 20px;
    margin-bottom: 10px;
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
      localStorage.setItem('newProposal', false)
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
        const proposals = child.data.proposals.map(el => {

          return {
            id: el.id,
            name: el.association.name,
            status: el.status.length ? el.status[0].text : "",
            download: "",
            print: ""
          }
        });

        if (proposals.length > 0)
          this.children.push({
            name: child.data.name,
            surname: child.data.surname,
            proposals: proposals
          });
      });
    },
    methods: {
        generateProposalName(child, proposal_index) {
            return child.surname + "_" + child.name + "_" + child.proposals[proposal_index].name;
        },
        downloadPdf(proposal_id, child, proposal_index) {
            Proposal.downloadPdf(proposal_id, this.generateProposalName(child, proposal_index));
        },
        printPdf(proposal_id) {
            Proposal.printPdf(proposal_id);
        }
    },
    computed: {
      staus(stroke) {

      }
    }

  }
</script>
