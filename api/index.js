import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const phoneRegex = /^\+\d{7,15}$/;
const demoCustomerEmails = ['user@kraftedlove.com', 'user@craftedlove.com'];
let productionCleanupComplete = false;

function defaultCustomizationForProduct(product = {}) {
  const category = String(product.category || '').toLowerCase();
  const name = String(product.name || '').toLowerCase();
  const isFrame = category.includes('frame') || name.includes('frame') || name.includes('photo');
  const isAccessory = category.includes('accessor') || name.includes('kalire') || name.includes('wedding');
  const isGlass = category.includes('glass') || name.includes('bottle');
  const isResin = category.includes('resin') || name.includes('resin');
  const isChocolate = category.includes('chocolate') || name.includes('chocolate');

  if (isFrame) {
    return {
      enabled: true,
      allowNotes: true,
      allowPhotos: true,
      allowText: true,
      allowTheme: true,
      instructions: 'Upload the photo and share names, dates, colors, or message details for the frame.'
    };
  }
  if (isAccessory) {
    return {
      enabled: true,
      allowNotes: true,
      allowPhotos: true,
      allowText: true,
      allowTheme: true,
      instructions: 'Share names, initials, wedding colors, outfit reference, or any personal message.'
    };
  }
  if (isGlass || isResin) {
    return {
      enabled: true,
      allowNotes: true,
      allowPhotos: true,
      allowText: false,
      allowTheme: true,
      instructions: 'Share your preferred colors, theme, room decor reference, or inspiration photo.'
    };
  }
  if (isChocolate) {
    return {
      enabled: true,
      allowNotes: true,
      allowPhotos: false,
      allowText: true,
      allowTheme: false,
      instructions: 'Add a gifting message, dietary note, or packaging preference.'
    };
  }
  return {
    enabled: false,
    allowNotes: false,
    allowPhotos: false,
    allowText: false,
    allowTheme: false,
    instructions: ''
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeCustomizationSettings(productLike) {
  const defaults = defaultCustomizationForProduct(productLike);
  const incoming = productLike.customization || {};
  return {
    enabled: Boolean(incoming.enabled ?? defaults.enabled),
    allowNotes: Boolean(incoming.allowNotes ?? defaults.allowNotes),
    allowPhotos: Boolean(incoming.allowPhotos ?? defaults.allowPhotos),
    allowText: Boolean(incoming.allowText ?? defaults.allowText),
    allowTheme: Boolean(incoming.allowTheme ?? defaults.allowTheme),
    instructions: String(incoming.instructions ?? defaults.instructions).slice(0, 500)
  };
}

function withCustomizationDefaults(product) {
  const plain = typeof product.toObject === 'function' ? product.toObject() : product;
  return {
    ...plain,
    customization: normalizeCustomizationSettings(plain)
  };
}

function sanitizeCustomizationRequests(requests = [], cart = []) {
  if (!Array.isArray(requests)) return [];
  const cartProductIds = new Set(cart.map(item => Number(item.product?.id)));

  return requests
    .filter(request => cartProductIds.has(Number(request.productId)))
    .map(request => ({
      productId: Number(request.productId),
      productName: String(request.productName || '').slice(0, 180),
      notes: String(request.notes || '').slice(0, 1200),
      customText: String(request.customText || '').slice(0, 500),
      theme: String(request.theme || '').slice(0, 300),
      files: Array.isArray(request.files)
        ? request.files.slice(0, 3).map(file => ({
            name: String(file.name || 'uploaded-reference').slice(0, 160),
            type: String(file.type || 'image/jpeg').slice(0, 80),
            data: String(file.data || '').slice(0, 900000)
          })).filter(file => file.data.startsWith('data:image/'))
        : []
    }));
}

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
  customization: {
    enabled: { type: Boolean, default: false },
    allowNotes: { type: Boolean, default: false },
    allowPhotos: { type: Boolean, default: false },
    allowText: { type: Boolean, default: false },
    allowTheme: { type: Boolean, default: false },
    instructions: { type: String, default: '' }
  },
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
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });
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
      description: String,
      customization: {
        enabled: Boolean,
        allowNotes: Boolean,
        allowPhotos: Boolean,
        allowText: Boolean,
        allowTheme: Boolean,
        instructions: String
      }
    },
    quantity: { type: Number, required: true }
  }],
  customizationRequests: [{
    productId: Number,
    productName: String,
    notes: String,
    customText: String,
    theme: String,
    files: [{
      name: String,
      type: String,
      data: String
    }]
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

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const AnalyticsEventSchema = new mongoose.Schema({
  type: { type: String, required: true, index: true },
  page: { type: String, default: '' },
  sessionId: { type: String, default: '', index: true },
  userEmail: { type: String, default: '' },
  productId: { type: Number, default: null },
  productName: { type: String, default: '' },
  category: { type: String, default: '' },
  value: { type: Number, default: 0 },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now, index: true }
});
const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', AnalyticsEventSchema);

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

async function cleanupProductionDemoData() {
  if (productionCleanupComplete) return;
  productionCleanupComplete = true;

  await User.deleteMany({ email: { $in: demoCustomerEmails } });
  await Order.deleteMany({
    $or: [
      { userEmail: { $in: demoCustomerEmails } },
      { id: 'ORD-9874' },
      { userName: 'Jane Doe', total: 6867.76 }
    ]
  });
}

async function syncCategoriesFromProducts() {
  const productCategories = await Product.distinct('category');
  const cleanCategories = productCategories
    .filter(Boolean)
    .map(category => category.trim())
    .filter(Boolean);

  if (cleanCategories.length > 0) {
    await Category.bulkWrite(
      cleanCategories.map(name => ({
        updateOne: {
          filter: { name },
          update: { $setOnInsert: { name } },
          upsert: true
        }
      })),
      { ordered: false }
    );
  }
}

// REST API ROUTES
app.get('/api/products', async (req, res) => {
  try {
    await cleanupProductionDemoData();
    await syncCategoriesFromProducts();
    const products = await Product.find({});
    res.json(products.map(withCustomizationDefaults));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const categoryName = req.body.category?.trim();
    if (!categoryName) {
      return res.status(400).json({ error: 'Category is required' });
    }

    await Category.findOneAndUpdate(
      { name: categoryName },
      { $setOnInsert: { name: categoryName } },
      { upsert: true, new: true }
    );

    const nextId = (await Product.findOne().sort({ id: -1 }))?.id + 1 || 1;
    const newProduct = new Product({
      id: nextId,
      name: req.body.name,
      category: categoryName,
      price: parseFloat(req.body.price) || 0.00,
      image: req.body.image,
      images: req.body.images && req.body.images.length > 0 ? req.body.images : [req.body.image],
      inventory: parseInt(req.body.inventory) || 0,
      description: req.body.description || '',
      customization: normalizeCustomizationSettings({ ...req.body, category: categoryName })
    });
    await newProduct.save();
    res.status(201).json(withCustomizationDefaults(newProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const categoryName = req.body.category?.trim();
    if (!categoryName) {
      return res.status(400).json({ error: 'Category is required' });
    }

    await Category.findOneAndUpdate(
      { name: categoryName },
      { $setOnInsert: { name: categoryName } },
      { upsert: true, new: true }
    );

    const product = await Product.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      {
        name: req.body.name,
        category: categoryName,
        price: parseFloat(req.body.price) || 0.00,
        image: req.body.image,
        images: req.body.images && req.body.images.length > 0 ? req.body.images : [req.body.image],
        inventory: parseInt(req.body.inventory) || 0,
        description: req.body.description,
        customization: normalizeCustomizationSettings({ ...req.body, category: categoryName })
      },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(withCustomizationDefaults(product));
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
    
    res.json(withCustomizationDefaults(product));
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
      email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') },
      password,
      isAdmin: false
    });
    if (user) {
      res.json({ success: true, user: { name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin } });
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
    const phone = req.body.phone?.trim();
    if (email === ADMIN_USER.email) {
      return res.status(403).json({ success: false, message: 'This email is reserved for the store owner.' });
    }

    if (!phoneRegex.test(phone || '')) {
      return res.status(400).json({ success: false, message: 'Phone number must include country code, for example +919876543210.' });
    }

    const exists = await User.findOne({ email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = new User({
      name: req.body.name,
      email,
      phone,
      password: req.body.password,
      isAdmin: false
    });
    await user.save();
    res.json({ success: true, user: { name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function buildCustomerSummary(user, orders) {
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalItems = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + Number(item.quantity || 0), 0);
  }, 0);
  const categories = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.product?.category || 'Uncategorized';
      categories[category] = (categories[category] || 0) + Number(item.quantity || 0);
    });
  });
  const favoriteCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No orders yet';

  let valueLabel = 'New customer';
  if (orders.length >= 3 || totalSpent >= 15000) {
    valueLabel = 'High-value customer';
  } else if (orders.length >= 1) {
    valueLabel = 'Active customer';
  }

  return {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    joinedAt: user.createdAt || null,
    orderCount: orders.length,
    totalSpent: parseFloat(totalSpent.toFixed(2)),
    averageOrderValue: orders.length ? parseFloat((totalSpent / orders.length).toFixed(2)) : 0,
    totalItems,
    favoriteCategory,
    valueLabel,
    lastOrderDate: orders[0]?.date || null
  };
}

function startOfDay(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

function incrementCount(map, key, amount = 1) {
  const safeKey = key || 'Unknown';
  map[safeKey] = (map[safeKey] || 0) + amount;
}

function topEntries(map, limit = 8) {
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

app.get('/api/admin/users', async (req, res) => {
  try {
    await cleanupProductionDemoData();
    const users = await User.find({ isAdmin: false, email: { $nin: demoCustomerEmails } }).sort({ createdAt: -1 });
    const orders = await Order.find({ userEmail: { $nin: demoCustomerEmails } }).sort({ date: -1 });
    const summaries = users.map(user => {
      const userOrders = orders.filter(order => order.userEmail.toLowerCase() === user.email.toLowerCase());
      return buildCustomerSummary(user, userOrders);
    });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users/:email', async (req, res) => {
  try {
    await cleanupProductionDemoData();
    const email = decodeURIComponent(req.params.email).trim().toLowerCase();
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') },
      isAdmin: false
    });
    if (!user) return res.status(404).json({ error: 'Customer not found' });

    const orders = await Order.find({
      userEmail: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') }
    }).sort({ date: -1 });

    res.json({
      customer: buildCustomerSummary(user, orders),
      orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/customer-insights', async (req, res) => {
  try {
    await cleanupProductionDemoData();
    const users = await User.find({ isAdmin: false, email: { $nin: demoCustomerEmails } }).sort({ createdAt: -1 });
    const orders = await Order.find({ userEmail: { $nin: demoCustomerEmails } }).sort({ date: -1 });
    const summaries = users.map(user => {
      const userOrders = orders.filter(order => order.userEmail.toLowerCase() === user.email.toLowerCase());
      return buildCustomerSummary(user, userOrders);
    });

    const orderedCustomers = summaries.filter(customer => customer.orderCount > 0);
    const topCustomer = [...orderedCustomers].sort((a, b) => b.totalSpent - a.totalSpent)[0] || null;
    const mostActiveCustomer = [...orderedCustomers].sort((a, b) => b.orderCount - a.orderCount)[0] || null;
    const totalRevenue = summaries.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const averageSpendPerCustomer = summaries.length ? totalRevenue / summaries.length : 0;
    const customersWithNoOrders = summaries.filter(customer => customer.orderCount === 0).length;
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const newCustomers = summaries.filter(customer => customer.joinedAt && new Date(customer.joinedAt).getTime() >= thirtyDaysAgo).length;

    res.json({
      totalCustomers: summaries.length,
      newCustomers,
      customersWithNoOrders,
      averageSpendPerCustomer: parseFloat(averageSpendPerCustomer.toFixed(2)),
      topCustomer,
      mostActiveCustomer,
      highValueCustomers: summaries.filter(customer => customer.valueLabel === 'High-value customer').length,
      customerQuality: summaries.map(customer => ({
        name: customer.name,
        email: customer.email,
        orderCount: customer.orderCount,
        totalSpent: customer.totalSpent,
        averageOrderValue: customer.averageOrderValue,
        favoriteCategory: customer.favoriteCategory,
        valueLabel: customer.valueLabel
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/analytics/track', async (req, res) => {
  try {
    const allowedTypes = new Set([
      'page_view',
      'nav_click',
      'product_view',
      'add_to_cart',
      'cart_open',
      'checkout_start',
      'checkout_submit',
      'order_placed',
      'login',
      'register',
      'category_filter',
      'search'
    ]);
    const type = String(req.body.type || '').trim();
    if (!allowedTypes.has(type)) {
      return res.status(400).json({ error: 'Unsupported analytics event type' });
    }

    await AnalyticsEvent.create({
      type,
      page: String(req.body.page || '').slice(0, 120),
      sessionId: String(req.body.sessionId || '').slice(0, 120),
      userEmail: String(req.body.userEmail || '').trim().toLowerCase().slice(0, 160),
      productId: req.body.productId ? Number(req.body.productId) : null,
      productName: String(req.body.productName || '').slice(0, 180),
      category: String(req.body.category || '').slice(0, 120),
      value: Number(req.body.value || 0),
      metadata: req.body.metadata && typeof req.body.metadata === 'object' ? req.body.metadata : {}
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/analytics', async (req, res) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days) || 30, 7), 90);
    const since = startOfDay(new Date(Date.now() - ((days - 1) * 24 * 60 * 60 * 1000)));
    const events = await AnalyticsEvent.find({ createdAt: { $gte: since } }).sort({ createdAt: 1 });
    const orders = await Order.find({ date: { $gte: since.toISOString() }, userEmail: { $nin: demoCustomerEmails } }).sort({ date: 1 });
    const users = await User.find({ isAdmin: false, email: { $nin: demoCustomerEmails }, createdAt: { $gte: since } });

    const pageViews = events.filter(event => event.type === 'page_view');
    const totalVisits = pageViews.length;
    const uniqueVisitors = new Set(pageViews.map(event => event.sessionId).filter(Boolean)).size;
    const totalClicks = events.filter(event => event.type !== 'page_view').length;
    const productViews = events.filter(event => event.type === 'product_view').length;
    const addToCartClicks = events.filter(event => event.type === 'add_to_cart').length;
    const checkoutStarts = events.filter(event => event.type === 'checkout_start').length;
    const checkoutSubmits = events.filter(event => event.type === 'checkout_submit').length;
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    const pageMap = {};
    const productViewMap = {};
    const productCartMap = {};
    const categoryInterestMap = {};
    const actionMap = {};
    const dailyMap = {};
    const recentEvents = events.slice(-20).reverse().map(event => ({
      type: event.type,
      page: event.page,
      productName: event.productName,
      category: event.category,
      createdAt: event.createdAt
    }));

    for (let i = 0; i < days; i += 1) {
      const key = startOfDay(new Date(since.getTime() + (i * 24 * 60 * 60 * 1000))).toISOString().slice(0, 10);
      dailyMap[key] = { date: key, visits: 0, clicks: 0, orders: 0, revenue: 0 };
    }

    events.forEach(event => {
      const dayKey = startOfDay(event.createdAt).toISOString().slice(0, 10);
      if (!dailyMap[dayKey]) dailyMap[dayKey] = { date: dayKey, visits: 0, clicks: 0, orders: 0, revenue: 0 };
      if (event.type === 'page_view') {
        dailyMap[dayKey].visits += 1;
        incrementCount(pageMap, event.page || 'Unknown');
      } else {
        dailyMap[dayKey].clicks += 1;
        incrementCount(actionMap, event.type);
      }
      if (event.type === 'product_view') incrementCount(productViewMap, event.productName || `Product #${event.productId}`);
      if (event.type === 'add_to_cart') incrementCount(productCartMap, event.productName || `Product #${event.productId}`);
      if (event.category) incrementCount(categoryInterestMap, event.category);
    });

    orders.forEach(order => {
      const dayKey = startOfDay(new Date(order.date)).toISOString().slice(0, 10);
      if (!dailyMap[dayKey]) dailyMap[dayKey] = { date: dayKey, visits: 0, clicks: 0, orders: 0, revenue: 0 };
      dailyMap[dayKey].orders += 1;
      dailyMap[dayKey].revenue += Number(order.total || 0);
    });

    const conversionRate = uniqueVisitors ? parseFloat(((orders.length / uniqueVisitors) * 100).toFixed(2)) : 0;
    const addToCartRate = productViews ? parseFloat(((addToCartClicks / productViews) * 100).toFixed(2)) : 0;
    const checkoutCompletionRate = checkoutStarts ? parseFloat(((orders.length / checkoutStarts) * 100).toFixed(2)) : 0;

    res.json({
      rangeDays: days,
      totals: {
        visits: totalVisits,
        uniqueVisitors,
        clicks: totalClicks,
        productViews,
        addToCartClicks,
        checkoutStarts,
        checkoutSubmits,
        orders: orders.length,
        revenue: parseFloat(revenue.toFixed(2)),
        newUsers: users.length,
        conversionRate,
        addToCartRate,
        checkoutCompletionRate,
        averageOrderValue: orders.length ? parseFloat((revenue / orders.length).toFixed(2)) : 0
      },
      topPages: topEntries(pageMap),
      topViewedProducts: topEntries(productViewMap),
      topCartProducts: topEntries(productCartMap),
      topCategories: topEntries(categoryInterestMap),
      topActions: topEntries(actionMap),
      daily: Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date)).map(day => ({
        ...day,
        revenue: parseFloat(day.revenue.toFixed(2))
      })),
      recentEvents
    });
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
      orders = await Order.find({
        userEmail: { $nin: demoCustomerEmails },
        id: { $ne: 'ORD-9874' },
        $nor: [{ userName: 'Jane Doe', total: 6867.76 }]
      }).sort({ date: -1 });
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
    const account = await User.findOne({
      email: { $regex: new RegExp(`^${escapeRegex(req.body.userEmail?.trim().toLowerCase() || '')}$`, 'i') },
      isAdmin: false
    });
    if (!account) {
      return res.status(401).json({ error: 'Please create an account and log in before placing an order.' });
    }

    // Check inventory
    const cart = req.body.cart;
    const customizationRequests = sanitizeCustomizationRequests(req.body.customizationRequests, cart);
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
      userEmail: account.email,
      userName: account.name,
      items: cart,
      customizationRequests,
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

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root handler
app.get('/api', (req, res) => {
  res.json({ name: 'KraftedLove serverless API', status: 'ready' });
});

app.get('/api/categories', async (req, res) => {
  try {
    await cleanupProductionDemoData();
    await syncCategoriesFromProducts();
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories.map(category => category.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await Category.findOneAndUpdate(
      { name },
      { $setOnInsert: { name } },
      { upsert: true, new: true }
    );
    res.status(201).json({ name: category.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories/:name', async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name).trim();
    const productCount = await Product.countDocuments({ category: name });
    if (productCount > 0) {
      return res.status(409).json({ error: `Cannot remove "${name}" because ${productCount} product(s) still use it.` });
    }

    await Category.deleteOne({ name });
    res.json({ message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
