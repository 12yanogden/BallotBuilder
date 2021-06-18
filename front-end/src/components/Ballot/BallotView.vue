<template>
<div id="ballotView" class="col">
  <div id="ballotWrapper" class="col">
    <h1 class="ballotName">{{ballot.name}}</h1>
    <h2>{{ballot.openDate}} - {{ballot.closeDate}}</h2>
    <h1>Elections</h1>
    <div class="measures card center" v-for="election in elections" :key="election._id">
      <h1 class="measureName">{{election.name}}</h1>
      <p class="measureDescription">{{election.description}}</p>
      <div class="options center row" v-for="candidate in candidates[election._id]" :key="candidate._id">
        <div class="borderBox"></div> 
        <p class="option">{{candidate.name}}</p>
      </div>
    </div>
    <h1>Measures</h1>
    <div class="measures card center" v-for="measure in measures" :key="measure._id">
      <h1 class="measureName">{{measure.name}}</h1>
      <p class="measureDescription">{{measure.description}}</p>
      <div class="options center row">
        <div class="borderBox"></div> 
        <p class="option">Yes</p>
      </div>
      <div class="options center row">
        <div class="borderBox"></div> 
        <p class="option">No</p>
      </div>
    </div>
    <router-link to="/dashboard"><div class="back button">Back</div></router-link>
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
        openDate: moment(new Date()).format('MMM DD, YYYY'),
        closeDate: moment(new Date()).format('MMM DD, YYYY'),
      },
      elections: [],
      measures: [],
      candidates: [],
      error: '',
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).add(1, 'day').format('MMM DD, YYYY');
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
            let election = measures[i];
            let response = await axios.get("/api/candidates/byMeasure/" + election._id);

            this.candidates[election._id] = response.data;
            this.elections.push(election);
          } else {
            this.measures.push(measures[i]);
          }
        }

        return true;
      } catch (error) {
        this.error = error;
      }
    },
  },
  async created() {
    await this.getBallot();
    await this.getMeasures();
  }
}
</script>

<style scoped>

#ballotWrapper {
  align-items: flex-start;
  width: 70%;
}

.ballotName {
  font-size: 48pt;
  padding: 0;
  margin: 20px 0 0 0;
}

.measures {
  align-items: flex-start;
  width: 100%;
  padding: 1em 0 0 1em;
  margin: 0 0 3em 0;
}

.measureName {
  font-weight: 500;
  padding: 0;
  margin: 0 0 0.5em 0;
}

.measureDescription {
  padding: 0;
  margin: 0 0 2em 0;
}

.options {
  padding: 0;
  margin: 0 0 1em 1em;
}

.borderBox {
  width: 20px;
  height: 20px;
  border: 1px solid black;
  margin: 0 1em 0 0;
}

.option {
  padding: 0;
  margin: 0
}

.back {
  font-size: 16pt;
  color: #B42033;
  background-color: transparent;
  border: 1px solid #B42033;
}

@media only screen and (max-width: 1200px) {
  #ballotWrapper {
    align-items: flex-start;
    width: 80%;
  }
}

@media only screen and (max-width: 800px) {
  #ballotWrapper {
    align-items: flex-start;
    width: 100%;
  }
}
</style>
