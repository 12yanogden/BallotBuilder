<template>
<div class="ballot">
  <BallotCreate v-if="action == 'create'"/>
  <BallotEdit v-else-if="action == 'edit'"/>
  <BallotView v-else-if="action == 'view'"/>
  <p v-else>unrecognized action: {{action}}</p>
</div>
</template>

<script>
import BallotCreate from '@/components/Ballot/BallotCreate.vue';
import BallotEdit from '@/components/Ballot/BallotEdit.vue';
import BallotView from '@/components/Ballot/BallotView.vue';
export default {
  name: 'ballot',
  components: {
    BallotCreate,
    BallotEdit,
    BallotView,
  },
  data() {
    return {
      action: '',
    }
  },
  async created() {
    this.action = this.$route.params.action;
  },
}
</script>
