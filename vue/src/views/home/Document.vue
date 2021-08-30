<template>
    <main class="home">
        <navigation />

        <article class="home-content">
            <div class="card shadow">
                <!--<h1>Если не произошло автоматическое направление, нажмите на кнопку ниже</h1>!-->
                <a class="dark-button" target="_blank" href="https://widget.easyweek.io/act/">Запись <!-- Открыть !--></a>
            </div>
        </article>
    </main>
</template>

<style scoped>
.home-content {
    padding: 30px;
}
.warning-container {
    padding: 20px;
    margin-bottom: 30px;
    max-width: 600px;
    min-width: 300px;
    box-sizing: border-box;
}
.link-container {
    padding: 10px;
    height: 35px;
    display: flex;
    justify-content: space-around;
    background-color: #615d39;
    border-radius: 30px;
}  
.card {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
}
</style>

<script>
  import navigation from '../../components/Navigation.vue'
  import {User} from '../../models/User';
  import {Proposal} from '../../models/Proposal';
  import {Parser} from '../../utils/Parser';
  import AppConfig from '../../config/AppConfig';

  export default {
    name: '',
    components: {
      navigation,
    },
    data() {
      return {
        show: false,
        msg: '',
      }
    },
    async created() {
      User.getChildren({
        proposals: {
          isReserve: null,
        }
      }, false)
      .then( data => {
        const originalLength = data.length
        const test = {
            haveProposals: false,
            allIsNotReserve: false,
        }

        if (data.length > 0) { 
            test.haveProposals = true
        } else {
            this.msg = 'У Вас нет заявлений'
            this.show = false
            return
        }

        data = data.filter(el => {
            el.data.proposals = el.data.proposals.filter( _el => {
                return _el.isReserve
            })
            return (el.data.proposals.length > 0)
        })

        if (data.length !== originalLength) { 
            test.allIsNotReserve = true
        } else {
            this.msg = 'Ошибка'
            this.show = false
            return
        }

        this.show = true

        console.log(data)
      });

    },
  }
</script>
