<template>
  <div>
    <!-- INTRO MERGE ANIMATION OVERLAY -->
    <div 
      v-if="showIntro" 
      class="fixed inset-0 bg-[#0c0f16] z-[100] flex flex-col items-center justify-center overflow-hidden" 
      :class="{'animate-[screenFadeOut_0.8s_ease-in-out_forwards]': triggerFadeOut}"
    >
      <!-- Particle Rendering Canvas -->
      <canvas ref="introCanvas" class="absolute inset-0 w-full h-full pointer-events-none"></canvas>

      <!-- Brand Welcome Text (Appears when particles fully form the bottle) -->
      <div 
        v-if="showText" 
        class="absolute bottom-24 text-center space-y-1.5 animate-[textFadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]"
      >
        <h2 class="font-serif text-3xl font-bold bg-gradient-to-r from-rose-400 via-pink-500 to-blue-400 bg-clip-text text-transparent">KraftedLove</h2>
        <p class="text-xs text-stone-400 font-semibold tracking-widest uppercase">Handcrafted with Heart</p>
      </div>

      <!-- Skip Button -->
      <button 
        @click="skipIntro" 
        class="absolute bottom-8 text-xs font-semibold text-stone-450 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all active:scale-95"
      >
        Skip Intro
      </button>
    </div>

    <!-- Main Website Shell -->
    <div class="min-h-screen flex flex-col font-sans select-none relative" style="background-color: #FBF7F2;">
      <!-- Fixed background particle canvas -->
      <canvas ref="bgCanvas" class="fixed inset-0 w-full h-full pointer-events-none z-0"></canvas>
    
    <!-- NAVBAR -->
    <Navbar 
      :setView="setView" 
      :currentView="currentView"
      :openAuth="openAuth"
      :openCheckout="openCheckout"
    />

    <!-- TOAST ALERTS BANNER -->
    <div class="fixed top-24 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <div 
        v-for="toast in store.toasts" 
        :key="toast.id" 
        class="p-4 rounded-xl shadow-lg border text-sm font-semibold flex items-center justify-between pointer-events-auto animate-slideIn bg-white"
        :class="{
          'border-green-200 text-green-700 bg-green-50/95': toast.type === 'success',
          'border-red-200 text-red-700 bg-red-50/95': toast.type === 'error',
          'border-rose-200 text-rose-700 bg-rose-50/95': toast.type === 'warning',
          'border-stone-200 text-stone-750 bg-stone-50/95': toast.type === 'info',
        }"
      >
        <span class="flex-grow">{{ toast.message }}</span>
      </div>
    </div>

    <!-- MAIN ROUTED COMPONENT -->
    <main class="flex-grow animate-fadeIn relative z-10">
      <HomeView 
        v-if="currentView === 'home'" 
        :setView="setView"
        :setCategoryFilter="setCategoryFilter"
      />
      <ShopView 
        v-else-if="currentView === 'shop'"
        :categoryFilter="categoryFilter"
        :setCategoryFilter="setCategoryFilter"
      />
      <AboutView 
        v-else-if="currentView === 'about'"
        :setView="setView"
      />
      <DashboardView 
        v-else-if="currentView === 'dashboard'"
        :setView="setView"
      />
      <AdminDashboardView 
        v-else-if="currentView === 'admin'"
        :setView="setView"
      />
    </main>

    <!-- FOOTER -->
    <Footer :setView="setView" class="relative z-10" />

    <!-- AUTH MODAL -->
    <AuthModal 
      :isOpen="authModalOpen"
      :onClose="closeAuth"
    />

    <!-- SIMULATED CHECKOUT MODAL OVERLAY -->
    <div v-if="checkoutModalOpen" class="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" @click.self="closeCheckout">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 sm:p-8 relative overflow-hidden animate-slideUp max-h-[90vh] flex flex-col">
        
        <h2 class="font-serif text-2xl font-bold text-stone-850 border-b pb-4 mb-4">Complete Your Order</h2>
        
        <div class="overflow-y-auto flex-grow space-y-5 pr-1 text-sm">
          <!-- Shipping Fields -->
          <div class="space-y-3">
            <h3 class="font-serif font-bold text-stone-700 text-xs sm:text-sm uppercase tracking-wider text-rose-500">1. Shipping Address</h3>
            
            <div class="space-y-1">
              <label class="text-xs font-semibold text-stone-450 uppercase">Street Address</label>
              <input 
                type="text" 
                v-model="checkoutForm.address"
                placeholder="123 Creative Lane, Apt 4"
                class="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-400 focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-stone-450 uppercase">City</label>
                <input 
                  type="text" 
                  v-model="checkoutForm.city"
                  placeholder="Portland"
                  class="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-455 focus:outline-none"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-stone-450 uppercase">ZIP / Postal Code</label>
                <input 
                  type="text" 
                  v-model="checkoutForm.zip"
                  placeholder="97201"
                  class="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-455 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Payment Fields -->
          <div class="space-y-3 pt-2">
            <h3 class="font-serif font-bold text-stone-700 text-xs sm:text-sm uppercase tracking-wider text-rose-500">2. Mock Payment</h3>
            
            <div class="space-y-1">
              <label class="text-xs font-semibold text-stone-450 uppercase">Name on Card</label>
              <input 
                type="text" 
                v-model="checkoutForm.cardName"
                placeholder="Jane Doe"
                class="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-455 focus:outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-stone-450 uppercase">Card Number</label>
              <input 
                type="text" 
                v-model="checkoutForm.cardNumber"
                placeholder="4000 1234 5678 9010"
                class="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-455 focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-stone-450 uppercase">Expiry Date</label>
                <input 
                  type="text" 
                  v-model="checkoutForm.cardExpiry"
                  placeholder="MM/YY"
                  class="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-455 focus:outline-none"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-stone-450 uppercase">CVV</label>
                <input 
                  type="password" 
                  v-model="checkoutForm.cardCvv"
                  placeholder="•••"
                  maxlength="3"
                  class="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-455 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Error Banner -->
          <p v-if="checkoutError" class="text-xs text-red-500 font-semibold">{{ checkoutError }}</p>
        </div>

        <!-- Checkout footer total and action -->
        <div class="pt-4 border-t mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-stone-500 text-sm">
            <span>Grand Total: </span>
            <span class="text-lg font-bold text-rose-600 font-sans">₹<span>{{ (store.cartSubtotal + (store.cartSubtotal > 8000 ? 0 : 499) + parseFloat((store.cartSubtotal * 0.08).toFixed(2))).toFixed(2) }}</span></span>
          </div>
          
          <div class="flex gap-2.5 w-full sm:w-auto">
            <button 
              @click="closeCheckout" 
              :disabled="isCheckingOut"
              class="w-1/2 sm:w-28 py-2.5 border border-stone-255 text-stone-600 font-semibold rounded-xl hover:bg-stone-50 disabled:opacity-50 text-sm"
            >
              Back
            </button>
            <button 
              @click="submitCheckout"
              :disabled="isCheckingOut"
              class="w-1/2 sm:w-44 py-2.5 bg-gradient-to-r from-rose-500 to-pink-650 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 disabled:opacity-80 transition-all flex items-center justify-center gap-1.5 text-sm"
            >
              <!-- Spinner -->
              <svg v-if="isCheckingOut" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isCheckingOut ? 'Authorizing...' : 'Authorize Payment' }}</span>
            </button>
          </div>
        </div>

      </div>
    </div>


  </div>
</div>
</template>

<script>
import { store } from './store.js';

// Import our components
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import HomeView from './components/HomeView.vue';
import ShopView from './components/ShopView.vue';
import AboutView from './components/AboutView.vue';
import DashboardView from './components/DashboardView.vue';
import AdminDashboardView from './components/AdminDashboardView.vue';
import AuthModal from './components/AuthModal.vue';

// Background Particle Class Design
class BgParticle {
  constructor(canvasWidth, canvasHeight) {
    this.reset(canvasWidth, canvasHeight, true);
  }

  reset(width, height, initial = false) {
    this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? -30 : width + 30);
    this.y = Math.random() * height;
    
    this.depth = 0.4 + Math.random() * 1.1; // 0.4 to 1.5 depth scale
    this.size = (1.5 + Math.random() * 2.5) * this.depth;
    
    // Set base drift speed (vx) and bobbing speed (vy)
    const direction = Math.random() > 0.5 ? 1 : -1;
    this.vx = direction * (0.15 + Math.random() * 0.35) * this.depth;
    this.vy = (Math.random() - 0.5) * 0.2 * this.depth;
    
    // Choose types: 60% circle, 20% star, 20% petal
    const randType = Math.random();
    if (randType < 0.6) {
      this.type = 'circle';
    } else if (randType < 0.8) {
      this.type = 'star';
    } else {
      this.type = 'petal';
    }
    
    const colors = ['#f43f5e', '#db2777', '#4f46e5', '#60a5fa', '#fbbf24', '#f59e0b', '#ec4899', '#ffffff'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    
    // Soft opacity for background usage so it does not interfere with readability
    this.alpha = 0.12 + Math.random() * 0.28;
    
    this.noiseOffset = Math.random() * Math.PI * 2;
    this.noiseSpeed = 0.004 + Math.random() * 0.008;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;
  }

  update(width, height, mouse, time) {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    
    // Bobbing wave vertical drift
    this.y += Math.sin(time * this.noiseSpeed + this.noiseOffset) * 0.05 * this.depth;
    
    // Mouse avoidance calculation
    if (mouse.active && mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 180) {
        const force = (180 - dist) / 180;
        const angle = Math.atan2(dy, dx);
        
        // Push away with depth scaling
        const pushX = Math.cos(angle) * force * 3.0 * this.depth;
        const pushY = Math.sin(angle) * force * 3.0 * this.depth;
        
        this.x += pushX;
        this.y += pushY;
      }
    }
    
    // Out of bounds reset
    if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
      this.reset(width, height, false);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    
    if (this.type === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'star') {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size * 2);
      ctx.quadraticCurveTo(this.x, this.y, this.x + this.size * 2, this.y);
      ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + this.size * 2);
      ctx.quadraticCurveTo(this.x, this.y, this.x - this.size * 2, this.y);
      ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - this.size * 2);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'petal') {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 1.6, this.size * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// Particle Class Design for 3D Floating Particle Simulation
class Particle {
  constructor(target, width, height) {
    this.targetX = target.x;
    this.targetY = target.y;
    this.color = target.color;
    
    // Glass particles start on the left, colored paint particles start on the right
    if (this.color === '#93c5fd') {
      this.x = -Math.random() * 500 - 50;
    } else {
      this.x = width + Math.random() * 500 + 50;
    }
    
    this.y = Math.random() * height;
    
    this.vx = 0;
    this.vy = 0;
    
    // Depth scale (0.5 to 1.5) determines speed, size, and translucency
    this.depth = 0.5 + Math.random() * 1.0;
    this.size = (this.color === '#93c5fd' ? 1.4 : 2.2) * this.depth;
    
    // Bobbing/River wave coefficients
    this.noiseOffset = Math.random() * Math.PI * 2;
    this.noiseSpeed = 0.015 + Math.random() * 0.02;
    this.noiseAmp = 8 + Math.random() * 12;
    
    // Physics friction and easing
    this.friction = 0.94 - (this.depth * 0.015);
    this.speed = 0.035 + (this.depth * 0.025);
  }

  update(mode, time) {
    if (mode === 'drift') {
      // Float like a river stream
      const wave = Math.sin(time * this.noiseSpeed + this.noiseOffset) * this.noiseAmp * 0.15;
      const driftSpeed = 1.0 * this.depth;
      
      if (this.color === '#93c5fd') {
        this.vx += (driftSpeed - this.vx) * 0.05;
      } else {
        this.vx += (-driftSpeed - this.vx) * 0.05;
      }
      this.vy += (wave - this.vy) * 0.05;
      
      this.x += this.vx;
      this.y += this.vy;
    } else {
      // Assemble: Magnetic pull to targets
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      
      this.vx += dx * this.speed * 0.06;
      this.vy += dy * this.speed * 0.06;
      
      this.vx *= this.friction;
      this.vy *= this.friction;
      
      this.x += this.vx;
      this.y += this.vy;
      
      // Snapping threshold
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.0) {
        this.x = this.targetX;
        this.y = this.targetY;
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.35 + (this.depth * 0.5);
    ctx.fill();
  }
}

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    HomeView,
    ShopView,
    AboutView,
    DashboardView,
    AdminDashboardView,
    AuthModal
  },
  data() {
    return {
      showIntro: true,
      merged: false,
      showText: false,
      triggerFadeOut: false,
      timeouts: [],
      particles: [],
      animFrameId: null,
      animTime: 0,
      introMode: 'drift', // 'drift' or 'assemble'
      currentView: 'home',
      categoryFilter: '',
      authModalOpen: false,
      checkoutModalOpen: false,
      demoMenuOpen: false,
      checkoutForm: {
        address: '',
        city: '',
        zip: '',
        country: 'United States',
        cardName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: ''
      },
      isCheckingOut: false,
      checkoutError: '',
      bgParticles: [],
      bgAnimFrameId: null,
      bgAnimTime: 0,
      bgMouse: { x: null, y: null, active: false }
    };
  },
  computed: {
    store() {
      return store;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('popstate', this.handlePopState);
    
    // Initialize full-stack database store
    this.store.init();

    // Setup background particle canvas
    this.resizeBgCanvas();
    this.initBgParticles();
    this.tickBg();
    window.addEventListener('resize', this.resizeBgCanvas);
    window.addEventListener('mousemove', this.handleBgMouseMove);
    document.addEventListener('mouseleave', this.handleBgMouseLeave);
    
    // Set initial canvas sizing and build target shapes
    const path = window.location.pathname;
    if (path === '/admin') {
      this.showIntro = false;
      this.currentView = 'admin';
    } else if (path === '/shop') {
      this.showIntro = false;
      this.currentView = 'shop';
    } else if (path === '/about') {
      this.showIntro = false;
      this.currentView = 'about';
    } else if (path === '/dashboard') {
      this.showIntro = false;
      this.currentView = 'dashboard';
    } else {
      this.$nextTick(() => {
        this.handleResize();
        this.initParticles();
        this.tick();
        this.runIntroAnimation();
      });
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('popstate', this.handlePopState);
    window.removeEventListener('resize', this.resizeBgCanvas);
    window.removeEventListener('mousemove', this.handleBgMouseMove);
    document.removeEventListener('mouseleave', this.handleBgMouseLeave);
    
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.bgAnimFrameId) {
      cancelAnimationFrame(this.bgAnimFrameId);
    }
    this.timeouts.forEach(clearTimeout);
  },
  methods: {
    generateTargets(width, height) {
      const targets = [];
      const centerX = width / 2;
      const centerY = height / 2 - 40; // slight offset upwards for brand text spacing

      const addTarget = (x, y, color) => {
        targets.push({ x: centerX + x, y: centerY + y, color });
      };

      // 1. Bottle Outline (Blue glass color: #93c5fd)
      const outlineColor = '#93c5fd';
      
      // Neck cap top
      for (let x = -20; x <= 20; x += 3.5) {
        addTarget(x, -110, outlineColor);
        addTarget(x, -95, outlineColor);
        addTarget(x, -80, outlineColor);
      }
      // Neck lines vertical
      for (let y = -110; y <= -70; y += 4.5) {
        addTarget(-20, y, outlineColor);
        addTarget(20, y, outlineColor);
      }
      // Shoulder curves
      for (let t = 0; t <= 1.01; t += 0.05) {
        const xL = -20 - (20 * t);
        const yL = -70 + (25 * t);
        addTarget(xL, yL, outlineColor);
        const xR = 20 + (20 * t);
        const yR = -70 + (25 * t);
        addTarget(xR, yR, outlineColor);
      }
      // Body vertical walls
      for (let y = -45; y <= 90; y += 4) {
        addTarget(-40, y, outlineColor);
        addTarget(40, y, outlineColor);
      }
      // Base bottom line
      for (let x = -40; x <= 40; x += 3.5) {
        addTarget(x, 90, outlineColor);
      }

      // 2. Swirling Paint Colors (Blue paint: #2563eb, Deep blue: #1d4ed8)
      // Blue Paint Swirl 1
      for (let t = 0; t <= 1.005; t += 0.006) {
        const y = 90 - (130 * t);
        const x = Math.sin(t * Math.PI * 2.5) * 22 - 3;
        addTarget(x, y, '#2563eb');
        addTarget(x + 2, y + 1, '#2563eb');
        addTarget(x - 2, y - 1, '#2563eb');
      }
      // Deep Blue Paint Swirl 2
      for (let t = 0; t <= 1.005; t += 0.007) {
        const y = 90 - (130 * t);
        const x = -Math.sin(t * Math.PI * 2) * 18 + 5;
        addTarget(x, y, '#1d4ed8');
        addTarget(x + 2, y + 1, '#1d4ed8');
      }

      // 3. Green botanical vines (#10b981)
      for (let t = 0.1; t <= 0.9; t += 0.012) {
        const y = 80 - (110 * t);
        const x = Math.sin(t * Math.PI * 1.5) * 10 - 2;
        addTarget(x, y, '#10b981');
      }

      // 4. White Daisies
      const centers = [
        { cx: -5, cy: 50 },
        { cx: 18, cy: 10 },
        { cx: -12, cy: -20 }
      ];
      centers.forEach(({ cx, cy }) => {
        // yellow center core
        for (let r = 0; r <= 3.5; r += 1.2) {
          for (let theta = 0; theta < Math.PI * 2; theta += 1.2) {
            addTarget(cx + Math.cos(theta) * r, cy + Math.sin(theta) * r, '#fbbf24');
          }
        }
        // white petals surrounding it
        const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];
        petalAngles.forEach(angle => {
          const rad = (angle * Math.PI) / 180;
          const px = cx + Math.cos(rad) * 6;
          const py = cy + Math.sin(rad) * 6;
          for (let r = 0; r <= 2.5; r += 0.9) {
            for (let theta = 0; theta < Math.PI * 2; theta += 1.5) {
              addTarget(px + Math.cos(theta) * r, py + Math.sin(theta) * r, '#ffffff');
            }
          }
        });
      });

      // 5. Sparkling Gold stars (#fbbf24)
      const stars = [
        { sx: -22, sy: 15 },
        { sx: 18, sy: -35 }
      ];
      stars.forEach(({ sx, sy }) => {
        addTarget(sx, sy, '#fbbf24');
        addTarget(sx + 2.5, sy, '#fbbf24');
        addTarget(sx - 2.5, sy, '#fbbf24');
        addTarget(sx, sy + 2.5, '#fbbf24');
        addTarget(sx, sy - 2.5, '#fbbf24');
      });

      return targets;
    },
    handleResize() {
      const canvas = this.$refs.introCanvas;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const targets = this.generateTargets(canvas.width, canvas.height);
      if (this.particles && this.particles.length === targets.length) {
        this.particles.forEach((p, idx) => {
          p.targetX = targets[idx].x;
          p.targetY = targets[idx].y;
        });
      }
    },
    initParticles() {
      const canvas = this.$refs.introCanvas;
      if (!canvas) return;
      const targets = this.generateTargets(canvas.width, canvas.height);
      this.particles = targets.map(t => new Particle(t, canvas.width, canvas.height));
    },
    tick() {
      const canvas = this.$refs.introCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      this.animTime += 1;
      
      // Update and Draw Particles
      this.particles.forEach(p => {
        p.update(this.introMode, this.animTime);
        p.draw(ctx);
      });
      
      this.animFrameId = requestAnimationFrame(this.tick);
    },
    runIntroAnimation() {
      this.introMode = 'drift';
      this.merged = false;
      this.showText = false;
      this.triggerFadeOut = false;
      this.showIntro = true;
      this.animTime = 0;
      
      // 1. At 2.2s, transition particles from drift mode to assembly mode
      const t1 = setTimeout(() => {
        this.introMode = 'assemble';
      }, 2200);
      
      // 2. At 3.8s, trigger the final merged glow/snap pulse and show brand text
      const t2 = setTimeout(() => {
        this.merged = true;
        this.showText = true;
      }, 3800);
      
      // 3. At 5.5s, trigger preloader fade-out overlay
      const t3 = setTimeout(() => {
        this.triggerFadeOut = true;
      }, 5500);
      
      // 4. At 6.1s, hide preloader entirely
      const t4 = setTimeout(() => {
        this.showIntro = false;
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
        }
      }, 6100);
      
      this.timeouts.push(t1, t2, t3, t4);
    },
    skipIntro() {
      this.timeouts.forEach(clearTimeout);
      this.showIntro = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
      }
    },
    setView(view) {
      this.currentView = view;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Update history pathname
      const path = view === 'home' ? '/' : `/${view}`;
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
      
      if (view === 'home') {
        this.timeouts.forEach(clearTimeout);
        this.timeouts = [];
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
        }
        
        this.handleResize();
        this.initParticles();
        this.tick();
        this.runIntroAnimation();
      } else {
        this.showIntro = false;
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
        }
      }
    },
    handlePopState() {
      const path = window.location.pathname;
      if (path === '/admin') {
        this.showIntro = false;
        this.currentView = 'admin';
      } else if (path === '/shop') {
        this.showIntro = false;
        this.currentView = 'shop';
      } else if (path === '/about') {
        this.showIntro = false;
        this.currentView = 'about';
      } else if (path === '/dashboard') {
        this.showIntro = false;
        this.currentView = 'dashboard';
      } else {
        this.currentView = 'home';
      }
    },
    setCategoryFilter(category) {
      this.categoryFilter = category;
    },
    openAuth() {
      this.authModalOpen = true;
    },
    closeAuth() {
      this.authModalOpen = false;
    },
    openCheckout() {
      this.checkoutError = '';
      this.checkoutModalOpen = true;
      if (this.store.currentUser) {
        this.checkoutForm.cardName = this.store.currentUser.name;
      }
    },
    closeCheckout() {
      this.checkoutModalOpen = false;
    },
    submitCheckout() {
      const f = this.checkoutForm;
      if (!f.address.trim() || !f.city.trim() || !f.zip.trim() || !f.cardName.trim() || !f.cardNumber || !f.cardCvv) {
        this.checkoutError = 'Please fill out all shipping and payment fields.';
        return;
      }

      if (f.cardNumber.replace(/\s/g, '').length < 16) {
        this.checkoutError = 'Please enter a valid 16-digit card number.';
        return;
      }

      this.isCheckingOut = true;
      this.checkoutError = '';

      setTimeout(() => {
        const shippingDetails = {
          address: f.address.trim(),
          city: f.city.trim(),
          zip: f.zip.trim(),
          country: f.country
        };

        const res = this.store.createOrder(shippingDetails);
        this.isCheckingOut = false;

        if (res.success) {
          this.checkoutForm = {
            address: '',
            city: '',
            zip: '',
            country: 'United States',
            cardName: '',
            cardNumber: '',
            cardExpiry: '',
            cardCvv: ''
          };
          this.checkoutModalOpen = false;
          this.setView('dashboard');
        } else {
          this.checkoutError = 'Transaction failed. Please check inventory stock levels.';
        }
      }, 1500);
    },
    setDemoRole(role) {
      if (role === 'admin') {
        this.store.login('admin@kraftedlove.com', 'admin123');
        this.setView('admin');
      } else if (role === 'customer') {
        this.store.login('user@kraftedlove.com', 'user123');
        this.setView('dashboard');
      } else if (role === 'logout') {
        this.store.logout();
        this.setView('home');
      } else if (role === 'reset') {
        this.store.resetStore();
        this.setView('home');
      }
      this.demoMenuOpen = false;
    },
    handleBgMouseMove(e) {
      this.bgMouse.x = e.clientX;
      this.bgMouse.y = e.clientY;
      this.bgMouse.active = true;
    },
    handleBgMouseLeave() {
      this.bgMouse.active = false;
      this.bgMouse.x = null;
      this.bgMouse.y = null;
    },
    resizeBgCanvas() {
      const canvas = this.$refs.bgCanvas;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    initBgParticles() {
      const canvas = this.$refs.bgCanvas;
      if (!canvas) return;
      const particleCount = 100;
      this.bgParticles = Array.from({ length: particleCount }, () => new BgParticle(canvas.width, canvas.height));
    },
    tickBg() {
      const canvas = this.$refs.bgCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!this.showIntro) {
        this.bgAnimTime += 1;
        this.bgParticles.forEach(p => {
          p.update(canvas.width, canvas.height, this.bgMouse, this.bgAnimTime);
          p.draw(ctx);
        });
      }
      
      this.bgAnimFrameId = requestAnimationFrame(this.tickBg);
    }
  }
};
</script>

<style>
/* Preloader Canvas Wrapper */
.intro-preloader {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Preloader UI elements */
.brand-intro-text {
  position: absolute;
  color: white;
  text-align: center;
  animation: textFadeIn 1s ease forwards;
}

.fade-out {
  animation: screenFadeOut 0.8s ease forwards;
}

@keyframes textFadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes screenFadeOut {
  from { opacity: 1; visibility: visible; }
  to { opacity: 0; visibility: hidden; }
}
</style>
