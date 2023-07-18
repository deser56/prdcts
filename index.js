const express = require('express');
const app = express();
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const supabaseUrl = 'https://nfpnxqfhyyugxmzktnfv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcG54cWZoeXl1Z3htemt0bmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2NTU5MTIsImV4cCI6MjAwNTIzMTkxMn0.W9RAEqX91vHRBigRvhCLBwf3NZGY5F9CXWm8DVqEKS0';

const supabase = createClient(supabaseUrl, supabaseKey);

const collectionName = 'products';

app.use(cors());
app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const { data: products, error } = await supabase.from(collectionName).select('*');
    if (error) {
      throw new Error(error.message);
    }
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.sendStatus(500);
  }
});

app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const { data: product, error } = await supabase
      .from(collectionName)
      .select('*')
      .eq('id', productId)
      .single();
    if (error) {
      throw new Error(error.message);
    }
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
    const { data, error } = await supabase.from(collectionName).insert([
      { name, price },
    ]);
    if (error) {
      throw new Error(error.message);
    }
    res.status(201).json({ _id: data });
  } catch (error) {
    console.error('Error creating product:', error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log('Product catalog service is running on port 3000');
});
