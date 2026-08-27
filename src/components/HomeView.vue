<template>
  <div class="space-y-16 pb-16">
    
    <!-- STAGGERED DYNAMIC ACCORDION PANELS -->
    <section class="relative bg-stone-50 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pb-16">
        <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span class="text-xs uppercase tracking-widest font-semibold text-rose-500 bg-rose-50 px-3 py-1 rounded-full">Artisanal Gallery</span>
          <h1 class="font-serif text-3xl sm:text-5xl font-bold text-stone-850 mt-3 leading-tight">Handmade Treasures, Crafted with Love</h1>
          <p class="text-sm sm:text-base text-stone-400 mt-3">Explore our curated collections of hand-poured resins, hand-painted glass bottles, floral frames, and single-origin chocolates.</p>
        </div>

        <!-- Staggered Panel Container -->
        <div class="flex flex-col md:flex-row gap-4 h-[600px] md:h-[480px] w-full">
          
          <!-- Panel 1: Resin Art -->
          <div 
            class="group relative flex-grow md:flex-1 hover:md:flex-[2.8] rounded-2xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer shadow-md hover:shadow-xl flex items-end p-6 bg-cover bg-center"
            style="background-image: url('/assets/images/ocean-resin-table.png');"
            @click="exploreCategory('Resin Art')"
          >
            <!-- Dark overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-opacity duration-300"></div>
            
            <!-- Content -->
            <div class="relative z-10 w-full text-white space-y-1.5 md:space-y-2">
              <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-rose-450 bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full inline-block">Best Seller</span>
              <h3 class="font-serif text-xl sm:text-2xl font-bold leading-tight">Oceanic Resin Art</h3>
              <p class="text-xs sm:text-sm text-stone-300 line-clamp-2 md:opacity-0 md:group-hover:opacity-100 md:max-h-0 md:group-hover:max-h-16 transition-all duration-500 ease-in-out overflow-hidden">
                Bring the shoreline home with hand-poured epoxy resin side tables, serving trays, and platters embedded with real sand and shells.
              </p>
              <div class="pt-1">
                <span class="text-xs font-semibold text-rose-400 flex items-center gap-1 group-hover:text-white transition-colors">
                  Explore Collection
                  <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
                </span>
              </div>
            </div>
          </div>

          <!-- Panel 2: Painted Glass -->
          <div 
            class="group relative flex-grow md:flex-1 hover:md:flex-[2.8] rounded-2xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer shadow-md hover:shadow-xl flex items-end p-6 bg-cover bg-center"
            style="background-image: url('/assets/images/blue-daisy-bottle.png');"
            @click="exploreCategory('Glass Art')"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-opacity duration-300"></div>
            
            <div class="relative z-10 w-full text-white space-y-1.5 md:space-y-2">
              <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-rose-450 bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full inline-block">Decorative</span>
              <h3 class="font-serif text-xl sm:text-2xl font-bold leading-tight">Hand-Painted Glass</h3>
              <p class="text-xs sm:text-sm text-stone-300 line-clamp-2 md:opacity-0 md:group-hover:opacity-100 md:max-h-0 md:group-hover:max-h-16 transition-all duration-500 ease-in-out overflow-hidden">
                Unique glass bottles intricately decorated with gradients, Buddha faces, cherry blossom trees, and colorful grains.
              </p>
              <div class="pt-1">
                <span class="text-xs font-semibold text-rose-400 flex items-center gap-1 group-hover:text-white transition-colors">
                  Explore Collection
                  <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
                </span>
              </div>
            </div>
          </div>

          <!-- Panel 3: Floral Frames -->
          <div 
            class="group relative flex-grow md:flex-1 hover:md:flex-[2.8] rounded-2xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer shadow-md hover:shadow-xl flex items-end p-6 bg-cover bg-center"
            style="background-image: url('/assets/images/pressed-flower-frame.png');"
            @click="exploreCategory('Frames')"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-opacity duration-300"></div>
            
            <div class="relative z-10 w-full text-white space-y-1.5 md:space-y-2">
              <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-rose-450 bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full inline-block">Memories</span>
              <h3 class="font-serif text-xl sm:text-2xl font-bold leading-tight">Pressed Floral Frames</h3>
              <p class="text-xs sm:text-sm text-stone-300 line-clamp-2 md:opacity-0 md:group-hover:opacity-100 md:max-h-0 md:group-hover:max-h-16 transition-all duration-500 ease-in-out overflow-hidden">
                Preserve your photographs within hand-crafted frames, bordered by real pressed daisies and flakes of shimmering gold.
              </p>
              <div class="pt-1">
                <span class="text-xs font-semibold text-rose-400 flex items-center gap-1 group-hover:text-white transition-colors">
                  Explore Collection
                  <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
                </span>
              </div>
            </div>
          </div>

          <!-- Panel 4: Artisanal Chocolates -->
          <div 
            class="group relative flex-grow md:flex-1 hover:md:flex-[2.8] rounded-2xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer shadow-md hover:shadow-xl flex items-end p-6 bg-cover bg-center"
            style="background-image: url('/assets/images/dark-chocolate-box.jpg');"
            @click="exploreCategory('Chocolates')"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-opacity duration-300"></div>
            
            <div class="relative z-10 w-full text-white space-y-1.5 md:space-y-2">
              <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-rose-450 bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full inline-block">Confections</span>
              <h3 class="font-serif text-xl sm:text-2xl font-bold leading-tight">Artisanal Chocolates</h3>
              <p class="text-xs sm:text-sm text-stone-300 line-clamp-2 md:opacity-0 md:group-hover:opacity-100 md:max-h-0 md:group-hover:max-h-16 transition-all duration-500 ease-in-out overflow-hidden">
                Decadent hand-rolled truffles with gold leaf and gourmet fruit & nut barks made from single-origin organic cocoa.
              </p>
              <div class="pt-1">
                <span class="text-xs font-semibold text-rose-400 flex items-center gap-1 group-hover:text-white transition-colors">
                  Explore Collection
                  <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- BRAND STORY INTRO -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <!-- Image grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-4">
            <img src="/assets/images/pressed-flower-frame.png" class="rounded-2xl shadow-md w-full h-48 sm:h-64 object-cover object-center" alt="Pressed Flower Frame detail" />
            <img src="/assets/images/lotus-resin-tray.png" class="rounded-2xl shadow-md w-full h-36 object-cover object-center" alt="Lotus Tray detail" />
          </div>
          <div class="space-y-4 pt-8">
            <img src="/assets/images/buddha-bottle.png" class="rounded-2xl shadow-md w-full h-36 object-cover object-center" alt="Painted Buddha Bottle detail" />
            <img src="/assets/images/gourmet-chocolate-bark.jpg" class="rounded-2xl shadow-md w-full h-48 sm:h-64 object-cover object-center" alt="Artisanal Chocolate detail" />
          </div>
        </div>

        <!-- Text block -->
        <div class="space-y-5 sm:space-y-6">
          <span class="text-xs uppercase tracking-widest font-semibold text-rose-500">Made by hand, with intention</span>
          <h2 class="font-serif text-3xl sm:text-4xl font-bold text-stone-850 leading-tight">Every Creation Tells an Artisanal Story</h2>
          <p class="text-stone-400 text-sm sm:text-base leading-relaxed">
            At **CraftedLove**, we believe that the objects in your home should carry warmth, intent, and human touch. We gather raw elements—glass, organic flower petals, premium cacao, and resin—and mold them into objects of beauty.
          </p>
          <p class="text-stone-400 text-sm sm:text-base leading-relaxed">
            Our small-batch production process ensures that no two items are exactly alike. When you purchase a piece of Lippan art, a painted vase, or a box of gold-dusted truffles, you are bringing home hours of meticulous craft, artistic dedication, and a piece of the artisan's soul.
          </p>
          <div class="pt-2">
            <button @click="setView('about')" class="py-3 px-8 bg-stone-900 text-white text-sm font-semibold rounded-full hover:bg-stone-800 transition-colors shadow-md active:scale-95 shadow-stone-900/10">Read Our Story</button>
          </div>
        </div>

      </div>
    </section>

    <!-- CURATED SHOWCASE (FEATURED PRODUCTS) -->
    <section class="bg-stone-50/50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span class="text-xs uppercase tracking-widest font-semibold text-rose-500">Curated Gems</span>
            <h2 class="font-serif text-3xl font-bold text-stone-850 mt-1">Trending Creations</h2>
          </div>
          <button @click="setView('shop')" class="text-sm font-semibold text-rose-500 hover:text-rose-650 flex items-center gap-1">
            Shop Entire Catalog
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
          </button>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="product in featuredProducts" 
            :key="product.id" 
            class="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl hover:border-stone-200/60 transition-all duration-300 flex flex-col"
          >
            <!-- Thumbnail -->
            <div class="aspect-square bg-stone-50 overflow-hidden relative">
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-stone-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                {{ product.category }}
              </span>
            </div>

            <!-- Details -->
            <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div class="space-y-1">
                <h3 class="font-serif text-lg font-bold text-stone-800 line-clamp-1 group-hover:text-rose-500 transition-colors leading-snug">{{ product.name }}</h3>
                <div class="flex items-center gap-1.5">
                  <!-- Rating Stars -->
                  <div class="flex text-amber-400">
                    <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                  <span class="text-xs text-stone-400 font-medium">({{ product.reviews.length }} Reviews)</span>
                </div>
                <p class="text-sm text-stone-400 line-clamp-2 leading-relaxed">
                  {{ product.description }}
                </p>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-stone-50">
                <span class="text-xl font-bold text-stone-850 font-sans">₹<span>{{ product.price }}</span></span>
                <button 
                  @click="addToCart(product)"
                  class="py-2 px-5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-full hover:shadow-md transition-all active:scale-95 flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CUSTOMER TESTIMONIALS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="text-center max-w-xl mx-auto mb-12">
        <span class="text-xs uppercase tracking-widest font-semibold text-rose-500">Love Letters</span>
        <h2 class="font-serif text-3xl font-bold text-stone-855 mt-1">What Our Friends Say</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Testimonial 1 -->
        <div class="p-6 sm:p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-md transition-shadow relative">
          <span class="absolute top-6 right-8 text-rose-100 font-serif text-7xl select-none">“</span>
          <div class="space-y-4">
            <p class="text-sm sm:text-base text-stone-400 italic leading-relaxed relative z-10">
              "I ordered the Ocean Wave Resin Table and it is absolutely the crown jewel of my living room. The detail, with the little shells and sand, is breathtaking. It feels like high art."
            </p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">SM</div>
              <div>
                <h4 class="font-semibold text-stone-800 text-sm">Sarah M.</h4>
                <p class="text-xs text-stone-400">Portland, OR</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Testimonial 2 -->
        <div class="p-6 sm:p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-md transition-shadow relative">
          <span class="absolute top-6 right-8 text-rose-100 font-serif text-7xl select-none">“</span>
          <div class="space-y-4">
            <p class="text-sm sm:text-base text-stone-400 italic leading-relaxed relative z-10">
              "The Handcrafted Bridal Kalire was so beautifully customized with my initials! I got so many compliments on my wedding day. They look incredibly premium and vibrantly colorful."
            </p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-pink-100 text-pink-650 flex items-center justify-center font-bold text-sm">PR</div>
              <div>
                <h4 class="font-semibold text-stone-800 text-sm">Pooja R.</h4>
                <p class="text-xs text-stone-400">Austin, TX</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Testimonial 3 -->
        <div class="p-6 sm:p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-md transition-shadow relative">
          <span class="absolute top-6 right-8 text-rose-100 font-serif text-7xl select-none">“</span>
          <div class="space-y-4">
            <p class="text-sm sm:text-base text-stone-400 italic leading-relaxed relative z-10">
              "Decadent single-origin truffles! The gold dust is such a luxurious touch. I gifted a box of truffles and a hand-painted glass bottle to my mother, and she was in tears of joy."
            </p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-650 flex items-center justify-center font-bold text-sm">MV</div>
              <div>
                <h4 class="font-semibold text-stone-800 text-sm">Marcus V.</h4>
                <p class="text-xs text-stone-400">Boston, MA</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- END CTA BANNER -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div class="bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
        
        <!-- Background accent rings -->
        <div class="absolute -right-24 -top-24 w-80 h-80 rounded-full border-4 border-white/10 pointer-events-none"></div>
        <div class="absolute -left-24 -bottom-24 w-80 h-80 rounded-full border-4 border-white/10 pointer-events-none"></div>

        <div class="relative z-10 max-w-xl mx-auto space-y-4">
          <h2 class="font-serif text-3xl sm:text-4xl font-bold leading-tight">Bring Warmth, Color, and Soul to Your Everyday Space</h2>
          <p class="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Explore our full collection of artisanal chocolates, mud-and-mirror work frames, hand-poured waves, and custom hangings. Supports local craft artists with every purchase.
          </p>
          <div class="pt-4 flex justify-center gap-4">
            <button @click="exploreShop" class="py-3 px-8 bg-white hover:bg-stone-50 text-stone-900 font-bold rounded-full text-sm shadow-lg shadow-black/10 transition-colors active:scale-95">Explore Shop</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { store } from '../store.js';

export default {
  name: 'HomeView',
  props: {
    setView: {
      type: Function,
      required: true
    },
    setCategoryFilter: {
      type: Function,
      required: true
    }
  },
  computed: {
    store() {
      return store;
    },
    featuredProducts() {
      return this.store.products.filter(p => [1, 2, 11].includes(p.id));
    }
  },
  methods: {
    exploreCategory(category) {
      this.setCategoryFilter(category);
      this.setView('shop');
    },
    exploreShop() {
      this.setCategoryFilter('');
      this.setView('shop');
    },
    addToCart(product) {
      this.store.addToCart(product, 1);
    }
  }
};
</script>
