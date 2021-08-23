<template>
	<main class="bg-wrapper">
		<Header />
        <b-overlay :show="overlay">
        <article class="bg-wrapper content" fluid>
            <b-list-group>
                <b-list-group-item
                    v-for="association of associations"
                    v-text="association.name"
                    @click="openAssociation(association.id)"
                    button
                    :active="association.id === associationOpen.id"
                >
                </b-list-group-item>
            </b-list-group>
            <b-card v-if="associationOpen != null" class="sladjkfsdalsf">
                <b-card-header>{{associationOpen.name}} <b-badge pill variant='primary' class="woqewer">{{computedLength(associationOpen.proposals)}}</b-badge></b-card-header >
                <b-card
                    v-for="proposal of associationOpen.proposals"
                    :title="`${proposal.child.surname} ${proposal.child.name}`"
                >
                    <b-tabs>
                        <b-alert variant="success" class="slakjfklsdaf" :show="alert">Успешно 🥳</b-alert>
                        <b-tab title="Заявление" active>
                            <b-button-group>
                                <b-button @click="printProposal(proposal)">Печать заявления</b-button>
                                <b-button @click="printResolution(proposal)">Печать согласия на обработку персональных данных</b-button>
                            </b-button-group>
							<b-card-body v-if='proposal.selectedStatus.value != 0'>
							    <div>
							        <b-form-checkbox
							          unchecked-value="false"
							          v-model='proposal.isDocumentTaken'
							        >Документы принесены</b-form-checkbox>
							    </div>
							    <b-button @click="documentsTaken(proposal)" variant="success">Сохранить</b-button>
							</b-card-body>
							<b-card-body>
							    <b-card-text>
							        Статус заявления
							    </b-card-text>
							    <b-form-select :options="statuses" v-model='proposal.selectedStatus.value' /><br>
							    <b-button @click="changeProposalStatus(proposal)" variant="success">Сохранить</b-button>
							</b-card-body>
                            <b-card-body v-if='proposal.selectedStatus.value != 0'>
                                <b-card-text>
                                    Группа
                                </b-card-text>
                                <b-form-select :options="associationOpen.selectedGroups" v-model="proposal.isGroupSelected"/><br>
                                <b-button @click="joinGroup(proposal)" variant="success">Сохранить</b-button>
                            </b-card-body>
							<b-card-body v-if='proposal.selectedStatus.value != 0 && proposal.isDocumentTaken != 1'>
							    <b-button variant="danger" v-b-modal.confirmReturn>
							        Отозвать
							    </b-button>
                                <b-modal
                                    title="Вы уверенеы что хотите отозвать заявление? Его нельзя будет призвать обратно"
                                    id="confirmReturn"
                                    hide-footer
                                    >
                                    <b-button @click="recallProposal(proposal)" variant="danger">Отозвать</b-button>
                                </b-modal>
							</b-card-body>
                        </b-tab>
                        <b-tab title="Ребёнок">
                            <b-card-text>
                                Данные
                            </b-card-text>
                            <b-card-body>
                                <b-input-group prepend="Фамилия">
                                    <b-input  v-model='proposal.child.surname' />
                                </b-input-group>
                                <b-input-group prepend="Имя">
                                    <b-input v-model='proposal.child.name' />
                                </b-input-group>
                                <b-input-group prepend="Отчество">
                                    <b-input v-model='proposal.child.lastname' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group prepend="Дата рождения">
                                    <b-form-datepicker placeholder="" v-model="proposal.child.birthday" />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group  prepend="Почта">
                                    <b-input v-model='proposal.child.email' />
                                </b-input-group>
                                <b-input-group  prepend="Номер телефона">
                                    <b-input v-model='proposal.child.phone' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Пол
                                <b-form-radio :name="`sexChild${proposal.id}`" v-model='proposal.child.sex' :value="1">Мужской</b-form-radio>
                                <b-form-radio :name="`sexChild${proposal.id}`" v-model='proposal.child.sex' :value="0">Женский</b-form-radio>
                            </b-card-body>
                            <b-card-body>
                                <b-form-checkbox
                                    :value="1"
                                    :unchecked-value="0"
									 v-model='proposal.child.ovz'
                                >
                                    ОВЗ
                                </b-form-checkbox>
                                Тип ОВЗ<b-form-select :options="ovz_types" v-model="proposal.child.ovz_type.id" />
                            </b-card-body>
                            <b-card-body>
                                <b-form-checkbox
                                    :value="1"
                                    :unchecked-value="0"
                                    v-model='proposal.child.disability'
                                >
                                    Инвалидность
                                </b-form-checkbox>
                                Группа инвалидности<b-form-select :options="disability_types" v-model="proposal.child.disability_group.id"/>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group prepend="Учебное заведение (наименование)">
                                    <b-input v-model='proposal.child.studyPlace' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group  prepend="Гражданство">
                                    <b-input v-model='proposal.child.state' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group prepend="Степень родства">
                                    <b-input v-model="proposal.child.relationship" />
                                    <b-button @click="proposal.child.relationship = 'Законный представитель'">Законный представитель</b-button>
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Адрес регистрации
                                <b-input-group prepend="Город">
                                    <b-input v-model='proposal.child.registration_address.city' />
                                </b-input-group>
                                <b-input-group prepend="Район">
                                    <b-input v-model='proposal.child.registration_address.district' />
                                </b-input-group>
                                <b-input-group prepend="Улица">
                                    <b-input v-model='proposal.child.registration_address.street' />
                                </b-input-group>
                                <b-input-group prepend="Дом">
                                    <b-input v-model='proposal.child.registration_address.house' />
                                </b-input-group>
                                <b-input-group prepend="Квартира">
                                    <b-input v-model='proposal.child.registration_flat' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Адрес проживания
                                <b-input-group prepend="Город">
                                    <b-input v-model='proposal.child.residence_address.city' />
                                </b-input-group>
                                <b-input-group prepend="Район">
                                    <b-input v-model='proposal.child.residence_address.district' />
                                </b-input-group>
                                <b-input-group prepend="Улица">
                                    <b-input v-model='proposal.child.residence_address.street' />
                                </b-input-group>
                                <b-input-group prepend="Дом">
                                    <b-input v-model='proposal.child.residence_address.house' />
                                </b-input-group>
                                <b-input-group prepend="Квартира">
                                    <b-input v-model='proposal.child.residence_flat' />
                                </b-input-group>
                            </b-card-body>

                            <b-button
                                @click="saveChildData(proposal.child)"
                                variant="success">
                                Сохранить
                            </b-button>
                        </b-tab>

                        <b-tab title="Родитель">
                            <b-card-text>
                                Данные
                            </b-card-text>
							<b-card-body>
                                <b-input-group prepend="Фамилия">
                                    <b-input  v-model='proposal.parent.surname' />
                                </b-input-group>
                                <b-input-group prepend="Имя">
                                    <b-input v-model='proposal.parent.name' />
                                </b-input-group>
                                <b-input-group prepend="Отчество">
                                    <b-input v-model='proposal.parent.lastname' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group  prepend="Почта">
                                    <b-input v-model='proposal.parent.email' />
                                </b-input-group>
                                <b-input-group  prepend="Номер телефона">
                                    <b-input v-model='proposal.parent.phone' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Пол
                                <b-form-radio :name="`sexParent${proposal.id}`" v-model='proposal.parent.sex' :value="1">Мужской</b-form-radio>
                                <b-form-radio :name="`sexParent${proposal.id}`" v-model='proposal.parent.sex' :value="0">Женский</b-form-radio>
                            </b-card-body>
							<b-input-group  prepend="Гражданство">
								<b-input v-model='proposal.parent.state' />
							</b-input-group>
                            <b-card-body>
                                Адрес регистрации
                                <b-input-group prepend="Город">
                                    <b-input v-model='proposal.parent.registration_address.city' />
                                </b-input-group>
                                <b-input-group prepend="Район">
                                    <b-input v-model='proposal.parent.registration_address.district' />
                                </b-input-group>
                                <b-input-group prepend="Улица">
                                    <b-input v-model='proposal.parent.registration_address.street' />
                                </b-input-group>
                                <b-input-group prepend="Дом">
                                    <b-input v-model='proposal.parent.registration_address.house' />
                                </b-input-group>
                                <b-input-group prepend="Квартира">
                                    <b-input v-model='proposal.parent.registration_flat' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Адрес проживания
                                <b-input-group prepend="Город">
                                    <b-input v-model='proposal.parent.residence_address.city' />
                                </b-input-group>
                                <b-input-group prepend="Район">
                                    <b-input v-model='proposal.parent.residence_address.district' />
                                </b-input-group>
                                <b-input-group prepend="Улица">
                                    <b-input v-model='proposal.parent.residence_address.street' />
                                </b-input-group>
                                <b-input-group prepend="Дом">
                                    <b-input v-model='proposal.parent.residence_address.house' />
                                </b-input-group>
                                <b-input-group prepend="Квартира">
                                    <b-input v-model='proposal.parent.residence_flat' />
                                </b-input-group>
                            </b-card-body>
                            <b-button
                                @click="saveParentData(proposal.parent)"
                                variant="success">
                                Сохранить
                            </b-button>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </b-card>
        </article>
        </b-overlay>
	</main>
</template>

<style scoped>
.content {
    display: grid;
    grid-template-columns: auto 1fr;
}
.sladjkfsdalsf {
    overflow-y: scroll;
    max-height: 100vh;
    position: sticky;
    top: 0px;
}
.slakjfklsdaf {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
}
.woqewer {
    background-color: #00008b;
    padding: 5px;
}
</style>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'
import {Parser} from '../utils/Parser'
import {Proposal} from '../models/Proposal'
import clone from 'clone'

export default {
    name: 'Proposals',
    components: {
        Header
    },
    data() {
        return {
            associations: [],
            associationOpen: {},
			statuses: [
				{
					value: 0,
					text: "Отозвано"
				},
				{
					value: 1,
					text: "Подано"
				},
				{
					value: 2,
					text: "Кандидат на поступление"
				},
				{
					value: 3,
					text: "Другой статус"
				}
			],
			ovz_types: [{text:'I', value: 1},{text:'II', value: 2},{text:'III', value: 3}, {text:'IV', value: 4},{text:'V', value: 5},{text:'VI', value: 6},{text:'VII', value: 7},{text:'VIII', value: 8}],
            disability_types: [{text:'I', value: 1}, {text:'II', value: 2}, {text:'III', value: 3}],
            overlay: false,
            alert: false
        }
    },
    async created() {
        this.overlay = true
		await Admin.getAssociations({id: null, name: null})
            .then( res => {
                this.associations = res;
                this.overlay = false;
            });
    },
    methods: {
        showAlert() {
            this.alert = true
            setTimeout(() => {this.alert = false}, 3000)
        },
        openAssociation(association) {
          this.overlay = true;
          const fields = {
            name: null,
            groups: {
              id: null,
              name: null,
              num: null,
              closed: null,
            },
            proposals: {
              id: null,
              child: {
                id: null,
                name: null,
                surname: null,
                lastname: null,
                email: null,
                phone: null,
                sex: null,
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
                residence_flat: null,
              },
              parent: {
                id: null,
                name: null,
                surname: null,
                lastname: null,
                email: null,
                phone: null,
                sex: null,
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
                residence_flat: null,
              },
              isDocumentTaken: null,
              isGroupSelected: null,
			  isReserve: null,
              status: {
                id: null,
                num: null,
                text: null,
              }
            }
          }
            Admin.getAssociationById(fields, Number(association))
                  .then( res => {
                    console.log(res);
                      this.associationOpen = res;
                    this.associationOpen.proposals = (this.associationOpen.proposals ?? []).map(proposal => {
                          proposal.selectedStatus = {
                            value: proposal.status[0].num,
                            text: proposal.status[0].text
                          };

                          const birth = Parser.timestampToObj(proposal.child.birthday);

                          proposal.child.birthday = birth.year + "-" + birth.month + "-" + birth.day;

                          proposal.child.registration_address = Parser.addressToObj(proposal.child.registration_address);
                          proposal.child.residence_address = Parser.addressToObj(proposal.child.residence_address);

                          proposal.parent.registration_address = Parser.addressToObj(proposal.parent.registration_address);
                          proposal.parent.residence_address = Parser.addressToObj(proposal.parent.residence_address);

                          return proposal;
              			    })
                      this.associationOpen.groups = (this.associationOpen.groups ?? []).filter(group => { return !(group.closed) })
                      this.associationOpen.selectedGroups = []
                      this.associationOpen.groups = (this.associationOpen.groups ?? []).map(group => {
                              const obj = {
                                  value: group.id,
                                  text: group.name
                              }
                        this.associationOpen.selectedGroups.push(obj)
                          });
                    this.overlay = false
                      })
        },
        documentsTaken(proposal) {
            proposal.id = Number(proposal.id)
			Proposal.setDocumentTaken(proposal.id);
        },
        changeProposalStatus(proposal) {
			//TODO Когда бэк будет готов запилить
        },
        recallProposal(proposal) {
			  Proposal.recall(Number(proposal.id));
        },
        saveChildData(child) {
			const onSend = clone(child);
			onSend.birthday = Parser.birthdayToTimestamp(onSend.birthday);

			onSend.registration_address = Parser.objToAddress(onSend.registration_address);
			onSend.residence_address = Parser.objToAddress(onSend.residence_address);

			Admin.editUserData(onSend.id, onSend).then(this.showAlert())
        },
        saveParentData(parent) {
			const onSend = clone(parent);
			onSend.birthday = Parser.birthdayToTimestamp(onSend.birthday);

			onSend.registration_address = Parser.objToAddress(onSend.registration_address);
			onSend.residence_address = Parser.objToAddress(onSend.residence_address);

			Admin.editUserData(onSend.id, onSend).then(this.showAlert());
        },
		joinGroup(proposal) {
	    this.overlay = true
      proposal.isGroupSelected = Number(proposal.isGroupSelected)
      proposal.id = Number(proposal.id)
			Proposal.joinGroup(proposal.id, proposal.isGroupSelected)
          .finally(() => {
            this.overlay = false;
          });
		},
        printProposal(proposal) {
            this.overlay = true
            const fileName = `${proposal.child.surname}_${proposal.child.name}`
            Proposal.downloadPdf(proposal.id, fileName).then(data => this.overlay = false)
        },
        printResolution(proposal) {
            this.overlay = true
            Proposal.printResolution(proposal.child.id).then(data => this.overlay = false)
        },
        computedLength(arr) {
            if (arr !== undefined) return arr.length
        }
     },
}
</script>
