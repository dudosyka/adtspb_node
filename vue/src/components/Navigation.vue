<template>
  <div class="nav">
    <header class="header">
      <img src="../assets/files/logo.svg" width="50" alt="">
      <h1 class="dark">Личный кабинет</h1>
    </header>
    <nav class="nav-container">
        <router-link to="/" class="link">Главная</router-link>
        <router-link to="/child" class="link">Мои дети</router-link>
        <router-link to="/proposal" class="link">Заявления</router-link>
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
