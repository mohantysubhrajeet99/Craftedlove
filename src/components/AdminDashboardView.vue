<template>
  <div class="max-w-none px-4 sm:px-6 lg:px-12 xl:px-16 py-8">
    
    <!-- Redirect if not admin -->
    <div v-if="!store.currentUser || !store.currentUser.isAdmin" class="flex flex-col items-center justify-center py-20 text-center bg-[#FBF7F2] rounded-2xl border border-stone-100">
      <svg class="w-16 h-16 text-rose-500 mb-4 animate-pulse" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <h2 class="text-xl font-bold text-stone-700">Administrative Access Denied</h2>
      <p class="text-stone-400 text-sm mt-1 max-w-sm">Please log in as the Store Owner to access product inventory management and order fulfillment tools.</p>
      <button @click="$parent.authModalOpen = true" class="mt-6 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full shadow-md active:scale-95 transition-all text-sm">Log In as Admin</button>
    </div>

    <div v-else class="space-y-8">
      
      <!-- Header -->
      <div class="border-b border-stone-150 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="font-serif text-3xl font-bold text-stone-850 flex items-center gap-2">
            Admin Control Center
            <span class="text-xs font-sans font-semibold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">Store Owner Mode</span>
          </h1>
          <p class="text-sm text-stone-400 mt-1">Configure product pricing, manage stock, and progress delivery tracking pipelines.</p>
        </div>
        <button @click="store.resetStore(); setView('home')" class="text-xs font-semibold text-rose-500 border border-rose-200 px-4 py-2 rounded-full hover:bg-rose-50/50 bg-white transition-colors shadow-sm">
          Reset Demo Database
        </button>
      </div>

      <!-- STATS OVERVIEW CARDS -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <!-- Stat 1 -->
        <div class="bg-stone-50 border border-stone-100 p-5 rounded-2xl space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Sales</span>
          <p class="text-2xl sm:text-3xl font-bold text-stone-800 font-sans">₹<span>{{ totalSales }}</span></p>
        </div>
        <!-- Stat 2 -->
        <div class="bg-stone-50 border border-stone-100 p-5 rounded-2xl space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Orders</span>
          <p class="text-2xl sm:text-3xl font-bold text-stone-800 font-sans">{{ totalOrdersCount }}</p>
        </div>
        <!-- Stat 3 -->
        <div class="bg-stone-50 border border-stone-100 p-5 rounded-2xl space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">Low Stock Items</span>
          <p class="text-2xl sm:text-3xl font-bold font-sans" :class="lowStockCount > 0 ? 'text-rose-500' : 'text-stone-800'">
            {{ lowStockCount }}
          </p>
        </div>
        <!-- Stat 4 -->
        <div class="bg-stone-50 border border-stone-100 p-5 rounded-2xl space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">Main Category</span>
          <p class="text-lg sm:text-xl font-bold text-stone-800 truncate pt-1">{{ topCategory }}</p>
        </div>
      </div>

      <!-- TAB NAVIGATION -->
      <div class="flex border-b border-stone-100 space-x-6 text-sm font-medium">
        <button 
          @click="activeTab = 'catalog'"
          class="pb-3 border-b-2 transition-all cursor-pointer"
          :class="activeTab === 'catalog' ? 'border-rose-500 text-rose-550 font-bold' : 'border-transparent text-stone-400 hover:text-stone-700'"
        >
          Product Catalog Management
        </button>
        <button 
          @click="activeTab = 'orders'"
          class="pb-3 border-b-2 transition-all cursor-pointer"
          :class="activeTab === 'orders' ? 'border-rose-500 text-rose-550 font-bold' : 'border-transparent text-stone-400 hover:text-stone-700'"
        >
          Order Fulfillment Queue
        </button>
      </div>

      <!-- TAB 1: PRODUCT CATALOG MANAGER -->
      <div v-show="activeTab === 'catalog'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="font-serif text-lg font-bold text-stone-800">Active Catalog Items</h3>
          <button @click="startAdd" class="py-2.5 px-6 bg-stone-900 text-white text-xs font-semibold rounded-full hover:bg-stone-800 transition-colors shadow-md active:scale-95 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Add New Product
          </button>
        </div>

        <!-- Products Table -->
        <div class="border border-stone-100 rounded-2xl overflow-hidden bg-white shadow-sm overflow-x-auto">
          <table class="w-full text-left text-sm min-w-[700px]">
            <thead class="bg-stone-50 text-stone-500 text-xs font-semibold uppercase tracking-wider border-b border-stone-100">
              <tr>
                <th class="p-4">Item</th>
                <th class="p-4">Category</th>
                <th class="p-4">Price</th>
                <th class="p-4">Inventory Stock</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-50 text-stone-750">
              <tr v-for="product in store.products" :key="product.id" class="hover:bg-stone-50/30 transition-colors">
                <!-- Thumbnail & Name -->
                <td class="p-4 flex items-center gap-3">
                  <img :src="product.image" class="w-12 h-12 rounded-lg object-cover bg-[#FBF7F2] flex-shrink-0" />
                  <div>
                    <h4 class="font-bold text-stone-850 line-clamp-1">{{ product.name }}</h4>
                    <span class="text-[10px] text-stone-400 font-mono">ID: #{{ product.id }}</span>
                  </div>
                </td>
                
                <!-- Category -->
                <td class="p-4 text-xs font-medium text-stone-500">{{ product.category }}</td>
                
                <!-- Price -->
                <td class="p-4 font-bold font-sans text-stone-800">₹<span>{{ product.price }}</span></td>
                
                <!-- Stock -->
                <td class="p-4">
                  <span 
                    class="px-2 py-0.5 rounded text-xs font-bold font-sans"
                    :class="{
                      'bg-red-50 text-red-500 border border-red-100': product.inventory === 0,
                      'bg-rose-50 text-rose-500 border border-rose-100': product.inventory > 0 && product.inventory <= 3,
                      'bg-green-50 text-green-655 border border-green-100': product.inventory > 3
                    }"
                  >
                    {{ product.inventory }} units
                  </span>
                </td>

                <!-- Actions -->
                <td class="p-4 text-right space-x-2">
                  <button @click="startEdit(product)" class="text-indigo-650 hover:text-indigo-800 text-xs font-bold">Edit</button>
                  <button @click="deleteProduct(product.id)" class="text-rose-500 hover:text-rose-750 text-xs font-bold">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: ORDER FULFILLMENT QUEUE -->
      <div v-show="activeTab === 'orders'" class="space-y-6">
        <h3 class="font-serif text-lg font-bold text-stone-850">Incoming Customer Orders</h3>

        <!-- Empty queue -->
        <div v-if="store.orders.length === 0" class="text-center py-20 border border-stone-100 bg-white rounded-2xl text-stone-400">
          No orders placed yet.
        </div>

        <!-- Orders Queue List -->
        <div v-else class="space-y-5">
          <div 
            v-for="order in store.orders" 
            :key="order.id" 
            class="border border-stone-100 bg-white rounded-2xl shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow"
          >
            
            <!-- Order Header details -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-stone-50 gap-2 text-sm">
              <div>
                <span class="font-mono font-bold text-stone-800 text-base">#{{ order.id }}</span>
                <span class="text-stone-400 text-xs ml-2">by {{ order.userName }} ({{ order.userEmail }})</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-stone-400 text-xs">{{ formatDate(order.date) }}</span>
                <span 
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
                  :class="{
                    'bg-amber-500 text-white': order.status === 'Pending',
                    'bg-blue-500 text-white': order.status === 'Processing',
                    'bg-indigo-500 text-white': order.status === 'Shipped',
                    'bg-green-500 text-white': order.status === 'Delivered',
                  }"
                >
                  {{ order.status }}
                </span>
              </div>
            </div>

            <!-- Ordered Items and Address grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              
              <!-- Items list -->
              <div class="md:col-span-1 space-y-2">
                <p class="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">Purchased Items</p>
                <ul class="space-y-1 bg-[#FBF7F2] p-3 rounded-xl">
                  <li v-for="item in order.items" :key="item.product.id" class="flex justify-between items-center text-xs">
                    <span class="font-medium text-stone-700 truncate max-w-[150px]">{{ item.product.name }}</span>
                    <span class="text-stone-400">x{{ item.quantity }}</span>
                  </li>
                </ul>
                <div class="flex justify-between font-bold text-stone-855 px-1">
                  <span>Total Paid</span>
                  <span class="text-rose-600 font-sans">₹{{ order.total }}</span>
                </div>
              </div>

              <!-- Shipping details -->
              <div class="md:col-span-1 space-y-2">
                <p class="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">Shipment Destination</p>
                <div class="bg-stone-50 p-3 rounded-xl text-xs text-stone-750">
                  <p class="font-bold text-stone-700">{{ order.userName }}</p>
                  <p>{{ order.shippingDetails.address }}</p>
                  <p>{{ order.shippingDetails.city }}, {{ order.shippingDetails.zip }}</p>
                  <p>{{ order.shippingDetails.country }}</p>
                </div>
              </div>

              <!-- Fulfillment Controls -->
              <div class="md:col-span-1 space-y-3">
                <p class="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">Progress Fulfillment</p>
                
                <!-- Custom Status Timeline Note -->
                <input 
                  type="text" 
                  v-model="customTimelineNote"
                  placeholder="Add custom tracker note (optional)..."
                  class="w-full px-3 py-1.5 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500/20"
                />

                <!-- Buttons Grid -->
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-if="order.status === 'Pending'"
                    @click="advanceOrderStatus(order.id, 'Processing')"
                    class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs font-semibold shadow-sm hover:shadow active:scale-95 transition-all"
                  >
                    Start Preparing
                  </button>
                  <button 
                    v-if="order.status === 'Processing'"
                    @click="advanceOrderStatus(order.id, 'Shipped')"
                    class="px-4 py-2 bg-indigo-500 hover:bg-indigo-650 text-white rounded-full text-xs font-semibold shadow-sm hover:shadow active:scale-95 transition-all"
                  >
                    Dispatch / Ship
                  </button>
                  <button 
                    v-if="order.status === 'Shipped'"
                    @click="advanceOrderStatus(order.id, 'Delivered')"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-semibold shadow-sm hover:shadow active:scale-95 transition-all"
                  >
                    Mark Arrived / Delivered
                  </button>
                  <span v-if="order.status === 'Delivered'" class="text-green-600 text-xs font-bold flex items-center gap-1">
                    ✓ Order Fully Completed
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      <!-- MODAL: ADD PRODUCT FORM -->
      <div v-if="addingProduct" class="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" @click.self="cancelAdd">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden animate-slideUp">
          <h3 class="font-serif text-xl font-bold text-stone-850 mb-4 border-b pb-3">Add Custom Artisan Creation</h3>
          
          <form @submit.prevent="saveAdd" class="space-y-3.5 text-sm">
            <!-- Name -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Product Name</label>
              <input 
                type="text" 
                v-model="productForm.name"
                class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 text-stone-800"
                placeholder="e.g., Lavender Scented Soy Candle"
              />
            </div>

            <div class="grid grid-cols-1 gap-3">
              <!-- Category -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Category</label>
                <select 
                  v-model="productForm.category"
                  class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none text-stone-700 cursor-pointer"
                >
                  <option value="Resin Art">Resin Art</option>
                  <option value="Glass Art">Glass Art</option>
                  <option value="Frames">Frames</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Chocolates">Chocolates</option>
                </select>
              </div>
            </div>

            <!-- Upload Multiple Images -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Product Photos (Upload Multiple)</label>
              <div class="flex items-center gap-3">
                <label class="flex-grow flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#FBF7F2] border border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-100 hover:border-stone-400 transition-colors text-stone-600 text-xs font-semibold">
                  <svg class="w-4 h-4 text-stone-550" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
                  <span>Select Photo Files</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    @change="handleImageUpload($event, 'add')" 
                    class="hidden" 
                  />
                </label>
              </div>

              <!-- Thumbnails Grid -->
              <div v-if="productForm.images && productForm.images.length > 0" class="flex flex-wrap gap-2 mt-2.5">
                <div 
                  v-for="(img, idx) in productForm.images" 
                  :key="idx" 
                  class="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-200 group"
                >
                  <img :src="img" class="w-full h-full object-cover" />
                  <button 
                    type="button"
                    @click="removeUploadedImage(idx, 'add')" 
                    class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6l12 12"/></svg>
                  </button>
                  <span v-if="idx === 0" class="absolute bottom-0 inset-x-0 bg-rose-500 text-white text-[8px] font-bold text-center py-0.5 leading-none">Main</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <!-- Price -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="productForm.price"
                  class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none text-stone-850"
                  placeholder="29.99"
                />
              </div>
              <!-- Inventory -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Starting Stock</label>
                <input 
                  type="number" 
                  v-model="productForm.inventory"
                  class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none text-stone-850"
                  placeholder="10"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Detailed Description</label>
              <textarea 
                rows="3" 
                v-model="productForm.description"
                class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none resize-none text-stone-800"
                placeholder="Tell customers how this item was created, what raw materials were used..."
              ></textarea>
            </div>

            <p class="text-xs text-red-500 font-semibold">{{ formError }}</p>

            <!-- Footer Buttons -->
            <div class="flex gap-3 pt-3 border-t mt-4">
              <button type="button" @click="cancelAdd" class="w-1/2 py-2.5 border border-stone-250 text-stone-600 font-semibold rounded-xl hover:bg-stone-50">Cancel</button>
              <button type="submit" class="w-1/2 py-2.5 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800">Add Item</button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL: EDIT PRODUCT FORM -->
      <div v-if="editingProduct" class="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" @click.self="cancelEdit">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden animate-slideUp">
          <h3 class="font-serif text-xl font-bold text-stone-850 mb-4 border-b pb-3">Edit Catalog Product</h3>
          
          <form @submit.prevent="saveEdit" class="space-y-3.5 text-sm">
            <!-- Name -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Product Name</label>
              <input 
                type="text" 
                v-model="editingProduct.name"
                class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none text-stone-800"
              />
            </div>

            <div class="grid grid-cols-1 gap-3">
              <!-- Category -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Category</label>
                <select 
                  v-model="editingProduct.category"
                  class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none text-stone-700 cursor-pointer"
                >
                  <option value="Resin Art">Resin Art</option>
                  <option value="Glass Art">Glass Art</option>
                  <option value="Frames">Frames</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Chocolates">Chocolates</option>
                </select>
              </div>
            </div>

            <!-- Upload Multiple Images -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Product Photos (Upload Multiple)</label>
              <div class="flex items-center gap-3">
                <label class="flex-grow flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#FBF7F2] border border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-100 hover:border-stone-400 transition-colors text-stone-600 text-xs font-semibold">
                  <svg class="w-4 h-4 text-stone-550" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
                  <span>Select Photo Files</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    @change="handleImageUpload($event, 'edit')" 
                    class="hidden" 
                  />
                </label>
              </div>

              <!-- Thumbnails Grid -->
              <div v-if="editingProduct.images && editingProduct.images.length > 0" class="flex flex-wrap gap-2 mt-2.5">
                <div 
                  v-for="(img, idx) in editingProduct.images" 
                  :key="idx" 
                  class="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-200 group"
                >
                  <img :src="img" class="w-full h-full object-cover" />
                  <button 
                    type="button"
                    @click="removeUploadedImage(idx, 'edit')" 
                    class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6l12 12"/></svg>
                  </button>
                  <span v-if="idx === 0" class="absolute bottom-0 inset-x-0 bg-rose-500 text-white text-[8px] font-bold text-center py-0.5 leading-none">Main</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <!-- Price -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model="editingProduct.price"
                  class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none text-stone-850"
                />
              </div>
              <!-- Inventory -->
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Stock Level</label>
                <input 
                  type="number" 
                  v-model="editingProduct.inventory"
                  class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none text-stone-850"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Detailed Description</label>
              <textarea 
                rows="3" 
                v-model="editingProduct.description"
                class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none resize-none text-stone-800"
              ></textarea>
            </div>

            <p class="text-xs text-red-500 font-semibold">{{ formError }}</p>

            <!-- Footer Buttons -->
            <div class="flex gap-3 pt-3 border-t mt-4">
              <button type="button" @click="cancelEdit" class="w-1/2 py-2.5 border border-stone-250 text-stone-600 font-semibold rounded-xl hover:bg-stone-50">Cancel</button>
              <button type="submit" class="w-1/2 py-2.5 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800">Save Edits</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { store } from '../store.js';

export default {
  name: 'AdminDashboardView',
  props: {
    setView: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      activeTab: 'catalog',
      editingProduct: null,
      addingProduct: false,
      productForm: {
        name: '',
        category: 'Resin Art',
        price: '',
        inventory: '',
        image: '/assets/images/blue-daisy-bottle.png',
        images: [],
        description: ''
      },
      formError: '',
      customTimelineNote: ''
    };
  },
  computed: {
    store() {
      return store;
    },
    totalSales() {
      return parseFloat(this.store.orders.reduce((sum, o) => sum + o.total, 0).toFixed(2));
    },
    totalOrdersCount() {
      return this.store.orders.length;
    },
    lowStockCount() {
      return this.store.products.filter(p => p.inventory <= 3).length;
    },
    topCategory() {
      const counts = {};
      this.store.products.forEach(p => {
        counts[p.category] = (counts[p.category] || 0) + 1;
      });
      let maxCat = 'None';
      let maxVal = 0;
      for (const cat in counts) {
        if (counts[cat] > maxVal) {
          maxVal = counts[cat];
          maxCat = cat;
        }
      }
      return maxCat;
    }
  },
  methods: {
    formatDate(isoString) {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    startEdit(product) {
      this.editingProduct = { 
        ...product,
        images: product.images ? [...product.images] : (product.image ? [product.image] : [])
      };
      this.formError = '';
    },
    saveEdit() {
      if (!this.editingProduct.name.trim() || !this.editingProduct.price || !this.editingProduct.inventory) {
        this.formError = 'Please fill out name, price, and stock levels.';
        return;
      }
      
      const success = this.store.adminUpdateProduct(this.editingProduct);
      if (success) {
        this.editingProduct = null;
      }
    },
    cancelEdit() {
      this.editingProduct = null;
      this.formError = '';
    },
    deleteProduct(id) {
      if (confirm('Are you sure you want to delete this product from the catalog?')) {
        this.store.adminDeleteProduct(id);
      }
    },
    startAdd() {
      this.addingProduct = true;
      this.productForm = {
        name: '',
        category: 'Resin Art',
        price: '',
        inventory: '',
        image: '/assets/images/blue-daisy-bottle.png',
        images: [],
        description: ''
      };
      this.formError = '';
    },
    saveAdd() {
      const f = this.productForm;
      if (!f.name.trim() || !f.price || !f.inventory) {
        this.formError = 'Please fill out name, price, and stock levels.';
        return;
      }

      this.store.adminAddProduct(f);
      this.addingProduct = false;
    },
    cancelAdd() {
      this.addingProduct = false;
      this.formError = '';
    },
    advanceOrderStatus(orderId, status) {
      let defaultNote = '';
      if (status === 'Processing') {
        defaultNote = 'Artisan has started preparing packaging for your handmade treasures.';
      } else if (status === 'Shipped') {
        const trackingNum = 'CL-' + Math.floor(1000000 + Math.random() * 9000000);
        defaultNote = `Handed over to eco-friendly courier services. Tracking Number: ${trackingNum}`;
      } else if (status === 'Delivered') {
        defaultNote = 'Package delivered successfully to recipient mailbox/doorstep. Signed by customer.';
      }

      const note = this.customTimelineNote.trim() || defaultNote;
      const success = this.store.adminUpdateOrderStatus(orderId, status, note);
      if (success) {
        this.customTimelineNote = '';
      }
    },
    async handleImageUpload(event, target) {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      
      const filePromises = Array.from(files).map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 400;
              const MAX_HEIGHT = 400;
              let width = img.width;
              let height = img.height;
              
              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
          };
          reader.readAsDataURL(file);
        });
      });
      
      const base64Images = await Promise.all(filePromises);
      if (target === 'add') {
        this.productForm.images = [...this.productForm.images, ...base64Images];
        if (this.productForm.images.length > 0) {
          this.productForm.image = this.productForm.images[0];
        }
      } else if (target === 'edit') {
        this.editingProduct.images = [...this.editingProduct.images, ...base64Images];
        if (this.editingProduct.images.length > 0) {
          this.editingProduct.image = this.editingProduct.images[0];
        }
      }
      
      event.target.value = '';
    },
    removeUploadedImage(index, target) {
      if (target === 'add') {
        this.productForm.images.splice(index, 1);
        if (this.productForm.images.length > 0) {
          this.productForm.image = this.productForm.images[0];
        } else {
          this.productForm.image = '/assets/images/blue-daisy-bottle.png';
        }
      } else if (target === 'edit') {
        this.editingProduct.images.splice(index, 1);
        if (this.editingProduct.images.length > 0) {
          this.editingProduct.image = this.editingProduct.images[0];
        } else {
          this.editingProduct.image = '/assets/images/blue-daisy-bottle.png';
        }
      }
    }
  }
};
</script>
