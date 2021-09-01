<template>
    <main class="bg-wrapper">
        <Header />
        <b-card>
            <b-button>Развернуть</b-button>
            <b-collapse>
                <b-card>

                </b-card>
            </b-collapse>
        </b-card>
    </main>
</template>

<script>
import Header from '../components/Header'
import Admin from '../models/Admin'

export default {
    name: "Teacher",
    components: {
        Header,
    },
    data() {
        return {
            associations: []
        }
    },
    created() {
        Admin.getAssociations()
            .then(res => {
                console.log(res)
                this.associations = res
            })
    },
}
</script>

<style scoped>

</style>