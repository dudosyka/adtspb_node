<template>
  <main class="home">
      <navigation />

      <div class="home-content">
        <section v-if="parentRequests.length > 0">

          <article class="card shadow" v-for="(req, id) in parentRequests">
            <h1 class="form-heading">{{req.surname}} {{req.name}}</h1>
            <p>{{ req.phone }}</p>
            <p>Хочет стать вашим родителем</p>
            <section v-if="show.needData">
              hello
            </section>
            <button v-if="!show.needData" class="dark-box dark-button" @click="showNeedData">Принять</button>

            <button v-if="show.needData" class="dark-box dark-button" @click="accept(id)">Принять</button>
            <button class="light-box light-button" @click="cancell(id)">Отклонить</button>
          </article>
        </section>
      </div>
  </main>
</template>

<style scoped>
  .home-content {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 10px;
  }

</style>

<script>
  import navigation from '../../components/Navigation.vue'
  import {User} from '../../models/User';

  export default {
    name: 'Child',
    components: {
      navigation,
    },
    data() {
      return {
        parentRequests: [],
        needData: {

        },
        show: {
          needData: false
        }
      }
    },
    async created() {
      const requests = await User.getParentRequests().then(data => data).catch(err => console.error(err));
      console.log("REQUESTS", requests);
      this.parentRequests = requests;
    },
    methods: {
      showNeedData() {
        this.show.needData = true
      },
      accept(id) {
          User.agreeParentRequest(id).then(data => {
              console.log(data);
          }).catch(err => {
              if (err.msg) {
                  console.log(err.msg);
              }
              else if (err.response) {
                  const msg = getError(err);
              }
          });
      },
      cancell(id) {

      }
    }
  }
</script>
