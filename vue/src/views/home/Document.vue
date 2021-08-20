<template>
    <main class="home">
        <navigation />

        <article class="home-content">
            <div class="card shadow">
                <h1>Если не произошло автоматическое направление, нажмите на кнопку ниже</h1>
                <a class="dark-button" href="https://widget.easyweek.io/act/">Открыть</a>
            </div>
        </article>
    </main>
</template>

<style scoped>
.home-content {
    padding: 30px;
}
.warning-container {
    padding: 20px;
    margin-bottom: 30px;
    max-width: 600px;
    min-width: 300px;
    box-sizing: border-box;
}
.link-container {
    padding: 10px;
    height: 35px;
    display: flex;
    justify-content: space-around;
    background-color: #615d39;
    border-radius: 30px;
}  
.card {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
}
</style>

<script>
  import navigation from '../../components/Navigation.vue'

  export default {
    name: '',
    components: {
      navigation,
    },
    mounted() {
        window.open('https://widget.easyweek.io/act/', '_blank')
    },
    data() {
      return {

      }
    },
  }
</script>
