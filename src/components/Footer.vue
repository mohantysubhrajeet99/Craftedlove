<template>
<footer class="bg-stone-900 text-stone-300 border-t border-stone-850">
    <div class="max-w-none px-4 sm:px-6 lg:px-12 xl:px-16 py-12 sm:py-16">
      <div class="flex flex-col md:flex-row md:justify-between items-start gap-8 sm:gap-12">
        
        <!-- Column 1: Brand Info -->
        <div class="space-y-4 max-w-sm">
          <span class="font-serif text-2xl font-bold bg-gradient-to-r from-rose-450 to-pink-500 bg-clip-text text-transparent flex items-center gap-1.5 cursor-pointer" @click="setView('home')">
            KraftedLove
          </span>
          <p class="text-sm text-stone-300 leading-relaxed">
            We curate and hand-pour beautiful, modern decor objects, pressed floral frames, and single-origin artisanal chocolates. Every piece is made with love by our collective of local artists.
          </p>
          <div class="flex items-center space-x-3 text-stone-400 pt-2">
            <a href="#" class="hover:text-rose-400 transition-colors" aria-label="Instagram">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
            </a>
          </div>
        </div>

        <!-- Column 2: Navigation Links -->
        <div class="space-y-4">
          <h3 class="font-serif text-lg font-semibold text-white">Quick Links</h3>
          <ul class="space-y-2 text-sm text-stone-300">
            <li><a @click="setView('home')" class="hover:text-rose-400 cursor-pointer transition-colors">Home</a></li>
            <li><a @click="setView('shop')" class="hover:text-rose-400 cursor-pointer transition-colors">Shop Catalog</a></li>
            <li><a @click="setView('about')" class="hover:text-rose-400 cursor-pointer transition-colors">Our Story</a></li>
            <li><a @click="setView('dashboard')" class="hover:text-rose-400 cursor-pointer transition-colors">Track Orders</a></li>
          </ul>
        </div>

        <!-- Column 3: Contact Details -->
        <div class="space-y-4">
          <h3 class="font-serif text-lg font-semibold text-white">Get in Touch</h3>
          <ul class="space-y-2.5 text-sm text-stone-300">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>456 Artisan Way, Studio 12, Portland, OR</span>
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span>hello@kraftedlove.com</span>
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.942-6.942l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
              <span>+1 (503) 555-0199</span>
            </li>
          </ul>
        </div>

      </div>

      <div class="border-t border-stone-880 mt-12 pt-8 text-center text-xs text-stone-400">
        <p>© 2026 KraftedLove. All rights reserved. Handcrafted with passion and care.</p>
      </div>
    </div>
  </footer>>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    setView: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      email: ''
    };
  },
  methods: {
    handleNewsletter() {
      if (this.email) {
        import('../store.js').then(module => {
          module.store.addToast(`Thank you! "${this.email}" has been added to our list. Check your inbox for 10% off.`, 'success');
          this.email = '';
        });
      }
    }
  }
};
</script>
