<template>
	<div class="bg-wrapper body">
		<main class="card bg-card auth">
			<h1>Авторизация</h1>

			<div class="input-container">
				<label>логин</label>
				<input type="text" v-model="user.login">
			</div>

			<div class="input-container">
				<label>Пароль</label>
				<input type="password" @keydown.enter="auth" v-model="user.pass">
			</div>

			<button @click="auth" class="button-accent">Войти</button>
		</main>
	</div>
</template>

<style>
.body {
	display: flex;
	justify-content: center;
	padding: 40px;
	min-height: 100vh;
	box-sizing: border-box;
}
.auth {
	display: grid;
	grid-gap: 20px;
	height: min-content;
}
</style>

<script>
import {User} from '../models/User';
	
export default {
	name: 'Login',
	data() {
		return {
			passwordFieldType: "password",
			user: {
				login: null,
	        	pass: null,
			},
	        errors: {
	            login: false,
	            password: false
	        }
		}
	},
	methods: {
		auth() {
			console.log('hi');
	        User.login(this.user).catch(err => {
	            //Ошибка с сервера
	            if (err.response) {
	                const msg = err.response.errors[0].message;
	                if (msg === 'login incorrect') {
	                    this.errors.login = true;
	                }
	                else if (msg == 'password incorrect') {
	                    this.errors.password = true;
	                }
	            }
	            //Ошибка с клиента
	            if (err.msg) {
	                for (let msg of err.msg)
	                  	if (msg)
	                    	this.errors[msg] = true

	                  // err.msg это массив, в нём поля, которые не прошли валидацию, примеры ниже:
	                  //['password'] ...
	                  //['password', 'login'] ...
	                  //['login'] ...
	            }
	        });
	    },
	}
}
</script>