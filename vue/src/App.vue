<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/page">Page</router-link> |
      <router-link to="/signup">SignUp</router-link>
    </div>

    <router-view />
  </div>
</template>

<style>
@import "./assets/styles/style.css";
/*  hj */
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}s

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script type="text/javascript">

  export default {
    computed: {

    },
    components: {

    }
  }
</script>
