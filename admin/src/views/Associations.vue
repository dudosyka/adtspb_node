<template>
	<main class="bg-wrapper">
		<Header /> 
		<!-- layout system of bootstrap is bad !-->
		<article class="content">
			<b-list-group>
				<b-list-group-item
					v-for="association of associations"
					@click=""
				button>
					{{ association.name }}
				</b-list-group-item>
			</b-list-group>
			<b-card class="association">
				<b-form-input />
				<b-form-textarea></b-form-textarea>
				<b-form-input />

				<article>
					<b-list-group v-for="group of association.groups">
						{{ group.name }}
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