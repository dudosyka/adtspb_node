<template>
	<main class="bg-wrapper">
		<Header />
        <b-card-group deck class="asdf">
            <b-card v-for="request of requests">
                <b-button v-b-toggle="`${request.id}child`">{{request}}</b-button>
                <b-collapse :id="`${request.id}child`">
                    <b-card-body>
                        <b-button variant='success'>Сохранить</b-button>
                        <b-button variant='danger'>Удалить</b-button>
                    </b-card-body>
                </b-collapse>
            </b-card>
        </b-card-group>
	</main>
</template>

<style scoped>
.asdf {
    padding: 30px;
}
</style>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'

export default {
    name: 'Callback',
    components: {
        Header
    },
    data() {
        return {
            requests: [{id:1},{id:2},{id:3}],    
        }
    },
    created() {

    }
}
</script>