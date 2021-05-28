<template>
  <main class="home">
      <navigation />
      <article class="home-content">

        <article class="card" v-for="child in children">
          <header class="card-header">
            <h2 class="card-name dark">{{ child.name + ' ' + child.surname }}</h2>
            <button @click='child.showData = !child.showData' class="dark-box darken">{{ child.showData ? "Скрыть" : "К данным" }}</button>
          </header>

          <section v-if='child.showData' class="child-data">
            <table class="child-data_table">
              <tr>
                <td>Дата рождения</td><td>{{ child.birthday }}</td>
              </tr>
              <tr>
                <td>ОВЗ</td><td>{{child.ovz == 1 ? "Есть" : "Нет" }}</td>
              </tr>
              <!--tr>
                    Пока что комменчу, так как в апи нет метода, который бы вернул тебе объединения в которые ребенок зачислен
                <td>Объединения</td><td></td>
              </tr-->
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
        children: [
            {
                name: null,
                surname: null,
            }
        ],
        childId: null,
        show: {
          addChild: false,
        }
      }
    },
    created() {
      let req = `
        query {
          getChildren {
            id, name, surname, phone, birthday, ovz
          }
        }
      `

      let data = {}

      api.request(req)
        .then(data => {
            console.log(data);
            if (data.getChildren.length < 1)
                this.children = [];
            data.getChildren.map(el => {
                el.showData = false;
                const birth = el.birthday;
                const date = new Date(birth);
                const year = date.getFullYear();

                let month = date.getMonth() + 1;
                let day = date.getDate();

                month = (month > 9) ? month : "0" + month;
                day = (day > 9) ? day : "0" + day;

                el.birthday = year + "-" + month + "-" + day;

                return el;
            });
            this.children = data.getChildren;
        })
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
