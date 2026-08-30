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
        <button
          @click="openAnalyticsDashboard"
          class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-indigo-600 text-white text-xs font-bold rounded-full hover:shadow-lg hover:shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M3 3v18h18M7 15l3-3 3 2 5-7"/></svg>
          Open Analytics Dashboard
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
        <button 
          @click="activeTab = 'customers'"
          class="pb-3 border-b-2 transition-all cursor-pointer"
          :class="activeTab === 'customers' ? 'border-rose-500 text-rose-550 font-bold' : 'border-transparent text-stone-400 hover:text-stone-700'"
        >
          Registered Customers
        </button>
        <button 
          @click="activeTab = 'categories'"
          class="pb-3 border-b-2 transition-all cursor-pointer"
          :class="activeTab === 'categories' ? 'border-rose-500 text-rose-550 font-bold' : 'border-transparent text-stone-400 hover:text-stone-700'"
        >
          Category Manager
        </button>
      </div>

      <!-- TAB 1: PRODUCT CATALOG MANAGER -->
      <div v-show="activeTab === 'catalog'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h3 class="font-serif text-lg font-bold text-stone-800">Active Catalog Items</h3>
            <p class="text-xs text-stone-500 mt-1">Showing {{ filteredAdminProducts.length }} of {{ store.products.length }} products</p>
          </div>
          <button @click="startAdd" class="py-2.5 px-6 bg-stone-900 text-white text-xs font-semibold rounded-full hover:bg-stone-800 transition-colors shadow-md active:scale-95 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Add New Product
          </button>
        </div>

        <!-- Catalog Search and Filters -->
        <div class="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_auto] gap-3 items-end">
          <div class="space-y-1">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Search Products</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"/></svg>
              </span>
              <input
                v-model="productSearch"
                type="search"
                placeholder="Search name, category, ID..."
                class="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Category</label>
            <select v-model="productCategoryFilter" class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none">
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Stock</label>
            <select v-model="productStockFilter" class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none">
              <option value="">All Stock</option>
              <option value="available">Available</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Sort By</label>
            <select v-model="productSort" class="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none">
              <option value="newest">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="priceHigh">Price High-Low</option>
              <option value="priceLow">Price Low-High</option>
              <option value="stockLow">Stock Low-High</option>
            </select>
          </div>

          <button
            type="button"
            @click="clearProductFilters"
            class="px-4 py-2.5 border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Clear
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
              <tr v-for="product in filteredAdminProducts" :key="product.id" class="hover:bg-stone-50/30 transition-colors">
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
              <tr v-if="filteredAdminProducts.length === 0">
                <td colspan="5" class="p-10 text-center text-sm text-stone-500">
                  No products match these filters.
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
                <button
                  @click="deleteOrder(order.id)"
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-rose-100 text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  Delete
                </button>
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

            <div v-if="order.customizationRequests && order.customizationRequests.length > 0" class="border-t border-stone-50 pt-4 space-y-3">
              <p class="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">Customization Requests</p>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div v-for="request in order.customizationRequests" :key="request.productId" class="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-2 text-xs">
                  <p class="font-bold text-stone-850">{{ request.productName }}</p>
                  <p v-if="request.notes" class="text-stone-700"><strong>Notes:</strong> {{ request.notes }}</p>
                  <p v-if="request.customText" class="text-stone-700"><strong>Text:</strong> {{ request.customText }}</p>
                  <p v-if="request.theme" class="text-stone-700"><strong>Theme:</strong> {{ request.theme }}</p>
                  <div v-if="request.files && request.files.length > 0" class="flex flex-wrap gap-2 pt-1">
                    <a
                      v-for="(file, idx) in request.files"
                      :key="`${request.productId}-${idx}`"
                      :href="file.data"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="block w-16 h-16 rounded-lg overflow-hidden border border-white shadow-sm bg-white"
                      title="Open attached reference"
                    >
                      <img :src="file.data" :alt="file.name" class="w-full h-full object-cover" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- TAB 3: REGISTERED CUSTOMERS -->
      <div v-show="activeTab === 'customers'" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h3 class="font-serif text-lg font-bold text-stone-850">Registered Customers</h3>
            <p class="text-sm text-stone-500 mt-1">See who signed up, what they ordered, and which customers bring the most value.</p>
          </div>
          <button @click="refreshCustomerData" class="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors">Refresh Insights</button>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white border border-stone-100 p-5 rounded-2xl space-y-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">Registered Users</span>
            <p class="text-2xl font-bold text-stone-850">{{ store.customerInsights?.totalCustomers || 0 }}</p>
          </div>
          <div class="bg-white border border-stone-100 p-5 rounded-2xl space-y-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">New Customers</span>
            <p class="text-2xl font-bold text-stone-850">{{ store.customerInsights?.newCustomers || 0 }}</p>
          </div>
          <div class="bg-white border border-stone-100 p-5 rounded-2xl space-y-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">Avg Spend/User</span>
            <p class="text-2xl font-bold text-stone-850 font-sans">₹{{ store.customerInsights?.averageSpendPerCustomer || 0 }}</p>
          </div>
          <div class="bg-white border border-stone-100 p-5 rounded-2xl space-y-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">High Value</span>
            <p class="text-2xl font-bold text-rose-500">{{ store.customerInsights?.highValueCustomers || 0 }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <div class="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
            <div class="p-4 border-b border-stone-100">
              <h4 class="font-bold text-stone-850">Customer List</h4>
              <p class="text-xs text-stone-500 mt-1">{{ customersWithOrders.length }} with orders, {{ store.customerInsights?.customersWithNoOrders || 0 }} without orders</p>
            </div>
            <div v-if="store.users.length === 0" class="p-8 text-center text-sm text-stone-500">No registered customers yet.</div>
            <button
              v-for="user in store.users"
              :key="user.email"
              @click="selectCustomer(user.email)"
              class="w-full p-4 text-left border-b border-stone-50 last:border-b-0 hover:bg-rose-50/40 transition-colors"
              :class="selectedCustomerEmail === user.email ? 'bg-rose-50/70' : ''"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="font-bold text-stone-850 truncate">{{ user.name }}</p>
                  <p class="text-xs text-stone-500 truncate">{{ user.email }}</p>
                  <p class="text-xs text-stone-500 truncate">{{ user.phone || 'Phone not available' }}</p>
                </div>
                <span class="text-[10px] font-bold uppercase rounded-full px-2 py-1 whitespace-nowrap"
                  :class="user.valueLabel === 'High-value customer' ? 'bg-rose-100 text-rose-600' : user.orderCount > 0 ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'"
                >
                  {{ user.valueLabel }}
                </span>
              </div>
              <div class="mt-3 grid grid-cols-3 gap-2 text-xs">
                <span class="bg-[#FBF7F2] rounded-lg p-2"><strong>{{ user.orderCount }}</strong><br>Orders</span>
                <span class="bg-[#FBF7F2] rounded-lg p-2"><strong>₹{{ user.totalSpent }}</strong><br>Spent</span>
                <span class="bg-[#FBF7F2] rounded-lg p-2"><strong>{{ user.favoriteCategory }}</strong><br>Favorite</span>
              </div>
            </button>
          </div>

          <div class="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm min-h-[420px]">
            <div v-if="!store.selectedCustomerDetails" class="h-full flex flex-col items-center justify-center text-center text-stone-500">
              <h4 class="font-serif text-xl font-bold text-stone-850">Select a customer</h4>
              <p class="text-sm mt-1 max-w-sm">Click any registered user to view their orders, spending behavior, and customer value summary.</p>
            </div>

            <div v-else class="space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <h4 class="font-serif text-2xl font-bold text-stone-850">{{ store.selectedCustomerDetails.customer.name }}</h4>
                  <p class="text-sm text-stone-500">{{ store.selectedCustomerDetails.customer.email }}</p>
                  <p class="text-sm text-stone-500">{{ store.selectedCustomerDetails.customer.phone || 'Phone not available' }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="w-max text-xs font-bold uppercase rounded-full px-3 py-1 bg-rose-100 text-rose-600">{{ store.selectedCustomerDetails.customer.valueLabel }}</span>
                  <button
                    @click="deleteCustomer(store.selectedCustomerDetails.customer)"
                    class="px-3 py-1.5 rounded-full border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                  >
                    Delete Customer
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-[#FBF7F2] rounded-xl p-3">
                  <p class="text-[10px] uppercase font-bold text-stone-500">Total Spent</p>
                  <p class="font-bold text-stone-850 font-sans">₹{{ store.selectedCustomerDetails.customer.totalSpent }}</p>
                </div>
                <div class="bg-[#FBF7F2] rounded-xl p-3">
                  <p class="text-[10px] uppercase font-bold text-stone-500">Orders</p>
                  <p class="font-bold text-stone-850">{{ store.selectedCustomerDetails.customer.orderCount }}</p>
                </div>
                <div class="bg-[#FBF7F2] rounded-xl p-3">
                  <p class="text-[10px] uppercase font-bold text-stone-500">Avg Order</p>
                  <p class="font-bold text-stone-850 font-sans">₹{{ store.selectedCustomerDetails.customer.averageOrderValue }}</p>
                </div>
                <div class="bg-[#FBF7F2] rounded-xl p-3">
                  <p class="text-[10px] uppercase font-bold text-stone-500">Items Bought</p>
                  <p class="font-bold text-stone-850">{{ store.selectedCustomerDetails.customer.totalItems }}</p>
                </div>
              </div>

              <div class="rounded-2xl bg-rose-50/60 border border-rose-100 p-4">
                <p class="text-xs font-bold uppercase tracking-wider text-rose-500">Insight</p>
                <p class="text-sm text-stone-700 mt-1">{{ customerInsightText }}</p>
              </div>

              <div class="space-y-3">
                <h5 class="font-serif font-bold text-stone-850">Order History</h5>
                <div v-if="store.selectedCustomerDetails.orders.length === 0" class="text-sm text-stone-500 border border-dashed border-stone-200 rounded-xl p-6 text-center">This customer has not ordered yet.</div>
                <div v-else class="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  <div v-for="order in store.selectedCustomerDetails.orders" :key="order.id" class="border border-stone-100 rounded-xl p-4">
                    <div class="flex items-center justify-between gap-2">
                      <span class="font-mono font-bold text-stone-850">#{{ order.id }}</span>
                      <span class="text-xs font-bold text-rose-600 font-sans">₹{{ order.total }}</span>
                    </div>
                    <p class="text-xs text-stone-500 mt-1">{{ formatDate(order.date) }} · {{ order.status }}</p>
                    <ul class="mt-3 space-y-1 text-xs text-stone-700">
                      <li v-for="item in order.items" :key="item.product.id" class="flex justify-between gap-3">
                        <span class="truncate">{{ item.product.name }}</span>
                        <span>x{{ item.quantity }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: CATEGORY MANAGER -->
      <div v-show="activeTab === 'categories'" class="space-y-6">
        <div>
          <h3 class="font-serif text-lg font-bold text-stone-850">Category Manager</h3>
          <p class="text-sm text-stone-500 mt-1">These categories appear in the customer shop filters and product forms.</p>
        </div>

        <form @submit.prevent="addCategory" class="bg-white border border-stone-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-3 shadow-sm">
          <input 
            type="text"
            v-model="newCategoryName"
            placeholder="Add category, e.g. Hampers"
            class="flex-grow px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10"
          />
          <button type="submit" class="px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors">Add Category</button>
        </form>

        <div v-if="categories.length === 0" class="bg-white border border-dashed border-stone-200 rounded-2xl p-8 text-center text-sm text-stone-500">
          No categories yet. Add your first category above, then assign products to it.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="cat in categories" :key="cat" class="bg-white border border-stone-100 rounded-2xl p-5 flex items-center justify-between gap-3">
            <div>
              <p class="font-bold text-stone-850">{{ cat }}</p>
              <p class="text-xs text-stone-500">{{ productCountForCategory(cat) }} product(s)</p>
            </div>
            <button 
              @click="deleteCategory(cat)"
              class="px-3 py-1.5 rounded-full text-xs font-bold border border-rose-100 text-rose-500 hover:bg-rose-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL: ADD PRODUCT FORM -->
      <div v-if="addingProduct" class="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" @click.self="cancelAdd">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
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
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  <option value="__new__">+ Add New Category...</option>
                </select>

                <!-- Custom Category Input -->
                <div v-if="productForm.category === '__new__'" class="mt-2 space-y-1">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-rose-500">New Category Name</label>
                  <input 
                    type="text" 
                    v-model="customCategory" 
                    placeholder="e.g., Clay Art"
                    class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 text-stone-850"
                  />
                </div>
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

            <div class="border border-stone-100 rounded-2xl p-4 bg-[#FBF7F2] space-y-3">
              <label class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-600">
                <input type="checkbox" v-model="productForm.customization.enabled" class="rounded border-stone-300 text-rose-500 focus:ring-rose-500/20" />
                Supports Customization
              </label>
              <div v-if="productForm.customization.enabled" class="space-y-3">
                <div class="grid grid-cols-2 gap-2 text-xs text-stone-700">
                  <label class="flex items-center gap-2"><input type="checkbox" v-model="productForm.customization.allowNotes" class="rounded border-stone-300 text-rose-500" /> Notes</label>
                  <label class="flex items-center gap-2"><input type="checkbox" v-model="productForm.customization.allowPhotos" class="rounded border-stone-300 text-rose-500" /> Photo Upload</label>
                  <label class="flex items-center gap-2"><input type="checkbox" v-model="productForm.customization.allowText" class="rounded border-stone-300 text-rose-500" /> Names/Text</label>
                  <label class="flex items-center gap-2"><input type="checkbox" v-model="productForm.customization.allowTheme" class="rounded border-stone-300 text-rose-500" /> Theme/Colors</label>
                </div>
                <textarea
                  v-model="productForm.customization.instructions"
                  rows="2"
                  placeholder="Tell customers what details to share for this product..."
                  class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none resize-none text-stone-800 text-xs bg-white"
                ></textarea>
              </div>
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
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
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
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  <option value="__new__">+ Add New Category...</option>
                </select>

                <!-- Custom Category Input -->
                <div v-if="editingProduct.category === '__new__'" class="mt-2 space-y-1">
                  <label class="block text-xs font-semibold uppercase tracking-wider text-rose-500">New Category Name</label>
                  <input 
                    type="text" 
                    v-model="customCategoryEdit" 
                    placeholder="e.g., Clay Art"
                    class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 text-stone-850"
                  />
                </div>
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

            <div class="border border-stone-100 rounded-2xl p-4 bg-[#FBF7F2] space-y-3">
              <label class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-600">
                <input type="checkbox" v-model="editingProduct.customization.enabled" class="rounded border-stone-300 text-rose-500 focus:ring-rose-500/20" />
                Supports Customization
              </label>
              <div v-if="editingProduct.customization.enabled" class="space-y-3">
                <div class="grid grid-cols-2 gap-2 text-xs text-stone-700">
                  <label class="flex items-center gap-2"><input type="checkbox" v-model="editingProduct.customization.allowNotes" class="rounded border-stone-300 text-rose-500" /> Notes</label>
                  <label class="flex items-center gap-2"><input type="checkbox" v-model="editingProduct.customization.allowPhotos" class="rounded border-stone-300 text-rose-500" /> Photo Upload</label>
                  <label class="flex items-center gap-2"><input type="checkbox" v-model="editingProduct.customization.allowText" class="rounded border-stone-300 text-rose-500" /> Names/Text</label>
                  <label class="flex items-center gap-2"><input type="checkbox" v-model="editingProduct.customization.allowTheme" class="rounded border-stone-300 text-rose-500" /> Theme/Colors</label>
                </div>
                <textarea
                  v-model="editingProduct.customization.instructions"
                  rows="2"
                  placeholder="Tell customers what details to share for this product..."
                  class="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none resize-none text-stone-800 text-xs bg-white"
                ></textarea>
              </div>
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
        category: '',
        price: '',
        inventory: '',
        image: '/assets/images/blue-daisy-bottle.png',
        images: [],
        description: '',
        customization: {
          enabled: true,
          allowNotes: true,
          allowPhotos: true,
          allowText: false,
          allowTheme: true,
          instructions: 'Share your preferred colors, theme, room decor reference, or inspiration photo.'
        }
      },
      formError: '',
      customTimelineNote: '',
      customCategory: '',
      customCategoryEdit: '',
      selectedCustomerEmail: '',
      newCategoryName: '',
      productSearch: '',
      productCategoryFilter: '',
      productStockFilter: '',
      productSort: 'newest'
    };
  },
  computed: {
    store() {
      return store;
    },
    categories() {
      const fromProducts = this.store.products.map(p => p.category).filter(Boolean);
      const allUnique = new Set([...this.store.categories, ...fromProducts]);
      return Array.from(allUnique).sort((a, b) => a.localeCompare(b));
    },
    filteredAdminProducts() {
      const query = this.productSearch.trim().toLowerCase();
      const filtered = this.store.products.filter(product => {
        const matchesSearch = !query
          || product.name.toLowerCase().includes(query)
          || product.category.toLowerCase().includes(query)
          || String(product.id).includes(query);
        const matchesCategory = !this.productCategoryFilter || product.category === this.productCategoryFilter;
        const matchesStock = !this.productStockFilter
          || (this.productStockFilter === 'available' && product.inventory > 3)
          || (this.productStockFilter === 'low' && product.inventory > 0 && product.inventory <= 3)
          || (this.productStockFilter === 'out' && product.inventory === 0);

        return matchesSearch && matchesCategory && matchesStock;
      });

      return [...filtered].sort((a, b) => {
        if (this.productSort === 'name') return a.name.localeCompare(b.name);
        if (this.productSort === 'priceHigh') return Number(b.price) - Number(a.price);
        if (this.productSort === 'priceLow') return Number(a.price) - Number(b.price);
        if (this.productSort === 'stockLow') return Number(a.inventory) - Number(b.inventory);
        return Number(b.id) - Number(a.id);
      });
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
    },
    customersWithOrders() {
      return this.store.users.filter(user => user.orderCount > 0);
    },
    customerInsightText() {
      const customer = this.store.selectedCustomerDetails?.customer;
      if (!customer) return '';
      if (customer.orderCount === 0) {
        return `${customer.name} has registered but has not ordered yet. This is a good customer to warm up with new drops, WhatsApp follow-ups, or first-order offers.`;
      }
      if (customer.valueLabel === 'High-value customer') {
        return `${customer.name} is one of the strongest customers for the site, with ${customer.orderCount} order(s), ₹${customer.totalSpent} spent, and interest in ${customer.favoriteCategory}. Keep them close for launches and premium custom work.`;
      }
      if (customer.averageOrderValue >= 5000) {
        return `${customer.name} places high-value orders when they buy. They may respond well to personalized gifting bundles and limited-edition pieces.`;
      }
      return `${customer.name} has started buying from KraftedLove. Their favorite category is ${customer.favoriteCategory}, so future recommendations can be shaped around that taste.`;
    }
  },
  mounted() {
    if (this.store.currentUser?.isAdmin) {
      this.refreshCustomerData();
      this.store.fetchCategories();
    }
  },
  methods: {
    formatDate(isoString) {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    openAnalyticsDashboard() {
      this.store.trackEvent('nav_click', { page: '/analytics', metadata: { source: 'admin_dashboard' } });
      window.open('/analytics', '_blank', 'noopener,noreferrer');
    },
    startEdit(product) {
      this.editingProduct = { 
        ...product,
        images: product.images ? [...product.images] : (product.image ? [product.image] : []),
        customization: this.defaultCustomizationForProduct(product)
      };
      this.customCategoryEdit = '';
      this.formError = '';
    },
    async saveEdit() {
      if (!this.editingProduct.name.trim() || this.editingProduct.price === '' || this.editingProduct.inventory === '') {
        this.formError = 'Please fill out name, price, and stock levels.';
        return;
      }
      
      if (this.editingProduct.category === '__new__') {
        if (!this.customCategoryEdit.trim()) {
          this.formError = 'Please specify a name for the new category.';
          return;
        }
        this.editingProduct.category = this.customCategoryEdit.trim();
        await this.store.adminAddCategory(this.editingProduct.category);
      }
      
      const success = await this.store.adminUpdateProduct(this.editingProduct);
      if (success) {
        this.editingProduct = null;
        this.customCategoryEdit = '';
      }
    },
    cancelEdit() {
      this.editingProduct = null;
      this.customCategoryEdit = '';
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
        category: this.categories[0] || '',
        price: '',
        inventory: '',
        image: '/assets/images/blue-daisy-bottle.png',
        images: [],
        description: '',
        customization: this.defaultCustomizationForProduct({ category: this.categories[0] || '' })
      };
      this.customCategory = '';
      this.formError = '';
    },
    async saveAdd() {
      const f = this.productForm;
      if (!f.name.trim() || f.price === '' || f.inventory === '') {
        this.formError = 'Please fill out name, price, and stock levels.';
        return;
      }

      if (f.category === '__new__') {
        if (!this.customCategory.trim()) {
          this.formError = 'Please specify a name for the new category.';
          return;
        }
        f.category = this.customCategory.trim();
        await this.store.adminAddCategory(f.category);
      }

      const product = await this.store.adminAddProduct(f);
      if (product) {
        this.addingProduct = false;
        this.customCategory = '';
      }
    },
    cancelAdd() {
      this.addingProduct = false;
      this.customCategory = '';
      this.formError = '';
    },
    async advanceOrderStatus(orderId, status) {
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
      const success = await this.store.adminUpdateOrderStatus(orderId, status, note);
      if (success) {
        this.customTimelineNote = '';
      }
    },
    defaultCustomizationForProduct(product = {}) {
      const incoming = product.customization || {};
      const category = String(product.category || '').toLowerCase();
      const name = String(product.name || '').toLowerCase();
      let defaults = {
        enabled: false,
        allowNotes: false,
        allowPhotos: false,
        allowText: false,
        allowTheme: false,
        instructions: ''
      };

      if (category.includes('frame') || name.includes('frame') || name.includes('photo')) {
        defaults = {
          enabled: true,
          allowNotes: true,
          allowPhotos: true,
          allowText: true,
          allowTheme: true,
          instructions: 'Upload the photo and share names, dates, colors, or message details for the frame.'
        };
      } else if (category.includes('accessor') || name.includes('kalire') || name.includes('wedding')) {
        defaults = {
          enabled: true,
          allowNotes: true,
          allowPhotos: true,
          allowText: true,
          allowTheme: true,
          instructions: 'Share names, initials, wedding colors, outfit reference, or any personal message.'
        };
      } else if (category.includes('glass') || category.includes('resin') || name.includes('bottle') || name.includes('resin')) {
        defaults = {
          enabled: true,
          allowNotes: true,
          allowPhotos: true,
          allowText: false,
          allowTheme: true,
          instructions: 'Share your preferred colors, theme, room decor reference, or inspiration photo.'
        };
      } else if (category.includes('chocolate') || name.includes('chocolate')) {
        defaults = {
          enabled: true,
          allowNotes: true,
          allowPhotos: false,
          allowText: true,
          allowTheme: false,
          instructions: 'Add a gifting message, dietary note, or packaging preference.'
        };
      }

      return {
        enabled: incoming.enabled ?? defaults.enabled,
        allowNotes: incoming.allowNotes ?? defaults.allowNotes,
        allowPhotos: incoming.allowPhotos ?? defaults.allowPhotos,
        allowText: incoming.allowText ?? defaults.allowText,
        allowTheme: incoming.allowTheme ?? defaults.allowTheme,
        instructions: incoming.instructions ?? defaults.instructions
      };
    },
    async deleteOrder(orderId) {
      if (confirm(`Delete order ${orderId}? This cannot be undone.`)) {
        await this.store.adminDeleteOrder(orderId);
      }
    },
    async refreshCustomerData() {
      await this.store.fetchAdminCustomers();
      await this.store.fetchCustomerInsights();
      if (!this.selectedCustomerEmail && this.store.users.length > 0) {
        await this.selectCustomer(this.store.users[0].email);
      }
    },
    async selectCustomer(email) {
      this.selectedCustomerEmail = email;
      await this.store.fetchCustomerDetails(email);
    },
    async deleteCustomer(customer) {
      if (!customer?.email) return;
      const orderText = customer.orderCount === 1 ? '1 order' : `${customer.orderCount || 0} orders`;
      const confirmed = confirm(`Delete ${customer.name} (${customer.email})?\n\nThis will permanently delete the customer account, ${orderText}, and related analytics data. This cannot be undone.`);
      if (!confirmed) return;

      const deletedEmail = customer.email;
      const result = await this.store.adminDeleteCustomer(deletedEmail);
      if (!result.success) return;

      this.selectedCustomerEmail = '';
      const nextCustomer = this.store.users.find(user => user.email.toLowerCase() !== deletedEmail.toLowerCase());
      if (nextCustomer) {
        await this.selectCustomer(nextCustomer.email);
      } else {
        this.store.selectedCustomerDetails = null;
      }
      await this.store.fetchOrders();
    },
    productCountForCategory(category) {
      return this.store.products.filter(product => product.category === category).length;
    },
    clearProductFilters() {
      this.productSearch = '';
      this.productCategoryFilter = '';
      this.productStockFilter = '';
      this.productSort = 'newest';
    },
    async addCategory() {
      const name = this.newCategoryName.trim();
      if (!name) return;
      const result = await this.store.adminAddCategory(name);
      if (result.success) {
        this.newCategoryName = '';
      }
    },
    async deleteCategory(category) {
      if (confirm(`Remove "${category}" from the site categories? Products using it must be moved first.`)) {
        await this.store.adminDeleteCategory(category);
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
