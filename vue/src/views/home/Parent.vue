<template>
  <main class="home">
      <navigation />

      <div class="home-content">
        <section>

          <article class="card shadow" v-if="haveParentRequest" v-for="(req, id) in parentRequest">
            <h1 class="form-heading">{{req.surname}} {{req.name}}</h1>
            <p>{{ req.phone }}</p>
            <p>Хочет стать вашим родителем</p>
            <button class="dark-box dark-button" @click="accept(id)">Принять</button>
            <button class="light-box light-button" @click="cancell(id)">Отклонить</button>

            <section v-if="extraData.show">

            </section>
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
        haveParentRequest: null,
        parentRequest: [],
        extraData: {
          show: true,
        }
      }
    },
    async created() {
        const requests = await User.getParentRequests().then(data => data).catch(err => {console.error(err);});

        if (requests.length > 0) {
            this.haveParentRequest = true;

            this.parentRequest = requests;
            console.log(requests);
        }
    },
    methods: {
      accept(id) {
          console.log(this.parentRequest[id])
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
