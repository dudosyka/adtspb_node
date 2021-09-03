<template>
  <b-card>
    <download-excel
        :data   = "dataForExcel"
        worksheet = "GROUP_DATA"
        name    = "group_data.xls">
        <b-button>Скачать Excel</b-button>
    </download-excel>
    <b-table
        :items="students"
        :fields="fields"
        striped hover
        sticky-header
        responsive
    >
        <template
            #cell(proposal_is_document_taken)='data'
        >
            <b-badge variant='primary' pill class='woqewer' v-if='data.item.proposal_is_document_taken'>
                Да
            </b-badge>
            <b-badge variant='primary' pill class='woqewer-red' v-if='!data.item.proposal_is_document_taken'>
                Нет
            </b-badge>
        </template>
      <template
          #cell(действия)="data"
      >
        <b-button-group>
          <b-container>
            <b-row>
              <b-col>
                <b-form-select v-if="showEventManager" v-model="eventSelected[data.item.id]">
                  <b-form-select-option :value="null" disabled>Смена статуса</b-form-select-option>
                  <b-form-select-option :value="0">Отказались</b-form-select-option>
                  <b-form-select-option :value="1">Переден на второй год</b-form-select-option>
                  <b-form-select-option :value="2">Переден на третий год</b-form-select-option>
                  <b-form-select-option :value="3">Документы принесены</b-form-select-option>
                </b-form-select>
              </b-col>
              <b-col>
                <b-button v-if="showEventManager" @click="saveEvent(data.item.id, openedGroupId, data.item.proposal_id)" variant='success'>Сохранить</b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-form-select v-model="groupSelected[data.item.id]">
                  <b-form-select-option :value="null" disabled>Смена группы</b-form-select-option>
                  <b-form-select-option v-for="group of groups" v-if='group.id != openedGroupId' :value="group.id">{{ group.name }}</b-form-select-option>
                </b-form-select>
              </b-col>
              <b-col>
                <b-button @click="saveGroup(data.item.id, openedAssociationId, data.item.proposal_id)" variant='success'>Сохранить</b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-button-group>
      </template>
    </b-table>
  </b-card>
</template>

<script>
import {Proposal} from "../models/Proposal";
import json_excel from 'vue-json-excel'
import clone from 'clone';

export default {
  name: "StudentListTab",
  components: {
    "download-excel": json_excel,
  },
  props: {
    input: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: "Title"
    },
    showEventManager: {
      type: Boolean,
      default: true,
    },
    showDocumentTaken: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      students: [],
      groups: [],
      fields: [],
      groupSelected: {},
      eventSelected: {},
      openedGroupId: null,
      openedAssociationId: null,
      dataForExcel: null,
    }
  },
  async created() {
    if (this.showDocumentTaken) {
        this.fields = [{key: 'proposal_is_document_taken', label: "Документы принесены"}, 'Фамилия (ребенка)', 'Имя (ребенка)', 'Возраст ребенка', 'Имя (родителя)', 'Отчество (родителя)', 'Почта (родителя)', 'Номер телефона (родителя)', 'Действия']
    }
    else {
        this.fields = ['Фамилия (ребенка)', 'Имя (ребенка)', 'Возраст ребенка', 'Имя (родителя)', 'Отчество (родителя)', 'Почта (родителя)', 'Номер телефона (родителя)', 'Действия'];
    }

    if (this.input == "")
        this.students = [];
    else {
      const data = JSON.parse(this.input);
      console.log(data);
      this.students = data.students;
      this.students.map(el => {
        this.groupSelected[el.id] = null;
        this.eventSelected[el.id] = null;
      })

      this.openedGroupId = data.id;
      this.openedAssociationId = data.association_id;

      this.groups = data.groups;

      this.dataForExcel = clone(this.students).map(el => {
        delete el['Действия'];
        delete el.id;
        delete el.proposal_id;
        delete el.proposal_status_id;
        delete el.proposal_is_document_taken;
        el['Название объединения'] = data.association_name;
        el['Номер группы'] = data.name;
        return el;
      });
    }
  },
  methods: {
    async saveEvent(child, group, proposal_id) {
        let value = null, text = null;
        switch (this.eventSelected[child]) {
          case 0: {
            value = 0;
            text = "Отозвано";
            if (proposal_id) {
                await Proposal.recall(Number(proposal_id));
                value = null;
                break;
            }
            await Proposal.recallByStudent(child, group, { value, text });
            value = null;
            break;
          }
          case 1: {
            value = 3;
            text = "Переведен на 2 год";
            break;
          }
          case 2: {
            value = 4;
            text = "Переведен на 3 год";
            break;
          }
          case 3: {
              value = null;
              if (proposal_id) {
                  await Proposal.setDocumentTaken(Number(proposal_id));
                  break;
              }
              await Proposal.setDocumentTakenByStudent(Number(child), Number(group));
          }
        }

        if (value != null) {
            if (proposal_id) {
                await Proposal.editStatus(Number(proposal_id), { id: Number(proposal_status_id), value, text });
            }
            else {
                await Proposal.editStatusByStudent(child, group, { value, text });
            }
        }
    },
    async saveGroup(child, association, proposal_id) {
        if (proposal_id)
            return await Proposal.joinGroup(Number(proposal_id), Number(this.groupSelected[child]));
        await Proposal.setGroupByStudent(child, association, this.groupSelected[child]);
    }
  }
}
</script>

<style scoped>

.woqewer {
    background-color: #00008b;
    padding: 5px;
}

.woqewer-red {
    background-color: red;
	color: white;
    padding: 5px;
}
</style>
