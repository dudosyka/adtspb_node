<template>
    <main class="home">
        <navigation />

        <section class="home-content">
            <section v-if="children.length > 0" class="warning-container shadow">
                <p>Кнопки <em>печати</em> и <em>скачивания</em> документов станут доступными перед началом приема документов. Объявление об это будет размещено заранее, следите за информацией в официальных сообщества Академии Цифровых Технологий и <a href="https://adtspb.ru" target="_blank" class="link_text">на сайте</a>.</p>
                <div class="link-container">
                    <div class="social-media-list li">
                        <a href="https://t.me/adtspb" class="fab fa-telegram-plane social-media-link" target="_blank"></a>
                    </div>
                    <div class="social-media-list li">
                        <a href="https://vk.com/adtspb" class="fab fa-vk social-media-link" target="_blank"></a>
                    </div>
                    <div class="social-media-list li">
                        <a href="https://www.facebook.com/adtspb" class="fab fa-facebook-square social-media-link" target="_blank"></a>
                    </div>
                    <div class="social-media-list li">
                        <a href="https://www.instagram.com/adtspb" class="fab fa-instagram social-media-link" target="_blank"></a>
                    </div>
                </div>
            </section>

            <p v-if="children.length < 1" class="warning-container">Заявления еще не сформированы. (Перейдите в раздел "Мои дети", чтобы сформировать новое заявление)</p>

            <article class="card shadow children" v-for="child in children">
                <h2 class="child-name">{{ child.name + ' ' + child.surname }}</h2>
                <button class="light-button" @click='printResolution(child.id)' :disabled="!inDev">Распечатать согласие на обработку персональных данных</button>

                <article class="proposals wp100">

                    <section class="proposal" v-for="(proposal, index) in child.proposals">
                        <div class="child-stat">
                            <h3 class="proposal_heading">{{ proposal.name }}</h3>
                            <figcaption class="child-stat_heading">Статус: {{ proposal.status.text }}</figcaption>
                        </div>
                        <div class="buttons" v-if='proposal.status.num !== 0'>

                            <button class="dark-button wp100" @click="downloadPdf(proposal.id, child, index)" :disabled="!inDev">Скачать</button>
                            <button class="dark-button wp100" @click="printPdf(proposal.id)" :disabled="!inDev">Печатать</button>

                            <button v-if='!proposal.isDocumentTaken' class="dark-button wp100" @click="proposal.sure = true">Отозвать</button>
                            <section class="card_wrapper horizontal-center" v-if="proposal.sure">
                                <article class="card modal shadow">
                                    <p class="modal_heading">Вы уверены, что хотите отозвать заявления?</p>
                                    <div class="buttons-row">
                                        <button @click="recall(child, proposal.id, index)" class="dark-button">Да</button>
                                        <button class="dark-button" @click="proposal.sure = false">Нет</button>
                                    </div>
                                </article>
                            </section>
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
.warning-container {
    padding: 20px;
    margin-bottom: 30px;
    max-width: 600px;
    min-width: 300px;
    box-sizing: border-box;
}
.link-container {
    padding: 10px;
    height: 35px;
    display: flex;
    justify-content: space-around;
    background-color: #615d39;
    border-radius: 30px;
}
.buttons {
    max-width: 200px;
}
.card_wrapper {
    z-index: 11;
    background-color:hsla(0, 0%, 94%, 0.5);
    backdrop-filter: blur(10px);
}
.modal {
    margin-top: 50px;
}
.modal_heading {
    margin: 0;
    margin-bottom: 20px;
}
.buttons-row {
    padding: 0 20px;
    box-sizing: border-box;
}
.proposal {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 40px;
    flex-wrap: wrap;
    padding: 20px;
}
@media (max-width: 600px) {
    .proposal {
        grid-template-columns: 1fr;
    }
}
.proposal_heading {
    font-size: 22px;
    word-break: break-all;
}
.child-name {
    margin-bottom: 10px;
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
  import AppConfig from '../../config/AppConfig';

  export default {
    name: '',
    components: {
      navigation,
    },
    data() {
      return {
        children: [],
        show: {
            sure: [],
        },
        user: {
            areSure: null
        },
        inDev: AppConfig.inDev
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
            text: null,
            num: null
        },
        isDocumentTaken: null
        }
      }, false).then( data => {
          // console.log(data);
          return data;
      } );

      children.map((child) => {
        const proposals = child.data.proposals.map(el => {
          return {
            id: el.id,
            name: el.association.name,
            status: el.status.length ? { ...el.status[0] } : { text: "", num: 0 },
            download: "",
            print: "",
            sure: false,
          }
        });

        if (proposals.length > 0)
          this.children.push({
            id: child.data.id,
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
        },
        printResolution(child_id) {
            Proposal.printResolution(child_id);
        },
        recall(child, proposal_id, proposal_index) {
            console.log(child, proposal_id, proposal_index);
            Proposal.recall(proposal_id)
            .then(data => {
                if (data) {
                    child.proposals[proposal_index].status.num = 0;
                    child.proposals[proposal_index].status.text = "Отозвано";
                    this.show.sure = false;
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    },
    computed: {
      staus(stroke) {

      }
    }

  }
</script>
