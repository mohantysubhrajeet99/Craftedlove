<template>
  <div v-if="isOpen" class="fixed inset-0 bg-stone-950/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" @click.self="closeModal">
    <!-- Modal Box -->
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative overflow-hidden animate-slideUp border border-white/70">
      
      <!-- Decoration top bar -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-indigo-500"></div>

      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-5 right-5 text-stone-400 hover:text-stone-600 p-1.5 rounded-full hover:bg-stone-50 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6l12 12"/></svg>
      </button>

      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-stone-850">
          {{ isLogin ? 'Welcome Back' : 'Create Account' }}
        </h2>
        <p class="text-sm text-stone-400 mt-1.5">
          {{ isLogin ? 'Sign in to access your orders and tracker' : 'Register to start shopping and custom crafting' }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <!-- Name Input (Register Only) -->
        <div v-if="!isLogin" class="space-y-1">
          <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500">Full Name</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>
            </span>
            <input 
              type="text" 
              v-model="name"
              class="pl-10 w-full px-4 py-2.5 rounded-xl border text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-450 transition-all"
              :class="errors.name ? 'border-red-400' : 'border-stone-200'"
              placeholder="Enter your name"
            />
          </div>
          <p v-if="errors.name" class="text-xs text-red-500 mt-0.5">{{ errors.name }}</p>
        </div>

        <!-- Email Input -->
        <div class="space-y-1">
          <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500">Email Address</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/></svg>
            </span>
            <input 
              type="email" 
              v-model="email"
              class="pl-10 w-full px-4 py-2.5 rounded-xl border text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-450 transition-all"
              :class="errors.email ? 'border-red-400' : 'border-stone-200'"
              placeholder="you@example.com"
            />
          </div>
          <p v-if="errors.email" class="text-xs text-red-500 mt-0.5">{{ errors.email }}</p>
        </div>

        <!-- Phone Input (Register Only) -->
        <div v-if="!isLogin" class="space-y-1">
          <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500">Phone Number</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.942-6.942l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
            </span>
            <input 
              type="tel" 
              v-model="phone"
              class="pl-10 w-full px-4 py-2.5 rounded-xl border text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-450 transition-all"
              :class="errors.phone ? 'border-red-400' : 'border-stone-200'"
              placeholder="+919876543210"
            />
          </div>
          <p v-if="errors.phone" class="text-xs text-red-500 mt-0.5">{{ errors.phone }}</p>
        </div>

        <!-- Password Input -->
        <div class="space-y-1">
          <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500">Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z"/></svg>
            </span>
            <input 
              type="password" 
              v-model="password"
              class="pl-10 w-full px-4 py-2.5 rounded-xl border text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-450 transition-all"
              :class="errors.password ? 'border-red-400' : 'border-stone-200'"
              placeholder="••••••••"
            />
          </div>
          <p v-if="errors.password" class="text-xs text-red-500 mt-0.5">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password (Register Only) -->
        <div v-if="!isLogin" class="space-y-1">
          <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500">Confirm Password</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z"/></svg>
            </span>
            <input 
              type="password" 
              v-model="confirmPassword"
              class="pl-10 w-full px-4 py-2.5 rounded-xl border text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-450 transition-all"
              :class="errors.confirmPassword ? 'border-red-400' : 'border-stone-200'"
              placeholder="••••••••"
            />
          </div>
          <p v-if="errors.confirmPassword" class="text-xs text-red-500 mt-0.5">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="w-full mt-2 py-3 bg-gradient-to-r from-rose-500 to-pink-650 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 shadow-rose-500/20 active:scale-[0.99] transition-all text-sm"
        >
          {{ isLogin ? 'Sign In' : 'Create Account' }}
        </button>
      </form>

      <!-- Toggle Mode Link -->
      <div class="mt-6 text-center text-sm">
        <p class="text-stone-500">
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <button @click="toggleMode" class="text-rose-500 font-semibold hover:underline ml-1">
            {{ isLogin ? 'Sign Up' : 'Log In' }}
          </button>
        </p>
      </div>


    </div>
  </div>
</template>

<script>
import { store } from '../store.js';

export default {
  name: 'AuthModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    onClose: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isLogin: true,
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      errors: {}
    };
  },
  computed: {
    store() {
      return store;
    }
  },
  methods: {
    toggleMode() {
      this.isLogin = !this.isLogin;
      this.name = '';
      this.email = '';
      this.phone = '';
      this.password = '';
      this.confirmPassword = '';
      this.errors = {};
    },
    validate() {
      const err = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+\d{7,15}$/;
      
      if (!this.email) {
        err.email = 'Email is required.';
      } else if (!emailRegex.test(this.email)) {
        err.email = 'Please enter a valid email.';
      }

      if (!this.password) {
        err.password = 'Password is required.';
      } else if (this.password.length < 6) {
        err.password = 'Password must be at least 6 characters.';
      }

      if (!this.isLogin) {
        if (!this.name.trim()) {
          err.name = 'Name is required.';
        }
        if (!this.phone.trim()) {
          err.phone = 'Phone number is required.';
        } else if (!phoneRegex.test(this.phone.trim())) {
          err.phone = 'Include country code, for example +919876543210.';
        }
        if (this.password !== this.confirmPassword) {
          err.confirmPassword = 'Passwords do not match.';
        }
      }

      this.errors = err;
      return Object.keys(err).length === 0;
    },
    async handleSubmit() {
      if (!this.validate()) return;

      if (this.isLogin) {
        const res = await this.store.login(this.email, this.password);
        if (res.success) {
          this.closeModal();
        }
      } else {
        const res = await this.store.register(this.name, this.email, this.phone, this.password);
        if (res.success) {
          this.closeModal();
        }
      }
    },
    closeModal() {
      this.name = '';
      this.email = '';
      this.phone = '';
      this.password = '';
      this.confirmPassword = '';
      this.errors = {};
      this.onClose();
    }
  }
};
</script>
