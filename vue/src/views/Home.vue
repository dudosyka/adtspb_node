<template>
  <main class="home">
    <navigation />

    <article class="home-content">
      <h1>Home Page</h1>
      <button onclick='localStorage.removeItem("token");window.location = window.location;'>LOGOUT</button>
    </article>
  </main>
</template>

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
        }
    },
    methods: {
    },
    async created()
    {
        this.token = localStorage.getItem('token');
    }
  }
</script>
