<template>
<div id="electionCreate" class="col">
  <div id="electionFormWrapper" class="col">
    <form class="pure-form form col">
      <h1>Create a new election</h1>
      <fieldset class="fieldSet">
        <input id="titleInput" v-model="newElection.name" placeholder="Office to be elected (eg President)"/>
      </fieldset>
      <fieldset class="fieldSet">
        <textarea id="descriptionInput" v-model="newElection.description" placeholder="The duties of this office include..."/>
      </fieldset>
      <fieldset class="center">
        <router-link @click.native="submit" :to="{ name: 'ballot', params: { action: 'edit', id: this.newElection.ballot._id }}">
          <button type="submit" class="submit button">Submit</button>
        </router-link>
        <router-link :to="{ name: 'ballot', params: { action: 'edit', id: this.newElection.ballot._id }}">
          <div class="cancel button">Cancel</div>
        </router-link>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{error}}</p>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'electionCreate',
  data() {
    return {
      newElection: {
        name: '',
        description: '',
        ballot: Object,
      },
      error: '',
    }
  },
  methods: {
    async submit() {
      if (!this.newElection.name)
        return;
      try {
        let response = await axios.post('/api/elections', {
          name: this.newElection.name,
          description: this.newElection.description,
          ballot: this.newElection.ballot,
        });

        return response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getBallot() {
      try {
        let response = await axios.get("/api/ballots/" + this.$route.params.id);
        this.newElection.ballot = response.data;

        return true;
      } catch (error) {
        this.error = error;
      }
    },
  },
  async created() {
    await this.getBallot();
  },
}
</script>

<style scoped>
#electionFormWrapper {
  width: 50%;
  align-items: flex-start;
}

.form {
  display: flex;
  width: 100%;
  align-items: flex-start;
}

.fieldSet {
  width: 100%;
  padding: 0;
  margin: 0 0 1em 0;
}

.inputLabel {
  padding: 0;
  margin: 0 0.5em 0 0;
}

.fieldInput {
  padding: 0;
  margin: 0;
}

#titleInput {
  width: 100%;
  font-size: 36pt;
}

#descriptionInput {
  width: 100%;
  height: 10em;
}

#openCloseWrapper {
  justify-content: space-between;
  width: 100%;
}

.button {
  font-size: 16pt;
}

.submit {
  margin: 0 0.5em 0 0;
}

.cancel {
  color: #B42033;
  background-color: transparent;
  border: 1px solid #B42033;
}

.grey {
  color: grey;
}

#electionTitle {
  font-size: 36pt;
  text-align: left;
}
</style>