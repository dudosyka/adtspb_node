<template>
	<main class="bg-wrapper">
		<Header />
	</main>
</template>

<style scoped>
	
</style>

<script>
import Header from '../components/Header'
import {Admin} from '../models/Admin'

export default {
    name: 'User',
    components: {
        Header
    },
    data() {
        return {
       
        }
    },
}
</script>