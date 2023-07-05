const express = require('express');
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const connectionString = 'mongodb+srv://wanpatty168:epQJjPDJ7K45calo@cluster0.u76khmf.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'cluster0';
const collectionName = 'products';

let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}


// Enable CORS
app.use(cors());

app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const products = await db.collection(collectionName).find().toArray();
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.sendStatus(500);
  }
});

app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await db.collection(collectionName).findOne({
      _id: ObjectId(productId),
    });
    if (product) {
      res.json(product);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.sendStatus(500);
  }
});

app.post('/products', async (req, res ) => {
  const { name, price } = req.body;
  try {
    const result = await db.collection(collectionName).insertOne({
      name,
      price,
    });
    res.status(201).json({ _id: result.insertedId });
  } catch (error) {
    console.error('Error creating product:', error);
    res.sendStatus(500);
  }
});

connectToDatabase().then(() => {
  app.listen(3000, () => {
    console.log('Product catalog service is running on port 3000');
  });
});
