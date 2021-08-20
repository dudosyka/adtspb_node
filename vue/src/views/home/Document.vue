<template>
  <main class="home">
      <navigation />

      <article class="home-content">

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
</style>

<script>
  import navigation from '../../components/Navigation.vue'

  export default {
    name: '',
    components: {
      navigation,
    },
    data() {
      return {

      }
    },
  }
</script>
