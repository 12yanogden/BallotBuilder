const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const measures = require("./measures.js");
const Measure = measures.model;

const candidateSchema = new mongoose.Schema({
  name: String,
  measure: {
    type: mongoose.Schema.ObjectId,
    ref: 'Measure'
  },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// Submit a new candidate
router.post('/', async (req, res) => {
  // Verify parameters
  if (!req.body.name) {
    return res.status(400).send({
      message: "candidates.js: invalid firstName \"" + req.body.firstName + "\""
    });
  }

  if (!req.body.measure) {
    return res.status(400).send({
      message: "candidates.js: invalid measure \"" + req.body.measure + "\""
    });
  }

  let candidate = new Candidate({
    name: req.body.name,
    measure: req.body.measure,
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
      measure: -1
    });
    
    return res.send(candidates);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get candidates by measure
router.get('/byMeasure/:id', async (req, res) => {
  try {
    let measure = await Measure.findOne({
      _id: req.params.id
    });

    let candidates = await Candidate.find({
      measure: measure
    }).populate('measure');
    
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

// Edit a candidate
router.put('/:id', async (req, res) => {
  try {
    let candidate = await Candidate.findOne({
      _id: req.params.id
    }).populate('measure');

    candidate.name = req.body.name;
    candidate.measure = req.body.measure;
    
    await candidate.save();
    res.send(candidate);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Delete a candidate by its id
router.delete('/:id', async (req, res) => {
  try {
    await Candidate.deleteOne({
      _id: req.params.id
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = {
  model: Candidate,
  routes: router,
}
