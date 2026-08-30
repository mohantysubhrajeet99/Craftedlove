<template>
  <div class="max-w-none px-4 sm:px-6 lg:px-12 xl:px-16 py-8 space-y-16 pb-16">
    
    <!-- Page Header -->
    <div class="border-b border-stone-150 pb-6 text-center max-w-2xl mx-auto">
      <span class="text-xs uppercase tracking-widest font-semibold text-rose-500 bg-rose-50 px-3 py-1 rounded-full">Our Story</span>
      <h1 class="font-serif text-3xl sm:text-4xl font-bold text-stone-850 mt-3">About KraftedLove</h1>
      <p class="text-base font-serif italic text-stone-500 mt-2">"Dreamed by you, crafted by me. ❤️"</p>
    </div>

    <!-- Hero Section -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Text Content -->
      <div class="space-y-6 text-sm sm:text-base">
        <p class="text-stone-700 font-medium leading-relaxed">
          KraftedLove is a little space born from a big love for creativity, thoughtful gifting, and handmade memories.
        </p>
        <p class="text-stone-500 leading-relaxed">
          Founded by <strong>Sonali Dhupal</strong>, a Team Lead at an MNC with Karma Group Operations in Bangalore, KraftedLove began as a passion for turning simple ideas into beautiful, heartfelt creations.
        </p>
        <p class="text-stone-500 leading-relaxed">
          From handcrafted gifts and resin art to beautifully crafted chocolates and personalised surprises, every creation is made with patience, creativity, and a whole lot of love. ✨
        </p>
        <blockquote class="border-l-4 border-rose-500 pl-4 italic text-stone-600 py-2 bg-[#FBF7F2] rounded-r-xl pr-4">
          "We believe that a gift isn’t just something you give — it’s a feeling, a memory, and a little piece of your heart."
        </blockquote>
      </div>

      <!-- Founder & Artwork card -->
      <div class="bg-stone-50 border border-stone-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
        <div class="rounded-2xl overflow-hidden h-64 bg-stone-100">
          <img src="/assets/images/bottle-collection.png" alt="KraftedLove Art Collection" class="w-full h-full object-cover" />
        </div>
        <div class="space-y-2">
          <p class="text-stone-700 text-xs font-semibold uppercase tracking-widest">A Message from the Maker</p>
          <p class="text-stone-600 text-sm italic leading-relaxed">
            "Thank you for supporting handmade creativity and being a part of the KraftedLove journey."
          </p>
          <div class="pt-2 border-t border-stone-200/60 flex items-center justify-between">
            <div>
              <p class="font-serif font-bold text-stone-800 text-base">Sonali Dhupal</p>
              <p class="text-xs text-stone-700 font-semibold tracking-wider uppercase">Founder, KraftedLove</p>
            </div>
            <span class="text-rose-500 text-xl font-serif">❤️</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Custom Commissions Callout -->
    <section class="bg-gradient-to-br from-rose-50 to-stone-50 border border-rose-100/50 rounded-3xl p-8 sm:p-10 text-center space-y-6 max-w-4xl mx-auto shadow-sm">
      <div class="max-w-xl mx-auto space-y-3">
        <span class="text-xs uppercase tracking-widest font-bold text-rose-500">Custom Orders</span>
        <h2 class="font-serif text-2xl font-bold text-stone-850">Have an idea in mind?</h2>
        <p class="text-stone-500 text-sm leading-relaxed">
          Tell us what you’re dreaming of, and we’ll do our best to craft it just for you.
        </p>
      </div>

      <div class="py-2.5 max-w-md mx-auto border-y border-stone-200/50">
        <p class="font-serif italic text-rose-600 text-base font-bold">
          "Your thought. Your feeling. Your dream.<br />We craft it with love. ❤️"
        </p>
      </div>

      <div class="pt-2">
        <button @click="setView('shop')" class="py-3 px-8 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-full active:scale-95 transition-colors shadow-md shadow-rose-500/10">
          Browse Our Creations
        </button>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'AboutView',
  props: {
    setView: {
      type: Function,
      required: true
    }
  }
};
</script>
