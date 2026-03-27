const express = require('express');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/products');
});

router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.render('products', { products });
});

router.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('productDetail', { product });
});

router.post('/cart', (req, res) => {
  const productId = req.body.productId;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  req.session.cart.push(productId);
  res.redirect('/cart');
});

router.get('/cart', async (req, res) => {
  const cart = req.session.cart || [];
  const products = await Product.find({ _id: { $in: cart } });
  res.render('cart', { products });
});

router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    const newProduct = new Product({ name, description, price, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/api/products/:id', async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, imageUrl },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('PUT /api/products/:id error:', err);
    res
      .status(500)
      .json({ error: 'Failed to update product', details: err.message });
  }
});

router.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (err) {
    console.error('DELETE /api/products/:id error:', err);
    res
      .status(500)
      .json({ error: 'Failed to delete product', details: err.message });
  }
});

module.exports = router;
