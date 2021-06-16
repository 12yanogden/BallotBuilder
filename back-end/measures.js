const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const ballots = require("./ballots.js");
const Ballot = ballots.model;

const measureSchema = new mongoose.Schema({
  name: String,
  description: String,
  ballot: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ballot'
  },
});

const Measure = mongoose.model('Measure', measureSchema);

// Submit a new measure
router.post('/', async (req, res) => {
  // Verify parameters
  if (!req.body.name) {
    return res.status(400).send({
      message: "measures.js: invalid name \"" + req.body.name + "\""
    });
  }

  if (!req.body.description) {
    return res.status(400).send({
      message: "measures.js: invalid description \"" + req.body.description + "\""
    });
  }

  if (!req.body.ballot) {
    return res.status(400).send({
      message: "measures.js: invalid ballot \"" + req.body.ballot + "\""
    });
  }

  let measure = new Measure({
    name: req.body.name,
    description: req.body.description,
    ballot: req.body.ballot,
  });

  try {
    await measure.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    console.log("measures.js: failed to submit measure \"" + req.body.name + "\"");
    return res.sendStatus(500);
  }
});

// Get measures
router.get('/all', async (req, res) => {
  try {
    let measures = await Measure.find().sort({
      closure: -1
    }).populate('ballot');
    
    return res.send(measures);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get measures by ballot
router.get('/byBallot/:id', async (req, res) => {
  try {
    let ballot = await Ballot.findOne({
      _id: req.params.id
    });

    let measures = await Measure.find({
      ballot: ballot
    }).populate('ballot');
    
    return res.send(measures);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get measure by id
router.get('/:id', async (req, res) => {
  try {
    let measure = await Measure.findOne({
      _id: req.params.id
    }).populate('ballot');
    
    return res.send(measure);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  model: Measure,
  routes: router,
}
