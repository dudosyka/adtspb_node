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
                            <b-card-body>
                                <div>
                                    <b-form-checkbox
                                      unchecked-value="false"
                                    >Документы принесены</b-form-checkbox>
                                </div>
                                <b-button @click="documentsIsHere(proposal)" variant="success">Сохранить</b-button>
                            </b-card-body>
                            <b-card-body>
                                <b-card-text>
                                    Статус заявлени
                                </b-card-text>
                                <b-form-select options="" /><br> 
                                    <!-- 
                                        options="" to> :options="variable" ; and add v-model="" 
                                        options = arr of objects: {value: '', text: ''}
                                    !-->
                                <b-button @click="changeProposalStatus(proposal)" variant="success">Сохранить</b-button>
                            </b-card-body>
                            <b-card-body>
                                <b-button @click="returnProposal(proposal)" variant="danger">
                                    Отозвать
                                </b-button>
                            </b-card-body>
                        </b-tab>
                        <b-tab title="Ребёнок">
                            
                        </b-tab>
                        <b-tab title="Родитель">
                            
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

export default {
    name: 'Proposals',
    components: {
        Header
    },
    data() {
        return {
            associations: [{name:'adf', proposals: [{child:{name: 'name', surname: 'surname'}, status: {num: 3, id: 3}}]}],
            associationOpen: {}
        }
    },
    created() {
        this.associationOpen = this.associations[0]
    },
    methods: {
        openAssociation(association) {
            this.associationOpen = association
        },
        documentsIsHere(proposal) {

        },
        changeProposalStatus(proposal) {

        }, 
        returnProposal(propoasl) {

        },

    },
}
</script>