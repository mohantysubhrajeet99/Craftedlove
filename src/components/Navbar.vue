<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        
        <!-- Logo -->
        <div class="flex-shrink-0 flex flex-col justify-center cursor-pointer" @click="handleNav('home')">
          <span class="font-serif text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-500 via-pink-650 to-indigo-650 bg-clip-text text-transparent flex items-center gap-1.5 leading-none">
            CraftedLove
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="none" class="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 animate-pulse flex-shrink-0">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </span>
          <span class="text-[10px] sm:text-[11px] text-stone-400 font-serif italic ml-0.5 mt-1 leading-none">by Sonali Dhupal</span>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8 font-medium text-stone-600 text-[15px]">
          <a @click="handleNav('home')" :class="currentView === 'home' ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'" class="cursor-pointer transition-colors duration-200">Home</a>
          <a @click="handleNav('shop')" :class="currentView === 'shop' ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'" class="cursor-pointer transition-colors duration-200">Shop</a>
          <a @click="handleNav('about')" :class="currentView === 'about' ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'" class="cursor-pointer transition-colors duration-200">About</a>
          <a v-if="store.currentUser" @click="handleNav('dashboard')" :class="currentView === 'dashboard' ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'" class="cursor-pointer transition-colors duration-200">My Orders</a>
        </nav>

        <!-- Right Utility Icons -->
        <div class="flex items-center space-x-3 sm:space-x-5">
          <!-- Account -->
          <div class="relative">
            <button @click="store.currentUser ? toggleProfile() : openAuth()" class="flex items-center gap-1.5 p-2 rounded-full hover:bg-stone-50 text-stone-700 transition-colors" aria-label="User Profile">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span v-if="store.currentUser" class="hidden sm:inline text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">{{ store.currentUser.name.split(' ')[0] }}</span>
            </button>

            <!-- Profile Dropdown (Logged In) -->
            <div v-if="store.currentUser && profileDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white border border-stone-100 rounded-xl shadow-lg py-1.5 z-50 text-sm animate-fadeIn">
              <div class="px-4 py-2 border-b border-stone-50">
                <p class="font-semibold text-stone-800">{{ store.currentUser.name }}</p>
                <p class="text-xs text-stone-400 truncate">{{ store.currentUser.email }}</p>
              </div>
              <a @click="handleNav('dashboard')" class="block px-4 py-2 text-stone-600 hover:bg-stone-50 hover:text-rose-500 cursor-pointer">My Orders</a>
              <div class="border-t border-stone-50 my-1"></div>
              <a @click="handleLogout" class="block px-4 py-2 text-rose-500 hover:bg-stone-50 cursor-pointer font-medium">Log Out</a>
            </div>
          </div>

          <!-- Cart Trigger -->
          <button @click="toggleCart" class="relative p-2 rounded-full hover:bg-stone-50 text-stone-700 transition-colors" aria-label="Open Cart">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <!-- Cart Badge -->
            <span v-if="store.cartCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-rose-500 rounded-full scale-75 transform translate-x-1.5 -translate-y-1.5">
              {{ store.cartCount }}
            </span>
          </button>

          <!-- Mobile Menu Toggle -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-full hover:bg-stone-50 text-stone-700 transition-colors" aria-label="Toggle Menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6" v-if="!mobileMenuOpen">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6" v-else>
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Dropdown Navigation -->
    <div v-show="mobileMenuOpen" class="md:hidden border-t border-stone-100 bg-white shadow-inner animate-fadeIn">
      <div class="px-2 pt-3 pb-4 space-y-1 sm:px-3 text-base">
        <a @click="handleNav('home')" :class="currentView === 'home' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-stone-600 hover:bg-stone-50'" class="block px-4 py-2.5 rounded-xl cursor-pointer">Home</a>
        <a @click="handleNav('shop')" :class="currentView === 'shop' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-stone-600 hover:bg-stone-50'" class="block px-4 py-2.5 rounded-xl cursor-pointer">Shop</a>
        <a @click="handleNav('about')" :class="currentView === 'about' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-stone-600 hover:bg-stone-50'" class="block px-4 py-2.5 rounded-xl cursor-pointer">About</a>
        <a v-if="store.currentUser" @click="handleNav('dashboard')" :class="currentView === 'dashboard' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-stone-600 hover:bg-stone-50'" class="block px-4 py-2.5 rounded-xl cursor-pointer">My Orders</a>
      </div>
    </div>

    <!-- Cart Drawer Overlay -->
    <teleport to="body">
      <div v-if="cartOpen" @click.self="toggleCart" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300">
        <!-- Drawer Panel -->
        <div class="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-slideIn">
          
          <!-- Drawer Header -->
          <div class="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 class="text-xl font-bold text-stone-800 flex items-center gap-2">
              Your Bag
              <span class="text-sm font-normal text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{{ store.cartCount }}</span>
            </h2>
            <button @click="toggleCart" class="p-2 -mr-2 rounded-full hover:bg-stone-50 text-stone-400 hover:text-stone-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Drawer Content -->
          <div class="flex-grow overflow-y-auto p-5 space-y-4">
            
            <!-- Empty State -->
            <div v-if="store.cart.length === 0" class="text-center py-16 space-y-4">
              <div class="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <div class="space-y-1">
                <h3 class="font-serif text-base font-bold text-stone-750">Your bag is empty</h3>
                <p class="text-xs text-stone-400">Fill it with beautiful handcrafted items.</p>
              </div>
              <button @click="toggleCart" class="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-full shadow-md active:scale-95 transition-all">Start Shopping</button>
            </div>

            <!-- Items List -->
            <div v-else class="space-y-4">
              <div v-for="item in store.cart" :key="item.product.id" class="flex gap-4 pb-4 border-b border-stone-100 last:border-0">
                <img :src="item.product.image" :alt="item.product.name" class="w-16 h-16 rounded-xl object-cover bg-stone-50 flex-shrink-0" />
                
                <!-- Product Details -->
                <div class="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 class="font-semibold text-sm text-stone-800 line-clamp-1 leading-tight">{{ item.product.name }}</h4>
                    <p class="text-xs text-stone-400 mt-0.5">{{ item.product.category }}</p>
                  </div>
                  
                  <!-- Quantity Controller -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center border border-stone-100 rounded-lg overflow-hidden bg-stone-50 text-sm">
                      <button @click="store.updateCartQuantity(item.product.id, item.quantity - 1)" class="px-2.5 py-1 text-stone-400 hover:text-stone-850 hover:bg-stone-100 transition-colors">-</button>
                      <span class="px-2 font-medium text-stone-700 min-w-[20px] text-center">{{ item.quantity }}</span>
                      <button @click="store.updateCartQuantity(item.product.id, item.quantity + 1)" class="px-2.5 py-1 text-stone-400 hover:text-stone-850 hover:bg-stone-100 transition-colors">+</button>
                    </div>
                    <span class="font-bold text-stone-800 text-sm">₹<span>{{ (item.product.price * item.quantity).toFixed(2) }}</span></span>
                  </div>
                </div>

                <!-- Remove Button -->
                <button @click="store.removeFromCart(item.product.id)" class="text-stone-300 hover:text-rose-500 self-start p-1" aria-label="Remove Item">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

          <!-- Drawer Footer (Sticky Checkout) -->
          <div v-if="store.cart.length > 0" class="p-5 border-t border-stone-100 bg-stone-50 space-y-4">
            
            <div class="space-y-1.5 text-sm text-stone-500">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span class="font-medium text-stone-700">₹<span>{{ store.cartSubtotal }}</span></span>
              </div>
              <div class="flex justify-between">
                <span>Shipping</span>
                <span class="font-medium text-stone-700" v-if="store.cartSubtotal > 8000">Free</span>
                <span class="font-medium text-stone-700" v-else>₹499</span>
              </div>
              <div class="border-t border-stone-200/50 my-2"></div>
              <div class="flex justify-between text-base font-bold text-stone-850">
                <span>Total Est.</span>
                <span class="text-rose-600">₹<span>{{ (store.cartSubtotal + (store.cartSubtotal > 8000 ? 0 : 499)).toFixed(2) }}</span></span>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-3">
              <button @click="toggleCart" class="w-1/3 py-3 border border-stone-200 text-stone-600 font-semibold rounded-full hover:bg-white transition-colors text-sm">Keep Browsing</button>
              <button @click="triggerCheckout" class="w-2/3 py-3 bg-gradient-to-r from-rose-500 to-pink-650 text-white font-semibold rounded-full hover:shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-1">
                Checkout
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>

          </div>

        </div>
      </div>
    </teleport>
  </header>
</template>

<script>
import { store } from '../store.js';

export default {
  name: 'Navbar',
  props: {
    setView: {
      type: Function,
      required: true
    },
    currentView: {
      type: String,
      required: true
    },
    openAuth: {
      type: Function,
      required: true
    },
    openCheckout: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      mobileMenuOpen: false,
      cartOpen: false,
      profileDropdownOpen: false
    };
  },
  computed: {
    store() {
      return store;
    }
  },
  methods: {
    handleNav(view) {
      this.setView(view);
      this.mobileMenuOpen = false;
      this.profileDropdownOpen = false;
    },
    toggleCart() {
      this.cartOpen = !this.cartOpen;
    },
    toggleProfile() {
      this.profileDropdownOpen = !this.profileDropdownOpen;
    },
    handleLogout() {
      this.store.logout();
      this.setView('home');
      this.profileDropdownOpen = false;
    },
    triggerCheckout() {
      this.cartOpen = false;
      if (!this.store.currentUser) {
        this.store.addToast('Please log in to proceed to checkout.', 'warning');
        this.openAuth();
      } else {
        this.openCheckout();
      }
    }
  }
};
</script>
