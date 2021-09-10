<template>
    <main class="bg-wrapper">
        <Header />
        <b-overlay :show="overlay">
        <header class="header">

          <template v-if="!hideNumbers">
            <h2 class="ft-gray">Общее число родителей:</h2>
            <h2 class="ft-white">{{ stat.parent_amount }}</h2>

            <h2 class="ft-gray">Общее число детей:</h2>
            <h2 class="ft-white">{{ stat.child_amount }}</h2>

            <h2 class="ft-gray">Всего подано заявлений:</h2>
            <h2 class="ft-white">{{ stat.proposal_amount }}</h2>

            <h2 class="ft-gray">Всего принесено заявлений:</h2>
            <h2 class="ft-white">{{ stat.proposal_amount_document_taken }}</h2>

            <h2 class="ft-gray">Основного набора:</h2>
            <h2 class="ft-white">{{ stat.proposal_amount - stat.proposal_reserve_amount }}</h2>

            <h2 class="ft-gray">Резерва:</h2>
            <h2 class="ft-white">{{ stat.proposal_reserve_amount }}</h2>
            </template>


        </header>

        <b-card>
            <div class="row-right">
              <download-excel
                  :data   = "dataForExcel"
                  worksheet = "ADT-stats"
                  name    = "adt_stats.xls">
                <b-button variant="success">
                  Скачать в excel
                </b-button>
              </download-excel>
            </div>
            <b-table sticky-header striped hover :items="stat.associations" :fields="stat.fields" class="sdfsdkfajha"></b-table>
        </b-card>
        </b-overlay>
    </main>
</template>

<style scoped>
main {
    min-height: 100vh;
    width: 100%;
}
.header {
    padding: 20px;
    display: grid;
    grid-template-columns: max-content auto;
    grid-gap: 15px 10px;
    overflow-x: auto;
    color: #c4c4c4;
}
.card {
    border-radius: 40px 40px 0 0;
}

.table-wrapper {
    overflow-x: auto;
    min-height: 64vh;
    padding:  30px;
}
.table {
    width: 100%;
    min-width: 1000px;
    border-collapse: collapse;
}
.table_header {
    table-layout: fixed;
    padding: 5px;
    font-weight: bold;
    width: 100%;
}
.table tr {

}
.table td {
    border-bottom: 3px solid #626161;
    padding: 10px;
}
</style>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'
import json_excel from 'vue-json-excel'

console.log('JSON', json_excel);

export default {
    name: 'statistics',
    components: {
        Header,
        "download-excel": json_excel,
    },
    data() {
        return {
            stat: [],
            dataForExcel: [
              { colA: "Hello", colB: "World" },
              {
                colA: "Multi-line",
                /* Multi-line value: */
                colB:
                  "This is a long paragraph\nwith multiple lines\nthat should show in a single cell.",
              },
              { colA: "Another", colB: "Regular cell" },
            ],
            overlay: false,
            hideNumbers: false,
        }
    },
    async created() {
        this.overlay = true
        this.stat = Admin.getStat().then(data => {
            data.fields = [
                { key: 'id', label: '№', },
                { key: 'name', label: 'Название объединения', },
                { key: 'group_amount', label: 'Количество групп', },
                { key: 'planned', label: 'Планируемое количество', },
                { key: 'actual', label: 'Фактическое количество', },
                { key: 'document_taken', label: 'Принесено документов', },
                { key: 'fullness_percent', label: '% наполненности', },
            ];
            const fields = {
                id: "#",
                name: "Название объединения",
                group_amount: 'Количество групп',
                planned: "Планируемое количество",
                actual: "Фактическое количество",
                fullness_percent: "% наполненности",
                document_taken: 'Принесено документов',
            }
            this.stat = data;
            let first = true;
            this.dataForExcel = data.associations.map(el => {
                let res = {
                    "Общее число детей": "",
                    "Общее число родителей": "",
                    "Всего подано заявлений": "",
                    "Всего принесено заявлений": "",
                    "Основного набора": "",
                    "Резерва": "",
                };
                if (first) {
                    first = false;
                    res["Общее число детей"] = data.child_amount;
                    res["Общее число родителей"] = data.parent_amount;
                    res["Всего подано заявлений"] = data.proposal_amount;
                    res["Всего принесено заявлений"] = data.proposal_amount_document_taken;
                    res["Основного набора"] = data.proposal_amount - data.proposal_reserve_amount;
                    res["Резерва"] = data.proposal_reserve_amount;;
                }
                Object.keys(el).map(key => {
                    res[fields[key]] = el[key];
                });
                this.overlay = false
                return res;
            });
            console.log(this.dataForExcel);
        });
        if (hasRole(12)) {
          this.hideNumbers = true;
        }
    }
}

</script>
