<template>
	<div class="bg-wrapper body">
		<b-card class="card bg-card auth" title="Авторизация">

			<b-card-text>
				<b-input-group prepend="Логин">
					<b-input type="text" :state="errors.login" v-model="user.login" />
				</b-input-group>
			</b-card-text>

			<b-card-text>
				<b-input-group prepend="Пароль">
					<b-input type="text" :state="errors.pass" v-model="user.pass" />
				</b-input-group>
			</b-card-text>

			<b-button @click="auth" variant="primary">Войти</b-button>
		</b-card>
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
			console.log('hi')
	        User.login(this.user)
	        .catch(err => {
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
	        })
	        .then( data => {
	        	console.log(data)
	        })
	    },
	}
}
</script>