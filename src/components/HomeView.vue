<template>
  <div class="space-y-16 pb-16">
    
    <!-- STAGGERED DYNAMIC ACCORDION PANELS -->
    <section class="relative bg-[#FBF7F2] overflow-hidden">

      <div class="max-w-none px-4 sm:px-6 lg:px-12 xl:px-16 pt-8 pb-12 sm:pb-16 relative overflow-hidden z-10">
        <!-- Left Side Floating Craft Materials -->
        <div class="hidden lg:block pointer-events-none">
          <!-- Paint Palette SVG -->
          <div class="absolute left-6 xl:left-16 top-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="w-[72px] h-[72px] animate-float-1 filter drop-shadow-md">
              <path d="M50 20 C50 8, 30 8, 16 16 C6 22, 4 36, 12 46 C18 54, 30 58, 42 54 C48 52, 54 44, 52 36 C50 30, 60 28, 50 20 Z" fill="#E8D1B3" stroke="#C4A482" stroke-width="2"/>
              <ellipse cx="20" cy="40" rx="3" ry="5" fill="#FAF6F0" stroke="#C4A482" stroke-width="1"/>
              <circle cx="28" cy="20" r="4" fill="#F43F5E"/>
              <circle cx="40" cy="22" r="4" fill="#3B82F6"/>
              <circle cx="44" cy="34" r="4" fill="#A855F7"/>
              <circle cx="34" cy="46" r="4" fill="#10B981"/>
            </svg>
          </div>
          <!-- Leaf SVG -->
          <div class="absolute left-16 xl:left-36 top-28">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="w-14 h-14 text-emerald-600/80 animate-float-2 filter drop-shadow-md">
              <path d="M12 52 C 24 44, 40 40, 52 12 C 40 28, 30 32, 12 52 Z" fill="currentColor"/>
              <path d="M22 42 C 16 34, 18 28, 20 26 C 22 28, 24 34, 22 42 Z" fill="currentColor" opacity="0.85"/>
              <path d="M30 34 C 26 24, 30 18, 32 16 C 34 18, 34 26, 30 34 Z" fill="currentColor" opacity="0.85"/>
              <path d="M38 26 C 36 18, 40 12, 42 10 C 44 12, 42 20, 38 26 Z" fill="currentColor" opacity="0.85"/>
              <path d="M28 45 C 34 38, 40 38, 42 40 C 40 42, 34 44, 28 45 Z" fill="currentColor" opacity="0.85"/>
              <path d="M36 37 C 42 30, 48 30, 50 32 C 48 34, 42 36, 36 37 Z" fill="currentColor" opacity="0.85"/>
            </svg>
          </div>
          <!-- Sparkle 1 -->
          <div class="absolute left-32 xl:left-60 top-16">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-yellow-400/70 animate-pulse">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Right Side Floating Craft Materials -->
        <div class="hidden lg:block pointer-events-none">
          <!-- Daisy Flower SVG -->
          <div class="absolute right-6 xl:right-16 top-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="w-[72px] h-[72px] animate-float-3 filter drop-shadow-md">
              <g fill="#FFF5E6" stroke="#E6D3B8" stroke-width="1.5">
                <ellipse cx="32" cy="18" rx="5" ry="12"/>
                <ellipse cx="32" cy="46" rx="5" ry="12"/>
                <ellipse cx="18" cy="32" rx="12" ry="5"/>
                <ellipse cx="46" cy="32" rx="12" ry="5"/>
                <g transform="rotate(45 32 32)">
                  <ellipse cx="32" cy="18" rx="5" ry="12"/>
                  <ellipse cx="32" cy="46" rx="5" ry="12"/>
                  <ellipse cx="18" cy="32" rx="12" ry="5"/>
                  <ellipse cx="46" cy="32" rx="12" ry="5"/>
                </g>
              </g>
              <circle cx="32" cy="32" r="7" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
            </svg>
          </div>
          <!-- Chocolate Truffle SVG -->
          <div class="absolute right-20 xl:right-40 top-[104px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="w-[60px] h-[60px] animate-float-4 filter drop-shadow-md">
              <path d="M12 32 C12 20, 24 16, 32 16 C40 16, 52 20, 52 32 C52 44, 40 48, 32 48 C24 48, 12 44, 12 32 Z" fill="#653B19" stroke="#48240A" stroke-width="2"/>
              <path d="M20 28 Q 28 20, 36 28 T 52 28" fill="none" stroke="#D97706" stroke-width="2.5" stroke-linecap="round"/>
              <polygon points="28,34 30,38 34,38 31,40 32,44 28,42 24,44 25,40 22,38 26,38" fill="#FBBF24"/>
            </svg>
          </div>
          <!-- Liquid Resin SVG -->
          <div class="absolute right-12 xl:right-28 top-16">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="w-11 h-11 animate-float-1 filter drop-shadow-md">
              <path d="M32 8 C32 8, 48 28, 48 40 C48 48, 40 56, 32 56 C24 56, 16 48, 16 40 C16 28, 32 8, 32 8 Z" fill="#60A5FA" fill-opacity="0.5" stroke="#3B82F6" stroke-width="1.5"/>
              <path d="M26 36 C24 36, 22 32, 24 26" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <!-- Sparkle 2 -->
          <div class="absolute right-36 xl:right-60 top-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 text-yellow-400/70 animate-pulse">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center mb-10 sm:mb-14">
          <div class="max-w-2xl reveal-soft">
            <span class="text-xs uppercase tracking-widest font-semibold text-rose-500 bg-white/80 border border-rose-100 px-3 py-1 rounded-full">Handmade in Bangalore</span>
            <h1 class="font-serif text-4xl sm:text-6xl font-bold text-stone-850 mt-5 leading-[0.95]">Gifts that feel personal before they are opened</h1>
            <p class="text-sm sm:text-lg text-stone-700 mt-5 leading-relaxed">KraftedLove creates heartfelt decor, keepsakes, custom hangings, painted glass, resin art, and chocolates for homes and celebrations with a little more soul.</p>
            <div class="mt-7 flex flex-col sm:flex-row gap-3">
              <button @click="exploreShop" class="py-3 px-7 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-full shadow-lg shadow-rose-500/20 active:scale-95 transition-all">Explore the Shop</button>
              <button @click="setView('about')" class="py-3 px-7 bg-white hover:bg-stone-50 text-stone-850 text-sm font-bold rounded-full border border-stone-150 active:scale-95 transition-all">Meet the Maker</button>
            </div>
          </div>

          <div class="relative h-[360px] sm:h-[460px] reveal-soft reveal-delay-1">
            <img src="/assets/images/pressed-flower-frame.png" alt="Pressed floral frame" class="absolute left-0 top-6 w-[52%] h-[70%] rounded-2xl object-cover shadow-2xl shadow-stone-900/10 rotate-[-2deg] hero-float-slow" />
            <img src="/assets/images/wedding-kalire.png" alt="Custom wedding hangings" class="absolute right-0 top-0 w-[48%] h-[56%] rounded-2xl object-cover shadow-xl shadow-rose-900/10 rotate-[2deg] hero-float-medium" />
            <img src="/assets/images/ocean-resin-table.png" alt="Ocean resin table" class="absolute right-[8%] bottom-0 w-[55%] h-[46%] rounded-2xl object-cover shadow-2xl shadow-indigo-900/10 hero-float-slow" />
            <div class="absolute left-[10%] bottom-8 bg-white/90 backdrop-blur border border-white/70 rounded-2xl px-4 py-3 shadow-lg">
              <p class="text-[10px] uppercase tracking-widest font-bold text-rose-500">Custom orders</p>
              <p class="text-sm font-bold text-stone-850 mt-0.5">Dreamed by you, crafted by us.</p>
            </div>
          </div>
        </div>

        <!-- Staggered Panel Container -->
        <div class="flex flex-col md:flex-row gap-4 h-[560px] md:h-[360px] w-full reveal-soft reveal-delay-2">
          
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
              <p class="text-xs sm:text-sm text-stone-200 line-clamp-2 md:opacity-0 md:group-hover:opacity-100 md:max-h-0 md:group-hover:max-h-16 transition-all duration-500 ease-in-out overflow-hidden">
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
              <p class="text-xs sm:text-sm text-stone-200 line-clamp-2 md:opacity-0 md:group-hover:opacity-100 md:max-h-0 md:group-hover:max-h-16 transition-all duration-500 ease-in-out overflow-hidden">
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
              <p class="text-xs sm:text-sm text-stone-200 line-clamp-2 md:opacity-0 md:group-hover:opacity-100 md:max-h-0 md:group-hover:max-h-16 transition-all duration-500 ease-in-out overflow-hidden">
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
              <p class="text-xs sm:text-sm text-stone-200 line-clamp-2 md:opacity-0 md:group-hover:opacity-100 md:max-h-0 md:group-hover:max-h-16 transition-all duration-500 ease-in-out overflow-hidden">
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
    <section class="max-w-none px-4 sm:px-6 lg:px-12 xl:px-16 py-4 reveal-soft">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <!-- Image grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-4">
            <img src="/assets/images/pressed-flower-frame.png" class="rounded-2xl shadow-md w-full h-48 sm:h-64 object-cover object-center hover-lift" alt="Pressed Flower Frame detail" />
            <img src="/assets/images/lotus-resin-tray.png" class="rounded-2xl shadow-md w-full h-36 object-cover object-center hover-lift" alt="Lotus Tray detail" />
          </div>
          <div class="space-y-4 pt-8">
            <img src="/assets/images/buddha-bottle.png" class="rounded-2xl shadow-md w-full h-36 object-cover object-center hover-lift" alt="Painted Buddha Bottle detail" />
            <img src="/assets/images/gourmet-chocolate-bark.jpg" class="rounded-2xl shadow-md w-full h-48 sm:h-64 object-cover object-center hover-lift" alt="Artisanal Chocolate detail" />
          </div>
        </div>

        <!-- Text block -->
        <div class="space-y-5 sm:space-y-6">
          <span class="text-xs uppercase tracking-widest font-semibold text-rose-500">Made by hand, with intention</span>
          <h2 class="font-serif text-3xl sm:text-4xl font-bold text-stone-850 leading-tight">Every Creation Tells an Artisanal Story</h2>
          <p class="text-stone-700 text-sm sm:text-base leading-relaxed">
            At KraftedLove, we believe that the objects in your home should carry warmth, intent, and human touch. We gather raw elements—glass, organic flower petals, premium cacao, and resin—and mold them into objects of beauty.
          </p>
          <p class="text-stone-700 text-sm sm:text-base leading-relaxed">
            Our small-batch production process ensures that no two items are exactly alike. When you purchase a piece of Lippan art, a painted vase, or a box of gold-dusted truffles, you are bringing home hours of meticulous craft, artistic dedication, and a piece of the artisan's soul.
          </p>
          <div class="pt-2">
            <button @click="setView('about')" class="py-3 px-8 bg-stone-900 text-white text-sm font-semibold rounded-full hover:bg-stone-800 transition-colors shadow-md active:scale-95 shadow-stone-900/10">Read Our Story</button>
          </div>
        </div>

      </div>
    </section>

    <!-- BRAND SHOWCASE -->
    <section class="bg-[#FBF7F2]/80 py-16 reveal-soft">
      <div class="max-w-none px-4 sm:px-6 lg:px-12 xl:px-16">
        <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span class="text-xs uppercase tracking-widest font-semibold text-rose-500">Made to Be Remembered</span>
            <h2 class="font-serif text-3xl font-bold text-stone-850 mt-1">A Little Love for Every Occasion</h2>
          </div>
          <button @click="setView('shop')" class="text-sm font-semibold text-rose-500 hover:text-rose-650 flex items-center gap-1">
            Browse Collections
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
          </button>
        </div>

        <!-- Editorial Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="feature in brandFeatures" 
            :key="feature.title" 
            class="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-stone-200/60 transition-all duration-500 flex flex-col"
          >
            <div class="aspect-[4/5] bg-[#FBF7F2] overflow-hidden relative">
              <img :src="feature.image" :alt="feature.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <span class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-stone-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                {{ feature.tag }}
              </span>
              <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p class="text-xs font-semibold uppercase tracking-widest text-rose-200">{{ feature.mood }}</p>
                <h3 class="font-serif text-2xl font-bold leading-tight mt-1">{{ feature.title }}</h3>
              </div>
            </div>

            <div class="p-5 space-y-4">
              <p class="text-sm text-stone-700 leading-relaxed">{{ feature.copy }}</p>
              <button 
                @click="exploreCategory(feature.category)"
                class="text-sm font-semibold text-rose-500 hover:text-rose-650 inline-flex items-center gap-1"
              >
                Explore {{ feature.category }}
                <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            v-for="promise in brandPromises" 
            :key="promise.title"
            class="rounded-2xl border border-stone-100 bg-white/75 px-5 py-4 hover:bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
          >
            <p class="text-[10px] font-bold uppercase tracking-widest text-rose-500">{{ promise.label }}</p>
            <h3 class="mt-2 text-sm font-bold text-stone-850">{{ promise.title }}</h3>
            <p class="mt-1 text-xs text-stone-600 leading-relaxed">{{ promise.copy }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CUSTOMER TESTIMONIALS -->
    <section class="max-w-none px-4 sm:px-6 lg:px-12 xl:px-16 py-4 reveal-soft">
      <div class="text-center max-w-xl mx-auto mb-12">
        <span class="text-xs uppercase tracking-widest font-semibold text-rose-500">Love Letters</span>
        <h2 class="font-serif text-3xl font-bold text-stone-855 mt-1">What Our Friends Say</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Testimonial 1 -->
        <div class="p-6 sm:p-8 bg-white/65 rounded-2xl border border-stone-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative">
          <span class="absolute top-6 right-8 text-rose-100 font-serif text-7xl select-none">“</span>
          <div class="space-y-4">
            <p class="text-sm sm:text-base text-stone-700 italic leading-relaxed relative z-10">
              "I ordered the Ocean Wave Resin Table for my apartment in Bandra, and it is the crown jewel of my living room! The detailed waves, real sand, and shells are so beautiful. Excellent craftsmanship."
            </p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">SS</div>
              <div>
                <h4 class="font-semibold text-stone-800 text-sm">Sneha S.</h4>
                <p class="text-xs text-stone-700">Mumbai, MH</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Testimonial 2 -->
        <div class="p-6 sm:p-8 bg-white/65 rounded-2xl border border-stone-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative">
          <span class="absolute top-6 right-8 text-rose-100 font-serif text-7xl select-none">“</span>
          <div class="space-y-4">
            <p class="text-sm sm:text-base text-stone-700 italic leading-relaxed relative z-10">
              "The Handcrafted Bridal Kalire was so beautifully customized with my initials! I got so many compliments on my wedding day here in Ahmedabad. They look incredibly premium and vibrantly colorful."
            </p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-pink-100 text-pink-650 flex items-center justify-center font-bold text-sm">PR</div>
              <div>
                <h4 class="font-semibold text-stone-800 text-sm">Pooja R.</h4>
                <p class="text-xs text-stone-700">Ahmedabad, GJ</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Testimonial 3 -->
        <div class="p-6 sm:p-8 bg-white/65 rounded-2xl border border-stone-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative">
          <span class="absolute top-6 right-8 text-rose-100 font-serif text-7xl select-none">“</span>
          <div class="space-y-4">
            <p class="text-sm sm:text-base text-stone-700 italic leading-relaxed relative z-10">
              "Decadent single-origin truffles! The gold dust is such a luxurious touch. I gifted a box of truffles and a hand-painted glass bottle to my mother, and she was in tears of joy."
            </p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-650 flex items-center justify-center font-bold text-sm">VD</div>
              <div>
                <h4 class="font-semibold text-stone-800 text-sm">Vikram D.</h4>
                <p class="text-xs text-stone-700">Bangalore, KA</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- END CTA BANNER -->
    <section class="max-w-none px-4 sm:px-6 lg:px-12 xl:px-16 pt-6 reveal-soft">
      <div class="bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl shadow-rose-900/10 relative overflow-hidden">
        
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
  data() {
    return {
      brandFeatures: [
        {
          tag: 'Wedding Gifts',
          mood: 'For keepsake moments',
          title: 'Memories Made Tangible',
          category: 'Frames',
          image: '/assets/images/pressed-flower-frame.png',
          copy: 'Personal frames, floral details, and mirror work made to hold the moments people never want to forget.'
        },
        {
          tag: 'Home Decor',
          mood: 'For warm corners',
          title: 'Color for Everyday Spaces',
          category: 'Glass Art',
          image: '/assets/images/bottle-collection.png',
          copy: 'Painted bottles, textured finishes, and small handcrafted accents that make a room feel personal.'
        },
        {
          tag: 'Sweet Gifting',
          mood: 'For thoughtful surprises',
          title: 'Little Luxuries to Share',
          category: 'Chocolates',
          image: '/assets/images/gourmet-chocolate-bark.jpg',
          copy: 'Small-batch chocolates for celebrations, thank-yous, festive boxes, and soft everyday indulgence.'
        }
      ],
      brandPromises: [
        {
          label: 'Small Batch',
          title: 'Made Slowly',
          copy: 'Every piece is crafted in limited quantities with patient hands and careful finishing.'
        },
        {
          label: 'Personal',
          title: 'Custom Friendly',
          copy: 'Names, colors, occasions, and little details can shape many KraftedLove pieces.'
        },
        {
          label: 'Gift Ready',
          title: 'Thoughtful Packaging',
          copy: 'Designed to feel special from the first look to the final place in someone’s home.'
        },
        {
          label: 'Local Craft',
          title: 'Rooted in Bangalore',
          copy: 'A homegrown creative studio building warmth through handmade decor and gifting.'
        }
      ]
    };
  },
  methods: {
    exploreCategory(category) {
      this.setCategoryFilter(category);
      this.setView('shop');
    },
    exploreShop() {
      this.setCategoryFilter('');
      this.setView('shop');
    }
  }
};
</script>

<style scoped>
@keyframes float-gentle-1 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(6deg); }
}
@keyframes float-gentle-2 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(12px) rotate(-8deg); }
}
@keyframes float-gentle-3 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(-4deg); }
}
@keyframes float-gentle-4 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(10px) rotate(8deg); }
}
.animate-float-1 { animation: float-gentle-1 5s ease-in-out infinite; }
.animate-float-2 { animation: float-gentle-2 6.5s ease-in-out infinite; }
.animate-float-3 { animation: float-gentle-3 5.8s ease-in-out infinite; }
.animate-float-4 { animation: float-gentle-4 7.2s ease-in-out infinite; }
</style>
