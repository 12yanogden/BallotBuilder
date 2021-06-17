const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const ballots = require("./ballots.js");
const Ballot = ballots.model;

const electionSchema = new mongoose.Schema({
  name: String,
  description: String,
  ballot: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ballot'
  },
});

const Election = mongoose.model('Election', electionSchema);

// Submit a new election
router.post('/', async (req, res) => {
  // Verify parameters
  if (!req.body.name) {
    return res.status(400).send({
      message: "elections.js: invalid name \"" + req.body.name + "\""
    });
  }

  if (!req.body.description) {
    return res.status(400).send({
      message: "elections.js: invalid description \"" + req.body.description + "\""
    });
  }

  if (!req.body.ballot) {
    return res.status(400).send({
      message: "elections.js: invalid ballot \"" + req.body.ballot + "\""
    });
  }

  let election = new Election({
    name: req.body.name,
    description: req.body.description,
    ballot: req.body.ballot,
  });

  try {
    await election.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    console.log("elections.js: failed to submit election \"" + req.body.name + "\"");
    return res.sendStatus(500);
  }
});

// Get elections
router.get('/all', async (req, res) => {
  try {
    let elections = await Election.find().sort({
      closure: -1
    }).populate('ballot');
    
    return res.send(elections);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get elections by ballot
router.get('/byBallot/:id', async (req, res) => {
  try {
    let ballot = await Ballot.findOne({
      _id: req.params.id
    });

    let elections = await Election.find({
      ballot: ballot
    }).populate('ballot');
    
    return res.send(elections);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get election by id
router.get('/:id', async (req, res) => {
  try {
    let election = await Election.findOne({
      _id: req.params.id
    }).populate('ballot');
    
    return res.send(election);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  model: Election,
  routes: router,
}
