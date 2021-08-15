<template>
    <main class="bg-wrapper">
        <Header />
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

        <article class="bg-card table-wrapper">
            <div class="row-right">
                <b-button>Скачать Excel</b-button>   
            </div> 
            <b-table striped hover :items="stat.associations" :fields="stat.fields"></b-table>
        </article>
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

export default {
    name: 'statistics',
    components: {
        Header
    },
    data() {
        return {
            stat: []
        }
    },
    async created() {
        this.stat = Admin.getStat().then(data => {
            data.fields = [
                { key: 'id', label: '№', },
                { key: 'name', label: 'Название объединения', },
                { key: 'planned', label: 'Планируемое количество', },
                { key: 'actual', label: 'Фактическое количество', },
                { key: 'fullness_percent', label: '% наполненности', },
            ]
            console.log()
            this.stat = data
            console.log(`get Stat `, data)
        })
    }
}

</script>
