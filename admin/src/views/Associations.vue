<template>
	<main class="bg-wrapper">
		<Header /> 
		<!-- layout system of bootstrap is bad !-->
		<article class="content">
			<b-list-group>
				<b-list-group-item
					v-for="association of associations"
					@click="openAssociation(association)"
					v-text="association.name"
					button
					:active="associationOpen.id === association.id"
				/>
			</b-list-group>
			<b-card class="association">
				<b-form-input />
				<b-form-textarea></b-form-textarea>
				<b-form-input />

				<article>
					<b-list-group v-for="">
					</b-list-group>
					<section>
						<!-- will be schendule !-->
					</section>
				</article>
			</b-card>
		</article>
	</main>
</template>

<style scoped>
main {
	min-height: 100vh;
}
.content {
	display: grid;
	grid-template-columns: auto 1fr;
}
 
</style>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'

export default {
    name: 'associations',
    components: {
        Header
    },
    data() {
        return {
        	associations: [],
        	associationOpen: {
        		id: null,
        	}
        }
    },
    created() {
 		Admin.getAssociations().then( data => this.associations = data)
    },
    methods: {
    	openAssociation(association) {
    		this.associationOpen = association
    	}
    },
}
</script>