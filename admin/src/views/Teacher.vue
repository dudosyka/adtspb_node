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
                        @click="openGroup(association, group)"
                    />
                  <b-button @click="openReserve(association)">Резерв</b-button>
                </b-button-group>
            </b-card>

            <b-modal
                :title="groupOpened.name"
                hide-footer
                v-model="show.modal"
                size="xl"
            >
                <StudentList :input="JSON.stringify(groupOpened)" />
            </b-modal>

            <b-modal
                title="Резерв"
                hide-footer
                v-model="show.reserveModal"
                size="xl"
            >
                <StudentList :show-event-manager="false" :input="JSON.stringify(reserveOpened)" />
            </b-modal>
        </b-overlay>
    </main>
</template>

<script>
import Header from '../components/Header'
import StudentList from '../components/StudentList'
import {Admin} from '../models/Admin'
import clone from 'clone'

export default {
    name: "Teacher",
    components: {
        Header, StudentList
    },
    data() {
        return {
            show: {
                overlay: true,
                modal: false,
                reserveModal: false,
            },
            associations: [],
            groupOpened: {},
            reserveOpened: {},
        }
    },
    created() {
        this.show.overlay = true

        const fields = {
            id: null,
            name: null,
            proposals: {
              id: null,
              isReserve: null,
              child: {
                id: null,
                surname: null,
                name: null,
                lastname: null,
                email: null,
                phone: null,
              }
            },
            groups: {
                id: null,
                name: null,
                association_id: null,
                students: {
                    id: null,
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
        createObjectForTable(association, opened) {
          const students = [];

          for (let student of opened.students) {
            let row = {
              'id': student.id,
              'Фамилия': student.surname,
              "Имя": student.name,
              "Отчетво": student.lastname,
              "Почта (ребенка)": student.email,
              "Номер телефона (ребенка)": student.phone,
              "Действия": ''
            };
            students.push(row);
          }

          const tableData = clone(opened);
          tableData.groups = association.groups.map(el => ({
            name: el.name,
            id: el.id,
          }));
          tableData.students = clone(students);
          return tableData
        },

        openGroup(association, opened) {
            this.groupOpened = this.createObjectForTable(association, opened);
            this.show.modal = true;
        },
        openReserve(association) {
            const onOpen = {
              students: association.proposals.filter(el => el.isReserve).map(el => ({ ...el.child}))
            };
            this.reserveOpened = this.createObjectForTable(association, onOpen);
            this.show.reserveModal = true;
        }
    }
}
</script>

<style scoped>

</style>
