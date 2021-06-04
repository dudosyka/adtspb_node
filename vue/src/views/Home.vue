<template>
  <main class="home">
    <navigation />

    <article class="home-content">
      <section class="card shadow">
        <h1 class="main-heading">Добро пожаловать</h1>
        <button class="dark-box dark-button" onclick='localStorage.removeItem("token");window.location = window.location;'>Выйти</button>

      </section>

    </article>


  </main>
</template>

<style scoped>
  .main-heading {
    font-size: 1.5rem;
    color: #142732;
    margin-bottom: 20px;
  }
</style>

<script>
  // @ is an alias to /src
  import navigation from '../components/Navigation.vue'

  export default {
    name: 'Home',
    components: {
      navigation,
    },
    data() {
        return {
          cards: [],
          user: {
            name: null
          }
        }
    },
    created() {

    },
    methods: {

    },
    async created()
    {
        this.token = localStorage.getItem('token');
    }
  }
</script>
