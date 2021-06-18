<template>
<div id="measureEdit" class="col">
  <div id="measureFormWrapper" class="col">
    <form class="pure-form form col">
      <h1 v-if="measure.isElection">Edit an Election</h1>
      <h1 v-else>Edit a Measure</h1>
      <fieldset class="fieldSet">
        <input id="titleInput" v-model="measure.name" placeholder="Office to be elected (eg President)"/>
      </fieldset>
      <fieldset class="fieldSet">
        <textarea id="descriptionInput" v-model="measure.description" placeholder="The duties of this office include..."/>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{error}}</p>
    <div class="candidatesWrapper" v-if="measure.isElection">
      <div class="row">
        <h1>Candidates</h1>
        <i @click.prevent="addCandidate" class="fas fa-plus-circle addIcon"></i>
      </div>
      <form class="pure-form form row" v-for="candidate in candidates" :key="candidate.id">
        <fieldset class="fieldSet">
          <input class="nameInput" v-model="candidate.name" placeholder="Name of candidate"/>
        </fieldset>
        <fieldset>
          <i class="far fa-trash-alt pointer" @click.prevent="removeCandidate(candidate)"></i>
        </fieldset>
      </form>
      <form class="pure-form form row">
        <fieldset class="fieldSet">
          <input class="nameInput" v-model="newCandidate.name" placeholder="Name of candidate"/>
        </fieldset>
      </form>
    </div>
    <div class="row">
      <div class="submit button" @click.prevent="saveAll">Save</div>
      <router-link :to="{ name: 'ballot', params: { action: 'edit', id: this.measure.ballot._id }}">
        <div class="cancel button">Back</div>
      </router-link>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'measureEdit',
  data() {
    return {
      measure: {
        name: '',
        description: '',
        ballot: Object,
        isElection: false,
      },
      newCandidate: {
        name: '',
      },
      candidates: [],
      error: '',
    }
  },
  methods: {
    async saveAll() {
      this.editMeasure();
      this.editCandidates();
      this.addCandidate();
    },
    async editCandidates() {
      for (let i = 0; i < this.candidates.length; i++) {
        let candidate = this.candidates[i];
        if (!candidate.name)
          return;
        try {
          let response = await axios.put('/api/candidate/' + this.candidate._id, {
            name: this.measure.name,
            ballot: this.measure,
          });

          this.candidates[i] = response.data;
        } catch (error) {
          this.error = error.response.data.message;
        }
      }
    },
    async editMeasure() {
      if (!this.measure.name || !this.measure.description || !this.measure.ballot)
        return;
      try {
        let response = await axios.put('/api/measures/' + this.measure._id, {
          name: this.measure.name,
          description: this.measure.description,
          ballot: this.measure.ballot,
        });

        this.measure = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async addCandidate() {
      if (!this.newCandidate.name)
        return;
      try {
        let response = await axios.post('/api/candidates', {
          name: this.newCandidate.name,
          measure: this.measure,
        });

        this.getCandidates();
        this.newCandidate.name = '';
        return response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async removeCandidate(candidate) {
      try {
        let response = await axios.delete('/api/candidates/' + candidate._id);

        this.getCandidates();
        return response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getMeasure() {
      try {
        let response = await axios.get("/api/measures/" + this.$route.params.id);
        this.measure = response.data;

        return true;
      } catch (error) {
        this.error = error;
      }
    },
    async getCandidates() {
      try {
        let response = await axios.get("/api/candidates/byMeasure/" + this.measure._id);
        let candidates = response.data;

        this.candidates = [];

        for (let i = 0; i < candidates.length; i++) {
          this.candidates.push(candidates[i]);
        }

        return true;
      } catch (error) {
        this.error = error;
      }
    },
  },
  async created() {
    await this.getMeasure();
    if (this.measure.isElection) {
      await this.getCandidates();
    }
  }
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
  display: flex;
  align-items: flex-start;
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

.addIcon {
  color: black;
  cursor: pointer;
  padding-left: 1em;
}

.candidatesWrapper {
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

.nameInput {
  width: 50%;
}

</style>