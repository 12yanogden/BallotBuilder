const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const voters = require("./voters.js");
const Voter = voters.model;
const validVoter = voters.valid;

const ballotSchema = new mongoose.Schema({
  name: String,
  openDate: Date,
  closeDate: Date,
});

const Ballot = mongoose.model('Ballot', ballotSchema);

// Submit a new ballot
router.post('/', async (req, res) => {
  // Verify parameters
  if (!req.body.name) {
    return res.status(400).send({
      message: "ballots.js: invalid name \"" + req.body.name + "\""
    });
  }

  if (!req.body.openDate) {
    return res.status(400).send({
      message: "ballots.js: invalid openDate \"" + req.body.openDate + "\""
    });
  }

  if (!req.body.closeDate) {
    return res.status(400).send({
      message: "ballots.js: invalid closeDate \"" + req.body.closeDate + "\""
    });
  }

  let ballot = new Ballot({
    name: req.body.name,
    openDate: req.body.openDate,
    closeDate: req.body.closeDate,
  });

  try {
    await ballot.save();
    return res.send(ballot);
  } catch (error) {
    console.log(error);
    console.log("ballots.js: failed to submit ballot \"" + req.body.name + "\"");
    return res.sendStatus(500);
  }
});

// Get ballots
router.get('/all', async (req, res) => {
  try {
    let ballots = await Ballot.find().sort({
      closeDate: -1
    });
    
    return res.send(ballots);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get ballot by id
router.get('/:id', async (req, res) => {
  try {
    let ballot = await Ballot.findOne({
      _id: req.params.id
    });
    
    return res.send(ballot);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  model: Ballot,
  routes: router,
}
