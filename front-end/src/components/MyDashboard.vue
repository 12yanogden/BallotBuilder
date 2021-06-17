<template>
<div class="MyDashboard col">
  <div class="ballotsModule col">
    <div class="row">
      <h1>Open and Upcoming Ballots</h1>
      <router-link to="/ballot/create/new" v-if="isAdmin"><i class="fas fa-plus-circle addIcon"></i></router-link>
    </div>
    <div class="ballotsBox card">
      <div v-if="hasNextBallots" style="width: 100%;">
        <div class="ballots center" v-for="openBallot in openBallots" :key="openBallot.id">
          <div class="ballot row">
            <div class="ballotLeft row">
              <div class="ballotStatus openStatus">{{openBallot.status}}</div>
              <div class="ballotDate">{{formatDate(openBallot.ballot.openDate)}}</div>
              <p class="ballotDate">-</p>
              <div class="ballotDate">{{formatDate(openBallot.ballot.closeDate)}}</div>
              <div class="ballotName">{{openBallot.ballot.name}}</div>
            </div>
            <div class="ballotRight row">
              <router-link :to="{ name: 'ballot', params: { action: 'vote', id: openBallot.ballot._id }}"><i class="fas fa-check voteIcon"></i></router-link>
              <router-link :to="{ name: 'ballot', params: { action: 'edit', id: openBallot.ballot._id }}"><i v-if="isAdmin" class="far fa-edit editIcon"></i></router-link>
              <i v-if="isAdmin" class="far fa-trash-alt pointer" @click.prevent="remove(openBallot)"></i>
            </div>
          </div>
        </div>
        <div class="ballots" v-for="upcomingBallot in upcomingBallots" :key="upcomingBallot.id">
          {{upcomingBallot.name}}
        </div>
      </div>
      <p v-else>There are no open or upcoming ballots</p>
    </div>
  </div>
  <div class="ballotsModule col">
    <h1>Closed Ballots</h1>
    <div class="ballotsBox card">
      <div v-if="closedBallots.length > 0">
        <div class="ballots" v-for="closedBallot in closedBallots" :key="closedBallot.id">
          {{closedBallot.name}}
        </div>
      </div>
      <p v-else>There are no closed ballots</p>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
export default {
  name: 'MyDashboard',
  data() {
    return {
      openBallots: [],
      upcomingBallots: [],
      closedBallots: [],
      error:''
    }
  },
  computed: {
    voter() {
      return this.$root.$data.voter;
    },
    hasNextBallots() {
      let hasNextBallots = true;

      if (this.openBallots.length == 0 && this.upcomingBallots.length == 0) {
        hasNextBallots = false;
      }

      return hasNextBallots;
    },
    isAdmin() {
      return this.$root.$data.voter.isAdmin
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).add(1, 'day').format('MM/DD/YYYY');
    },
    calcBallotStatus(ballot) {
      let now = new Date();
      let openDate = new Date(ballot.openDate);
      let closeDate = new Date(ballot.closeDate);
      let status = "closed";

      if (openDate < now && closeDate > now) {
        status = "open";
      } else if (openDate > now) {
        status = "upcoming";
      }

      return status;
    },
    async getBallots() {
      try {
        let response = await axios.get("/api/ballots/all");
        let ballots = response.data;

        this.openBallots = [];
        this.upcomingBallots = [];
        this.closedBallots = [];

        for (let i = 0; i < ballots.length; i++) {
          let ballot = ballots[i];
          let status = this.calcBallotStatus(ballot);
          let statusBallot={
            status: status,
            ballot: ballot,
          }

          switch (status) {
            case "open":
              this.openBallots.push(statusBallot);
              break;
            case "upcoming":
              this.upcomingBallots.push(statusBallot);
              break;
            case "closed":
              this.closedBallots.push(statusBallot);
              break;
            default:
              throw "unrecognized ballot.status \"" + status + "\""; 
          }
        }

        return true;
      } catch (error) {
        this.error = error;
      }
    },
    async remove(ballot) {
      console.log(ballot);

      try {
        await axios.delete("/api/ballots/" + ballot.ballot._id);
        this.getBallots();
        
        return true;
      } catch (error) {
        this.error = error;
      }
    },
  }, 
  created() {
    this.getBallots();
  },
}
</script>

<style scoped>
.addIcon {
  color: black;
  padding-left: 1em;
}

.ballotsBox {
  width: 50%;
  min-height: 400px;
  margin: 0 0 3em 0;
}

.ballotsModule {
  width: 100%
}

.ballots {
  width: 100%;
}

.ballot {
  justify-content: space-between;
  width: 90%;
  border-bottom: 1px solid #D9D9D9;
}

.ballotStatus {
  color: white;
  padding: 0.5em;
  border-radius: 10%;
  margin: 0.5em 1em 0.5em 0;
}

.openStatus {
  background: #008450;
}

.upcomingStatus {
  background: #EFB700;
}

.closedStatus {
  background: #B81D13;
}

.ballotDate {
  font-size: 12pt;
  margin: 0 0.5em 0 0;
}

.ballotName {
  font-size: 18pt;
  font-weight: 500;
  margin: 0 0 0 0.5em;
}

.voteIcon {
  color: black;
  cursor: pointer;
  margin: 0 0.5em 0 0; 
}

.editIcon {
  color: black;
  cursor: pointer;
  margin: 0 0.5em 0 0; 
}
</style>

