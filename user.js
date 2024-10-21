const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const app = express()
const helmet = require('helmet');


mongoose.connect('mongodb+srv://rudrsharma103:rudrdb@victara-cluster.outgk.mongodb.net/victara-user', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console , 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define your schema
const DataSchema = new mongoose.Schema({
  userName: String,
  password: Number
});

const User = mongoose.model('users', DataSchema);

// GET user by userName
router.get('/:userName', async (req, res) => {
  try {
      const { userName } = req.params;
      const data = await User.findOne({ userName }); // Fixed field matching
      if (data) {
          res.json(data);
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error fetching data' });
  }
});

// POST to create a new user
router.post('/', async (req, res) => {
    try {
        const { userName, password } = req.body;

        const result = await User.create({
            userName: userName,
            password: password
        });

        console.log(result._id);
        // Send back the ID of the newly created user
        res.status(201).json({ message: 'User created', userId: result._id });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ msg: 'Error creating user', error: error.message });
    }
});
module.exports = router;