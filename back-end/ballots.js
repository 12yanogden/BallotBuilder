const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const ballotSchema = new mongoose.Schema({
  name: String,
  openDate: Date,
  closeDate: Date,
  builder: {
    type: mongoose.Schema.ObjectId,
    ref: 'Builder'
  },
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

  if (!req.body.builder) {
    return res.status(400).send({
      message: "ballots.js: invalid builder \"" + req.body.builder + "\""
    });
  }

  let ballot = new Ballot({
    name: req.body.name,
    openDate: req.body.openDate,
    closeDate: req.body.closeDate,
    builder: req.body.builder,
  });

  try {
    await ballot.save();
    return res.send(ballot);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// Get ballots
router.get('/all', async (req, res) => {
  try {
    let ballots = await Ballot.find().sort({
      closeDate: -1
    }).populate('builder');

    return res.send(ballots);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// Get ballot by id
router.get('/:id', async (req, res) => {
  try {
    let ballot = await Ballot.findOne({
      _id: req.params.id
    }).populate('builder');

    return res.send(ballot);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// Edit a ballot
router.put('/:id', async (req, res) => {
  try {
    let ballot = await Ballot.findOne({
      _id: req.params.id
    }).populate('builder');

    ballot.name = req.body.name;
    ballot.openDate = req.body.openDate;
    ballot.closeDate = req.body.closeDate;
    
    await ballot.save();
    res.send(ballot);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Delete a ballot by its id
router.delete('/:id', async (req, res) => {
  try {
    await Ballot.deleteOne({
      _id: req.params.id
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = {
  model: Ballot,
  routes: router,
}
