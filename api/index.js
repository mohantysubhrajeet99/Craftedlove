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

// SEED MOCK DATA
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Ocean Wave Resin Art Side Table',
    category: 'Resin Art',
    price: 15999.00,
    image: '/assets/images/ocean-resin-table.png',
    images: ['/assets/images/ocean-resin-table.png'],
    inventory: 3,
    rating: 4.9,
    description: 'A stunning hand-poured resin side table featuring real sand, delicate seashells, and a starfish encapsulated in glossy, deep blue ocean wave layers. Built on a sturdy solid wood base.',
    reviews: [
      { user: 'Sarah M.', rating: 5, comment: 'Absolutely gorgeous! It looks like a real piece of the ocean in my living room.', date: '2026-08-15' },
      { user: 'David K.', rating: 5, comment: 'High quality build, smooth resin finish. Everyone who visits asks about it.', date: '2026-08-20' }
    ]
  },
  {
    id: 2,
    name: 'Lotus Pond Serene Resin Art Platter',
    category: 'Resin Art',
    price: 5499.00,
    image: '/assets/images/lotus-resin-tray.png',
    images: ['/assets/images/lotus-resin-tray.png'],
    inventory: 5,
    rating: 4.8,
    description: 'A serene, round decorative tray depicting a lush water lily pond. Features handmade resin pink lotuses and green lily pads floating on a glassy, transparent green water effect.',
    reviews: [
      { user: 'Emily P.', rating: 5, comment: 'The level of detail on the lotus petals is amazing. Very calming piece.', date: '2026-08-18' }
    ]
  },
  {
    id: 3,
    name: 'Pressed Flower Resin Photo Frame',
    category: 'Frames',
    price: 2999.00,
    image: '/assets/images/pressed-flower-frame.png',
    images: ['/assets/images/pressed-flower-frame.png'],
    inventory: 8,
    rating: 4.7,
    description: 'Preserve your beautiful memories in this crystal-clear resin photo frame, intricately embedded with colorful pressed daisies, foliage, and shimmering gold flakes.',
    reviews: [
      { user: 'Jessica L.', rating: 4, comment: 'Very pretty. Fits standard 4x6 photos perfectly.', date: '2026-08-12' }
    ]
  },
  {
    id: 4,
    name: 'Custom Lippan Art Photo Frame',
    category: 'Frames',
    price: 3799.00,
    image: '/assets/images/lippan-art-frame.png',
    images: ['/assets/images/lippan-art-frame.png'],
    inventory: 4,
    rating: 5.0,
    description: 'A traditional mud-and-mirror work frame featuring a circular floral geometric layout, handcrafted with white clay, gold accents, and multiple small mirrors. Perfect for wedding or couple portraits.',
    reviews: [
      { user: 'Amit S.', rating: 5, comment: 'The mirror work is meticulous. Beautiful traditional piece of art.', date: '2026-08-24' }
    ]
  },
  {
    id: 5,
    name: 'Handcrafted Bridal Kalire / Wedding Hangings',
    category: 'Accessories',
    price: 6799.00,
    image: '/assets/images/wedding-kalire.png',
    images: ['/assets/images/wedding-kalire.png'],
    inventory: 6,
    rating: 4.9,
    description: 'Vibrant and traditional bridal wedding hangings featuring soft pom-poms in hot pink and bright orange, golden beads, and customized cushions with elegant gold hand-embroidery.',
    reviews: [
      { user: 'Pooja R.', rating: 5, comment: 'Customised with my initials and they look stunning! Fabric quality is premium.', date: '2026-08-22' }
    ]
  },
  {
    id: 6,
    name: 'Blue Daisy Hand-Painted Glass Bottle',
    category: 'Glass Art',
    price: 2499.00,
    image: '/assets/images/blue-daisy-bottle.png',
    images: ['/assets/images/blue-daisy-bottle.png'],
    inventory: 10,
    rating: 4.6,
    description: 'An elegant glass bottle transformed with a blue and white gradient paint style, adorned with delicate hand-painted daisy flowers. Perfect as a decorative vase or a cozy table accent.',
    reviews: [
      { user: 'Clara T.', rating: 4, comment: 'Vibrant colors. Looks beautiful with fairy lights inside.', date: '2026-08-10' }
    ]
  },
  {
    id: 7,
    name: 'Golden Buddha Hand-Painted Bottle',
    category: 'Glass Art',
    price: 3399.00,
    image: '/assets/images/buddha-bottle.png',
    images: ['/assets/images/buddha-bottle.png'],
    inventory: 7,
    rating: 4.8,
    description: 'A serene, matte yellow hand-painted glass bottle featuring a stylized Buddha face outline with elaborate golden textured circle details representing the hair.',
    reviews: [
      { user: 'Rohan G.', rating: 5, comment: 'Brings a peaceful vibe to my study room. Paint is durable.', date: '2026-08-19' }
    ]
  },
  {
    id: 8,
    name: 'Cherry Blossom Silhouette Textured Bottle',
    category: 'Glass Art',
    price: 2799.00,
    image: '/assets/images/cherry-blossom-bottle.png',
    images: ['/assets/images/cherry-blossom-bottle.png'],
    inventory: 8,
    rating: 4.7,
    description: 'A beautiful textured bottle painted with a rich pink-and-white gradient, featuring the hand-painted silhouette of a cherry blossom tree\'s black branches.',
    reviews: []
  },
  {
    id: 9,
    name: 'Handcrafted Tricolor Grain Art Bottle',
    category: 'Glass Art',
    price: 1999.00,
    image: '/assets/images/grain-art-bottle.png',
    images: ['/assets/images/grain-art-bottle.png'],
    inventory: 12,
    rating: 4.5,
    description: 'A unique, tactile decorative bottle covered completely in tiny colored rice grains forming horizontal stripes of black, red, orange, and yellow.',
    reviews: []
  },
  {
    id: 10,
    name: 'Artisanal Hand-Painted Bottle Collection',
    category: 'Glass Art',
    price: 8499.00,
    image: '/assets/images/bottle-collection.png',
    images: ['/assets/images/bottle-collection.png'],
    inventory: 2,
    rating: 5.0,
    description: 'A beautiful curated set of four unique hand-painted decorative bottles, featuring the Buddha face, the tricolor grain pattern, the cherry blossom silhouette, and other abstract designs.',
    reviews: [
      { user: 'Neha M.', rating: 5, comment: 'This set looks stunning together on my console table. Absolutely love the artisan details.', date: '2026-08-25' }
    ]
  },
  {
    id: 11,
    name: 'Artisanal Dark Chocolate Truffles',
    category: 'Chocolates',
    price: 1699.00,
    image: '/assets/images/dark-chocolate-box.jpg',
    images: ['/assets/images/dark-chocolate-box.jpg'],
    inventory: 15,
    rating: 4.9,
    description: 'A box of 6 ultra-premium, hand-rolled dark chocolate truffles made from single-origin cacao, dusted with gold leaf. Rich, decadent, and crafted with love.',
    reviews: [
      { user: 'Marcus V.', rating: 5, comment: 'The best truffles I have ever eaten. The dark chocolate is so rich!', date: '2026-08-26' }
    ]
  },
  {
    id: 12,
    name: 'Gourmet Fruit & Nut Chocolate Bark',
    category: 'Chocolates',
    price: 1299.00,
    image: '/assets/images/gourmet-chocolate-bark.jpg',
    images: ['/assets/images/gourmet-chocolate-bark.jpg'],
    inventory: 20,
    rating: 4.8,
    description: 'Hand-poured premium dark chocolate slab loaded with roasted almonds, pistachios, sea salt flakes, and tangy dried cranberries. A perfect balance of sweet, salty, and tart.',
    reviews: [
      { user: 'Sonia P.', rating: 5, comment: 'Love the crunch of nuts and the salty-sweet combination!', date: '2026-08-25' }
    ]
  }
];

const DEFAULT_USERS = [
  { name: 'Store Owner', email: 'admin@kraftedlove.com', password: 'admin123', isAdmin: true },
  { name: 'Jane Doe', email: 'user@kraftedlove.com', password: 'user123', isAdmin: false }
];

const DEFAULT_ORDERS = [
  {
    id: 'ORD-9874',
    userEmail: 'user@kraftedlove.com',
    userName: 'Jane Doe',
    items: [
      {
        product: DEFAULT_PRODUCTS[5],
        quantity: 1
      },
      {
        product: DEFAULT_PRODUCTS[10],
        quantity: 2
      }
    ],
    subtotal: 5897.00,
    shipping: 499.00,
    tax: 471.76,
    total: 6867.76,
    date: '2026-08-26T14:32:00.000Z',
    status: 'Shipped',
    timeline: [
      { status: 'Pending', time: '2026-08-26T14:32:00.000Z', note: 'Order placed by customer.' },
      { status: 'Processing', time: '2026-08-26T16:15:00.000Z', note: 'Artisan preparing packaging.' },
      { status: 'Shipped', time: '2026-08-27T09:00:00.000Z', note: 'Handed over to courier. Tracking: CL-5489812' }
    ],
    shippingDetails: {
      address: '123 Creative Lane',
      city: 'Portland',
      zip: '97201',
      country: 'United States'
    }
  }
];

async function seedDatabase() {
  const pCount = await Product.countDocuments();
  if (pCount === 0) {
    await Product.insertMany(DEFAULT_PRODUCTS);
    console.log('Seeded products database');
  }

  const uCount = await User.countDocuments();
  if (uCount === 0) {
    await User.insertMany(DEFAULT_USERS);
    console.log('Seeded users database');
  } else {
    const hasAdmin = await User.findOne({ email: 'admin@kraftedlove.com' });
    if (!hasAdmin) {
      await User.create({ name: 'Store Owner', email: 'admin@kraftedlove.com', password: 'admin123', isAdmin: true });
      console.log('Seeded missing admin user');
    }
    const hasUser = await User.findOne({ email: 'user@kraftedlove.com' });
    if (!hasUser) {
      await User.create({ name: 'Jane Doe', email: 'user@kraftedlove.com', password: 'user123', isAdmin: false });
      console.log('Seeded missing default user');
    }
  }

  const oCount = await Order.countDocuments();
  if (oCount === 0) {
    await Order.insertMany(DEFAULT_ORDERS);
    console.log('Seeded orders database');
  }
}

// REST API ROUTES
app.get('/api/products', async (req, res) => {
  try {
    await seedDatabase();
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
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${req.body.email.trim()}$`, 'i') },
      password: req.body.password
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
    const exists = await User.findOne({ email: { $regex: new RegExp(`^${req.body.email.trim()}$`, 'i') } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const isAdmin = req.body.email.toLowerCase() === 'admin@kraftedlove.com';
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isAdmin
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

app.post('/api/reset', async (req, res) => {
  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await seedDatabase();
    res.json({ message: 'Database reset and seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root handler
app.get('/api', (req, res) => {
  res.json({ name: 'KraftedLove serverless API', status: 'ready' });
});

// Port binding for local standalone development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Standalone local Express server running on port ${PORT}`);
  });
}

export default app;
