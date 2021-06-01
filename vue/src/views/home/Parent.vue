<template>
  <main class="home">
      <navigation />

      <div class="home-content">
        <section>

          <article class="card" v-if="haveParentRequest" v-for="req in parentRequest">
            <h1 class="form-heading">{{req.surname}} {{req.name}}</h1>
            <p>{{ req.phone }}</p>
            <p>Хочет стать вашим родителем</p>
            <button class="dark-box dark-button" @="accept(req)">Принять</button>
            <button class="light-box light-button" @="cancell(req)">Отклонить</button>
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

  export default {
    name: 'Child',
    components: {
      navigation,
    },
    data() {
      return {
        haveParentRequest: null,
        parentRequest: [

        ]
      }
    },
    created() {
      let req = `
        query {
          getParentRequests {
              name, surname, phone
          }
        }
      `

      let data = {}

      api.request(req, data)
        .then(data => {
          console.log(data)

          if (data.getParentRequests.length > 0) {
            this.haveParentRequest = true

            this.parentRequest = data.getParentRequests
            console.log(this.parentRequest)
          }
        })
        .catch(err => { console.log(err) })
    },
    methods: {
      accept(req) {

      },
      cancell(req) {

      }
    }
  }
</script>
