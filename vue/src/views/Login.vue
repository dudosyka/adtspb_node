<template>
  <div class="login">
    <h1>This is a login page</h1>
    <input type="text" v-model="login" placeholder="Email or phone">
    <input type="pass" v-model="pass" placeholder="pass">
    <button @click="auth()">Token</button>
  </div>
</template>
<script>
  import axios from "axios"

  export default {
    name: 'Login',
    data() {
      return {
        login: null,
        pass: null
      }
    },
    methods: {
      auth()
      {
        axios.post("http://localhost:8080/auth", {
          user: this.login,
          pass: this.pass
        }).then(res => {
          localStorage.setItem('token', res.data);
          window.location = window.location;
          this.$router.push({path: "/"});
        }).catch(err => {
          console.log(err);
        });
      },
    },
  }
</script>
