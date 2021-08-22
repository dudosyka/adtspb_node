<template>
    <main class="bg-wrapper">
        <Header />
        <b-overlay :show="overlay">
        <header class="header">
            <h2 class="ft-gray">Общее число родителей:</h2>
            <h2 class="ft-white">{{ stat.parent_amount }}</h2>

            <h2 class="ft-gray">Общее число детей:</h2>
            <h2 class="ft-white">{{ stat.child_amount }}</h2>

            <h2 class="ft-gray">Всего подано заявлений:</h2>
            <h2 class="ft-white">{{ stat.proposal_amount }}</h2>

            <h2 class="ft-gray">Основного набора:</h2>
            <h2 class="ft-white">{{  }} нет данных</h2>

            <h2 class="ft-gray">Резерва:</h2>
            <h2 class="ft-white">{{  }} нет данных</h2>
        </header>

        <b-card>
            <div class="row-right">
                <download-excel
                    :data   = "dataForExcel"
                    worksheet = "ADT-stats"
                    name    = "adt_stats.xls">
                    <b-button>Скачать Excel</b-button>
                </download-excel>
            </div>
            <b-table striped hover :items="stat.associations" :fields="stat.fields" class="sdfsdkfajha"></b-table>
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
            overlay: false
        }
    },
    async created() {
        this.overlay = true
        this.stat = Admin.getStat().then(data => {
            data.fields = [
                { key: 'id', label: '№', },
                { key: 'name', label: 'Название объединения', },
                { key: 'planned', label: 'Планируемое количество', },
                { key: 'actual', label: 'Фактическое количество', },
                { key: 'fullness_percent', label: '% наполненности', },
            ];
            const fields = {
                id: "#",
                name: "Название объединения",
                planned: "Планируемое количество",
                actual: "Фактическое количество",
                fullness_percent: "% наполненности",
            }
            console.log();
            this.stat = data;
            console.log(`get Stat `, data);
            let first = true;
            this.dataForExcel = data.associations.map(el => {
                let res = {
                    "Общее число детей": "",
                    "Общее число родителей": "",
                    "Всего подано заявлений": "",
                };
                if (first) {
                    first = false;
                    res["Общее число детей"] = data.child_amount;
                    res["Общее число родителей"] = data.parent_amount;
                    res["Всего подано заявлений"] = data.proposal_amount;
                }
                Object.keys(el).map(key => {
                    res[fields[key]] = el[key];
                    if (key == "name") {
                        res['Количество групп'] = el.planned / 15;
                    }
                });
                this.overlay = false
                return res;
            });
            console.log(this.dataForExcel);
        })
    }
}

</script>
