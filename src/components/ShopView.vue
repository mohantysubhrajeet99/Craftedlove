<template>
  <div class="max-w-none px-4 sm:px-6 lg:px-12 xl:px-16 py-8">
    
    <!-- Page Title -->
    <div class="border-b border-stone-150 pb-6 mb-8">
      <h1 class="font-serif text-3xl sm:text-4xl font-bold text-stone-850">Explore Catalog</h1>
      <p class="text-sm text-stone-700 mt-2">Discover handcrafted wonders, mirror arts, and premium chocolate box collections.</p>
    </div>

    <!-- Filters & Catalog Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- SIDEBAR FILTER CONTROLS -->
      <div class="space-y-6 lg:col-span-1">
        
        <!-- Search box -->
        <div class="bg-stone-50 border border-stone-100 rounded-2xl p-5 space-y-2.5">
          <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500">Search Products</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search by name, tags..." 
              class="pl-9 w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-450 transition-all"
            />
          </div>
        </div>

        <!-- Categories List -->
        <div class="bg-stone-50 border border-stone-100 rounded-2xl p-5 space-y-3">
          <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500">Categories</label>
          <div class="flex flex-wrap lg:flex-col gap-2">
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="selectCategory(cat)"
              class="px-4 py-2 text-left rounded-xl text-xs sm:text-sm font-medium transition-all"
              :class="((categoryFilter === '' && cat === 'All') || categoryFilter === cat) 
                ? 'bg-gradient-to-r from-rose-500 to-pink-650 text-white shadow-sm shadow-rose-500/10' 
                : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-100'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Sort and Availability -->
        <div class="bg-stone-50 border border-stone-100 rounded-2xl p-5 space-y-4">
          
          <!-- Sort dropdown -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500">Sort By</label>
            <select 
              v-model="selectedSort"
              class="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-450 transition-all cursor-pointer"
            >
              <option value="popular">Popularity & Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <!-- Availability toggle -->
          <div class="flex items-center space-x-2 pt-2 border-t border-stone-200/50">
            <input 
              type="checkbox" 
              id="availability" 
              v-model="hideOutOfStock" 
              class="rounded border-stone-300 text-rose-500 focus:ring-rose-500/20 w-4 h-4 cursor-pointer"
            />
            <label for="availability" class="text-xs sm:text-sm text-stone-600 cursor-pointer select-none">Hide Out of Stock</label>
          </div>

        </div>

      </div>

      <!-- PRODUCT GRID -->
      <div class="lg:col-span-3">
        
        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-20 bg-[#FBF7F2] rounded-2xl border border-stone-100 text-center">
          <svg class="w-12 h-12 text-stone-600 mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25m-2.25-2.25l-2.25 2.25m2.25-2.25l2.25-2.25M3.75 7.5h16.5M9 3.75h6m-6 3a3 3 0 016 0M4 7.5L3 5.5a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 5.5l-1 2"/></svg>
          <h3 class="font-bold text-stone-700 text-lg">No products found</h3>
          <p class="text-sm text-stone-700 mt-1 px-8">Try adjusting your filters or searching for something else.</p>
          <button @click="searchQuery = ''; selectCategory('All'); hideOutOfStock = false;" class="mt-4 px-5 py-2 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-stone-850 transition-colors">Clear All Filters</button>
        </div>

        <!-- Product Card Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            class="group bg-white border border-stone-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-stone-250 transition-all duration-300 flex flex-col justify-between"
          >
            
            <!-- Thumbnail -->
            <div class="aspect-square bg-[#FBF7F2] overflow-hidden relative cursor-pointer" @click="openDetail(product)">
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              
              <!-- Category Badge -->
              <span class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-stone-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                {{ product.category }}
              </span>

              <!-- Out of Stock Overlay -->
              <div v-if="product.inventory <= 0" class="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center">
                <span class="bg-white text-rose-500 border border-rose-100 font-bold uppercase text-[11px] tracking-widest px-4 py-2 rounded-full shadow-md">
                  Out of Stock
                </span>
              </div>
              
              <!-- Low Stock Alert -->
              <div v-else-if="product.inventory <= 3" class="absolute top-4 right-4">
                <span class="bg-rose-50 border border-rose-100 text-rose-500 font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                  Only {{ product.inventory }} Left
                </span>
              </div>
            </div>

            <!-- Product Details -->
            <div class="p-5 flex-grow flex flex-col justify-between">
              
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-stone-700 font-medium">{{ product.category }}</span>
                  <!-- Stars -->
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 fill-current text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span class="text-xs font-bold text-stone-600">{{ product.rating }}</span>
                  </div>
                </div>
                <h3 @click="openDetail(product)" class="font-serif text-base sm:text-lg font-bold text-stone-800 line-clamp-1 hover:text-rose-500 transition-colors cursor-pointer leading-tight">
                  {{ product.name }}
                </h3>
                <p class="text-xs text-stone-700 line-clamp-2 leading-relaxed">
                  {{ product.description }}
                </p>
              </div>

              <div class="flex items-center justify-between pt-4 mt-4 border-t border-stone-50">
                <span class="text-lg font-bold text-stone-850 font-sans">₹<span>{{ product.price }}</span></span>
                <button 
                  v-if="product.inventory > 0"
                  @click="addToCart(product)"
                  class="py-2 px-4 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-full active:scale-95 transition-all flex items-center gap-1 shadow-sm shadow-rose-500/5 hover:shadow-md"
                >
                  Add to Bag
                </button>
                <button 
                  v-else
                  disabled
                  class="py-2 px-4 bg-stone-100 text-stone-700 text-xs font-semibold rounded-full cursor-not-allowed"
                >
                  Unavailable
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>    <!-- PRODUCT DETAIL MODAL -->
    <teleport to="body">
      <div v-if="selectedProduct" class="fixed inset-0 bg-black/45 backdrop-blur-sm z-[70] flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" @click.self="closeDetail">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative animate-slideUp">
          
          <!-- Close Modal -->
          <button @click="closeDetail" class="absolute top-5 right-5 text-stone-700 hover:text-stone-600 p-2 rounded-full bg-[#FBF7F2]/80 backdrop-blur-sm hover:bg-stone-50 transition-colors z-10 border border-stone-100 shadow-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6l12 12"/></svg>
          </button>

          <!-- Left: Interactive Image Gallery -->
          <div class="w-full md:w-1/2 bg-[#FBF7F2] flex flex-col justify-between p-4 space-y-4">
            <!-- Active Image View -->
            <div class="flex-grow rounded-2xl overflow-hidden relative bg-stone-100 min-h-[250px] md:min-h-[380px] h-[300px] md:h-auto">
              <img 
                :src="selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[activeImageIdx] : selectedProduct.image" 
                :alt="selectedProduct.name" 
                class="w-full h-full object-cover" 
              />
              <span class="absolute bottom-4 left-4 bg-stone-900/95 text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                {{ selectedProduct.category }}
              </span>
            </div>
            
            <!-- Gallery Thumbnails Row (if multiple images exist) -->
            <div 
              v-if="selectedProduct.images && selectedProduct.images.length > 1" 
              class="flex gap-2 overflow-x-auto pb-1 flex-shrink-0"
            >
              <button
                v-for="(img, idx) in selectedProduct.images"
                :key="idx"
                @click="activeImageIdx = idx"
                class="w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 relative focus:outline-none transition-all active:scale-95"
                :class="activeImageIdx === idx ? 'border-rose-500 shadow-md scale-95' : 'border-stone-200/60 opacity-70 hover:opacity-100'"
              >
                <img :src="img" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Right: Details, Reviews Form -->
          <div class="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between h-[450px] md:h-[600px] space-y-6">
            
            <div class="space-y-4">
              <!-- Category and Rating -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-rose-500 font-semibold uppercase tracking-wider text-xs">{{ selectedProduct.category }}</span>
                <div class="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full font-bold">
                  <svg class="w-4 h-4 fill-current text-amber-500" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <span>{{ selectedProduct.rating }}</span>
                  <span class="text-stone-700 font-normal text-xs">({{ selectedProduct.reviews ? selectedProduct.reviews.length : 0 }} reviews)</span>
                </div>
              </div>

              <!-- Name & Price -->
              <div class="space-y-1">
                <h2 class="font-serif text-2xl font-bold text-stone-855 leading-tight">{{ selectedProduct.name }}</h2>
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-stone-855 font-sans">₹<span>{{ selectedProduct.price }}</span></span>
                </div>
              </div>

              <!-- Inventory stock message -->
              <div class="py-1">
                <span v-if="selectedProduct.inventory <= 0" class="text-sm text-red-500 font-bold flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-red-500"></span>
                  Out of Stock
                </span>
                <span v-else-if="selectedProduct.inventory <= 3" class="text-sm text-rose-500 font-bold flex items-center gap-1.5 bg-rose-50 px-3 py-1 rounded-lg w-max">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  Low Stock: Only {{ selectedProduct.inventory }} items remaining!
                </span>
                <span v-else class="text-sm text-green-600 font-medium flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-green-500"></span>
                  In Stock ({{ selectedProduct.inventory }} available)
                </span>
              </div>

              <!-- Description -->
              <p class="text-sm text-stone-700 leading-relaxed">{{ selectedProduct.description }}</p>

              <!-- Purchase Quantity Selector -->
              <div v-if="selectedProduct.inventory > 0" class="flex items-center gap-4 pt-2">
                <span class="text-sm font-semibold text-stone-600">Quantity</span>
                <div class="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-[#FBF7F2]">
                  <button 
                    @click="modalQuantity = Math.max(1, modalQuantity - 1)" 
                    class="px-3.5 py-1.5 text-stone-700 hover:text-stone-700 hover:bg-stone-100 transition-colors font-semibold"
                  >-</button>
                  <span class="px-4 font-bold text-stone-750 min-w-[24px] text-center">{{ modalQuantity }}</span>
                  <button 
                    @click="modalQuantity = Math.min(selectedProduct.inventory, modalQuantity + 1)" 
                    class="px-3.5 py-1.5 text-stone-700 hover:text-stone-700 hover:bg-stone-100 transition-colors font-semibold"
                  >+</button>
                </div>
              </div>
            </div>

            <!-- Modal Action Buttons -->
            <div class="pt-4 border-t border-stone-100">
              <button 
                v-if="selectedProduct.inventory > 0"
                @click="handleModalAddToCart" 
                class="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-650 text-white font-semibold rounded-xl hover:shadow-lg shadow-rose-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                Add {{ modalQuantity }} to Bag — ₹<span>{{ (selectedProduct.price * modalQuantity).toFixed(2) }}</span>
              </button>
              <button 
                v-else
                disabled
                class="w-full py-3.5 bg-stone-100 text-stone-700 font-semibold rounded-xl cursor-not-allowed"
              >
                Out of Stock
              </button>
            </div>

            <!-- REVIEWS SECTION -->
            <div class="pt-6 border-t border-stone-100 space-y-4">
              <h3 class="font-serif text-lg font-bold text-stone-850">Customer Reviews</h3>
              
              <!-- Review Write Form -->
              <div class="bg-stone-50 border border-stone-100 rounded-2xl p-4 space-y-3.5">
                <h4 class="font-semibold text-xs uppercase tracking-wider text-stone-500">Write a Review</h4>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <!-- Reviewer Name -->
                  <div class="space-y-1">
                    <input 
                      type="text" 
                      v-model="reviewUser" 
                      placeholder="Your Name" 
                      class="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10"
                      :disabled="!!store.currentUser"
                    />
                  </div>

                  <!-- Stars Selector -->
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-stone-700 font-medium">Rating:</span>
                    <select 
                      v-model="reviewRating"
                      class="px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-stone-700 text-xs focus:outline-none cursor-pointer"
                    >
                      <option :value="5">⭐⭐⭐⭐⭐ (5)</option>
                      <option :value="4">⭐⭐⭐⭐ (4)</option>
                      <option :value="3">⭐⭐⭐ (3)</option>
                      <option :value="2">⭐⭐ (2)</option>
                      <option :value="1">⭐ (1)</option>
                    </select>
                  </div>
                </div>

                <!-- Review Content -->
                <div class="space-y-1">
                  <textarea 
                    rows="2"
                    v-model="reviewComment"
                    placeholder="Share your thoughts about this handmade creation..."
                    class="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-450 resize-none"
                  ></textarea>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-xs text-red-500 font-medium">{{ reviewError }}</span>
                  <button 
                    @click="submitReview"
                    class="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-full active:scale-95 transition-all shadow-sm"
                  >
                    Submit Review
                  </button>
                </div>
              </div>

              <!-- Reviews list -->
              <div v-if="!selectedProduct.reviews || selectedProduct.reviews.length === 0" class="text-center text-xs text-stone-700 py-4">
                No reviews yet. Be the first to share your thoughts!
              </div>
              <div v-else class="space-y-3.5">
                <div v-for="(review, index) in selectedProduct.reviews" :key="index" class="border-b border-stone-50 pb-3 last:border-b-0 space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-stone-700">{{ review.user }}</span>
                    <span class="text-stone-700">{{ review.date }}</span>
                  </div>
                  <!-- Stars -->
                  <div class="flex text-amber-400">
                    <svg v-for="s in review.rating" :key="s" class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                  <p class="text-xs sm:text-sm text-stone-500 leading-relaxed">{{ review.comment }}</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { store } from '../store.js';

export default {
  name: 'ShopView',
  props: {
    categoryFilter: {
      type: String,
      required: true
    },
    setCategoryFilter: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      searchQuery: '',
      selectedSort: 'popular',
      hideOutOfStock: false,
      selectedProduct: null,
      modalQuantity: 1,
      activeImageIdx: 0,
      reviewUser: '',
      reviewRating: 5,
      reviewComment: '',
      reviewError: ''
    };
  },
  computed: {
    store() {
      return store;
    },
    categories() {
      return ['All', 'Resin Art', 'Glass Art', 'Frames', 'Accessories', 'Chocolates'];
    },
    filteredProducts() {
      let result = [...this.store.products];

      if (this.categoryFilter && this.categoryFilter !== 'All') {
        result = result.filter(p => p.category === this.categoryFilter);
      }

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }

      if (this.hideOutOfStock) {
        result = result.filter(p => p.inventory > 0);
      }

      if (this.selectedSort === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (this.selectedSort === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      } else if (this.selectedSort === 'popular') {
        result.sort((a, b) => b.rating - a.rating);
      }

      return result;
    }
  },
  methods: {
    selectCategory(cat) {
      this.setCategoryFilter(cat === 'All' ? '' : cat);
    },
    openDetail(product) {
      this.selectedProduct = product;
      this.modalQuantity = 1;
      this.activeImageIdx = 0;
      this.reviewUser = this.store.currentUser ? this.store.currentUser.name : '';
      this.reviewRating = 5;
      this.reviewComment = '';
      this.reviewError = '';
    },
    closeDetail() {
      this.selectedProduct = null;
    },
    addToCart(product, quantity = 1) {
      this.store.addToCart(product, quantity);
    },
    handleModalAddToCart() {
      this.addToCart(this.selectedProduct, this.modalQuantity);
      this.closeDetail();
    },
    async submitReview() {
      if (!this.reviewUser.trim() || !this.reviewComment.trim()) {
        this.reviewError = 'Please fill out your name and review comment.';
        return;
      }
      
      const newReview = {
        user: this.reviewUser.trim(),
        rating: parseInt(this.reviewRating),
        comment: this.reviewComment.trim(),
        date: new Date().toISOString().split('T')[0]
      };

      try {
        const res = await fetch(`/api/products/${this.selectedProduct.id}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReview)
        });
        if (res.ok) {
          const updatedProduct = await res.json();
          const index = this.store.products.findIndex(p => p.id === this.selectedProduct.id);
          if (index !== -1) {
            this.store.products[index] = updatedProduct;
          }
          this.selectedProduct = updatedProduct;
          
          this.store.addToast('Thank you! Your review has been submitted.', 'success');
          this.reviewComment = '';
          if (!this.store.currentUser) {
            this.reviewUser = '';
          }
          this.reviewError = '';
        }
      } catch (e) {
        this.reviewError = 'Failed to submit review to server.';
      }
    }
  }
};
</script>
