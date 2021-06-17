const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const elections = require("./elections.js");
const Election = elections.model;

const candidateSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  election: {
    type: mongoose.Schema.ObjectId,
    ref: 'Election'
  },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// Submit a new candidate
router.post('/', async (req, res) => {
  // Verify parameters
  if (!req.body.firstName) {
    return res.status(400).send({
      message: "candidates.js: invalid firstName \"" + req.body.firstName + "\""
    });
  }

  if (!req.body.lastName) {
    return res.status(400).send({
      message: "candidates.js: invalid lastName \"" + req.body.lastName + "\""
    });
  }

  if (!req.body.election) {
    return res.status(400).send({
      message: "candidates.js: invalid election \"" + req.body.election + "\""
    });
  }

  let candidate = new Candidate({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    election: req.body.election,
  });

  try {
    await candidate.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    console.log("candidates.js: failed to submit candidate \"" + req.body.firstName + "\"");
    return res.sendStatus(500);
  }
});

// Get candidates
router.get('/all', async (req, res) => {
  try {
    let candidates = await Candidate.find().sort({
      election: -1
    });
    
    return res.send(candidates);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get candidates by election
router.get('/byElection/:id', async (req, res) => {
  try {
    let election = await Election.findOne({
      _id: req.params.id
    });

    let candidates = await Candidate.find({
      election: election
    }).populate('election');
    
    return res.send(candidates);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get candidate by id
router.get('/:id', async (req, res) => {
  try {
    let candidate = await Candidate.findOne({
      _id: req.params.id
    });
    
    return res.send(candidate);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  model: Candidate,
  routes: router,
}
