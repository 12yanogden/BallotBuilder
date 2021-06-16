const express = require("express");
const mongoose = require('mongoose');
const argon2 = require("argon2");
const router = express.Router();

const voterSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

voterSchema.pre('save', async function(next) {
  if (!this.isModified('password'))
    return next();

  try {
    const hash = await argon2.hash(this.password);

    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

voterSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await argon2.verify(this.password, password);
    
    return isMatch;
  } catch (error) {
    return false;
  }
};

voterSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  
  return obj;
}

const Voter = mongoose.model('Voter', voterSchema);

// Middleware
const validVoter = async (req, res, next) => {
  if (!req.session.voterID)
    return res.status(403).send({
      message: "No voter is logged in"
    });
  try {
    const voter = await Voter.findOne({
      _id: req.session.voterID
    });
    if (!voter) {
      return res.status(403).send({
        message: "No voter is logged in"
      });
    }
 
    req.voter = voter;
  } catch (error) {
    return res.status(403).send({
      message: "No voter is logged in"
    });
  }

  next();
};

router.post('/', async (req, res) => {
  // Verify parameters
  if (!req.body.firstName) {
    return res.status(400).send({
      message: "invalid firstName \"" + req.body.firstName + "\""
    });
  }

  if (!req.body.lastName) {
    return res.status(400).send({
      message: "invalid lastName \"" + req.body.lastName + "\""
    });
  }

  if (!req.body.username) {
    return res.status(400).send({
      message: "invalid username \"" + req.body.username + "\""
    });
  }

  if (!req.body.password) {
    return res.status(400).send({
      message: "invalid password"
    });
  }

  try {
    const existingVoter = await Voter.findOne({
      username: req.body.username
    });

    if (existingVoter) {
      return res.status(403).send({
        message: "username \"" + req.body.username + "\" already exists"
      });
    }

    const voter = new Voter({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password
    });

    await voter.save();
    req.session.voterID = voter._id;

    return res.send({
      voter: voter
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post('/login', async (req, res) => {
  // Verify parameters
  if (!req.body.username) {
    return res.status(400).send({
      message: "invalid username \"" + req.body.username + "\""
    });
  }

  if (!req.body.password) {
    return res.status(400).send({
      message: "invalid password"
    });
  }

  try {
    const voter = await Voter.findOne({
      username: req.body.username
    });

    if (!voter)
      return res.status(403).send({
        message: "username \"" + req.body.username + "\" or password \"" + req.body.password + "\" is wrong"
      });

    if (!await voter.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username \"" + req.body.username + "\" or password \"" + req.body.password + "\" is wrong"
      });

    req.session.voterID = voter._id;

    return res.send({
      voter: voter
    });

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get('/', validVoter, async (req, res) => {
  try {
    res.send({
      voter: req.voter
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put('/admin/:id', async (req, res) => {
  try {
    let voter = await Voter.findOne({
      _id: req.params.id
    });

    voter.isAdmin = true;
    await voter.save();
    
    res.sendStatus(200);
    res.send(voter);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Logs the voter out
router.delete("/", validVoter, async (req, res) => {
  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
  model: Voter,
  valid: validVoter
};
