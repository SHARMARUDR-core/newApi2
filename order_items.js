const express = require('express')
const router = require(express.Router())
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://rudrsharma103:rudrdb@victara-cluster.outgk.mongodb.net/victara-user', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const DataSchema = new mongoose.Schema({
    // Define your schema based on the collection
    name : String , 
    price : Number , 
    url : String , 
    typeOf : String ,
    description : String 
  });
    
const user = mongoose.model('ordered_items', DataSchema);
  
  router.get('/', async (req, res) => {
    try {
      const data = await user.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data' });
    }
  })

  router.post('/', async (req, res) => {
    try {
      console.log(req.body);
      const { name , price , url , typeOf , description } = req.body;
  
      const result = await user.create({
        name : name , 
        price : price , 
        url : url ,
        typeOf : typeOf , 
        description :description
      });
      // access result._id 
      console.log(result._id);
      // Send back the ID of the newly created user
      res.send('thankyou your data has been added to db')
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ msg: 'Error creating user', error: error.message });
    }
  })

module.exports = router