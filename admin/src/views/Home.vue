<template>
    <main class="bg-wrapper">
        <Header />
        <header class="header">
            <h2 class="ft-gray">Общее число родителей:</h2>
            <h2 class="ft-white">ыыыы</h2>

            <h2 class="ft-gray">Общее число детей:</h2>
            <h2 class="ft-white">ыыы</h2>

            <h2 class="ft-gray">Всего подано заявлений:</h2>
            <h2 class="ft-white">ы</h2>
        </header>
        <article class="card bg-card table-wrapper">
            <table class="table">
                <tr class="table_header">
                    <td>Название объединения</td>
                    <td>Планируемое количество</td>
                    <td>Фактическое количество</td>
                    <td>% наполненности</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
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
}
.table {
    width: 100%;
    min-width: 1000px;
    border-collapse: collapse;
}
.tabel_col {
    width: 25%;
    min-width: 100px;
}
.table_header {
    padding: 5px;
    font-weight: normal;
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

export default {
    name: 'home',
    components: {
        Header
    },
    data() {
        return {

        }
    }
}

</script>
