<template>
    <main class="bg-wrapper">
        <Header />
        <b-overlay :show="overlay">
            <b-card>
                <b-button></b-button>
                <b-collapse>

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
            overlay: false
        }
    },
}
</script>

<style scoped>

</style>