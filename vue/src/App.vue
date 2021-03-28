<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/page">Page</router-link> |
      <router-link to="/signup">SignUp</router-link>
    </div>

    <component :is="layout">
        <router-view />
    </component>
  </div>
</template>

<style>
@import "./assets/styles/style.css";

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
  import AuthLayout from '@/layouts/AuthLayout'
  import HomeLayout from '@/layouts/HomeLayout'

  export default {
    computed: {
      layout() {
        return (this.$route.meta.layout || 'AuthLayout' )
      }
    },
    components: {
      AuthLayout, HomeLayout
    }
  }
</script>
