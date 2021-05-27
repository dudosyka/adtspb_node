<template>
  <main class="home">
      <navigation />
      <article class="home-content">

        <article class="card" v-for="child in children">
          <header class="card-header">
            <h2 class="card-name dark">{{ this.child[name] + ' ' + this.child[surname] }}</h2>
            <button class="dark-box darken">К данным</button>
          </header>

          <section class="child-data">
            <table class="child-data_table">
              <tr>
                <td>Дата рождения</td><td>00.00.0000</td>
              </tr>
              <tr>
                <td>ОВЗ</td><td>Есть</td>
              </tr>
              <tr>
                <td>Объединения</td><td></td>
              </tr>
            </table>
          </section>
        </article>

        <button class="air-button" @click="addChild" v-if="!show.addChild">+ Добавить ребёнка</button>

        <article class="add" v-if="show.addChild">
          <h2 class="form-heading">Введите номер телефона или электронную почту ребёнка</h2>
          <div class="input-container">
            <label class="label" v-bind:class="{'label-up': childId}">Номер телефона/Электронная почта</label><br>
            <input type="text" v-model="childId" class="type" tabindex="1">
          </div>
          <button class="dark-box dark-button">Добавить</button>
        </article>

      </article>
  </main>
</template>

<style scoped>
  .card, .add {
    background-color: #fff;
    padding: 30px;
    width: 100%;
    max-width: 750px;
    box-sizing: border-box;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
  }
  .card-header button::after {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border: 10px solid #fff;
    border-top-width: 0;
    border-left-color: rgba(0,0,0,0);
    border-right-color: rgba(0,0,0,0);
    margin-left: 10px;
  }
  .card-name {
    margin: 0;
  }

  .add {
    width: 500px;
  }

  .air-button {
    font-size: 17px;
    margin-top: 50px;
  }

  .child-data_table {
    margin-top: 40px;
  }
  .child-data_table td {
    padding: 20px 10px;
  }
  .child-data_table td:first-child {
    color: #9E9E9E;
    padding:
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
        children: [],
        childId: null,
        show: {
          addChild: false,
        }
      }
    },
    created() {
      let req = `
        query {
          getChildRequests {
            id, name, surname, phone
          }
        }
      `

      let data = {}

      api.request(req, this.children)
        .then(data => { console.log(this.children) })
        .catch(err => { console.log(err) })
    },
    methods: {
      addChild() {
        this.addChildShow = true

        let req = `
          mutation($child_id: Int) {
            addChild(child_id: $child_id)
          }
        `

        let data = {

        }
      },
    },
    computed: {

    }
  }
</script>
