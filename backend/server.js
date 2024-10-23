const express = require('express');
require('dotenv').config();
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');
const Product = require('./models/product');

const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}))
.catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Fetch all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Fetch product details
app.post('/fetch-details', async (req, res) => {
  const { url } = req.body;

  try {
    if (!url.includes('flipkart.com')) {
      return res.status(400).json({ error: 'Invalid Flipkart URL' });
    }

    const existingProduct = await Product.findOne({ url });
    if (existingProduct) {
      // If product already exists, update price history
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
      await page.goto(url, { waitUntil: 'networkidle0' });

      const productDetails = await page.evaluate(() => {
        const price = document.querySelector('div.Nx9bqj.CxhGGd')?.innerText || 'Price not found';
        return { price };
      });

      existingProduct.priceHistory.push({ price: productDetails.price });
      await existingProduct.save();

      await browser.close();
      return res.json(existingProduct);
    }

    // Fetch new product details
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    await page.goto(url, { waitUntil: 'networkidle0' });

    const productDetails = await page.evaluate(() => {
      const title = document.querySelector('span.VU-ZEz')?.innerText || 'Title not found';
      const price = document.querySelector('div.Nx9bqj.CxhGGd')?.innerText || 'Price not found';
      const description = document.querySelector('div.yN+eNk.w9jEaj p')?.innerText || 'Description not found';
      const highlights = Array.from(document.querySelectorAll('div.xFVion ul li._7eSDEz')).map(li => li.innerText).join(', ') || 'Highlights not found';
      const rating = document.querySelector('div.XQDdHH')?.innerText || 'Rating not found';
      const reviews = document.querySelector('div.XQDdHH.Ga3i8K')?.innerText || 'Reviews not found';
      const imageUrl = document.querySelector('img._53J4C-.utBuJY')?.src || 'Image not found';
      const totalPurchases = document.querySelector('span._2_R_DZ span')?.innerText || 'Total purchases not found';

      return { title, price, description, highlights, rating, reviews, imageUrl, totalPurchases };
    });

    // Save new product to the database
    const newProduct = new Product({
      title: productDetails.title,
      url,
      description: productDetails.description,
      highlights: productDetails.highlights,
      rating: productDetails.rating,
      reviews: productDetails.reviews,
      imageUrl: productDetails.imageUrl,
      totalPurchases: productDetails.totalPurchases,
      priceHistory: [{ price: productDetails.price }]
    });

    await newProduct.save();
    await browser.close();

    res.json(newProduct);
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// Fallback route for React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});
