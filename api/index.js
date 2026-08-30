import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let cachedConnection = null;
async function connectDb() {
  if (cachedConnection) {
    return cachedConnection;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI env variable is missing');
  }
  cachedConnection = await mongoose.connect(uri);
  return cachedConnection;
}

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// SCHEMAS & MODELS
const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  inventory: { type: Number, required: true },
  rating: { type: Number, default: 5.0 },
  description: { type: String, default: '' },
  reviews: [{
    user: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true }
  }]
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  items: [{
    product: {
      id: Number,
      name: String,
      category: String,
      price: Number,
      image: String,
      images: [String],
      inventory: Number,
      rating: Number,
      description: String
    },
    quantity: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true, default: 'Pending' },
  timeline: [{
    status: String,
    time: String,
    note: String
  }],
  shippingDetails: {
    address: String,
    city: String,
    zip: String,
    country: String
  }
});
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

const ADMIN_USER = {
  name: 'Store Owner',
  email: 'owner@kraftedlove.in',
  password: 'KraftedLove!9vQ3#2026'
};

async function upsertAdminUser() {
  return User.findOneAndUpdate(
    { email: ADMIN_USER.email },
    { ...ADMIN_USER, isAdmin: true },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

// REST API ROUTES
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const nextId = (await Product.findOne().sort({ id: -1 }))?.id + 1 || 1;
    const newProduct = new Product({
      id: nextId,
      name: req.body.name,
      category: req.body.category,
      price: parseFloat(req.body.price) || 0.00,
      image: req.body.image,
      images: req.body.images && req.body.images.length > 0 ? req.body.images : [req.body.image],
      inventory: parseInt(req.body.inventory) || 0,
      description: req.body.description || ''
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      {
        name: req.body.name,
        category: req.body.category,
        price: parseFloat(req.body.price) || 0.00,
        image: req.body.image,
        images: req.body.images && req.body.images.length > 0 ? req.body.images : [req.body.image],
        inventory: parseInt(req.body.inventory) || 0,
        description: req.body.description
      },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.reviews.unshift({
      user: req.body.user,
      rating: parseInt(req.body.rating),
      comment: req.body.comment,
      date: req.body.date
    });

    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    if (email === ADMIN_USER.email) {
      if (password !== ADMIN_USER.password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const admin = await upsertAdminUser();
      return res.json({ success: true, user: { name: admin.name, email: admin.email, isAdmin: true } });
    }

    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      password,
      isAdmin: false
    });
    if (user) {
      res.json({ success: true, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    if (email === ADMIN_USER.email) {
      return res.status(403).json({ success: false, message: 'This email is reserved for the store owner.' });
    }

    const exists = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = new User({
      name: req.body.name,
      email,
      password: req.body.password,
      isAdmin: false
    });
    await user.save();
    res.json({ success: true, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const email = req.query.email;
    const isAdmin = req.query.isAdmin === 'true';

    let orders;
    if (isAdmin) {
      orders = await Order.find({}).sort({ date: -1 });
    } else if (email) {
      orders = await Order.find({ userEmail: email }).sort({ date: -1 });
    } else {
      return res.status(400).json({ error: 'Email parameter required' });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    // Check inventory
    const cart = req.body.cart;
    for (const item of cart) {
      const p = await Product.findOne({ id: item.product.id });
      if (!p || p.inventory < item.quantity) {
        return res.status(400).json({ error: `"${item.product.name}" is out of stock.` });
      }
    }

    // Deduct stock levels
    for (const item of cart) {
      await Product.findOneAndUpdate(
        { id: item.product.id },
        { $inc: { inventory: -item.quantity } }
      );
    }

    const newOrder = new Order({
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      userEmail: req.body.userEmail,
      userName: req.body.userName,
      items: cart,
      subtotal: parseFloat(req.body.subtotal),
      shipping: parseFloat(req.body.shipping),
      tax: parseFloat(req.body.tax),
      total: parseFloat(req.body.total),
      date: new Date().toISOString(),
      status: 'Pending',
      timeline: [
        { status: 'Pending', time: new Date().toISOString(), note: 'Order placed by customer.' }
      ],
      shippingDetails: req.body.shippingDetails
    });

    await newOrder.save();
    res.status(201).json({ success: true, orderId: newOrder.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = req.body.status;
    order.timeline.push({
      status: req.body.status,
      time: new Date().toISOString(),
      note: req.body.note
    });

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root handler
app.get('/api', (req, res) => {
  res.json({ name: 'KraftedLove serverless API', status: 'ready' });
});

export default app;
