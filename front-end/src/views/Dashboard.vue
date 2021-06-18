<template>
<div class="dashboard">
  <MyDashboard v-if="builder" />
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
      let response = await axios.get('/api/builders');
      this.$root.$data.builder = response.data.builder;
    } catch (error) {
      this.$root.$data.builder = null;
    }
  },
  computed: {
    builder() {
      return this.$root.$data.builder;
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding-top: 10px;
}
</style>
