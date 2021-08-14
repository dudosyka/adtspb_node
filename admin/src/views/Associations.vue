<template>
	<main class="bg-wrapper">
		<Header /> 
		<ul class="assoc-list">
			<li v-for="i of associations" class="assoc-item bg-card">
				<h2 class="assoc-title">{{ i.name }}</h2>
				<button @click="openAssociation(i)" class="ft-dark button-gray">открыть</button>
			</li>
		</ul>
		<div v-if="show.association" class="card-wrapper">
			<article class="card bg-card">
				<button @click="show.association = false" class="bg-card ft-gray button-close">Х</button>
				<h2 class="card-title" v-text="association.name"></h2>
				
				<section class="container assoc-description">
					<h3>Описание</h3>
					<textarea 
						v-model="association.description" 
						cols="50" rows="5"
						maxlength="10000" 
						placeholder="Описание объединения" 
						:readonly="true"
					></textarea>
					<button class="ft-dark button-gray">Редактировать описание</button>
				</section>

				<section class="container">
					<h3>Рассписание групп</h3>
					<article class="groups-container">
						<ul class="group-list">
							<li class="group-list_item"
								:class="{'group-list_item--active': group.show}" 
								v-for="group of association.groups" 
								v-text="group.name" 
								@click="association.groups.map(el => el.show = false); group.show = true"
							></li>
						</ul>
						<ul class="group-data-list">
							<li v-for="group of association.groups">
								<table>
									<tr v-for="(time, day) of group.timetable" v-if="group.show">
										<td v-text="day"></td><td v-text="time"></td>
									</tr>
								</table>
							</li>
						</ul>
					</article>
				</section>
			</article>
		</div>
	</main>
</template>

<style scoped>
main {
	min-height: 100vh;
}
.card-wrapper {
	padding: 30px 30px 0 30px;
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
.assoc-description textarea {
	margin-bottom: 5px;
}
.groups-container {
	display: grid;
	grid-template-columns: auto 1fr;
}
.group-list, .group-data-list {
	list-style: none;
	padding: 0;
	margin: 0;
}
.group-list_item {
	padding: 5px;
}
.group-list_item:hover {
	cursor: pointer;
}
.group-list_item--active {
	text-decoration: underline;
}
.group-data-list td {
	padding: 5px 10px;
}
.container h3 {
	margin-bottom: 5px;
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
            		description: 'Bla bla bla slkfh skafhsa sakfhsadkl safkjhsakfl sadkkfhsadkf sadkfhskdf fsakdfh sakdfhsdks skafhs skkafh ksahfsa  sakdfh safk saksdahfskdfhs fksadfh skadfhskd sdkfhsad sdjfhsdka sadkfjhsda',
            		groups: [
            			{	
            				show: true,
            				name: 'group 1',
            				timetable: {
            					'понедельник': '17:00 - 18:00',
            					'суббота': '17:00 - 18:00',
            					'четверг': '17:00 - 18:00',
            					'пятница': '17:00 - 18:00',
            				}
            			},
            			{	
            				show: false,
            				name: 'group 2',
            				timetable: {
            					'понедельник': '17:00 - 18:00',
            					'суббота': '17:00 - 18:00',
            					'четверг': '17:00 - 18:00',
            					'пятница': '17:00 - 18:00',
            				}
            			}
            		]
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
    		this.show.association = true
    		this.association = i
    	}
    },
}
</script>