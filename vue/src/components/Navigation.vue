<template id="nav">
  <div class="nav shadow" :class="{'nav--opened': !navVisibility}">
    <button @click="switchNav" class="burger-wrapper">
      <span
          class="burger" :class="{'burger--opened': !navVisibility}"
      ></span>
    </button>

    <header class="header">
      <img src="../assets/files/logo.svg" width="50" alt="">
      <h1 class="dark">Личный кабинет</h1>
    </header>
    <nav class="links-container">
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
  width: 300px;
  height: 100vh;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  transform: translate(-235px);
  transition: 0.3s;
}
.nav--opened {
  transform: translate(0px);
}

.burger-wrapper {
  border: none;
  outline: none;
  background-color: #fff;
  display: block;
  width: 35px;
  padding: 0;
  align-self: flex-end;
}
.burger-wrapper:hover {
  cursor: pointer;
}
.burger, .burger::after, .burger::before {
  height: 3px;
  width: 35px;
  background-color: #464646;
}
.burger {
  position: relative;
  display: block;
  box-sizing: border-box;
  margin: 15px 0;
}
.burger::after, .burger::before {
  content: '';
  position: absolute;
  transition: 0.3s;
}
.burger::before {
  bottom: 10px;
  left: 0;
}
.burger::after {
  top: 10px;
  left: 0;
}
.burger--opened {
  background-color: #fff;
}
.burger--opened::before {
  transform: translateY(10px) rotate(45deg);
}
.burger--opened::after {
  transform: translateY(-10px) rotate(-45deg);
}

@media (min-width: 840px) {
  .burger-wrapper {
    display: none;
  }
  .nav {
    transform: translateX(0px);
  }
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

.links-container {
  padding: 30px 30px;
  display: grid;
  grid-template-rows: repeat(4, 25px);
  grid-gap: 20px;
}
</style>

<script>
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
      navVisibility: true
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
  methods: {
    switchNav() {
      this.navVisibility = !this.navVisibility
    }
  }
}
</script>
