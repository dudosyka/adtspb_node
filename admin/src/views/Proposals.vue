<template>
	<main class="bg-wrapper">
		<Header />
        <article class="bg-wrapper content" fluid>
            <b-list-group>
                <b-list-group-item
                    v-for="association of associations"
                    v-text="association.name"
                    @click="openAssociation(association)"
                    button
                    :active="association.id === associationOpen.id"
                >
                </b-list-group-item>
            </b-list-group>
            <b-card :title="associationOpen.name">
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
							<b-card-body v-if='proposal.selectedStatus.value != 0 && proposal.isDocumentTaken != 1'>
							    <b-button @click="recallProposal(proposal)" variant="danger">
							        Отозвать
							    </b-button>
							</b-card-body>
                        </b-tab>
                        <b-tab title="Ребёнок">
                            <b-card-text>
                                Данные
                            </b-card-text>
                            <b-card-body>
                                <b-input-group prepend="Фамилия">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Имя">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Отчество">
                                    <b-input />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group prepend="Дата рождения">
                                    <b-form-datepicker placeholder="" />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group  prepend="Почта">
                                    <b-input />
                                </b-input-group>
                                <b-input-group  prepend="Номер телефона">
                                    <b-input />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Пол
                                <b-form-radio name="sex" :value="1">Мужской</b-form-radio>
                                <b-form-radio name="sex" :value="0">Женский</b-form-radio>
                            </b-card-body>
                            <b-card-body>
                                <b-form-checkbox
                                    :value="1"
                                    :unchecked-value="0"
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
                                    <b-input />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Адрес регистрации
                                <b-input-group prepend="Город">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Район">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Улица">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Дом">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Квартира">
                                    <b-input />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Адрес проживания
                                <b-input-group prepend="Город">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Район">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Улица">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Дом">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Квартира">
                                    <b-input />
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
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Имя">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Отчество">
                                    <b-input />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group prepend="Дата рождения">
                                    <b-form-datepicker placeholder="" />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group  prepend="Почта">
                                    <b-input />
                                </b-input-group>
                                <b-input-group  prepend="Номер телефона">
                                    <b-input />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Пол
                                <b-form-radio name="sex" :value="1">Мужской</b-form-radio>
                                <b-form-radio name="sex" :value="0">Женский</b-form-radio>
                            </b-card-body>
                            <b-card-body>
                                Адрес регистрации
                                <b-input-group prepend="Город">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Район">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Улица">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Дом">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Квартира">
                                    <b-input />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Адрес проживания
                                <b-input-group prepend="Город">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Район">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Улица">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Дом">
                                    <b-input />
                                </b-input-group>
                                <b-input-group prepend="Квартира">
                                    <b-input />
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
	</main>
</template>

<style scoped>
.content {
    display: grid;
    grid-template-columns: auto 1fr;
}
</style>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'
import {Proposal} from '../models/Proposal'

export default {
    name: 'Proposals',
    components: {
        Header
    },
    data() {
        return {
            associations: [{name:'adf', proposals: [{child:{name: 'name', surname: 'surname'}, status: {num: 3, id: 3}}]}],
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

        }
    },
    async created() {
		const fields = {
			name: null,
			proposals: {
				id: null,
				child: {
					name: null,
					surname: null,
				},
				isDocumentTaken: null,
				status: {
					id: null,
					num: null,
					text: null,
				}
			}
		}
		this.associations = await Admin.getAssociations(fields).then(res => res.map(el => {
			el.proposals = (el.proposals ?? []).map(proposal => {
				proposal.selectedStatus = {
					value: proposal.status[0].num,
					text: proposal.status[0].text
				};
				return proposal;
			})
			return el;
		}));
		console.log(this.associations);
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

        },
        saveParentData(parent) {

        }
     },
}
</script>
