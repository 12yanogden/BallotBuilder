const express = require("express");
const mongoose = require('mongoose');
const argon2 = require("argon2");
const router = express.Router();

const builderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
});

builderSchema.pre('save', async function(next) {
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

builderSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await argon2.verify(this.password, password);
    
    return isMatch;
  } catch (error) {
    return false;
  }
};

builderSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  
  return obj;
}

const Builder = mongoose.model('Builder', builderSchema);

// Middleware
const validBuilder = async (req, res, next) => {
  if (!req.session.builderID)
    return res.status(403).send({
      message: "No builder is logged in"
    });
  try {
    const builder = await Builder.findOne({
      _id: req.session.builderID
    });
    if (!builder) {
      return res.status(403).send({
        message: "No builder is logged in"
      });
    }
 
    req.builder = builder;
  } catch (error) {
    return res.status(403).send({
      message: "No builder is logged in"
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
    const existingBuilder = await Builder.findOne({
      username: req.body.username
    });

    if (existingBuilder) {
      return res.status(403).send({
        message: "username \"" + req.body.username + "\" already exists"
      });
    }

    const builder = new Builder({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password
    });

    await builder.save();
    req.session.builderID = builder._id;

    return res.send({
      builder: builder
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
    const builder = await Builder.findOne({
      username: req.body.username
    });

    if (!builder)
      return res.status(403).send({
        message: "username or password is wrong"
      });

    if (!await builder.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });

    req.session.builderID = builder._id;

    return res.send({
      builder: builder
    });

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get('/', validBuilder, async (req, res) => {
  try {
    res.send({
      builder: req.builder
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Logs the builder out
router.delete("/", validBuilder, async (req, res) => {
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
  model: Builder,
  valid: validBuilder
};
