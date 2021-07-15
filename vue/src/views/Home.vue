<template>
    <main class="home">
        <navigation />

        <article class="home-content">
            <section class="card shadow">
                <h1 class="main-heading">Добро пожаловать</h1>
                <button class="dark-box dark-button" @click='logout()'>Выйти</button>
            </section>

            <FullUserData :hidden="JSON.stringify(userHiddenFields)" :independent="true"></FullUserData>

        </article>
    </main>
</template>

<style scoped>
  .home-content {
    padding: 30px;
  }
  .main-heading {
    font-size: 1.5rem;
    color: #142732;
    margin-bottom: 20px;
  }
</style>

<script>
  // @ is an alias to /src
  import navigation from '../components/Navigation.vue'
  import FullUserData from '../components/forms/FullUserData'
  import {AccessControl} from '../utils/AccessControl'
  import {User} from '../models/User'
  import AppConfig from '../config/AppConfig'


  export default {
    name: 'Home',
    components: {
      navigation, FullUserData
    },
    data() {
        return {
            cards: [],
            userHiddenFields: {}
        }
    },
    methods: {
        logout: () => AccessControl.logout()
    },
    async created() {
        //TODO: Запилить отображение этих данных
        User.getDataOnEdit().then(data => {
            console.log(data);
        });
        if (AccessControl.checkRole(AppConfig.parent_role_id)) {
            this.userHiddenFields = {
                relationship: true,
                ovz: true,
                disability: true,
                birthday: true,
                studyPlace: true,
            };
        }
    }
  }
</script>
