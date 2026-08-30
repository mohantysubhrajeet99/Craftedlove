import { reactive, watch } from 'vue';

const ADMIN_EMAIL = 'owner@kraftedlove.in';
const SESSION_KEY = 'kraftedlove_analytics_session';

// Helper to load state from localStorage or use defaults
const getStored = (key, fallback) => {
  const val = localStorage.getItem(`kraftedlove_${key}`);
  if (val) {
    try {
      return JSON.parse(val);
    } catch (e) {
      console.error(`Error parsing key ${key} from storage:`, e);
    }
  }
  return fallback;
};

const getAnalyticsSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `kl_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Create the global reactive store
export const store = reactive({
  products: [],
  orders: [],
  categories: [],
  users: [],
  customerInsights: null,
  selectedCustomerDetails: null,
  analytics: null,
  currentUser: getStored('currentUser', null),
  cart: getStored('cart', []),
  toasts: [],
  
  async init() {
    try {
      if (this.currentUser?.isAdmin && this.currentUser.email?.toLowerCase() !== ADMIN_EMAIL) {
        this.currentUser = null;
        this.orders = [];
      }

      const res = await fetch('/api/products');
      if (res.ok) {
        this.products = await res.json();
        this.cart = this.cart.map(item => {
          const liveProduct = this.products.find(product => product.id === item.product.id);
          return liveProduct ? { ...item, product: liveProduct } : item;
        });
      }
      await this.fetchCategories();
      if (this.currentUser) {
        await this.fetchOrders();
        if (this.currentUser.isAdmin) {
          await this.fetchAdminCustomers();
          await this.fetchCustomerInsights();
          await this.fetchAnalytics();
        }
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
        const orders = await res.json();
        this.orders = orders.filter(order => order.id !== 'ORD-9874' && !(order.userName === 'Jane Doe' && Number(order.total) === 6867.76));
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    }
  },

  async fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        this.categories = await res.json();
      }
    } catch (e) {
      console.error('Failed to fetch categories:', e);
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
        await this.fetchCategories();
        await this.fetchOrders();
        if (data.user.isAdmin) {
          await this.fetchAdminCustomers();
          await this.fetchCustomerInsights();
          await this.fetchAnalytics();
        }
        this.trackEvent('login');
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

  async register(name, email, phone, password) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.currentUser = data.user;
        this.addToast(`Account created! Welcome, ${name}.`, 'success');
        await this.fetchOrders();
        this.trackEvent('register');
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
    this.users = [];
    this.customerInsights = null;
    this.selectedCustomerDetails = null;
    this.analytics = null;
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
    
    this.trackEvent('add_to_cart', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      value: product.price * quantity,
      metadata: { quantity }
    });
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
  async createOrder(shippingDetails, customizationRequests = []) {
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
          shippingDetails,
          customizationRequests
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
        this.trackEvent('order_placed', { value: total });
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
        await this.fetchCategories();
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
        await this.fetchCategories();
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
        await this.fetchAdminCustomers();
        await this.fetchCustomerInsights();
        return true;
      }
    } catch (e) {
      this.addToast('Failed to update order status.', 'error');
    }
    return false;
  },

  async adminDeleteOrder(orderId) {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        this.orders = this.orders.filter(order => order.id !== orderId);
        await this.fetchAdminCustomers();
        await this.fetchCustomerInsights();
        await this.fetchAnalytics();
        this.addToast(`Order ${orderId} deleted.`, 'info');
        return { success: true };
      }
      this.addToast(data.error || 'Failed to delete order.', 'error');
      return { success: false, message: data.error };
    } catch (e) {
      this.addToast('Failed to delete order.', 'error');
      return { success: false };
    }
  },

  async adminAddCategory(name) {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (res.ok) {
        await this.fetchCategories();
        this.addToast(`Category "${data.name}" added.`, 'success');
        return { success: true };
      }
      this.addToast(data.error || 'Failed to add category.', 'error');
      return { success: false, message: data.error };
    } catch (e) {
      this.addToast('Failed to add category.', 'error');
      return { success: false };
    }
  },

  async adminDeleteCategory(name) {
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        await this.fetchCategories();
        this.addToast(`Category "${name}" removed.`, 'info');
        return { success: true };
      }
      this.addToast(data.error || 'Failed to remove category.', 'error');
      return { success: false, message: data.error };
    } catch (e) {
      this.addToast('Failed to remove category.', 'error');
      return { success: false };
    }
  },

  async fetchAdminCustomers() {
    if (!this.currentUser?.isAdmin) return;
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        this.users = await res.json();
      }
    } catch (e) {
      console.error('Failed to fetch customers:', e);
    }
  },

  async fetchCustomerInsights() {
    if (!this.currentUser?.isAdmin) return;
    try {
      const res = await fetch('/api/admin/customer-insights');
      if (res.ok) {
        this.customerInsights = await res.json();
      }
    } catch (e) {
      console.error('Failed to fetch customer insights:', e);
    }
  },

  async fetchCustomerDetails(email) {
    if (!this.currentUser?.isAdmin) return null;
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(email)}`);
      if (res.ok) {
        this.selectedCustomerDetails = await res.json();
        return this.selectedCustomerDetails;
      }
    } catch (e) {
      console.error('Failed to fetch customer details:', e);
    }
    return null;
  },

  async adminDeleteCustomer(email) {
    if (!this.currentUser?.isAdmin) return { success: false };
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(email)}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        this.users = this.users.filter(user => user.email.toLowerCase() !== email.toLowerCase());
        this.orders = this.orders.filter(order => order.userEmail.toLowerCase() !== email.toLowerCase());
        if (this.selectedCustomerDetails?.customer?.email?.toLowerCase() === email.toLowerCase()) {
          this.selectedCustomerDetails = null;
        }
        await this.fetchAdminCustomers();
        await this.fetchCustomerInsights();
        await this.fetchAnalytics();
        this.addToast(`Customer deleted with ${data.deleted?.orders || 0} order(s).`, 'info');
        return { success: true, deleted: data.deleted };
      }
      this.addToast(data.error || 'Failed to delete customer.', 'error');
      return { success: false, message: data.error };
    } catch (e) {
      this.addToast('Failed to delete customer.', 'error');
      return { success: false };
    }
  },

  async trackEvent(type, payload = {}) {
    try {
      const body = {
        type,
        page: window.location.pathname,
        sessionId: getAnalyticsSessionId(),
        userEmail: this.currentUser?.email || '',
        ...payload
      };

      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e) {
      // Analytics must never interrupt shopping or admin workflows.
    }
  },

  async fetchAnalytics(days = 30) {
    if (!this.currentUser?.isAdmin) return null;
    try {
      const res = await fetch(`/api/admin/analytics?days=${encodeURIComponent(days)}`);
      if (res.ok) {
        this.analytics = await res.json();
        return this.analytics;
      }
    } catch (e) {
      console.error('Failed to fetch analytics:', e);
    }
    return null;
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
watch(() => store.currentUser, (newVal) => localStorage.setItem('kraftedlove_currentUser', JSON.stringify(newVal)), { deep: true });
watch(() => store.cart, (newVal) => localStorage.setItem('kraftedlove_cart', JSON.stringify(newVal)), { deep: true });
