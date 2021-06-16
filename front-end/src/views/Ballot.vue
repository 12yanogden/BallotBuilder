<template>
<div class="ballot">
  <BallotNew v-if="isNew" />
  <div v-else>
    <BallotOpen v-if="isOpen(ballot)"/>
    <BallotClosed v-else />
  </div>
</div>
</template>

<script>
import BallotNew from '@/components/BallotNew.vue';
import BallotOpen from '@/components/BallotOpen.vue';
import BallotClosed from '@/components/BallotClosed.vue';
import axios from 'axios';
export default {
  name: 'ballot',
  components: {
    BallotNew,
    BallotOpen,
    BallotClosed,
  },
  data() {
    return {
      isNew: false,
      ballot: Object,
    }
  },
  async created() {
    // Get ballot by id
    if (this.$route.params.id == "new") {
      this.isNew = true;
    } else {
      try {
        let response = await axios.get('/api/ballot/' + this.$route.params.id);

        this.ballot = response.data;
      } catch (error) {
        console.log("Ballot.vue: failed to get ballot " + this.$route.params.id)
      }
    }
  },
  method: {
    isOpen(ballot) {
      let now = Date.now;
      let isOpen = false;

      if (ballot.openDate < now && ballot.closeDate > now) {
        isOpen = true;
      }

      return isOpen;
    }
  }
}
</script>
