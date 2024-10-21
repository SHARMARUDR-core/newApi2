const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

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

const user = mongoose.model('items', DataSchema);

// API to get all data
app.get('/', async (req, res) => {
  try {
    const data = await user.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
})
app.post('/', async (req, res) => {
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

app.delete('/:name', async (req, res) => {
  const uri = "mongodb+srv://rudrsharma103:rudrdb@victara-cluster.outgk.mongodb.net/victara-user";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('victara-user');
    const collection = database.collection('items');

    // Extracting the name from req.params
    const itemName = req.params.name;

    // Delete the item with the matching name
    const result = await collection.deleteOne({ name: itemName });

    // Send appropriate response based on deletion result
    if (result.deletedCount === 1) {
      res.status(200).json({ message: `Item with name ${itemName} has been deleted.` });
    } else {
      res.status(404).json({ message: `No item found with the name ${itemName}.` });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
