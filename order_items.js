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
const DataSchema2 = new mongoose.Schema({
    name : String , 
    price : Number , 
    url : String , 
    typeOf : String ,
    description : String 
});

const User = mongoose.model('order_items', DataSchema2);

// GET user by userName
router.get('/', async (req, res) => {
  res.send('asdf')
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