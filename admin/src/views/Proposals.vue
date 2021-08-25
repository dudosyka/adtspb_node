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
            <b-card v-if="Object.keys(associationOpen) != 0" class="sladjkfsdalsf">
                <b-card-header>{{associationOpen.name}} <b-badge pill variant='primary' class="woqewer">{{computedLength(associationOpen.proposals)}}</b-badge></b-card-header >
				<b-card
				    :title="`${proposal.child.surname} ${proposal.child.name}`"
					 v-for='proposal of associationOpen.proposals'
				>
					<b-button @click='toggleProposal(proposal)'>
						{{ (openedProposal[proposal.id]) ? 'Свернуть' : 'Развернуть' }}
	                </b-button>
                    <b-collapse v-model="openedProposal[proposal.id]">
                        <ProposalCard v-if='openedProposal[proposal.id]' :input='JSON.stringify(proposal)' />
                    </b-collapse>
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

.woqewer-red {
    background-color: red;
	color: white;
    padding: 5px;
}
</style>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'
import {Parser} from '../utils/Parser'
import {Proposal} from '../models/Proposal'
import clone from 'clone'
import ProposalCard from '../components/ProposalCard'

export default {
    name: 'Proposals',
    components: {
        Header,
		ProposalCard
    },
    data() {
        return {
            associations: [],
            associationOpen: {},
			openedProposal: {},
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
        this.overlay = true;
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
					this.associationOpen = res;
					this.associationOpen.proposals = (this.associationOpen.proposals ?? []).map(proposal => {
						this.$set(this.openedProposal, proposal.id, false);
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
					});

					this.associationOpen.groups = (this.associationOpen.groups ?? []).filter(group => { return !(group.closed) })
					this.associationOpen.selectedGroups = []
					this.associationOpen.groups = (this.associationOpen.groups ?? []).map(group => {
						const obj = {
							value: group.id,
							text: group.name
						}
						this.associationOpen.selectedGroups.push(obj)
					});
					this.overlay = false;
				});
        },
        toggleProposal(proposal) {
            this.openedProposal[proposal.id] = !this.openedProposal[proposal.id]
        },
		computedLength(arr) {
            if (arr !== undefined) return arr.length
        }
     },
}
</script>
