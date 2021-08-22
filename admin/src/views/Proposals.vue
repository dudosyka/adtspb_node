<template>
	<main class="bg-wrapper">
		<Header />
        <b-overlay :show="overlay">
        <article class="bg-wrapper content" fluid>
            <b-list-group>
                <b-list-group-item
                    v-for="association of associations"
                    v-text="association.name"
                    @click="openAssociation(association)"
                    button
                    :active="association === associationOpen"
                >
                </b-list-group-item>
            </b-list-group>
            <b-card :title="associationOpen.name" class="sladjkfsdalsf">
                <b-card
                    v-for="proposal of associationOpen.proposals"
                    :title="`${proposal.child.surname} ${proposal.child.name}`"
                >
                    <b-tabs>
                        <b-tab title="Заявление" active>
							<b-card-body v-if='proposal.selectedStatus.value != 0'>
							    <div>
							        <b-form-checkbox
							          unchecked-value="false"
							          v-model='proposal.isDocumentTaken'
							        >Документы принесены</b-form-checkbox>
							    </div>
							    <b-button v-if='proposal.isDocumentTaken != 1' @click="documentsTaken(proposal)" variant="success">Сохранить</b-button>
							</b-card-body>
							<b-card-body>
							    <b-card-text>
							        Статус заявления
							    </b-card-text>
							    <b-form-select :options="statuses" v-model='proposal.selectedStatus.value' /><br>
							    <b-button @click="changeProposalStatus(proposal)" variant="success">Сохранить</b-button>
							</b-card-body>
                            <b-card-body>
                                <b-card-text>
                                    Группа
                                </b-card-text>
                                <b-form-select /><br>
                                <b-button @click="changeProposalStatus(proposal)" variant="success">Сохранить</b-button>
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
                                    <b-form-datepicker placeholder="" />
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
                                <b-form-radio name="sex" v-model='proposal.child.sex' :value="1">Мужской</b-form-radio>
                                <b-form-radio name="sex" v-model='proposal.child.sex' :value="0">Женский</b-form-radio>
                            </b-card-body>
                            <b-card-body>
                                <b-form-checkbox
                                    :value="1"
                                    :unchecked-value="0"
									 v-model='proposal.child.ovz'
                                >
                                    ОВЗ
                                </b-form-checkbox>
                                Тип ОВЗ<b-form-select :options="ovz_types" />
                            </b-card-body>
                            <b-card-body>
                                <b-form-checkbox
                                    :value="1"
                                    :unchecked-value="0"
                                >
                                    Инвалидность
                                </b-form-checkbox>
                                Группа инвалидности<b-form-select :options="disability_types" />
                            </b-card-body>
                            <b-card-body>
                                <b-input-group prepend="Учебное заведение (наименование)">
                                    <b-input v-model='proposal.child.studyPlace' />
                                </b-input-group>
                            </b-card-body>
							<b-input-group  prepend="Гражданство">
								<b-input v-model='proposal.child.state' />
							</b-input-group>
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
                                <b-form-radio name="sex" v-model='proposal.parent.sex' :value="1">Мужской</b-form-radio>
                                <b-form-radio name="sex" v-model='proposal.parent.sex' :value="0">Женский</b-form-radio>
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
        }
    },
    async created() {
        this.overlay = true
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
				status: {
					id: null,
					num: null,
					text: null,
				}
			}
		}
		this.associations = await Admin.getAssociations(fields)
		.then(res => res.map(el => {
			el.proposals = (el.proposals ?? []).map(proposal => {
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
            this.overlay = false
			return el;
		}));
        this.associationOpen = this.associations[0]
    },
    methods: {
        openAssociation(association) {
            this.associationOpen = association
        },
        documentsTaken(proposal) {
			Proposal.setDocumentTaken(proposal.id);
        },
        changeProposalStatus(proposal) {
			//TODO Когда бэк будет готов запилить
        },
        recallProposal(proposal) {
			console.log(proposal);2
			Proposal.recall(Number(proposal.id));
        },
        saveChildData(child) {
			const onSend = clone(child);
			onSend.birthday = Parser.birthdayToTimestamp(onSend.birthday);

			onSend.registration_address = Parser.objToAddress(onSend.registration_address);
			onSend.residence_address = Parser.objToAddress(onSend.residence_address);

			Admin.editUserData(onSend.id, onSend);
        },
        saveParentData(parent) {
			const onSend = clone(parent);
			onSend.birthday = Parser.birthdayToTimestamp(onSend.birthday);

			onSend.registration_address = Parser.objToAddress(onSend.registration_address);
			onSend.residence_address = Parser.objToAddress(onSend.residence_address);

			Admin.editUserData(onSend.id, onSend);
        },
		joinGroup(proposal) {
			Proposal.joinGroup(proposal.id, proposal.isGroupSelected);
		}
     },
}
</script>
