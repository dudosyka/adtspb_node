<template>
    <main class="bg-wrapper">
        <Header />
        <b-overlay :show="show.overlay">
            <b-card
                v-for="association of associations"
                :title="association.name"
            >
                <b-button-group>
                    <b-button
                        v-for="group of association.groups"
                        v-text="group.name"
                        @click="openGroup(group)"
                    />
                </b-button-group>
            </b-card>

            <b-modal
                :title="groupOpened.id"
                hide-footer
                v-model="show.modal"
                size="xl"
            >
                <b-tabs>
                    <b-tab title="Основной состав">
                        <b-button>Скачать в Excel</b-button>
                        <b-table
                            :items="groupOpened.students"
                            striped hover
                        >
                            <template
                                #cell(действия)="data"
                            >
                                <b-button-group>
                                    <b-button>
                                        Отозвать
                                    </b-button>
                                    <b-form-select>
                                        <template #first>
                                            <b-form-select-option :value="null" disabled>Статус</b-form-select-option>
                                        </template>
                                        <b-form-select-option :value="0">Any</b-form-select-option> <!-- TODO: Change options !-->
                                    </b-form-select>
                                    <b-form-select>
                                        <template #first>
                                            <b-form-select-option :value="null" disabled>Переведён</b-form-select-option>
                                        </template>
                                        <b-form-select-option :value="1">Первый год</b-form-select-option> <!-- TODO: change options !-->
                                    </b-form-select>
                                </b-button-group>
                            </template>
                        </b-table>
                    </b-tab>
                    <b-tab title="Резерв">
                        <b-button>Скачать в Excel</b-button>
                        <b-table
                            :items="groupOpened.students"
                            striped hover
                        >
                            <template
                                #cell(действия)="data"
                            >
                                <b-button-group>
                                    <b-button>
                                        Отозвать
                                    </b-button>
                                    <b-form-select>
                                        <template #first>
                                            <b-form-select-option :value="null" disabled>Статус</b-form-select-option>
                                        </template>
                                        <b-form-select-option :value="0">Any</b-form-select-option> <!-- TODO: Change options !-->
                                    </b-form-select>
                                    <b-form-select>
                                        <template #first>
                                            <b-form-select-option :value="null" disabled>Переведён</b-form-select-option>
                                        </template>
                                        <b-form-select-option :value="1">Первый год</b-form-select-option> <!-- TODO: change options !-->
                                    </b-form-select>
                                </b-button-group>
                            </template>
                        </b-table>
                    </b-tab>
                </b-tabs>
            </b-modal>
        </b-overlay>
    </main>
</template>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'

export default {
    name: "Teacher",
    components: {
        Header,
    },
    data() {
        return {
            show: {
                overlay: true,
                modal: false
            },
            associations: [],
            groupOpened: {}
        }
    },
    created() {
        this.show.overlay = true

        const fields = {
            id: null,
            name: null,
            groups: {
                id: null,
                name: null,
                students: {
                    surname: null,
                    name: null,
                    lastname: null,
                    email: null,
                    phone: null,
                }
            }
        }

        Admin.getAssociations(fields)
            .then(res => {
                this.associations = res
                this.show.overlay = false
            })
    },
    methods: {
        //WARNING: methods for fornt more stabilty
        openGroup(group) {
            const students = []

            for (let student of group.students) {
                console.log(student)
                let row = {
                    'фамилия': student.surname,
                    "имя": student.name,
                    "отчетво": student.lastname,
                    "почта": student.email,
                    "номер телефона": student.phone,
                    "действия": ''
                }
                students.push(row)
            }
            group.students  =  students
            this.groupOpened = group
            this.show.modal = true
        }
    }
}
</script>

<style scoped>

</style>