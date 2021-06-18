<template>
<div id="ballotCreate" class="col">
  <div id="ballotFormWrapper" class="col">
    <form class="pure-form form col">
      <h1>Create a new ballot</h1>
      <fieldset class="fieldSet">
        <input id="titleInput" v-model="newBallot.name" placeholder="Ballot Title (eg Virgina District 29 Ballot 2021)"/>
      </fieldset>
      <div id="openCloseWrapper" class="col">
        <fieldset class="fieldSet row">
          <h3 class="inputLabel">Open date</h3>
          <input type="date" id="openInput" class="fieldInput" v-model="newBallot.openDate"/>
        </fieldset>
        <fieldset class="fieldSet row">
          <h3 class="inputLabel">Close date</h3>
          <input type="date" id="closeInput" class="fieldInput" v-model="newBallot.closeDate"/>
        </fieldset>
      </div>
      <fieldset class="center">
        <router-link @click.native="submit" to="/dashboard"><button type="submit" class="submit button">Submit</button></router-link>
        <router-link to="/dashboard"><div class="cancel button">Cancel</div></router-link>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{error}}</p>
  </div>
</div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
export default {
  name: 'ballotCreate',
  data() {
    return {
      newBallot: {
        name: '',
        openDate: moment(new Date()).format('YYYY-MM-DD'),
        closeDate: moment(new Date()).format('YYYY-MM-DD'),
      },
      error: '',
    }
  },
  methods: {
    async submit() {
      let openDate = new Date(this.newBallot.openDate);
      let closeDate = new Date(this.newBallot.closeDate);
      if (!this.newBallot.name || !this.newBallot.openDate || !this.newBallot.closeDate || openDate.getTime() > closeDate.getTime())
        return;
      try {
        let response = await axios.post('/api/ballots', {
          name: this.newBallot.name,
          openDate: this.newBallot.openDate,
          closeDate: this.newBallot.closeDate,
          builder: this.$root.$data.builder,
        });
        this.newBallot = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
  }
}
</script>

<style scoped>
#ballotFormWrapper {
  width: 50%;
  align-items: flex-start;
}

.form {
  display: flex;
  width: 100%;
  align-items: flex-start;
}

.fieldSet {
  width: 100%;
  padding: 0;
  margin: 0 0 1em 0;
}

.inputLabel {
  padding: 0;
  margin: 0 0.5em 0 0;
}

.fieldInput {
  padding: 0;
  margin: 0;
}

#titleInput {
  width: 100%;
  font-size: 36pt;
}

#openCloseWrapper {
  justify-content: space-between;
  width: 100%;
}

.button {
  font-size: 16pt;
}

.submit {
  margin: 0 0.5em 0 0;
}

.cancel {
  color: #B42033;
  background-color: transparent;
  border: 1px solid #B42033;
}

#ballotTitle {
  font-size: 36pt;
  text-align: left;
}
</style>