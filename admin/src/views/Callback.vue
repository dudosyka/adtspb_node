<template>
	<main class="bg-wrapper" style="min-height: 100vh">
		<Header />
        <b-alert v-model="alert.show" class="asd">
            {{ alert.msg }} 🥳
        </b-alert>
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
                                                <!--<b-button class="col-sm" variant="danger" @click="cancelEditData(request)">Отклонить</b-button>!-->
                                            </b-row>
                                        </b-card-body>
                                    </b-collapse>
                                </b-container>
                            </b-card>
                        </b-overlay>
                    </b-tab>
                    <b-tab title="Удаление" @click="getChildOnDelet">
                        <b-card title="Запросы на удаление детей">
                            <!--<b-button @click="getChildOnDelet" variant="primary" block size="lg" style="width: 100%">Получить</b-button> !-->
                        </b-card>
                        <b-card 
                            style="margin-top: 10px"
                            v-for="request of requestsOnDelet"
                            :title="`${request.parent.surname} ${request.parent.name} хочет удалить ${request.child.surname} ${request.child.name}`"
                            :sub-title="`комментарий: ${request.comment}`"
                        >
                            <b-card-text>{{request.child.id}} id ребёнка</b-card-text>
                            <b-card-text>{{request.parent.id}} id родителя</b-card-text>
                            <b-card-body>
                                <b-row>
                                    <b-button class="col-sm" variant="success" @click="confirmRemoveChild(request)">Одобрить</b-button>
                                    <!--<b-button class="col-sm" variant="danger" @click="cancelDeletChild(request)">Отклонить</b-button>!-->
                                </b-row>
                            </b-card-body>
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
.asd {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
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
            alert: {
                msg: '',
                show: false,
            }
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
            const id = Number(request.id)
            Admin.confirmDataEditing(id).then( data => {
                this.overlay = false
                this.showAlert()
            } )
        },
        cancelEditData(request) {
            this.overlay = true
        },
        confirmRemoveChild(request) {
            this.overlay = true
            const id = Number(request.id)
            Admin.confirmRemoveChild(id)
                .then(data => {
                    this.overlay = false
                    this.showAlert()
                    window.location.reload()
                })
        },
        cancelDeletChild(request) {

        },
        showAlert(msg = 'Успешно!') {
            this.alert.show = true
            this.alert.msg = msg
            setTimeout(() => {
                this.alert.show = false
            }, 3000)
        }
    }
}
</script>