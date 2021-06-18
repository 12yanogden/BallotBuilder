<template>
<div id="ballotEdit" class="col">
  <div id="ballotFormWrapper" class="col">
    <form class="pure-form form col">
      <h1>Edit a ballot</h1>
      <fieldset class="fieldSet">
        <input id="titleInput" v-model="ballot.name"/>
      </fieldset>
      <div id="openCloseWrapper" class="col">
        <fieldset class="fieldSet row">
          <h3 class="inputLabel">Open date</h3>
          <input type="date" id="openInput" class="fieldInput" v-model="ballot.openDate"/>
        </fieldset>
        <fieldset class="fieldSet row">
          <h3 class="inputLabel">Close date</h3>
          <input type="date" id="closeInput" class="fieldInput" v-model="ballot.closeDate"/>
        </fieldset>
      </div>
      <fieldset class="center">
        <button type="submit" class="submit button" @click.prevent="edit">Save</button>
        <router-link to="/dashboard"><div class="back button">Back</div></router-link>
      </fieldset>
    </form>
  </div>
  <p v-if="error" class="error">{{error}}</p>
  <div class="row">
    <h1>Elections</h1>
    <router-link :to="{ name: 'measure', params: { action: 'createElection', id: this.ballot._id }}"><i class="fas fa-plus-circle addIcon"></i></router-link>
  </div>
  <div class="recordsBox card">
    <div class="records center" v-for="election in elections" :key="election.id">
      <div class="record row">
        <div class="recordLeft row">
          <div class="recordName">{{election.name}}</div>
        </div>
        <div class="recordRight row">
          <router-link :to="{ name: 'measure', params: { action: 'edit', id: election._id }}"><i class="far fa-edit editIcon"></i></router-link>
          <i class="far fa-trash-alt pointer" @click.prevent="removeMeasure(election)"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <h1>Measures</h1>
    <router-link :to="{ name: 'measure', params: { action: 'createMeasure', id: this.ballot._id }}"><i class="fas fa-plus-circle addIcon"></i></router-link>
  </div>
  <div class="recordsBox card">
    <div class="records center" v-for="measure in measures" :key="measure.id">
      <div class="record row">
        <div class="recordLeft row">
          <div class="recordName">{{measure.name}}</div>
        </div>
        <div class="recordRight row">
          <router-link :to="{ name: 'measure', params: { action: 'edit', id: measure._id }}"><i class="far fa-edit editIcon"></i></router-link>
          <i class="far fa-trash-alt pointer" @click.prevent="removeMeasure(measure)"></i>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
export default {
  name: 'ballotEdit',
  data() {
    return {
      ballot: {
        name: '',
        openDate: moment(new Date()).format('YYYY-MM-DD'),
        closeDate: moment(new Date()).format('YYYY-MM-DD'),
      },
      elections: [],
      measures: [],
      error: '',
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).add(1, 'day').format('YYYY-MM-DD');
    },
    async edit() {
      if (!this.ballot.name || !this.ballot.openDate || !this.ballot.closeDate)
        return;
      try {
        let response = await axios.put('/api/ballots/' + this.ballot._id, {
          name: this.ballot.name,
          openDate: new Date(this.ballot.openDate),
          closeDate: new Date(this.ballot.closeDate),
        });
        this.ballot = response.data;

        this.ballot.openDate = this.formatDate(this.ballot.openDate);
        this.ballot.closeDate = this.formatDate(this.ballot.closeDate);
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getBallot() {
      try {
        let response = await axios.get("/api/ballots/" + this.$route.params.id);
        this.ballot = response.data;

        this.ballot.openDate = this.formatDate(this.ballot.openDate);
        this.ballot.closeDate = this.formatDate(this.ballot.closeDate);

        return true;
      } catch (error) {
        this.error = error;
      }
    },
    async getMeasures() {
      try {
        let response = await axios.get("/api/measures/byBallot/" + this.ballot._id);
        let measures = response.data;

        this.elections = [];
        this.measures = [];

        for (let i = 0; i < measures.length; i++) {
          if (measures[i].isElection) {
            this.elections.push(measures[i]);
          } else {
            this.measures.push(measures[i]);
          }
        }

        return true;
      } catch (error) {
        this.error = error;
      }
    },
    async removeMeasure(measure) {
      try {
        if (measure.isElection) {
          let candidates = await axios.get("/api/candidates/ByMeasure/" + measure._id);

          for (let i = 0; i < candidates.length; i++) {
            await axios.delete("/api/candidates/" + candidates[i]._id);
          }
        }

        let response = await axios.delete('/api/measures/' + measure._id);

        this.getMeasures();
        return response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    }
  },
  async created() {
    await this.getBallot();
    await this.getMeasures();
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

.back {
  color: #B42033;
  background-color: transparent;
  border: 1px solid #B42033;
}

#ballotTitle {
  font-size: 36pt;
  text-align: left;
}

.addIcon {
  color: black;
  padding-left: 1em;
}

.recordsBox {
  width: 50%;
  min-height: 400px;
  margin: 0 0 3em 0;
}

.recordsModule {
  width: 100%
}

.records {
  width: 100%;
}

.record {
  justify-content: space-between;
  width: 90%;
  padding: 0.5em;
  border-bottom: 1px solid #D9D9D9;
}

.recordName {
  font-size: 18pt;
  font-weight: 500;
  margin: 0 0 0 0.5em;
}

.editIcon {
  color: black;
  cursor: pointer;
  margin: 0 0.5em 0 0; 
}
</style>