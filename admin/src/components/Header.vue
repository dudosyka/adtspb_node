<template>
	<header class="bg-card">
		<h1>ADTSPB Admin</h1>
		<nav class="links-container">
			<router-link to="/statistics">Статистика в тесте</router-link>
			<router-link to="/associations">Объединения</router-link>
			<router-link to="/proposals">Заявления</router-link>
			<router-link to="/users">Пользователи</router-link>
			<router-link to="/callback">Запросы</router-link>
		</nav>
	</header>
</template>

<style scoped>
	* {
		color: #c4c4c4;
	}
	header {
		padding: 30px;
		display: grid;
		grid-template-columns: auto 1fr;
		grid-gap: 30px;
	}
	.links-container {
		display: grid;
		grid-template-columns: repeat(5, auto) 1fr;
		justify-items: center;
		align-items: center;
		grid-gap: 20px;
	}
	.link--active {

	}
	.link {

	}
</style>

<script>
</script>