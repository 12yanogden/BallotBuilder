<template>
  <div id="app">
    <header id="header">
      <nav>
        <router-link to="/" class="logo">
          <i class="fa fa-paper-plane fa-4x"></i>
          <h1>BallotBuilder</h1>
        </router-link>
        <div>
          <router-link to="/dashboard"><i class="fas fa-user"></i></router-link>
          <i v-if="builder" class="fas fa-sign-out-alt pointer" @click.prevent="logout"></i>
        </div>
      </nav>
    </header>
    <div class="wrapper">
      <router-view class="view"/>
      <div class="push"></div>
    </div>
    <footer class="footer">
      <a id="githubLink" href="https://github.com/12yanogden/project.cs260.xyz">GitHub</a>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'app',
  async created() {
    try {
      let response = await axios.get('/api/builders');
      this.$root.$data.builder = response.data.builder;
    } catch (error) {
      this.$root.$data.builder = null;
    }
  },
  computed: {
    builder() {
      return this.$root.$data.builder;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/builders");
        this.$root.$data.builder = null;
      } catch (error) {
        this.$root.$data.builder = null;
      }
    },
  }
}
</script>

<style>
/* Color palette: https://www.schemecolor.com/wp-content/themes/colorsite/include/cc4.php?color0=b42033&color1=cecece&color2=fefefe&color3=3c3b6e&pn=American%20Red,%20White%20and%20Blue */

body {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  font-size: 16pt;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 20px;
}

.translucent {
  opacity: 0.9;
}

.pointer {
  cursor: pointer;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  font-size: 20pt;
  font-weight: 600;
  color: white;
  background: #B42033;
  cursor: pointer;
  padding: 0.5em 1em;
  border: none;
}

a:link {
  text-decoration: none;
}

#header {
  position: relative;
  width: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  /* Color and alignment */
  background: #3C3B6E;
  text-align: center;
  box-shadow: 0 0 0 1em white;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  flex-direction: row;
}

.logo i {
  font-size: 24pt !important;
  padding-right: 0 !important;
  margin: 0;
}

#header h1 {
  color: white;
  font-size: 24pt !important;
  padding: 1em;
  margin: 0;
}

#header i {
  color: white;
  font-size: 24px;
  padding: 1em;
  margin: 0;
}

#header .fas {
  font-size: 25px;
  color: white;
  width: 50px;
}

.pure-button-primary {
  background-color: #277E8E;
}

html, body, .app {
  height: 100%;
}

.view {
  min-height: 600px;
}

.wrapper {
  min-height: 100%;
  margin-bottom: -50px;
}

.push {
  height: 50px;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  background: #3C3B6E;
  margin-top: 2em;
}

#githubLink {
  text-decoration: none;
  color: white;
}

.error {
  display: inline;
  border-radius: 10px;
  font-size: 10px;
  background-color: #B42033;
  color: white;
  padding: 5px 20px;
  margin: 10px 0 0 0;
}
</style>
