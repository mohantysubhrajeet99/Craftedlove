import { reactive, watch } from 'vue';

// Default initial products catalog mapping to the copied image files
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Ocean Wave Resin Art Side Table',
    category: 'Resin Art',
    price: 15999.00,
    image: '/assets/images/ocean-resin-table.png',
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
    inventory: 20,
    rating: 4.8,
    description: 'Hand-poured premium dark chocolate slab loaded with roasted almonds, pistachios, sea salt flakes, and tangy dried cranberries. A perfect balance of sweet, salty, and tart.',
    reviews: [
      { user: 'Sonia P.', rating: 5, comment: 'Love the crunch of nuts and the salty-sweet combination!', date: '2026-08-25' }
    ]
  }
];

const DEFAULT_USERS = [
  { name: 'Store Owner', email: 'admin@craftedlove.com', password: 'admin123', isAdmin: true },
  { name: 'Jane Doe', email: 'user@craftedlove.com', password: 'user123', isAdmin: false }
];

const DEFAULT_ORDERS = [
  {
    id: 'ORD-9874',
    userEmail: 'user@craftedlove.com',
    userName: 'Jane Doe',
    items: [
      {
        product: DEFAULT_PRODUCTS[5], // Blue Daisy Bottle (₹2,499)
        quantity: 1
      },
      {
        product: DEFAULT_PRODUCTS[10], // Dark Truffles (₹1,699)
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

// Helper to load state from localStorage or use defaults
const getStored = (key, fallback) => {
  const val = localStorage.getItem(`craftedlove_${key}`);
  if (val) {
    try {
      return JSON.parse(val);
    } catch (e) {
      console.error(`Error parsing key ${key} from storage:`, e);
    }
  }
  return fallback;
};

// Create the global reactive store
export const store = reactive({
  products: [],
  orders: [],
  currentUser: getStored('currentUser', null),
  cart: getStored('cart', []),
  toasts: [],
  
  async init() {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        this.products = await res.json();
      }
      if (this.currentUser) {
        await this.fetchOrders();
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    }
  },

  async fetchOrders() {
    try {
      const email = this.currentUser.email;
      const isAdmin = this.currentUser.isAdmin;
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}&isAdmin=${isAdmin}`);
      if (res.ok) {
        this.orders = await res.json();
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    }
  },

  // TOAST NOTIFICATIONS
  addToast(message, type = 'success') {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    this.toasts.push({ id, message, type });
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 4000);
  },

  // AUTH ACTIONS
  async login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.currentUser = data.user;
        this.addToast(`Welcome back, ${data.user.name}!`, 'success');
        await this.fetchOrders();
        return { success: true };
      } else {
        this.addToast(data.message || 'Invalid email or password.', 'error');
        return { success: false, message: data.message };
      }
    } catch (e) {
      this.addToast('Connection to server failed.', 'error');
      return { success: false, message: 'Server error' };
    }
  },

  async register(name, email, password) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.currentUser = data.user;
        this.addToast(`Account created! Welcome, ${name}.`, 'success');
        await this.fetchOrders();
        return { success: true };
      } else {
        this.addToast(data.message || 'Registration failed.', 'error');
        return { success: false, message: data.message };
      }
    } catch (e) {
      this.addToast('Connection to server failed.', 'error');
      return { success: false, message: 'Server error' };
    }
  },

  logout() {
    this.addToast('Logged out successfully.', 'info');
    this.currentUser = null;
    this.orders = [];
  },

  // CART ACTIONS
  addToCart(product, quantity = 1) {
    const p = this.products.find(item => item.id === product.id);
    if (!p) {
      this.addToast('Product not found.', 'error');
      return;
    }
    
    if (p.inventory <= 0) {
      this.addToast('Sorry, this product is out of stock.', 'error');
      return;
    }

    const cartItem = this.cart.find(item => item.product.id === product.id);
    const currentQtyInCart = cartItem ? cartItem.quantity : 0;
    
    if (currentQtyInCart + quantity > p.inventory) {
      this.addToast(`Only ${p.inventory} items are available in stock.`, 'warning');
      return;
    }

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
    
    this.addToast(`Added "${product.name}" to cart.`, 'success');
  },

  removeFromCart(productId) {
    const item = this.cart.find(c => c.product.id === productId);
    if (item) {
      this.cart = this.cart.filter(c => c.product.id !== productId);
      this.addToast(`Removed "${item.product.name}" from cart.`, 'info');
    }
  },

  updateCartQuantity(productId, quantity) {
    const cartItem = this.cart.find(item => item.product.id === productId);
    if (cartItem) {
      const p = this.products.find(item => item.id === productId);
      if (quantity > p.inventory) {
        this.addToast(`Only ${p.inventory} items available in stock.`, 'warning');
        cartItem.quantity = p.inventory;
        return;
      }
      
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        cartItem.quantity = quantity;
      }
    }
  },

  clearCart() {
    this.cart = [];
  },

  // CHECKOUT
  async createOrder(shippingDetails) {
    if (this.cart.length === 0) {
      this.addToast('Your cart is empty.', 'error');
      return { success: false };
    }

    if (!this.currentUser) {
      this.addToast('Please login to place an order.', 'error');
      return { success: false, requireLogin: true };
    }

    try {
      const subtotal = this.cartSubtotal;
      const shipping = subtotal > 8000 ? 0 : 499.00;
      const tax = parseFloat((subtotal * 0.08).toFixed(2));
      const total = parseFloat((subtotal + shipping + tax).toFixed(2));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: this.currentUser.email,
          userName: this.currentUser.name,
          cart: this.cart,
          subtotal,
          shipping,
          tax,
          total,
          shippingDetails
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Deduct stock levels locally
        for (const item of this.cart) {
          const p = this.products.find(prod => prod.id === item.product.id);
          if (p) p.inventory -= item.quantity;
        }

        this.clearCart();
        this.addToast('Thank you! Your order has been placed.', 'success');
        await this.fetchOrders();
        return { success: true, orderId: data.orderId };
      } else {
        this.addToast(data.error || 'Failed to place order.', 'error');
        return { success: false };
      }
    } catch (e) {
      this.addToast('Failed to connect to checkout services.', 'error');
      return { success: false };
    }
  },

  // ADMIN OPERATIONS
  async adminAddProduct(productData) {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const newProduct = await res.json();
        this.products.push(newProduct);
        this.addToast(`Product "${newProduct.name}" added to catalog.`, 'success');
        return newProduct;
      }
    } catch (e) {
      this.addToast('Failed to add product to database.', 'error');
    }
  },

  async adminUpdateProduct(updatedProduct) {
    try {
      const res = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        const prod = await res.json();
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = prod;
        }
        this.addToast(`Product "${updatedProduct.name}" updated.`, 'success');
        
        this.cart = this.cart.map(c => {
          if (c.product.id === updatedProduct.id) {
            c.product = prod;
          }
          return c;
        });
        return true;
      }
    } catch (e) {
      this.addToast('Failed to update product on database.', 'error');
    }
    return false;
  },

  async adminDeleteProduct(productId) {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
          this.products = this.products.filter(p => p.id !== productId);
          this.cart = this.cart.filter(c => c.product.id !== productId);
          this.addToast(`Product "${product.name}" deleted.`, 'info');
          return true;
        }
      }
    } catch (e) {
      this.addToast('Failed to delete product from database.', 'error');
    }
    return false;
  },

  async adminUpdateOrderStatus(orderId, status, note = '') {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.addToast(`Order ${orderId} updated to ${status}.`, 'success');
        return true;
      }
    } catch (e) {
      this.addToast('Failed to update order status.', 'error');
    }
    return false;
  },

  async resetStore() {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        this.currentUser = null;
        this.cart = [];
        this.toasts = [];
        localStorage.clear();
        await this.init();
        this.addToast('Demo database reset to default state.', 'info');
      }
    } catch (e) {
      this.addToast('Failed to reset database.', 'error');
    }
  },

  // GETTERS REPLICATED REACTIVELY
  get cartSubtotal() {
    return parseFloat(this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2));
  },
  
  get cartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }
});

// Watch changes and sync session keys with LocalStorage
watch(() => store.currentUser, (newVal) => localStorage.setItem('craftedlove_currentUser', JSON.stringify(newVal)), { deep: true });
watch(() => store.cart, (newVal) => localStorage.setItem('craftedlove_cart', JSON.stringify(newVal)), { deep: true });
