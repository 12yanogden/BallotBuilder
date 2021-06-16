<template>
<div class="MyDashboard col">
  <div class="ballotsModule col">
    <div class="row">
      <h1>Open and Upcoming Ballots</h1>
      <router-link to="/ballot/new" v-if="isAdmin"><i class="fas fa-plus-circle addIcon"></i></router-link>
    </div>
    <div class="ballotsBox card">
      <div v-if="hasNextBallots">
        <div class="openBallots" v-for="openBallot in openBallots" :key="openBallot.id">
          {{openBallot.name}}
        </div>
        <div class="upcomingBallots" v-for="upcomingBallot in upcomingBallots" :key="upcomingBallot.id">
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
        <div class="closedBallots" v-for="closedBallot in closedBallots" :key="closedBallot.id">
          {{closedBallot.name}}
        </div>
      </div>
      <p v-else>There are no closed ballots</p>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'MyDashboard',
  data() {
    return {
      openBallots: [],
      upcomingBallots: [],
      closedBallots: [],
    }
  },
  created() {
    this.getBallots();
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
    async getBallots() {
      try {
        let response = await axios.get("/api/ballots");
        let ballots = response.data;

        for (let i = 0; i < ballots.length; i++) {
          let ballot = ballots[i];

          switch (ballot.status) {
            case "open":
              this.openBallots.push(ballot);
              break;
            case "upcoming":
              this.upcomingBallots.push(ballot);
              break;
            case "closed":
              this.closedBallots.push(ballot);
              break;
            default:
              throw "unrecognized ballot.status \"" + ballot.status + "\""; 
          }
        }

        return true;
      } catch (error) {
        console.log(error);
      }
    },
  } 

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
</style>

