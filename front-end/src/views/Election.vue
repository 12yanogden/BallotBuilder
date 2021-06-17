<template>
<div class="election">
  <ElectionCreate v-if="action == 'create'"/>
  <ElectionEdit v-else-if="action == 'edit'"/>
  <ElectionView v-else-if="action == 'view'"/>
  <ElectionVote v-else-if="action == 'vote'"/>
  <p v-else>unrecognized action: {{action}}</p>
</div>
</template>

<script>
import ElectionCreate from '@/components/Election/ElectionCreate.vue';
import ElectionEdit from '@/components/Election/ElectionEdit.vue';
import ElectionView from '@/components/Election/ElectionView.vue';
import ElectionVote from '@/components/Election/ElectionVote.vue';
export default {
  name: 'election',
  components: {
    ElectionCreate,
    ElectionEdit,
    ElectionVote,
    ElectionView,
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
