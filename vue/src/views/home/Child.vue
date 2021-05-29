<template>
  <main class="home">
      <navigation />
      <article class="home-content">

        <section class="children">

          <header class="card child shadow" v-for="(child, id) in children">
            <h2 class="child-name">{{ child.name + ' ' + child.surname }}</h2>
            <button
              @click="showData(id)"
              class="dark-box darken child-to-data"
              :class="{'child-from-data': id === show.childData}"
            >К данным</button>
          </header>

          <router-link to="/child/add" class="dark-box dark-button child-add">+ Добавить ребёнка</router-link>

        </section>

        <section class="children-data card shadow">

          <article class="child-data" v-for="(child, id) in children">
            <table class="child-data_table" v-show="show.childData === id">
              <tbody class="child-data_table-group">
                <tr>
                  <td>
                    <inputField
                      label="Имя"
                      :value="child.name"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <inputField
                      label="Фамилия"
                      :value="child.surname"
                      :readonly="true"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <inputField
                      label="Отчество"
                      :value="child.lastname"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <inputField
                      label="Дата рождения"
                      :value="child.birthday"
                      :readonly="true"
                    />
                  </td>
                </tr>
              </tbody>
              <tbody class="child-data_table-group">
                <tr>
                  <td>
                    <inputField
                      label="Электронная почта"
                      :value="child.email"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <inputField
                      label="Номер телефона"
                      :value="child.phone"
                      :readonly="true"
                    />
                  </td>
                </tr>
              </tbody>
              <tbody class="child-data_table-group">
                <tr>
                  <td colspan="2">
                    <inputField
                      type="sex"
                      :value="child.sex"
                      :readonly="true"
                    />
                  </td>
                </tr>
              </tbody>
              <tbody class="child-data_table-group">
                <tr>
                  <td>
                    <inputField
                      label="Гражданство"
                      :value="child.state"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <inputField
                      label="Степень родства"
                      :value="child.relationship"
                      :readonly="true"
                    />
                  </td>
                </tr>
              </tbody>
              <tbody class="child-data_table-group">
                <tr>
                  <td>
                    <inputField
                      label="ОВЗ"
                      :value="child.ovz ? 'есть' : 'нету'"
                      :readonly="true"
                    />
                  </td>
                  <td>
                    <inputField
                      label="Инвалидность"
                      :value="child"
                      :readonly="true"
                    />
                  </td>
                </tr>
              </tbody>
              <tbody class="child-data_table-group">
                <tr>
                  <td colspan="2">
                    <inputField
                      label="Образовательное учреждение"
                      :value="child"
                      :readonly="true"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <inputField
                      label="Класс \ группа"
                      :value="child"
                      :readonly="true"
                    />
                  </td>
                </tr>
              </tbody>
              <tbody class="child-data_table-group">
                <tr>
                  <td colspan="2">
                    <inputField
                      label="Адрес регистрации"
                      :value="child"
                      :readonly="true"
                    />
                  </td>
                </tr>
              </tbody>
              <tbody class="child-data_table-group">
                <tr>
                  <td colspan="2">
                    <inputField
                      label="Адрес проживания"
                      :value="child"
                      :readonly="true"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </article>

        </section>

      </article>
  </main>
</template>

<style scoped>
  .home-content {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 10px;
  }
  .children {
    display: flex;
    flex-direction: column;

  }
  .child {
    display: flex;
    justify-content: space-between
  }
  .child-name {
    margin: 0;
    color: #142732;
    align-self: center;
  }
  .child-to-data {

  }
  .child-to-data::after {
    content: '';
    display: inline-block;
    width: 0px;
    height: 0px;
    margin-left: 10px;

    border: 8px solid #fff;
    border-top-color: rgba(0,0,0,0);
    border-bottom-color: rgba(0,0,0,0);
    border-left-style: none;
  }
  .child-from-data::after {
    border-left-style: solid;
    border-right-style: none;
  }
  .child-add {
    align-self: center;
    max-width: 150px;
    margin-top: 20px;
  }
  .child-data_table {
    width: 100%;
  }
  .child-data_table td {
    padding-right: 20px;
  }
  .child-data_table td:last-child {
    padding-right: 0;
  }
  .child-data_table-group {
    margin: 5px 0;
  }

</style>

<script>
  import navigation from '../../components/Navigation.vue'
  import inputField from '../../components/InputField.vue'

  export default {
    name: 'Child',
    components: {
      navigation, inputField
    },
    data() {
      return {
        children: [],
        show: {
          childData: 0,
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
      showData(id) {
        this.show.childData = id
      }
    },
    computed: {

    }
  }
</script>
