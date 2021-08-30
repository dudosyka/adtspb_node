<template>
    <main class="bg-wrapper">
        <Header />
        <b-overlay :show="overlay">
            <b-card v-for="association in associations">
                <b-button v-b-toggle="`Association${association.id}`"></b-button>
                <b-collapse :id="`Association${association.id}`">
                    <b-tabs>
                        <b-tab
                            v-for="group in association.groups"
                            :title="group.name"
                        >

                        </b-tab>
                    </b-tabs>
                </b-collapse>
            </b-card>
        </b-overlay>
    </main>
</template>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'

export default {
    name: "Teacher.vue",
    components: {
        Header
    },
    data() {
        return {
            overlay: false,
            associations: [],
        }
    },
    created() {
        this.overlay = true
        Admin.getAssociations().then(data => {
            this.associations = data
            this.overlay = false
        })
    },
    methods: {

    },
}
</script>

<style scoped>

</style>