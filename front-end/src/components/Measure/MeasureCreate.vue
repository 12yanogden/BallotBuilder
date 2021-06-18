<template>
<div id="measureCreate" class="col">
  <div id="measureFormWrapper" class="col">
    <form class="pure-form form col">
      <h1 v-if="newMeasure.isElection">Create a new election</h1>
      <h1 v-else>Create a new measure</h1>
      <fieldset class="fieldSet">
        <input v-if="newMeasure.isElection" id="titleInput" v-model="newMeasure.name" placeholder="Office to be elected (eg President)"/>
        <input v-else id="titleInput" v-model="newMeasure.name" placeholder="Measure to be proposed (eg Build a park)"/>
      </fieldset>
      <fieldset class="fieldSet">
        <textarea v-if="newMeasure.isElection" id="descriptionInput" v-model="newMeasure.description" placeholder="The duties of this office include..."/>
        <textarea v-else id="descriptionInput" v-model="newMeasure.description" placeholder="The details of this measure include..."/>
      </fieldset>
      <fieldset class="center">
        <router-link @click.native="submit" :to="{ name: 'ballot', params: { action: 'edit', id: this.newMeasure.ballot._id }}">
          <button type="submit" class="submit button">Submit</button>
        </router-link>
        <router-link :to="{ name: 'ballot', params: { action: 'edit', id: this.newMeasure.ballot._id }}">
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
  name: 'measureCreate',
  data() {
    return {
      newMeasure: {
        name: '',
        description: '',
        ballot: Object,
        isElection: false,
      },
      error: '',
    }
  },
  methods: {
    async submit() {
      if (!this.newMeasure.name || !this.newMeasure.description || !this.newMeasure.ballot || this.newMeasure.isElection == null) {
        return;
      }
      try {
        console.log(this.newMeasure);

        let response = await axios.post('/api/measures', {
          name: this.newMeasure.name,
          description: this.newMeasure.description,
          ballot: this.newMeasure.ballot,
          isElection: this.newMeasure.isElection,
        });

        console.log(response.data);

        return response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getBallot() {
      try {
        let response = await axios.get("/api/ballots/" + this.$route.params.id);
        this.newMeasure.ballot = response.data;

        return true;
      } catch (error) {
        this.error = error;
      }
    },
    setIsElection() {
      if (this.$route.params.action == "createElection") {
        this.newMeasure.isElection = true;
      }
    }
  },
  async created() {
    await this.getBallot();
    this.setIsElection();
  },
}
</script>

<style scoped>
#measureFormWrapper {
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

#measureTitle {
  font-size: 36pt;
  text-align: left;
}
</style>