<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Redirect if not logged in -->
    <div v-if="!store.currentUser" class="flex flex-col items-center justify-center py-20 text-center bg-[#FBF7F2] rounded-2xl border border-stone-100">
      <svg class="w-16 h-16 text-stone-600 mb-4 animate-bounce" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z"/></svg>
      <h2 class="text-xl font-bold text-stone-700">Account Access Required</h2>
      <p class="text-stone-700 text-sm mt-1 max-w-sm">Please log in or register to view your order history and live shipping trackers.</p>
      <button @click="$parent.authModalOpen = true" class="mt-6 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full shadow-md active:scale-95 transition-all text-sm">Log In Now</button>
    </div>

    <div v-else class="space-y-8">
      
      <!-- Welcome Card Header -->
      <div class="bg-stone-50 border border-stone-100 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-gradient-to-r from-rose-450 to-pink-550 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {{ store.currentUser.name.split(' ').map(n=>n[0]).join('') }}
          </div>
          <div>
            <h1 class="font-serif text-2xl font-bold text-stone-850">Hello, {{ store.currentUser.name }}</h1>
            <p class="text-xs text-stone-700 mt-0.5">Account email: {{ store.currentUser.email }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="store.currentUser.isAdmin" class="bg-indigo-50 border border-indigo-100 text-indigo-650 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Admin Access Enabled
          </span>
          <button @click="store.logout(); setView('home');" class="text-xs font-semibold text-stone-700 hover:text-rose-500 border border-stone-200 hover:border-rose-100 px-4 py-1.5 rounded-full bg-white transition-all">Sign Out</button>
        </div>
      </div>

      <!-- MAIN LAYOUT -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- ORDER HISTORY (Left List) -->
        <div class="lg:col-span-1 space-y-4">
          <h2 class="font-serif text-lg sm:text-xl font-bold text-stone-800 flex items-center justify-between">
            Order History
            <span class="text-xs font-normal text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">{{ userOrders.length }} orders</span>
          </h2>

          <!-- Empty Orders State -->
          <div v-if="userOrders.length === 0" class="border border-dashed border-stone-200 rounded-2xl p-8 text-center text-stone-700 space-y-4">
            <p class="text-sm">You haven't placed any orders yet.</p>
            <button @click="setView('shop')" class="text-xs font-semibold text-rose-500 border border-rose-200 px-4 py-2 rounded-full hover:bg-rose-50/50 transition-colors">Start Shopping</button>
          </div>

          <!-- Orders Vertical List -->
          <div v-else class="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            <div 
              v-for="order in userOrders" 
              :key="order.id"
              @click="selectOrder(order.id)"
              class="p-4 border rounded-2xl cursor-pointer hover:shadow-md transition-all text-left bg-white"
              :class="selectedOrderId === order.id ? 'border-rose-500 bg-rose-50/5' : 'border-stone-100'"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-mono text-sm font-bold text-stone-750">{{ order.id }}</span>
                <span 
                  class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm"
                  :class="{
                    'bg-amber-50 text-amber-600': order.status === 'Pending',
                    'bg-blue-50 text-blue-600': order.status === 'Processing',
                    'bg-indigo-50 text-indigo-600': order.status === 'Shipped',
                    'bg-green-50 text-green-600': order.status === 'Delivered',
                  }"
                >
                  {{ order.status }}
                </span>
              </div>
              <div class="flex justify-between items-end text-xs mt-3">
                <div class="text-stone-700 space-y-0.5">
                  <p>{{ formatDate(order.date).split(',')[0] }}</p>
                  <p class="line-clamp-1">{{ order.items.length }} product(s)</p>
                </div>
                <span class="font-bold text-sm text-stone-800">₹<span>{{ order.total }}</span></span>
              </div>
            </div>
          </div>

        </div>

        <!-- ORDER TRACKER & BREAKDOWN (Right Panel) -->
        <div class="lg:col-span-2 space-y-4">
          
          <div v-if="selectedOrder" class="border border-stone-100 rounded-3xl p-5 sm:p-6 bg-white shadow-sm space-y-6">
            
            <!-- Selected Order Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-stone-50 gap-2">
              <div>
                <h2 class="text-lg font-bold text-stone-800 flex items-center gap-2">
                  Order Details
                  <span class="font-mono text-stone-700 text-sm font-semibold">#{{ selectedOrder.id }}</span>
                </h2>
                <p class="text-xs text-stone-700 mt-0.5">Placed on: {{ formatDate(selectedOrder.date) }}</p>
              </div>
              
              <span 
                class="px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full shadow-md"
                :class="{
                  'bg-amber-550 text-white': selectedOrder.status === 'Pending',
                  'bg-blue-500 text-white': selectedOrder.status === 'Processing',
                  'bg-indigo-500 text-white': selectedOrder.status === 'Shipped',
                  'bg-green-500 text-white': selectedOrder.status === 'Delivered',
                }"
              >
                Status: {{ selectedOrder.status }}
              </span>
            </div>

            <!-- LIVE TIMELINE STATUS TRACKER (Horizontal Step Tracker) -->
            <div class="space-y-4 pt-2">
              <h3 class="font-serif text-sm font-semibold uppercase tracking-wider text-stone-500">Live Delivery Status</h3>
              
              <!-- Steps Flow -->
              <div class="relative flex justify-between items-center px-4 pt-4 pb-2">
                <!-- Grey Connector Bar Behind -->
                <div class="absolute left-6 right-6 top-7 h-0.5 bg-stone-200 -z-0"></div>
                <!-- Active Color Connector Bar -->
                <div 
                  class="absolute left-6 top-7 h-0.5 bg-rose-500 -z-0 transition-all duration-500"
                  :style="{ width: (getStatusStep(selectedOrder.status) / 3 * 100) + '%' }"
                ></div>

                <!-- Step 1: Pending -->
                <div class="relative z-10 flex flex-col items-center text-center">
                  <div 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all"
                    :class="getStatusStep(selectedOrder.status) >= 0 ? 'bg-rose-500 text-white' : 'bg-white border-2 border-stone-200 text-stone-700'"
                  >
                    ✓
                  </div>
                  <span class="text-xs font-semibold mt-2" :class="getStatusStep(selectedOrder.status) >= 0 ? 'text-rose-500' : 'text-stone-700'">Placed</span>
                </div>

                <!-- Step 2: Processing -->
                <div class="relative z-10 flex flex-col items-center text-center">
                  <div 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all"
                    :class="getStatusStep(selectedOrder.status) >= 1 ? 'bg-rose-500 text-white' : 'bg-white border-2 border-stone-200 text-stone-700'"
                  >
                    <span v-if="getStatusStep(selectedOrder.status) >= 1">✓</span>
                    <span v-else>2</span>
                  </div>
                  <span class="text-xs font-semibold mt-2" :class="getStatusStep(selectedOrder.status) >= 1 ? 'text-rose-500' : 'text-stone-700'">Preparing</span>
                </div>

                <!-- Step 3: Shipped -->
                <div class="relative z-10 flex flex-col items-center text-center">
                  <div 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all"
                    :class="getStatusStep(selectedOrder.status) >= 2 ? 'bg-rose-500 text-white' : 'bg-white border-2 border-stone-200 text-stone-700'"
                  >
                    <span v-if="getStatusStep(selectedOrder.status) >= 2">✓</span>
                    <span v-else>3</span>
                  </div>
                  <span class="text-xs font-semibold mt-2" :class="getStatusStep(selectedOrder.status) >= 2 ? 'text-rose-500' : 'text-stone-700'">Shipped</span>
                </div>

                <!-- Step 4: Delivered -->
                <div class="relative z-10 flex flex-col items-center text-center">
                  <div 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all"
                    :class="getStatusStep(selectedOrder.status) >= 3 ? 'bg-green-500 text-white' : 'bg-white border-2 border-stone-200 text-stone-700'"
                  >
                    <span v-if="getStatusStep(selectedOrder.status) >= 3">✓</span>
                    <span v-else>4</span>
                  </div>
                  <span class="text-xs font-semibold mt-2" :class="getStatusStep(selectedOrder.status) >= 3 ? 'text-green-600' : 'text-stone-700'">Arrived</span>
                </div>

              </div>

              <!-- Live Status Timeline Log -->
              <div class="bg-stone-50 rounded-2xl p-4 space-y-3">
                <div 
                  v-for="(log, idx) in [...selectedOrder.timeline].reverse()" 
                  :key="idx" 
                  class="flex gap-3 text-xs leading-relaxed border-l-2 pl-3 pb-2 last:pb-0"
                  :class="idx === 0 ? 'border-rose-500 text-stone-800' : 'border-stone-200 text-stone-700'"
                >
                  <div class="flex-grow">
                    <div class="flex items-center justify-between">
                      <span class="font-bold uppercase tracking-wider text-[9px]" :class="idx === 0 ? 'text-rose-500' : 'text-stone-500'">{{ log.status }}</span>
                      <span class="text-[9px] text-stone-450">{{ formatDate(log.time) }}</span>
                    </div>
                    <p class="mt-0.5" :class="idx === 0 ? 'font-medium' : 'text-stone-700'">{{ log.note }}</p>
                  </div>
                </div>
              </div>

            </div>

            <!-- ORDER ITEMS BREAKDOWN -->
            <div class="space-y-3 pt-2">
              <h3 class="font-serif text-sm font-semibold uppercase tracking-wider text-stone-500">Ordered Creations</h3>
              
              <div class="border border-stone-50 rounded-2xl overflow-hidden divide-y divide-stone-50">
                <div v-for="item in selectedOrder.items" :key="item.product.id" class="flex gap-4 p-3 items-center bg-white">
                  <img :src="item.product.image" :alt="item.product.name" class="w-12 h-12 rounded-lg object-cover bg-[#FBF7F2] flex-shrink-0" />
                  <div class="flex-grow text-xs sm:text-sm">
                    <h4 class="font-bold text-stone-850 line-clamp-1 leading-snug">{{ item.product.name }}</h4>
                    <p class="text-stone-700 mt-0.5">{{ item.product.category }} — Qty: {{ item.quantity }}</p>
                  </div>
                  <span class="font-bold text-stone-700 text-xs sm:text-sm">₹<span>{{ (item.product.price * item.quantity).toFixed(2) }}</span></span>
                </div>
              </div>
            </div>

            <!-- DELIVERY ADDRESS & TOTALS -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              <!-- Address -->
              <div class="space-y-1.5 text-xs sm:text-sm">
                <h4 class="font-serif text-xs font-semibold uppercase tracking-wider text-stone-500">Shipping To</h4>
                <div class="text-stone-450 space-y-0.5 bg-[#FBF7F2] rounded-2xl p-4">
                  <p class="font-bold text-stone-700">{{ selectedOrder.userName }}</p>
                  <p>{{ selectedOrder.shippingDetails.address }}</p>
                  <p>{{ selectedOrder.shippingDetails.city }}, {{ selectedOrder.shippingDetails.zip }}</p>
                  <p>{{ selectedOrder.shippingDetails.country }}</p>
                </div>
              </div>

              <!-- Totals -->
              <div class="space-y-1.5 text-xs sm:text-sm text-stone-500">
                <h4 class="font-serif text-xs font-semibold uppercase tracking-wider text-stone-500">Summary</h4>
                <div class="bg-stone-50 rounded-2xl p-4 space-y-1.5">
                  <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span class="font-medium text-stone-700">₹<span>{{ selectedOrder.subtotal }}</span></span>
                  </div>
                  <div class="flex justify-between">
                    <span>Shipping</span>
                    <span class="font-medium text-stone-700" v-if="selectedOrder.shipping === 0">Free</span>
                    <span class="font-medium text-stone-700" v-else>₹<span>{{ selectedOrder.shipping }}</span></span>
                  </div>
                  <div class="flex justify-between">
                    <span>Estimated Tax</span>
                    <span class="font-medium text-stone-700">₹<span>{{ selectedOrder.tax }}</span></span>
                  </div>
                  <div class="border-t border-stone-200/50 my-1 pt-1.5 flex justify-between font-bold text-stone-850 text-sm sm:text-base">
                    <span>Total Paid</span>
                    <span class="text-rose-650">₹<span>{{ selectedOrder.total }}</span></span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Selected Order fallback if none chosen -->
          <div v-else class="border border-stone-100 rounded-3xl p-16 text-center text-stone-700 bg-white">
            <svg class="w-12 h-12 text-stone-600 mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M11.35 16.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM19.5 16.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/><path d="M6 7.5h13.5l-1.5 8.25H8.25L6 7.5zM6 7.5L4.5 4.5h-2"/></svg>
            <p>Select an order from the history to track its live delivery status.</p>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { store } from '../store.js';

export default {
  name: 'DashboardView',
  props: {
    setView: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      selectedOrderId: null
    };
  },
  computed: {
    store() {
      return store;
    },
    userOrders() {
      if (!this.store.currentUser) return [];
      return this.store.orders.filter(o => o.userEmail.toLowerCase() === this.store.currentUser.email.toLowerCase());
    },
    selectedOrder() {
      if (!this.selectedOrderId) return null;
      return this.store.orders.find(o => o.id === this.selectedOrderId);
    }
  },
  created() {
    if (this.userOrders.length > 0) {
      this.selectedOrderId = this.userOrders[0].id;
    }
  },
  watch: {
    userOrders(newOrders) {
      if (newOrders.length > 0 && !this.selectedOrderId) {
        this.selectedOrderId = newOrders[0].id;
      }
    }
  },
  methods: {
    selectOrder(orderId) {
      this.selectedOrderId = orderId;
    },
    formatDate(isoString) {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    getStatusStep(status) {
      const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
      return steps.indexOf(status);
    }
  }
};
</script>
