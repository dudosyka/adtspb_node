<template>
	<main class="bg-wrapper" style="min-height: 100vh">
		<Header />
        <b-overlay :show="overlay">
        <b-card-group deck class="asdf">
            <div class="container">
                <b-card title="Поиск запросам">
                    <b-card-body>
                        <b-input-group prepend='Фамилия'>
                            <b-input v-model="searchParms.surname"/>
                        </b-input-group>
                        <b-input-group prepend='Имя'>
                            <b-input v-model="searchParms.name"/>
                        </b-input-group>
                        <b-input-group prepend='Отчество'>
                            <b-input v-model="searchParms.lastname"/>
                        </b-input-group>
                    </b-card-body>
                    <b-button @click="search" variant="primary" block size="lg" style="width: 100%">Найти</b-button>     
                </b-card>
            </div>
            <!--
            <b-card v-for="request of requests">
                <b-button v-b-toggle="`${request.id}child`">{{request}}</b-button>
                <b-collapse :id="`${request.id}child`">
                    <b-card-body>
                        <b-card-group>
                            <b-card title="Parent name">
                                
                            </b-card>
                            <b-card title="Child name">

                            </b-card>
                        </b-card-group>
                    </b-card-body>
                    <b-card-body>
                        <b-button variant='success'>Сохранить</b-button>
                        <b-button variant='danger'>Удалить</b-button>
                    </b-card-body>
                </b-collapse>
            </b-card>
            !-->
        </b-card-group>
        </b-overlay>
	</main>
</template>

<style scoped>
.asdf {
    padding: 30px;
}
</style>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'

export default {
    name: 'Callback',
    components: {
        Header
    },
    data() {
        return {
            searchParms: {
                name: null,
                surname: null,
                lastname: null,
                isChild: null,
            },
            requests: [{id:1},{id:2},{id:3}],  
            overlay: false  
        }
    },
    created() {

    },
    methods: {
        search() {
            this.overlay = true
        },
    }
}
</script>