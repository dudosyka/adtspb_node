<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@import "./assets/styles/style.css";
@import "./assets/styles/input.css";
@import "./assets/styles/button.css";
@import "./assets/styles/text.css";

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

    },
    methods: {

    },
  }
</script>
