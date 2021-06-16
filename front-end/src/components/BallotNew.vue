<template>
<div id="ballotNew" class="col">
  <div id="ballotFormWrapper" class="col">
    <form v-if="!newBallot" class="pure-form form col">
      <h1>Create a new ballot</h1>
      <fieldset class="fieldSet">
        <input id="titleInput" v-model="ballotName" placeholder="Ballot Title (eg Virgina District 29 Ballot 2021)"/>
      </fieldset>
      <div id="openCloseWrapper" class="col">
        <fieldset class="fieldSet row">
          <h3 class="inputLabel">Open date</h3>
          <input type="date" id="openInput" class="fieldInput" v-model="openDate" placeholder="Open date"/>
        </fieldset>
        <fieldset class="fieldSet row">
          <h3 class="inputLabel">Close date</h3>
          <input type="date" id="closeInput" class="fieldInput" v-model="closeDate" placeholder="Close date"/>
        </fieldset>
      </div>
      <fieldset class="center">
        <button type="submit" class="submit button" @click.prevent="submit">Submit</button>
        <router-link to="/dashboard"><div class="cancel button">Cancel</div></router-link>
      </fieldset>
    </form>
    <div v-else>
      <div class="grey">
        <h1>Create a new ballot</h1>
        <h1 id="ballotTitle">{{newBallot.name}}</h1>
        <div class="row">
          <h3 class="inputLabel">Open date</h3>
          <p>{{formatDate(newBallot.openDate)}}</p>
        </div>
        <div class="row">
          <h3 class="inputLabel">Close date</h3>
          <p>{{formatDate(newBallot.closeDate)}}</p>
        </div>
      </div>

    </div>
    <p v-if="error" class="error">{{error}}</p>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  name: 'ballotNew',
  data() {
    return {
      ballotName: '',
      openDate: '',
      closeDate: '',
      newBallot: null,
      error: '',
    }
  },
  methods: {
    formatDate(date) {
        return moment(date).add(1, 'days').format('MM/DD/YYYY');
    },
    async submit() {
      if (!this.ballotName || !this.openDate || !this.closeDate)
        return;
      try {
        let response = await axios.post('/api/ballots', {
          name: this.ballotName,
          openDate: this.openDate,
          closeDate: this.closeDate,
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

.grey {
  color: grey;
}

#ballotTitle {
  font-size: 36pt;
  text-align: left;
}
</style>