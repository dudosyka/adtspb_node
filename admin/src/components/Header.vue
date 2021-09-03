<template>
	<header class="bg-card">
		<img src="../assets/images/pjaka.jpg" style="display: none">
		<h1>ADTSPB Admin</h1>
		<nav class="links-container">
	      <template v-for='item in menu'>
	          <router-link :to='item.link'>{{ item.title }}</router-link>
	      </template>
		</nav>
	</header>
</template>

<style scoped>
	* {
		color: #c4c4c4;
	}
	header {
		padding: 30px;
		display: grid;
		grid-template-columns: auto 1fr;
		grid-gap: 30px;
	}
	.links-container {
		display: grid;
		grid-template-columns: repeat(5, auto) 1fr;
		justify-items: center;
		align-items: center;
		grid-gap: 20px;
	}
	.link--active {

	}
	.link {

	}
</style>

<script>
import AppConfig from '../config/AppConfig'

function buildMenuItem(link, title) {
    return {
        link,
        title
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
  },
  computed: {
      menu: function () {
          let menu = {
              '1home': {
                  link: "/statistics",
                  title: "Статистика",
              },
			  '2associations': {
				  link: "/associations",
				  title: "Объединения",
			  }
          }

		  if (hasRole(AppConfig.teacher_role_id)) {
			  menu['3teacher'] = buildMenuItem("/teacher", 'Преподавателю')
		  }
		  else {
			  menu['3proposals'] = buildMenuItem("/proposals", "Заявления");
			  menu['4callbacks'] = buildMenuItem("/callbacks", "Модерация");
		  }

          return menu;
      }
  }
}
</script>
