<template>
  <main class="home">
    <navigation />

    <article class="home-content">
      <section class="card shadow">
        <h1 class="main-heading">Добро пожаловать</h1>
        <button class="dark-box dark-button" onclick='localStorage.removeItem("token"); window.location.reload();'>Выйти</button>
      </section>

      <FullUserData></FullUserData>

    </article>


  </main>
</template>

<style scoped>
  .home-content {
    padding: 30px;
  }
  .main-heading {
    font-size: 1.5rem;
    color: #142732;
    margin-bottom: 20px;
  }
</style>

<script>
  // @ is an alias to /src
  import navigation from '../components/Navigation.vue'
  import FullUserData from '../components/forms/FullUserData'


  export default {
    name: 'Home',
    components: {
      navigation, FullUserData
    },
    data() {
        return {
            cards: [],
        }
    },
    methods: {
    },
    async created()
    {
    }
  }
</script>
