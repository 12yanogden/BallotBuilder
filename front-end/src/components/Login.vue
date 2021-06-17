<template>
<div class="login">
  <div class="loginBox card">
    <form class="pure-form">
      <fieldset>
        <legend>Register for an account</legend>
        <input v-model="firstName" placeholder="First Name">
        <input v-model="lastName" placeholder="Last Name">
      </fieldset>
      <fieldset>
        <input v-model="username" placeholder="username">
        <input v-model="password" type="password" placeholder="password">
      </fieldset>
      <fieldset class="center">
        <button type="submit" class="button" id="registrationButton" @click.prevent="register">Register</button>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{error}}</p>
    <form class="space-above pure-form">
      <fieldset>
        <legend>Login</legend>
        <input placeholder="username" v-model="loginUsername">
        <input type="password" placeholder="password" v-model="loginPassword">
      </fieldset>
      <fieldset class="center">
        <button type="submit" class="button" @click.prevent="login">Login</button>
      </fieldset>
    </form>
    <p v-if="errorLogin" class="error">{{errorLogin}}</p>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'HomePage',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      loginUsername: '',
      loginPassword: '',
      error: '',
      errorLogin: '',
    }
  },
  methods: {
    async register() {
      this.error = '';
      this.errorLogin = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        let response = await axios.post('/api/voters', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.voter = response.data.voter;
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.voter = null;
      }
    },
    async login() {
      this.error = '';
      this.errorLogin = '';
      if (!this.loginUsername || !this.loginPassword)
        return;
      try {
        let response = await axios.post('/api/voters/login', {
          username: this.loginUsername,
          password: this.loginPassword,
        });
        this.$root.$data.voter = response.data.voter;
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.voter = null;
      }
    },
  }
}
</script>

<style scoped>
.space-above {
  margin-top: 50px;
}

h1 {
  font-size: 28px;
  font-variant: capitalize;
}

.login {
  padding: 120px;
  display: flex;
  justify-content: center;
  background: #FFFFFF url("../assets/loginBg.jpg") no-repeat;
  background-position:center center;
  background-size: cover;
}

.loginBox {
  text-align: center;
}

.login form {
  font-size: 16px;
}

.login form legend {
  font-size: 20px;
}

input {
  margin-right: 10px;
}

form button {
  font-size: 16pt;
}
</style>
