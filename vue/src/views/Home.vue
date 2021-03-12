<template>
  <div class="home">
    <h1>Home Page</h1>
    <button onclick='localStorage.removeItem("token");window.location = window.location;'>LOGOUT</button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
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
