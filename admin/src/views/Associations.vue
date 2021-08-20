<template>
	<main class="bg-wrapper">
		<Header /> 
		<!-- layout system of bootstrap is bad !-->
		<article class="content">
			<b-list-group class="assoc-list">
				<b-list-group-item
					v-for="association of associations"
					@click="openAssociation(association)"
					v-text="association.name"
					button
					:active="associationOpen.id === association.id"
				/>
			</b-list-group>
			<b-card>
				<b-form-input v-model="associationOpen.name" />
				<b-form-textarea v-model="associationOpen.description"></b-form-textarea>

				<!-- the prop append must be string !-->
				<b-card-body>
					<b-input-group prepend="Минимальный возраст" :append="`${associationOpen.min_age}`">
						<b-form-input type="range" min="6" max="18" v-model="associationOpen.min_age" /> 				
					</b-input-group>
					<b-input-group prepend="Максимальный возраст" :append="`${associationOpen.max_age}`">
						<b-form-input type="range" min="6" max="18" v-model="associationOpen.max_age" /> 				
					</b-input-group>
				</b-card-body>

				<b-card-body>
					<b-input-group prepend="Лет обучения" :append="`${associationOpen.study_years}`">
						<b-form-spinbutton v-model="associationOpen.study_years" /> 				
					</b-input-group>
					<b-input-group prepend="Часов в неделю" :append="`${associationOpen.hours_week}`">
						<b-form-spinbutton v-model="associationOpen.hours_week" /> 				
					</b-input-group>
					<b-input-group prepend="Зантий в неделю" :append="`${associationOpen.lessons_week}`">
						<b-form-spinbutton v-model="associationOpen.lessons_week" /> 				
					</b-input-group>
				</b-card-body>

				<b-card-body>
					<b-row no-gutters>
						<b-col>
							<b-list-group>
								<b-list-group-item
									v-for="group of associationOpen.groups"
									@click="openGroup(group)"
									button
									:active="group === groupOpen"
								>
									<b-input-group>
										<b-form-input v-model="group.name"></b-form-input>
										<b-input-group-append>
											<b-button variant="light">></b-button>
										</b-input-group-append>
									</b-input-group>
								</b-list-group-item>
							</b-list-group>	
						</b-col>
						<b-col>
							<h6>Внимание!!! Очень важно заполнять данные в формате ЧЧ.ММ-ЧЧ.ММ ЧЧ.ММ-ЧЧ.ММ иначе объединение удалиться</h6>
							<b-input-group v-for="(day, id) of groupOpen.timetable.week" :prepend="nToDay(id)">
								<b-form-input v-model="groupOpen.timetable.week[id]"></b-form-input>
								<!--<b-form-timepicker @context="timetableRaw[id].start" placeholder="начало" locale="de" />
								<b-form-timepicker @context="timetableRaw[id].end" placeholder="конец" locale="de" />!-->
							</b-input-group>
						</b-col>
					</b-row>
				</b-card-body>
			</b-card>
		</article>
	</main>
</template>

<style scoped>
.content {
	display: grid;
	grid-template-columns: auto 1fr;
}

.assoc-list {
	overflow-y: scroll;
	max-height: 100vh;
}
.association {
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 10px;
}
 
</style>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'
import {Corrector} from '../utils/Corrector'

export default {
    name: 'associations',
    components: {
        Header
    },
    data() {
        return {
        	associations: [],
        	associationOpen: {},
        	groupOpen: {},
        	timetableRaw: {},
        }
    },
    created() {
 		Admin.getAssociations().then( data => {
 			this.associations = data
 			this.associationOpen = this.associations[0]
 			this.groupOpen = this.associationOpen.groups[0]
 		})
    },
    methods: {
    	openAssociation(association) {
    		this.associationOpen = association
    		this.groupOpen = association.groups[0]
    	},
    	openGroup(group) {
    		this.groupOpen = group
    		this.timetable = this.toRawTimetable(group.timetable)
    	},
    	/*
    	toRawTimetable(timetable) {
    		this.timetable = timetable.map( day => {
    			if (day !== "") {
    				day = day.split(' ')
    				return
    			}
    		})
    	},
    	*/
    	nToDay(number) { 
    		return Corrector.weekDayByNumber(number)
    	},

    },
    computed: {

    }
}
</script>