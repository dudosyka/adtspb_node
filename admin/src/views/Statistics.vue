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
        </header>
        <article class="card bg-card table-wrapper">
            <table class="table">
                <tr class="table_header">
                    <td>Название объединения</td>
                    <td>Планируемое количество</td>
                    <td>Фактическое количество</td>
                    <td>% наполненности</td>
                </tr>
                <tr v-for="association in stat.associations">
                    <td>{{ association.name }}</td>
                    <td>{{ association.planned }}</td>
                    <td>{{ association.actual }}</td>
                    <td>{{ association.fullness_percent }}%</td>
                </tr>
            </table>
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
            stat: {

            }
        }
    },
    async created() {
        this.stat = Admin.getStat().then(data => {
            this.stat = data
            console.log(data)
        })
    }
}

</script>
