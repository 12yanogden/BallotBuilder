<template>
<div class="measure">
  <MeasureCreate v-if="action == 'createElection' || action == 'createMeasure'"/>
  <MeasureEdit v-else-if="action == 'edit'"/>
  <p v-else>unrecognized action: {{action}}</p>
</div>
</template>

<script>
import MeasureCreate from '@/components/Measure/MeasureCreate.vue';
import MeasureEdit from '@/components/Measure/MeasureEdit.vue';
export default {
  name: 'measure',
  components: {
    MeasureCreate,
    MeasureEdit,
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
