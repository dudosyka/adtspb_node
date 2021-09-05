<template>
    <main class="bg-wrapper">
        <Header />
        <b-alert
          :show="show.warn.crowded"
          class="sdlakfjslad"
          variant="danger"
          dismissible
        >
          Группа переполнена
        </b-alert>
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
                  <b-button @click="openNotDocumentTaken(association)">Не принесли документы</b-button>
                  <b-button @click="openNotGroupSelected(association)">Не выбрали группу</b-button>
                </b-button-group>
            </b-card>

            <b-modal
                :title="groupOpened.name + ' (Количество детей в группе: ' + groupOpened.students.length + ')'"
                hide-footer
                v-model="show.modal"
                size="xl"
                @close='load'
            >
                <StudentList :input="JSON.stringify(groupOpened)" />
            </b-modal>

            <b-modal
                title="Резерв"
                hide-footer
                v-model="show.reserveModal"
                size="xl"
                @close='load'
            >
                <StudentList :show-event-manager="false" :show-document-taken="true" :input="JSON.stringify(reserveOpened)" />
            </b-modal>

            <b-modal
                title="Не принесли документы"
                hide-footer
                v-model="show.notDocumentTakenModal"
                size="xl"
                @close='load'
            >
                <StudentList :input="JSON.stringify(notDocumentTaken)" />
            </b-modal>

            <b-modal
                title="Не выбрали группу"
                hide-footer
                v-model="show.notGroupSelectedModal"
                size="xl"
                @close='load'
            >
                <StudentList :input="JSON.stringify(notGroupSelected)" />
            </b-modal>

        </b-overlay>
    </main>
</template>

<script>
import Header from '../components/Header'
import StudentList from '../components/StudentList'
import {Admin} from '../models/Admin'
import {User} from '../models/User'
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
                notDocumentTakenModal: false,
                notGroupSelectedModal: false,
                warn: {
                  crowded: false,
                }
            },
            associations: [],
            groupOpened: {students: []},
            reserveOpened: {students: []},
            notDocumentTaken: {students: []},
            notGroupSelected: {students: []}
        }
    },
    created() {
        this.load();
    },
    methods: {
        load(event) {
            this.show.overlay = true

            const fields = {
                id: null,
                name: null,
                proposals: {
                  id: null,
                  isReserve: null,
                  isDocumentTaken: null,
                  isGroupSelected: null,
                  status: {
                      id: null,
                  },
                  child: {
                    id: null,
                    surname: null,
                    name: null,
                    birthday: null,
                    parent: {
                        name: null,
                        lastname: null,
                        email: null,
                        phone: null,
                    }
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
                        birthday: null,
                        parent: {
                            name: null,
                            lastname: null,
                            email: null,
                            phone: null,
                        }
                    }
                }
            }

            Admin.getAssociations(fields)
                .then(res => {
                    this.associations = res
                    this.show.overlay = false
                })
        },
        //WARNING: methods for fornt more stabilty
        createObjectForTable(association, opened) {
            console.log(opened);
          const students = [];

          for (let student of opened.students) {
            let row = {
              'id': student.id,
              'proposal_id': student.proposal_id,
              'proposal_status_id': student.proposal_status_id,
              'proposal_is_document_taken': student.proposal_is_document_taken,
              'Фамилия (ребенка)': student.surname,
              'Имя (ребенка)': student.name,
              'Возраст ребенка': User.calculateAgeFromTimestamp(Number(student.birthday)),
              'Имя (родителя)': student.parent.name,
              'Отчество (родителя)': student.parent.lastname,
              'Почта (родителя)': student.parent.email,
              'Номер телефона (родителя)': student.parent.phone,
              'Действия': ''
            };
            students.push(row);
          }

          const tableData = clone(opened);
          tableData.association_name = association.name;
          tableData.groups = association.groups.map(el => ({
            name: el.name,
            id: el.id,
          }));
          tableData.association_id = association.id;
          tableData.id = this.openedGroupId;
          tableData.students = clone(students);
          return tableData
        },

        openGroup(association, opened) {
            this.groupOpened = this.createObjectForTable(association, opened);
            this.show.modal = true;
        },
        getOnOpen (association, filterCallback) {
            const onOpen = {
              students: association.proposals.filter(el => filterCallback(el)).map(el => ({
                  ...clone(el.child),
                  parent: clone(el.child.parent),
                  proposal_id: el.id,
                  proposal_status_id: el.status[0].id,
                  proposal_is_document_taken: el.isDocumentTaken,
              }))
            };

            return onOpen;
        },

        openReserve(association) {
            this.reserveOpened = this.createObjectForTable(association, this.getOnOpen(association, el => el.isReserve));
            this.show.reserveModal = true;
        },

        openNotDocumentTaken(association) {
            this.notDocumentTaken = this.createObjectForTable(association, this.getOnOpen(association, el => (!el.isReserve && !el.isDocumentTaken)));
            this.show.notDocumentTakenModal = true;
        },

        openNotGroupSelected(association) {
            this.notGroupSelected = this.createObjectForTable(association, this.getOnOpen(association, el => (!el.isReserve && el.isGroupSelected == 0)));
            this.show.notGroupSelectedModal = true;
        },

        showWarn() {
          this.show.warn.crowded = true
          setTimeout(() => { this.show.warn.crowded = false}, 3000)
        }
    }
}
</script>

<style scoped>
    .modal-xl {
        max-width: 80% !important;
    }
    .sdlakfjslad {
      position: fixed;
      z-index: 999;
      top: 15px;
      left: 50%; transform: translateX(-50%);
    }
</style>
