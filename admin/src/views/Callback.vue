<template>
	<main class="bg-wrapper" style="min-height: 100vh">
		<Header />
        <b-card-group deck class="asdf">
            <div class="container">
                <b-tabs>
                    <b-tab title="Редактирование">
                        <b-card title="Поиск запросам на редактирование данных">
                        <b-card-body>
                            <b-input-group prepend='Фамилия'>
                                <b-input v-on:keyup.enter="search" v-model="searchString"/>
                            </b-input-group>
                        </b-card-body>
                        <b-button @click="search" variant="primary" block size="lg" style="width: 100%">Найти</b-button>     
                        </b-card><br>
                        <b-overlay :show="overlay">
                            <b-card v-for="request of requestsOnEdit" style="margin-top: 10px">
                                <b-container>
                                    <b-row>
                                        <b-card 
                                            class="col-sm"
                                            :title="`кто ${request.requester.surname} ${request.requester.name} ${request.requester.lastname}`"
                                        />
                                        <b-card
                                            class="col-sm" 
                                            :title="`кому ${request.requester.surname} ${request.requester.name} ${request.requester.lastname}`"
                                        />
                                    </b-row>
                                    <b-button v-b-toggle="`requestsOnEdit${request.id}`">Развернуть</b-button>
                                    <b-collapse :id="`requestsOnEdit${request.id}`">
                                        <b-row>
                                            <b-card 
                                                class="col-sm"
                                                title="Старые данные"
                                            >
                                                <b-card-text
                                                    v-text="request.old_value"
                                                />
                                            </b-card>
                                            <b-card 
                                                class="col-sm"
                                                title="Новые данные"
                                            >
                                                <b-card-text
                                                    v-text="request.new_value"
                                                />
                                            </b-card>
                                        </b-row>
                                        <b-card-body>
                                            <b-row>
                                                <b-button class="col-sm" variant="success" @click="acceptEditData(request)">Одобрить</b-button>
                                                <b-button class="col-sm" variant="danger" @click="cancelEditData(request)">Отклонить</b-button>
                                            </b-row>
                                        </b-card-body>
                                    </b-collapse>
                                </b-container>
                            </b-card>
                        </b-overlay>
                    </b-tab>
                    <b-tab title="Удаление">
                        <b-card title="Запросы на удаление детей">
                            <b-button @click="getChildOnDelet" variant="primary" block size="lg" style="width: 100%">Получить</b-button> 
                        </b-card>
                    </b-tab>
                </b-tabs>
            </div>
        </b-card-group>
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
            searchString: null,
            requestsOnEdit: [],
            requestsOnDelet: [],  
            overlay: false, 
        }
    },
    created() {

    },
    methods: {
        search() {
            this.overlay = true
            Admin.getDataOnEdit(this.searchString)
                .then( data => {
                    this.requestsOnEdit = data
                    this.overlay = false
                } )
        },
        getChildOnDelet() {
            this.overlay = true
            Admin.getChildOnDelet()
                .then( data => {
                    this.requestsOnDelet = data
                    this.overlay = false
                } ) 
        },
        acceptEditData(request) {
            this.overlay = true
        },
        cancelEditData(request) {
            this.overlay = true
        }
    }
}
</script>