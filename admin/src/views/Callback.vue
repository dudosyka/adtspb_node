<template>
	<main class="bg-wrapper" style="min-height: 100vh">
		<Header />
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
                <b-overlay :show="overlay">
                <b-card v-if="searchStep" title="Результаты поиска">
                    <b-container>
                        <b-card>
                            <b-card-text>
                                Данные
                            </b-card-text>
                            <b-card-body>
                                <b-input-group prepend="Фамилия">
                                    <b-input  v-model='proposal.child.surname' />
                                    <b-input  v-model='target' />
                                </b-input-group>
                                <b-input-group prepend="Имя">
                                    <b-input v-model='proposal.child.name' />
                                </b-input-group>
                                <b-input-group prepend="Отчество">
                                    <b-input v-model='proposal.child.lastname' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group prepend="Дата рождения">
                                    <b-form-datepicker placeholder="" v-model="proposal.child.birthday" />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group  prepend="Почта">
                                    <b-input v-model='proposal.child.email' />
                                </b-input-group>
                                <b-input-group  prepend="Номер телефона">
                                    <b-input v-model='proposal.child.phone' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Пол
                                <b-form-radio :name="`sexChild${proposal.id}`" v-model='proposal.child.sex' :value="1">Мужской</b-form-radio>
                                <b-form-radio :name="`sexChild${proposal.id}`" v-model='proposal.child.sex' :value="0">Женский</b-form-radio>
                            </b-card-body>
                            <b-card-body>
                                <b-form-checkbox
                                    :value="1"
                                    :unchecked-value="0"
                                     v-model='proposal.child.ovz'
                                >
                                    ОВЗ
                                </b-form-checkbox>
                                Тип ОВЗ<b-form-select :options="ovz_types" v-model="proposal.child.ovz_type.id" />
                            </b-card-body>
                            <b-card-body>
                                <b-form-checkbox
                                    :value="1"
                                    :unchecked-value="0"
                                    v-model='proposal.child.disability'
                                >
                                    Инвалидность
                                </b-form-checkbox>
                                Группа инвалидности<b-form-select :options="disability_types" v-model="proposal.child.disability_group.id"/>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group prepend="Учебное заведение (наименование)">
                                    <b-input v-model='proposal.child.studyPlace' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group  prepend="Гражданство">
                                    <b-input v-model='proposal.child.state' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                <b-input-group prepend="Степень родства">
                                    <b-input v-model="proposal.child.relationship" />
                                    <b-button @click="proposal.child.relationship = 'Законный представитель'">Законный представитель</b-button>
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Адрес регистрации
                                <b-input-group prepend="Город">
                                    <b-input v-model='proposal.child.registration_address.city' />
                                </b-input-group>
                                <b-input-group prepend="Район">
                                    <b-input v-model='proposal.child.registration_address.district' />
                                </b-input-group>
                                <b-input-group prepend="Улица">
                                    <b-input v-model='proposal.child.registration_address.street' />
                                </b-input-group>
                                <b-input-group prepend="Дом">
                                    <b-input v-model='proposal.child.registration_address.house' />
                                </b-input-group>
                                <b-input-group prepend="Квартира">
                                    <b-input v-model='proposal.child.registration_flat' />
                                </b-input-group>
                            </b-card-body>
                            <b-card-body>
                                Адрес проживания
                                <b-input-group prepend="Город">
                                    <b-input v-model='proposal.child.residence_address.city' />
                                </b-input-group>
                                <b-input-group prepend="Район">
                                    <b-input v-model='proposal.child.residence_address.district' />
                                </b-input-group>
                                <b-input-group prepend="Улица">
                                    <b-input v-model='proposal.child.residence_address.street' />
                                </b-input-group>
                                <b-input-group prepend="Дом">
                                    <b-input v-model='proposal.child.residence_address.house' />
                                </b-input-group>
                                <b-input-group prepend="Квартира">
                                    <b-input v-model='proposal.child.residence_flat' />
                                </b-input-group>
                            </b-card-body>
                        </b-card>
                        <b-card>
                            
                        </b-card>
                    </b-container>
                </b-card>
                </b-overlay>
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
            },
            requests: [{id:1},{id:2},{id:3}],  
            overlay: false,
            searchStep: 1, //0 - haven't for show, 1 - have for show; use for JS constrol  
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