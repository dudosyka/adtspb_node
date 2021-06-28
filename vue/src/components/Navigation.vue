<template id="nav">
  <div class="nav shadow">
    <header class="header">
      <img src="../assets/files/logo.svg" width="50" alt="">
      <h1 class="dark">Личный кабинет</h1>
    </header>
    <nav class="nav-container">
        <router-link to="/" class="link">Главная</router-link>

        <router-link to="/parent" v-if="isChild" class="link">Мои родители</router-link>
        <router-link to="/child" v-if="manageChildren" class="link">Мои дети</router-link>
        <router-link to="/proposal" class="link" :class="{'link-notification': newProposal}">Заявления</router-link>
        <router-link to="/document" class="link">Подача документов</router-link>
    </nav>
  </div>
</template>

<style scoped>
  .nav {
    padding: 15px 15px;
    height: 100vh;
    box-sizing: border-box;
    z-index: 2;
  }

  .header {
    display: flex;
    align-items: center;
  }
  .header h1 {
    margin-left: 10px;
    font-size: 20px;
    text-align: center;
  }

  .nav-container {
    padding: 30px 30px;
    display: grid;
    grid-template-rows: repeat(4, 25px);
    grid-gap: 20px;
  }
</style>

<script>
import {User} from '../models/User';

export default {
  props: {
    newProposal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isChild: false,
      manageChildren: false,
      children: [],
    }
  },
  created() {
    if (hasAccess(11) === true) {
      this.manageChildren = true
    }

    if (hasAccess(11) === false) {
      this.isChild = true
    }
  },
}
</script>
