const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const voters = require("./voters.js");
const Voter = voters.model;

const measures = require("./measures.js");
const Measure = measures.model;

const voteSchema = new mongoose.Schema({
  value: String,
  voter: {
    type: mongoose.Schema.ObjectId,
    ref: 'Voter'
  },
  measure: {
    type: mongoose.Schema.ObjectId,
    ref: 'Measure'
  },
});

const Vote = mongoose.model('Vote', voteSchema);

// Submit a new vote
router.post('/', async (req, res) => {
  // Verify parameters
  if (!req.body.value) {
    return res.status(400).send({
      message: "votes.js: invalid value \"" + req.body.value + "\""
    });
  }

  if (!req.body.voter) {
    return res.status(400).send({
      message: "votes.js: invalid voter \"" + req.body.voter + "\""
    });
  }

  if (!req.body.measure) {
    return res.status(400).send({
      message: "votes.js: invalid measure \"" + req.body.measure + "\""
    });
  }

  let vote = new Vote({
    value: req.body.value,
    voter: req.body.voter,
    measure: req.body.measure,
  });

  try {
    await vote.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    console.log("votes.js: failed to submit vote \"" + req.body.value + "\"");
    return res.sendStatus(500);
  }
});

// Get votes
router.get('/all', async (req, res) => {
  try {
    let votes = await Vote.find().sort({
      closure: -1
    }).populate('voter').populate('measure');
    
    return res.send(votes);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get votes by voter and measure
router.get('/byVoterAndMeasure/:voterId/:measureId', async (req, res) => {
  try {
    let voter = await Voter.findOne({
      _id: req.params.voterId
    });

    let measure = await Measure.findOne({
      _id: req.params.measureId
    });

    let votes = await Vote.find({
      voter: voter,
      measure: measure,
    }).populate('voter').populate('measure');
    
    return res.send(votes);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get votes by voter
router.get('/byVoter/:id', async (req, res) => {
  try {
    let voter = await Voter.findOne({
      _id: req.params.id
    });

    let votes = await Vote.find({
      voter: voter
    }).populate('voter').populate('measure');
    
    return res.send(votes);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get votes by measure
router.get('/byMeasure/:id', async (req, res) => {
  try {
    let measure = await Measure.findOne({
      _id: req.params.id
    });

    let votes = await Vote.find({
      measure: measure
    }).populate('voter').populate('measure');
    
    return res.send(votes);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get vote by id
router.get('/:id', async (req, res) => {
  try {
    let vote = await Vote.findOne({
      _id: req.params.id
    }).populate('voter').populate('measure');
    
    return res.send(vote);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  model: Vote,
  routes: router,
}
