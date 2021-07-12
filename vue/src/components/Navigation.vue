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
      <template v-for='item in menu'>
          <router-link :to='item.link' class='link' :class='item.class'>{{ item.title }}</router-link>
      </template>
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
import AppConfig from '../config/AppConfig'

function buildMenuItem(link, title, _class = {}) {
    return {
        link,
        title,
        class: _class,
    };
}

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

    if (hasRole(AppConfig.child_role_id)) {

    }

    if (hasAccess(11) === false) {
      this.isChild = true
    }
  },
  methods: {
    switchNav() {
      this.navVisibility = !this.navVisibility
    }
  },
  computed: {
      menu: function () {
          let menu = {
              'home': {
                  link: "/",
                  title: "Профиль",
                  class: null,
              },
          }

          if (hasRole(AppConfig.child_role_id)) {
              menu['parent'] = buildMenuItem('/parent', 'Мои родители');
              menu['proposal'] = buildMenuItem('/proposal', 'Заявления', {'link-notification': this.newProposal});
              menu['document'] = buildMenuItem('/document', 'Подача документов');
          }

          if (hasRole(AppConfig.parent_role_id)) {
              menu['proposal'] = buildMenuItem('/proposal', 'Заявления', {'link-notification': this.newProposal});
              if (hasAccess(11)) {
                  menu['child'] = buildMenuItem('/child', 'Мои дети');
              }
              menu['document'] = buildMenuItem('/document', 'Подача документов');
          }

          return menu;
      }
  }
}
</script>
