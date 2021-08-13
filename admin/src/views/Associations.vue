<template>
	<main class="bg-wrapper">
		<Header /> 
		<ul class="assoc-list">
			<li v-for="i of associations" class="assoc-item bg-card">
				<h2 class="assoc-title">{{ i.name }}</h2>
				<button @click="openAssociation(i)" class="ft-dark">открыть</button>
			</li>
		</ul>
		<div v-if="show.association" class="card-wrapper">
			<article class="card bg-card">
				<button @click="show.association = false" class="bg-card ft-gray button-close">Х</button>
				<h2 class="card-title" v-text="association.name"></h2>
				<button class="ft-dark">Редактировать описание</button>
				<p class="card-text" v-text="association.description"></p>
			</article>
		</div>
	</main>
</template>

<style scoped>
main {
	min-height: 100vh;
}
.assoc-list {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: flex-end;
	padding: 30px;
	margin: 0;
	list-style: none;
}
.assoc-item {
	flex-grow: 1;
	display: grid;
	grid-template-columns: auto auto;
	grid-gap: 20px;
	align-items: center;
	height: min-content;
	width: min-content;
	padding: 20px;
	margin: 20px;
	border-radius: 20px;
}
.assoc-title {
	white-space: nowrap;
}
.assoc-descriptoin {

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
        	//WARN: this is test arr for demonstartion. Just will say me, what back return arr
            associations: [
            	{
            		name: 'Test association',
            		description: 'Bla bla bla',
            	},
            	{
            		name: 'Test association',
            		description: 'Bla bla bla',
            	},
            	{
            		name: 'Test association',
            		description: 'Bla bla bla',
            	},
            	{
            		name: 'Test association',
            		description: 'Bla bla bla',
            	},
            	{
            		name: 'Test association',
            		description: 'Bla bla bla',
            	},
            	{
            		name: 'Test association',
            		description: 'Bla bla bla',
            	},
            ],
            association: {
            	name: null,
            	description: null
            },
            show: {
            	association: false,
            }
        }
    },
    methods: {
    	openAssociation(i) { //i - information
    		console.log(i)
    		this.show.association = true
    		this.association = i
    	}
    },
}
</script>