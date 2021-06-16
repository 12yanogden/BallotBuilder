<template>
<div class="dashboard">
  <MyDashboard v-if="voter" />
  <Login v-else />
</div>
</template>

<script>
import MyDashboard from '@/components/MyDashboard.vue';
import Login from '@/components/Login.vue';
import axios from 'axios';
export default {
  name: 'dashboard',
  components: {
    MyDashboard,
    Login,
  },
  async created() {
    try {
      let response = await axios.get('/api/voters');
      this.$root.$data.voter = response.data.voter;
    } catch (error) {
      this.$root.$data.voter = null;
    }
  },
  computed: {
    voter() {
      return this.$root.$data.voter;
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding-top: 10px;
}
</style>
