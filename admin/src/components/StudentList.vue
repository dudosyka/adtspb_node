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
        striped hover
        sticky-header
        responsive
    >
      <template
          #cell(действия)="data"
      >
        <b-button-group>
          <b-form-select v-if="showEventManager" v-model="eventSelected[data.item.id]">
            <b-form-select-option :value="null" disabled>Статус</b-form-select-option>
            <b-form-select-option :value="0">Отозвать</b-form-select-option>
            <b-form-select-option :value="1">Переден на второй год</b-form-select-option>
            <b-form-select-option :value="2">Переден на третий год</b-form-select-option>
          </b-form-select>
          <b-button v-if="showEventManager" @click="saveEvent(data.item.id, openedGroupId)" variant='success'>Сохранить</b-button>
          <b-form-select v-model="groupSelected[data.item.id]">
            <b-form-select-option :value="null" disabled>Группа</b-form-select-option>
            <b-form-select-option v-for="group of groups" :value="group.id">{{ group.name }}</b-form-select-option>
          </b-form-select>
          <b-button @click="saveGroup(data.item.id, openedAssociationId)" variant='success'>Сохранить</b-button>
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
    }
  },
  data() {
    return {
      students: [],
      groups: [],
      groupSelected: {},
      eventSelected: {},
      openedGroupId: null,
      openedAssociationId: null,
      dataForExcel: null,
    }
  },
  async created() {

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
        return el;
      });
    }
  },
  methods: {
    async saveEvent(child, group) {
        let value = null, text = null;
        switch (this.eventSelected[child]) {
          case 0: {
            value = 0;
            text = "Отозвано";
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
        }

        if (value != null)
          await Proposal.editStatusByStudent(child, group, { value, text });
    },
    async saveGroup(child, association) {
        await Proposal.setGroupByStudent(child, association, this.groupSelected[child]);
    }
  }
}
</script>

<style scoped>

</style>
