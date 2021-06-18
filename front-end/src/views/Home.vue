<template>
<div class="home col">
  <div id="voteRow" class="section">
    <video autoplay muted loop id="homeVideo">
      <source src="../assets/homeVideo_short.mp4" type="video/mp4">
    </video>
    <h1 class="bannerLabel" id="bannerLabel1">Make your voice</h1>
    <h1 class="bannerLabel" id="bannerLabel2">HEARD</h1>
    <router-link to="/dashboard"><div class="button">Build your ballot</div></router-link>
  </div>
  <div id="whyRow" class="section">
    <h1 id="whyStatement">Why use BallotBuilder?</h1>
    <div class="row">
      <div class="whyReason col">
        <i class="fa fa-lock fa-4x whyReasonIcon" aria-hidden="true"></i>
        <h2>Secure</h2>
        <p>Our data is managed in the US by the best names in cybersecurity.</p>
      </div>
      <div class="whyReason col">
        <i class="fa fa-thumbs-up fa-4x whyReasonIcon" aria-hidden="true"></i>
        <h2>Easy</h2>
        <p>No hastle! You can build your ballot instantly and from anywhere.</p>
      </div>
      <div class="whyReason col">
        <i class="fa fa-university fa-4x whyReasonIcon" aria-hidden="true"></i>
        <h2>Reliable</h2>
        <p>No lost ballots. Your ballot is accessible at all times.</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      candidates: [],
      findCandidate: "",
    }
  },
  created() {
    this.getCandidates();
  },
  methods: {
    async getCandidates() {
      try {
        let response = await axios.get("/api/candidates");
        this.candidates = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectCandidate(candidate) {
      this.findName = "";
      this.findCandidate = candidate;
    },
  } 

}
</script>

<style scoped>
.home {
  align-items: flex-start;
  padding: 0;
  margin: 0;
}

.section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%
}

#voteRow {
  min-height: 1000px;
}

#homeVideo {
  position: fixed;
  z-index: -1;
  min-width: 100%;
}

@media (min-aspect-ratio: 16/9) {
    #homeVideo {
      width: 100%;
      height: auto;
    }
}

@media (max-width: 767px) {
    #videoBG {
      display: none;
    }

    #voteRow {
      background: white;
      color: black;
    }
}

.bannerLabel {
  color: white;
  opacity: 0.8;
  padding: 0;
  margin: 0;
}

#bannerLabel1 {
  font-size: 48pt;
}

#bannerLabel2 {
  font-size: 120pt;
  margin: 0 0 0.5em 0;
}

#whyRow {
  background: white;
}

.whyReasonIcon {
  font-size: 96pt;
}

.whyReason {
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 400px;
  padding: 3em;
}

#candidateRow {
  min-height: 400px;
}

form fieldset {
  padding: 0;
}

#candidateSearch {
  display: flex;
  justify-content: space-between;
  width: 50%;
}

#searchInputFieldSet {
  width: 100%;
}

#searchInput {
  width: 100%;
  border: 0;
}

#searchButton {
  font-size: 16pt;
}

</style>

