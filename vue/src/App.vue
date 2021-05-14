<template>
  <div id="app">
    <router-view />

    <div id="nav">
      <b>Temporary nav bar!</b> <br>
      <router-link to="/">Home</router-link> |
      <router-link to="/page">Page</router-link> |
      <router-link to="/signup">SignUp</router-link>
    </div>
  </div>
</template>

<style>
@import "./assets/styles/style.css";
/*  hj */
#nav {
  padding: 30px;
  border-top: 5px dashed #ab2d2d;
  background-color: #ffd1d1;
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
